/**
 * Bank Connection Selector
 * Allows user to choose between Belvo (primary) or Plaid (fallback)
 */

import { useState } from 'react';
import { PlaidLink } from './PlaidLink';
import { BelvoLink } from './BelvoLink';
import { PluggyLink } from './PluggyLink';

interface BankConnectionSelectorProps {
  userId: string;
  onSuccess?: () => void;
}

type BankProvider = 'pluggy' | 'belvo' | 'plaid' | null;

export function BankConnectionSelector({ userId, onSuccess }: BankConnectionSelectorProps) {
  const [selected, setSelected] = useState<BankProvider>(null);

  if (selected === 'pluggy') {
    return <PluggyLink onSuccess={onSuccess} />;
  }

  if (selected === 'belvo') {
    return <BelvoLink userId={userId} onSuccess={onSuccess} />;
  }

  if (selected === 'plaid') {
    return <PlaidLink userId={userId} onSuccess={onSuccess} />;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 pb-4 border-b border-blue-200">
          <div className="text-3xl">🏦</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Conectar seu Banco</h3>
            <p className="text-sm text-gray-600 mt-1">
              Escolha como deseja importar automaticamente suas transações bancárias
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Pluggy Option - Primary */}
          <button
            onClick={() => setSelected('pluggy')}
            className="text-left p-4 rounded-lg border-2 border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-400 transition ring-2 ring-green-200"
          >
            <div className="font-semibold text-gray-900 mb-1">✅ Pluggy (Recomendado)</div>
            <p className="text-sm text-gray-700 mb-2">
              Open Finance <strong>nativo do Brasil</strong>
            </p>
            <p className="text-xs text-gray-500">
              Melhor compatibilidade com bancos brasileiros
            </p>
          </button>

          {/* Belvo Option - Fallback */}
          <button
            onClick={() => setSelected('belvo')}
            className="text-left p-4 rounded-lg border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition"
          >
            <div className="font-semibold text-gray-900 mb-1">🇧🇷 Belvo (Alternativa)</div>
            <p className="text-sm text-gray-700 mb-2">
              Acesso a <strong>100+ bancos</strong> brasileiros
            </p>
            <p className="text-xs text-gray-500">
              Cobertura completa se Pluggy falhar
            </p>
          </button>

          {/* Plaid Option - Last Resort */}
          <button
            onClick={() => setSelected('plaid')}
            className="text-left p-4 rounded-lg border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition"
          >
            <div className="font-semibold text-gray-900 mb-1">🌐 Plaid (Último recurso)</div>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Suporte limitado</strong> para Brasil
            </p>
            <p className="text-xs text-gray-500">
              Apenas contas internacionais
            </p>
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-xs text-gray-600">
          <strong>💡 Dica:</strong> Pluggy tem a melhor cobertura de bancos brasileiros. Tente Belvo ou Plaid apenas se Pluggy não funcionar com seu banco.
        </div>
      </div>
    </div>
  );
}
