/**
 * Pluggy Client Library
 * Functions to interact with Pluggy backend routes
 */

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export async function createPluggyConnectToken(userId: string) {
  const response = await fetch(`${API_URL}/api/pluggy/create-connect-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create connect token');
  }
  return response.json();
}

export async function syncPluggyAccounts(userId: string, itemId: string, institutionId: string) {
  const response = await fetch(`${API_URL}/api/pluggy/sync-accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, itemId, institutionId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sync accounts');
  }
  return response.json();
}

export async function syncPluggyTransactions(userId: string, itemId: string) {
  const response = await fetch(`${API_URL}/api/pluggy/sync-transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, itemId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sync transactions');
  }
  return response.json();
}

export async function syncPluggyInvestments(userId: string, itemId: string) {
  const response = await fetch(`${API_URL}/api/pluggy/sync-investments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, itemId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sync investments');
  }
  return response.json();
}

export async function getPluggyStatus(userId: string) {
  const response = await fetch(`${API_URL}/api/pluggy/status?userId=${userId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get status');
  }
  return response.json();
}

export async function resyncPluggyUser(userId: string, itemId?: string | null) {
  const response = await fetch(`${API_URL}/api/pluggy/resync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, itemId: itemId || null }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to resync');
  }
  return response.json();
}

export async function disconnectPluggyAccount(userId: string) {
  const response = await fetch(`${API_URL}/api/pluggy/disconnect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to disconnect');
  }
  return response.json();
}
