import { createContext, useContext, useMemo, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useCashFlow } from "./CashFlowContext";
import { usePayables } from "./PayablesContext";

export interface ReportSummary {
  period: "mes" | "trimestre" | "ano" | "custom";
  dateRange: [Date, Date];

  // Receitas
  totalReceitas: number;
  totalPropostasAprovadas: number;
  totalPropostasPagas: number;
  propostalReceitas: number;
  outrasReceitas: number;

  // Despesas
  totalDespesas: number;
  despesasPorCategoria: Record<string, number>;
  contasApagarPendentes: number;
  contasApagarValor: number;

  // Análise
  fluxoCaixa: number; // receitas - despesas
  margemBruta: number; // (receitas - despesas diretas) / receitas
  margemLiquida: number; // fluxoCaixa / receitas

  // Propostas
  propostas: {
    total: number;
    aprovadas: number;
    pagas: number;
    vencidas: number;
    pendentes: number;
    valorTotal: number;
    valorPago: number;
    valorAReceberAprovadas: number;
    valorAReceberVencidas: number;
  };

  // Contas a Pagar
  payables: {
    total: number;
    pagas: number;
    pendentes: number;
    vencidas: number;
    valorTotal: number;
    valorPago: number;
    valorAPagar: number;
  };
}

export interface ReportData {
  mes: string;
  receitas: number;
  despesas: number;
  fluxoCaixa: number;
  margemLiquida: number;
}

interface ReportsContextType {
  summary: ReportSummary | null;
  loading: boolean;
  getTransactionsByDateRange: (startDate: Date, endDate: Date) => any[];
  getExpenseByCategory: (startDate: Date, endDate: Date) => Record<string, number>;
  getMonthlyFlow: (months: number) => ReportData[];
  getComparisonMetrics: (
    currentStart: Date,
    currentEnd: Date,
    previousStart: Date,
    previousEnd: Date
  ) => {
    receitalGrowth: number;
    expenseGrowth: number;
    marginChange: number;
  };
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { transactions } = useCashFlow();
  const { payables } = usePayables();

  // Nota: Você precisará adicionar um ProposalsContext ou adaptar conforme necessário
  // Por enquanto, vamos trabalhar com transações e payables

