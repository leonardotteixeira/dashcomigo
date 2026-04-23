/**
 * Pluggy Open Finance Routes
 * Handles Brazil bank connections via Pluggy
 *
 * Pipeline: Ingestão → Normalização → Classificação → PocketBase
 */

import express from 'express';
import { PluggyClient } from 'pluggy-sdk';
import PocketBase from 'pocketbase';

type Request = express.Request;
type Response = express.Response;

const pb = new PocketBase('https://pocketbase-production-d5ae.up.railway.app');

function getPluggyClient() {
  const clientId = process.env.PLUGGY_CLIENT_ID || '';
  const clientSecret = process.env.PLUGGY_CLIENT_SECRET || '';

  if (!clientId || !clientSecret) {
    console.warn('⚠️ Pluggy credentials not found');
  } else {
    console.log('✅ Pluggy credentials loaded');
  }

  return new PluggyClient({ clientId, clientSecret });
}

// ─────────────────────────────────────────────
// 1. NORMALIZAÇÃO: Pluggy → formato interno
// ─────────────────────────────────────────────

function normalizeTransaction(txn: any, userId: string): Record<string, any> {
  const amount = txn.amount ?? 0;
  const isOutgoing = amount < 0;

  return {
    user_id: userId,
    pluggy_id: txn.id,
    valor: Math.abs(amount),
    tipo: isOutgoing ? 'saida' : 'entrada',
    categoria: mapCategory(txn.category),
    data: txn.date || txn.postDate || new Date().toISOString().split('T')[0],
    descricao: txn.description || txn.merchant?.name || 'Sem descrição',
    pf_pj_type: classifyPFPJ(txn.description || '', amount),
    pf_pj_confidence: 70,
    pf_pj_suggested_by: 'pluggy',
  };
}

// ─────────────────────────────────────────────
// 2. CLASSIFICAÇÃO: PF vs PJ
// ─────────────────────────────────────────────

function classifyPFPJ(description: string, amount: number): 'pf' | 'pj' | 'misto' {
  const desc = description.toLowerCase();

  const pfKeywords = ['salário', 'salario', 'pessoal', 'retirada', 'mercado', 'farmácia', 'restaurante', 'supermercado'];
  if (pfKeywords.some(kw => desc.includes(kw))) return 'pf';

  const pjKeywords = ['fornecedor', 'nota fiscal', 'nf-e', 'empresa', 'serviço', 'cliente', 'fatura', 'cnpj'];
  if (pjKeywords.some(kw => desc.includes(kw))) return 'pj';

  if (Math.abs(amount) < 100) return 'pf';
  if (Math.abs(amount) > 2000) return 'pj';

  return 'pj';
}

// ─────────────────────────────────────────────
// 3. MAPEAMENTO DE CATEGORIAS
// ─────────────────────────────────────────────

function mapCategory(pluggyCategory: string | null | undefined): string {
  if (!pluggyCategory) return 'Outros';

  const map: Record<string, string> = {
    'FOOD_AND_DRINK': 'Alimentação',
    'GROCERIES': 'Alimentação',
    'SHOPPING': 'Compras',
    'ENTERTAINMENT': 'Lazer',
    'TRANSPORT': 'Transporte',
    'TRANSFER': 'Transferência',
    'UTILITIES': 'Aluguel',
    'RENT': 'Aluguel',
    'SERVICES': 'Serviços',
    'FEES': 'Taxas/Tarifas',
    'SALARY': 'Salário',
    'INVESTMENT': 'Investimento',
    'HEALTH': 'Saúde',
    'EDUCATION': 'Educação',
    'TRAVEL': 'Viagem',
  };

  const key = pluggyCategory.toUpperCase().replace(/\s+/g, '_');
  return map[key] || 'Outros';
}

// ─────────────────────────────────────────────
// 4. INGESTÃO: Salva transações (idempotente)
// ─────────────────────────────────────────────

