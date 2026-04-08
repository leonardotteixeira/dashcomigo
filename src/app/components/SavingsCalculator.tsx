import { PiggyBank, TrendingUp, Clock, Zap } from "lucide-react";

export default function SavingsCalculator() {
  const monthlySavings = 320;
  const annualSavings = monthlySavings * 12;
  const proCost = 29.9;
  const netAnnualSavings = annualSavings - (proCost * 12);

  const benefits = [
    {
      icon: Clock,
      title: "Economize 10h/mês",
      description: "Automação de tarefas repetitivas",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: TrendingUp,
      title: "Otimize gastos",
      description: "IA identifica onde você pode economizar",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: Zap,
      title: "Decisões mais rápidas",
      description: "Insights em tempo real",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <PiggyBank className="w-5 h-5 text-success" />
        <h3 className="font-semibold text-foreground">
          Potencial de Economia com PRO
        </h3>
      </div>

      <div className="bg-gradient-to-br from-success/10 to-primary/10 border border-success/20 rounded-xl p-5 mb-4">
        <p className="text-sm text-muted-foreground mb-1">
          Economia Anual Estimada
        </p>
        <p className="font-bold text-foreground mb-2" style={{ fontSize: "2rem" }}>
          R$ {netAnnualSavings.toLocaleString("pt-BR")}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Economias identificadas</p>
            <p className="font-semibold text-success">
              +R$ {annualSavings.toLocaleString("pt-BR")}/ano
            </p>
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
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${benefit.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${benefit.color}`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground mb-0.5">
                  {benefit.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all">
        Começar Teste Grátis de 7 Dias
      </button>

      <p className="text-xs text-center text-muted-foreground mt-3">
        Sem compromisso • Cancele quando quiser
      </p>
    </div>
  );
}
