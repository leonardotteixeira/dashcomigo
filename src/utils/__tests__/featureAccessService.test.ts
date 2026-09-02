import { describe, it, expect } from "vitest";
import {
  FEATURE_LIMITS,
  getLimit,
  canAccess,
  isLimitReached,
  getUsagePercentage,
} from "../featureAccessService";

describe("featureAccessService (regras FREE vs PRO)", () => {
  it("plano PRO nunca tem limite", () => {
    (Object.keys(FEATURE_LIMITS) as Array<keyof typeof FEATURE_LIMITS>).forEach((feature) => {
      expect(canAccess(feature, "pro")).toBe(true);
      expect(isLimitReached(feature, 9999, "pro")).toBe(false);
      expect(getUsagePercentage(feature, 9999, "pro")).toBe(0);
    });
  });

  it("plano FREE respeita o limite configurado", () => {
    const limite = getLimit("clients", "free");
    expect(limite).toBe(FEATURE_LIMITS.clients.free);
    expect(isLimitReached("clients", limite - 1, "free")).toBe(false);
    expect(isLimitReached("clients", limite, "free")).toBe(true);
  });

  it("features sem acesso no FREE (limite 0) são bloqueadas", () => {
    const bloqueadas = (Object.keys(FEATURE_LIMITS) as Array<keyof typeof FEATURE_LIMITS>).filter(
      (f) => FEATURE_LIMITS[f].free === 0
    );
    bloqueadas.forEach((feature) => {
      expect(canAccess(feature, "free")).toBe(false);
    });
  });

  it("calcula porcentagem de uso no FREE", () => {
    const limite = getLimit("clients", "free");
    expect(getUsagePercentage("clients", limite / 2, "free")).toBe(50);
  });
});
