import { useState, useMemo } from "react";
import { PieChart, TrendingUp, DollarSign, AlertCircle, CheckCircle, Crown, Lock } from "lucide-react";
import { useReports } from "../contexts/ReportsContext";
import { useCashFlow } from "../contexts/CashFlowContext";
import { usePayables } from "../contexts/PayablesContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { PeriodFilter } from "../components/reports/PeriodFilter";
import { ReportCard, CompactReportCard } from "../components/reports/ReportCard";
import { ReportChart } from "../components/reports/ReportChart";
import { ReportTable, Column } from "../components/reports/ReportTable";
import { ExportButtons } from "../components/reports/ExportButtons";
import { exportReportToExcel, exportReportToPDF } from "../utils/export";
import type { ReportExportData } from "../utils/export";
import {
  formatCurrency,
  formatPercentage,
  getMonthlyFlow,
  calculateGrowth,
  getExpenseByCategory,
} from "../utils/reportCalculations";

type TabType = "resumo" | "receita-despesa" | "fluxo" | "propostas" | "contas-pagar";

export function RelatoriosFinanceiros() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("resumo");
  const [period, setPeriod] = useState<"mes" | "trimestre" | "ano" | "custom" | "30dias">("mes");
  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()]);

  const { summary, getTransactionsByDateRange, getMonthlyFlow: getMonthlyFlowFn } = useReports();
  const { transactions } = useCashFlow();
  const { payables } = usePayables();

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

  // Get transactions for the selected period
  const periodTransactions = useMemo(
    () => getTransactionsByDateRange(dateRange[0], dateRange[1]),
    [dateRange, getTransactionsByDateRange]
  );

  // Calculate aggregations for current period
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

  // Calculate comparison with previous period
  const previousPeriodSummary = useMemo(() => {
    const daysDiff = Math.ceil(
      (dateRange[1].getTime() - dateRange[0].getTime()) / (1000 * 60 * 60 * 24)
    );
    const prevStart = new Date(dateRange[0]);
    prevStart.setDate(prevStart.getDate() - daysDiff);
    const prevEnd = new Date(dateRange[0]);
    prevEnd.setDate(prevEnd.getDate() - 1);

    const prevTx = getTransactionsByDateRange(prevStart, prevEnd);
    const prevReceitas = prevTx
      .filter((t) => t.tipo === "entrada")
      .reduce((sum, t) => sum + t.valor, 0);
    const prevDespesas = prevTx
      .filter((t) => t.tipo === "saida")
      .reduce((sum, t) => sum + t.valor, 0);

    return { prevReceitas, prevDespesas };
  }, [dateRange, getTransactionsByDateRange]);

  // Build monthly flow chart data (last 6 months)
  const monthlyFlowData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthTx = getTransactionsByDateRange(startOfMonth, endOfMonth);
      const receitas = monthTx
        .filter((t) => t.tipo === "entrada")
        .reduce((sum, t) => sum + t.valor, 0);
      const despesas = monthTx
        .filter((t) => t.tipo === "saida")
        .reduce((sum, t) => sum + t.valor, 0);

      months.push({
        name: date.toLocaleString("pt-BR", { month: "short", year: "2-digit" }),
        receitas,
        despesas,
        fluxo: receitas - despesas,
      });
    }
    return months;
  }, [getTransactionsByDateRange]);

  // Build expense by category
  const expenseByCategory = useMemo(() => {
    const categoriesMap = periodTransactions
      .filter((t) => t.tipo === "saida")
      .reduce(
        (acc, t) => {
          acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
          return acc;
        },
        {} as Record<string, number>
      );

    return Object.entries(categoriesMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [periodTransactions]);

  // Transaction table columns
  const transactionColumns: Column[] = [
    {
      key: "data",
      label: "Data",
      format: (v) => new Date(v).toLocaleDateString("pt-BR"),
      sortable: true,
    },
    { key: "descricao", label: "Descrição", sortable: true },
    { key: "categoria", label: "Categoria", sortable: true },
    {
      key: "valor",
      label: "Valor",
      format: (v) => formatCurrency(v),
      sortable: true,
      align: "right",
    },
    {
      key: "tipo",
      label: "Tipo",
      format: (v) => (v === "entrada" ? "Receita" : "Despesa"),
      sortable: true,
    },
  ];

  // Payables table columns
  const payablesColumns: Column[] = [
    {
      key: "descricao",
      label: "Descrição",
      sortable: true,
    },
    {
      key: "data_vencimento",
      label: "Vencimento",
      format: (v) => new Date(v).toLocaleDateString("pt-BR"),
      sortable: true,
    },
    {
      key: "categoria",
      label: "Categoria",
      sortable: true,
    },
    {
      key: "valor",
      label: "Valor",
      format: (v) => formatCurrency(v),
      sortable: true,
      align: "right",
    },
    {
      key: "status",
      label: "Status",
      format: (v) => (v === "pago" ? "✓ Pago" : "⏳ Pendente"),
      sortable: true,
    },
  ];

  const handlePeriodChange = (newPeriod: any, dates: [Date, Date]) => {
    setPeriod(newPeriod);
    setDateRange(dates);
  };

  // Build export data
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
      expensesByCategory: expenseByCategory.reduce(
        (acc, item) => ({ ...acc, [item.name]: item.value }),
        {}
      ),
      payablesTotal: payables.reduce((sum, p) => sum + p.valor, 0),
      payablesPending: payables
        .filter((p) => p.status === "pendente")
        .reduce((sum, p) => sum + p.valor, 0),
      payablesPaid: payables
        .filter((p) => p.status === "pago")
        .reduce((sum, p) => sum + p.valor, 0),
    }),
    [period, dateRange, periodSummary, periodTransactions, monthlyFlowData, expenseByCategory, payables]
  );

  const handleExportExcel = () => {
    try {
      exportReportToExcel(exportData);
    } catch (error) {
      alert("Erro ao exportar Excel: " + (error instanceof Error ? error.message : "Desconhecido"));
    }
  };

  const handleExportPDF = () => {
    try {
      exportReportToPDF(exportData);
    } catch (error) {
      alert("Erro ao exportar PDF: " + (error instanceof Error ? error.message : "Desconhecido"));
    }
  };

  const tabs = [
    { id: "resumo", label: "Resumo" },
    { id: "receita-despesa", label: "Receita/Despesa" },
    { id: "fluxo", label: "Fluxo de Caixa" },
    { id: "propostas", label: "Propostas" },
    { id: "contas-pagar", label: "Contas a Pagar" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#141414] px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Relatórios Financeiros</h1>
          <p className="text-[#A1A1A1]">
            Visualize e analise seus dados financeiros em um período específico
          </p>
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
          {/* RESUMO TAB */}
          {activeTab === "resumo" && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ReportCard
                  title="Receitas"
                  value={periodSummary.receitas}
                  type="receita"
                  icon={<DollarSign className="w-6 h-6" />}
                  comparison={calculateGrowth(
                    periodSummary.receitas,
                    previousPeriodSummary.prevReceitas
                  )}
                  subtitle={`${period === "mes" ? "Este mês" : "Neste período"}`}
                />
                <ReportCard
                  title="Despesas"
                  value={periodSummary.despesas}
                  type="despesa"
                  icon={<AlertCircle className="w-6 h-6" />}
                  comparison={calculateGrowth(
                    periodSummary.despesas,
                    previousPeriodSummary.prevDespesas
                  )}
                  subtitle={`${period === "mes" ? "Este mês" : "Neste período"}`}
                />
                <ReportCard
                  title="Fluxo de Caixa"
                  value={periodSummary.fluxo}
                  type="fluxo"
                  icon={<TrendingUp className="w-6 h-6" />}
                  subtitle={`${period === "mes" ? "Este mês" : "Neste período"}`}
                />
                <ReportCard
                  title="Margem Líquida"
                  value={periodSummary.margem}
                  type="margem"
                  icon={<PieChart className="w-6 h-6" />}
                  subtitle={formatPercentage(periodSummary.margem)}
                />
              </div>

              {/* Contas a Pagar Summary */}
              {payables.length > 0 && (
                <div className="bg-[#1B1B1B] border border-white/10 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Contas a Pagar</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <CompactReportCard
                      label="Total"
                      value={payables.reduce((sum, p) => sum + p.valor, 0)}
                      color="#FF9500"
                    />
                    <CompactReportCard
                      label="Pendentes"
                      value={payables
                        .filter((p) => p.status === "pendente")
                        .reduce((sum, p) => sum + p.valor, 0)}
                      color="#F74C4C"
                    />
                    <CompactReportCard
                      label="Pagas"
                      value={payables
                        .filter((p) => p.status === "pago")
                        .reduce((sum, p) => sum + p.valor, 0)}
                      color="#28A263"
                    />
                    <CompactReportCard
                      label="Vencidas"
                      value={payables.filter((p) => new Date(p.data_vencimento) < new Date() && p.status === "pendente").length}
                      format={(v) => `${v} itens`}
                      color="#FF0000"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RECEITA/DESPESA TAB */}
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

          {/* FLUXO TAB */}
          {activeTab === "fluxo" && (
            <div className="space-y-8">
              <ReportChart
                title="Fluxo de Caixa (últimos 6 meses)"
                data={monthlyFlowData}
                dataKey="fluxo"
                type="area"
                height={350}
                xAxisKey="name"
                colors={{
                  primary: periodSummary.fluxo >= 0 ? "#28A263" : "#F74C4C",
                }}
              />

              <div className="bg-[#1B1B1B] border border-white/10 rounded-lg p-6">
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
                      {monthlyFlowData.map((row, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 text-white">{row.name}</td>
                          <td className="text-right py-3 text-[#28A263]">
                            {formatCurrency(row.receitas)}
                          </td>
                          <td className="text-right py-3 text-[#F74C4C]">
                            {formatCurrency(row.despesas)}
                          </td>
                          <td
                            className="text-right py-3 font-medium"
                            style={{
                              color: row.fluxo >= 0 ? "#28A263" : "#F74C4C",
                            }}
                          >
                            {formatCurrency(row.fluxo)}
                          </td>
                          <td className="text-right py-3 text-[#F4B23C]">
                            {formatPercentage((row.fluxo / row.receitas) * 100)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PROPOSTAS TAB */}
          {activeTab === "propostas" && (
            <div className="space-y-8">
              <div className="bg-[#1B1B1B] border border-white/10 rounded-lg p-6 text-center">
                <p className="text-[#A1A1A1] text-lg">
                  📋 Relatório de propostas em desenvolvimento
                </p>
                <p className="text-[#686F6F] text-sm mt-2">
                  Integração com ProposalsContext em breve
                </p>
              </div>
            </div>
          )}

          {/* CONTAS A PAGAR TAB */}
          {activeTab === "contas-pagar" && (
            <div className="space-y-8">
              {payables.length > 0 ? (
                <>
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
                </>
              ) : (
                <div className="bg-[#1B1B1B] border border-white/10 rounded-lg p-8 text-center">
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
