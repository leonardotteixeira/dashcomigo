import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router";
import { useCashFlow } from "../contexts/CashFlowContext";
import { useFinancialMetrics } from "../../utils/useFinancialMetrics";
import { useReceivables } from "../contexts/ReceivablesContext";
import { usePayables } from "../contexts/PayablesContext";

export default function FinancialInsights() {
  const navigate = useNavigate();
  const { summary, transactions } = useCashFlow();
  const { monthReceitas, monthDespesas, despesasGrowthPct, receitasGrowthPct, fmt } = useFinancialMetrics();
  const { receivables } = useReceivables();
  const { payables } = usePayables();

  // Generate dynamic insights
  const generateInsights = () => {
    const insights = [];

    // 1. Expense trend analysis
    if (despesasGrowthPct > 15) {
      insights.push({
        id: "expense-trend",
        title: "Custo operacional em alta",
        message: `Suas despesas aumentaram ${despesasGrowthPct.toFixed(1)}% comparado ao mês anterior. Revise suas maiores categorias de gastos.`,
        icon: AlertTriangle,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        type: "warning",
      });
    } else if (despesasGrowthPct < -10) {
      insights.push({
        id: "expense-down",
        title: "Redução de custos",
        message: `Excelente! Suas despesas caíram ${Math.abs(despesasGrowthPct).toFixed(1)}%. Continue assim!`,
        icon: TrendingDown,
        color: "text-green-600",
        bgColor: "bg-green-50",
        type: "success",
      });
    }

    // 2. Revenue growth analysis
    if (receitasGrowthPct > 20) {
      insights.push({
        id: "revenue-growth",
        title: "Receita em crescimento",
        message: `Sua receita subiu ${receitasGrowthPct.toFixed(1)}% este mês! Aproveite para expandir seu negócio.`,
        icon: TrendingUp,
        color: "text-green-600",
        bgColor: "bg-green-50",
        type: "success",
      });
    } else if (receitasGrowthPct < -10) {
      insights.push({
        id: "revenue-decline",
        title: "Receita em queda",
        message: `Atenção! Sua receita caiu ${Math.abs(receitasGrowthPct).toFixed(1)}%. Revise sua estratégia de vendas.`,
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        type: "warning",
      });
    }

    // 3. Cash flow warning
    const overdueDays = 30;
    if (summary.saldoAtual < monthDespesas * 0.5) {
      insights.push({
        id: "low-cash-flow",
        title: "Atenção ao fluxo de caixa",
        message: `Seu saldo atual cobre apenas ${((summary.saldoAtual / monthDespesas) * 100).toFixed(0)}% das despesas do mês. Considere antecipar recebíveis.`,
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        type: "warning",
      });
    }

    // 4. Receivables optimization
    const pendingReceivables = receivables.filter((r) => r.status === "pendente");
    if (pendingReceivables.length > 3) {
      const totalPending = pendingReceivables.reduce((sum, r) => sum + r.valor, 0);
      insights.push({
        id: "pending-receivables",
        title: "Otimize suas cobranças",
        message: `Você tem ${fmt(totalPending)} em ${pendingReceivables.length} contas a receber pendentes. Acelere essas cobranças!`,
        icon: Lightbulb,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        type: "info",
      });
    }

    // 5. Investment opportunity
    const profitMargin = monthReceitas > 0 ? ((monthReceitas - monthDespesas) / monthReceitas) * 100 : 0;
    if (profitMargin > 30 && summary.saldoAtual > monthDespesas * 2) {
      insights.push({
        id: "investment-opp",
        title: "Oportunidade de investimento",
        message: `Sua margem de lucro está em ${profitMargin.toFixed(1)}%. Você tem recursos para investir com segurança.`,
        icon: TrendingUp,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        type: "success",
      });
    }

    return insights.slice(0, 3); // Max 3 insights
  };

  const insights = generateInsights();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-[#0E3B2E]">Insights Financeiros</h3>
          <p className="text-xs text-[#0E3B2E]/60">Análise inteligente dos seus dados</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.length > 0 ? (
          insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div key={insight.id} className={`p-4 rounded-xl border-l-4 ${insight.bgColor}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon className={`w-5 h-5 ${insight.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${insight.color}`}>{insight.title}</p>
                    <p className="text-sm text-[#0E3B2E]/70 mt-1">{insight.message}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-[#0E3B2E]/60">
              Adicione mais transações para gerar insights inteligentes
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/app/relatorios")}
        className="w-full mt-4 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Ver análise completa
      </button>
    </div>
  );
}
