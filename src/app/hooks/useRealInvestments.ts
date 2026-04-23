/**
 * Hook para buscar investimentos reais importados via Open Finance
 */

import { useState, useEffect, useCallback } from 'react';
import { pb } from '../../lib/pocketbase';
import { useAuth } from '../contexts/AuthContext';

export interface RealInvestment {
  id: string;
  name: string;
  type: string;
  subtype: string;
  invested_amount: number;
  current_value: number;
  quantity: number;
  currency: string;
  institution: string;
  last_updated: string;
  status: string;
}

export interface PortfolioSummary {
  totalInvested: number;
  totalCurrent: number;
  totalReturn: number;
  returnPct: number;
  byType: Record<string, { invested: number; current: number; count: number }>;
}

export function useRealInvestments() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<RealInvestment[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalInvested: 0,
    totalCurrent: 0,
    totalReturn: 0,
    returnPct: 0,
    byType: {},
  });
  const [loading, setLoading] = useState(true);

  const fetchInvestments = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const records = await pb.collection('investments').getList(1, 500, {
        filter: `user_id = "${user.id}" && status = "active"`,
        sort: '-last_updated',
        requestKey: null,
      });

      const raw = records.items as unknown as RealInvestment[];

      // Deduplica por nome + tipo: se o usuário conectou o mesmo banco várias vezes,
      // cada conexão cria registros com pluggy_id diferente mas mesmo nome/tipo.
      // Mantemos apenas o registro mais recente (sort: -last_updated garante isso).
      const seen = new Set<string>();
      const items = raw.filter(inv => {
        const key = `${inv.name}||${inv.type}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setInvestments(items);

      const byType: Record<string, { invested: number; current: number; count: number }> = {};
      let totalInvested = 0;
      let totalCurrent = 0;

      for (const inv of items) {
        const current = inv.current_value || 0;
        // Se current_value = 0, ativo provavelmente sem cotação — ignora no total
        if (current === 0) continue;

        // Sanitiza invested_amount: se for 0 ou implica perda > 90% (dado sandbox/inválido),
        // usa current_value como base (retorno = 0%)
        const rawInvested = inv.invested_amount || 0;
        const invested = (rawInvested > 0 && current / rawInvested >= 0.1)
          ? rawInvested
          : current;

        totalInvested += invested;
        totalCurrent += current;

        if (!byType[inv.type]) {
          byType[inv.type] = { invested: 0, current: 0, count: 0 };
        }
        byType[inv.type].invested += invested;
        byType[inv.type].current += current;
        byType[inv.type].count += 1;
      }

      const totalReturn = totalCurrent - totalInvested;
      const returnPct = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

      setSummary({ totalInvested, totalCurrent, totalReturn, returnPct, byType });
    } catch (err) {
      console.warn('[Investments] Error fetching:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  return { investments, summary, loading, refresh: fetchInvestments };
}
