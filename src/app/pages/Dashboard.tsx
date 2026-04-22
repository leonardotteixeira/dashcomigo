import { useMemo } from "react";
import { useNavigate } from "react-router";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Calendar,
  Users,
  Target,
  Sparkles,
  PiggyBank,
  Building2,
  User,
  Banknote,
} from "lucide-react";
import {
  LineChart,
  Line,
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
import { useFinancialMetrics } from "../../utils/useFinancialMetrics";
import { ObligationsProvider } from "../contexts/ObligationsContext";
import UpgradeCard from "../components/UpgradeCard";
import StreakCard from "../components/StreakCard";
import DailyInsights from "../components/DailyInsights";
import QuickActions from "../components/QuickActions";
import PrioridadesDoDia from "../components/PrioridadesDoDia";
import InsightsInteligentes from "../components/InsightsInteligentes";
import AchievementCard from "../components/AchievementCard";
import OnboardingChecklist from "../components/OnboardingChecklist";
import WelcomeBackModal from "../components/WelcomeBackModal";
import SavingsCalculator from "../components/SavingsCalculator";
import UsageLimitCard from "../components/UsageLimitCard";
import PfPjDistribution from "../components/PfPjDistribution";
import { ProInsightsBar } from "../components/ProInsightsBar";
import { BankConnectionSelector } from "../components/BankConnectionSelector";
import { useOpenFinanceStatus } from "../hooks/useOpenFinanceStatus";

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
  const { connected: ofConnected, connectedAt: ofConnectedAt, loading: ofLoading, refresh: ofRefresh } = useOpenFinanceStatus(user?.id);
  const {
    saldoAtual,
    monthReceitas,
    monthDespesas,
    monthLucro,
    receitasGrowthPct,
    despesasGrowthPct,
    lucroGrowthPct,
    loading: metricsLoading,
    fmt,
  } = useFinancialMetrics();

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Bom dia" : currentHour < 18 ? "Boa tarde" : "Boa noite";
  const firstName = user?.name?.split(" ")[0] ?? "usuário";

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
      <div className="space-y-6">
        <WelcomeBackModal />

        {/* Smart Insights Bar — PRO only; replaces empty space left by hidden upgrade banner */}
        {user?.plan === "pro" && <ProInsightsBar />}

        {/* Header with personalized greeting */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-bold text-[#0E3B2E] mb-1">
              {greeting}, {firstName}! 👋
            </h1>
            <p className="text-[#0E3B2E]/60">
              Aqui está o resumo do seu negócio hoje
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#F4EFE6] px-3 py-1.5 rounded-full font-medium text-[#0E3B2E]/60">
              {user?.plan === "pro" ? "Plano PRO" : "Plano Gratuito"}
            </span>
          </div>
        </div>

        {/* NOVO: Card de Limitação - Destaque no topo */}
        <UsageLimitCard />

        {/* KPI Cards - Premium Financial Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Saldo Atual */}
          <div className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border border-[rgba(20,18,15,0.13)]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider text-[#0E3B2E]/60 font-medium">Saldo Atual</p>
              <div className="w-11 h-11 rounded-xl bg-[#0E3B2E]/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#0E3B2E]" />
              </div>
            </div>
            {metricsLoading ? (
              <div className="h-7 w-32 bg-[rgba(20,18,15,0.13)] rounded-lg animate-pulse mb-2" />
            ) : (
              <p className="financial-medium text-[#0E3B2E] mb-2">{fmt(saldoAtual)}</p>
            )}
            <div className={`flex items-center gap-1.5 text-sm font-medium ${saldoAtual >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
              {saldoAtual >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{saldoAtual >= 0 ? "Saldo positivo" : "Saldo negativo"}</span>
            </div>
          </div>

          {/* Receitas (mês) */}
          <div className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border border-[rgba(20,18,15,0.13)]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider text-[#0E3B2E]/60 font-medium">Receitas (mês)</p>
              <div className="w-11 h-11 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#10b981]" />
              </div>
            </div>
            {metricsLoading ? (
              <div className="h-7 w-32 bg-[rgba(20,18,15,0.13)] rounded-lg animate-pulse mb-2" />
            ) : (
              <p className="financial-medium text-[#0E3B2E] mb-2">{fmt(monthReceitas)}</p>
            )}
            {metricsLoading ? (
              <div className="h-4 w-24 bg-[rgba(20,18,15,0.13)] rounded animate-pulse" />
            ) : (
              <div className={`flex items-center gap-1 text-xs font-medium ${receitasGrowthPct >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                {receitasGrowthPct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{receitasGrowthPct >= 0 ? "+" : ""}{receitasGrowthPct.toFixed(1)}% vs mês anterior</span>
              </div>
            )}
          </div>

          {/* Despesas (mês) */}
          <div className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border border-[rgba(20,18,15,0.13)]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider text-[#0E3B2E]/60 font-medium">Despesas (mês)</p>
              <div className="w-11 h-11 rounded-xl bg-[#ef4444]/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-[#ef4444]" />
              </div>
            </div>
            {metricsLoading ? (
              <div className="h-7 w-32 bg-[rgba(20,18,15,0.13)] rounded-lg animate-pulse mb-2" />
            ) : (
              <p className="financial-medium text-[#0E3B2E] mb-2">{fmt(monthDespesas)}</p>
            )}
            {metricsLoading ? (
              <div className="h-4 w-24 bg-[rgba(20,18,15,0.13)] rounded animate-pulse" />
            ) : (
              <div className={`flex items-center gap-1 text-xs font-medium ${despesasGrowthPct >= 0 ? "text-[#ef4444]" : "text-[#10b981]"}`}>
                {despesasGrowthPct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{despesasGrowthPct >= 0 ? "+" : ""}{despesasGrowthPct.toFixed(1)}% vs mês anterior</span>
              </div>
            )}
          </div>

          {/* Lucro Líquido */}
          <div className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border border-[rgba(20,18,15,0.13)]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider text-[#0E3B2E]/60 font-medium">Lucro Líquido</p>
              <div className="w-11 h-11 rounded-xl bg-[#0E3B2E]/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#0E3B2E]" />
              </div>
            </div>
            {metricsLoading ? (
              <div className="h-7 w-32 bg-[rgba(20,18,15,0.13)] rounded-lg animate-pulse mb-2" />
            ) : (
              <p className="financial-medium text-[#0E3B2E] mb-2">{fmt(monthLucro)}</p>
            )}
            {metricsLoading ? (
              <div className="h-4 w-24 bg-[rgba(20,18,15,0.13)] rounded animate-pulse" />
            ) : (
              <div className={`flex items-center gap-1 text-xs font-medium ${lucroGrowthPct >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                {lucroGrowthPct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{lucroGrowthPct >= 0 ? "+" : ""}{lucroGrowthPct.toFixed(1)}% vs mês anterior</span>
              </div>
            )}
          </div>
        </div>

        {/* Open Finance - DESATIVADO até integração completa */}
        {false && !ofLoading && !ofConnected && (
          <div className="bg-gradient-to-r from-[#0066FF] to-[#0052CC] rounded-2xl p-6 shadow-md text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Conectar seu Banco</h3>
                    <p className="text-sm text-white/90">Importe transações automaticamente via Open Finance</p>
                  </div>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  Sincronize seus dados bancários com segurança e veja PF/PJ classificados automaticamente
                </p>
              </div>
              <BankConnectionSelector
                userId={user?.id || ''}
                onSuccess={() => {
                  ofRefresh();
                  window.location.reload();
                }}
              />
            </div>
          </div>
        )}

        {false && !ofLoading && ofConnected && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 shadow-md text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">✅ Open Finance Conectado</h3>
                  <p className="text-sm text-white/90">
                    Seus dados bancários estão sendo sincronizados automaticamente
                    {ofConnectedAt && ` · Conectado em ${new Date(ofConnectedAt).toLocaleDateString('pt-BR')}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/app/investimentos')}
                className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                Ver Carteira →
              </button>
            </div>
          </div>
        )}

        {/* Onboarding Checklist */}
        <OnboardingChecklist />

        {/* Engagement Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StreakCard />
          <QuickActions />
          <PrioridadesDoDia />
        </div>

        {/* Daily Insights */}
        <DailyInsights />

        {/* Row: Investment Guide + Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Investment guide */}
          <div className="bg-gradient-to-br from-[#0E3B2E] via-[#0E3B2E] to-[#0E3B2E] text-white rounded-2xl p-7 shadow-md">
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
              className="w-full bg-white text-[#0E3B2E] font-semibold py-3 rounded-xl hover:bg-white/95 transition-all shadow-sm"
              onClick={() => navigate("/app/investimentos")}
            >
              Ver Guia Completo
            </button>
          </div>

          {/* Achievements */}
          <AchievementCard />
        </div>

        {/* Row: Insights/Upsell + PF vs PJ — no empty gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PRO → Insights Inteligentes | FREE → Upgrade card */}
          {user?.plan === "pro" ? (
            <InsightsInteligentes />
          ) : (
            <UpgradeCard variant="compact" />
          )}

          {/* PF vs PJ Distribution */}
          <PfPjDistribution />
        </div>

        {/* Alerts */}
        <div className="bg-[#EBE4D6] rounded-2xl p-7 shadow-sm border border-[rgba(20,18,15,0.13)]">
          <div className="flex items-center gap-2 mb-5">
            <AlertCircle className="w-5 h-5 text-[#f59e0b]" />
            <h3 className="font-bold text-lg text-[#0E3B2E]">Alertas Importantes</h3>
          </div>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-[#0E3B2E]/50 py-4 text-center">Nenhum alerta no momento</p>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 p-4 rounded-xl bg-[#F4EFE6]">
                  <div className={`w-2 h-2 rounded-full mt-2 ${alert.type === "warning" ? "bg-[#f59e0b]" : "bg-[#10b981]"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0E3B2E] font-medium mb-1.5">{alert.message}</p>
                    <button className="text-sm text-[#0E3B2E] hover:underline font-medium">{alert.action}</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cash Flow Chart and Savings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl p-7 shadow-sm border border-[rgba(20,18,15,0.13)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-[#0E3B2E] mb-1">
                  Fluxo de Caixa
                </h3>
                <p className="text-sm text-[#0E3B2E]/60 font-medium">
                  Receitas vs Despesas (últimos 4 meses)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-[#0E3B2E] text-white shadow-sm">
                  4 meses
                </button>
                <button className="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-[#F4EFE6] text-[#0E3B2E] transition-colors">
                  Ano
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="receitas" fill="#10b981" radius={[8, 8, 0, 0]} name="Receitas" />
                <Bar dataKey="despesas" fill="#EF4444" radius={[8, 8, 0, 0]} name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Savings Calculator */}
          <SavingsCalculator />
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#EBE4D6] rounded-2xl p-7 shadow-sm border border-[rgba(20,18,15,0.13)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-[#0E3B2E]">Transações Recentes</h3>
            <button
              className="text-sm text-[#0E3B2E] hover:underline font-semibold"
              onClick={() => navigate("/app")}
            >
              Ver todas
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-10 text-[#0E3B2E]/50">
              <p className="text-sm">Nenhuma transação registrada ainda.</p>
              <button
                className="mt-2 text-[#0E3B2E] text-sm font-medium hover:underline"
                onClick={() => navigate("/app")}
              >
                Adicionar transação
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F4EFE6] transition-all">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${t.tipo === "entrada" ? "bg-[#10b981]/10" : "bg-[#ef4444]/10"}`}>
                    {t.tipo === "entrada" ? (
                      <ArrowUpRight className="w-5 h-5 text-[#10b981]" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-[#ef4444]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-[#0E3B2E]">{t.descricao || t.categoria}</p>
                      {t.pfpj && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                          t.pfpj === "PF" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {t.pfpj === "PF" ? <User className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                          {t.pfpj}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#0E3B2E]/60 font-medium">
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
