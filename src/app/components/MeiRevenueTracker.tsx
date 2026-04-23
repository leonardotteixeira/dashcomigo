import { AlertTriangle, TrendingUp, Info } from "lucide-react";
import { useFinancialMetrics } from "../../utils/useFinancialMetrics";

const MEI_LIMIT = 81_000;

export default function MeiRevenueTracker() {
  const { anoReceitas, fmt } = useFinancialMetrics();

  const pct = Math.min((anoReceitas / MEI_LIMIT) * 100, 100);
  const remaining = Math.max(MEI_LIMIT - anoReceitas, 0);

  const now = new Date();
  const monthsLeft = 12 - now.getMonth(); // e.g. April (month 3) → 9 months left

  const isWarning = pct >= 75 && pct < 90;
  const isDanger = pct >= 90;

  const barColor = isDanger
    ? "#ef4444"
    : isWarning
    ? "#f59e0b"
    : "#10b981";

  const bgColor = isDanger
    ? "bg-red-50 border-red-200"
    : isWarning
    ? "bg-amber-50 border-amber-200"
    : "bg-[#EBE4D6] border-[rgba(20,18,15,0.13)]";

  const labelColor = isDanger
    ? "text-red-700"
    : isWarning
    ? "text-amber-700"
    : "text-[#0E3B2E]";

  const subColor = isDanger
    ? "text-red-500"
    : isWarning
    ? "text-amber-500"
    : "text-[#0E3B2E]/60";

  return (
    <div className={`rounded-2xl p-5 border shadow-sm ${bgColor}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${barColor}18` }}
          >
            {isDanger || isWarning ? (
              <AlertTriangle className="w-4.5 h-4.5" style={{ color: barColor }} />
            ) : (
              <TrendingUp className="w-4.5 h-4.5" style={{ color: barColor }} />
            )}
          </div>
          <div>
            <p className={`text-sm font-bold ${labelColor}`}>
              Faturamento Anual MEI
            </p>
            <p className={`text-xs ${subColor}`}>
              Limite: R$ 81.000,00 / ano
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className={`text-lg font-extrabold leading-none ${labelColor}`}>
            {pct.toFixed(1)}%
          </p>
          <p className={`text-xs mt-0.5 ${subColor}`}>utilizado</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 rounded-full bg-black/10 mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${labelColor}`}>
          {fmt(anoReceitas)} faturados
        </span>
        <span className={subColor}>
          {remaining > 0
            ? `${fmt(remaining)} restantes · ${monthsLeft} ${monthsLeft === 1 ? "mês" : "meses"} no ano`
            : "Limite atingido"}
        </span>
      </div>

      {/* Contextual alert */}
      {isDanger && (
        <div className="mt-3 flex items-start gap-2 text-xs text-red-700 bg-red-100 rounded-xl px-3 py-2.5">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>
            Você está acima de 90% do limite MEI. Considere pausar novos contratos
            ou planejar a migração para ME antes de ultrapassar R$ 81.000.
          </span>
        </div>
      )}
      {isWarning && !isDanger && (
        <div className="mt-3 flex items-start gap-2 text-xs text-amber-700 bg-amber-100 rounded-xl px-3 py-2.5">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>
            Você usou 75% do limite anual MEI. Fique atento ao ritmo de faturamento
            para evitar surpresas no fim do ano.
          </span>
        </div>
      )}
    </div>
  );
}
