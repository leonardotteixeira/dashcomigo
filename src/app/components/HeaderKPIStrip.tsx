import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useFinancialMetrics } from "../../utils/useFinancialMetrics";

function Skeleton() {
  return <div className="h-4 w-16 rounded animate-pulse" style={{ background: "rgba(14,59,46,0.15)" }} />;
}

export function HeaderKPIStrip() {
  const { saldoAtual, monthReceitas, monthDespesas, loading, fmt } = useFinancialMetrics();

  const items = [
    {
      label: "Saldo Atual",
      value: fmt(saldoAtual),
      icon: DollarSign,
      positive: saldoAtual >= 0,
    },
    {
      label: "Receitas",
      value: fmt(monthReceitas),
      icon: TrendingUp,
      positive: true,
    },
    {
      label: "Despesas",
      value: fmt(monthDespesas),
      icon: TrendingDown,
      positive: false,
    },
  ];

  return (
    <div className="hidden lg:flex items-center gap-1 divide-x divide-[rgba(20,18,15,0.13)]">
      {items.map((item) => {
        const Icon = item.icon;
        const valueColor = item.positive ? "#1F5A3A" : "#B04A3A";
        return (
          <div key={item.label} className="flex items-center gap-2 px-4 first:pl-0 last:pr-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "#EBE4D6" }}>
              <Icon className="w-3.5 h-3.5" style={{ color: valueColor }} />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider leading-none mb-0.5"
                style={{ color: "rgba(14,59,46,0.5)" }}>
                {item.label}
              </p>
              {loading ? (
                <Skeleton />
              ) : (
                <p className="text-xs font-bold leading-none" style={{ color: valueColor }}>
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
