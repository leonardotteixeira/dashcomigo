import { X, TrendingUp, AlertCircle, Target, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function WelcomeBackModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simula verificação de última visita
    // Em produção, verificar localStorage/API
    const lastVisit = localStorage.getItem("lastVisit");
    const now = new Date();

    if (!lastVisit) {
      localStorage.setItem("lastVisit", now.toISOString());
      return;
    }

    const lastVisitDate = new Date(lastVisit);
    const hoursSinceLastVisit = (now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60);

    // Mostra modal se passou mais de 12 horas
    if (hoursSinceLastVisit > 12) {
      setIsOpen(true);
    }

    localStorage.setItem("lastVisit", now.toISOString());
  }, []);

  if (!isOpen) return null;

  const highlights = [
    {
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      label: "Receitas cresceram 8%",
      sublabel: "desde sua última visita",
    },
    {
      icon: AlertCircle,
      color: "text-warning",
      bgColor: "bg-warning/10",
      label: "3 contas vencem em breve",
      sublabel: "próximos 5 dias",
    },
    {
      icon: Target,
      color: "text-accent",
      bgColor: "bg-accent/10",
      label: "Meta mensal: 78%",
      sublabel: "faltam R$ 2.800 para atingir",
    },
  ];

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
              <h2 className="font-bold text-foreground">
                Bem-vindo de volta! 👋
              </h2>
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
                <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.sublabel}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4 mt-4">
            <p className="text-sm font-semibold text-foreground mb-1">
              🔥 Mantenha sua sequência ativa!
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Você está há 7 dias seguidos! Continue acessando para ganhar 1 mês grátis do PRO.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                  style={{ width: "70%" }}
                />
              </div>
              <span className="text-xs font-semibold text-amber-600">7/10</span>
            </div>
          </div>
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
