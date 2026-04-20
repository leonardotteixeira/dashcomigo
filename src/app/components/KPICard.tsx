import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    percentage: number;
  };
  color?: "green" | "blue" | "purple" | "orange" | "red";
  onClick?: () => void;
}

export function KPICard({ icon: Icon, label, value, description, trend, color = "blue", onClick }: KPICardProps) {
  const colorStyles = {
    green: "bg-[#10b981]/10 text-[#10b981]",
    blue: "bg-[#0066FF]/10 text-[#0066FF]",
    purple: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
    orange: "bg-[#f97316]/10 text-[#f97316]",
    red: "bg-[#ef4444]/10 text-[#ef4444]",
  };

  const trendStyles = {
    up: "text-[#10b981]",
    down: "text-[#ef4444]",
    neutral: "text-[rgba(0,21,41,0.6)]",
  };

  return (
    <div
      onClick={onClick}
      className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6 hover:border-[#0066FF]/20 hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorStyles[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`text-xs font-bold ${trendStyles[trend.direction]}`}>
            {trend.direction === "up" && "↑"}
            {trend.direction === "down" && "↓"}
            {Math.abs(trend.percentage)}%
          </div>
        )}
      </div>
      <p className="text-sm text-[rgba(0,21,41,0.6)] mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#0E3B2E]">{value}</p>
      {description && <p className="text-xs text-[rgba(0,21,41,0.4)] mt-1">{description}</p>}
    </div>
  );
}
