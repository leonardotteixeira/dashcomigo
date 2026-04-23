/**
 * Express Server for Plaid Integration
 * Run with: node server.js
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import PocketBase from 'pocketbase';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize PocketBase
const pb = new PocketBase('https://pocketbase-production-d5ae.up.railway.app');

// Initialize Plaid
const PLAID_CLIENT_ID = process.env.VITE_PLAID_CLIENT_ID || process.env.PLAID_CLIENT_ID || '';
const PLAID_SECRET = process.env.PLAID_SECRET || '';

if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
  console.warn('⚠️ Plaid credentials not found in environment variables');
  console.warn('Please set VITE_PLAID_CLIENT_ID and PLAID_SECRET in .env.local');
}

const configuration = new Configuration({
  basePath: 'https://sandbox.plaid.com',
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Plaid Routes

// POST /api/plaid/create-link-token
app.post('/api/plaid/create-link-token', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: 'Dashcomigo',
      language: 'en',
      country_codes: ['US'],
      products: ['auth', 'transactions'],
    });

    console.log('[Plaid] Link token created:', response.data.link_token);

    return res.json({
      link_token: response.data.link_token,
      expiration: response.data.expiration,
    });
  } catch (error) {
    console.error('[Plaid] Error creating link token:', error?.message || error);
    if (error?.response?.data) {
      console.error('[Plaid] Response data:', JSON.stringify(error.response.data, null, 2));
    }
    return res.status(500).json({
      error: 'Failed to create link token',
      details: error?.message || String(error),
      plaidError: error?.response?.data || null
    });
  }
});

// POST /api/plaid/exchange-token
app.post('/api/plaid/exchange-token', async (req, res) => {
  try {
    const { publicToken, userId } = req.body;

    if (!publicToken || !userId) {
      return res.status(400).json({ error: 'publicToken and userId required' });
    }

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    console.log('[Plaid] Token exchanged, item_id:', itemId);

    // Store in PocketBase
    try {
      await pb.collection('plaid_connections').create({
        user_id: userId,
        item_id: itemId,
        access_token: accessToken,
        connected_at: new Date().toISOString(),
      });
    } catch (dbError) {
      console.warn('[Plaid] Could not store connection:', dbError);
    }

    return res.json({
      access_token: accessToken,
      item_id: itemId,
    });
  } catch (error) {
    console.error('[Plaid] Error exchanging token:', error);
    return res.status(500).json({ error: 'Failed to exchange token' });
  }
});

// POST /api/plaid/sync-transactions
app.post('/api/plaid/sync-transactions', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const connection = await pb
      .collection('plaid_connections')
      .getFirstListItem(`user_id = "${userId}"`)
      .catch(() => null);

    if (!connection) {
      return res.status(404).json({ error: 'No Plaid connection found' });
    }

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

    let imported = 0;
    for (const txn of transactions) {
      try {
        const existing = await pb
          .collection('transactions')
          .getFirstListItem(`plaid_id = "${txn.transaction_id}"`)
          .catch(() => null);

        if (existing) {
          console.log('[Plaid] Transaction already imported:', txn.transaction_id);
          continue;
        }

        const pfpjType = classifyTransaction(txn.name, txn.amount);

        await pb.collection('transactions').create({
          user_id: userId,
          plaid_id: txn.transaction_id,
          valor: Math.abs(txn.amount),
          tipo: txn.amount < 0 ? 'saida' : 'entrada',
          categoria: mapCategory(txn.personal_finance_category?.primary),
          data: txn.date,
          descricao: txn.name,
          pf_pj_type: pfpjType,
          pfpj_score: 75,
          pf_pj_suggested_by: 'plaid',
        });

        imported++;
        console.log('[Plaid] Imported transaction:', txn.name);
      } catch (txnError) {
        console.warn('[Plaid] Error importing transaction:', txnError);
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
});

// GET /api/plaid/accounts
app.get('/api/plaid/accounts', async (req, res) => {
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

    const response = await plaidClient.accountsGet({
      access_token: connection.access_token,
    });

    const accounts = response.data.accounts.map((acc) => ({
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
});

// POST /api/plaid/disconnect
app.post('/api/plaid/disconnect', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

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
});

// Helper functions
function classifyTransaction(description, amount) {
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

function mapCategory(plaidCategory) {
  const categoryMap = {
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Plaid routes at http://localhost:${PORT}/api/plaid`);
});
