import { useState } from "react";
import { KPICard } from "../components/KPICard";
import { PageHeader } from "../components/PageHeader";
import { toast } from "sonner";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Target,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
  CheckCircle2,
  Settings2,
  BarChart3,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtInt = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 0 });

const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

// ─── shared sub-components ──────────────────────────────────────────────────

function InputField({
  label,
  value,
  onChange,
  placeholder = "0,00",
  type = "number",
  min,
  max,
  step,
  suffix,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  max?: string;
  step?: string;
  suffix?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary pr-10"
        />
        {suffix && (
          <span className="absolute right-3 text-xs text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ResultCard({
  label,
  value,
  color = "default",
  small,
}: {
  label: string;
  value: string;
  color?: "default" | "success" | "warning" | "danger" | "info";
  small?: string;
}) {
  const colorMap = {
    default: "bg-secondary text-foreground",
    success: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
    warning: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
    danger: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400",
    info: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400",
  };
  return (
    <div className={`rounded-lg p-4 ${colorMap[color]}`}>
      <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
      <p className="text-lg font-bold">{value}</p>
      {small && <p className="text-xs opacity-60 mt-0.5">{small}</p>}
    </div>
  );
}

function InsightBox({
  text,
  tone = "neutral",
}: {
  text: string;
  tone?: "neutral" | "good" | "warning" | "danger";
}) {
  const map = {
    neutral: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
    good: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300",
    warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300",
    danger: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300",
  };
  return (
    <div className={`flex gap-3 items-start rounded-lg border p-4 ${map[tone]}`}>
      <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function AdvancedToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
    >
      <Settings2 className="w-3.5 h-3.5" />
      {open ? "Modo Simples" : "Modo Avançado"}
      {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
    </button>
  );
}

// ─── MEI Simulator ──────────────────────────────────────────────────────────

function MeiSimulator() {
  const [advanced, setAdvanced] = useState(false);
  const [revenue, setRevenue] = useState("");
  const [growthRate, setGrowthRate] = useState("");
  const [currentMonth, setCurrentMonth] = useState("1");

  const MEI_LIMIT = 81000;

  const calc = () => {
    const r = parseFloat(revenue);
    if (!r || r < 0) return null;

    const remaining = MEI_LIMIT - r;
    const percentage = (r / MEI_LIMIT) * 100;
    const exceeded = r > MEI_LIMIT;

    let projectedBreachMonth: number | null = null;
    let projectedEndRevenue: number | null = null;

    if (advanced) {
      const rate = parseFloat(growthRate) / 100;
      const month = parseInt(currentMonth);
      if (!isNaN(rate) && !isNaN(month) && !exceeded) {
        // project forward month by month
        let acc = r;
        for (let m = month + 1; m <= 12; m++) {
          acc = acc + acc * rate;
          if (acc >= MEI_LIMIT) {
            projectedBreachMonth = m;
            break;
          }
        }
        // project end-of-year revenue
        let endAcc = r;
        for (let m = month + 1; m <= 12; m++) {
          endAcc = endAcc + endAcc * rate;
        }
        projectedEndRevenue = endAcc;
      }
    }

    return { remaining, percentage, exceeded, projectedBreachMonth, projectedEndRevenue };
  };

  const result = calc();

  const getInsight = (): { text: string; tone: "neutral" | "good" | "warning" | "danger" } => {
    if (!result) return { text: "", tone: "neutral" };
    const { percentage, exceeded, projectedBreachMonth } = result;

    if (exceeded) {
      return {
        text: "Limite ultrapassado! Você precisa migrar para ME imediatamente para regularizar sua situação.",
        tone: "danger",
      };
    }
    if (percentage >= 80 && percentage < 95) {
      let extra = "";
      if (advanced && projectedBreachMonth) {
        extra = ` No ritmo atual, você atingirá o limite em ${MONTHS_PT[projectedBreachMonth - 1]}.`;
      }
      return {
        text: `Alerta! Você está próximo do limite MEI (${percentage.toFixed(1)}% utilizado). Considere migrar para ME antes de ultrapassar.${extra}`,
        tone: "danger",
      };
    }
    if (percentage >= 50) {
      let extra = "";
      if (advanced && projectedBreachMonth) {
        extra = ` No ritmo atual, você atingirá o limite em ${MONTHS_PT[projectedBreachMonth - 1]}.`;
      }
      return {
        text: `Atenção: você já utilizou ${percentage.toFixed(1)}% do limite anual. Planeje-se para os próximos meses.${extra}`,
        tone: "warning",
      };
    }
    let extra = "";
    if (advanced && projectedBreachMonth) {
      extra = ` No ritmo atual, você atingirá o limite em ${MONTHS_PT[projectedBreachMonth - 1]}.`;
    }
    if (advanced && !projectedBreachMonth && result.projectedEndRevenue) {
      const endPct = (result.projectedEndRevenue / MEI_LIMIT) * 100;
      extra = ` Projetando até dezembro, você usará aproximadamente ${endPct.toFixed(1)}% do limite.`;
    }
    return {
      text: `Você está dentro do limite MEI. Continue monitorando mensalmente.${extra}`,
      tone: "good",
    };
  };

  const { text: insightText, tone: insightTone } = getInsight();
  const barPct = result ? Math.min(result.percentage, 100) : 0;
  const barColor =
    result && result.exceeded
      ? "bg-red-500"
      : result && result.percentage >= 80
      ? "bg-amber-500"
      : result && result.percentage >= 50
      ? "bg-yellow-400"
      : "bg-emerald-500";

  const monthOptions = MONTHS_PT.map((m, i) => ({ value: String(i + 1), label: m }));

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Simulador MEI</h3>
            <p className="text-xs text-muted-foreground">Monitore seu limite anual de faturamento</p>
          </div>
        </div>
        <AdvancedToggle open={advanced} onToggle={() => setAdvanced((v) => !v)} />
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Receita Bruta Acumulada no Ano (R$)"
          value={revenue}
          onChange={setRevenue}
          suffix="R$"
        />
        {advanced && (
          <>
            <InputField
              label="Taxa de Crescimento Mensal (%)"
              value={growthRate}
              onChange={setGrowthRate}
              placeholder="0"
              suffix="%"
            />
            <SelectField
              label="Mês Atual"
              value={currentMonth}
              onChange={setCurrentMonth}
              options={monthOptions}
            />
          </>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Limite utilizado</span>
              <span className="font-medium">{result.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                style={{ width: `${barPct}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultCard
              label="Limite Anual MEI"
              value={`R$ ${fmtInt(MEI_LIMIT)}`}
              color="info"
            />
            <ResultCard
              label={result.exceeded ? "Valor Excedido" : "Ainda Pode Faturar"}
              value={`R$ ${fmt(Math.abs(result.remaining))}`}
              color={result.exceeded ? "danger" : "success"}
            />
            <ResultCard
              label="% Utilizado"
              value={`${result.percentage.toFixed(1)}%`}
              color={
                result.exceeded
                  ? "danger"
                  : result.percentage >= 80
                  ? "warning"
                  : "success"
              }
            />
            {advanced && result.projectedBreachMonth && (
              <ResultCard
                label="Previsão de Ultrapassagem"
                value={MONTHS_PT[result.projectedBreachMonth - 1]}
                color="danger"
                small="Ao ritmo de crescimento atual"
              />
            )}
            {advanced && !result.projectedBreachMonth && result.projectedEndRevenue && (
              <ResultCard
                label="Receita Projetada (Dez)"
                value={`R$ ${fmt(result.projectedEndRevenue)}`}
                color={result.projectedEndRevenue > MEI_LIMIT ? "danger" : "info"}
              />
            )}
          </div>

          <InsightBox text={insightText} tone={insightTone} />
        </div>
      )}
    </div>
  );
}

// ─── Price Simulator ─────────────────────────────────────────────────────────

function PriceSimulator() {
  const [advanced, setAdvanced] = useState(false);
  const [cost, setCost] = useState("");
  const [margin, setMargin] = useState("");
  const [fixedCosts, setFixedCosts] = useState("");
  const [volume, setVolume] = useState("");
  const [tax, setTax] = useState("6");
  const [commission, setCommission] = useState("0");

  const calc = () => {
    const c = parseFloat(cost);
    const m = parseFloat(margin);
    if (!c || !m || m >= 100) return null;

    if (!advanced) {
      const suggestedPrice = c / (1 - m / 100);
      const markup = ((suggestedPrice - c) / c) * 100;
      return { suggestedPrice, markup, simple: true };
    }

    const t = parseFloat(tax) || 0;
    const comm = parseFloat(commission) || 0;
    const fc = parseFloat(fixedCosts) || 0;
    const vol = parseFloat(volume) || 1;

    const costWithTax = c * (1 + t / 100);
    const fixedCostPerUnit = fc / vol;
    const totalCostPerUnit = costWithTax + fixedCostPerUnit;

    const denominator = 1 - t / 100 - comm / 100;
    if (denominator <= 0) return null;

    const minimumPrice = totalCostPerUnit / denominator;
    const idealPrice = minimumPrice / (1 - m / 100);
    const premiumPrice = idealPrice * 1.3;
    const markup = ((idealPrice - c) / c) * 100;

    const unitContribution = idealPrice - costWithTax;
    const breakEvenUnits =
      fc > 0 && unitContribution > 0 ? Math.ceil(fc / unitContribution) : null;

    return {
      minimumPrice,
      idealPrice,
      premiumPrice,
      markup,
      breakEvenUnits,
      suggestedPrice: idealPrice,
      simple: false,
    };
  };

  const result = calc();

  const getInsight = (): { text: string; tone: "neutral" | "good" | "warning" | "danger" } => {
    if (!result) return { text: "", tone: "neutral" };
    const { markup, simple } = result as any;
    if (markup < 0) {
      return {
        text: "Seu preço sugerido está abaixo do custo. Revise os valores informados.",
        tone: "danger",
      };
    }
    const minForHealthy = parseFloat(cost) / (1 - 0.3);
    if (!simple && (result as any).idealPrice) {
      const ip = (result as any).idealPrice;
      return markup >= 30
        ? {
            text: `Seu markup é de ${markup.toFixed(1)}%. Boa margem! O preço ideal de R$ ${fmt(ip)} cobre todos os custos com lucro saudável.`,
            tone: "good",
          }
        : {
            text: `Seu markup é de ${markup.toFixed(1)}%. Para uma margem saudável acima de 30%, você precisaria cobrar pelo menos R$ ${fmt(minForHealthy)}.`,
            tone: "warning",
          };
    }
    return markup >= 30
      ? {
          text: `Seu markup é de ${markup.toFixed(1)}%. Boa margem! O preço sugerido de R$ ${fmt((result as any).suggestedPrice)} garante uma rentabilidade saudável.`,
          tone: "good",
        }
      : {
          text: `Seu markup é de ${markup.toFixed(1)}%. Para uma margem saudável acima de 30%, você precisaria cobrar pelo menos R$ ${fmt(minForHealthy)}.`,
          tone: "warning",
        };
  };

  const { text: insightText, tone: insightTone } = getInsight();

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Simulador de Preço</h3>
            <p className="text-xs text-muted-foreground">Calcule o preço ideal do seu produto ou serviço</p>
          </div>
        </div>
        <AdvancedToggle open={advanced} onToggle={() => setAdvanced((v) => !v)} />
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Custo do Produto/Serviço (R$)"
          value={cost}
          onChange={setCost}
          suffix="R$"
        />
        <InputField
          label="Margem de Lucro Desejada (%)"
          value={margin}
          onChange={setMargin}
          placeholder="30"
          suffix="%"
        />
        {advanced && (
          <>
            <InputField
              label="Custos Fixos Mensais (R$)"
              value={fixedCosts}
              onChange={setFixedCosts}
              suffix="R$"
            />
            <InputField
              label="Volume de Vendas Mensal (unid.)"
              value={volume}
              onChange={setVolume}
              placeholder="1"
              suffix="un"
            />
            <InputField
              label="Impostos (%)"
              value={tax}
              onChange={setTax}
              placeholder="6"
              suffix="%"
            />
            <InputField
              label="Comissão (%)"
              value={commission}
              onChange={setCommission}
              placeholder="0"
              suffix="%"
            />
          </>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {result.simple ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultCard
                label="Preço de Venda Sugerido"
                value={`R$ ${fmt(result.suggestedPrice)}`}
                color="success"
              />
              <ResultCard
                label="Markup sobre o Custo"
                value={`${(result as any).markup.toFixed(1)}%`}
                color={(result as any).markup >= 30 ? "success" : "warning"}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ResultCard
                label="Preço Mínimo"
                value={`R$ ${fmt((result as any).minimumPrice)}`}
                color="warning"
                small="Cobre todos os custos"
              />
              <ResultCard
                label="Preço Ideal"
                value={`R$ ${fmt((result as any).idealPrice)}`}
                color="success"
                small={`Markup ${(result as any).markup.toFixed(1)}%`}
              />
              <ResultCard
                label="Preço Premium"
                value={`R$ ${fmt((result as any).premiumPrice)}`}
                color="info"
                small="+30% sobre o ideal"
              />
              {(result as any).breakEvenUnits !== null ? (
                <ResultCard
                  label="Ponto de Equilíbrio"
                  value={`${fmtInt((result as any).breakEvenUnits)} un.`}
                  color="default"
                  small="Unidades para cobrir fixos"
                />
              ) : (
                <ResultCard
                  label="Markup sobre Custo"
                  value={`${(result as any).markup.toFixed(1)}%`}
                  color={(result as any).markup >= 30 ? "success" : "warning"}
                />
              )}
            </div>
          )}

          <InsightBox text={insightText} tone={insightTone} />
        </div>
      )}
    </div>
  );
}

// ─── Profit Simulator ────────────────────────────────────────────────────────

function ProfitSimulator() {
  const [advanced, setAdvanced] = useState(false);
  const [revenue, setRevenue] = useState("");
  const [costs, setCosts] = useState("");
  const [ticketMedio, setTicketMedio] = useState("");
  const [numClients, setNumClients] = useState("");
  const [targetProfit, setTargetProfit] = useState("");

  const calc = () => {
    const r = parseFloat(revenue);
    const c = parseFloat(costs);
    if (!r || !c || r <= 0) return null;

    const profit = r - c;
    const margin = (profit / r) * 100;
    const breakEven = c;

    if (!advanced) {
      return { profit, margin, breakEven, simple: true };
    }

    const ticket = parseFloat(ticketMedio) || 0;
    const target = parseFloat(targetProfit) || 0;

    const clientsNeeded = ticket > 0 ? Math.ceil(breakEven / ticket) : null;
    const revenueNeeded = c + target;
    const clientsForTarget = ticket > 0 && target > 0 ? Math.ceil(revenueNeeded / ticket) : null;

    return {
      profit,
      margin,
      breakEven,
      clientsNeeded,
      revenueNeeded: target > 0 ? revenueNeeded : null,
      clientsForTarget,
      simple: false,
    };
  };

  const result = calc();

  const getInsight = (): { text: string; tone: "neutral" | "good" | "warning" | "danger" } => {
    if (!result) return { text: "", tone: "neutral" };
    const { margin } = result;

    if (margin < 0) {
      return {
        text: "Você está operando no prejuízo. Revise seus custos urgentemente e identifique onde é possível cortar despesas.",
        tone: "danger",
      };
    }
    if (margin < 20) {
      return {
        text: `Margem baixa (${margin.toFixed(1)}%). Analise oportunidades de redução de custos ou aumento de preços para melhorar sua rentabilidade.`,
        tone: "warning",
      };
    }
    if (margin < 40) {
      return {
        text: `Margem razoável de ${margin.toFixed(1)}%. Há espaço para otimização — revise custos variáveis e avalie aumentos graduais de preço.`,
        tone: "neutral",
      };
    }
    return {
      text: `Excelente margem de ${margin.toFixed(1)}%! Seu negócio está com boa saúde financeira. Considere reinvestir parte do lucro para escalar.`,
      tone: "good",
    };
  };

  const { text: insightText, tone: insightTone } = getInsight();

  const profitColor =
    !result
      ? "default"
      : result.profit > 0
      ? "success"
      : result.profit < 0
      ? "danger"
      : "warning";

  const marginColor =
    !result
      ? "default"
      : result.margin >= 40
      ? "success"
      : result.margin >= 20
      ? "info"
      : result.margin >= 0
      ? "warning"
      : "danger";

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Simulador de Lucro</h3>
            <p className="text-xs text-muted-foreground">Calcule lucro, margem e ponto de equilíbrio</p>
          </div>
        </div>
        <AdvancedToggle open={advanced} onToggle={() => setAdvanced((v) => !v)} />
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Receita Mensal (R$)"
          value={revenue}
          onChange={setRevenue}
          suffix="R$"
        />
        <InputField
          label="Custos Mensais (R$)"
          value={costs}
          onChange={setCosts}
          suffix="R$"
        />
        {advanced && (
          <>
            <InputField
              label="Ticket Médio (R$)"
              value={ticketMedio}
              onChange={setTicketMedio}
              suffix="R$"
            />
            <InputField
              label="Número de Clientes"
              value={numClients}
              onChange={setNumClients}
              placeholder="0"
              suffix="cli"
            />
            <InputField
              label="Meta de Lucro Mensal (R$)"
              value={targetProfit}
              onChange={setTargetProfit}
              suffix="R$"
            />
          </>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard
              label="Lucro Líquido"
              value={`${result.profit >= 0 ? "" : "-"}R$ ${fmt(Math.abs(result.profit))}`}
              color={profitColor as any}
            />
            <ResultCard
              label="Margem de Lucro"
              value={`${result.margin.toFixed(1)}%`}
              color={marginColor as any}
            />
            <ResultCard
              label="Ponto de Equilíbrio"
              value={`R$ ${fmt(result.breakEven)}`}
              color="default"
              small="Receita mínima para cobrir custos"
            />
            {!result.simple && result.revenueNeeded !== null ? (
              <ResultCard
                label="Receita p/ Atingir Meta"
                value={`R$ ${fmt(result.revenueNeeded!)}`}
                color="info"
                small={
                  result.clientsForTarget
                    ? `${fmtInt(result.clientsForTarget)} clientes necessários`
                    : undefined
                }
              />
            ) : (
              <ResultCard
                label="Resultado"
                value={result.profit >= 0 ? "Lucrativo" : "Prejuízo"}
                color={result.profit >= 0 ? "success" : "danger"}
              />
            )}
          </div>

          {!result.simple && result.clientsNeeded !== null && (
            <div className="grid grid-cols-2 gap-3">
              <ResultCard
                label="Clientes p/ Ponto de Equilíbrio"
                value={`${fmtInt(result.clientsNeeded!)} clientes`}
                color="warning"
                small="Com o ticket médio informado"
              />
              {parseFloat(numClients) > 0 && (
                <ResultCard
                  label="Receita por Cliente"
                  value={`R$ ${fmt(parseFloat(revenue) / parseFloat(numClients))}`}
                  color="info"
                />
              )}
            </div>
          )}

          <InsightBox text={insightText} tone={insightTone} />
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function Simulators() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Simuladores Financeiros"
        subtitle="Ferramentas inteligentes para planejar e otimizar seu negócio MEI"
      />

      <div className="space-y-6">
        <MeiSimulator />
        <PriceSimulator />
        <ProfitSimulator />
      </div>
    </div>
  );
}
