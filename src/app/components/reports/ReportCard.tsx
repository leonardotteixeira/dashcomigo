import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency, formatPercentage, getTrendIcon, getColorByValue } from "../../utils/reportCalculations";

interface ReportCardProps {
  title: string;
  value: number;
  type: "receita" | "despesa" | "fluxo" | "margem" | "payables";
  comparison?: number; // % comparação período anterior
  icon: ReactNode;
  subtitle?: string;
  showTrend?: boolean;
}

const typeConfig = {
  receita: {
    color: "#28A263",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    label: "Receita",
  },
  despesa: {
    color: "#F74C4C",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    label: "Despesa",
  },
  fluxo: {
    color: "#5B5FFF",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    label: "Fluxo de Caixa",
  },
  margem: {
    color: "#F4B23C",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    label: "Margem",
  },
  payables: {
    color: "#FF9500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    label: "A Pagar",
  },
};

export function ReportCard({
  title,
  value,
  type,
  comparison = 0,
  icon,
  subtitle,
  showTrend = true,
}: ReportCardProps) {
  const config = typeConfig[type];
  const isNegative = type === "despesa" || type === "payables" ? value < 0 : value < 0;
  const trend = getTrendIcon(comparison);
  const trendColor = getColorByValue(comparison);

  const formattedValue = type === "margem" ? formatPercentage(value) : formatCurrency(value);

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-6 hover:border-opacity-100 transition-all duration-200`}
      style={{ borderColor: `${config.color}33` }}
    >
      {/* Header: Icon + Title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#A1A1A1] mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{formattedValue}</h3>
        </div>
        <div
          className="p-3 rounded-lg flex-shrink-0"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <div style={{ color: config.color }}>{icon}</div>
        </div>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-[#686F6F] mb-3">{subtitle}</p>
      )}

      {/* Trend / Comparison */}
      {showTrend && comparison !== undefined && comparison !== 0 && (
        <div className="flex items-center gap-2 pt-3 border-t border-white/10">
          <span
            className="inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: trendColor }}
          >
            {comparison > 0 && <TrendingUp className="w-4 h-4" />}
            {comparison < 0 && <TrendingDown className="w-4 h-4" />}
            {comparison === 0 && <Minus className="w-4 h-4" />}
            {Math.abs(comparison).toFixed(1)}%
          </span>
          <span className="text-xs text-[#A1A1A1]">vs período anterior</span>
        </div>
      )}

      {/* Status indicator */}
      <div
        className="absolute top-0 right-0 w-1 h-12 rounded-r-full"
        style={{ backgroundColor: config.color }}
      />
    </div>
  );
}

// Variant: Compact card for smaller spaces
interface CompactReportCardProps {
  label: string;
  value: number;
  format?: (v: number) => string;
  color?: string;
}

export function CompactReportCard({
  label,
  value,
  format = formatCurrency,
  color = "#28A263",
}: CompactReportCardProps) {
  return (
    <div className="bg-[#1B1B1B] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all">
      <p className="text-xs text-[#A1A1A1] mb-2">{label}</p>
      <p className="text-lg font-bold text-white">{format(value)}</p>
      <div
        className="mt-2 h-1 rounded-full bg-white/10"
        style={{
          width: "100%",
          backgroundColor: `${color}33`,
        }}
      >
        <div
          style={{
            width: "40%",
            height: "100%",
            backgroundColor: color,
            borderRadius: "full",
          }}
        />
      </div>
    </div>
  );
}
