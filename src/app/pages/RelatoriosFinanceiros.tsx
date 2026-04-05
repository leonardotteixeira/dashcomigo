import { useState, useMemo, useEffect } from "react";
import {
  TrendingUp, DollarSign, AlertCircle, CheckCircle, Crown, Lock,
  TrendingDown, Minus, Lightbulb, Target, ChevronRight, FileText,
  Clock, BarChart2,
} from "lucide-react";
import { useReports } from "../contexts/ReportsContext";
import { useCashFlow } from "../contexts/CashFlowContext";
import { usePayables } from "../contexts/PayablesContext";
import { useReceivables } from "../contexts/ReceivablesContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { PeriodFilter } from "../components/reports/PeriodFilter";
import { ReportCard, CompactReportCard } from "../components/reports/ReportCard";
import { ReportChart } from "../components/reports/ReportChart";
import { ReportTable, Column } from "../components/reports/ReportTable";
import { ExportButtons } from "../components/reports/ExportButtons";
import { exportReportToExcel, exportReportToPDF } from "../utils/export";
import type { ReportExportData } from "../utils/export";
import { pb } from "../../lib/pocketbase";
import {
  formatCurrency,
  formatPercentage,
  calculateGrowth,
  getMarginHealthStatus,
  generateInsights,
  generateRecommendations,
  calcularLiquidez,
  calcularPontoEquilibrio,
  estimarValorNegocio,
  projetarProximos30dias,
} from "../utils/reportCalculations";

type TabType = "resumo" | "receita-despesa" | "fluxo" | "propostas" | "contas-pagar";

type ProposalStatus = "aguardando" | "aprovada" | "recusada" | "paga" | "vencida";

interface Proposal {
  id: string;
  tipo: "contrato" | "orcamento";
  status: ProposalStatus;
  nome_cliente: string;
  nome_servico: string;
  valor: number;
  prazo: string;
  created: string;
}

const STATUS_LABEL: Record<ProposalStatus, { label: string; color: string }> = {
  aguardando: { label: "Aguardando", color: "bg-yellow-500/20 text-yellow-400" },
  aprovada:   { label: "Aprovada",   color: "bg-blue-500/20 text-blue-400" },
  paga:       { label: "Paga",       color: "bg-green-500/20 text-green-400" },
  vencida:    { label: "Vencida",    color: "bg-red-500/20 text-red-400" },
  recusada:   { label: "Recusada",   color: "bg-orange-500/20 text-orange-400" },
};

