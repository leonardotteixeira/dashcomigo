import { X, TrendingUp, AlertCircle, Target, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useCashFlow } from "../contexts/CashFlowContext";
import { useAuth } from "../contexts/AuthContext";

export default function WelcomeBackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { summary, transactions } = useCashFlow();
  const { user } = useAuth();

  useEffect(() => {
    const lastVisit = localStorage.getItem("lastVisit");
    const now = new Date();

    if (!lastVisit) {
      localStorage.setItem("lastVisit", now.toISOString());
      return;
    }

    const hoursSinceLastVisit =
      (now.getTime() - new Date(lastVisit).getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastVisit > 12) {
      setIsOpen(true);
    }

    localStorage.setItem("lastVisit", now.toISOString());
  }, []);

  if (!isOpen) return null;

  // Real data for highlights
  const streak = user?.loginStreak ?? 0;
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Count upcoming obligations (from transactions that are payable in next 5 days)
  const now = new Date();
  const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const upcomingCount = transactions.filter((t) => {
    const d = new Date(t.data);
    return t.tipo === "saida" && d >= now && d <= in5Days;
  }).length;

  const highlights = [
    {
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      label:
        summary.totalEntradas > 0
          ? `Receitas: ${fmt(summary.totalEntradas)} este mês`
          : "Nenhuma receita registrada ainda",
      sublabel: summary.lucro >= 0 ? "Resultado positivo" : "Resultado negativo",
    },
    {
      icon: AlertCircle,
      color: "text-warning",
      bgColor: "bg-warning/10",
      label:
        upcomingCount > 0
          ? `${upcomingCount} ${upcomingCount === 1 ? "despesa vence" : "despesas vencem"} nos próximos 5 dias`
          : "Nenhuma despesa vencendo nos próximos 5 dias",
      sublabel: upcomingCount > 0 ? "Verifique suas contas" : "Tudo em dia!",
    },
    {
      icon: Target,
      color: "text-accent",
      bgColor: "bg-accent/10",
      label:
        summary.margemLucro > 0
          ? `Margem de lucro: ${summary.margemLucro.toFixed(0)}%`
          : "Registre transações para ver sua margem",
      sublabel:
        summary.margemLucro >= 40
          ? "Excelente! Margem saudável."
          : summary.margemLucro > 0
          ? "Considere revisar preços"
          : "Sem dados suficientes",
    },
  ];

  const STREAK_GOAL = 7;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 border-b border-border">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Bem-vindo de volta! 👋</h2>
              <p className="text-sm text-muted-foreground">
                Veja o que aconteceu desde sua última visita
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-0.5">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.sublabel}</p>
                </div>
              </div>
            );
          })}

          {streak > 0 && (
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-foreground mb-1">
                🔥 Sequência de {streak} {streak === 1 ? "dia" : "dias"}!
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {streak >= STREAK_GOAL
                  ? "Você atingiu a meta! Recompensa desbloqueada."
                  : `Faltam ${STREAK_GOAL - streak} ${STREAK_GOAL - streak === 1 ? "dia" : "dias"} para ganhar 1 mês grátis do PRO!`}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                    style={{ width: `${Math.min((streak / STREAK_GOAL) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-amber-600">
                  {Math.min(streak, STREAK_GOAL)}/{STREAK_GOAL}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continuar para o Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
