import { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useAuth } from '../contexts/AuthContext';
import { createPlaidLinkToken, exchangePublicToken, syncPlaidTransactions } from '../../lib/plaid';
import { toast } from 'sonner';
import { Loader2, Link as LinkIcon } from 'lucide-react';

interface PlaidLinkProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function PlaidLink({ onSuccess, onError, className = '' }: PlaidLinkProps) {
  const { user } = useAuth();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Create Plaid Link Token
  useEffect(() => {
    const initPlaid = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const token = await createPlaidLinkToken(user.id);
        setLinkToken(token);
      } catch (error) {
        console.error('[PlaidLink] Error initializing:', error);
        toast.error('Erro ao inicializar conexão bancária');
        onError?.(error instanceof Error ? error : new Error('Failed to initialize Plaid'));
      } finally {
        setLoading(false);
      }
    };

    initPlaid();
  }, [user?.id, onError]);

  // Handle successful Plaid Link flow
  const handlePlaidSuccess = async (publicToken: string) => {
    if (!user?.id) return;

    try {
      setSyncing(true);
      toast.loading('Conectando banco...');

      // Exchange public token for access token
      const accessToken = await exchangePublicToken(publicToken, user.id);
      console.log('[PlaidLink] Token exchanged successfully');

      // Sync transactions
      const imported = await syncPlaidTransactions(user.id);
      toast.success(`✅ Banco conectado! ${imported} transações importadas`);

      onSuccess?.();
    } catch (error) {
      console.error('[PlaidLink] Error in success handler:', error);
      toast.error('Erro ao sincronizar transações');
      onError?.(error instanceof Error ? error : new Error('Failed to sync'));
    } finally {
      setSyncing(false);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handlePlaidSuccess,
    onExit: (err) => {
      if (err) {
        console.error('[PlaidLink] User exited with error:', err);
        toast.error('Erro na conexão com o banco');
      }
    },
  });

  const isLoading = loading || !ready || syncing;

  return (
    <button
      onClick={() => open()}
      disabled={isLoading}
      className={`
        flex items-center justify-center gap-2
        px-4 py-2.5 rounded-lg
        bg-[#0066FF] hover:bg-[#0052CC]
        text-white font-semibold text-sm
        transition-all disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {syncing ? 'Sincronizando...' : 'Carregando...'}
        </>
      ) : (
        <>
          <LinkIcon className="w-4 h-4" />
          Conectar Banco (Open Finance)
        </>
      )}
    </button>
  );
}

/**
 * Hook para usar Plaid fora do componente
 */
export function usePlaidIntegration() {
  const { user } = useAuth();

  return {
    user,
    createLinkToken: () => user?.id ? createPlaidLinkToken(user.id) : Promise.reject('No user'),
    syncTransactions: () => user?.id ? syncPlaidTransactions(user.id) : Promise.reject('No user'),
  };
}