async function ingestTransactions(userId: string, transactions: any[]): Promise<{ imported: number; skipped: number }> {
  let imported = 0;
  let skipped = 0;

  for (const txn of transactions) {
    try {
      // Idempotência: pula se já importou (tenta por pluggy_id, mas pode não existir o campo)
      const existing = await pb
        .collection('transactions')
        .getFirstListItem(`pluggy_id = "${txn.id}"`)
        .catch(() => null);

      if (existing) {
        skipped++;
        continue;
      }

      const normalized = normalizeTransaction(txn, userId);

      // Tenta com todos os campos primeiro
      try {
        await pb.collection('transactions').create(normalized);
      } catch {
        // Fallback: cria apenas com campos básicos (se campos extras não existirem)
        await pb.collection('transactions').create({
          user_id: normalized.user_id,
          valor: normalized.valor,
          tipo: normalized.tipo,
          categoria: normalized.categoria,
          data: normalized.data,
          descricao: normalized.descricao,
        });
      }

      // Distribuir para payables/receivables
      await distributeTransaction(normalized, userId);

      imported++;
    } catch (err) {
      console.warn('[Pluggy] Error importing transaction:', txn.id, err);
    }
  }

  return { imported, skipped };
}

/**
 * Distribui transação para payables ou receivables conforme tipo
 */
async function distributeTransaction(txn: Record<string, any>, userId: string) {
  try {
    if (txn.tipo === 'saida' && txn.valor >= 50) {
      const existing = await pb
        .collection('payables')
        .getFirstListItem(`pluggy_id = "${txn.pluggy_id}"`)
        .catch(() => null);

      if (!existing) {
        await pb.collection('payables').create({
          userid: userId,        // campo correto da collection
          pluggy_id: txn.pluggy_id || '',
          descricao: txn.descricao,
          valor: txn.valor,
          categoria: txn.categoria,
          data_vencimento: txn.data,
          status: 'pago',
        }).catch(() => {});
      }
    }

    if (txn.tipo === 'entrada' && txn.valor >= 50) {
      const existing = await pb
        .collection('receivables')
        .getFirstListItem(`pluggy_id = "${txn.pluggy_id}"`)
        .catch(() => null);

      if (!existing) {
        await pb.collection('receivables').create({
          userid: userId,        // campo correto da collection
          pluggy_id: txn.pluggy_id || '',
          descricao: txn.descricao,
          valor: txn.valor,
          categoria: txn.categoria,
          data_vencimento: txn.data,
          status: 'recebido',
        }).catch(() => {});
      }
    }
  } catch (err) {
    // Distribuição é best-effort, não bloqueia
    console.warn('[Pluggy] Could not distribute transaction:', err);
  }
}

// ─────────────────────────────────────────────
// ROTAS
// ─────────────────────────────────────────────

/**
 * POST /api/pluggy/create-connect-token
 */
async function createConnectToken(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const pluggy = getPluggyClient();
    const connectToken = await pluggy.createConnectToken(undefined, {
      clientUserId: userId,
    });

    console.log('[Pluggy] Connect token created:', connectToken.accessToken.substring(0, 20) + '...');
    return res.json({ access_token: connectToken.accessToken });
  } catch (error: any) {
    console.error('[Pluggy] Error creating connect token:', error?.message);
    return res.status(500).json({ error: 'Failed to create connect token', details: error?.message });
  }
}

/**
 * POST /api/pluggy/sync-accounts
 * Salva conexão + marca open_finance_connected = true
 */
