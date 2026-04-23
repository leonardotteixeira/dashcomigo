import { Crown, Check, ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { useState } from "react";
import PaywallModal from "./PaywallModal";
import { useAuth } from "../contexts/AuthContext";

interface UpgradeCardProps {
  variant?: "compact" | "full";
  feature?: string;
  context?: string;
}

export default function UpgradeCard({ variant = "compact", feature, context }: UpgradeCardProps) {
  const { user } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);

  if (user?.plan === "pro") return null;

  if (variant === "compact") {
    return (
      <>
        <div className="bg-gradient-to-br from-[#0E3B2E] to-[#0066FF] text-white rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">Plano Premium</span>
            </div>
            <p className="text-sm text-white/90 mb-3">
              {feature || "Recursos ilimitados para sua gestão"}
            </p>
            <button 
              onClick={() => setShowPaywall(true)}
              className="w-full bg-white text-[#0E3B2E] font-semibold py-2 rounded-lg hover:bg-white/90 transition-colors text-sm"
            >
              Conhecer Plano
            </button>
          </div>
        </div>

        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          trigger="feature_locked"
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-[#0E3B2E] via-[#0E3B2E] to-[#0E3B2E] text-white rounded-2xl p-7 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Plano Premium</h3>
              <p className="text-sm text-white/90">Gestão financeira completa</p>
            </div>
          </div>

          {context && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 mb-4">
              <p className="text-sm">{context}</p>
            </div>
          )}

          {/* Benefícios focados em resultados */}
          <div className="space-y-3 mb-5">
            <div className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-semibold">Sem limites de uso</p>
                <p className="text-xs text-white/70">Transações e exportações ilimitadas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-semibold">Relatórios avançados</p>
                <p className="text-xs text-white/70">Análises detalhadas e personalizadas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-semibold">Automações inteligentes</p>
                <p className="text-xs text-white/70">Integração bancária e OFX</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-semibold">Suporte prioritário</p>
                <p className="text-xs text-white/70">Atendimento rápido quando precisar</p>
              </div>
            </div>
          </div>

          {/* Preço com ancoragem melhorada */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-5 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/70 mb-1">A partir de</p>
                <p className="text-2xl font-bold">
                  R$ 29,90<span className="text-base font-normal">/mês</span>
                </p>
                <p className="text-xs text-white/70 mt-1">Menos de R$ 1/dia</p>
              </div>
              <div className="text-right">
                <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-1">
                  -40% OFF
                </div>
                <p className="text-xs text-white/60 line-through">R$ 49,90</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowPaywall(true)}
            className="w-full bg-white text-[#0E3B2E] font-bold py-4 rounded-xl hover:bg-white/95 transition-all flex items-center justify-center gap-2 shadow-lg mb-3"
          >
            Conhecer o Plano Premium
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Redutores de fricção */}
          <div className="flex items-center justify-center gap-4 text-xs text-white/80">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>7 dias grátis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="feature_locked"
      />
    </>
  );
}