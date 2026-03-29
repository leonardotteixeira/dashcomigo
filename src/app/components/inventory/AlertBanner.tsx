import { AlertTriangle } from "lucide-react";
import { InventoryItem } from "../../types/inventory";

interface AlertBannerProps {
  alertItems: InventoryItem[];
}

export function AlertBanner({ alertItems }: AlertBannerProps) {
  if (alertItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <div>
          <p className="text-red-500 font-semibold text-sm">
            {alertItems.length} item(ns) com estoque baixo
          </p>
          <p className="text-red-500/70 text-xs mt-1">
            {alertItems.map((item) => item.nome).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
