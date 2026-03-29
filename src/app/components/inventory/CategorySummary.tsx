import { InventorySummary } from "../../types/inventory";
import { formatCurrency, formatQuantity } from "../../utils/inventoryCalculations";

interface CategorySummaryProps {
  summary: InventorySummary;
}

export function CategorySummary({ summary }: CategorySummaryProps) {
  const categories = Object.entries(summary.itemsByCategory).sort(
    (a, b) => b[1].value - a[1].value
  );

  if (categories.length === 0) {
    return (
      <div className="text-center text-[#A1A1A1] py-8">
        Nenhum item em estoque
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map(([category, data]) => (
        <div
          key={category}
          className="bg-[#0F0F0F] border border-white/10 rounded-lg p-4 flex justify-between items-start"
        >
          <div>
            <h4 className="text-white font-medium">{category}</h4>
            <p className="text-[#A1A1A1] text-sm mt-1">
              {data.count} item(ns) • Qtd: {formatQuantity(data.value)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">{formatCurrency(data.value)}</p>
            <p className="text-[#686F6F] text-xs mt-1">
              {((data.value / summary.totalValue) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
