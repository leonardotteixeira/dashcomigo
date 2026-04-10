/**
 * HeaderKPIStrip
 * Compact financial summary shown in the top navigation bar.
 * Uses the centralized useFinancialMetrics hook — same numbers as Dashboard.
 */
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useFinancialMetrics } from "../../utils/useFinancialMetrics";

function Skeleton() {
  return (
    <div className="h-4 w-16 bg-white/20 rounded animate-pulse" />
  );
}

export function HeaderKPIStrip() {
  const { saldoAtual, monthReceitas, monthDespesas, loading, fmt } =
    useFinancialMetrics();

  const items = [
    {
      label: "Saldo Atual",
      value: fmt(saldoAtual),
      icon: DollarSign,
      color:
        saldoAtual >= 0
          ? "text-emerald-400"
          : "text-red-400",
    },
    {
      label: "Receitas",
      value: fmt(monthReceitas),
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Despesas",
      value: fmt(monthDespesas),
      icon: TrendingDown,
      color: "text-red-400",
    },
  ];

  return (
    <div className="hidden lg:flex items-center gap-1 divide-x divide-[#E5E7EB]">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-center gap-2 px-4 first:pl-0 last:pr-0"
          >
            <div className="w-7 h-7 rounded-lg bg-[#F5F7FA] flex items-center justify-center flex-shrink-0">
              <Icon className={`w-3.5 h-3.5 ${item.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-[#001529]/50 font-medium uppercase tracking-wider leading-none mb-0.5">
                {item.label}
              </p>
              {loading ? (
                <Skeleton />
              ) : (
                <p className={`text-xs font-bold leading-none ${item.color}`}>
                  {item.value}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
