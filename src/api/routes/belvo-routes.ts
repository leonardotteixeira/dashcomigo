/**
 * Belvo Open Finance Routes
 * Handles Brazil bank connections via Belvo API
 */

import express from 'express';
import axios from 'axios';
import PocketBase from 'pocketbase';

type Application = express.Application;
type Request = express.Request;
type Response = express.Response;

// Initialize PocketBase
const pb = new PocketBase('https://pocketbase-production-d5ae.up.railway.app');

// Initialize Belvo API client
const BELVO_ENV = process.env.BELVO_ENV || 'sandbox';
const BELVO_API_URL = BELVO_ENV === 'production'
  ? 'https://api.belvo.io'
  : 'https://sandbox.belvo.io';

// TODO: Remove hardcoded values after env vars work
const BELVO_SECRET_ID = process.env.BELVO_SECRET_ID || 'bf059dae-1b22-4426-8c9e-b2a53f09872a';
const BELVO_SECRET_PASSWORD = process.env.BELVO_SECRET_PASSWORD || 'hfz*S6xMixVc9Bh0Bhv*7#JX2znfKg4JjpFWMgMmDZV_fj-s1BEP3O3j5n1gVbRi';

console.log('[Belvo] Debug - Loaded variables:');
console.log('  BELVO_SECRET_ID:', BELVO_SECRET_ID ? '✓ (set)' : '✗ (empty)');
console.log('  BELVO_SECRET_PASSWORD:', BELVO_SECRET_PASSWORD ? '✓ (set)' : '✗ (empty)');
console.log('  All env keys with BELVO:', Object.keys(process.env).filter(k => k.includes('BELVO')));

if (!BELVO_SECRET_ID || !BELVO_SECRET_PASSWORD) {
  console.warn('⚠️ Belvo credentials not found in environment variables');
  console.warn('Please set BELVO_SECRET_ID and BELVO_SECRET_PASSWORD in .env.local');
} else {
  console.log('✅ Belvo credentials loaded successfully');
}

// Create Belvo API client with Basic Auth
const belvoClient = axios.create({
  baseURL: BELVO_API_URL,
  auth: {
    username: BELVO_SECRET_ID,
    password: BELVO_SECRET_PASSWORD,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * POST /api/belvo/create-link-token
 * Creates a Belvo Link session for user to connect their bank
 */
async function createLinkToken(req: Request, res: Response) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const response = await belvoClient.post('/api/links/', {
      institution: null, // User will select institution
      username: null,
      password: null,
      // Note: In sandbox, we'll let user select institution
    });

    const { id: linkId, access_token } = response.data;

    console.log('[Belvo] Link created:', linkId);

    return res.json({
      link_id: linkId,
      access_token: access_token,
    });
  } catch (error: any) {
    console.error('[Belvo] Error creating link:', error?.message || error);
    if (error?.response?.data) {
      console.error('[Belvo] Response data:', JSON.stringify(error.response.data, null, 2));
    }
    return res.status(500).json({
      error: 'Failed to create link token',
      details: error?.message || String(error),
      belvoError: error?.response?.data || null,
    });
  }
}

/**
 * POST /api/belvo/sync-accounts
 * Syncs user's accounts after authentication
 */
async function syncAccounts(req: Request, res: Response) {
  try {
    const { userId, linkId } = req.body;

    if (!userId || !linkId) {
      return res.status(400).json({ error: 'userId and linkId required' });
    }

    // Store link in PocketBase
    try {
      const existingLink = await pb
        .collection('belvo_connections')
        .getFirstListItem(`user_id = "${userId}"`)
        .catch(() => null);

      if (existingLink) {
        // Update existing
        await pb.collection('belvo_connections').update(existingLink.id, {
          link_id: linkId,
          connected_at: new Date().toISOString(),
          status: 'active',
        });
      } else {
        // Create new
        await pb.collection('belvo_connections').create({
          user_id: userId,
          link_id: linkId,
          connected_at: new Date().toISOString(),
          status: 'active',
        });
      }
    } catch (dbError) {
      console.warn('[Belvo] Could not store connection:', dbError);
    }

    // Get accounts from Belvo
    try {
      const accountsResponse = await belvoClient.get('/api/accounts/', {
        params: {
          link: linkId,
        },
      });

      const accounts = accountsResponse.data.results || accountsResponse.data;
      console.log(`[Belvo] Fetched ${accounts.length} accounts`);

      return res.json({
        accounts,
        synced: true,
      });
    } catch (accountError: any) {
      console.error('[Belvo] Error fetching accounts:', accountError?.message);
      return res.status(500).json({
        error: 'Failed to fetch accounts',
        details: accountError?.message,
      });
    }
  } catch (error: any) {
    console.error('[Belvo] Error syncing accounts:', error);
    return res.status(500).json({ error: 'Failed to sync accounts' });
  }
}

/**
 * POST /api/belvo/sync-transactions
 * Syncs transactions for user's connected accounts
 */
async function syncTransactions(req: Request, res: Response) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    // Get Belvo connection from PocketBase
    const connection = await pb
      .collection('belvo_connections')
      .getFirstListItem(`user_id = "${userId}"`)
      .catch(() => null);

    if (!connection || !connection.link_id) {
      return res.status(404).json({ error: 'No Belvo connection found' });
    }

    const linkId = connection.link_id;

    // Fetch transactions from Belvo
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const txnResponse = await belvoClient.get('/api/transactions/', {
        params: {
          link: linkId,
          created_at__gte: sixMonthsAgo.toISOString().split('T')[0],
        },
      });

      const transactions = txnResponse.data.results || txnResponse.data;
      console.log(`[Belvo] Fetched ${transactions.length} transactions`);

      let imported = 0;

      // Import transactions to PocketBase
      for (const txn of transactions) {
        try {
          const existing = await pb
            .collection('transactions')
            .getFirstListItem(`belvo_id = "${txn.id}"`)
            .catch(() => null);

          if (existing) {
            console.log('[Belvo] Transaction already imported:', txn.id);
            continue;
          }

          const pfpjType = classifyTransaction(txn.description, txn.amount);

          await pb.collection('transactions').create({
            user_id: userId,
            belvo_id: txn.id,
            valor: Math.abs(txn.amount),
            tipo: txn.amount < 0 ? 'saida' : 'entrada',
            categoria: mapCategory(txn.category),
            data: txn.posting_date || txn.date,
            descricao: txn.description,
            pf_pj_type: pfpjType,
            pf_pj_confidence: 75,
            pf_pj_suggested_by: 'belvo',
          });

          imported++;
          console.log('[Belvo] Imported transaction:', txn.description);
        } catch (txnError) {
          console.warn('[Belvo] Error importing transaction:', txnError);
        }
      }

      console.log(`[Belvo] Successfully imported ${imported} transactions`);

      return res.json({
        imported,
        total: transactions.length,
      });
    } catch (txnError: any) {
      console.error('[Belvo] Error fetching transactions:', txnError?.message);
      return res.status(500).json({
        error: 'Failed to fetch transactions',
        details: txnError?.message,
      });
    }
  } catch (error: any) {
    console.error('[Belvo] Error syncing transactions:', error);
    return res.status(500).json({ error: 'Failed to sync transactions' });
  }
}

