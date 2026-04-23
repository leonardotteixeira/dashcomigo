import { Crown } from "lucide-react";
import { useState } from "react";
import { useCashFlow } from "../contexts/CashFlowContext";
import PaywallModal from "./PaywallModal";
import { useAuth } from "../contexts/AuthContext";

export default function UsageLimitCard() {
  const { user } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const { getLimitStatus } = useCashFlow();

  const { used, limit, percentage } = getLimitStatus();

  if (user?.plan === "pro") return null;

  // Don't render card unless usage is above 70%
  if (percentage < 70) return null;

  const isAtLimit = percentage >= 100;
  const remaining = Math.max(0, limit - used);

  return (
    <>
      <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#0E3B2E] mb-1">
              {isAtLimit ? "Limite atingido" : "Você está próximo do limite"}
            </h3>
            <p className="text-sm text-[#0E3B2E]/60">
              Desbloqueie recursos ilimitados com o plano Premium
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#0E3B2E]/70">Transações do mês</span>
            <span className="text-xs font-semibold text-[#0E3B2E]">
              {used} de {limit === Infinity ? "∞" : limit}
            </span>
          </div>
          <div className="h-2 bg-[#F4EFE6] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                percentage >= 100 ? "bg-red-500" : percentage >= 90 ? "bg-orange-500" : "bg-[#0E3B2E]"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          {percentage >= 90 && !isAtLimit && (
            <p className="text-xs text-orange-600 mt-1.5 font-medium">
              Faltam apenas {remaining} transações
            </p>
          )}
          {isAtLimit && (
            <p className="text-xs text-red-600 mt-1.5 font-medium">
              Limite atingido — faça upgrade para continuar
            </p>
          )}
        </div>

        <button
          onClick={() => setShowPaywall(true)}
          className="w-full bg-gradient-to-r from-[#0E3B2E] to-[#0066FF] text-white font-semibold py-3 rounded-xl hover:from-[#002a5d] hover:to-[#0056EF] transition-all text-sm"
        >
          Ver Plano Premium
        </button>
        <p className="text-xs text-center text-[#0E3B2E]/50 mt-3">
          A partir de R$ 29,90/mês • Cancele quando quiser
        </p>
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="limit_reached"
      />
    </>
  );
}