  /**
   * FORMATTERS
   */
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });

  /**
   * HELPER: Filtrar transações por data
   */
  function getTransactionsByDateRange(startDate: Date, endDate: Date) {
    return transactions.filter((t) => {
      const tDate = new Date(t.data);
      return tDate >= startDate && tDate <= endDate;
    });
  }

  /**
   * HELPER: Agrupar despesas por categoria
   */
  function getExpenseByCategory(
    startDate: Date,
    endDate: Date
  ): Record<string, number> {
    const filtered = getTransactionsByDateRange(startDate, endDate);
    const map: Record<string, number> = {};

    filtered.forEach((t) => {
      if (t.tipo === "saida") {
        map[t.categoria] = (map[t.categoria] ?? 0) + t.valor;
      }
    });

    return map;
  }

  /**
   * HELPER: Construir fluxo mensal para X meses anteriores
   */
  function getMonthlyFlow(months: number): ReportData[] {
    const data: ReportData[] = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const monthTransactions = getTransactionsByDateRange(startOfMonth, endOfMonth);

      const receitas = monthTransactions
        .filter((t) => t.tipo === "entrada")
        .reduce((sum, t) => sum + t.valor, 0);

      const despesas = monthTransactions
        .filter((t) => t.tipo === "saida")
        .reduce((sum, t) => sum + t.valor, 0);

      const fluxo = receitas - despesas;
      const margem = receitas > 0 ? (fluxo / receitas) * 100 : 0;

      const mesLabel = startOfMonth.toLocaleString("pt-BR", {
        month: "short",
        year: "2-digit",
      });

      data.push({
        mes: mesLabel,
        receitas,
        despesas,
        fluxoCaixa: fluxo,
        margemLiquida: margem,
      });
    }

    return data;
  }

  /**
   * HELPER: Comparar métricas entre dois períodos
   */
  function getComparisonMetrics(
    currentStart: Date,
    currentEnd: Date,
    previousStart: Date,
    previousEnd: Date
  ) {
    const currentTx = getTransactionsByDateRange(currentStart, currentEnd);
    const previousTx = getTransactionsByDateRange(previousStart, previousEnd);

    const currentReceitas = currentTx
      .filter((t) => t.tipo === "entrada")
      .reduce((sum, t) => sum + t.valor, 0);
    const previousReceitas = previousTx
      .filter((t) => t.tipo === "entrada")
      .reduce((sum, t) => sum + t.valor, 0);

    const currentExpenses = currentTx
      .filter((t) => t.tipo === "saida")
      .reduce((sum, t) => sum + t.valor, 0);
    const previousExpenses = previousTx
      .filter((t) => t.tipo === "saida")
      .reduce((sum, t) => sum + t.valor, 0);

    const currentMargin =
      currentReceitas > 0
        ? ((currentReceitas - currentExpenses) / currentReceitas) * 100
        : 0;
    const previousMargin =
      previousReceitas > 0
        ? ((previousReceitas - previousExpenses) / previousReceitas) * 100
        : 0;

    return {
      receitalGrowth:
        previousReceitas > 0
          ? ((currentReceitas - previousReceitas) / previousReceitas) * 100
          : 0,
      expenseGrowth:
        previousExpenses > 0
          ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
          : 0,
      marginChange: currentMargin - previousMargin,
    };
  }

  /**
   * MAIN: Summary para período atual (sempre mês)
   */
  const summary: ReportSummary | null = useMemo(() => {
    if (!user || transactions.length === 0) return null;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const monthTransactions = getTransactionsByDateRange(startOfMonth, endOfMonth);

    // Receitas e Despesas
    const totalReceitas = monthTransactions
      .filter((t) => t.tipo === "entrada")
      .reduce((sum, t) => sum + t.valor, 0);

    const totalDespesas = monthTransactions
      .filter((t) => t.tipo === "saida")
      .reduce((sum, t) => sum + t.valor, 0);

    const fluxoCaixa = totalReceitas - totalDespesas;
    const margemLiquida = totalReceitas > 0 ? (fluxoCaixa / totalReceitas) * 100 : 0;

    // Despesas por categoria
    const despesasPorCategoria = getExpenseByCategory(startOfMonth, endOfMonth);

    // Contas a Pagar
    const contasVencidas = new Date();
    const contasApagarPendentes = payables.filter((p) => p.status === "pendente").length;
    const contasApagarValor = payables
      .filter((p) => p.status === "pendente")
      .reduce((sum, p) => sum + p.valor, 0);

    // Propostas (placeholder até ter ProposalsContext)
    const propostas = {
      total: 0,
      aprovadas: 0,
      pagas: 0,
      vencidas: 0,
      pendentes: 0,
      valorTotal: 0,
      valorPago: 0,
      valorAReceberAprovadas: 0,
      valorAReceberVencidas: 0,
    };

    // Payables
    const payablesSummary = {
      total: payables.length,
      pagas: payables.filter((p) => p.status === "pago").length,
      pendentes: payables.filter((p) => p.status === "pendente").length,
      vencidas: payables.filter(
        (p) => new Date(p.data_vencimento) < contasVencidas && p.status === "pendente"
      ).length,
      valorTotal: payables.reduce((sum, p) => sum + p.valor, 0),
      valorPago: payables
        .filter((p) => p.status === "pago")
        .reduce((sum, p) => sum + p.valor, 0),
      valorAPagar: payables
        .filter((p) => p.status === "pendente")
        .reduce((sum, p) => sum + p.valor, 0),
    };

    return {
      period: "mes",
      dateRange: [startOfMonth, endOfMonth],
      totalReceitas,
      totalPropostasAprovadas: 0,
      totalPropostasPagas: 0,
      propostalReceitas: 0,
      outrasReceitas: totalReceitas,
      totalDespesas,
      despesasPorCategoria,
      contasApagarPendentes,
      contasApagarValor,
      fluxoCaixa,
      margemBruta: totalReceitas > 0 ? (totalDespesas / totalReceitas) * 100 : 0,
      margemLiquida,
      propostas,
      payables: payablesSummary,
    };
  }, [user, transactions, payables]);

  return (
    <ReportsContext.Provider
      value={{
        summary,
        loading: false,
        getTransactionsByDateRange,
        getExpenseByCategory,
        getMonthlyFlow,
        getComparisonMetrics,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports(): ReportsContextType {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
}
