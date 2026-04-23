/**
 * LimitReachedModal
 *
 * Full modal shown when a user tries to create an item but has hit their
 * plan limit. Blocks the action and provides an upgrade CTA.
 *
 * Usage:
 *   <LimitReachedModal
 *     open={showLimitModal}
 *     onClose={() => setShowLimitModal(false)}
 *     feature="clients"
 *     plan={user.plan}
 *     usage={10}
 *   />
 */
import { useNavigate } from "react-router";
import { Lock, Crown, ArrowRight, X } from "lucide-react";
import { FeatureKey, FEATURE_LIMITS, getLimit } from "../../utils/featureAccessService";

interface LimitReachedModalProps {
  open: boolean;
  onClose: () => void;
  feature: FeatureKey;
  plan: "free" | "pro";
  usage: number;
}

const FEATURE_LABELS: Record<FeatureKey, string> = {
  clients: "Clientes",
  suppliers: "Fornecedores",
  proposals: "Propostas",
  budgets: "Orçamentos",
  accounts_payable: "Contas a Pagar",
  accounts_receivable: "Contas a Receber",
  transactions: "Transações",
  reports_advanced: "Relatórios Avançados",
  simulators_advanced: "Modo Avançado",
  investments: "Investimentos",
};

const PRO_BENEFITS: Partial<Record<FeatureKey, string[]>> = {
  clients: [
    "Clientes ilimitados",
    "Histórico completo de transações",
    "Anotações e anexos por cliente",
  ],
  suppliers: [
    "Fornecedores ilimitados",
    "Categorização avançada",
    "Relatório de gastos por fornecedor",
  ],
  proposals: [
    "Propostas ilimitadas",
    "Templates premium",
    "Assinatura digital integrada",
  ],
  accounts_payable: [
    "Contas ilimitadas",
    "Recorrência automática",
    "Alertas de vencimento",
  ],
  accounts_receivable: [
    "Recebimentos ilimitados",
    "Cobrança automática",
    "Relatório de inadimplência",
  ],
  transactions: [
    "Transações ilimitadas",
    "Importação via CSV/OFX",
    "Conciliação bancária",
  ],
};

const DEFAULT_BENEFITS = [
  "Acesso ilimitado a esta funcionalidade",
  "Relatórios avançados com IA",
  "Exportação em Excel e PDF",
  "Suporte prioritário",
];

export function LimitReachedModal({
  open,
  onClose,
  feature,
  plan,
  usage,
}: LimitReachedModalProps) {
  const navigate = useNavigate();

  if (!open) return null;

  const config = FEATURE_LIMITS[feature];
  const limit = getLimit(feature, plan);
  const featureLabel = FEATURE_LABELS[feature] ?? feature;
  const benefits = PRO_BENEFITS[feature] ?? DEFAULT_BENEFITS;
  const period = config.period ? ` ${config.period}` : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#0E3B2E] to-[#0E3B2E] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-widest font-medium">
                Limite atingido
              </p>
              <h2 className="font-bold text-lg">{featureLabel}</h2>
            </div>
          </div>

          <p className="text-sm text-white/80">
            Você atingiu o limite do plano gratuito:{" "}
            <strong className="text-white">
              {isFinite(limit) ? limit : "∞"} {config.description}
              {period}
            </strong>
            . Faça upgrade para continuar sem limites.
          </p>
        </div>

        {/* Usage bar */}
        <div className="px-6 pt-5 pb-2">
          <div className="flex justify-between text-xs font-medium text-[#0E3B2E]/60 mb-1.5">
            <span>Uso atual</span>
            <span className="text-[#ef4444]">
              {usage}/{isFinite(limit) ? limit : "∞"} utilizados
            </span>
          </div>
          <div className="w-full h-2 bg-[#F4EFE6] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ef4444] to-[#f97316] rounded-full"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="px-6 py-4">
          <p className="text-xs font-bold text-[#0E3B2E]/50 uppercase tracking-widest mb-3">
            Com o Plano Premium você terá:
          </p>
          <ul className="space-y-2">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-[#0E3B2E]">
                <div className="w-5 h-5 rounded-full bg-[#10b981]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#10b981] text-xs font-bold">✓</span>
                </div>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="px-6 pb-6 flex flex-col gap-2">
          <button
            onClick={() => { navigate("/checkout"); onClose(); }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0E3B2E] to-[#0066FF] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-md"
          >
            <Crown className="w-4 h-4" />
            Fazer Upgrade para Premium
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full text-sm text-[#0E3B2E]/50 hover:text-[#0E3B2E] py-2 transition-colors"
          >
            Continuar no Plano Gratuito
          </button>
        </div>
      </div>
    </div>
  );
}
