import { TrendingUp, TrendingDown, AlertTriangle, Info, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useCashFlow } from "../contexts/CashFlowContext";
import { useReceivables } from "../contexts/ReceivablesContext";
import { useFinancialMetrics } from "../../utils/useFinancialMetrics";

type InsightType = "success" | "warning" | "info";

interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
}

const TYPE_CONFIG: Record<InsightType, { icon: React.ElementType; iconCls: string; dotCls: string }> = {
  success: { icon: TrendingUp, iconCls: "text-emerald-600", dotCls: "bg-emerald-500" },
  warning: { icon: AlertTriangle, iconCls: "text-amber-600", dotCls: "bg-amber-400" },
  info: { icon: Info, iconCls: "text-blue-600", dotCls: "bg-blue-500" },
};

export default function InsightsInteligentes() {
  const navigate = useNavigate();
  const { transactions } = useCashFlow();
  const { receivables } = useReceivables();
  const { monthReceitas, monthDespesas, despesasGrowthPct, receitasGrowthPct } = useFinancialMetrics();

  // ── Compute top category ────────────────────────────────────────────────────
  const expenseByCategory: Record<string, number> = {};
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  transactions
    .filter((t) => t.tipo === "saida" && t.data?.startsWith(monthKey))
    .forEach((t) => {
      const cat = t.categoria || "Outros";
      expenseByCategory[cat] = (expenseByCategory[cat] ?? 0) + t.valor;
    });

  const topCategory = Object.entries(expenseByCategory)
    .sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

  // ── Build insights ──────────────────────────────────────────────────────────
  const insights: Insight[] = [];

  // 1. Cost ratio
  const costRatio = monthReceitas > 0 ? (monthDespesas / monthReceitas) * 100 : 0;
  if (costRatio > 0) {
    insights.push({
      id: "cost-ratio",
      type: costRatio > 80 ? "warning" : costRatio > 60 ? "info" : "success",
      title:
        costRatio > 80
          ? `Custos em ${costRatio.toFixed(0)}% da receita — atenção!`
          : costRatio > 60
          ? `Seus custos representam ${costRatio.toFixed(0)}% da receita`
          : `Boa margem: custos em ${costRatio.toFixed(0)}% da receita`,
      description:
        costRatio > 80
          ? "Revise gastos para proteger sua margem de lucro."
          : costRatio > 60
          ? "Margem moderada. Tente reduzir custos variáveis."
          : "Margem saudável. Continue assim!",
    });
  }

  // 2. Revenue trend
  if (Math.abs(receitasGrowthPct) > 5) {
    insights.push({
      id: "revenue-trend",
      type: receitasGrowthPct > 0 ? "success" : "warning",
      title:
        receitasGrowthPct > 0
          ? `Receita subiu +${receitasGrowthPct.toFixed(1)}% este mês 🚀`
          : `Receita caiu ${Math.abs(receitasGrowthPct).toFixed(1)}% vs mês anterior`,
      description:
        receitasGrowthPct > 0
          ? "Ótimo crescimento! Considere reinvestir parte do lucro."
          : "Identifique o motivo e ajuste sua estratégia de vendas.",
    });
  }

  // 3. Expense trend
  if (despesasGrowthPct > 20) {
    insights.push({
      id: "expense-trend",
      type: "warning",
      title: `Despesas aumentaram ${despesasGrowthPct.toFixed(1)}% este mês`,
      description: topCategory
        ? `A maior concentração está em "${topCategory}".`
        : "Revise suas categorias para identificar o aumento.",
    });
  } else if (despesasGrowthPct < -10) {
    insights.push({
      id: "expense-down",
      type: "success",
      title: `Despesas reduziram ${Math.abs(despesasGrowthPct).toFixed(1)}% ✓`,
      description: "Boa redução de custos. Continue controlando os gastos.",
    });
  }

  // 4. Overdue receivables
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueCount = receivables.filter((r) => {
    if (r.status === "recebido") return false;
    try {
      const d = new Date(r.dataVencimento + "T00:00:00");
      return !isNaN(d.getTime()) && d < today;
    } catch {
      return false;
    }
  }).length;

  if (overdueCount > 0) {
    insights.push({
      id: "overdue",
      type: "warning",
      title: `${overdueCount} conta${overdueCount > 1 ? "s" : ""} a receber em atraso`,
      description: "Priorize a cobrança para manter o fluxo de caixa.",
    });
  }

  // 5. Top category (info)
  if (topCategory && insights.length < 3) {
    insights.push({
      id: "top-category",
      type: "info",
      title: `Maior gasto este mês: "${topCategory}"`,
      description: "Analise se esse custo está gerando retorno para o negócio.",
    });
  }

  // Fallback when there's not enough data
  if (insights.length === 0) {
    insights.push({
      id: "start",
      type: "info",
      title: "Adicione transações para ver insights",
      description: "Com mais dados, analisaremos tendências e oportunidades para você.",
    });
  }

  const displayed = insights.slice(0, 3);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-[#003a6d]" />
          <h3 className="font-bold text-[#001529]">Insights Inteligentes</h3>
        </div>
        <p className="text-xs text-[#001529]/50">Baseado nos seus dados recentes</p>
      </div>

      {/* Insights list */}
      <div className="space-y-3 flex-1">
        {displayed.map((insight) => {
          const { icon: Icon, iconCls, dotCls } = TYPE_CONFIG[insight.type];
          return (
            <div key={insight.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#F0F0F0]">
              <div className="flex-shrink-0 mt-0.5 relative">
                <Icon className={`w-4.5 h-4.5 ${iconCls}`} style={{ width: 18, height: 18 }} />
                <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${dotCls} border border-white`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#001529] leading-snug">{insight.title}</p>
                <p className="text-xs text-[#001529]/55 mt-0.5 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/app/relatorios")}
        className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-[#003a6d] hover:text-[#002a50] transition-colors"
      >
        Ver análise completa
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