async function syncAccounts(req: Request, res: Response) {
  try {
    const { userId, itemId, institutionId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    // Garantir que userId é string simples
    const userIdStr = String(userId);

    // Verifica se já existe conexão ativa (idempotência)
    const existing = await pb
      .collection('pluggy_connections')
      .getFirstListItem(`user_id = "${userIdStr}" && status = "active"`)
      .catch(() => null);

    const connectionData: Record<string, any> = {
      institution_id: institutionId || '',
      connected_at: new Date().toISOString(),
      status: 'active',
    };

    // item_id é opcional - só adiciona se o campo existir na collection
    if (itemId) connectionData.item_id = itemId;

    if (existing) {
      await pb.collection('pluggy_connections').update(existing.id, connectionData);
      console.log('[Pluggy] Updated existing connection for user:', userId);
    } else {
      await pb.collection('pluggy_connections').create({
        user_id: userIdStr,
        ...connectionData,
      });
      console.log('[Pluggy] New connection saved for user:', userIdStr);
    }

    // Marca open_finance_connected = true no perfil
    try {
      const profile = await pb
        .collection('profiles')
        .getFirstListItem(`user_id = "${userIdStr}"`)
        .catch(() => null);

      if (profile) {
        await pb.collection('profiles').update(profile.id, {
          open_finance_connected: true,
        });
        console.log('[Pluggy] Marked open_finance_connected=true for user:', userId);
      }
    } catch (profileErr) {
      console.warn('[Pluggy] Could not update profile flag:', profileErr);
    }

    return res.json({ success: true, message: 'Connection saved' });
  } catch (error: any) {
    console.error('[Pluggy] Error syncing accounts:', error);
    return res.status(500).json({ error: 'Failed to sync accounts' });
  }
}

/**
 * POST /api/pluggy/sync-transactions
 * Busca, normaliza e classifica transações do Pluggy
 */
async function syncTransactions(req: Request, res: Response) {
  try {
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
      return res.status(400).json({ error: 'userId and itemId required' });
    }

    const pluggy = getPluggyClient();

    // Busca accounts do item
    const accounts = await pluggy.fetchAccounts(itemId);
    console.log(`[Pluggy] Found ${accounts.total} accounts for item ${itemId}`);

    let totalImported = 0;
    let totalSkipped = 0;

    // Para cada conta, busca transações dos últimos 6 meses
    for (const account of accounts.results) {
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const txnResponse = await pluggy.fetchTransactions(account.id, {
          from: sixMonthsAgo.toISOString().split('T')[0],
        });

        const transactions = txnResponse.results || [];
        console.log(`[Pluggy] Account ${account.id}: ${transactions.length} transactions`);

        const { imported, skipped } = await ingestTransactions(userId, transactions);
        totalImported += imported;
        totalSkipped += skipped;
      } catch (accountErr: any) {
        console.warn(`[Pluggy] Error fetching transactions for account ${account.id}:`, accountErr?.message);
      }
    }

    console.log(`[Pluggy] Sync complete: ${totalImported} imported, ${totalSkipped} skipped`);

    return res.json({
      success: true,
      imported: totalImported,
      skipped: totalSkipped,
      accounts: accounts.total,
    });
  } catch (error: any) {
    console.error('[Pluggy] Error syncing transactions:', error?.message);
    return res.status(500).json({ error: 'Failed to sync transactions', details: error?.message });
  }
}

/**
 * GET /api/pluggy/status
 * Verifica se usuário tem Open Finance conectado
 */
async function getStatus(req: Request, res: Response) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const connection = await pb
      .collection('pluggy_connections')
      .getFirstListItem(`user_id = "${userId}" && status = "active"`)
      .catch(() => null);

    return res.json({
      connected: !!connection,
      connectedAt: connection?.connected_at || null,
      institutionId: connection?.institution_id || null,
    });
  } catch (error: any) {
    console.error('[Pluggy] Error getting status:', error);
    return res.status(500).json({ error: 'Failed to get status' });
  }
}

/**
 * POST /api/pluggy/disconnect
 */
async function disconnect(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const connection = await pb
      .collection('pluggy_connections')
      .getFirstListItem(`user_id = "${userId}"`)
      .catch(() => null);

    if (connection) {
      await pb.collection('pluggy_connections').update(connection.id, { status: 'revoked' });
    }

    // Remove flag do perfil
    try {
      const profile = await pb
        .collection('profiles')
        .getFirstListItem(`user_id = "${userId}"`)
        .catch(() => null);

      if (profile) {
        await pb.collection('profiles').update(profile.id, { open_finance_connected: false });
      }
    } catch {}

    return res.json({ success: true });
  } catch (error: any) {
    console.error('[Pluggy] Error disconnecting:', error);
    return res.status(500).json({ error: 'Failed to disconnect' });
  }
}

