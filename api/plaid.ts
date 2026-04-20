/**
 * Plaid API Routes
 * Backend integration for Open Finance
 *
 * Ensure you have these environment variables:
 * - PLAID_CLIENT_ID
 * - PLAID_SECRET
 * - PLAID_ENV=sandbox (or production)
 */

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { pb } from '../src/lib/pocketbase';

// Initialize Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments.Sandbox, // Use 'Production' in production
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.VITE_PLAID_CLIENT_ID || '',
      'PLAID-SECRET': process.env.PLAID_SECRET || '',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

/**
 * POST /api/plaid/create-link-token
 * Create a Plaid Link Token for frontend
 */
export async function createLinkToken(req: any, res: any) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'Dashcomigo',
      language: 'pt-BR',
      country_codes: ['BR'],
      products: ['auth', 'transactions'],
    });

    console.log('[Plaid] Link token created:', response.data.link_token);

    return res.json({
      link_token: response.data.link_token,
      expiration: response.data.expiration,
    });
  } catch (error) {
    console.error('[Plaid] Error creating link token:', error);
    return res.status(500).json({ error: 'Failed to create link token' });
  }
}

/**
 * POST /api/plaid/exchange-token
 * Exchange public token for access token and item ID
 */
export async function exchangeToken(req: any, res: any) {
  try {
    const { publicToken, userId } = req.body;

    if (!publicToken || !userId) {
      return res.status(400).json({ error: 'publicToken and userId required' });
    }

    // Exchange for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    console.log('[Plaid] Token exchanged, item_id:', itemId);

    // Store in PocketBase for later use
    try {
      await pb.collection('plaid_connections').create({
        user_id: userId,
        item_id: itemId,
        access_token: accessToken, // Store encrypted in production!
        connected_at: new Date(),
      });
    } catch (dbError) {
      console.warn('[Plaid] Could not store connection:', dbError);
      // Continue anyway, token is still valid
    }

    return res.json({
      access_token: accessToken,
      item_id: itemId,
    });
  } catch (error) {
    console.error('[Plaid] Error exchanging token:', error);
    return res.status(500).json({ error: 'Failed to exchange token' });
  }
}

/**
 * POST /api/plaid/sync-transactions
 * Sync transactions from Plaid to Dashcomigo
 */
export async function syncTransactions(req: any, res: any) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    // Get access token from PocketBase
    const connection = await pb
      .collection('plaid_connections')
      .getFirstListItem(`user_id = "${userId}"`)
      .catch(() => null);

    if (!connection) {
      return res.status(404).json({ error: 'No Plaid connection found' });
    }

    // Get transactions
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));

    const txnResponse = await plaidClient.transactionsGet({
      access_token: connection.access_token,
      start_date: sixMonthsAgo.toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      options: {
        include_personal_finance_category: true,
      },
    });

    const transactions = txnResponse.data.transactions;
    console.log(`[Plaid] Fetched ${transactions.length} transactions`);

    // Import to Dashcomigo
    let imported = 0;
    for (const txn of transactions) {
      try {
        // Skip if already exists (by Plaid transaction_id)
        const existing = await pb
          .collection('transactions')
          .getFirstListItem(`plaid_id = "${txn.transaction_id}"`)
          .catch(() => null);

        if (existing) {
          console.log('[Plaid] Transaction already imported:', txn.transaction_id);
          continue;
        }

        // Classify PF/PJ
        const pfpjType = classifyTransaction(txn.name, txn.amount);

        // Create transaction in Dashcomigo
        await pb.collection('transactions').create({
          user_id: userId,
          plaid_id: txn.transaction_id,
          valor: Math.abs(txn.amount),
          tipo: txn.amount < 0 ? 'saida' : 'entrada',
          categoria: mapCategory(txn.personal_finance_category?.primary),
          data: txn.date,
          descricao: txn.name,
          pf_pj_type: pfpjType,
          pf_pj_confidence: 75, // Medium confidence for auto-imported
          pf_pj_suggested_by: 'plaid',
        });

        imported++;
        console.log('[Plaid] Imported transaction:', txn.name);
      } catch (txnError) {
        console.warn('[Plaid] Error importing transaction:', txnError);
        // Continue with next transaction
      }
    }

    console.log(`[Plaid] Successfully imported ${imported} transactions`);

    return res.json({
      imported,
      total: transactions.length,
    });
  } catch (error) {
    console.error('[Plaid] Error syncing transactions:', error);
    return res.status(500).json({ error: 'Failed to sync transactions' });
  }
}

/**
 * GET /api/plaid/accounts
 * Get list of connected accounts
 */
export async function getAccounts(req: any, res: any) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const connection = await pb
      .collection('plaid_connections')
      .getFirstListItem(`user_id = "${userId}"`)
      .catch(() => null);

    if (!connection) {
      return res.json({ accounts: [] });
    }

    // Get accounts from Plaid
    const response = await plaidClient.accountsGet({
      access_token: connection.access_token,
    });

    const accounts = response.data.accounts.map((acc: any) => ({
      account_id: acc.account_id,
      name: acc.name,
      type: acc.type,
      subtype: acc.subtype,
      balances: {
        current: acc.balances.current,
        available: acc.balances.available,
        limit: acc.balances.limit,
      },
    }));

    return res.json({ accounts });
  } catch (error) {
    console.error('[Plaid] Error getting accounts:', error);
    return res.status(500).json({ error: 'Failed to get accounts' });
  }
}

/**
 * POST /api/plaid/disconnect
 * Revoke Plaid access
 */
export async function disconnect(req: any, res: any) {
  try {
    const { userId, itemId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    // Delete from PocketBase
    const connection = await pb
      .collection('plaid_connections')
      .getFirstListItem(`user_id = "${userId}"`)
      .catch(() => null);

    if (connection) {
      await pb.collection('plaid_connections').delete(connection.id);
    }

    return res.json({ success: true });
  } catch (error) {
    console.error('[Plaid] Error disconnecting:', error);
    return res.status(500).json({ error: 'Failed to disconnect' });
  }
}

// Helper functions

function classifyTransaction(description: string, amount: number): 'PF' | 'PJ' {
  const desc = description.toLowerCase();

  // PF keywords
  const pfKeywords = ['salário', 'salario', 'pessoal', 'retirada', 'mercado', 'supermercado', 'farmácia'];
  if (pfKeywords.some(kw => desc.includes(kw))) {
    return 'PF';
  }

  // PJ keywords
  const pjKeywords = ['fornecedor', 'nota fiscal', 'cliente', 'empresa', 'aluguel', 'energia'];
  if (pjKeywords.some(kw => desc.includes(kw))) {
    return 'PJ';
  }

  // Amount-based
  if (Math.abs(amount) < 100) return 'PF';
  if (Math.abs(amount) > 2000) return 'PJ';

  return 'PJ';
}

function mapCategory(plaidCategory?: string): string {
  const categoryMap: Record<string, string> = {
    'FOOD_AND_DRINK': 'Alimentação',
    'SHOPPING': 'Compras',
    'TRANSPORTATION': 'Transporte',
    'TRANSFER': 'Transferência',
    'PAYMENT': 'Pagamento',
    'FEES': 'Taxas/Tarifas',
    'BUSINESS_SERVICES': 'Serviços',
    'RENT_AND_UTILITIES': 'Aluguel',
  };

  return categoryMap[plaidCategory || ''] || 'Outros';
}
