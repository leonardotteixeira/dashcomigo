import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Crown,
  Lock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Target,
  Sparkles,
  FileSpreadsheet,
  FileText,
  Users,
  Building2,
  ChevronDown,
  BookOpen,
  LineChart as LineChartIcon,
  BrainCircuit,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useCashFlow } from "../contexts/CashFlowContext";
import { usePayables } from "../contexts/PayablesContext";
import { useReceivables } from "../contexts/ReceivablesContext";
import { useAuth } from "../contexts/AuthContext";
import { exportToXlsx } from "../../utils/exportXlsx";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtShort = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

function ptMonthName(yyyymm: string): string {
  const [y, m] = yyyymm.split("-");
  const names = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];
  return `${names[parseInt(m, 10) - 1]}/${y.slice(2)}`;
}

function addMonths(yyyymm: string, delta: number): string {
  const [y, m] = yyyymm.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const CATEGORY_COLORS = [
  "#10b981", "#3b82f6", "#8B5CF6", "#f59e0b",
  "#ef4444", "#06b6d4", "#ec4899", "#84cc16",
];

type TabId = "contador" | "economista" | "gestor";

// ─── Inline upgrade prompt for PRO-only tabs ─────────────────────────────────

function UpgradeTab({ tabName }: { tabName: string }) {
  const navigate = useNavigate();
  const descriptions: Record<string, string> = {
    Economista:
      "Análise preditiva, projeções para os próximos 3 meses, evolução de receitas e despesas, fluxo de caixa e métricas de performance.",
    Gestor:
      "Insights automáticos sobre seu negócio, KPIs do período, breakdown de receitas e despesas por categoria, e análise de clientes PF vs PJ.",
  };
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-amber-500" />
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
            Exclusivo Premium
          </span>
        </div>
        <h3 className="text-xl font-bold text-[#0E3B2E] mb-2">
          Visão {tabName}
        </h3>
        <p className="text-[#0E3B2E]/60 text-sm mb-6">
          {descriptions[tabName]}
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm"
        >
          Fazer Upgrade → R$ 9,90 no 1º mês
        </button>
        <p className="mt-2 text-xs text-[#0E3B2E]/40">
          Cancele quando quiser. Sem compromisso.
        </p>
      </div>
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────────────────

export function RelatoriosFinanceiros() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transactions } = useCashFlow();
  const { payables } = usePayables();
  const { receivables } = useReceivables();

  const isPro = user?.plan === "pro";

  useEffect(() => {
    localStorage.setItem("visited_relatorios", "1");
  }, []);

  const [period, setPeriod] = useState<"3" | "6" | "12">("6");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(isPro ? "gestor" : "contador");

  // ── date helpers ───────────────────────────────────────────────────────────
  const months = parseInt(period, 10);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const periodStart = new Date(today);
  periodStart.setMonth(periodStart.getMonth() - months);
  const periodStartStr = periodStart.toISOString().slice(0, 10);

  const prevPeriodStart = new Date(periodStart);
  prevPeriodStart.setMonth(prevPeriodStart.getMonth() - months);
  const prevPeriodStartStr = prevPeriodStart.toISOString().slice(0, 10);

  // ── filtered data ──────────────────────────────────────────────────────────
  const periodTx = transactions.filter(
    (t) => t.data >= periodStartStr && t.data <= todayStr
  );
  const prevTx = transactions.filter(
    (t) => t.data >= prevPeriodStartStr && t.data < periodStartStr
  );

  // ── KPIs ───────────────────────────────────────────────────────────────────
  const totalReceita = periodTx
    .filter((t) => t.tipo === "entrada")
    .reduce((s, t) => s + t.valor, 0);
  const totalDespesa = periodTx
    .filter((t) => t.tipo === "saida")
    .reduce((s, t) => s + t.valor, 0);
  const totalLucro = totalReceita - totalDespesa;
  const entradaCount = periodTx.filter((t) => t.tipo === "entrada").length;
  const ticketMedio = entradaCount > 0 ? totalReceita / entradaCount : 0;
  const margemLucro = totalReceita > 0 ? (totalLucro / totalReceita) * 100 : 0;

  const prevReceita = prevTx
    .filter((t) => t.tipo === "entrada")
    .reduce((s, t) => s + t.valor, 0);
  const prevDespesa = prevTx
    .filter((t) => t.tipo === "saida")
    .reduce((s, t) => s + t.valor, 0);
  const prevLucro = prevReceita - prevDespesa;

  const growthReceita =
    prevReceita > 0 ? ((totalReceita - prevReceita) / prevReceita) * 100 : 0;
  const growthDespesa =
    prevDespesa > 0 ? ((totalDespesa - prevDespesa) / prevDespesa) * 100 : 0;
  const growthLucro =
    prevLucro > 0
      ? ((totalLucro - prevLucro) / Math.abs(prevLucro)) * 100
      : 0;

  // ── monthly aggregation ────────────────────────────────────────────────────
  const monthlyMap: Record<string, { receitas: number; despesas: number }> = {};

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap[key] = { receitas: 0, despesas: 0 };
  }

  periodTx.forEach((t) => {
    const key = t.data.substring(0, 7);
    if (!monthlyMap[key]) return;
    if (t.tipo === "entrada") monthlyMap[key].receitas += t.valor;
    else monthlyMap[key].despesas += t.valor;
  });

  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({
      month,
      label: ptMonthName(month),
      receitas: v.receitas,
      despesas: v.despesas,
      lucro: v.receitas - v.despesas,
    }));

  // ── predictive forecast ────────────────────────────────────────────────────
  const avgMonthlyRevenue = months > 0 ? totalReceita / months : 0;
  const avgMonthlyExpense = months > 0 ? totalDespesa / months : 0;

  const firstMonth = monthlyData[0];
  const lastMonth = monthlyData[monthlyData.length - 1];
  const growthRate =
    monthlyData.length > 1 && firstMonth?.receitas > 0
      ? (lastMonth.receitas - firstMonth.receitas) /
        firstMonth.receitas /
        (monthlyData.length - 1)
      : 0;
  const expenseGrowthRate =
    monthlyData.length > 1 && firstMonth?.despesas > 0
      ? (lastMonth.despesas - firstMonth.despesas) /
        firstMonth.despesas /
        (monthlyData.length - 1)
      : 0;

  const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const forecast = [1, 2, 3].map((i) => {
    const rec = Math.max(0, avgMonthlyRevenue * (1 + growthRate * i));
    const desp = Math.max(0, avgMonthlyExpense * (1 + expenseGrowthRate * i));
    const monthKey = addMonths(currentMonthKey, i);
    return {
      month: monthKey,
      label: ptMonthName(monthKey),
      receitas: rec,
      despesas: desp,
      lucro: rec - desp,
      isForecast: true,
    };
  });

  const predictiveData = [
    ...monthlyData.map((m) => ({ ...m, isForecast: false })),
    ...forecast,
  ];

  // ── category breakdown ─────────────────────────────────────────────────────
  const revCatMap: Record<string, number> = {};
  periodTx
    .filter((t) => t.tipo === "entrada")
    .forEach((t) => {
      revCatMap[t.categoria] = (revCatMap[t.categoria] ?? 0) + t.valor;
    });
  const revCategoryData = Object.entries(revCatMap)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value], idx) => ({
      name,
      value,
      pct: totalReceita > 0 ? ((value / totalReceita) * 100).toFixed(1) : "0.0",
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));

  const expCatMap: Record<string, number> = {};
  periodTx
    .filter((t) => t.tipo === "saida")
    .forEach((t) => {
      expCatMap[t.categoria] = (expCatMap[t.categoria] ?? 0) + t.valor;
    });
  const expCategoryData = Object.entries(expCatMap)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value], idx) => ({
      name,
      value,
      pct: totalDespesa > 0 ? ((value / totalDespesa) * 100).toFixed(1) : "0.0",
      color: CATEGORY_COLORS[(idx + 3) % CATEGORY_COLORS.length],
    }));

  // ── PF vs PJ ───────────────────────────────────────────────────────────────
  const pfTotal = periodTx.filter((t) => t.pfpj === "PF").reduce((s, t) => s + t.valor, 0);
  const pjTotal = periodTx.filter((t) => t.pfpj === "PJ").reduce((s, t) => s + t.valor, 0);
  const pfpjTotal = pfTotal + pjTotal;
  const pfpjData = [
    {
      name: "Pessoa Física",
      value: pfTotal,
      pct: pfpjTotal > 0 ? ((pfTotal / pfpjTotal) * 100).toFixed(1) : "0.0",
      color: "#3b82f6",
    },
    {
      name: "Pessoa Jurídica",
      value: pjTotal,
      pct: pfpjTotal > 0 ? ((pjTotal / pfpjTotal) * 100).toFixed(1) : "0.0",
      color: "#8B5CF6",
    },
  ];

  // ── receivables & payables by month ───────────────────────────────────────
  const pendingReceivablesByMonth: Record<string, number> = {};
  receivables
    .filter((r) => r.status === "pendente")
    .forEach((r) => {
      const key = r.dataVencimento.substring(0, 7);
      pendingReceivablesByMonth[key] = (pendingReceivablesByMonth[key] ?? 0) + r.valor;
    });

  const pendingPayablesByMonth: Record<string, number> = {};
  payables
    .filter((p) => p.status === "pendente")
    .forEach((p) => {
      const key = p.dataVencimento.substring(0, 7);
      pendingPayablesByMonth[key] = (pendingPayablesByMonth[key] ?? 0) + p.valor;
    });

  const totalPendingReceivables = Object.values(pendingReceivablesByMonth).reduce((s, v) => s + v, 0);
  const totalPendingPayables = Object.values(pendingPayablesByMonth).reduce((s, v) => s + v, 0);

  // ── smart insights ─────────────────────────────────────────────────────────
  const insights: { type: "green" | "orange" | "red"; title: string; desc: string }[] = [];

  if (growthReceita > 10) {
    insights.push({
      type: "green",
      title: "Crescimento Forte",
      desc: `Suas receitas cresceram ${growthReceita.toFixed(1)}% em relação ao período anterior.`,
    });
  }
  if (margemLucro > 25) {
    insights.push({
      type: "green",
      title: "Margem Saudável",
      desc: `Margem de lucro de ${margemLucro.toFixed(1)}% — acima do benchmark de 25%.`,
    });
  }
  if (totalDespesa > totalReceita * 0.7 && totalReceita > 0) {
    insights.push({
      type: "orange",
      title: "Atenção com Custos",
      desc: `Despesas representam ${totalReceita > 0 ? ((totalDespesa / totalReceita) * 100).toFixed(1) : 0}% da receita. Monitore de perto.`,
    });
  }
  if (totalLucro < 0) {
    insights.push({
      type: "red",
      title: "Resultado Negativo",
      desc: `Prejuízo de ${fmt(Math.abs(totalLucro))} no período. Revise despesas com urgência.`,
    });
  }
  if (insights.length < 2) {
    if (ticketMedio > 0) {
      insights.push({
        type: "green",
        title: "Ticket Médio",
        desc: `Ticket médio de ${fmt(ticketMedio)} por transação de entrada no período.`,
      });
    } else {
      insights.push({
        type: "orange",
        title: "Sem Movimentações",
        desc: "Nenhuma movimentação encontrada no período selecionado.",
      });
    }
  }

  // ── recurring revenue estimate ─────────────────────────────────────────────
  const catFreq: Record<string, number> = {};
  periodTx.filter((t) => t.tipo === "entrada").forEach((t) => {
    catFreq[t.categoria] = (catFreq[t.categoria] ?? 0) + 1;
  });
  const recurringCats = Object.entries(catFreq).filter(([, count]) => count >= 2).map(([cat]) => cat);
  const recurringRevenue = periodTx
    .filter((t) => t.tipo === "entrada" && recurringCats.includes(t.categoria))
    .reduce((s, t) => s + t.valor, 0);
  const pctRecorrente =
    totalReceita > 0 ? ((recurringRevenue / totalReceita) * 100).toFixed(1) : "0.0";

  // ── receivables/payables per month for table ──────────────────────────────
  const recByMonth: Record<string, number> = {};
  receivables.filter((r) => r.status === "pendente").forEach((r) => {
    const key = r.dataVencimento.substring(0, 7);
    recByMonth[key] = (recByMonth[key] ?? 0) + r.valor;
  });

  const payByMonth: Record<string, number> = {};
  payables.filter((p) => p.status === "pendente").forEach((p) => {
    const key = p.dataVencimento.substring(0, 7);
    payByMonth[key] = (payByMonth[key] ?? 0) + p.valor;
  });

  // ── export handlers ────────────────────────────────────────────────────────
  function handleExportExcel() {
    exportToXlsx(
      [{ Receita: totalReceita, Despesa: totalDespesa, Lucro: totalLucro, Margem: margemLucro.toFixed(1) + "%", "Ticket Médio": ticketMedio.toFixed(2), Período: `${period} meses` }],
      `relatorio-resumo-${period}meses`
    );
    exportToXlsx(
      monthlyData.map((m) => ({ Mês: m.label, Receita: m.receitas, Despesa: m.despesas, Lucro: m.lucro, Margem: m.receitas > 0 ? ((m.lucro / m.receitas) * 100).toFixed(1) + "%" : "0%" })),
      `relatorio-mensal-${period}meses`
    );
  }

  function handleExportPdf() {
    window.print();
  }

  // ── tab config ─────────────────────────────────────────────────────────────
  const tabs: { id: TabId; label: string; icon: React.ReactNode; proOnly: boolean }[] = [
    { id: "contador", label: "Contador", icon: <BookOpen className="w-4 h-4" />, proOnly: false },
    { id: "economista", label: "Economista", icon: <LineChartIcon className="w-4 h-4" />, proOnly: true },
    { id: "gestor", label: "Gestor", icon: <BrainCircuit className="w-4 h-4" />, proOnly: true },
  ];

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 print:p-4">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {isPro && (
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">Premium</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-[#0E3B2E]">Relatórios Financeiros</h1>
          <p className="text-[#0E3B2E]/60 text-sm mt-0.5">
            {isPro
              ? "Análise completa com insights preditivos e inteligência financeira"
              : "Visão fiscal e obrigações — faça upgrade para análise completa"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {/* period dropdown */}
          <div className="relative">
            <button
              onClick={() => setPeriodOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 border border-[rgba(20,18,15,0.13)] rounded-xl text-sm font-medium text-[#0E3B2E] hover:bg-gray-50 transition-colors"
            >
              Últimos {period} meses
              <ChevronDown className="w-4 h-4" />
            </button>
            {periodOpen && (
              <div className="absolute right-0 top-full mt-1 border border-[rgba(20,18,15,0.13)] rounded-xl shadow-lg z-20 overflow-hidden min-w-[140px] bg-white">
                {(["3", "6", "12"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${period === p ? "font-semibold text-[#10b981]" : "text-[#0E3B2E]"}`}
                  >
                    {p} meses
                  </button>
                ))}
              </div>
            )}
          </div>

          {isPro && (
            <>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-sm font-medium transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </button>
              <button
                onClick={handleExportPdf}
                className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] hover:bg-[#0E3B2E] text-white rounded-xl text-sm font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Tab navigation ────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit">
        {tabs.map((tab) => {
          const locked = tab.proOnly && !isPro;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
              {locked && <Lock className="w-3 h-3 text-amber-500" />}
            </button>
          );
        })}
      </div>

      {/* ── Tab: CONTADOR (free + PRO) ────────────────────────────────────── */}
      {activeTab === "contador" && (
        <div className="space-y-6">

          {/* A Receber / A Pagar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* A Receber */}
            <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#0E3B2E]">A Receber (pendente)</h2>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">
                  {fmt(totalPendingReceivables)}
                </span>
              </div>
              {Object.keys(pendingReceivablesByMonth).length === 0 ? (
                <p className="text-[#0E3B2E]/40 text-sm text-center py-6">Nenhum recebimento pendente.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(pendingReceivablesByMonth)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([key, val]) => {
                      const [y, m] = key.split("-");
                      const display = `${m}/${y}`;
                      const pct = totalPendingReceivables > 0 ? (val / totalPendingReceivables) * 100 : 0;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-[#0E3B2E]/70">{display}</span>
                            <span className="font-semibold text-[#0E3B2E]">{fmt(val)}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-[rgba(20,18,15,0.13)] flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0E3B2E]">Total</span>
                <span className="text-base font-bold text-emerald-600">{fmt(totalPendingReceivables)}</span>
              </div>
            </div>

            {/* A Pagar */}
            <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#0E3B2E]">A Pagar (pendente)</h2>
                <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-semibold">
                  {fmt(totalPendingPayables)}
                </span>
              </div>
              {Object.keys(pendingPayablesByMonth).length === 0 ? (
                <p className="text-[#0E3B2E]/40 text-sm text-center py-6">Nenhum pagamento pendente.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(pendingPayablesByMonth)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([key, val]) => {
                      const [y, m] = key.split("-");
                      const display = `${m}/${y}`;
                      const pct = totalPendingPayables > 0 ? (val / totalPendingPayables) * 100 : 0;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-[#0E3B2E]/70">{display}</span>
                            <span className="font-semibold text-[#0E3B2E]">{fmt(val)}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-red-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-[rgba(20,18,15,0.13)] flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0E3B2E]">Total</span>
                <span className="text-base font-bold text-red-500">{fmt(totalPendingPayables)}</span>
              </div>
            </div>
          </div>

          {/* Tabela Mensal Detalhada */}
          <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
            <h2 className="text-base font-semibold text-[#0E3B2E] mb-4">Tabela Mensal Detalhada</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(20,18,15,0.13)]">
                    {["Mês", "Receita", "Despesa", "Lucro", "Margem", "A Receber", "A Pagar"].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-[#0E3B2E]/50 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((row, idx) => {
                    const margin = row.receitas > 0 ? ((row.lucro / row.receitas) * 100).toFixed(1) : "0.0";
                    const aReceber = recByMonth[row.month] ?? 0;
                    const aPagar = payByMonth[row.month] ?? 0;
                    return (
                      <tr key={row.month} className={`border-b border-[rgba(20,18,15,0.13)]/50 hover:bg-gray-50/50 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                        <td className="py-3 px-3 font-medium text-[#0E3B2E]">{row.label}</td>
                        <td className="py-3 px-3 text-emerald-600 font-medium">{fmt(row.receitas)}</td>
                        <td className="py-3 px-3 text-red-500 font-medium">{fmt(row.despesas)}</td>
                        <td className={`py-3 px-3 font-semibold ${row.lucro >= 0 ? "text-blue-600" : "text-red-500"}`}>{fmt(row.lucro)}</td>
                        <td className="py-3 px-3 text-[#0E3B2E]/70">{margin}%</td>
                        <td className="py-3 px-3 text-emerald-600">{aReceber > 0 ? fmt(aReceber) : "–"}</td>
                        <td className="py-3 px-3 text-red-500">{aPagar > 0 ? fmt(aPagar) : "–"}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[rgba(20,18,15,0.13)] bg-gray-50">
                    <td className="py-3 px-3 font-bold text-[#0E3B2E]">TOTAL</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{fmt(totalReceita)}</td>
                    <td className="py-3 px-3 font-bold text-red-500">{fmt(totalDespesa)}</td>
                    <td className={`py-3 px-3 font-bold ${totalLucro >= 0 ? "text-blue-600" : "text-red-500"}`}>{fmt(totalLucro)}</td>
                    <td className="py-3 px-3 font-bold text-[#0E3B2E]">{margemLucro.toFixed(1)}%</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{totalPendingReceivables > 0 ? fmt(totalPendingReceivables) : "–"}</td>
                    <td className="py-3 px-3 font-bold text-red-500">{totalPendingPayables > 0 ? fmt(totalPendingPayables) : "–"}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Upgrade nudge for free users */}
          {!isPro && (
            <div className="border border-amber-200 bg-amber-50 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-amber-800 text-sm">Desbloqueie as abas Economista e Gestor</p>
                <p className="text-amber-700/70 text-xs mt-0.5">Análise preditiva, gráficos avançados, insights e KPIs — disponíveis no plano Premium.</p>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Fazer upgrade
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: ECONOMISTA (PRO only) ────────────────────────────────────── */}
      {activeTab === "economista" && (
        isPro ? (
          <div className="space-y-6">
            {/* Análise Preditiva */}
            <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-5 h-5 text-[#8B5CF6]" />
                <h2 className="text-base font-semibold text-[#0E3B2E]">Análise Preditiva – Próximos 3 Meses</h2>
              </div>
              <p className="text-xs text-[#0E3B2E]/50 mb-4">
                Linhas sólidas = histórico · linhas tracejadas = projeção
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={predictiveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="label" stroke="#9CA3AF" fontSize={11} tick={{ fill: "#6B7280" }} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tick={{ fill: "#6B7280" }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(value: number) => fmt(value)}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="receitas" stroke="#10b981" strokeWidth={2} name="Receitas"
                    dot={(props: any) => { const { cx, cy, payload } = props; return payload.isForecast ? <circle key={`r-${payload.month}`} cx={cx} cy={cy} r={4} fill="#10b981" stroke="#fff" strokeWidth={2} /> : <circle key={`r-${payload.month}`} cx={cx} cy={cy} r={3} fill="#10b981" />; }}
                  />
                  <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} name="Despesas"
                    dot={(props: any) => { const { cx, cy, payload } = props; return payload.isForecast ? <circle key={`d-${payload.month}`} cx={cx} cy={cy} r={4} fill="#ef4444" stroke="#fff" strokeWidth={2} /> : <circle key={`d-${payload.month}`} cx={cx} cy={cy} r={3} fill="#ef4444" />; }}
                  />
                  <Line type="monotone" dataKey="lucro" stroke="#3b82f6" strokeWidth={2} name="Lucro"
                    dot={(props: any) => { const { cx, cy, payload } = props; return payload.isForecast ? <circle key={`l-${payload.month}`} cx={cx} cy={cy} r={4} fill="#3b82f6" stroke="#fff" strokeWidth={2} /> : <circle key={`l-${payload.month}`} cx={cx} cy={cy} r={3} fill="#3b82f6" />; }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Forecast cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {forecast.map((f) => {
                const margin = f.receitas > 0 ? (f.lucro / f.receitas) * 100 : 0;
                return (
                  <div key={f.month} className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-sm font-semibold text-[#0E3B2E]/60 uppercase tracking-wide">{f.label}</span>
                      <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Projeção</span>
                    </div>
                    <p className="text-xl font-bold text-[#0E3B2E]">{fmt(f.lucro)}</p>
                    <p className="text-xs text-[#0E3B2E]/50 mt-0.5">lucro previsto</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-[#0E3B2E]/60">
                      <span>Receita: {fmtShort(f.receitas)}</span>
                      <span>Margem: {margin.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bar chart evolução */}
            <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
              <h2 className="text-base font-semibold text-[#0E3B2E] mb-4">Evolução de Receitas, Despesas e Lucro</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="label" stroke="#9CA3AF" fontSize={11} tick={{ fill: "#6B7280" }} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tick={{ fill: "#6B7280" }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", fontSize: "12px" }} formatter={(value: number) => fmt(value)} />
                  <Legend />
                  <Bar dataKey="receitas" fill="#10b981" radius={[6, 6, 0, 0]} name="Receitas" />
                  <Bar dataKey="despesas" fill="#ef4444" radius={[6, 6, 0, 0]} name="Despesas" />
                  <Bar dataKey="lucro" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Lucro" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Area chart fluxo de caixa */}
            <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
              <h2 className="text-base font-semibold text-[#0E3B2E] mb-4">Fluxo de Caixa – Entradas vs Saídas</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="gradReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="label" stroke="#9CA3AF" fontSize={11} tick={{ fill: "#6B7280" }} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tick={{ fill: "#6B7280" }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", fontSize: "12px" }} formatter={(value: number) => fmt(value)} />
                  <Legend />
                  <Area type="monotone" dataKey="receitas" stroke="#10b981" strokeWidth={2} fill="url(#gradReceitas)" name="Entradas" />
                  <Area type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} fill="url(#gradDespesas)" name="Saídas" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs text-[#0E3B2E]/60 font-medium mb-1">Margem de Lucro</p>
                <p className="text-2xl font-bold text-[#0E3B2E]">{margemLucro.toFixed(1)}%</p>
                <p className="text-xs text-[#0E3B2E]/40 mt-1">
                  {margemLucro > 25 ? "Acima do benchmark" : margemLucro > 10 ? "Na média do mercado" : "Abaixo do esperado"}
                </p>
              </div>
              <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-[#0E3B2E]/60 font-medium mb-1">Ticket Médio</p>
                <p className="text-2xl font-bold text-[#0E3B2E]">{fmtShort(ticketMedio)}</p>
                <p className="text-xs text-[#0E3B2E]/40 mt-1">por transação de entrada</p>
              </div>
              <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-xs text-[#0E3B2E]/60 font-medium mb-1">Taxa de Crescimento</p>
                <p className={`text-2xl font-bold ${growthReceita >= 0 ? "text-[#0E3B2E]" : "text-red-500"}`}>
                  {growthReceita >= 0 ? "+" : ""}{growthReceita.toFixed(1)}%
                </p>
                <p className="text-xs text-[#0E3B2E]/40 mt-1">receitas vs período anterior</p>
              </div>
              <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-[#0E3B2E]/60 font-medium mb-1">Receita Recorrente</p>
                <p className="text-2xl font-bold text-[#0E3B2E]">{pctRecorrente}%</p>
                <p className="text-xs text-[#0E3B2E]/40 mt-1">estimado por categorias repetidas</p>
              </div>
            </div>
          </div>
        ) : (
          <UpgradeTab tabName="Economista" />
        )
      )}

      {/* ── Tab: GESTOR (PRO only) ────────────────────────────────────────── */}
      {activeTab === "gestor" && (
        isPro ? (
          <div className="space-y-6">
            {/* Smart Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {insights.slice(0, 2).map((ins, i) => {
                const bgMap = { green: "bg-emerald-50 border-emerald-200", orange: "bg-amber-50 border-amber-200", red: "bg-red-50 border-red-200" };
                const iconBgMap = { green: "bg-emerald-100", orange: "bg-amber-100", red: "bg-red-100" };
                const textMap = { green: "text-emerald-700", orange: "text-amber-700", red: "text-red-700" };
                return (
                  <div key={i} className={`flex items-start gap-3 p-4 rounded-2xl border ${bgMap[ins.type]}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBgMap[ins.type]}`}>
                      <Sparkles className={`w-5 h-5 ${textMap[ins.type]}`} />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${textMap[ins.type]}`}>{ins.title}</p>
                      <p className={`text-sm mt-0.5 ${textMap[ins.type]} opacity-80`}>{ins.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[#0E3B2E]/60 font-medium">Receita Total</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#0E3B2E]">{fmtShort(totalReceita)}</p>
                <div className="flex items-center gap-1 mt-2">
                  {growthReceita >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                  <span className={`text-xs font-medium ${growthReceita >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {growthReceita >= 0 ? "+" : ""}{growthReceita.toFixed(1)}%
                  </span>
                  <span className="text-xs text-[#0E3B2E]/40">vs período anterior</span>
                </div>
              </div>

              <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[#0E3B2E]/60 font-medium">Despesa Total</span>
                  <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#0E3B2E]">{fmtShort(totalDespesa)}</p>
                <div className="flex items-center gap-1 mt-2">
                  {growthDespesa <= 0 ? <TrendingDown className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingUp className="w-3.5 h-3.5 text-red-500" />}
                  <span className={`text-xs font-medium ${growthDespesa <= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {growthDespesa >= 0 ? "+" : ""}{growthDespesa.toFixed(1)}%
                  </span>
                  <span className="text-xs text-[#0E3B2E]/40">vs período anterior</span>
                </div>
              </div>

              <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[#0E3B2E]/60 font-medium">Lucro Líquido</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${totalLucro >= 0 ? "text-[#0E3B2E]" : "text-red-500"}`}>{fmtShort(totalLucro)}</p>
                <div className="flex items-center gap-1 mt-2">
                  {growthLucro >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                  <span className={`text-xs font-medium ${growthLucro >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {growthLucro >= 0 ? "+" : ""}{growthLucro.toFixed(1)}%
                  </span>
                  <span className="text-xs text-[#0E3B2E]/40">vs período anterior</span>
                </div>
              </div>

              <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[#0E3B2E]/60 font-medium">Margem de Lucro</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${margemLucro >= 0 ? "text-[#0E3B2E]" : "text-red-500"}`}>{margemLucro.toFixed(1)}%</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min(Math.max(margemLucro, 0), 100)}%`, backgroundColor: margemLucro > 25 ? "#10b981" : margemLucro > 10 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                  <p className="text-xs text-[#0E3B2E]/40 mt-1">
                    {margemLucro > 25 ? "Margem saudável" : margemLucro > 10 ? "Margem moderada" : "Margem baixa"}
                  </p>
                </div>
              </div>
            </div>

            {/* Category breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
                <h2 className="text-base font-semibold text-[#0E3B2E] mb-4">Receitas por Categoria</h2>
                {revCategoryData.length === 0 ? (
                  <p className="text-[#0E3B2E]/40 text-sm text-center py-8">Sem dados de receitas no período.</p>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <ResponsiveContainer width={160} height={160}>
                        <PieChart>
                          <Pie data={revCategoryData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={72}>
                            {revCategoryData.map((entry, index) => <Cell key={`rev-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      {revCategoryData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2 min-w-0">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-[#0E3B2E]/70 truncate flex-1">{item.name}</span>
                          <span className="text-xs font-semibold text-[#0E3B2E] flex-shrink-0">{item.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
                <h2 className="text-base font-semibold text-[#0E3B2E] mb-4">Despesas por Categoria</h2>
                {expCategoryData.length === 0 ? (
                  <p className="text-[#0E3B2E]/40 text-sm text-center py-8">Sem dados de despesas no período.</p>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <ResponsiveContainer width={160} height={160}>
                        <PieChart>
                          <Pie data={expCategoryData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={72}>
                            {expCategoryData.map((entry, index) => <Cell key={`exp-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      {expCategoryData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2 min-w-0">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-[#0E3B2E]/70 truncate flex-1">{item.name}</span>
                          <span className="text-xs font-semibold text-[#0E3B2E] flex-shrink-0">{item.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PF vs PJ */}
            <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6">
              <h2 className="text-base font-semibold text-[#0E3B2E] mb-4">Clientes: Pessoa Física vs Jurídica</h2>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie data={pfpjData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                        {pfpjData.map((entry, index) => <Cell key={`pfpj-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[#0E3B2E]/60 font-medium">Pessoa Física</p>
                      <p className="text-lg font-bold text-[#0E3B2E]">{fmtShort(pfTotal)}</p>
                      <p className="text-xs text-blue-600 font-semibold">{pfpjData[0].pct}% do total</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[#0E3B2E]/60 font-medium">Pessoa Jurídica</p>
                      <p className="text-lg font-bold text-[#0E3B2E]">{fmtShort(pjTotal)}</p>
                      <p className="text-xs text-purple-600 font-semibold">{pfpjData[1].pct}% do total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <UpgradeTab tabName="Gestor" />
        )
      )}
    </div>
  );
}
