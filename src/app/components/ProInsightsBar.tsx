/**
 * ProInsightsBar
 *
 * Shown above the Dashboard title for PRO users only.
 * Replaces the upgrade banner with a smart financial summary strip
 * and a dynamic contextual insight message driven by real data.
 *
 * For FREE users: renders the upgrade banner instead (handled in Dashboard).
 */
import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useFinancialMetrics } from "../../utils/useFinancialMetrics";

// ─── Insight engine ───────────────────────────────────────────────────────────

type InsightTone = "green" | "yellow" | "red" | "blue";

interface SmartInsight {
  tone: InsightTone;
  icon: typeof CheckCircle2;
  message: string;
}

function deriveInsight(
  monthLucro: number,
  monthReceitas: number,
  monthDespesas: number,
  receitasGrowthPct: number,
  despesasGrowthPct: number,
  lucroGrowthPct: number,
  saldoAtual: number,
  hasData: boolean,
): SmartInsight {
  if (!hasData) {
    return {
      tone: "blue",
      icon: Zap,
      message: "Comece adicionando transações para ver insights inteligentes sobre seu negócio.",
    };
  }

  const marginPct = monthReceitas > 0 ? (monthLucro / monthReceitas) * 100 : 0;
  const expenseRatio = monthReceitas > 0 ? (monthDespesas / monthReceitas) * 100 : 0;

  // Negative balance — highest priority warning
  if (saldoAtual < 0) {
    return {
      tone: "red",
      icon: AlertTriangle,
      message: `Seu saldo está negativo. Priorize recebimentos e reduza despesas para equilibrar o fluxo de caixa.`,
    };
  }

  // Strong profit growth
  if (lucroGrowthPct > 20 && monthLucro > 0) {
    return {
      tone: "green",
      icon: CheckCircle2,
      message: `Seu lucro cresceu ${lucroGrowthPct.toFixed(1)}% em relação ao mês anterior. Continue assim!`,
    };
  }

  // Revenue growing fast
  if (receitasGrowthPct > 15 && monthReceitas > 0) {
    return {
      tone: "green",
      icon: TrendingUp,
      message: `Receitas ${receitasGrowthPct > 0 ? "+" : ""}${receitasGrowthPct.toFixed(1)}% vs mês anterior. Seu negócio está crescendo.`,
    };
  }

  // Expenses rising faster than revenue
  if (despesasGrowthPct > receitasGrowthPct + 10 && monthDespesas > 0) {
    return {
      tone: "yellow",
      icon: AlertTriangle,
      message: `Suas despesas cresceram mais rápido do que as receitas este mês. Revise os gastos para manter a margem.`,
    };
  }

  // High expense ratio
  if (expenseRatio > 75 && monthReceitas > 0) {
    return {
      tone: "yellow",
      icon: AlertTriangle,
      message: `Despesas representam ${expenseRatio.toFixed(0)}% da receita este mês. Considere revisar seus custos operacionais.`,
    };
  }

  // Healthy margin
  if (marginPct >= 30) {
    return {
      tone: "green",
      icon: CheckCircle2,
      message: `Margem de lucro de ${marginPct.toFixed(1)}% — acima da média do setor. Sua saúde financeira está excelente.`,
    };
  }

  // Decent margin
  if (marginPct >= 15 && marginPct < 30) {
    return {
      tone: "blue",
      icon: Lightbulb,
      message: `Margem de ${marginPct.toFixed(1)}%. Há espaço para crescer — analise categorias de custo para otimizar resultados.`,
    };
  }

  // Profit decline
  if (lucroGrowthPct < -10) {
    return {
      tone: "red",
      icon: TrendingDown,
      message: `Lucro caiu ${Math.abs(lucroGrowthPct).toFixed(1)}% em relação ao mês anterior. Analise quais despesas aumentaram.`,
    };
  }

  // Default neutral positive
  return {
    tone: "blue",
    icon: Lightbulb,
    message: `Você está mantendo suas finanças sob controle. Continue registrando receitas e despesas regularmente.`,
  };
}

// ─── Tone config ─────────────────────────────────────────────────────────────

