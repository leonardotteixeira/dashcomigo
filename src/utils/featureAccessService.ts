/**
 * featureAccessService — Central feature-gating rule engine.
 *
 * Single source of truth for FREE vs PRO limits across the entire app.
 * Never define "FREE_LIMIT" constants in individual components/contexts —
 * always import from here.
 */

// ─── Feature keys ─────────────────────────────────────────────────────────────

export type FeatureKey =
  | "clients"              // contact records with tipo="cliente"|"ambos"
  | "suppliers"            // contact records with tipo="fornecedor"|"ambos"
  | "proposals"            // proposals created TODAY
  | "budgets"              // active Orcamentos records
  | "accounts_payable"     // payable entries THIS MONTH
  | "accounts_receivable"  // receivable entries THIS MONTH
  | "transactions"         // cash-flow transaction entries
  | "reports_advanced"     // access to advanced reports
  | "simulators_advanced"  // advanced simulator modes
  | "investments";         // investments guide page

// ─── Limit config per feature ─────────────────────────────────────────────────

export interface FeatureLimitConfig {
  /** Max allowed for free plan. Infinity = unlimited, 0 = no access. */
  free: number;
  /** Max allowed for pro plan. Infinity = unlimited, 0 = no access. */
  pro: number;
  /** Human-readable label for the period, e.g. "por mês" */
  period?: string;
  /** Human-readable description shown in limit modals */
  description?: string;
}

export const FEATURE_LIMITS: Record<FeatureKey, FeatureLimitConfig> = {
  clients: {
    free: 10,
    pro: Infinity,
    description: "clientes cadastrados",
  },
  suppliers: {
    free: 10,
    pro: Infinity,
    description: "fornecedores cadastrados",
  },
  proposals: {
    free: 2,
    pro: Infinity,
    period: "por dia",
    description: "propostas criadas hoje",
  },
  budgets: {
    free: 5,
    pro: Infinity,
    description: "orçamentos ativos",
  },
  accounts_payable: {
    free: 30,
    pro: Infinity,
    period: "por mês",
    description: "contas a pagar este mês",
  },
  accounts_receivable: {
    free: 30,
    pro: Infinity,
    period: "por mês",
    description: "contas a receber este mês",
  },
  transactions: {
    free: 30,
    pro: Infinity,
    period: "por mês",
    description: "transações este mês",
  },
  reports_advanced: {
    free: 0,      // 0 = no access
    pro: Infinity,
    description: "relatórios avançados",
  },
  simulators_advanced: {
    free: 0,
    pro: Infinity,
    description: "modo avançado dos simuladores",
  },
  investments: {
    free: 0,
    pro: Infinity,
    description: "guia de investimentos",
  },
};

// ─── Core functions ────────────────────────────────────────────────────────────

/**
 * Returns the numeric limit for a feature given a user plan.
 * Returns Infinity for pro (unlimited), 0 for features with no free access.
 */
export function getLimit(feature: FeatureKey, plan: "free" | "pro"): number {
  return FEATURE_LIMITS[feature][plan];
}

/**
 * Returns true if the user can access the feature at all
 * (i.e. limit > 0 or plan is pro).
 */
export function canAccess(feature: FeatureKey, plan: "free" | "pro"): boolean {
  if (plan === "pro") return true;
  return FEATURE_LIMITS[feature].free > 0;
}

/**
 * Returns true if the user has reached or exceeded the usage limit.
 * Always returns false for PRO users.
 */
export function isLimitReached(
  feature: FeatureKey,
  usage: number,
  plan: "free" | "pro"
): boolean {
  if (plan === "pro") return false;
  const limit = FEATURE_LIMITS[feature].free;
  if (limit === Infinity) return false;
  return usage >= limit;
}

/**
 * Returns usage as a percentage of the limit (0-100).
 * Returns 0 for PRO users (no limit).
 */
export function getUsagePercentage(
  feature: FeatureKey,
  usage: number,
  plan: "free" | "pro"
): number {
  if (plan === "pro") return 0;
  const limit = FEATURE_LIMITS[feature].free;
  if (!isFinite(limit) || limit === 0) return 0;
  return Math.min((usage / limit) * 100, 100);
}

/**
 * Returns true when usage is in the "warning zone" (default 80%).
 * Used to show the "approaching limit" banner.
 */
export function isNearLimit(
  feature: FeatureKey,
  usage: number,
  plan: "free" | "pro",
  threshold = 80
): boolean {
  const pct = getUsagePercentage(feature, usage, plan);
  return pct >= threshold && pct < 100;
}

/**
 * Returns how many items are remaining before the limit.
 * Returns Infinity for PRO. Returns 0 when limit is reached.
 */
export function getRemaining(
  feature: FeatureKey,
  usage: number,
  plan: "free" | "pro"
): number {
  if (plan === "pro") return Infinity;
  const limit = FEATURE_LIMITS[feature].free;
  if (!isFinite(limit)) return Infinity;
  return Math.max(0, limit - usage);
}

/**
 * Convenience: returns a full status object for a feature.
 */
export function getFeatureStatus(
  feature: FeatureKey,
  usage: number,
  plan: "free" | "pro"
) {
  const limit = getLimit(feature, plan);
  const pct = getUsagePercentage(feature, usage, plan);
  const remaining = getRemaining(feature, usage, plan);
  return {
    canAccess: canAccess(feature, plan),
    isReached: isLimitReached(feature, usage, plan),
    isNear: isNearLimit(feature, usage, plan),
    percentage: pct,
    remaining,
    limit: isFinite(limit) ? limit : null,
    usage,
    config: FEATURE_LIMITS[feature],
  };
}
