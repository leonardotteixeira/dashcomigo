/**
 * FeatureGate
 *
 * Wraps any content and overlays a blur + lock CTA when the feature
 * is inaccessible (plan gate) or when the usage limit is reached.
 *
 * Usage:
 *   <FeatureGate feature="reports_advanced" plan={user.plan}>
 *     <AdvancedReportsSection />
 *   </FeatureGate>
 */
import { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Lock, Crown, ArrowRight } from "lucide-react";
import { canAccess, FeatureKey } from "../../utils/featureAccessService";

interface FeatureGateProps {
  /** The feature being gated */
  feature: FeatureKey;
  /** Current user plan */
  plan: "free" | "pro";
  /** Content to show (blurred when locked) */
  children: ReactNode;
  /** Optional custom CTA message */
  ctaText?: string;
  /** Optional custom label shown above the lock icon */
  lockedLabel?: string;
  /** If true, render a compact inline lock badge instead of a full overlay */
  inline?: boolean;
}

export function FeatureGate({
  feature,
  plan,
  children,
  ctaText = "Disponível no Plano PRO",
  lockedLabel,
  inline = false,
}: FeatureGateProps) {
  const navigate = useNavigate();
  const accessible = canAccess(feature, plan);

  if (accessible) return <>{children}</>;

  if (inline) {
    return (
      <div className="relative inline-flex items-center">
        <div className="blur-[2px] pointer-events-none select-none opacity-60">
          {children}
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="absolute inset-0 flex items-center justify-center gap-1.5 bg-[#001529]/10 rounded-lg"
          title="Disponível no PRO"
        >
          <Lock className="w-3.5 h-3.5 text-[#001529]" />
          <span className="text-xs font-semibold text-[#001529]">PRO</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Blurred background content */}
      <div className="blur-sm pointer-events-none select-none opacity-40">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003a6d] flex items-center justify-center mb-4 shadow-lg">
          <Lock className="w-6 h-6 text-white" />
        </div>

        {lockedLabel && (
          <p className="text-xs font-bold text-[#001529]/50 uppercase tracking-widest mb-2">
            {lockedLabel}
          </p>
        )}

        <h3 className="font-bold text-lg text-[#001529] mb-2">{ctaText}</h3>

        <p className="text-sm text-[#001529]/60 mb-5 max-w-xs">
          Faça upgrade para o Plano PRO e desbloqueie esta funcionalidade e muito mais.
        </p>

        <button
          onClick={() => navigate("/checkout")}
          className="flex items-center gap-2 bg-gradient-to-r from-[#003a6d] to-[#0066FF] text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-md"
        >
          <Crown className="w-4 h-4" />
          Fazer Upgrade para PRO
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
