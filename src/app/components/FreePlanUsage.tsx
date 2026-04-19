import { Zap, Crown, AlertTriangle } from "lucide-react";
import { useState } from "react";
import PaywallModal from "./PaywallModal";
import { useAuth } from "../contexts/AuthContext";

export default function FreePlanUsage() {
  const { user } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallTrigger, setPaywallTrigger] = useState<"limit_reached" | "export_blocked">("limit_reached");

  if (user?.plan === "pro") return null;

  const transactionLimit = 50;
  const transactionUsed = 42;
  const transactionPercentage = (transactionUsed / transactionLimit) * 100;
  const transactionsLeft = transactionLimit - transactionUsed;

  const exportLimit = 3;
  const exportUsed = 3;

  const handleUpgrade = (trigger: "limit_reached" | "export_blocked") => {
    setPaywallTrigger(trigger);
    setShowPaywall(true);
  };

  const txBg =
    transactionPercentage >= 100 ? "rgba(176,74,58,0.08)" :
    transactionPercentage >= 80  ? "rgba(176,74,58,0.06)" :
    "#EBE4D6";
  const txBorder =
    transactionPercentage >= 100 ? "#B04A3A" :
    transactionPercentage >= 80  ? "rgba(176,74,58,0.5)" :
    "rgba(20,18,15,0.13)";
  const txBarColor =
    transactionPercentage >= 100 ? "#B04A3A" :
    transactionPercentage >= 80  ? "#c05a40" :
    "#0E3B2E";
  const txBadgeBg =
    transactionPercentage >= 100 ? "#B04A3A" :
    transactionPercentage >= 80  ? "#c05a40" :
    "#0E3B2E";

  return (
    <>
      <div className="space-y-3">
        {/* Transaction Usage */}
        <div className="rounded-xl p-4 border-2"
          style={{ background: txBg, borderColor: txBorder }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {transactionPercentage >= 80 && (
                <AlertTriangle className="w-4 h-4" style={{ color: txBadgeBg }} />
              )}
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0E3B2E" }}>
                Transações do Mês
              </span>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full text-white"
              style={{ background: txBadgeBg }}>
              {transactionPercentage.toFixed(0)}%
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold" style={{ color: "#0E3B2E" }}>{transactionUsed}</span>
            <span className="text-sm" style={{ color: "rgba(14,59,46,0.6)" }}>de {transactionLimit}</span>
          </div>

          <div className="h-2 rounded-full overflow-hidden mb-3"
            style={{ background: "rgba(20,18,15,0.08)", border: "1px solid rgba(20,18,15,0.1)" }}>
            <div className="h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(transactionPercentage, 100)}%`, background: txBarColor }} />
          </div>

          {transactionPercentage >= 80 && (
            <div className="text-xs font-semibold" style={{ color: txBadgeBg }}>
              {transactionPercentage >= 100
                ? "🚫 Limite atingido! Próximas transações não serão salvas"
                : `⚠️ Faltam apenas ${transactionsLeft} transações para travar`}
            </div>
          )}
        </div>

        {/* Export Usage */}
        <div className="rounded-xl p-4 border-2"
          style={{ background: "rgba(176,74,58,0.08)", borderColor: "#B04A3A" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" style={{ color: "#B04A3A" }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0E3B2E" }}>
                Exportações do Mês
              </span>
            </div>
            <span className="text-xs font-bold text-white px-2 py-1 rounded-full"
              style={{ background: "#B04A3A" }}>
              100%
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold" style={{ color: "#0E3B2E" }}>{exportUsed}</span>
            <span className="text-sm" style={{ color: "rgba(14,59,46,0.6)" }}>de {exportLimit}</span>
          </div>

          <div className="h-2 rounded-full overflow-hidden mb-3"
            style={{ background: "rgba(20,18,15,0.08)", border: "1px solid rgba(176,74,58,0.2)" }}>
            <div className="h-full rounded-full" style={{ width: "100%", background: "#B04A3A" }} />
          </div>

          <p className="text-xs font-semibold" style={{ color: "#B04A3A" }}>
            🚫 Você não pode mais exportar relatórios este mês
          </p>
        </div>

        {/* Upgrade CTA */}
        <div className="rounded-xl p-5 shadow-lg relative overflow-hidden"
          style={{ background: "#0E3B2E" }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16"
            style={{ background: "rgba(127,209,159,0.1)" }} />

          <div className="relative">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#7FD19F" }}>
                <Crown className="w-5 h-5" style={{ color: "#0E3B2E" }} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold mb-1" style={{ color: "#F4EFE6" }}>
                  Pare de Ficar Travado
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(244,239,230,0.75)" }}>
                  Você está perdendo dinheiro ao não registrar suas transações. Desbloqueie agora.
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {["Transações ilimitadas", "Exporte quantas vezes quiser", "Relatórios e insights avançados"].map(b => (
                <div key={b} className="flex items-center gap-2 text-xs">
                  <Zap className="w-3.5 h-3.5" style={{ color: "#7FD19F" }} />
                  <span style={{ color: "rgba(244,239,230,0.9)" }}>{b}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg p-3 mb-4"
              style={{ background: "rgba(244,239,230,0.08)", border: "1px solid rgba(244,239,230,0.15)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "rgba(244,239,230,0.6)" }}>Por apenas</p>
                  <p className="text-xl font-bold" style={{ color: "#F4EFE6" }}>
                    R$ 29,90<span className="text-sm font-normal">/mês</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold px-2 py-1 rounded-full mb-1"
                    style={{ background: "#7FD19F", color: "#0E3B2E" }}>
                    -40% OFF
                  </div>
                  <p className="text-xs line-through" style={{ color: "rgba(244,239,230,0.4)" }}>R$ 49,90</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade("limit_reached")}
              className="w-full text-sm font-bold py-3 rounded-xl transition-all shadow-lg mb-2"
              style={{ background: "#7FD19F", color: "#0E3B2E" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F4EFE6"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#7FD19F"; }}
            >
              Liberar Acesso Completo
            </button>

            <p className="text-xs text-center" style={{ color: "rgba(244,239,230,0.6)" }}>
              Menos de R$ 1/dia • Cancele quando quiser
            </p>
          </div>
        </div>
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger={paywallTrigger}
      />
    </>
  );
}
