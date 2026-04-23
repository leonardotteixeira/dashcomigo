/**
 * Hook para verificar status da conexão Open Finance
 * Consulta diretamente o PocketBase — não depende do backend local
 */

import { useState, useEffect, useCallback } from 'react';
import { pb } from '../../lib/pocketbase';

interface OpenFinanceStatus {
  connected: boolean;
  connectedAt: string | null;
  itemId: string | null;
  loading: boolean;
  refresh: () => void;
}

export function useOpenFinanceStatus(userId: string | undefined): OpenFinanceStatus {
  const [connected, setConnected] = useState(false);
  const [connectedAt, setConnectedAt] = useState<string | null>(null);
  const [itemId, setItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Consulta direto no PocketBase — sempre funciona mesmo sem backend
      const connection = await pb
        .collection('pluggy_connections')
        .getFirstListItem(`user_id = "${userId}" && status = "active"`)
        .catch(() => null);

      setConnected(!!connection);
      setConnectedAt(connection?.connected_at || null);
      setItemId(connection?.item_id || null);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return { connected, connectedAt, itemId, loading, refresh: checkStatus };
}