/**
 * POST /api/pluggy/sync-investments
 * Busca e persiste investimentos do usuário via Pluggy
 */
async function syncInvestments(req: Request, res: Response) {
  try {
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
      return res.status(400).json({ error: 'userId and itemId required' });
    }

    const pluggy = getPluggyClient();

    const investmentsResponse = await pluggy.fetchInvestments(itemId);
    const investments = investmentsResponse.results || [];
    console.log(`[Pluggy] Found ${investments.length} investments for item ${itemId}`);

    let imported = 0;
    let skipped = 0;

    for (const inv of investments) {
      try {
        const mappedType = mapInvestmentType(inv.type);
        const invName = (inv.name || 'Investimento').replace(/"/g, '\\"');
        const currentValue = inv.value ?? 0;
        const investedAmount = inv.amount ?? 0;

        // Idempotência por pluggy_id OU por (user_id + nome + tipo)
        // Isso evita duplicatas quando o mesmo banco é conectado várias vezes
        const existing = await pb
          .collection('investments')
          .getFirstListItem(
            `(pluggy_id = "${inv.id}") || (user_id = "${userId}" && name = "${invName}" && type = "${mappedType}")`
          )
          .catch(() => null);

        if (existing) {
          // Sempre atualiza para o valor mais recente
          await pb.collection('investments').update(existing.id, {
            pluggy_id: inv.id, // atualiza pluggy_id se necessário
            current_value: currentValue,
            invested_amount: investedAmount > 0 ? investedAmount : existing.invested_amount,
            subtype: inv.subtype || existing.subtype || '',
            last_updated: new Date().toISOString(),
            status: 'active',
          });
          skipped++;
          continue;
        }

        await pb.collection('investments').create({
          user_id: userId,
          pluggy_id: inv.id,
          name: inv.name || 'Investimento',
          type: mappedType,
          subtype: inv.subtype || '',
          invested_amount: investedAmount,
          current_value: currentValue,
          quantity: inv.quantity ?? 1,
          currency: inv.currencyCode || 'BRL',
          institution: inv.institutionNumber || '',
          last_updated: new Date().toISOString(),
          status: 'active',
        });

        imported++;
      } catch (err) {
        console.warn('[Pluggy] Error importing investment:', inv.id, err);
      }
    }

    console.log(`[Pluggy] Investments sync: ${imported} imported, ${skipped} updated`);

    return res.json({
      success: true,
      imported,
      updated: skipped,
      total: investments.length,
    });
  } catch (error: any) {
    console.error('[Pluggy] Error syncing investments:', error?.message);
    return res.status(500).json({ error: 'Failed to sync investments', details: error?.message });
  }
}

function mapInvestmentType(pluggyType: string | null | undefined): string {
  const map: Record<string, string> = {
    'FIXED_INCOME': 'Renda Fixa',
    'EQUITY': 'Ações',
    'MUTUAL_FUND': 'Fundo de Investimento',
    'SECURITY': 'Título',
    'ETF': 'ETF',
    'COE': 'COE',
    'REAL_ESTATE': 'FII',
    'CRYPTOCURRENCY': 'Criptomoeda',
    'PENSION': 'Previdência',
  };
  if (!pluggyType) return 'Outros';
  return map[pluggyType.toUpperCase()] || 'Outros';
}

/**
 * POST /api/pluggy/resync
 * Re-sincroniza investimentos e transações usando o itemId salvo no PocketBase.
 * Não precisa que o frontend saiba o itemId.
 */
