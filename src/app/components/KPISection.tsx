import { ReactNode } from "react";

interface KPISectionProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

export function KPISection({ children, columns = 4 }: KPISectionProps) {
  const gridClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6 mb-8`}>
      {children}
    </div>
  );
}