const TONE_STYLES: Record<InsightTone, { bg: string; border: string; text: string; iconBg: string; iconColor: string }> = {
  green: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  yellow: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
};

// ─── Stat item ────────────────────────────────────────────────────────────────

function StatItem({
  label,
  value,
  growth,
  icon: Icon,
  valueColor = "text-[#0E3B2E]",
  loading,
}: {
  label: string;
  value: string;
  growth?: number;
  icon: typeof DollarSign;
  valueColor?: string;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div className="w-8 h-8 rounded-lg border border-[rgba(20,18,15,0.13)] flex items-center justify-center flex-shrink-0 shadow-sm">
        <Icon className="w-4 h-4 text-[#0E3B2E]/50" />
      </div>
      <div>
        <p className="text-[10px] font-semibold text-[#0E3B2E]/40 uppercase tracking-wider leading-none mb-1">
          {label}
        </p>
        {loading ? (
          <div className="h-4 w-20 bg-[rgba(20,18,15,0.13)] rounded animate-pulse" />
        ) : (
          <div className="flex items-center gap-1.5">
            <p className={`text-sm font-bold leading-none ${valueColor}`}>{value}</p>
            {growth !== undefined && growth !== 0 && (
              <span
                className={`text-[10px] font-semibold leading-none ${
                  growth > 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {growth > 0 ? "▲" : "▼"} {Math.abs(growth).toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProInsightsBar() {
  const {
    saldoAtual,
    monthReceitas,
    monthDespesas,
    monthLucro,
    receitasGrowthPct,
    despesasGrowthPct,
    lucroGrowthPct,
    loading,
    fmt,
  } = useFinancialMetrics();

  const hasData = monthReceitas > 0 || monthDespesas > 0;

  const insight = useMemo(
    () =>
      deriveInsight(
        monthLucro,
        monthReceitas,
        monthDespesas,
        receitasGrowthPct,
        despesasGrowthPct,
        lucroGrowthPct,
        saldoAtual,
        hasData,
      ),
    [monthLucro, monthReceitas, monthDespesas, receitasGrowthPct, despesasGrowthPct, lucroGrowthPct, saldoAtual, hasData],
  );

  const tone = TONE_STYLES[insight.tone];
  const InsightIcon = insight.icon;

  return (
    <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl shadow-sm overflow-hidden">
      {/* Metrics strip */}
      <div className="flex items-stretch divide-x divide-[#F0F0F0] overflow-x-auto">
        <StatItem
          label="Saldo Atual"
          value={fmt(saldoAtual)}
          icon={DollarSign}
          valueColor={saldoAtual >= 0 ? "text-emerald-600" : "text-red-500"}
          loading={loading}
        />
        <StatItem
          label="Receitas (mês)"
          value={fmt(monthReceitas)}
          growth={receitasGrowthPct}
          icon={TrendingUp}
          valueColor="text-emerald-600"
          loading={loading}
        />
        <StatItem
          label="Despesas (mês)"
          value={fmt(monthDespesas)}
          growth={despesasGrowthPct}
          icon={TrendingDown}
          valueColor="text-red-500"
          loading={loading}
        />
        <StatItem
          label="Lucro (mês)"
          value={fmt(monthLucro)}
          growth={lucroGrowthPct}
          icon={BarChart3}
          valueColor={monthLucro >= 0 ? "text-emerald-600" : "text-red-500"}
          loading={loading}
        />

        {/* Insight message — fills remaining space */}
        <div
          className={`flex-1 flex items-center gap-3 px-5 py-3 min-w-[260px] ${tone.bg} border-l ${tone.border}`}
        >
          <div className={`w-8 h-8 rounded-lg ${tone.iconBg} flex items-center justify-center flex-shrink-0`}>
            <InsightIcon className={`w-4 h-4 ${tone.iconColor}`} />
          </div>
          {loading ? (
            <div className="space-y-1.5">
              <div className="h-3 w-48 bg-[rgba(20,18,15,0.13)] rounded animate-pulse" />
              <div className="h-3 w-32 bg-[rgba(20,18,15,0.13)] rounded animate-pulse" />
            </div>
          ) : (
            <p className={`text-xs font-medium leading-relaxed ${tone.text}`}>
              {insight.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
