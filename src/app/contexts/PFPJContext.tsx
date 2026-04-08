import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { pb } from '../../lib/pocketbase';
import {
  TransactionWithPFPJ,
  PFPJContextType,
  PFPJSummary,
  PFPJPrediction,
  PFPJRule,
  HEURISTICS,
  PFPJ_CONFIG,
} from '../types/pfpj';

const PFPJContext = createContext<PFPJContextType | undefined>(undefined);

export function PFPJProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionWithPFPJ[]>([]);
  const [rules, setRules] = useState<PFPJRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Buscar transações com tipo PF/PJ
   */
  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const records = await pb.collection('transactions').getList(1, 500, {
        filter: `userid = "${user.id}"`,
        sort: '-data',
      });

      // Mapear para adicionar campo pf_pj_type se não existir
      const mappedTransactions = records.items.map((item: any) => ({
        ...item,
        pf_pj_type: item.pf_pj_type || 'pf', // default para transações antigas
      })) as TransactionWithPFPJ[];

      setTransactions(mappedTransactions);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(message);
      console.error('PFPJ fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buscar regras customizadas do usuário
   */
  const fetchRules = async () => {
    if (!user) return;

    try {
      const records = await pb.collection('pfpj_rules').getList(1, 100, {
        filter: `userid = "${user.id}"`,
        sort: '-created',
      });

      setRules(records.items as PFPJRule[]);
    } catch (err) {
      // Collection pode não existir ainda, é ok
      console.debug('PFPJ rules fetch:', err);
    }
  };

  /**
   * Carregar dados ao montar e quando user mudar
   */
  useEffect(() => {
    if (!user) return;

    fetchTransactions();
    fetchRules();
  }, [user]);

  /**
   * Sugerir tipo de transação usando heurísticas
   */
  const predictType = (transaction: any): PFPJPrediction => {
    let score = 50; // começa no meio
    let reasoning = '';

    // 1. Checar categoria
    if (HEURISTICS.pfCategories.includes(transaction.categoria)) {
      score = 95;
      reasoning = `Categoria "${transaction.categoria}" é pessoal`;
      return { type: 'pf', confidence: score, reasoning };
    }

    if (HEURISTICS.pjCategories.includes(transaction.categoria)) {
      score = 95;
      reasoning = `Categoria "${transaction.categoria}" é empresarial`;
      return { type: 'pj', confidence: score, reasoning };
    }

    // 2. Checar descrição (keywords)
    const desc = (transaction.descricao || '').toLowerCase();

    const pfKeywordMatch = HEURISTICS.pfKeywords.some((kw) => desc.includes(kw));
    const pjKeywordMatch = HEURISTICS.pjKeywords.some((kw) => desc.includes(kw));

    if (pfKeywordMatch && !pjKeywordMatch) {
      score = 85;
      reasoning = 'Descrição indica transação pessoal';
    } else if (pjKeywordMatch && !pfKeywordMatch) {
      score = 90;
      reasoning = 'Descrição indica transação empresarial';
    } else if (pjKeywordMatch && pfKeywordMatch) {
      // Conflito, usar valor como desempate
      score = 60;
      reasoning = 'Descrição ambígua, use o valor para decidir';
    }

    // 3. Checar valor
    if (transaction.valor < 100 && transaction.tipo === 'saida') {
      if (score < 70) {
        score = 70;
        reasoning = `Valor baixo (R$ ${transaction.valor}) sugere gasto pessoal`;
      }
    }

    if (transaction.valor > 2000) {
      if (score < 75) {
        score = 75;
        reasoning = `Valor alto (R$ ${transaction.valor}) sugere gasto empresarial`;
      }
    }

    // 4. Checar regras customizadas
    const matchingRule = rules.find((rule) => {
      if (!rule.enabled) return false;

      return rule.criteria.every((crit) => {
        const value =
          crit.field === 'description'
            ? (transaction.descricao || '').toLowerCase()
            : crit.field === 'category'
              ? transaction.categoria
              : transaction.valor;

        switch (crit.operator) {
          case 'contains':
            return String(value).includes(String(crit.value).toLowerCase());
          case 'equals':
            return value === crit.value;
          case 'startsWith':
            return String(value).startsWith(String(crit.value));
          case 'gt':
            return Number(value) > Number(crit.value);
          case 'lt':
            return Number(value) < Number(crit.value);
          default:
            return false;
        }
      });
    });

    if (matchingRule) {
      score = Math.min(100, score + (matchingRule.confidence || 20));
      reasoning = `Regra customizada "${matchingRule.name}" aplicada`;
    }

    // Decidir final
    const type = score > 60 ? (score > 50 ? 'pj' : 'pf') : 'misto';
    if (score === 50) type === 'misto';

    return {
      type,
      confidence: Math.min(100, Math.max(0, score)),
      reasoning,
    };
  };

  /**
   * Atualizar tipo de transação
   */
  const updateTransactionType = async (id: string, type: any) => {
    try {
      setError(null);

      await pb.collection('transactions').update(id, {
        pf_pj_type: type,
      });

      // Update local state
      setTransactions(
        transactions.map((t) =>
          t.id === id ? { ...t, pf_pj_type: type, pf_pj_suggested_by: 'user' } : t
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar categorização';
      setError(message);
      throw err;
    }
  };

  /**
   * Filtrar transações por tipo
   */
  const getTransactionsByType = (type: any): TransactionWithPFPJ[] => {
    if (type === 'all') return transactions;
    return transactions.filter((t) => t.pf_pj_type === type);
  };

  /**
   * Transações que precisam de revisão (score baixo)
   */
  const getTransactionsNeedingReview = (minConfidence: number = 70): TransactionWithPFPJ[] => {
    return transactions.filter((t) => {
      const confidence = t.pf_pj_confidence || 100;
      return confidence < minConfidence;
    });
  };

  /**
   * Calcular resumo por tipo
   */
  const calculateSummary = (): PFPJSummary | null => {
    if (transactions.length === 0) {
      return null;
    }

    const summary: PFPJSummary = {
      period: new Date().toLocaleDateString('pt-BR'),

      pf: {
        totalIncoming: 0,
        totalOutgoing: 0,
        balance: 0,
        transactionCount: 0,
        categories: {},
      },

      pj: {
        totalIncoming: 0,
        totalOutgoing: 0,
        balance: 0,
        profit: 0,
        profitMargin: 0,
        transactionCount: 0,
        categories: {},
      },

      misto: {
        count: 0,
        totalAmount: 0,
      },

      totalBalance: 0,
      lastUpdated: new Date(),
    };

    // Iterar transações e agregar
    transactions.forEach((t) => {
      const type = t.pf_pj_type;

      if (type === 'pf') {
        summary.pf.transactionCount++;
        if (t.tipo === 'entrada') {
          summary.pf.totalIncoming += t.valor;
        } else {
          summary.pf.totalOutgoing += t.valor;
        }
        summary.pf.categories[t.categoria] = (summary.pf.categories[t.categoria] || 0) + t.valor;
      } else if (type === 'pj') {
        summary.pj.transactionCount++;
        if (t.tipo === 'entrada') {
          summary.pj.totalIncoming += t.valor;
        } else {
          summary.pj.totalOutgoing += t.valor;
        }
        summary.pj.categories[t.categoria] = (summary.pj.categories[t.categoria] || 0) + t.valor;
      } else if (type === 'misto') {
        summary.misto!.count++;
        summary.misto!.totalAmount += t.valor;
      }
    });

    // Calcular balances e percentagens
    summary.pf.balance = summary.pf.totalIncoming - summary.pf.totalOutgoing;
    summary.pj.balance = summary.pj.totalIncoming - summary.pj.totalOutgoing;
    summary.pj.profit = summary.pj.totalIncoming - summary.pj.totalOutgoing;
    summary.pj.profitMargin =
      summary.pj.totalIncoming > 0
        ? (summary.pj.profit / summary.pj.totalIncoming) * 100
        : 0;

    summary.totalBalance = summary.pf.balance + summary.pj.balance;

    return summary;
  };

  /**
   * Adicionar regra customizada
   */
  const addRule = async (ruleData: any) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      const record = await pb.collection('pfpj_rules').create({
        ...ruleData,
        userid: user.id,
        appliedCount: 0,
      });

      setRules([record as PFPJRule, ...rules]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar regra';
      setError(message);
      throw err;
    }
  };

  /**
   * Remover regra
   */
  const removeRule = async (ruleId: string) => {
    try {
      await pb.collection('pfpj_rules').delete(ruleId);
      setRules(rules.filter((r) => r.id !== ruleId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover regra';
      setError(message);
      throw err;
    }
  };

  /**
   * Obter regras
   */
  const getRules = (): PFPJRule[] => {
    return rules;
  };

  /**
   * Refresh dados
   */
  const refresh = async () => {
    await Promise.all([fetchTransactions(), fetchRules()]);
  };

  const summary = useMemo(() => calculateSummary(), [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      loading,
      error,
      summary,
      getTransactionsByType,
      updateTransactionType,
      calculateSummary,
      predictType,
      getTransactionsNeedingReview,
      addRule,
      removeRule,
      getRules,
      refresh,
    }),
    [transactions, loading, error, summary, rules]
  );

  return <PFPJContext.Provider value={value}>{children}</PFPJContext.Provider>;
}

export function usePFPJ(): PFPJContextType {
  const context = useContext(PFPJContext);
  if (!context) {
    throw new Error('usePFPJ deve ser usado dentro de PFPJProvider');
  }
  return context;
}
