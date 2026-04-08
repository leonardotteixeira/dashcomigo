import { CheckCircle, Circle, Trophy, X } from "lucide-react";
import { useState } from "react";

const checklistItems = [
  {
    id: 1,
    title: "Complete seu perfil",
    description: "Adicione suas informações básicas",
    completed: true,
  },
  {
    id: 2,
    title: "Registre sua primeira receita",
    description: "Adicione pelo menos uma entrada",
    completed: true,
  },
  {
    id: 3,
    title: "Registre sua primeira despesa",
    description: "Acompanhe seus gastos",
    completed: true,
  },
  {
    id: 4,
    title: "Configure alertas de vencimento",
    description: "Nunca perca um prazo importante",
    completed: false,
  },
  {
    id: 5,
    title: "Explore os relatórios",
    description: "Veja insights sobre seu negócio",
    completed: false,
  },
];

export default function OnboardingChecklist() {
  const [isVisible, setIsVisible] = useState(true);
  const completedCount = checklistItems.filter((item) => item.completed).length;
  const progress = (completedCount / checklistItems.length) * 100;

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Primeiros Passos no FinMEI
            </h3>
            <p className="text-xs text-muted-foreground">
              Complete para dominar o sistema
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-secondary rounded"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {checklistItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
              item.completed
                ? "bg-success/10 border border-success/20"
                : "bg-card border border-border hover:border-primary/30"
            }`}
          >
            <div className="pt-0.5">
              {item.completed ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium mb-0.5 ${
                  item.completed
                    ? "text-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-primary">
          {completedCount}/{checklistItems.length}
        </span>
      </div>

      {progress === 100 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-sm text-foreground font-medium mb-2">
            🎉 Parabéns! Você completou o onboarding!
          </p>
          <p className="text-xs text-muted-foreground">
            Ganhe 7 dias grátis do plano PRO como recompensa
          </p>
        </div>
      )}
    </div>
  );
}
