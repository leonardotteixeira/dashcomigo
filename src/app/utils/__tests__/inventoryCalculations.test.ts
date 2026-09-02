import { describe, it, expect } from "vitest";
import {
  calculateItemValue,
  calculateTotalInventoryValue,
  getAlertItems,
  isItemInAlert,
} from "../inventoryCalculations";
import type { InventoryItem } from "../../types/inventory";

const item = (overrides: Partial<InventoryItem> = {}): InventoryItem => ({
  id: "1",
  userid: "u1",
  nome: "Produto",
  quantidade: 10,
  preco_unitario: 25,
  categoria: "geral",
  status: "ativo",
  ...overrides,
});

describe("inventoryCalculations", () => {
  it("calcula valor de um item e do estoque total", () => {
    expect(calculateItemValue(item())).toBe(250);
    expect(
      calculateTotalInventoryValue([item(), item({ quantidade: 2, preco_unitario: 100 })])
    ).toBe(450);
    expect(calculateTotalInventoryValue([])).toBe(0);
  });

  it("marca alerta apenas para item ativo abaixo do mínimo", () => {
    expect(isItemInAlert(item({ quantidade: 3, quantidade_minima: 5 }))).toBe(true);
    expect(isItemInAlert(item({ quantidade: 5, quantidade_minima: 5 }))).toBe(false);
    expect(isItemInAlert(item({ quantidade: 3 }))).toBe(false);
  });

  it("filtra itens em alerta", () => {
    const lista = [
      item({ id: "a", quantidade: 1, quantidade_minima: 5 }),
      item({ id: "b", quantidade: 50, quantidade_minima: 5 }),
    ];
    expect(getAlertItems(lista).map((i) => i.id)).toEqual(["a"]);
  });
});
