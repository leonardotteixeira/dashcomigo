import { ReactNode } from "react";

interface MenuSectionProps {
  title: string;
  children: ReactNode;
}

export function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <div>
      <div className="px-3 py-1 text-[10px] font-bold text-[#00152966] uppercase tracking-[0.5px]">
        {title}
      </div>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}
