import { X, TrendingUp, AlertCircle, Target, ArrowRight, Flame } from "lucide-react";
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

  const streak = user?.loginStreak ?? 0;
  const firstName = user?.name?.split(" ")[0] ?? "de volta";
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const now = new Date();
  const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const upcomingCount = transactions.filter((t) => {
    const d = new Date(t.data);
    return t.tipo === "saida" && d >= now && d <= in5Days;
  }).length;

  const STREAK_GOAL = 7;
  const streakPct = Math.min((streak / STREAK_GOAL) * 100, 100);

  const highlights = [
    {
      icon: TrendingUp,
      accent: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      label:
        summary.totalEntradas > 0
          ? fmt(summary.totalEntradas)
          : "—",
      description:
        summary.totalEntradas > 0
          ? "Receitas registradas este mês"
          : "Nenhuma receita registrada ainda",
      tag:
        summary.lucro >= 0 ? "Resultado positivo" : "Resultado negativo",
      tagColor: summary.lucro >= 0 ? "#10b981" : "#ef4444",
      tagBg: summary.lucro >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
    },
    {
      icon: AlertCircle,
      accent: upcomingCount > 0 ? "#f59e0b" : "#10b981",
      bg: upcomingCount > 0 ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)",
      label:
        upcomingCount > 0
          ? `${upcomingCount} ${upcomingCount === 1 ? "despesa" : "despesas"}`
          : "Tudo em dia",
      description:
        upcomingCount > 0
          ? `Vence${upcomingCount === 1 ? " nos" : "m nos"} próximos 5 dias`
          : "Nenhuma despesa vencendo em breve",
      tag: upcomingCount > 0 ? "Atenção necessária" : "Sem pendências",
      tagColor: upcomingCount > 0 ? "#f59e0b" : "#10b981",
      tagBg: upcomingCount > 0 ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
    },
    {
      icon: Target,
      accent: "#2563eb",
      bg: "rgba(37,99,235,0.08)",
      label:
        summary.margemLucro > 0
          ? `${summary.margemLucro.toFixed(0)}%`
          : "—",
      description:
        summary.margemLucro > 0
          ? "Margem de lucro líquido"
          : "Registre transações para calcular",
      tag:
        summary.margemLucro >= 40
          ? "Margem excelente"
          : summary.margemLucro > 0
          ? "Revisar preços"
          : "Sem dados",
      tagColor:
        summary.margemLucro >= 40
          ? "#10b981"
          : summary.margemLucro > 0
          ? "#f59e0b"
          : "#6B7280",
      tagBg:
        summary.margemLucro >= 40
          ? "rgba(16,185,129,0.1)"
          : summary.margemLucro > 0
          ? "rgba(245,158,11,0.1)"
          : "rgba(107,114,128,0.1)",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#F4EFE6" }}
      >
        {/* Header */}
        <div
          className="relative px-6 pt-8 pb-6 overflow-hidden"
          style={{ background: "#0E3B2E" }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
            style={{ background: "#fff" }}
          />
          <div
            className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-5"
            style={{ background: "#fff" }}
          />

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="relative">
            <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              Bem-vindo de volta
            </p>
            <h2 className="text-2xl font-bold text-white mb-0.5">
              Olá, {firstName}! 👋
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Veja o resumo desde sua última visita
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="px-5 pt-5 space-y-3">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl px-4 py-3.5"
                style={{
                  background: "#EBE4D6",
                  border: "1px solid rgba(20,18,15,0.08)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: item.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.accent }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-base font-bold leading-tight"
                    style={{ color: "#0E3B2E" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: "rgba(14,59,46,0.55)" }}
                  >
                    {item.description}
                  </p>
                </div>

                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: item.tagBg, color: item.tagColor }}
                >
                  {item.tag}
                </span>
              </div>
            );
          })}
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div
            className="mx-5 mt-3 rounded-2xl px-4 py-3.5"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.08))",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold" style={{ color: "#0E3B2E" }}>
                  Sequência de {streak} {streak === 1 ? "dia" : "dias"}!
                </span>
              </div>
              <span className="text-xs font-bold text-orange-600">
                {Math.min(streak, STREAK_GOAL)}/{STREAK_GOAL}
              </span>
            </div>

            <div
              className="h-1.5 rounded-full overflow-hidden mb-1.5"
              style={{ background: "rgba(245,158,11,0.15)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${streakPct}%`,
                  background: "linear-gradient(90deg, #f59e0b, #f97316)",
                }}
              />
            </div>

            <p className="text-xs" style={{ color: "rgba(14,59,46,0.55)" }}>
              {streak >= STREAK_GOAL
                ? "Meta atingida! Recompensa desbloqueada 🎉"
                : `Faltam ${STREAK_GOAL - streak} ${STREAK_GOAL - streak === 1 ? "dia" : "dias"} para ganhar 1 mês grátis do PRO`}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="px-5 pt-4 pb-6">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
            style={{
              background: "#0E3B2E",
              color: "#F4EFE6",
            }}
          >
            Ir para o Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
