import { AlertTriangle, TrendingDown, Lock, Zap, Crown } from "lucide-react";
import { useState } from "react";
import PaywallModal from "./PaywallModal";

export default function UsageLimitCard() {
  const [showPaywall, setShowPaywall] = useState(false);

  // Simulação de limites próximos
  const transactionLimit = 50;
  const transactionUsed = 47;
  const transactionPercentage = (transactionUsed / transactionLimit) * 100;
  const transactionsLeft = transactionLimit - transactionUsed;

  const exportLimit = 3;
  const exportUsed = 3;

  return (
    <>
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
        {/* Header mais sutil */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#001529] mb-1">
              Você está próximo do limite
            </h3>
            <p className="text-sm text-[#001529]/60">
              Desbloqueie recursos ilimitados com o plano PRO
            </p>
          </div>
        </div>

        {/* Métricas de uso - mais discretas */}
        <div className="space-y-3 mb-4">
          {/* Transações */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#001529]/70">
                Transações do mês
              </span>
              <span className="text-xs font-semibold text-[#001529]">
                {transactionUsed} de {transactionLimit}
              </span>
            </div>
            <div className="h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  transactionPercentage >= 90
                    ? "bg-orange-500"
                    : "bg-[#003a6d]"
                }`}
                style={{ width: `${transactionPercentage}%` }}
              />
            </div>
            {transactionPercentage >= 90 && (
              <p className="text-xs text-orange-600 mt-1.5 font-medium">
                Faltam apenas {transactionsLeft} transações
              </p>
            )}
          </div>

          {/* Exportações */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#001529]/70">
                Exportações do mês
              </span>
              <span className="text-xs font-semibold text-[#001529]">
                {exportUsed} de {exportLimit}
              </span>
            </div>
            <div className="h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all"
                style={{ width: "100%" }}
              />
            </div>
            <p className="text-xs text-orange-600 mt-1.5 font-medium">
              Limite atingido
            </p>
          </div>
        </div>

        {/* CTA mais sutil */}
        <button
          onClick={() => setShowPaywall(true)}
          className="w-full bg-gradient-to-r from-[#003a6d] to-[#0066FF] text-white font-semibold py-3 rounded-xl hover:from-[#002a5d] hover:to-[#0056EF] transition-all text-sm"
        >
          Ver Plano PRO
        </button>

        <p className="text-xs text-center text-[#001529]/50 mt-3">
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