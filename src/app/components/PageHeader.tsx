import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    color?: "green" | "purple" | "blue";
  };
  actions?: ReactNode;
}

export function PageHeader({ title, description, badge, actions }: PageHeaderProps) {
  const badgeStyles = {
    green: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20",
    purple: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20",
    blue: "bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/20",
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-[#0E3B2E]">{title}</h1>
          {badge && (
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border uppercase tracking-wide ${badgeStyles[badge.color || "green"]}`}>
              {badge.text}
            </span>
          )}
        </div>
        {description && (
          <p className="text-[rgba(0,21,41,0.6)] max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
