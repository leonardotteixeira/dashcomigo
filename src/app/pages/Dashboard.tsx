import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Crown,
  Wallet,
  Filter,
  Download,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useCashFlow } from "../contexts/CashFlowContext";
import { usePFPJ } from "../contexts/PFPJContext";
import { ObligationsProvider } from "../contexts/ObligationsContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { motion } from "motion/react";

const MEI_LIMIT_ANNUAL = 81000;

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildFaturamentoData(transactions: any[]) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("pt-BR", { month: "short" });
    const valor = transactions
      .filter((t) => t.tipo === "entrada" && t.data.startsWith(key))
      .reduce((s: number, t: any) => s + t.valor, 0);
    return { mes: label, valor, projecao: undefined as number | undefined };
  });

  const values = months.map((m) => m.valor);
  const nonZero = values.filter((v) => v > 0);
  let growthRate = 0.05;
  if (nonZero.length >= 2) {
    const rates = nonZero.slice(1).map((v, i) => (v - nonZero[i]) / Math.max(nonZero[i], 1));
    growthRate = Math.max(-0.1, Math.min(0.3, rates.reduce((a, b) => a + b, 0) / rates.length));
  }

  const lastReal = months[months.length - 1].valor;
  months[months.length - 1].projecao = lastReal;

  for (let i = 1; i <= 3; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    const label = d.toLocaleDateString("pt-BR", { month: "short" });
    months.push({
      mes: label,
      valor: undefined as any,
      projecao: lastReal * Math.pow(1 + growthRate, i),
    });
  }

  return { data: months, growthRate };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { summary, insights, transactions } = useCashFlow();
  const { pfpjSummary, getVerifiedPlan } = usePFPJ();
  const [viewMode, setViewMode] = useState<"integrated" | "separated">("integrated");
  const [selectedPeriod, setSelectedPeriod] = useState("6m");

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

  const { data: faturamentoData } = useMemo(
    () => buildFaturamentoData(transactions),
    [transactions]
  );

  // Get display data based on view mode
  const displaySummary = viewMode === "separated" ? pfpjSummary : summary;
  const saldoAtual = viewMode === "separated" ? pfpjSummary.pj?.balance ?? 0 : summary.saldoAtual;
  const totalEntradas = viewMode === "separated" ? pfpjSummary.pj?.totalIncoming ?? 0 : summary.totalEntradas;
  const totalSaidas = viewMode === "separated" ? pfpjSummary.pj?.totalOutgoing ?? 0 : summary.totalSaidas;

  const meiPercentage = summary.totalEntradas > 0
    ? (summary.totalEntradas / MEI_LIMIT_ANNUAL) * 100
    : 0;

  const limitStatus = getVerifiedPlan();

  // Filter transactions for display
  const displayTransactions = viewMode === "separated"
    ? transactions.filter((t) => t.pf_pj_type === "pj")
    : transactions;

  const recentTransactions = displayTransactions.slice(0, 10);

  const chartStyle = {
    cartesian: "rgba(0,0,0,0.1)",
    axis: "rgba(0,21,41,0.6)",
    tooltip: {
      background: "#FFFFFF",
      border: "1px solid rgba(0,0,0,0.1)",
      borderRadius: "12px",
      color: "#001529",
    },
  };

  return (
    <ObligationsProvider>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Header with Fluxo de Caixa Title ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-[#001529]">Fluxo de Caixa</h1>
            <p className="text-[rgba(0,21,41,0.6)] mt-1">
              Controle suas entradas e saídas
            </p>
          </div>

          {/* Toggle: Integrado vs Separado */}
          <div className="flex items-center gap-2 bg-[#F8F9FA] p-1 rounded-xl border border-[rgba(0,0,0,0.1)]">
            <button
              onClick={() => setViewMode("integrated")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === "integrated"
                  ? "bg-white text-[#001529] border border-[rgba(0,0,0,0.1)]"
                  : "text-[rgba(0,21,41,0.6)] hover:text-[#001529]"
              }`}
            >
              Integrado
            </button>
            <button
              onClick={() => setViewMode("separated")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === "separated"
                  ? "bg-white text-[#001529] border border-[rgba(0,0,0,0.1)]"
                  : "text-[rgba(0,21,41,0.6)] hover:text-[#001529]"
              }`}
            >
              Separado PF/PJ
            </button>
          </div>
        </motion.div>

        {/* ── MEI Alert Banner ── */}
        {meiPercentage > 80 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4"
          >
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">
                {meiPercentage > 100
                  ? "Você ultrapassou o limite MEI!"
                  : `Você está em ${meiPercentage.toFixed(0)}% do limite MEI`}
              </h3>
              <p className="text-sm text-red-800 mb-3">
                {meiPercentage > 100
                  ? "Seu faturamento ultrapassou o limite anual. Cada mês sem migrar para ME custa mais em impostos."
                  : "Você está se aproximando do limite anual de R$ 81.000. Considere planejar a migração para ME."}
              </p>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => navigate("/app/mei-me")}
              >
                Simular MEI → ME <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Quick Stats: 3 Cards (Saldo, Entradas, Saídas) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4"
        >
          {/* Saldo Atual */}
          <div className="p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] hover:border-[#28A263]/30 transition-colors">
            <p className="text-[rgba(0,21,41,0.6)] text-sm font-medium mb-2">Saldo Atual</p>
            <p className="text-3xl font-bold text-[#001529]">{fmt(saldoAtual)}</p>
            <p className="text-xs text-[rgba(0,21,41,0.5)] mt-2">Disponível agora</p>
          </div>

          {/* Entradas */}
          <div className="p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] hover:border-[#28A263]/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[rgba(0,21,41,0.6)] text-sm font-medium">Entradas</p>
              <TrendingUp className="w-4 h-4 text-[#28A263]" />
            </div>
            <p className="text-3xl font-bold text-[#28A263]">{fmt(totalEntradas)}</p>
            <p className="text-xs text-[rgba(0,21,41,0.5)] mt-2">Este mês</p>
          </div>

          {/* Saídas */}
          <div className="p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] hover:border-red-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[rgba(0,21,41,0.6)] text-sm font-medium">Saídas</p>
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-500">{fmt(totalSaidas)}</p>
            <p className="text-xs text-[rgba(0,21,41,0.5)] mt-2">Este mês</p>
          </div>
        </motion.div>

        {/* ── Insights / Alerts ── */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  insight.tipo === "alerta"
                    ? "bg-red-50 border-red-200"
                    : insight.tipo === "sucesso"
                      ? "bg-[#28A263]/10 border-[#28A263]/20"
                      : "bg-blue-50 border-blue-200"
                }`}
              >
                <CheckCircle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    insight.tipo === "alerta"
                      ? "text-red-600"
                      : insight.tipo === "sucesso"
                        ? "text-[#28A263]"
                        : "text-blue-600"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-medium ${
                      insight.tipo === "alerta"
                        ? "text-red-800"
                        : insight.tipo === "sucesso"
                          ? "text-[#28A263]"
                          : "text-blue-800"
                    }`}
                  >
                    {insight.icone} {insight.mensagem}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Análise do Período ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.1)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#001529]">Análise do Período</h2>
              <p className="text-sm text-[rgba(0,21,41,0.6)] mt-1">Últimos 6 meses + próximos 3 meses (projeção)</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#001529] bg-[#F8F9FA] hover:bg-[#F5F7FA] rounded-lg border border-[rgba(0,0,0,0.1)] transition-colors">
                <Calendar className="w-4 h-4" />
                Período
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#001529] bg-[#F8F9FA] hover:bg-[#F5F7FA] rounded-lg border border-[rgba(0,0,0,0.1)] transition-colors">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>

          {transactions.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={faturamentoData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#28A263" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#28A263" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.cartesian} vertical={false} />
                <XAxis dataKey="mes" stroke={chartStyle.axis} style={{ fontSize: "12px" }} />
                <YAxis stroke={chartStyle.axis} style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={chartStyle.tooltip}
                  formatter={(value) => (typeof value === "number" ? fmt(value) : value)}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#28A263"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-center">
              <p className="text-[rgba(0,21,41,0.6)]">Nenhuma transação registrada ainda</p>
            </div>
          )}
        </motion.div>

        {/* ── Últimas Transações ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.1)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-[#001529]">Últimas Transações</h2>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                onClick={() => navigate("/app")}
                className="bg-[#28A263] hover:bg-[#20915a] text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Entrada
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/app")}
                className="border-[rgba(0,0,0,0.1)] text-[#001529] hover:bg-[#F8F9FA] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Saída
              </Button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#001529] bg-[#F8F9FA] hover:bg-[#F5F7FA] rounded-lg border border-[rgba(0,0,0,0.1)] transition-colors">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-[#F8F9FA] transition-colors border border-transparent hover:border-[rgba(0,0,0,0.05)]">
                  <div className="flex-1">
                    <p className="font-medium text-[#001529]">{t.descricao}</p>
                    <p className="text-xs text-[rgba(0,21,41,0.6)]">
                      {new Date(t.data).toLocaleDateString("pt-BR")}
                      {t.pf_pj_type === "pj" && " • PJ"}
                      {t.pf_pj_type === "pf" && " • PF"}
                    </p>
                  </div>
                  <p
                    className={`font-semibold text-lg ${
                      t.tipo === "entrada" ? "text-[#28A263]" : "text-red-500"
                    }`}
                  >
                    {t.tipo === "entrada" ? "+" : "-"}
                    {fmt(t.valor)}
                  </p>
                </div>
              ))}
              <button
                onClick={() => navigate("/app")}
                className="w-full mt-4 py-3 text-[#0066FF] hover:text-[#003fa6] font-medium flex items-center justify-center gap-2 transition-colors"
              >
                Ver todas as transações <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[rgba(0,21,41,0.6)] mb-4">Nenhuma transação registrada</p>
              <Button
                onClick={() => navigate("/app")}
                className="bg-[#28A263] hover:bg-[#20915a] text-white"
              >
                Adicionar primeira transação
              </Button>
            </div>
          )}
        </motion.div>

        {/* ── Upgrade CTA ── */}
        {user?.plan === "free" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 bg-gradient-to-r from-[#28A263]/10 to-[#0066FF]/10 rounded-2xl border border-[#28A263]/20"
          >
            <div className="flex items-start gap-4">
              <Crown className="w-6 h-6 text-[#28A263] flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-[#001529] text-lg mb-1">Upgrade para PRO</h3>
                <p className="text-sm text-[rgba(0,21,41,0.6)] mb-4">
                  Desbloqueie lançamentos ilimitados, relatórios avançados e mais ferramentas premium
                </p>
                <Button
                  onClick={() => navigate("/checkout")}
                  className="bg-[#28A263] hover:bg-[#20915a] text-white"
                >
                  Ver Planos <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </ObligationsProvider>
  );
}
