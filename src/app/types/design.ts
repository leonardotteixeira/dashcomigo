export type ColorVariant = "green" | "blue" | "purple" | "orange" | "red";

export type TrendDirection = "up" | "down" | "neutral";

export interface MenuItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: "green" | "purple";
  end?: boolean;
  isPro?: boolean;
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export interface KPISummary {
  label: string;
  value: string | number;
  trend?: {
    direction: TrendDirection;
    percentage: number;
  };
  color?: ColorVariant;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    color?: ColorVariant;
  };
  actions?: React.ReactNode;
}
