import { useMemo } from "react";
import { useNavigate } from "react-router";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Target,
  Sparkles,
  User,
  Building2,
  Wallet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import { useCashFlow } from "../contexts/CashFlowContext";
import { ObligationsProvider } from "../contexts/ObligationsContext";
import UpgradeCard from "../components/UpgradeCard";
import StreakCard from "../components/StreakCard";
import DailyInsights from "../components/DailyInsights";
import QuickActions from "../components/QuickActions";
import AchievementCard from "../components/AchievementCard";
import OnboardingChecklist from "../components/OnboardingChecklist";
import WelcomeBackModal from "../components/WelcomeBackModal";
import UsageLimitCard from "../components/UsageLimitCard";
import { PageHeader } from "../components/PageHeader";
import { KPICard } from "../components/KPICard";
import { KPISection } from "../components/KPISection";

function buildCashFlowChart(transactions: any[]) {
  return Array.from({ length: 4 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (3 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const month = d.toLocaleDateString("pt-BR", { month: "short" });
    const receitas = transactions
      .filter((t) => t.tipo === "entrada" && t.data.startsWith(key))
      .reduce((s: number, t: any) => s + t.valor, 0);
    const despesas = transactions
      .filter((t) => t.tipo === "saida" && t.data.startsWith(key))
      .reduce((s: number, t: any) => s + t.valor, 0);
    return { month, receitas, despesas };
  });
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { summary, insights, transactions } = useCashFlow();

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Bom dia" : currentHour < 18 ? "Boa tarde" : "Boa noite";
  const firstName = user?.name?.split(" ")[0] ?? "usuário";

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

  const cashFlowData = useMemo(() => buildCashFlowChart(transactions), [transactions]);

  const recentTransactions = transactions.slice(0, 4);

  const alerts = insights.slice(0, 3).map((ins, i) => ({
    id: i,
    message: ins.mensagem,
    type: ins.tipo === "alerta" ? "warning" : "success",
    action: "Ver detalhes",
  }));

  return (
    <ObligationsProvider>
      <div className="space-y-8">
        <WelcomeBackModal />

        {/* Header */}
        <PageHeader
          title={`${greeting}, ${firstName}! 👋`}
          description="Aqui está o resumo do seu negócio hoje"
          badge={
            user?.plan === "pro"
              ? { text: "Plano PRO", color: "blue" }
              : undefined
          }
        />

        {/* Usage limit card */}
        <UsageLimitCard />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider text-[#001529]/60 font-medium">Saldo Atual</p>
              <div className="w-11 h-11 rounded-xl bg-[#003a6d]/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#003a6d]" />
              </div>
            </div>
            <p className="financial-medium text-[#001529] mb-2">{fmt(summary.saldoAtual)}</p>
            <div className={`flex items-center gap-1.5 text-sm font-medium ${summary.saldoAtual >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
              {summary.saldoAtual >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{summary.saldoAtual >= 0 ? "Saldo positivo" : "Saldo negativo"}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider text-[#001529]/60 font-medium">Receitas (mês)</p>
              <div className="w-11 h-11 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#10b981]" />
              </div>
            </div>
            <p className="financial-medium text-[#001529] mb-2">{fmt(summary.totalEntradas)}</p>
            <div className="flex items-center gap-1.5 text-sm text-[#10b981] font-medium">
              <ArrowUpRight className="w-4 h-4" />
              <span>Total do mês</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider text-[#001529]/60 font-medium">Despesas (mês)</p>
              <div className="w-11 h-11 rounded-xl bg-[#ef4444]/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-[#ef4444]" />
              </div>
            </div>
            <p className="financial-medium text-[#001529] mb-2">{fmt(summary.totalSaidas)}</p>
            <div className="flex items-center gap-1.5 text-sm text-[#001529]/60 font-medium">
              <span>Total do mês</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider text-[#001529]/60 font-medium">Lucro Líquido</p>
              <div className="w-11 h-11 rounded-xl bg-[#003a6d]/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#003a6d]" />
              </div>
            </div>
            <p className="financial-medium text-[#001529] mb-2">{fmt(summary.lucro)}</p>
            <div className={`flex items-center gap-1.5 text-sm font-medium ${summary.lucro >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
              {summary.lucro >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{summary.lucro >= 0 ? "Resultado positivo" : "Resultado negativo"}</span>
            </div>
          </div>
        </div>

        {/* Onboarding Checklist */}
        <OnboardingChecklist />

        {/* Engagement Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StreakCard />
          <QuickActions />
          <UpgradeCard variant="compact" />
        </div>

        {/* Daily Insights */}
        <DailyInsights />

        {/* Insights and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investment suggestion */}
          <div className="bg-gradient-to-br from-[#001529] via-[#002140] to-[#003a6d] text-white rounded-2xl p-7 shadow-md">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Guia de Investimentos</h3>
                <p className="text-sm text-white/90">
                  Aprenda a fazer seu dinheiro trabalhar por você
                </p>
              </div>
            </div>
            <div className="space-y-3 mb-5">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Reserva de Emergência</span>
                  <span className="text-sm font-medium">6 meses</span>
                </div>
                <p className="text-xs text-white/80">Proteja seu negócio de imprevistos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Investimento Curto Prazo</span>
                  <span className="text-sm font-medium">~110% CDI</span>
                </div>
                <p className="text-xs text-white/80">Liquidez diária com rendimento</p>
              </div>
            </div>
            <button
              className="w-full bg-white text-[#003a6d] font-semibold py-3 rounded-xl hover:bg-white/95 transition-all shadow-sm"
              onClick={() => navigate("/app/investimentos")}
            >
              Ver Guia Completo
            </button>
          </div>

          {/* Achievements */}
          <AchievementCard />
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB]">
              <div className="flex items-center gap-2 mb-5">
                <AlertCircle className="w-5 h-5 text-[#f59e0b]" />
                <h3 className="font-bold text-lg text-[#001529]">Alertas Importantes</h3>
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 rounded-xl bg-[#F5F7FA]">
                    <div className={`w-2 h-2 rounded-full mt-2 ${alert.type === "warning" ? "bg-[#f59e0b]" : "bg-[#10b981]"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#001529] font-medium mb-1.5">{alert.message}</p>
                      <button className="text-sm text-[#003a6d] hover:underline font-medium">{alert.action}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cash Flow Chart */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-[#001529] mb-1">Fluxo de Caixa</h3>
              <p className="text-sm text-[#001529]/60 font-medium">Receitas vs Despesas (últimos 4 meses)</p>
            </div>
            <button
              className="text-sm text-[#003a6d] hover:underline font-semibold"
              onClick={() => navigate("/app")}
            >
              Ver completo
            </button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }}
                formatter={(v: number) => [fmt(v)]}
              />
              <Legend />
              <Bar dataKey="receitas" fill="#10b981" radius={[8, 8, 0, 0]} name="Receitas" />
              <Bar dataKey="despesas" fill="#EF4444" radius={[8, 8, 0, 0]} name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-[#001529]">Transações Recentes</h3>
            <button
              className="text-sm text-[#003a6d] hover:underline font-semibold"
              onClick={() => navigate("/app")}
            >
              Ver todas
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-10 text-[#001529]/50">
              <p className="text-sm">Nenhuma transação registrada ainda.</p>
              <button
                className="mt-2 text-[#003a6d] text-sm font-medium hover:underline"
                onClick={() => navigate("/app")}
              >
                Adicionar transação
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F5F7FA] transition-all">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${t.tipo === "entrada" ? "bg-[#10b981]/10" : "bg-[#ef4444]/10"}`}>
                    {t.tipo === "entrada" ? (
                      <ArrowUpRight className="w-5 h-5 text-[#10b981]" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-[#ef4444]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-[#001529]">{t.descricao || t.categoria}</p>
                      {t.pf_pj_type && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                          t.pf_pj_type === "pf" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {t.pf_pj_type === "pf" ? <User className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                          {t.pf_pj_type.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#001529]/60 font-medium">
                      {new Date(t.data).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <p className={`font-bold text-lg ${t.tipo === "entrada" ? "text-[#10b981]" : "text-[#ef4444]"}`}
                     style={{ fontVariantNumeric: "tabular-nums" }}>
                    {t.tipo === "entrada" ? "+" : "-"}{fmt(t.valor)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ObligationsProvider>
  );
}
