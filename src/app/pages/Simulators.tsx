import { Calculator, DollarSign, TrendingUp, Target } from "lucide-react";
import { useState } from "react";
import { KPICard } from "../components/KPICard";
import { PageHeader } from "../components/PageHeader";

export function Simulators() {
  const [meiRevenue, setMeiRevenue] = useState("");
  const [productCost, setProductCost] = useState("");
  const [desiredMargin, setDesiredMargin] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [monthlyCosts, setMonthlyCosts] = useState("");

  const calculateMEI = () => {
    const revenue = parseFloat(meiRevenue);
    if (!revenue) return null;
    const limit = 81000;
    const remaining = limit - revenue;
    const percentage = (revenue / limit) * 100;
    return { remaining, percentage, limit };
  };

  const calculatePrice = () => {
    const cost = parseFloat(productCost);
    const margin = parseFloat(desiredMargin);
    if (!cost || !margin) return null;
    const price = cost / (1 - margin / 100);
    return price;
  };

  const calculateProfit = () => {
    const revenue = parseFloat(monthlyRevenue);
    const costs = parseFloat(monthlyCosts);
    if (!revenue || !costs) return null;
    const profit = revenue - costs;
    const margin = (profit / revenue) * 100;
    return { profit, margin };
  };

  const meiResult = calculateMEI();
  const priceResult = calculatePrice();
  const profitResult = calculateProfit();

  return (
    <div className="space-y-6">
      {/* Header with PageHeader component */}
      <PageHeader
        title="Simuladores"
        subtitle="Ferramentas para ajudar no planejamento financeiro"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MEI Limit Simulator */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Simulador MEI</h3>
              <p className="text-xs text-muted-foreground">
                Acompanhe seu limite anual
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-foreground mb-2 block">
                Receita Bruta Atual (R$)
              </label>
              <input
                type="number"
                value={meiRevenue}
                onChange={(e) => setMeiRevenue(e.target.value)}
                placeholder="0,00"
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {meiResult && (
              <div className="bg-secondary rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Limite Anual MEI</span>
                  <span className="text-sm font-semibold text-foreground">
                    R$ {meiResult.limit.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ainda pode faturar</span>
                  <span className="text-sm font-semibold text-success">
                    R$ {meiResult.remaining.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${
                      meiResult.percentage > 90 ? "bg-destructive" :
                      meiResult.percentage > 70 ? "bg-warning" : "bg-success"
                    }`}
                    style={{ width: `${Math.min(meiResult.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {meiResult.percentage.toFixed(1)}% do limite utilizado
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Price Simulator */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Simulador de Preço</h3>
              <p className="text-xs text-muted-foreground">
                Calcule o preço ideal
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-foreground mb-2 block">
                Custo do Produto/Serviço (R$)
              </label>
              <input
                type="number"
                value={productCost}
                onChange={(e) => setProductCost(e.target.value)}
                placeholder="0,00"
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm text-foreground mb-2 block">
                Margem de Lucro Desejada (%)
              </label>
              <input
                type="number"
                value={desiredMargin}
                onChange={(e) => setDesiredMargin(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {priceResult && (
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Preço de Venda Sugerido</p>
                <p className="font-bold text-foreground">
                  R$ {priceResult.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Profit Simulator */}
        <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Simulador de Lucro</h3>
              <p className="text-xs text-muted-foreground">
                Calcule seu lucro e margem
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-foreground mb-2 block">
                Receita Mensal (R$)
              </label>
              <input
                type="number"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(e.target.value)}
                placeholder="0,00"
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm text-foreground mb-2 block">
                Custos Mensais (R$)
              </label>
              <input
                type="number"
                value={monthlyCosts}
                onChange={(e) => setMonthlyCosts(e.target.value)}
                placeholder="0,00"
                className="w-full px-3 py-2 border border-border rounded-lg bg-input-background text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {profitResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Lucro Mensal</p>
                <p className={`font-bold ${profitResult.profit >= 0 ? "text-success" : "text-destructive"}`}>
                  {profitResult.profit >= 0 ? "+" : ""}R${" "}
                  {Math.abs(profitResult.profit).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Margem de Lucro</p>
                <p className={`font-bold ${profitResult.margin >= 0 ? "text-success" : "text-destructive"}`}>
                  {profitResult.margin.toFixed(2)}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
