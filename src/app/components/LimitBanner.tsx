/**
 * LimitBanner
 *
 * Shown when a user is approaching their plan limit (80-99%).
 * Disappears automatically for PRO users or when not near a limit.
 *
 * Usage:
 *   <LimitBanner feature="clients" usage={8} plan={user.plan} />
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, X, ArrowRight } from "lucide-react";
import {
  FeatureKey,
  getFeatureStatus,
  FEATURE_LIMITS,
} from "../../utils/featureAccessService";

interface LimitBannerProps {
  feature: FeatureKey;
  usage: number;
  plan: "free" | "pro";
  className?: string;
}

export function LimitBanner({ feature, usage, plan, className = "" }: LimitBannerProps) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const status = getFeatureStatus(feature, usage, plan);

  // Only show when in the warning zone (80-99%)
  if (!status.isNear || dismissed) return null;

  const config = FEATURE_LIMITS[feature];
  const remaining = status.remaining;
  const period = config.period ? ` ${config.period}` : "";
  const description = config.description ?? feature;

  return (
    <div
      className={`flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 ${className}`}
    >
      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800 mb-0.5">
          Você está próximo do limite
        </p>
        <p className="text-xs text-amber-700">
          Restam apenas{" "}
          <strong>
            {remaining} {remaining === 1 ? "item" : "itens"}
          </strong>{" "}
          de {description}
          {period}. Atualize para o PRO e tenha acesso ilimitado.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => navigate("/checkout")}
          className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition-colors"
        >
          Ver PRO
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-amber-100 rounded-lg transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4 text-amber-500" />
        </button>
      </div>
    </div>
  );
}
