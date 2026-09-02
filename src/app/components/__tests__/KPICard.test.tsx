import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Wallet } from "lucide-react";
import { KPICard } from "../KPICard";

describe("<KPICard />", () => {
  it("renderiza label, valor e descrição", () => {
    render(
      <KPICard icon={Wallet} label="Receita do mês" value="R$ 1.000,00" description="vs. mês anterior" />
    );
    expect(screen.getByText("Receita do mês")).toBeInTheDocument();
    expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
    expect(screen.getByText("vs. mês anterior")).toBeInTheDocument();
  });

  it("mostra a tendência com seta e porcentagem", () => {
    render(
      <KPICard icon={Wallet} label="Lucro" value={500} trend={{ direction: "up", percentage: 12.5 }} />
    );
    expect(screen.getByText(/↑/)).toHaveTextContent("12.5%");
  });

  it("dispara onClick ao clicar no card", () => {
    const onClick = vi.fn();
    render(<KPICard icon={Wallet} label="Clientes" value={8} onClick={onClick} />);
    fireEvent.click(screen.getByText("Clientes"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