async function resyncUser(req: Request, res: Response) {
  try {
    const { userId, itemId: bodyItemId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const pluggy = getPluggyClient();

    // Prioridade: 1) itemId do body (localStorage), 2) PocketBase, 3) erro
    let itemId: string | null = bodyItemId || null;

    if (!itemId) {
      // Tenta buscar item_id do PocketBase
      const connection = await pb
        .collection('pluggy_connections')
        .getFirstListItem(`user_id = "${userId}" && status = "active"`)
        .catch(() => null);

      if (connection?.item_id) {
        itemId = connection.item_id;
      }
    }

    if (!itemId) {
      return res.status(400).json({
        error: 'itemIdMissing',
        message: 'Item ID não encontrado. Reconecte seu banco pelo Dashboard.',
      });
    }

    console.log('[Pluggy] Resync starting for user:', userId, 'itemId:', itemId);

    // Sync investments
    const investmentsResponse = await pluggy.fetchInvestments(itemId);
    const investments = investmentsResponse.results || [];
    let invImported = 0, invSkipped = 0;

    for (const inv of investments) {
      try {
        const mappedType = mapInvestmentType(inv.type);
        const invName = (inv.name || 'Investimento').replace(/"/g, '\\"');
        const currentValue = inv.value ?? 0;
        const investedAmount = inv.amount ?? 0;

        const existing = await pb
          .collection('investments')
          .getFirstListItem(
            `(pluggy_id = "${inv.id}") || (user_id = "${userId}" && name = "${invName}" && type = "${mappedType}")`
          )
          .catch(() => null);

        if (existing) {
          await pb.collection('investments').update(existing.id, {
            pluggy_id: inv.id,
            current_value: currentValue,
            invested_amount: investedAmount > 0 ? investedAmount : existing.invested_amount,
            subtype: inv.subtype || existing.subtype || '',
            last_updated: new Date().toISOString(),
            status: 'active',
          });
          invSkipped++;
        } else {
          await pb.collection('investments').create({
            user_id: userId,
            pluggy_id: inv.id,
            name: inv.name || 'Investimento',
            type: mappedType,
            subtype: inv.subtype || '',
            invested_amount: investedAmount,
            current_value: currentValue,
            quantity: inv.quantity ?? 1,
            currency: inv.currencyCode || 'BRL',
            institution: inv.institutionNumber || '',
            last_updated: new Date().toISOString(),
            status: 'active',
          });
          invImported++;
        }
      } catch (err) {
        console.warn('[Pluggy] Resync error for investment:', inv.id, err);
      }
    }

    // Sync transactions
    const accounts = await pluggy.fetchAccounts(itemId);
    let txImported = 0, txSkipped = 0;

    for (const account of accounts.results) {
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const txnResponse = await pluggy.fetchTransactions(account.id, {
          from: sixMonthsAgo.toISOString().split('T')[0],
        });
        const { imported, skipped } = await ingestTransactions(userId, txnResponse.results || []);
        txImported += imported;
        txSkipped += skipped;
      } catch {}
    }

    console.log(`[Pluggy] Resync complete — investments: ${invImported} new, ${invSkipped} updated | transactions: ${txImported} new`);

    return res.json({
      success: true,
      investments: { imported: invImported, updated: invSkipped, total: investments.length },
      transactions: { imported: txImported, skipped: txSkipped },
    });
  } catch (error: any) {
    console.error('[Pluggy] Resync error:', error?.message);
    return res.status(500).json({ error: 'Failed to resync', details: error?.message });
  }
}

export function setupPluggyRoutes(app: express.Application) {
  app.post('/api/pluggy/create-connect-token', createConnectToken);
  app.post('/api/pluggy/sync-accounts', syncAccounts);
  app.post('/api/pluggy/sync-transactions', syncTransactions);
  app.post('/api/pluggy/sync-investments', syncInvestments);
  app.post('/api/pluggy/resync', resyncUser);
  app.get('/api/pluggy/status', getStatus);
  app.post('/api/pluggy/disconnect', disconnect);
}
