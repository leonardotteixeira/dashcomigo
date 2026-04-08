import { Sparkles, TrendingUp, AlertTriangle, Target, Lightbulb } from "lucide-react";

const insights = [
  {
    id: 1,
    type: "opportunity",
    icon: Lightbulb,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    title: "Oportunidade Detectada",
    message: "Você pode economizar R$ 320/mês renegociando contratos de serviços",
    action: "Ver Detalhes",
  },
  {
    id: 2,
    type: "trend",
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-success/10",
    title: "Crescimento Identificado",
    message: "Suas receitas cresceram 23% em relação ao mês passado",
    action: "Ver Análise",
  },
  {
    id: 3,
    type: "warning",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    title: "Atenção Necessária",
    message: "Despesas operacionais aumentaram 15% este mês",
    action: "Investigar",
  },
];

export default function DailyInsights() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Insights do Dia</h3>
        </div>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
          3 novos
        </span>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.id}
              className="group border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${insight.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${insight.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.message}
                  </p>
                  <button className="text-xs text-primary font-medium hover:underline">
                    {insight.action} →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-3 border border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Desbloqueie Insights Avançados
              </span>
            </div>
            <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-medium">
              Ver PRO
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Receba análises preditivas e sugestões personalizadas diariamente
          </p>
        </div>
      </div>
    </div>
  );
}
