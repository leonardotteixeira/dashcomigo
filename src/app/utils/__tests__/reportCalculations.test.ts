import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatPercentage,
  calculateMargin,
  calculateGrowth,
  groupBy,
  sumByKey,
} from "../reportCalculations";

describe("reportCalculations", () => {
  describe("formatCurrency", () => {
    it("formata em Real brasileiro com duas casas decimais", () => {
      // toLocaleString usa espaço não separável (U+00A0) entre "R$" e o número
      expect(formatCurrency(1234.5).replace(/ /g, " ")).toBe("R$ 1.234,50");
    });

    it("formata zero e valores negativos", () => {
      expect(formatCurrency(0).replace(/ /g, " ")).toBe("R$ 0,00");
      expect(formatCurrency(-99.9).replace(/ /g, " ")).toBe("-R$ 99,90");
    });
  });

  describe("formatPercentage", () => {
    it("usa uma casa decimal e sufixo %", () => {
      expect(formatPercentage(12.345)).toBe("12.3%");
      expect(formatPercentage(0)).toBe("0.0%");
    });
  });

  describe("calculateMargin", () => {
    it("calcula margem bruta em porcentagem", () => {
      expect(calculateMargin(1000, 600)).toBe(40);
    });

    it("retorna 0 quando a receita é zero (evita divisão por zero)", () => {
      expect(calculateMargin(0, 500)).toBe(0);
    });

    it("permite margem negativa quando despesa supera receita", () => {
      expect(calculateMargin(100, 150)).toBe(-50);
    });
  });

  describe("calculateGrowth", () => {
    it("calcula crescimento percentual entre períodos", () => {
      expect(calculateGrowth(150, 100)).toBe(50);
      expect(calculateGrowth(50, 100)).toBe(-50);
    });

    it("trata período anterior zerado sem dividir por zero", () => {
      expect(calculateGrowth(10, 0)).toBe(100);
      expect(calculateGrowth(0, 0)).toBe(0);
    });
  });

  describe("groupBy / sumByKey", () => {
    const lancamentos = [
      { categoria: "vendas", valor: 100 },
      { categoria: "vendas", valor: 50 },
      { categoria: "servicos", valor: 200 },
    ];

    it("agrupa por chave", () => {
      const grupos = groupBy(lancamentos, "categoria");
      expect(Object.keys(grupos)).toEqual(["vendas", "servicos"]);
      expect(grupos.vendas).toHaveLength(2);
    });

    it("soma valores por chave", () => {
      expect(sumByKey(lancamentos, "valor")).toBe(350);
      expect(sumByKey([], "valor")).toBe(0);
    });
  });
});
