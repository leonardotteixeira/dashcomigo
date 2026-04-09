import { Plus, TrendingUp, FileText, Calculator, Zap, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function QuickActions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPro = user?.plan === "pro";

  const actions = [
    {
      id: 1,
      label: "Nova Receita",
      icon: Plus,
      color: "text-success",
      bgColor: "bg-success/10",
      locked: false,
      onClick: () => {
        // Navigate to FluxoCaixa — it will open the modal
        navigate("/app", { state: { openModal: "entrada" } });
      },
    },
    {
      id: 2,
      label: "Nova Despesa",
      icon: TrendingUp,
      color: "text-expense",
      bgColor: "bg-expense/10",
      locked: false,
      onClick: () => {
        navigate("/app", { state: { openModal: "saida" } });
      },
    },
    {
      id: 3,
      label: "Criar Relatório",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      locked: !isPro,
      proFeature: true,
      onClick: () => isPro && navigate("/app/relatorios"),
    },
    {
      id: 4,
      label: "Simulador IA",
      icon: Calculator,
      color: "text-accent",
      bgColor: "bg-accent/10",
      locked: !isPro,
      proFeature: true,
      onClick: () => isPro && navigate("/app/simuladores"),
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-foreground">Ações Rápidas</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.locked}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border border-border transition-all ${
                action.locked
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:border-primary/50 hover:shadow-sm cursor-pointer"
              }`}
            >
              {action.locked && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center">
                    <Lock className="w-3 h-3 text-amber-600" />
                  </div>
                </div>
              )}
              <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <span className="text-sm font-medium text-foreground text-center">{action.label}</span>
              {action.proFeature && (
                <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                  PRO
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
