import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  getCurrentMonthRange,
  getCurrentQuarterRange,
  getCurrentYearRange,
  getLast30DaysRange,
} from "../../utils/reportCalculations";

type PeriodType = "mes" | "trimestre" | "ano" | "custom" | "30dias";

interface PeriodFilterProps {
  onPeriodChange: (period: PeriodType, dates: [Date, Date]) => void;
  defaultPeriod?: PeriodType;
}

interface PeriodOption {
  id: PeriodType;
  label: string;
  getDateRange: () => [Date, Date];
}

const periodOptions: PeriodOption[] = [
  {
    id: "mes",
    label: "Este Mês",
    getDateRange: getCurrentMonthRange,
  },
  {
    id: "30dias",
    label: "Últimos 30 Dias",
    getDateRange: getLast30DaysRange,
  },
  {
    id: "trimestre",
    label: "Este Trimestre",
    getDateRange: getCurrentQuarterRange,
  },
  {
    id: "ano",
    label: "Este Ano",
    getDateRange: getCurrentYearRange,
  },
];

export function PeriodFilter({ onPeriodChange, defaultPeriod = "mes" }: PeriodFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(defaultPeriod);
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const handlePeriodSelect = (period: PeriodType) => {
    setSelectedPeriod(period);
    setShowCustom(false);

    const option = periodOptions.find((p) => p.id === period);
    if (option) {
      onPeriodChange(period, option.getDateRange());
    }
  };

  const handleCustomSubmit = () => {
    if (!customStart || !customEnd) {
      alert("Por favor, preencha ambas as datas");
      return;
    }

    const startDate = new Date(customStart);
    const endDate = new Date(customEnd);

    if (startDate > endDate) {
      alert("Data inicial não pode ser posterior à data final");
      return;
    }

    setSelectedPeriod("custom");
    onPeriodChange("custom", [startDate, endDate]);
    setShowCustom(false);
  };

  return (
    <div className="bg-[#1B1B1B] border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Período</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {periodOptions.map((period) => (
          <button
            key={period.id}
            onClick={() => handlePeriodSelect(period.id)}
            className={`px-4 py-2 rounded font-medium text-sm transition-all ${
              selectedPeriod === period.id
                ? "bg-[#28A263] text-white"
                : "bg-white/10 text-[#A1A1A1] hover:bg-white/20"
            }`}
          >
            {period.label}
          </button>
        ))}

        <button
          onClick={() => {
            setShowCustom(!showCustom);
            setSelectedPeriod("custom");
          }}
          className={`px-4 py-2 rounded font-medium text-sm flex items-center justify-center gap-2 transition-all ${
            showCustom
              ? "bg-[#28A263] text-white"
              : "bg-white/10 text-[#A1A1A1] hover:bg-white/20"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="hidden md:inline">Custom</span>
        </button>
      </div>

      {/* Custom Date Range */}
      {showCustom && (
        <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#A1A1A1] mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#0F0F0F] border border-white/10 text-white focus:outline-none focus:border-[#28A263]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A1A1A1] mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#0F0F0F] border border-white/10 text-white focus:outline-none focus:border-[#28A263]"
              />
            </div>
          </div>

          <button
            onClick={handleCustomSubmit}
            className="w-full px-4 py-2 rounded bg-[#28A263] text-white font-medium hover:bg-[#1F8A4A] transition-colors"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Helper: Formata data range para exibição
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = startDate.toLocaleDateString("pt-BR");
  const end = endDate.toLocaleDateString("pt-BR");
  return `${start} a ${end}`;
}
