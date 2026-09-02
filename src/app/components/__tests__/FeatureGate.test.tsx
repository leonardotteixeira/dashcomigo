import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { FeatureGate } from "../FeatureGate";

const renderGate = (plan: "free" | "pro") =>
  render(
    <MemoryRouter>
      <FeatureGate feature="investments" plan={plan}>
        <p>Conteúdo premium</p>
      </FeatureGate>
    </MemoryRouter>
  );

describe("<FeatureGate />", () => {
  it("libera o conteúdo para o plano PRO sem overlay", () => {
    renderGate("pro");
    expect(screen.getByText("Conteúdo premium")).toBeInTheDocument();
    expect(screen.queryByText(/Fazer Upgrade/i)).not.toBeInTheDocument();
  });

  it("bloqueia com CTA de upgrade no plano FREE", () => {
    renderGate("free");
    expect(screen.getByText("Disponível no Plano Premium")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Fazer Upgrade/i })).toBeInTheDocument();
  });
});
