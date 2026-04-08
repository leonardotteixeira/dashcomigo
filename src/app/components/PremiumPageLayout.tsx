import { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

interface PremiumPageLayoutProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    color?: "green" | "blue" | "purple";
  };
  actions?: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
}

/**
 * Standard layout wrapper for all internal pages
 * Provides consistent header, spacing, and structure
 */
export function PremiumPageLayout({
  title,
  description,
  badge,
  actions,
  children,
  fullWidth = false,
}: PremiumPageLayoutProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        title={title}
        description={description}
        badge={badge}
        actions={actions}
      />
      <div className={fullWidth ? "" : ""}>{children}</div>
    </div>
  );
}
