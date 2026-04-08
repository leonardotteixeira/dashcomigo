import { Zap, Crown, AlertTriangle, TrendingUp } from "lucide-react";
import { useState } from "react";
import PaywallModal from "./PaywallModal";

export default function FreePlanUsage() {
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallTrigger, setPaywallTrigger] = useState<"limit_reached" | "export_blocked">("limit_reached");

  const transactionLimit = 50;
  const transactionUsed = 42;
  const transactionPercentage = (transactionUsed / transactionLimit) * 100;
  const transactionsLeft = transactionLimit - transactionUsed;

  const exportLimit = 3;
  const exportUsed = 3;
  const exportPercentage = (exportUsed / exportLimit) * 100;
  const exportsLeft = exportLimit - exportUsed;

  const handleUpgrade = (trigger: "limit_reached" | "export_blocked") => {
    setPaywallTrigger(trigger);
    setShowPaywall(true);
  };

  return (
    <>
      <div className="space-y-3">
        {/* Transaction Usage */}
        <div className={`rounded-xl p-4 border-2 ${
          transactionPercentage >= 100 
            ? "bg-red-50 border-red-300" 
            : transactionPercentage >= 80 
            ? "bg-orange-50 border-orange-300" 
            : "bg-blue-50 border-blue-200"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {transactionPercentage >= 80 && (
                <AlertTriangle className={`w-4 h-4 ${
                  transactionPercentage >= 100 ? "text-red-600" : "text-orange-600"
                }`} />
              )}
              <span className="text-xs font-bold text-[#001529] uppercase tracking-wider">
                Transações do Mês
              </span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              transactionPercentage >= 100
                ? "bg-red-600 text-white"
                : transactionPercentage >= 80
                ? "bg-orange-600 text-white"
                : "bg-[#003a6d] text-white"
            }`}>
              {transactionPercentage.toFixed(0)}%
            </span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-[#001529]">
              {transactionUsed}
            </span>
            <span className="text-sm text-[#001529]/60">
              de {transactionLimit}
            </span>
          </div>

          <div className="h-2 bg-white/80 rounded-full overflow-hidden mb-3 border border-[#001529]/10">
            <div
              className={`h-full transition-all duration-500 ${
                transactionPercentage >= 100
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : transactionPercentage > 80
                  ? "bg-gradient-to-r from-orange-500 to-orange-600"
                  : "bg-gradient-to-r from-[#003a6d] to-[#0066FF]"
              }`}
              style={{ width: `${Math.min(transactionPercentage, 100)}%` }}
            />
          </div>

          {transactionPercentage >= 80 && (
            <div className={`text-xs font-semibold ${
              transactionPercentage >= 100 ? "text-red-700" : "text-orange-700"
            }`}>
              {transactionPercentage >= 100 
                ? "🚫 Limite atingido! Próximas transações não serão salvas" 
                : `⚠️ Faltam apenas ${transactionsLeft} transações para travar`
              }
            </div>
          )}
        </div>

        {/* Export Usage */}
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-[#001529] uppercase tracking-wider">
                Exportações do Mês
              </span>
            </div>
            <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded-full">
              100%
            </span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-[#001529]">
              {exportUsed}
            </span>
            <span className="text-sm text-[#001529]/60">
              de {exportLimit}
            </span>
          </div>

          <div className="h-2 bg-white/80 rounded-full overflow-hidden mb-3 border border-red-200">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
              style={{ width: "100%" }}
            />
          </div>

          <p className="text-xs font-semibold text-red-700">
            🚫 Você não pode mais exportar relatórios este mês
          </p>
        </div>

        {/* Upgrade CTA com copywriting persuasivo */}
        <div className="bg-gradient-to-br from-[#001529] via-[#002140] to-[#003a6d] text-white rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          
          <div className="relative">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold mb-1">
                  Pare de Ficar Travado
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Você está perdendo dinheiro ao não registrar suas transações. Desbloqueie agora.
                </p>
              </div>
            </div>

            {/* Benefícios rápidos */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white/90">Transações ilimitadas</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white/90">Exporte quantas vezes quiser</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white/90">Relatórios e insights avançados</span>
              </div>
            </div>

            {/* Preço destaque */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70 mb-0.5">Por apenas</p>
                  <p className="text-xl font-bold">
                    R$ 29,90<span className="text-sm font-normal">/mês</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-1">
                    -40% OFF
                  </div>
                  <p className="text-xs text-white/60 line-through">R$ 49,90</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleUpgrade("limit_reached")}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg mb-2"
            >
              Liberar Acesso Completo
            </button>

            <p className="text-xs text-center text-white/70">
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