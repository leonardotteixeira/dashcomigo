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
    green: "text-white",
    purple: "text-white",
  };

  const badgeBg = {
    green: "#1F5A3A",
    purple: "#8B5CF6",
  };

  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
        isActive
          ? "font-medium"
          : "hover:translate-x-0.5"
      }`}
      style={isActive
        ? { background: "#0E3B2E", color: "#F4EFE6" }
        : { color: "#0E3B2E" }
      }
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "#EBE4D6"; }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
      onClick={onClick}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{name}</span>
      {badge && !isActive && (
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide ${badgeStyles[badgeColor]}`}
          style={{ background: badgeBg[badgeColor] }}>
          {badge}
        </span>
      )}
    </Link>
  );
}
