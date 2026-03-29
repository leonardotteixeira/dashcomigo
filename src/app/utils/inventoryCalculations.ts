/**
 * Inventory Calculation Utilities
 * Pure functions for inventory calculations and data aggregation
 */

import {
  InventoryItem,
  InventoryMovement,
  InventorySummary,
  MovementType,
} from "../types/inventory";

/**
 * Calculate the total value of a single item
 * valorTotal = quantidade * preco_unitario
 */
export function calculateItemValue(item: InventoryItem): number {
  return item.quantidade * item.preco_unitario;
}

/**
 * Calculate total inventory value across all items
 */
export function calculateTotalInventoryValue(items: InventoryItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemValue(item), 0);
}

/**
 * Get items that are below their minimum quantity threshold
 */
export function getAlertItems(items: InventoryItem[]): InventoryItem[] {
  return items.filter(
    (item) =>
      item.status === "ativo" &&
      item.quantidade_minima &&
      item.quantidade < item.quantidade_minima
  );
}

/**
 * Group items by category and calculate summary stats
 */
export function groupByCategory(items: InventoryItem[]): Record<
  string,
  {
    count: number;
    quantity: number;
    value: number;
    avgPrice: number;
  }
> {
  const grouped: Record<
    string,
    {
      count: number;
      quantity: number;
      value: number;
      avgPrice: number;
    }
  > = {};

  items.forEach((item) => {
    if (!grouped[item.categoria]) {
      grouped[item.categoria] = {
        count: 0,
        quantity: 0,
        value: 0,
        avgPrice: 0,
      };
    }

    const itemValue = calculateItemValue(item);
    grouped[item.categoria].count += 1;
    grouped[item.categoria].quantity += item.quantidade;
    grouped[item.categoria].value += itemValue;
  });

  // Calculate average price
  Object.keys(grouped).forEach((category) => {
    grouped[category].avgPrice =
      grouped[category].count > 0
        ? grouped[category].value / grouped[category].count
        : 0;
  });

  return grouped;
}

/**
 * Generate comprehensive inventory summary
 */
export function generateInventorySummary(items: InventoryItem[]): InventorySummary {
  const alerts = getAlertItems(items);
  const byCategory = groupByCategory(items);

  return {
    totalItems: items.length,
    totalValue: calculateTotalInventoryValue(items),
    alertItems: alerts.length,
    categoryCount: Object.keys(byCategory).length,
    itemsByCategory: Object.entries(byCategory).reduce(
      (acc, [category, data]) => {
        acc[category] = {
          count: data.count,
          value: data.value,
        };
        return acc;
      },
      {} as Record<string, { count: number; value: number }>
    ),
  };
}

/**
 * Apply inventory movement to an item
 * Returns the updated quantity
 */
export function applyMovement(
  currentQuantity: number,
  movementType: MovementType,
  quantity: number
): number {
  switch (movementType) {
    case "entrada":
      return currentQuantity + quantity;
    case "saida":
      return Math.max(0, currentQuantity - quantity);
    case "ajuste":
      return quantity; // Direct set
    default:
      return currentQuantity;
  }
}

/**
 * Get movements within a time range
 */
export function getMovementsInRange(
  movements: InventoryMovement[],
  days?: number
): InventoryMovement[] {
  if (!days) return movements;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return movements.filter((movement) => new Date(movement.data) >= cutoffDate);
}

/**
 * Get movement statistics for a single item
 */
export function getItemMovementStats(
  itemId: string,
  movements: InventoryMovement[]
): {
  totalEntrada: number;
  totalSaida: number;
  totalAjuste: number;
  lastMovement?: InventoryMovement;
} {
  const itemMovements = movements.filter((m) => m.inventory_id === itemId);

  const stats = {
    totalEntrada: 0,
    totalSaida: 0,
    totalAjuste: 0,
    lastMovement: undefined as InventoryMovement | undefined,
  };

  itemMovements.forEach((movement) => {
    switch (movement.tipo) {
      case "entrada":
        stats.totalEntrada += movement.quantidade;
        break;
      case "saida":
        stats.totalSaida += movement.quantidade;
        break;
      case "ajuste":
        stats.totalAjuste += 1;
        break;
    }
  });

  if (itemMovements.length > 0) {
    // Get the most recent movement
    stats.lastMovement = itemMovements.reduce((latest, current) =>
      new Date(current.data) > new Date(latest.data) ? current : latest
    );
  }

  return stats;
}

/**
 * Calculate movement summary for a time period
 */
export function getMovementSummary(
  movements: InventoryMovement[],
  days?: number
): {
  totalEntrada: number;
  totalSaida: number;
  adjustmentCount: number;
  avgMovementSize: number;
} {
  const filtered = getMovementsInRange(movements, days);

  let totalEntrada = 0;
  let totalSaida = 0;
  let adjustmentCount = 0;

  filtered.forEach((movement) => {
    switch (movement.tipo) {
      case "entrada":
        totalEntrada += movement.quantidade;
        break;
      case "saida":
        totalSaida += movement.quantidade;
        break;
      case "ajuste":
        adjustmentCount += 1;
        break;
    }
  });

  const avgMovementSize = filtered.length > 0 ? totalEntrada + totalSaida / filtered.length : 0;

  return {
    totalEntrada,
    totalSaida,
    adjustmentCount,
    avgMovementSize,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

/**
 * Format quantity with thousands separator
 */
export function formatQuantity(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Check if item is in alert status
 */
export function isItemInAlert(item: InventoryItem): boolean {
  return (
    item.status === "ativo" &&
    item.quantidade_minima !== undefined &&
    item.quantidade < item.quantidade_minima
  );
}

/**
 * Sort items by various criteria
 */
export function sortItems(
  items: InventoryItem[],
  sortBy: "nome" | "quantidade" | "preco" | "valor" | "categoria"
): InventoryItem[] {
  const sorted = [...items];

  switch (sortBy) {
    case "nome":
      return sorted.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    case "quantidade":
      return sorted.sort((a, b) => b.quantidade - a.quantidade);
    case "preco":
      return sorted.sort((a, b) => b.preco_unitario - a.preco_unitario);
    case "valor":
      return sorted.sort((a, b) => calculateItemValue(b) - calculateItemValue(a));
    case "categoria":
      return sorted.sort((a, b) => a.categoria.localeCompare(b.categoria, "pt-BR"));
    default:
      return sorted;
  }
}

/**
 * Search items by name or SKU
 */
export function searchItems(items: InventoryItem[], query: string): InventoryItem[] {
  const lowerQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      item.nome.toLowerCase().includes(lowerQuery) ||
      (item.sku && item.sku.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Filter items by criteria
 */
export function filterItems(
  items: InventoryItem[],
  filters: {
    status?: "ativo" | "inativo";
    categoria?: string;
    onlyAlerts?: boolean;
  }
): InventoryItem[] {
  let filtered = items;

  if (filters.status) {
    filtered = filtered.filter((item) => item.status === filters.status);
  }

  if (filters.categoria) {
    filtered = filtered.filter((item) => item.categoria === filters.categoria);
  }

  if (filters.onlyAlerts) {
    filtered = filtered.filter((item) => isItemInAlert(item));
  }

  return filtered;
}
