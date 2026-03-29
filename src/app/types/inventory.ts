/**
 * Inventory Management Types
 * Defines all TypeScript interfaces for inventory features
 */

export type InventoryStatus = "ativo" | "inativo";
export type MovementType = "entrada" | "saida" | "ajuste";
export type MovementReason = "Compra" | "Venda" | "Dano" | "Inventário" | "Ajuste";

export interface InventoryItem {
  id: string;
  user_id: string;
  nome: string;
  descricao?: string;
  quantidade: number;
  preco_unitario: number;
  categoria: string;
  quantidade_minima?: number;
  status: InventoryStatus;
  sku?: string;
  created?: string; // ISO date from PocketBase
  updated?: string; // ISO date from PocketBase
}

export interface InventoryMovement {
  id: string;
  inventory_id: string;
  user_id: string;
  tipo: MovementType;
  quantidade: number;
  motivo?: MovementReason;
  preco_unitario?: number;
  data: string; // ISO date
  anotacoes?: string;
  created?: string; // ISO date from PocketBase
}

export interface InventorySummary {
  totalItems: number;
  totalValue: number;
  alertItems: number;
  categoryCount: number;
  itemsByCategory: Record<string, { count: number; value: number }>;
}

export interface InventoryContextType {
  items: InventoryItem[];
  movements: InventoryMovement[];
  loading: boolean;
  error: string | null;

  // CRUD Operations
  addItem: (item: Omit<InventoryItem, "id" | "created" | "updated">) => Promise<InventoryItem>;
  updateItem: (id: string, item: Partial<InventoryItem>) => Promise<InventoryItem>;
  deleteItem: (id: string) => Promise<void>;
  getItemById: (id: string) => InventoryItem | undefined;

  // Queries
  getItemsByCategory: (category: string) => InventoryItem[];
  getItemsBySku: (sku: string) => InventoryItem | undefined;
  getAlertItems: () => InventoryItem[];
  getTotalValue: () => number;
  getSummary: () => InventorySummary;

  // Limit Management
  getLimitStatus: () => { used: number; limit: number; percentage: number };
  canAddItem: () => boolean;

  // Movement Operations
  addMovement: (movement: Omit<InventoryMovement, "id" | "created">) => Promise<InventoryMovement>;
  getMovements: (inventoryId?: string, days?: number) => InventoryMovement[];
  getMovementsByInventoryId: (inventoryId: string, days?: number) => InventoryMovement[];

  // Refresh
  refresh: () => Promise<void>;
}

export const CATEGORIAS_ESTOQUE = [
  "Produtos",
  "Insumos",
  "Componentes",
  "Matéria-prima",
  "Outros",
] as const;

export const MOVEMENT_REASONS: MovementReason[] = [
  "Compra",
  "Venda",
  "Dano",
  "Inventário",
  "Ajuste",
];

// Validation constants
export const INVENTORY_LIMITS = {
  FREE: 30,
  PRO: Infinity,
} as const;

export const CONSTRAINTS = {
  NOME_MIN: 1,
  NOME_MAX: 100,
  SKU_MAX: 50,
  QUANTIDADE_MIN: 0,
  PRECO_MIN: 0,
  QUANTIDADE_MINIMA_DEFAULT: 10,
} as const;
