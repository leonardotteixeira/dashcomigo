/**
 * Plaid Integration
 * Functions for Open Finance integration with Plaid
 */

import { pb } from './pocketbase';

export interface PlaidTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  merchant_name?: string;
  personal_finance_category?: {
    primary: string;
    detailed: string;
  };
}

export interface PlaidAccount {
  account_id: string;
  name: string;
  subtype: string;
  type: string;
  balances: {
    current: number;
    available: number;
    limit?: number;
  };
}

/**
 * Create a Plaid Link Token
 * Called from backend API
 */
export async function createPlaidLinkToken(userId: string): Promise<string> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/plaid/create-link-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create link token');
    }

    const data = await response.json();
    return data.link_token;
  } catch (error) {
    console.error('[Plaid] Error creating link token:', error);
    throw error;
  }
}

/**
 * Exchange Public Token for Access Token
 * Called after successful Plaid Link flow
 */
export async function exchangePublicToken(publicToken: string, userId: string): Promise<string> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/plaid/exchange-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicToken, userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('[Plaid] Error exchanging token:', error);
    throw error;
  }
}

/**
 * Sync transactions from Plaid
 * Imports bank transactions into Dashcomigo
 */
export async function syncPlaidTransactions(userId: string): Promise<number> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/plaid/sync-transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync transactions');
    }

    const data = await response.json();
    return data.imported; // number of transactions imported
  } catch (error) {
    console.error('[Plaid] Error syncing transactions:', error);
    throw error;
  }
}

/**
 * Get Plaid accounts for user
 * Returns list of connected bank accounts
 */
export async function getPlaidAccounts(userId: string): Promise<PlaidAccount[]> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/plaid/accounts?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to get accounts');
    }

    const data = await response.json();
    return data.accounts;
  } catch (error) {
    console.error('[Plaid] Error getting accounts:', error);
    throw error;
  }
}

/**
 * Disconnect Plaid account
 * Revoke access to bank data
 */
export async function disconnectPlaidAccount(userId: string, itemId: string): Promise<void> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/plaid/disconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, itemId }),
    });

    if (!response.ok) {
      throw new Error('Failed to disconnect account');
    }
  } catch (error) {
    console.error('[Plaid] Error disconnecting account:', error);
    throw error;
  }
}

/**
 * Classify Plaid transaction as PF or PJ
 * Uses description and category to determine type
 */
export function classifyPlaidTransaction(
  description: string,
  category?: string,
  amount?: number
): 'PF' | 'PJ' {
  const desc = description.toLowerCase();

  // PF keywords
  const pfKeywords = ['salário', 'salario', 'pessoal', 'retirada', 'pro-labore', 'mercado', 'supermercado'];
  if (pfKeywords.some(kw => desc.includes(kw))) {
    return 'PF';
  }

  // PJ keywords
  const pjKeywords = ['fornecedor', 'nota fiscal', 'cliente', 'empresa', 'comercio', 'aluguel', 'energia', 'internet'];
  if (pjKeywords.some(kw => desc.includes(kw))) {
    return 'PJ';
  }

  // Amount-based heuristics
  if (amount && amount < 100) {
    return 'PF'; // Small amounts likely personal
  }
  if (amount && amount > 2000) {
    return 'PJ'; // Large amounts likely business
  }

  // Default to PJ for business context
  return 'PJ';
}

/**
 * Map Plaid category to Dashcomigo category
 */
export function mapPlaidCategory(plaidCategory?: string): string {
  if (!plaidCategory) return 'Outros';

  const categoryMap: Record<string, string> = {
    'FOOD_AND_DRINK': 'Alimentação',
    'SHOPPING': 'Compras',
    'ENTERTAINMENT': 'Lazer',
    'TRANSFER': 'Transferência',
    'PAYMENT': 'Pagamento',
    'FEES': 'Taxas/Tarifas',
    'BUSINESS_SERVICES': 'Serviços',
    'PERSONAL_SERVICES': 'Serviços Pessoais',
    'TRANSPORTATION': 'Transporte',
    'TRAVEL': 'Viagem',
    'RENT_AND_UTILITIES': 'Aluguel/Utilidades',
  };

  return categoryMap[plaidCategory] || 'Outros';
}