export function RelatoriosFinanceiros() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("resumo");
  const [period, setPeriod] = useState<"mes" | "trimestre" | "ano" | "custom" | "30dias">("mes");
  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(false);

  const { getTransactionsByDateRange } = useReports();
  const { transactions } = useCashFlow();
  const { payables } = usePayables();
  const { receivables } = useReceivables();

  // Fetch proposals when propostas tab is activated
  useEffect(() => {
    if (activeTab !== "propostas" || !user || proposals.length > 0) return;
    setLoadingProposals(true);
    pb.collection("proposals")
      .getList(1, 500, { filter: `user_id = "${user.id}"`, sort: "-created", requestKey: null })
      .then((res) => setProposals(res.items as Proposal[]))
      .catch(console.error)
      .finally(() => setLoadingProposals(false));
  }, [activeTab, user]);

  if (user?.plan !== "pro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-16 h-16 bg-[#28A263]/20 rounded-2xl flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-[#2DDB81]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Relatórios são exclusivos do PRO</h2>
        <p className="text-[#A1A1A1] mb-8 max-w-md">
          Acesse relatórios completos, gráficos avançados, exportação em PDF e Excel com o plano PRO.
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="flex items-center gap-2 bg-[#2DDB81] hover:bg-[#28C974] text-black font-bold px-6 py-3 rounded-xl transition-colors"
        >
          <Crown className="w-5 h-5" />
          Fazer Upgrade para PRO
        </button>
      </div>
    );
  }

  // Transactions for selected period
  const periodTransactions = useMemo(
    () => getTransactionsByDateRange(dateRange[0], dateRange[1]),
    [dateRange, getTransactionsByDateRange]
  );

  // Current period aggregations
  const periodSummary = useMemo(() => {
    const receitas = periodTransactions
      .filter((t) => t.tipo === "entrada")
      .reduce((sum, t) => sum + t.valor, 0);
    const despesas = periodTransactions
      .filter((t) => t.tipo === "saida")
      .reduce((sum, t) => sum + t.valor, 0);
    const fluxo = receitas - despesas;
    const margem = receitas > 0 ? (fluxo / receitas) * 100 : 0;
    return { receitas, despesas, fluxo, margem };
  }, [periodTransactions]);

  // Previous period comparison
  const previousPeriodSummary = useMemo(() => {
    const daysDiff = Math.ceil(
      (dateRange[1].getTime() - dateRange[0].getTime()) / (1000 * 60 * 60 * 24)
    );
    const prevStart = new Date(dateRange[0]);
    prevStart.setDate(prevStart.getDate() - daysDiff);
    const prevEnd = new Date(dateRange[0]);
    prevEnd.setDate(prevEnd.getDate() - 1);

    const prevTx = getTransactionsByDateRange(prevStart, prevEnd);
    const prevReceitas = prevTx.filter((t) => t.tipo === "entrada").reduce((sum, t) => sum + t.valor, 0);
    const prevDespesas = prevTx.filter((t) => t.tipo === "saida").reduce((sum, t) => sum + t.valor, 0);
    return { prevReceitas, prevDespesas };
  }, [dateRange, getTransactionsByDateRange]);

  // Last 6 months flow chart
  const monthlyFlowData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const monthTx = getTransactionsByDateRange(startOfMonth, endOfMonth);
      const receitas = monthTx.filter((t) => t.tipo === "entrada").reduce((sum, t) => sum + t.valor, 0);
      const despesas = monthTx.filter((t) => t.tipo === "saida").reduce((sum, t) => sum + t.valor, 0);
      months.push({
        name: date.toLocaleString("pt-BR", { month: "short", year: "2-digit" }),
        receitas,
        despesas,
        fluxo: receitas - despesas,
      });
    }
    return months;
  }, [getTransactionsByDateRange]);

  // Expense by category (period)
  const expenseByCategory = useMemo(() => {
    const categoriesMap = periodTransactions
      .filter((t) => t.tipo === "saida")
      .reduce((acc, t) => {
        acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
        return acc;
      }, {} as Record<string, number>);
    return Object.entries(categoriesMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [periodTransactions]);

  // Payables helpers
  const overduePayables = useMemo(
    () => payables.filter((p) => new Date(p.data_vencimento) < new Date() && p.status === "pendente").length,
    [payables]
  );
  const pendingPayablesTotal = useMemo(
    () => payables.filter((p) => p.status === "pendente").reduce((sum, p) => sum + p.valor, 0),
    [payables]
  );

  // Receivables helpers
  const pendingReceivablesTotal = useMemo(
    () => receivables.filter((r) => r.status === "pendente").reduce((sum, r) => sum + r.valor, 0),
    [receivables]
  );

  // Smart insights
  const insights = useMemo(
    () =>
      generateInsights({
        receitas: periodSummary.receitas,
        despesas: periodSummary.despesas,
        fluxo: periodSummary.fluxo,
        margem: periodSummary.margem,
        prevReceitas: previousPeriodSummary.prevReceitas,
        prevDespesas: previousPeriodSummary.prevDespesas,
        monthlyFlowData,
        overduePayables,
      }),
    [periodSummary, previousPeriodSummary, monthlyFlowData, overduePayables]
  );

  // Recommendations
  const recommendations = useMemo(
    () =>
      generateRecommendations({
        receitas: periodSummary.receitas,
        despesas: periodSummary.despesas,
        fluxo: periodSummary.fluxo,
        margem: periodSummary.margem,
        expenseByCategory,
        overduePayables,
        totalPayablesPending: pendingPayablesTotal,
      }),
    [periodSummary, expenseByCategory, overduePayables, pendingPayablesTotal]
  );

  // Advanced indicators
  const liquidez = useMemo(
    () => calcularLiquidez(pendingReceivablesTotal, pendingPayablesTotal),
    [pendingReceivablesTotal, pendingPayablesTotal]
  );
  const pontoEquilibrio = useMemo(
    () => calcularPontoEquilibrio(periodSummary.despesas, periodSummary.margem),
    [periodSummary]
  );
  const valorNegocio = useMemo(() => estimarValorNegocio(monthlyFlowData), [monthlyFlowData]);
  const projecao30 = useMemo(() => projetarProximos30dias(monthlyFlowData), [monthlyFlowData]);

  // Hero card config
  const healthStatus = getMarginHealthStatus(periodSummary.margem);
  const heroColor =
    periodSummary.receitas === 0
      ? "#A1A1A1"
      : periodSummary.fluxo >= 0
      ? "#2DDB81"
      : "#F74C4C";
  const heroLabel =
    periodSummary.receitas === 0
      ? "Sem dados no período"
      : periodSummary.fluxo >= 0
      ? "Resultado positivo"
      : "Resultado negativo";
  const HeroIcon =
    periodSummary.receitas === 0
      ? Minus
      : periodSummary.fluxo >= 0
      ? TrendingUp
      : TrendingDown;

  // Table columns
  const transactionColumns: Column[] = [
    { key: "data", label: "Data", format: (v) => new Date(v).toLocaleDateString("pt-BR"), sortable: true },
    { key: "descricao", label: "Descrição", sortable: true },
    { key: "categoria", label: "Categoria", sortable: true },
    { key: "valor", label: "Valor", format: (v) => formatCurrency(v), sortable: true, align: "right" },
    { key: "tipo", label: "Tipo", format: (v) => (v === "entrada" ? "Receita" : "Despesa"), sortable: true },
  ];

  const payablesColumns: Column[] = [
    { key: "descricao", label: "Descrição", sortable: true },
    { key: "data_vencimento", label: "Vencimento", format: (v) => new Date(v).toLocaleDateString("pt-BR"), sortable: true },
    { key: "categoria", label: "Categoria", sortable: true },
    { key: "valor", label: "Valor", format: (v) => formatCurrency(v), sortable: true, align: "right" },
    { key: "status", label: "Status", format: (v) => (v === "pago" ? "✓ Pago" : "⏳ Pendente"), sortable: true },
  ];

  const handlePeriodChange = (newPeriod: any, dates: [Date, Date]) => {
    setPeriod(newPeriod);
    setDateRange(dates);
  };

  const exportData: ReportExportData = useMemo(
    () => ({
      period,
      dateRange,
      totalReceitas: periodSummary.receitas,
      totalDespesas: periodSummary.despesas,
      fluxoCaixa: periodSummary.fluxo,
      margemLiquida: periodSummary.margem,
      transactions: periodTransactions.map((t) => ({
        data: new Date(t.data).toLocaleDateString("pt-BR"),
        descricao: t.descricao || "-",
        categoria: t.categoria,
        tipo: t.tipo === "entrada" ? "Receita" : "Despesa",
        valor: t.valor,
      })),
      monthlyData: monthlyFlowData,
      expensesByCategory: expenseByCategory.reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {}),
      payablesTotal: payables.reduce((sum, p) => sum + p.valor, 0),
      payablesPending: pendingPayablesTotal,
      payablesPaid: payables.filter((p) => p.status === "pago").reduce((sum, p) => sum + p.valor, 0),
    }),
    [period, dateRange, periodSummary, periodTransactions, monthlyFlowData, expenseByCategory, payables, pendingPayablesTotal]
  );

  const handleExportExcel = () => {
    try { exportReportToExcel(exportData); }
    catch (error) { alert("Erro ao exportar Excel: " + (error instanceof Error ? error.message : "Desconhecido")); }
  };

  const handleExportPDF = () => {
    try { exportReportToPDF(exportData); }
    catch (error) { alert("Erro ao exportar PDF: " + (error instanceof Error ? error.message : "Desconhecido")); }
  };

  const tabs = [
    { id: "resumo", label: "Resumo" },
    { id: "receita-despesa", label: "Receita/Despesa" },
    { id: "fluxo", label: "Fluxo de Caixa" },
    { id: "propostas", label: "Propostas" },
    { id: "contas-pagar", label: "Contas a Pagar" },
  ] as const;

  // Proposals stats
  const proposalStats = useMemo(() => ({
    total: proposals.length,
    aprovadas: proposals.filter((p) => p.status === "aprovada").length,
    pagas: proposals.filter((p) => p.status === "paga").length,
    aguardando: proposals.filter((p) => p.status === "aguardando").length,
    vencidas: proposals.filter((p) => p.status === "vencida").length,
    recusadas: proposals.filter((p) => p.status === "recusada").length,
    valorTotal: proposals.reduce((s, p) => s + Number(p.valor), 0),
    valorAprovado: proposals.filter((p) => ["aprovada", "paga"].includes(p.status)).reduce((s, p) => s + Number(p.valor), 0),
    valorPago: proposals.filter((p) => p.status === "paga").reduce((s, p) => s + Number(p.valor), 0),
    taxaConversao: proposals.length > 0
      ? ((proposals.filter((p) => ["aprovada", "paga"].includes(p.status)).length / proposals.length) * 100)
      : 0,
  }), [proposals]);

  return (
    <div className="min-h-screen bg-[#141414] px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Relatórios Financeiros</h1>
          <p className="text-[#A1A1A1]">Visualize e analise seus dados financeiros em um período específico</p>
        </div>

        {/* Period Filter */}
        <div className="mb-8">
          <PeriodFilter onPeriodChange={handlePeriodChange} defaultPeriod="mes" />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-white/10 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#28A263] text-[#28A263]"
                    : "border-transparent text-[#A1A1A1] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>

          {/* ── RESUMO TAB ── */}
          {activeTab === "resumo" && (
            <div className="space-y-6">

              {/* Hero card */}
              <div
                className="rounded-2xl p-6 md:p-8 border"
                style={{ borderColor: heroColor + "33", background: heroColor + "11" }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <HeroIcon className="w-5 h-5" style={{ color: heroColor }} />
                      <span className="text-sm font-medium" style={{ color: heroColor }}>
                        {heroLabel}
                      </span>
                    </div>
                    <div className="text-4xl md:text-5xl font-bold mb-3" style={{ color: heroColor }}>
                      {formatCurrency(Math.abs(periodSummary.fluxo))}
                    </div>
                    <p className="text-[#A1A1A1] text-sm">
                      {periodSummary.receitas > 0
                        ? `${formatCurrency(periodSummary.receitas)} em receitas · ${formatCurrency(periodSummary.despesas)} em despesas · margem de ${formatPercentage(periodSummary.margem)}`
                        : "Nenhuma transação registrada neste período."}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    {periodSummary.receitas > 0 && (
                      <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                        style={{ background: heroColor + "22", color: heroColor }}
                      >
                        {healthStatus === "saudavel" && "Saudável"}
                        {healthStatus === "normal" && "Aceitável"}
                        {healthStatus === "baixa" && "Atenção"}
                        {healthStatus === "critica" && "Crítico"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ReportCard
                  title="Receitas"
                  value={periodSummary.receitas}
                  type="receita"
                  icon={<DollarSign className="w-6 h-6" />}
                  comparison={calculateGrowth(periodSummary.receitas, previousPeriodSummary.prevReceitas)}
                  subtitle={period === "mes" ? "Este mês" : "Neste período"}
                />
                <ReportCard
                  title="Despesas"
                  value={periodSummary.despesas}
                  type="despesa"
                  icon={<AlertCircle className="w-6 h-6" />}
                  comparison={calculateGrowth(periodSummary.despesas, previousPeriodSummary.prevDespesas)}
                  subtitle={period === "mes" ? "Este mês" : "Neste período"}
                />
                <ReportCard
                  title="Fluxo de Caixa"
                  value={periodSummary.fluxo}
                  type="fluxo"
                  icon={<TrendingUp className="w-6 h-6" />}
                  subtitle={period === "mes" ? "Este mês" : "Neste período"}
                />
                <ReportCard
                  title="Margem Líquida"
                  value={periodSummary.margem}
                  type="margem"
                  icon={<BarChart2 className="w-6 h-6" />}
                  subtitle={formatPercentage(periodSummary.margem)}
                />
              </div>

              {/* Insights + Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Insights */}
                <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-[#F4B23C]" />
                    <h3 className="font-semibold text-white">Análise do Período</h3>
                  </div>
                  {insights.length === 0 ? (
                    <p className="text-[#686F6F] text-sm">Sem dados suficientes para análise.</p>
                  ) : (
                    <ul className="space-y-3">
                      {insights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <span className="mt-0.5 flex-shrink-0 text-base">
                            {insight.type === "warning" ? "⚠️" : insight.type === "success" ? "✅" : "ℹ️"}
                          </span>
                          <span
                            className={
                              insight.type === "warning"
                                ? "text-[#F4B23C]"
                                : insight.type === "success"
                                ? "text-[#2DDB81]"
                                : "text-[#A1A1A1]"
                            }
                          >
                            {insight.message}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Recommendations */}
                <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-[#2DDB81]" />
                    <h3 className="font-semibold text-white">Recomendações</h3>
                  </div>
                  {recommendations.length === 0 ? (
                    <p className="text-[#686F6F] text-sm">Nenhuma recomendação no momento.</p>
                  ) : (
                    <ul className="space-y-3">
                      {recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <ChevronRight
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              rec.priority === "alta"
                                ? "text-[#F74C4C]"
                                : rec.priority === "media"
                                ? "text-[#F4B23C]"
                                : "text-[#2DDB81]"
                            }`}
                          />
                          <span className="text-[#A1A1A1]">{rec.action}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Advanced Indicators */}
              <div>
                <h3 className="text-sm font-medium text-[#A1A1A1] uppercase tracking-wider mb-3">
                  Indicadores Avançados
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Liquidez */}
                  <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-[#686F6F] mb-1">Índice de Cobertura</p>
                    <p
                      className="text-2xl font-bold mb-1"
                      style={{
                        color:
                          pendingPayablesTotal === 0 ? "#A1A1A1"
                          : liquidez >= 1.5 ? "#2DDB81"
                          : liquidez >= 1 ? "#F4B23C"
                          : "#F74C4C",
                      }}
                    >
                      {pendingPayablesTotal === 0 ? "—" : liquidez >= 99 ? "∞" : liquidez.toFixed(2) + "×"}
                    </p>
                    <p className="text-xs text-[#686F6F]">
                      {pendingPayablesTotal === 0
                        ? "Sem contas a pagar"
                        : liquidez >= 1
                        ? "A receber cobre as dívidas"
                        : "A receber não cobre as dívidas"}
                    </p>
                  </div>

                  {/* Ponto de equilíbrio */}
                  <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-[#686F6F] mb-1">Ponto de Equilíbrio</p>
                    <p className="text-2xl font-bold text-white mb-1">
                      {periodSummary.despesas > 0 ? formatCurrency(pontoEquilibrio) : "—"}
                    </p>
                    <p className="text-xs text-[#686F6F]">
                      {periodSummary.receitas >= pontoEquilibrio && periodSummary.despesas > 0
                        ? "Receita cobre as despesas ✓"
                        : periodSummary.despesas > 0
                        ? `Faltam ${formatCurrency(pontoEquilibrio - periodSummary.receitas)}`
                        : "Sem despesas no período"}
                    </p>
                  </div>

                  {/* Valor estimado do negócio */}
                  <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-[#686F6F] mb-1">Valor Estimado do Negócio</p>
                    <p className="text-2xl font-bold text-white mb-1">
                      {valorNegocio > 0 ? formatCurrency(valorNegocio) : "—"}
                    </p>
                    <p className="text-xs text-[#686F6F]">
                      {valorNegocio > 0 ? "Múltiplo de 12× lucro médio" : "Sem lucro nos últimos meses"}
                    </p>
                  </div>

                  {/* Projeção 30 dias */}
                  <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-[#686F6F] mb-1">Projeção 30 Dias</p>
                    <p
                      className="text-2xl font-bold mb-1"
                      style={{ color: projecao30.fluxo >= 0 ? "#2DDB81" : "#F74C4C" }}
                    >
                      {projecao30.receitas > 0 ? formatCurrency(projecao30.fluxo) : "—"}
                    </p>
                    <p className="text-xs text-[#686F6F]">
                      {projecao30.receitas > 0
                        ? `Média dos últimos 3 meses`
                        : "Sem histórico suficiente"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contas a pagar summary */}
              {payables.length > 0 && (
                <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">Contas a Pagar</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <CompactReportCard label="Total" value={payables.reduce((sum, p) => sum + p.valor, 0)} color="#FF9500" />
                    <CompactReportCard label="Pendentes" value={pendingPayablesTotal} color="#F74C4C" />
                    <CompactReportCard label="Pagas" value={payables.filter((p) => p.status === "pago").reduce((sum, p) => sum + p.valor, 0)} color="#28A263" />
                    <CompactReportCard
                      label="Vencidas"
                      value={overduePayables}
                      format={(v) => `${v} itens`}
                      color="#FF0000"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── RECEITA/DESPESA TAB ── */}
          {activeTab === "receita-despesa" && (
            <div className="space-y-8">
              <ReportChart
                title="Receitas vs Despesas (últimos 6 meses)"
                data={monthlyFlowData}
                dataKey="receitas"
                dataKey2="despesas"
                type="bar"
                height={350}
                xAxisKey="name"
              />
              {expenseByCategory.length > 0 && (
                <ReportChart
                  title="Despesas por Categoria"
                  data={expenseByCategory}
                  dataKey="value"
                  type="pie"
                  height={350}
                  xAxisKey="name"
                />
              )}
              <ReportTable
                title="Transações do Período"
                data={periodTransactions}
                columns={transactionColumns}
                itemsPerPage={15}
              />
            </div>
          )}

          {/* ── FLUXO TAB ── */}
          {activeTab === "fluxo" && (
            <div className="space-y-8">
              <ReportChart
                title="Fluxo de Caixa (últimos 6 meses)"
                data={monthlyFlowData}
                dataKey="fluxo"
                type="area"
                height={350}
                xAxisKey="name"
                colors={{ primary: periodSummary.fluxo >= 0 ? "#28A263" : "#F74C4C" }}
              />

              <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Resumo Mensal</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-white/10">
                      <tr>
                        <th className="text-left py-3 text-[#A1A1A1]">Mês</th>
                        <th className="text-right py-3 text-[#A1A1A1]">Receitas</th>
                        <th className="text-right py-3 text-[#A1A1A1]">Despesas</th>
                        <th className="text-right py-3 text-[#A1A1A1]">Fluxo</th>
                        <th className="text-right py-3 text-[#A1A1A1]">Margem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyFlowData
                        .filter((row) => row.receitas > 0 || row.despesas > 0)
                        .map((row, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 text-white">{row.name}</td>
                            <td className="text-right py-3 text-[#2DDB81]">{formatCurrency(row.receitas)}</td>
                            <td className="text-right py-3 text-[#F74C4C]">{formatCurrency(row.despesas)}</td>
                            <td
                              className="text-right py-3 font-medium"
                              style={{ color: row.fluxo >= 0 ? "#2DDB81" : "#F74C4C" }}
                            >
                              {formatCurrency(row.fluxo)}
                            </td>
                            <td className="text-right py-3 text-[#F4B23C]">
                              {row.receitas > 0 ? formatPercentage((row.fluxo / row.receitas) * 100) : "—"}
                            </td>
                          </tr>
                        ))}
                      {monthlyFlowData.every((r) => r.receitas === 0 && r.despesas === 0) && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-[#686F6F]">
                            Nenhuma transação nos últimos 6 meses
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── PROPOSTAS TAB ── */}
          {activeTab === "propostas" && (
            <div className="space-y-6">
              {loadingProposals ? (
                <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-8 text-center">
                  <p className="text-[#A1A1A1]">Carregando propostas…</p>
                </div>
              ) : proposals.length === 0 ? (
                <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-8 text-center">
                  <FileText className="w-12 h-12 text-[#686F6F] mx-auto mb-4" />
                  <p className="text-[#A1A1A1] text-lg mb-2">Nenhuma proposta criada ainda</p>
                  <p className="text-[#686F6F] text-sm">
                    Crie propostas no Gerador de Propostas e acompanhe o desempenho aqui.
                  </p>
                </div>
              ) : (
                <>
                  {/* Stats cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-[#686F6F] mb-1">Total de Propostas</p>
                      <p className="text-2xl font-bold text-white">{proposalStats.total}</p>
                    </div>
                    <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-[#686F6F] mb-1">Taxa de Conversão</p>
                      <p className="text-2xl font-bold text-[#2DDB81]">
                        {formatPercentage(proposalStats.taxaConversao)}
                      </p>
                    </div>
                    <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-[#686F6F] mb-1">Valor Aprovado</p>
                      <p className="text-2xl font-bold text-[#2DDB81]">
                        {formatCurrency(proposalStats.valorAprovado)}
                      </p>
                    </div>
                    <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-[#686F6F] mb-1">Valor Recebido</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(proposalStats.valorPago)}
                      </p>
                    </div>
                  </div>

                  {/* Status breakdown */}
                  <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Por Status</h3>
                    <div className="flex flex-wrap gap-3">
                      {(["aguardando", "aprovada", "paga", "recusada", "vencida"] as ProposalStatus[]).map((status) => {
                        const count = proposals.filter((p) => p.status === status).length;
                        if (count === 0) return null;
                        const cfg = STATUS_LABEL[status];
                        return (
                          <div key={status} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${cfg.color}`}>
                            <span>{cfg.label}</span>
                            <span className="font-bold">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Proposals table */}
                  <div className="bg-[#1B1B1B] border border-white/10 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-white/10">
                      <h3 className="font-semibold text-white">Todas as Propostas</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b border-white/10">
                          <tr>
                            <th className="text-left px-5 py-3 text-[#A1A1A1]">Cliente</th>
                            <th className="text-left px-5 py-3 text-[#A1A1A1]">Serviço</th>
                            <th className="text-right px-5 py-3 text-[#A1A1A1]">Valor</th>
                            <th className="text-left px-5 py-3 text-[#A1A1A1]">Data</th>
                            <th className="text-left px-5 py-3 text-[#A1A1A1]">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {proposals.map((p) => {
                            const cfg = STATUS_LABEL[p.status] ?? { label: p.status, color: "text-[#A1A1A1]" };
                            return (
                              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="px-5 py-3 text-white">{p.nome_cliente}</td>
                                <td className="px-5 py-3 text-[#A1A1A1]">{p.nome_servico}</td>
                                <td className="px-5 py-3 text-right text-[#2DDB81] font-medium">
                                  {formatCurrency(Number(p.valor))}
                                </td>
                                <td className="px-5 py-3 text-[#A1A1A1]">
                                  {new Date(p.created).toLocaleDateString("pt-BR")}
                                </td>
                                <td className="px-5 py-3">
                                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                                    {cfg.label}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── CONTAS A PAGAR TAB ── */}
          {activeTab === "contas-pagar" && (
            <div className="space-y-8">
              {payables.length > 0 ? (
                <ReportTable
                  title="Contas a Pagar"
                  data={payables}
                  columns={payablesColumns}
                  itemsPerPage={15}
                  rowColor={(row) => {
                    if (row.status === "pago") return "rgba(40, 162, 99, 0.1)";
                    if (new Date(row.data_vencimento) < new Date()) return "rgba(247, 76, 76, 0.1)";
                    return undefined;
                  }}
                />
              ) : (
                <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-[#28A263] mx-auto mb-4" />
                  <p className="text-[#A1A1A1] text-lg">Nenhuma conta a pagar registrada</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Export Buttons */}
        <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-8">
          <p className="text-[#A1A1A1] text-sm">Exportar relatório para análise externa</p>
          <ExportButtons
            filename={`relatorio_financeiro_${period}`}
            onExportExcel={handleExportExcel}
            onExportPDF={handleExportPDF}
          />
        </div>
      </div>
    </div>
  );
}
