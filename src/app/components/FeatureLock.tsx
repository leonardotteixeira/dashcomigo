import { Lock, Crown, Zap, Check } from "lucide-react";
import { useState } from "react";
import PaywallModal from "./PaywallModal";

interface FeatureLockProps {
  feature: string;
  description: string;
  size?: "sm" | "md" | "lg";
}

export default function FeatureLock({ feature, description, size = "md" }: FeatureLockProps) {
  const [showPaywall, setShowPaywall] = useState(false);

  const sizes = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <>
      <div className={`bg-white border-2 border-dashed border-[rgba(20,18,15,0.13)] rounded-xl ${sizes[size]} text-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30" />

        <div className="relative">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#0E3B2E] to-[#0066FF] flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>

          <h3 className="font-bold text-[#0E3B2E] mb-2 flex items-center justify-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            {feature}
          </h3>

          <p className="text-sm text-[#0E3B2E]/60 mb-4 max-w-md mx-auto">
            {description}
          </p>

          <button 
            onClick={() => setShowPaywall(true)}
            className="bg-gradient-to-r from-[#0E3B2E] to-[#0066FF] text-white px-6 py-2.5 rounded-xl hover:from-[#002a5d] hover:to-[#0056EF] transition-all font-semibold text-sm shadow-sm"
          >
            Disponível no Premium
          </button>

          <p className="text-xs text-[#0E3B2E]/50 mt-3">
            A partir de R$ 29,90/mês
          </p>
        </div>
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="feature_locked"
        featureName={feature}
      />
    </>
  );
}