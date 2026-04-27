import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { pb, getVerifiedPlan } from "../../lib/pocketbase";

export type TransactionType = "entrada" | "saida";

export interface Transaction {
  id: string;
  valor: number;
  tipo: TransactionType;
  categoria: string;
  data: string;
  descricao?: string;
  pfpj?: "PF" | "PJ";
  pfpjScore?: number;
  attachments?: string[];
  createdAt: Date;
}

export interface CashFlowSummary {
  /** All-time totals (used for saldo cumulativo) */
  saldoAtual: number;
  totalEntradas: number;
  totalSaidas: number;
  lucro: number;
  margemLucro: number;
  /** Current-month-only totals */
  monthlyEntradas: number;
  monthlyDespesas: number;
  monthlyLucro: number;
}

export interface Insight {
  id: string;
  tipo: "alerta" | "sucesso" | "info";
  mensagem: string;
  icone: string;
}

interface CashFlowContextType {
  transactions: Transaction[];
  summary: CashFlowSummary;
  insights: Insight[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => Promise<string>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionsByPeriod: (period: "dia" | "semana" | "mes" | "ano") => Transaction[];
  getLimitStatus: () => { used: number; limit: number; percentage: number };
  canAddTransaction: () => boolean;
  updateTransactionAttachments: (id: string, attachments: string[]) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
}

const CashFlowContext = createContext<CashFlowContextType | undefined>(undefined);

export const CATEGORIAS_ENTRADA = [
  "Vendas",
  "Serviços prestados",
  "Recebimentos de clientes",
  "Outros ganhos"
];

export const CATEGORIAS_SAIDA = [
  "Fornecedores/Mercadorias",
  "Custos de produção",
  "Frete/Entregas",
  "Aluguel",
  "Internet/Telefonia",
  "Energia/Água",
  "Anúncios/Marketing",
  "Ferramentas/Software",
  "Taxas/Tarifas",
  "Impostos",
  "Retirada do proprietário",
  "Despesas diversas"
];

const FREE_LIMIT = 30;

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function CashFlowProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Mês calendário atual — recalculado apenas quando transactions mudam (suficiente para mês virar)
  const currentMonth = getCurrentMonth();

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    async function fetchTransactions() {
      setLoading(true);
      try {
        const records = await pb.collection("transactions").getList(1, 500, {
          filter: `user_id = "${user.id}"`,
          sort: "-data",
          requestKey: null,
        });

        setTransactions(
          records.items.map((t) => ({
            id: t.id,
            valor: Number(t.valor),
            tipo: t.tipo as TransactionType,
            categoria: t.categoria,
            data: t.data?.split(" ")[0] ?? t.data,
            descricao: t.descricao ?? undefined,
            pfpj: ((t.pfpj ?? "PJ") as "PF" | "PJ"),
            pfpjScore: t.pfpj_score ?? 100,
            attachments: Array.isArray(t.attachments) ? t.attachments : [],
            createdAt: (() => { const d = new Date(t.created); return isNaN(d.getTime()) ? new Date() : d; })(),
          }))
        );
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
      setLoading(false);
    }

    fetchTransactions();
  }, [user?.id]);

  // =============================================
  // Resumo calculado (memoizado — evita re-cálculo a cada render)
  // =============================================
  const summary: CashFlowSummary = useMemo(() => {
    const totalEntradas = transactions
      .filter((t) => t.tipo === "entrada")
      .reduce((sum, t) => sum + t.valor, 0);
    const totalSaidas = transactions
      .filter((t) => t.tipo === "saida")
      .reduce((sum, t) => sum + t.valor, 0);
    const monthlyEntradas = transactions
      .filter((t) => t.tipo === "entrada" && t.data.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.valor, 0);
    const monthlyDespesas = transactions
      .filter((t) => t.tipo === "saida" && t.data.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.valor, 0);
    const lucro = totalEntradas - totalSaidas;
    return {
      totalEntradas,
      totalSaidas,
      saldoAtual: lucro,
      lucro,
      margemLucro: totalEntradas > 0 ? (lucro / totalEntradas) * 100 : 0,
      monthlyEntradas,
      monthlyDespesas,
      monthlyLucro: monthlyEntradas - monthlyDespesas,
    };
  }, [transactions, currentMonth]);

  // =============================================
  // Insights automáticos (memoizados)
  // =============================================
  const insights: Insight[] = useMemo(() => {
    const result: Insight[] = [];

    if (summary.totalEntradas > 0) {
      const percentualCustos = (summary.totalSaidas / summary.totalEntradas) * 100;
      if (percentualCustos > 70) {
        result.push({
          id: "custos-altos",
          tipo: "alerta",
          mensagem: `Seus custos representam ${percentualCustos.toFixed(0)}% da receita. Recomendamos reduzir despesas.`,
          icone: "⚠️",
        });
      }
    }

    if (summary.saldoAtual < 0) {
      result.push({
        id: "saldo-negativo",
        tipo: "alerta",
        mensagem: "Seu saldo está negativo. Priorize recebimentos ou reduza gastos.",
        icone: "🚨",
      });
    }

    if (summary.margemLucro > 0 && summary.margemLucro < 20) {
      result.push({
        id: "margem-baixa",
        tipo: "alerta",
        mensagem: `Sua margem de lucro está em ${summary.margemLucro.toFixed(0)}%. Considere revisar preços.`,
        icone: "📉",
      });
    }

    if (summary.margemLucro >= 40) {
      result.push({
        id: "margem-saudavel",
        tipo: "sucesso",
        mensagem: `Parabéns! Sua margem de ${summary.margemLucro.toFixed(0)}% está saudável.`,
        icone: "✅",
      });
    }

    if (summary.monthlyEntradas > 6000) {
      result.push({
        id: "limite-mei",
        tipo: "info",
        mensagem: `Faturamento mensal em R$ ${summary.monthlyEntradas.toLocaleString()}. Use o simulador MEI→ME.`,
        icone: "💡",
      });
    }

    const monthlyCount = transactions.filter((t) => t.data.startsWith(currentMonth)).length;
    if (transactions.length > 0 && monthlyCount < 5) {
      result.push({
        id: "poucos-lancamentos",
        tipo: "info",
        mensagem: "Mantenha seu controle atualizado para insights mais precisos.",
        icone: "📝",
      });
    }

    if (transactions.length === 0 && !loading) {
      result.push({
        id: "comece-agora",
        tipo: "info",
        mensagem: "Adicione seu primeiro lançamento para começar a controlar suas finanças!",
        icone: "🚀",
      });
    }

    return result;
  }, [summary, transactions, loading, currentMonth]);

  // =============================================
  // Helpers
  // =============================================
  function getTransactionsByPeriod(
    period: "dia" | "semana" | "mes" | "ano"
  ): Transaction[] {
    // "mes" usa mês calendário — consistente com summary e getLimitStatus
    if (period === "mes") {
      return transactions.filter((t) => t.data.startsWith(currentMonth));
    }
    const now = new Date();
    return transactions.filter((t) => {
      const transactionDate = new Date(t.data);
      const diffTime = Math.abs(now.getTime() - transactionDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      switch (period) {
        case "dia":    return diffDays <= 1;
        case "semana": return diffDays <= 7;
        case "ano":    return diffDays <= 365;
        default:       return true;
      }
    });
  }

  // Ambas as funções usam a mesma lógica: contagem mensal (mês calendário)
  function getLimitStatus() {
    const monthlyCount = transactions.filter((t) => t.data.startsWith(currentMonth)).length;
    const limit = user?.plan === "pro" ? Infinity : FREE_LIMIT;
    const percentage = limit === Infinity ? 0 : (monthlyCount / limit) * 100;
    return { used: monthlyCount, limit, percentage };
  }

  function canAddTransaction(): boolean {
    if (user?.plan === "pro") return true;
    const { used, limit } = getLimitStatus();
    return used < limit;
  }

  // =============================================
  // Mutations
  // =============================================
  async function addTransaction(
    transaction: Omit<Transaction, "id" | "createdAt">
  ): Promise<string> {
    if (!user) throw new Error("Usuário não autenticado");

    if (!transaction.valor || transaction.valor <= 0 || !isFinite(transaction.valor))
      throw new Error("Valor deve ser maior que zero");
    if (!["entrada", "saida"].includes(transaction.tipo))
      throw new Error("Tipo de transação inválido");
    if (!transaction.categoria?.trim())
      throw new Error("Categoria é obrigatória");
    if (!transaction.data || isNaN(new Date(transaction.data).getTime()))
      throw new Error("Data inválida");

    const plan = await getVerifiedPlan(user.id);
    const isPro = plan === "pro";
    const monthlyCount = transactions.filter((t) => t.data.startsWith(currentMonth)).length;
    if (!isPro && monthlyCount >= FREE_LIMIT)
      throw new Error("Limite de lançamentos mensais atingido. Faça upgrade para PRO.");

    const record = await pb.collection("transactions").create({
      user_id: user.id,
      valor: transaction.valor,
      tipo: transaction.tipo,
      categoria: transaction.categoria,
      data: transaction.data,
      descricao: transaction.descricao ?? null,
      pfpj: transaction.pfpj ?? "PJ",
      pfpj_score: transaction.pfpjScore ?? 100,
    });

    const newTransaction: Transaction = {
      id: record.id,
      valor: Number(record.valor),
      tipo: record.tipo as TransactionType,
      categoria: record.categoria,
      data: record.data?.split(" ")[0] ?? record.data,
      descricao: record.descricao ?? undefined,
      pfpj: ((record.pfpj ?? "PJ") as "PF" | "PJ"),
      pfpjScore: Number(record.pfpj_score ?? 100),
      attachments: Array.isArray(record.attachments) ? record.attachments : [],
      createdAt: new Date(record.created),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    return record.id;
  }

  async function deleteTransaction(id: string) {
    if (!user) throw new Error("Usuário não autenticado");
    try {
      const record = transactions.find((t) => t.id === id);
      await pb.collection("transactions").delete(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));

      // Audit log — não bloqueia o fluxo se a collection ainda não existir
      if (record) {
        pb.collection("audit_log").create({
          user_id: user.id,
          action: "DELETE",
          collection_name: "transactions",
          record_id: id,
          old_value: JSON.stringify({
            valor: record.valor,
            tipo: record.tipo,
            categoria: record.categoria,
            data: record.data,
            descricao: record.descricao,
          }),
        }, { requestKey: null }).catch(() => {});
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to delete transaction");
    }
  }

  async function updateTransactionAttachments(id: string, attachments: string[]) {
    if (!user) throw new Error("Usuário não autenticado");
    await pb.collection("transactions").update(id, { attachments }, { requestKey: null });
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, attachments } : t))
    );
  }

  async function updateTransaction(id: string, updates: Partial<Transaction>) {
    if (!user) throw new Error("Usuário não autenticado");

    const pbUpdates: Record<string, unknown> = {};
    if (updates.valor !== undefined) {
      if (updates.valor <= 0 || !isFinite(updates.valor))
        throw new Error("Valor deve ser maior que zero");
      pbUpdates.valor = updates.valor;
    }
    if (updates.tipo !== undefined) {
      if (!["entrada", "saida"].includes(updates.tipo))
        throw new Error("Tipo inválido");
      pbUpdates.tipo = updates.tipo;
    }
    if (updates.categoria !== undefined) pbUpdates.categoria = updates.categoria;
    if (updates.data !== undefined) pbUpdates.data = updates.data;
    if (updates.descricao !== undefined) pbUpdates.descricao = updates.descricao ?? null;
    if (updates.pfpj !== undefined) pbUpdates.pfpj = updates.pfpj;
    if (updates.pfpjScore !== undefined) pbUpdates.pfpj_score = updates.pfpjScore;

    await pb.collection("transactions").update(id, pbUpdates, { requestKey: null });
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }

  return (
    <CashFlowContext.Provider
      value={{
        transactions,
        summary,
        insights,
        loading,
        addTransaction,
        deleteTransaction,
        getTransactionsByPeriod,
        getLimitStatus,
        canAddTransaction,
        updateTransactionAttachments,
        updateTransaction,
      }}
    >
      {children}
    </CashFlowContext.Provider>
  );
}

export function useCashFlow() {
  const context = useContext(CashFlowContext);
  if (context === undefined) {
    throw new Error("useCashFlow must be used within a CashFlowProvider");
  }
  return context;
}
