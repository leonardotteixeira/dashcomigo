/**
 * NotificationsContext
 *
 * Generates REAL, data-driven notifications from existing contexts.
 * No new PocketBase collection needed — derived entirely from user data.
 * "Read" status is persisted in localStorage per user.
 */
import { createContext, useContext, useMemo, useState, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useCashFlow } from "./CashFlowContext";
import { usePayables } from "./PayablesContext";
import { useReceivables } from "./ReceivablesContext";
import { useGoals } from "./GoalsContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType =
  | "payment_received"    // conta a receber marcada como recebida recentemente
  | "receivable_overdue"  // conta a receber vencida
  | "receivable_due_soon" // conta a receber vence em ≤ 3 dias
  | "payable_overdue"     // conta a pagar vencida
  | "payable_due_soon"    // conta a pagar vence em ≤ 3 dias
  | "negative_balance"    // saldo negativo
  | "high_costs"          // despesas > 80% da receita
  | "goal_reached"        // meta do mês atingida
  | "faturamento_limit";  // faturamento mensal próximo do teto MEI

export interface Notification {
  id: string;            // deterministic — based on data, so "read" survives re-renders
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  href?: string;         // navigation target on click
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearRead: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function daysFromToday(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function storageKey(userId: string) {
  return `finmei_read_notifications_${userId}`;
}

function loadReadIds(userId: string): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(userId: string, ids: Set<string>) {
  localStorage.setItem(storageKey(userId), JSON.stringify([...ids]));
}

// ─── Context ─────────────────────────────────────────────────────────────────

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { summary, transactions } = useCashFlow();
  const { payables } = usePayables();
  const { receivables } = useReceivables();
  const { getGoalByMes } = useGoals();

  const [readIds, setReadIds] = useState<Set<string>>(() =>
    user?.id ? loadReadIds(user.id) : new Set()
  );

  // ── Generate notifications from real data ─────────────────────────────────
  const notifications = useMemo<Notification[]>(() => {
    if (!user?.id) return [];

    const now = new Date();
    const items: Omit<Notification, "read">[] = [];

    // ── 1. Contas a RECEBER vencidas ─────────────────────────────────────────
    const overdueReceivables = receivables.filter(
      (r) => r.status === "pendente" && daysFromToday(r.dataVencimento) < 0
    );
    overdueReceivables.slice(0, 3).forEach((r) => {
      const daysLate = Math.abs(daysFromToday(r.dataVencimento));
      items.push({
        id: `receivable_overdue_${r.id}`,
        type: "receivable_overdue",
        title: "Recebimento em atraso",
        message: `${r.descricao} — ${fmt(r.valor)} venceu há ${daysLate} dia${daysLate !== 1 ? "s" : ""}`,
        createdAt: now,
        href: "/app/contas-a-receber",
      });
    });
    if (overdueReceivables.length > 3) {
      items.push({
        id: `receivable_overdue_bulk_${overdueReceivables.length}`,
        type: "receivable_overdue",
        title: "Recebimentos em atraso",
        message: `Você tem ${overdueReceivables.length} contas a receber vencidas`,
        createdAt: now,
        href: "/app/contas-a-receber",
      });
    }

    // ── 2. Contas a RECEBER vencendo em ≤ 3 dias ────────────────────────────
    receivables
      .filter((r) => {
        const d = daysFromToday(r.dataVencimento);
        return r.status === "pendente" && d >= 0 && d <= 3;
      })
      .slice(0, 3)
      .forEach((r) => {
        const d = daysFromToday(r.dataVencimento);
        const when = d === 0 ? "hoje" : d === 1 ? "amanhã" : `em ${d} dias`;
        items.push({
          id: `receivable_due_soon_${r.id}`,
          type: "receivable_due_soon",
          title: "Recebimento próximo",
          message: `${r.descricao} — ${fmt(r.valor)} vence ${when}`,
          createdAt: now,
          href: "/app/contas-a-receber",
        });
      });

    // ── 3. Pagamentos recebidos recentemente (últimas 24 h) ──────────────────
    const oneDayAgo = new Date(now.getTime() - 86_400_000);
    receivables
      .filter((r) => {
        if (r.status !== "recebido" || !r.dataRecebimento) return false;
        const received = new Date(r.dataRecebimento);
        return received >= oneDayAgo;
      })
      .slice(0, 3)
      .forEach((r) => {
        items.push({
          id: `payment_received_${r.id}_${r.dataRecebimento}`,
          type: "payment_received",
          title: "Pagamento recebido",
          message: `${r.descricao} — ${fmt(r.valor)} creditado`,
          createdAt: r.dataRecebimento ? new Date(r.dataRecebimento) : now,
          href: "/app/contas-a-receber",
        });
      });

    // ── 4. Contas a PAGAR vencidas ───────────────────────────────────────────
    const overduePayables = payables.filter(
      (p) => p.status === "pendente" && daysFromToday(p.dataVencimento) < 0
    );
    overduePayables.slice(0, 3).forEach((p) => {
      const daysLate = Math.abs(daysFromToday(p.dataVencimento));
      items.push({
        id: `payable_overdue_${p.id}`,
        type: "payable_overdue",
        title: "Despesa em atraso",
        message: `${p.descricao} — ${fmt(p.valor)} venceu há ${daysLate} dia${daysLate !== 1 ? "s" : ""}`,
        createdAt: now,
        href: "/app/contas-a-pagar",
      });
    });
    if (overduePayables.length > 3) {
      items.push({
        id: `payable_overdue_bulk_${overduePayables.length}`,
        type: "payable_overdue",
        title: "Despesas em atraso",
        message: `Você tem ${overduePayables.length} contas a pagar vencidas`,
        createdAt: now,
        href: "/app/contas-a-pagar",
      });
    }

    // ── 5. Contas a PAGAR vencendo em ≤ 3 dias ──────────────────────────────
    payables
      .filter((p) => {
        const d = daysFromToday(p.dataVencimento);
        return p.status === "pendente" && d >= 0 && d <= 3;
      })
      .slice(0, 3)
      .forEach((p) => {
        const d = daysFromToday(p.dataVencimento);
        const when = d === 0 ? "hoje" : d === 1 ? "amanhã" : `em ${d} dias`;
        items.push({
          id: `payable_due_soon_${p.id}`,
          type: "payable_due_soon",
          title: "Despesa vencendo",
          message: `${p.descricao} — ${fmt(p.valor)} vence ${when}`,
          createdAt: now,
          href: "/app/contas-a-pagar",
        });
      });

    // ── 6. Saldo negativo ────────────────────────────────────────────────────
    if (summary.saldoAtual < 0) {
      items.push({
        id: "negative_balance",
        type: "negative_balance",
        title: "Saldo negativo",
        message: `Seu saldo está em ${fmt(summary.saldoAtual)}. Priorize seus recebimentos.`,
        createdAt: now,
        href: "/app",
      });
    }

    // ── 7. Custos elevados (despesas > 80% da receita mensal) ────────────────
    if (summary.monthlyEntradas > 0) {
      const ratio = (summary.monthlyDespesas / summary.monthlyEntradas) * 100;
      if (ratio >= 80) {
        items.push({
          id: `high_costs_${new Date().toISOString().slice(0, 7)}`,
          type: "high_costs",
          title: "Custos elevados",
          message: `Suas despesas este mês representam ${ratio.toFixed(0)}% da receita`,
          createdAt: now,
          href: "/app/relatorios",
        });
      }
    }

    // ── 8. Meta do mês atingida ───────────────────────────────────────────────
    const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const goalThisMonth = getGoalByMes(mesAtual);
    if (goalThisMonth && goalThisMonth.status === "alcancada") {
      items.push({
        id: `goal_reached_${mesAtual}`,
        type: "goal_reached",
        title: "Meta atingida! 🎉",
        message: `Você bateu a meta de ${fmt(goalThisMonth.valorMeta)} este mês!`,
        createdAt: now,
        href: "/app/metas",
      });
    }

    // ── 9. Faturamento próximo do teto MEI (R$ 81.000/ano = R$ 6.750/mês) ────
    const TETO_MENSAL = 6_750;
    if (summary.monthlyEntradas >= TETO_MENSAL * 0.85) {
      const pct = ((summary.monthlyEntradas / TETO_MENSAL) * 100).toFixed(0);
      items.push({
        id: `faturamento_limit_${mesAtual}`,
        type: "faturamento_limit",
        title: "Teto MEI próximo",
        message: `Faturamento mensal em ${pct}% do teto. Considere migrar para ME.`,
        createdAt: now,
        href: "/app/mei-me",
      });
    }

    // ── Sort: unread overdue first, then due-soon, then others ───────────────
    const priority: Record<NotificationType, number> = {
      payable_overdue: 0,
      receivable_overdue: 1,
      negative_balance: 2,
      payable_due_soon: 3,
      receivable_due_soon: 4,
      payment_received: 5,
      high_costs: 6,
      faturamento_limit: 7,
      goal_reached: 8,
    };

    items.sort((a, b) => (priority[a.type] ?? 9) - (priority[b.type] ?? 9));

    return items.map((item) => ({ ...item, read: readIds.has(item.id) }));
  }, [user?.id, receivables, payables, summary, getGoalByMes, readIds]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    if (!user?.id) return;
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(user.id, next);
      return next;
    });
  }, [user?.id]);

  const markAllAsRead = useCallback(() => {
    if (!user?.id) return;
    setReadIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.id));
      saveReadIds(user.id, next);
      return next;
    });
  }, [user?.id, notifications]);

  const clearRead = useCallback(() => {
    if (!user?.id) return;
    const empty = new Set<string>();
    setReadIds(empty);
    saveReadIds(user.id, empty);
  }, [user?.id]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, clearRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications deve ser usado dentro de NotificationsProvider");
  return ctx;
}
