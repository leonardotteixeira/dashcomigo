import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { pb, getVerifiedPlan } from "../../lib/pocketbase";
import {
  InventoryItem,
  InventoryMovement,
  InventorySummary,
  InventoryContextType,
  INVENTORY_LIMITS,
} from "../types/inventory";
import {
  calculateTotalInventoryValue,
  getAlertItems,
  generateInventorySummary,
  applyMovement,
  getMovementsInRange,
} from "../utils/inventoryCalculations";

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all inventory items for the current user
   */
  const fetchItems = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const records = await pb.collection("inventory").getList(1, 500, {
        filter: `userid = "${user.id}"`,
        sort: "-updated",
      });

      setItems(records.items as InventoryItem[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar estoque";
      setError(message);
      console.error("Inventory fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all movements for the current user
   */
  const fetchMovements = async () => {
    if (!user) return;

    try {
      const records = await pb.collection("inventory_movements").getList(1, 500, {
        filter: `userid = "${user.id}"`,
        sort: "-data",
      });

      setMovements(records.items as InventoryMovement[]);
    } catch (err) {
      console.error("Movements fetch error:", err);
    }
  };

  /**
   * Initial load and setup subscriptions
   */
  useEffect(() => {
    if (!user) return;

    fetchItems();
    fetchMovements();

    // Optional: Subscribe to real-time updates
    const unsubscribeItems = pb.collection("inventory").subscribe("*", () => {
      fetchItems();
    });

    const unsubscribeMovements = pb.collection("inventory_movements").subscribe("*", () => {
      fetchMovements();
    });

    return () => {
      unsubscribeItems.then((unsub) => unsub());
      unsubscribeMovements.then((unsub) => unsub());
    };
  }, [user]);

  /**
   * Add a new inventory item
   */
  const addItem = async (item: Omit<InventoryItem, "id" | "created" | "updated">) => {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      setError(null);

      // Re-verify plan from PocketBase to prevent client-side state manipulation
      const plan = await getVerifiedPlan(user.id);
      const limit = plan === "pro" ? INVENTORY_LIMITS.PRO : INVENTORY_LIMITS.FREE;
      if (items.length >= limit) {
        throw new Error("Limite de itens atingido para seu plano");
      }

      const record = await pb.collection("inventory").create({
        ...item,
        userid: user.id,
      });

      const newItem = record as InventoryItem;
      setItems([newItem, ...items]);
      return newItem;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao adicionar item";
      setError(message);
      throw err;
    }
  };

  /**
   * Update an existing inventory item
   */
  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      setError(null);

      const record = await pb.collection("inventory").update(id, updates);
      const updated = record as InventoryItem;

      setItems(items.map((item) => (item.id === id ? updated : item)));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar item";
      setError(message);
      throw err;
    }
  };

  /**
   * Delete an inventory item
   */
  const deleteItem = async (id: string) => {
    try {
      setError(null);

      await pb.collection("inventory").delete(id);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao deletar item";
      setError(message);
      throw err;
    }
  };

  /**
   * Get item by ID
   */
  const getItemById = (id: string): InventoryItem | undefined => {
    return items.find((item) => item.id === id);
  };

  /**
   * Get items by category
   */
  const getItemsByCategory = (category: string): InventoryItem[] => {
    return items.filter((item) => item.categoria === category && item.status === "ativo");
  };

  /**
   * Get item by SKU
   */
  const getItemsBySku = (sku: string): InventoryItem | undefined => {
    return items.find((item) => item.sku === sku);
  };

  /**
   * Get alert items
   */
  const getAlertItemsWrapper = (): InventoryItem[] => {
    return getAlertItems(items);
  };

  /**
   * Get total inventory value
   */
  const getTotalValue = (): number => {
    return calculateTotalInventoryValue(items);
  };

  /**
   * Get inventory summary
   */
  const getSummary = (): InventorySummary => {
    return generateInventorySummary(items);
  };

  /**
   * Check plan limit
   */
  const getLimitStatus = () => {
    const limit = user?.plan === "pro" ? INVENTORY_LIMITS.PRO : INVENTORY_LIMITS.FREE;
    return {
      used: items.length,
      limit,
      percentage: limit === Infinity ? 0 : (items.length / limit) * 100,
    };
  };

  /**
   * Can add item based on plan
   */
  const canAddItem = (): boolean => {
    const limit = user?.plan === "pro" ? INVENTORY_LIMITS.PRO : INVENTORY_LIMITS.FREE;
    return items.length < limit;
  };

  /**
   * Add a movement record
   */
  const addMovement = async (
    movement: Omit<InventoryMovement, "id" | "created">
  ): Promise<InventoryMovement> => {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      setError(null);

      // Create the movement record
      const record = await pb.collection("inventory_movements").create({
        ...movement,
        userid: user.id,
      });

      const newMovement = record as InventoryMovement;

      // Update the inventory item's quantity
      const item = items.find((i) => i.id === movement.inventory_id);
      if (item) {
        const newQuantity = applyMovement(item.quantidade, movement.tipo, movement.quantidade);
        await updateItem(movement.inventory_id, { quantidade: newQuantity });
      }

      setMovements([newMovement, ...movements]);
      return newMovement;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao registrar movimento";
      setError(message);
      throw err;
    }
  };

  /**
   * Get movements with optional filtering
   */
  const getMovements = (inventoryId?: string, days?: number): InventoryMovement[] => {
    let filtered = movements;

    if (inventoryId) {
      filtered = filtered.filter((m) => m.inventory_id === inventoryId);
    }

    return getMovementsInRange(filtered, days);
  };

  /**
   * Get movements for a specific inventory item
   */
  const getMovementsByInventoryId = (inventoryId: string, days?: number): InventoryMovement[] => {
    return getMovements(inventoryId, days);
  };

  /**
   * Refresh data
   */
  const refresh = async () => {
    await Promise.all([fetchItems(), fetchMovements()]);
  };

  const value = useMemo(
    () => ({
      items,
      movements,
      loading,
      error,
      addItem,
      updateItem,
      deleteItem,
      getItemById,
      getItemsByCategory,
      getItemsBySku,
      getAlertItems: getAlertItemsWrapper,
      getTotalValue,
      getSummary,
      getLimitStatus,
      canAddItem,
      addMovement,
      getMovements,
      getMovementsByInventoryId,
      refresh,
    }),
    [items, movements, loading, error, user]
  );

  return (
    <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
  );
}

export function useInventory(): InventoryContextType {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory deve ser usado dentro de InventoryProvider");
  }
  return context;
}
