/**
 * BelvoLink Component
 * Bank connection via Belvo (Brazil Open Finance)
 */

import { useState, useEffect } from 'react';
import { createBelvoLinkToken, syncBelvoAccounts, syncBelvoTransactions } from '@/lib/belvo';

interface BelvoLinkProps {
  userId: string;
  onSuccess?: () => void;
}

export function BelvoLink({ userId, onSuccess }: BelvoLinkProps) {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Belvo Web Widget script
    const script = document.createElement('script');
    script.src = 'https://cdn.belvo.io/belvo-web-widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleConnectBank = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Create link token on backend
      const { link_id, access_token } = await createBelvoLinkToken(userId);
      console.log('[Belvo] Link token created:', link_id);

      // Step 2: Open Belvo Web Widget
      if (window.BelvoWebWidget) {
        window.BelvoWebWidget.open({
          token: access_token,
          onSuccess: async (data: any) => {
            try {
              setSyncing(true);
              console.log('[Belvo] User authenticated successfully');

              // Step 3: Sync accounts
              await syncBelvoAccounts(userId, link_id);
              console.log('[Belvo] Accounts synced');

              // Step 4: Sync transactions
              const imported = await syncBelvoTransactions(userId);
              console.log(`[Belvo] Synced ${imported} transactions`);

              setLoading(false);
              setSyncing(false);

              if (onSuccess) {
                onSuccess();
              } else {
                window.location.reload();
              }
            } catch (syncError) {
              console.error('[Belvo] Error syncing data:', syncError);
              setError('Falha ao sincronizar dados bancários. Tente novamente.');
              setSyncing(false);
            }
          },
          onError: (error: any) => {
            console.error('[Belvo] User cancelled or error:', error);
            setError(error?.error?.detail || 'Falha na conexão com o banco');
            setLoading(false);
          },
        });
      } else {
        setError('Widget do Belvo não carregou. Recarregue a página.');
        setLoading(false);
      }
    } catch (err) {
      console.error('[Belvo] Error creating link token:', err);
      setError('Falha ao conectar. Verifique sua conexão e tente novamente.');
      setLoading(false);
    }
  };

  if (syncing) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-blue-600 font-medium">Sincronizando transações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🏦</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Conectar seu Banco</h3>
            <p className="text-sm text-gray-600 mt-1">
              Importe automaticamente suas transações bancárias de qualquer banco brasileiro via Belvo
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded px-3 py-2">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleConnectBank}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition"
        >
          {loading ? 'Carregando...' : 'Conectar Banco'}
        </button>
      </div>
    </div>
  );
}

// Extend Window interface for BelvoWebWidget
declare global {
  interface Window {
    BelvoWebWidget: any;
  }
}
