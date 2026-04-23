/**
 * Belvo Integration
 * Functions for Open Finance integration with Belvo
 */

export interface BelvoAccount {
  id: string;
  name: string;
  type: string;
  currency: string;
  balance: {
    current: number;
    available: number;
  };
}

export interface BelvoTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category?: string;
  posting_date?: string;
}

/**
 * Create a Belvo Link Token
 * Initiates bank connection flow
 */
export async function createBelvoLinkToken(userId: string): Promise<{ link_id: string; access_token: string }> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/belvo/create-link-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create link token');
    }

    const data = await response.json();
    return {
      link_id: data.link_id,
      access_token: data.access_token,
    };
  } catch (error) {
    console.error('[Belvo] Error creating link token:', error);
    throw error;
  }
}

/**
 * Sync accounts after user connects bank
 */
export async function syncBelvoAccounts(userId: string, linkId: string): Promise<BelvoAccount[]> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/belvo/sync-accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, linkId }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync accounts');
    }

    const data = await response.json();
    return data.accounts;
  } catch (error) {
    console.error('[Belvo] Error syncing accounts:', error);
    throw error;
  }
}

/**
 * Sync transactions from Belvo
 */
export async function syncBelvoTransactions(userId: string): Promise<number> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/belvo/sync-transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync transactions');
    }

    const data = await response.json();
    return data.imported;
  } catch (error) {
    console.error('[Belvo] Error syncing transactions:', error);
    throw error;
  }
}

/**
 * Get Belvo accounts for user
 */
export async function getBelvoAccounts(userId: string): Promise<BelvoAccount[]> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/belvo/accounts?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to get accounts');
    }

    const data = await response.json();
    return data.accounts;
  } catch (error) {
    console.error('[Belvo] Error getting accounts:', error);
    throw error;
  }
}

/**
 * Disconnect Belvo account
 */
export async function disconnectBelvoAccount(userId: string): Promise<void> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/belvo/disconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to disconnect account');
    }
  } catch (error) {
    console.error('[Belvo] Error disconnecting account:', error);
    throw error;
  }
}

/**
 * Classify transaction as PF or PJ
 */
export function classifyBelvoTransaction(
  description: string,
  category?: string,
  amount?: number
): 'PF' | 'PJ' {
  const desc = description.toLowerCase();

  const pfKeywords = ['salário', 'salario', 'pessoal', 'retirada', 'pro-labore', 'mercado', 'supermercado'];
  if (pfKeywords.some(kw => desc.includes(kw))) {
    return 'PF';
  }

  const pjKeywords = ['fornecedor', 'nota fiscal', 'cliente', 'empresa', 'comercio', 'aluguel', 'energia'];
  if (pjKeywords.some(kw => desc.includes(kw))) {
    return 'PJ';
  }

  if (amount && amount < 100) {
    return 'PF';
  }
  if (amount && amount > 2000) {
    return 'PJ';
  }

  return 'PJ';
}