/**
 * GET /api/belvo/accounts
 * Returns list of connected bank accounts
 */
async function getAccounts(req: Request, res: Response) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const connection = await pb
      .collection('belvo_connections')
      .getFirstListItem(`user_id = "${userId}"`)
      .catch(() => null);

    if (!connection || !connection.link_id) {
      return res.json({ accounts: [] });
    }

    const response = await belvoClient.get('/api/accounts/', {
      params: {
        link: connection.link_id,
      },
    });

    const accounts = (response.data.results || response.data).map((acc: any) => ({
      id: acc.id,
      name: acc.name,
      type: acc.type,
      currency: acc.currency,
      balance: {
        current: acc.balance?.current || acc.current_balance_pesos || 0,
        available: acc.balance?.available || acc.current_balance_pesos || 0,
      },
    }));

    return res.json({ accounts });
  } catch (error: any) {
    console.error('[Belvo] Error getting accounts:', error);
    return res.status(500).json({ error: 'Failed to get accounts' });
  }
}

/**
 * POST /api/belvo/disconnect
 * Revokes Belvo access
 */
async function disconnect(req: Request, res: Response) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const connection = await pb
      .collection('belvo_connections')
      .getFirstListItem(`user_id = "${userId}"`)
      .catch(() => null);

    if (connection) {
      // Update status to revoked
      await pb.collection('belvo_connections').update(connection.id, {
        status: 'revoked',
      });

      // Optionally delete the link from Belvo
      if (connection.link_id) {
        try {
          await belvoClient.delete(`/api/links/${connection.link_id}/`);
        } catch (deleteError) {
          console.warn('[Belvo] Could not delete link:', deleteError);
        }
      }
    }

    return res.json({ success: true });
  } catch (error: any) {
    console.error('[Belvo] Error disconnecting:', error);
    return res.status(500).json({ error: 'Failed to disconnect' });
  }
}

// Helper functions
function classifyTransaction(description: string, amount: number): 'pf' | 'pj' | 'misto' {
  const desc = description.toLowerCase();

  const pfKeywords = ['salário', 'salario', 'pessoal', 'retirada', 'mercado', 'supermercado', 'farmácia'];
  if (pfKeywords.some(kw => desc.includes(kw))) {
    return 'pf';
  }

  const pjKeywords = ['fornecedor', 'nota fiscal', 'cliente', 'empresa', 'aluguel', 'energia'];
  if (pjKeywords.some(kw => desc.includes(kw))) {
    return 'pj';
  }

  if (Math.abs(amount) < 100) return 'pf';
  if (Math.abs(amount) > 2000) return 'pj';

  return 'pj';
}

function mapCategory(belvoCategory: string): string {
  const categoryMap: Record<string, string> = {
    'Food and Drink': 'Alimentação',
    'Groceries': 'Alimentação',
    'Shopping': 'Compras',
    'Entertainment': 'Lazer',
    'Transport': 'Transporte',
    'Transfers': 'Transferência',
    'Utilities': 'Aluguel',
    'Rent': 'Aluguel',
    'Services': 'Serviços',
    'Fees': 'Taxas/Tarifas',
    'Salary': 'Salário',
    'Investment': 'Investimento',
  };

  return categoryMap[belvoCategory] || 'Outros';
}

/**
 * Setup Belvo routes
 */
export function setupBelvoRoutes(app: Application) {
  app.post('/api/belvo/create-link-token', createLinkToken);
  app.post('/api/belvo/sync-accounts', syncAccounts);
  app.post('/api/belvo/sync-transactions', syncTransactions);
  app.get('/api/belvo/accounts', getAccounts);
  app.post('/api/belvo/disconnect', disconnect);
}
