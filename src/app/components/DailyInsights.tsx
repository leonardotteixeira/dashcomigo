import { Sparkles, TrendingUp, AlertTriangle, Target, Lightbulb, TrendingDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useCashFlow } from "../contexts/CashFlowContext";
import { useAuth } from "../contexts/AuthContext";

export default function DailyInsights() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPro = user?.plan === "pro";
  const { transactions, summary } = useCashFlow();

  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;

  const thisMonthIncome = transactions
    .filter((t) => t.tipo === "entrada" && t.data.startsWith(thisMonthKey))
    .reduce((s, t) => s + t.valor, 0);
  const lastMonthIncome = transactions
    .filter((t) => t.tipo === "entrada" && t.data.startsWith(lastMonthKey))
    .reduce((s, t) => s + t.valor, 0);
  const thisMonthExpense = transactions
    .filter((t) => t.tipo === "saida" && t.data.startsWith(thisMonthKey))
    .reduce((s, t) => s + t.valor, 0);
  const lastMonthExpense = transactions
    .filter((t) => t.tipo === "saida" && t.data.startsWith(lastMonthKey))
    .reduce((s, t) => s + t.valor, 0);

  const incomeGrowth =
    lastMonthIncome > 0
      ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
      : null;
  const expenseGrowth =
    lastMonthExpense > 0
      ? ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100
      : null;

  type InsightType = {
    id: string;
    type: "opportunity" | "trend" | "warning" | "info";
    icon: typeof TrendingUp;
    color: string;
    bgColor: string;
    title: string;
    message: string;
    action: string;
  };

  const insights: InsightType[] = [];

  if (incomeGrowth !== null && incomeGrowth > 0) {
    insights.push({
      id: "income-growth",
      type: "trend",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      title: "Crescimento Identificado",
      message: `Suas receitas cresceram ${incomeGrowth.toFixed(0)}% em relação ao mês passado`,
      action: "Ver Análise",
    });
  }

  if (expenseGrowth !== null && expenseGrowth > 15) {
    insights.push({
      id: "expense-growth",
      type: "warning",
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
      title: "Atenção Necessária",
      message: `Despesas aumentaram ${expenseGrowth.toFixed(0)}% este mês em relação ao anterior`,
      action: "Investigar",
    });
  }

  if (summary.margemLucro > 0 && summary.margemLucro < 20 && summary.totalEntradas > 0) {
    insights.push({
      id: "low-margin",
      type: "opportunity",
      icon: Lightbulb,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      title: "Margem Baixa",
      message: `Sua margem de lucro está em ${summary.margemLucro.toFixed(0)}%. Considere revisar seus preços.`,
      action: "Ver Detalhes",
    });
  }

  if (summary.saldoAtual < 0) {
    insights.push({
      id: "negative-balance",
      type: "warning",
      icon: TrendingDown,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      title: "Saldo Negativo",
      message: "Seu saldo está negativo. Priorize recebimentos ou reduza despesas.",
      action: "Ver Fluxo",
    });
  }

  if (incomeGrowth !== null && incomeGrowth < 0) {
    insights.push({
      id: "income-drop",
      type: "warning",
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
      title: "Queda nas Receitas",
      message: `Suas receitas caíram ${Math.abs(incomeGrowth).toFixed(0)}% em relação ao mês passado`,
      action: "Investigar",
    });
  }

  if (transactions.length === 0) {
    insights.push({
      id: "no-data",
      type: "info",
      icon: Lightbulb,
      color: "text-primary",
      bgColor: "bg-primary/10",
      title: "Comece Agora",
      message: "Adicione suas primeiras transações para receber insights personalizados do seu negócio.",
      action: "Adicionar",
    });
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Insights do Dia</h3>
        </div>
        {insights.length > 0 && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {insights.length} {insights.length === 1 ? "novo" : "novos"}
          </span>
        )}
      </div>

      {insights.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Nenhum insight disponível. Continue registrando transações para receber análises.
        </p>
      ) : (
        <div className="space-y-3">
          {insights.slice(0, 3).map((insight) => {
            const Icon = insight.icon;
            return (
              <div
                key={insight.id}
                className="group border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${insight.bgColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${insight.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{insight.message}</p>
                    <button className="text-xs text-primary font-medium hover:underline">
                      {insight.action} →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        {isPro ? (
          <button
            onClick={() => navigate("/app/relatorios")}
            className="w-full flex items-center justify-between text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Ver análise completa no relatório
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-3 border border-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Desbloqueie Insights Avançados
                </span>
              </div>
              <button
                onClick={() => navigate("/pricing")}
                className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Ver Premium
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Receba análises preditivas e sugestões personalizadas diariamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
