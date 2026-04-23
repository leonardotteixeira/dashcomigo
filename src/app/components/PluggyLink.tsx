/**
 * Pluggy Link Component
 * Widget para conectar contas bancárias via Pluggy
 */

import React, { useState } from 'react';
import { PluggyConnect } from 'react-pluggy-connect';
import { useAuth } from '../contexts/AuthContext';
import { createPluggyConnectToken, syncPluggyAccounts, syncPluggyTransactions, syncPluggyInvestments } from '../../lib/pluggy';
import { Button } from './ui/button';

interface PluggyLinkProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PluggyLink({ onSuccess, onError }: PluggyLinkProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectToken, setConnectToken] = useState<string | null>(null);
  const [showWidget, setShowWidget] = useState(false);

  const handleOpenWidget = async () => {
    if (!user?.id) {
      const msg = 'Usuário não autenticado';
      setError(msg);
      onError?.(msg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[Pluggy] Creating connect token for user:', user.id);
      const { access_token } = await createPluggyConnectToken(user.id);
      setConnectToken(access_token);
      setShowWidget(true);
    } catch (err: any) {
      const msg = err?.message || 'Falha ao inicializar Pluggy';
      console.error('[Pluggy] Error:', msg);
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async (itemData: any) => {
    console.log('[Pluggy] Connection successful:', itemData);
    setShowWidget(false);

    try {
      const itemId = itemData?.item?.id || itemData?.id;
      const institutionId = itemData?.connector?.id || itemData?.item?.connector?.id || 'unknown';

      // Guarda itemId no localStorage para uso no resync
      if (itemId && user?.id) {
        localStorage.setItem(`pluggy_item_id_${user.id}`, itemId);
      }

      // 1. Salva conexão + marca open_finance_connected = true
      await syncPluggyAccounts(user!.id, itemId, String(institutionId));
      console.log('[Pluggy] Connection saved');

      // 2. Importa transações (ingestão + normalização + classificação)
      if (itemId) {
        await syncPluggyTransactions(user!.id, itemId);
        console.log('[Pluggy] Transactions synced');

        // 3. Importa investimentos (renda fixa, ações, fundos, etc)
        await syncPluggyInvestments(user!.id, itemId).catch(err =>
          console.warn('[Pluggy] Investments sync skipped (bank may not have investment data):', err?.message)
        );
        console.log('[Pluggy] Investments synced');
      }

      onSuccess?.();
    } catch (syncError: any) {
      const msg = syncError?.message || 'Falha ao sincronizar contas';
      console.error('[Pluggy] Sync error:', msg);
      setError(msg);
    }
  };

  const handleError = (err: any) => {
    const msg = err?.message || 'Erro na conexão Pluggy';
    console.error('[Pluggy] Widget error:', msg);
    setShowWidget(false);
    setError(msg);
    onError?.(msg);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleOpenWidget}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700"
      >
        {loading ? 'Conectando...' : 'Conectar Conta Pluggy'}
      </Button>

      {error && (
        <div className="text-red-500 text-sm">
          ⚠️ Erro: {error}
        </div>
      )}

      {showWidget && connectToken && (
        <PluggyConnect
          connectToken={connectToken}
          includeSandbox={true}
          onSuccess={handleSuccess}
          onError={handleError}
          onClose={() => setShowWidget(false)}
        />
      )}
    </div>
  );
}
