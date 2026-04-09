import { Link, useLocation } from "react-router";
import { LucideIcon } from "lucide-react";

interface MenuItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: "green" | "purple";
  end?: boolean;
  onClick?: () => void;
}

export function MenuItem({
  name,
  href,
  icon: Icon,
  badge,
  badgeColor = "green",
  end,
  onClick,
}: MenuItemProps) {
  const { pathname } = useLocation();

  const isActive = end
    ? pathname === href
    : pathname.startsWith(href);

  const badgeStyles = {
    green: "bg-[#10b981] text-white",
    purple: "bg-[#8B5CF6] text-white",
  };

  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 text-sm ${
        isActive
          ? "bg-gradient-to-r from-[#003a6d] to-[#0066FF] text-white font-medium shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
          : "text-[#001529] hover:bg-[#F5F7FA] hover:translate-x-0.5"
      }`}
      onClick={onClick}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-[#001529]"}`} />
      <span className="flex-1">{name}</span>
      {badge && !isActive && (
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide ${badgeStyles[badgeColor]}`}>
          {badge}
        </span>
      )}
    </Link>
  );
}
