/**
 * useFinancialMetrics — Single source of truth for financial KPIs.
 *
 * Aggregates data from CashFlow, Payables, and Receivables contexts so
 * every page uses exactly the same numbers.  All heavy calculations are
 * memoised and only recompute when the underlying data actually changes.
 */
import { useMemo } from "react";
import { useCashFlow } from "../app/contexts/CashFlowContext";
import { usePayables } from "../app/contexts/PayablesContext";
import { useReceivables } from "../app/contexts/ReceivablesContext";

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function prevMonthKey() {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function fmt(v: number) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function useFinancialMetrics() {
  const { transactions, summary, loading: cashLoading } = useCashFlow();
  const { payables, loading: payLoading } = usePayables();
  const { receivables, loading: recLoading } = useReceivables();

  const loading = cashLoading || payLoading || recLoading;

  const metrics = useMemo(() => {
    const thisMonth = currentMonthKey();
    const prevMonth = prevMonthKey();

    // ── Monthly transactions ──────────────────────────────────────
    const thisTx = transactions.filter((t) => t.data.startsWith(thisMonth));
    const prevTx = transactions.filter((t) => t.data.startsWith(prevMonth));

    const monthReceitas = thisTx
      .filter((t) => t.tipo === "entrada")
      .reduce((s, t) => s + t.valor, 0);
    const monthDespesas = thisTx
      .filter((t) => t.tipo === "saida")
      .reduce((s, t) => s + t.valor, 0);
    const monthLucro = monthReceitas - monthDespesas;
    const monthMargemPct =
      monthReceitas > 0 ? (monthLucro / monthReceitas) * 100 : 0;

    const prevReceitas = prevTx
      .filter((t) => t.tipo === "entrada")
      .reduce((s, t) => s + t.valor, 0);
    const prevDespesas = prevTx
      .filter((t) => t.tipo === "saida")
      .reduce((s, t) => s + t.valor, 0);
    const prevLucro = prevReceitas - prevDespesas;

    // ── Growth vs previous month ──────────────────────────────────
    const receitasGrowthPct =
      prevReceitas > 0
        ? ((monthReceitas - prevReceitas) / prevReceitas) * 100
        : monthReceitas > 0
        ? 100
        : 0;
    const despesasGrowthPct =
      prevDespesas > 0
        ? ((monthDespesas - prevDespesas) / prevDespesas) * 100
        : monthDespesas > 0
        ? 100
        : 0;
    const lucroGrowthPct =
      prevLucro > 0
        ? ((monthLucro - prevLucro) / prevLucro) * 100
        : monthLucro > 0
        ? 100
        : 0;

    // ── All-time saldo ────────────────────────────────────────────
    const saldoAtual = summary.saldoAtual;

    // ── Average ticket (current month income tx) ──────────────────
    const incomeTx = thisTx.filter((t) => t.tipo === "entrada");
    const ticketMedio =
      incomeTx.length > 0 ? monthReceitas / incomeTx.length : 0;

    // ── Pending payables / receivables ───────────────────────────
    const pendingPayables = payables.filter((p) => p.status !== "pago");
    const pendingReceivables = receivables.filter(
      (r) => r.status !== "recebido"
    );
    const totalAPagar = pendingPayables.reduce((s, p) => s + p.valor, 0);
    const totalAReceber = pendingReceivables.reduce((s, r) => s + r.valor, 0);

    // ── Overdue (vencidas) ───────────────────────────────────────
    const today = new Date().toISOString().split("T")[0];
    const overduePayables = pendingPayables.filter(
      (p) => p.dataVencimento < today
    );
    const overdueReceivables = pendingReceivables.filter(
      (r) => r.dataVencimento < today
    );

    // ── Category breakdown for current month ─────────────────────
    const revByCategory = new Map<string, number>();
    const expByCategory = new Map<string, number>();
    thisTx.forEach((t) => {
      const map = t.tipo === "entrada" ? revByCategory : expByCategory;
      map.set(t.categoria, (map.get(t.categoria) ?? 0) + t.valor);
    });

    const revCategories = Array.from(revByCategory.entries())
      .map(([name, value]) => ({
        name,
        value,
        pct: monthReceitas > 0 ? (value / monthReceitas) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    const expCategories = Array.from(expByCategory.entries())
      .map(([name, value]) => ({
        name,
        value,
        pct: monthDespesas > 0 ? (value / monthDespesas) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      // Current month
      monthReceitas,
      monthDespesas,
      monthLucro,
      monthMargemPct,
      ticketMedio,
      // Growth
      receitasGrowthPct,
      despesasGrowthPct,
      lucroGrowthPct,
      // Prev month (for comparisons)
      prevReceitas,
      prevDespesas,
      prevLucro,
      // All-time
      saldoAtual,
      // Payables / receivables
      totalAPagar,
      totalAReceber,
      pendingPayables,
      pendingReceivables,
      overduePayables,
      overdueReceivables,
      // Categories
      revCategories,
      expCategories,
      // Formatting helper
      fmt,
    };
  }, [transactions, payables, receivables, summary.saldoAtual]);

  return { ...metrics, loading };
}
