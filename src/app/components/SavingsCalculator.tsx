import { PiggyBank, Clock, Zap, TrendingUp, CheckCircle, Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useCashFlow } from "../contexts/CashFlowContext";

// ─── PRO panel: shows real value the user is already getting ─────────────────

function ProValuePanel() {
  const navigate = useNavigate();
  const { summary, transactions } = useCashFlow();

  const totalTransactions = transactions.length;
  const avgMonthlyRevenue = summary.monthlyEntradas;
  const monthlyProfit = summary.monthlyLucro;
  const profitMargin = summary.margemLucro;

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const highlights = [
    {
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      label: "Receita este mês",
      value: fmt(avgMonthlyRevenue),
    },
    {
      icon: PiggyBank,
      color: "text-blue-600",
      bg: "bg-blue-50",
      label: "Lucro este mês",
      value: fmt(monthlyProfit),
    },
    {
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
      label: "Margem de lucro",
      value: `${profitMargin.toFixed(1)}%`,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <Crown className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground leading-tight">Seu Plano PRO</h3>
          <p className="text-xs text-muted-foreground">Acesso completo ativo</p>
        </div>
      </div>

      {/* Key metrics from real data */}
      <div className="space-y-3 mb-4">
        {highlights.map((h) => {
          const Icon = h.icon;
          return (
            <div key={h.label} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${h.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${h.color}`} />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{h.label}</p>
                <p className="text-sm font-bold text-foreground">{h.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border pt-4 mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Lançamentos registrados</span>
          <span className="font-semibold text-foreground">{totalTransactions}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Relatórios", "Propostas", "Metas", "Simuladores", "Estoque"].map((f) => (
            <span key={f} className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              <CheckCircle className="w-3 h-3" /> {f}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate("/app/relatorios")}
        className="mt-auto w-full flex items-center justify-center gap-2 bg-[#0E3B2E] text-white font-semibold py-3 rounded-lg hover:bg-[#0E3B2E] transition-all text-sm"
      >
        Ver relatórios completos <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── FREE panel: upsell (unchanged) ──────────────────────────────────────────

function FreeUpsellPanel() {
  const navigate = useNavigate();
  const monthlySavings = 320;
  const annualSavings = monthlySavings * 12;
  const proCost = 29.9;
  const netAnnualSavings = annualSavings - proCost * 12;

  const benefits = [
    { icon: Clock,      title: "Economize 10h/mês",     description: "Automação de tarefas repetitivas",      color: "text-accent",   bgColor: "bg-accent/10" },
    { icon: TrendingUp, title: "Otimize gastos",         description: "IA identifica onde você pode economizar", color: "text-success", bgColor: "bg-success/10" },
    { icon: Zap,        title: "Decisões mais rápidas",  description: "Insights em tempo real",                 color: "text-warning", bgColor: "bg-warning/10" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <PiggyBank className="w-5 h-5 text-success" />
        <h3 className="font-semibold text-foreground">Potencial de Economia com PRO</h3>
      </div>

      <div className="bg-gradient-to-br from-success/10 to-primary/10 border border-success/20 rounded-xl p-5 mb-4">
        <p className="text-sm text-muted-foreground mb-1">Economia Anual Estimada</p>
        <p className="font-bold text-foreground mb-2" style={{ fontSize: "2rem" }}>
          R$ {netAnnualSavings.toLocaleString("pt-BR")}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Economias identificadas</p>
            <p className="font-semibold text-success">+R$ {annualSavings.toLocaleString("pt-BR")}/ano</p>
          </div>
          <div>
            <p className="text-muted-foreground">Investimento PRO</p>
            <p className="font-semibold text-foreground">
              -R$ {(proCost * 12).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/ano
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${b.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${b.color}`} />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground mb-0.5">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/pricing")}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all"
      >
        Começar Teste Grátis de 7 Dias
      </button>
      <p className="text-xs text-center text-muted-foreground mt-3">
        Sem compromisso • Cancele quando quiser
      </p>
    </div>
  );
}

// ─── Export: automatically picks the right panel based on plan ───────────────

export default function SavingsCalculator() {
  const { user } = useAuth();
  return user?.plan === "pro" ? <ProValuePanel /> : <FreeUpsellPanel />;
}
