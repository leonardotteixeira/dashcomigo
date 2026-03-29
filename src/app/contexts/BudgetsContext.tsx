import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { usePayables } from "./PayablesContext";
import { pb } from "../../lib/pocketbase";

export interface Budget {
  id: string;
  categoria: string;
  mes: string; // "YYYY-MM"
  valorPlanejado: number;
  createdAt: Date;
}

interface BudgetItem extends Budget {
  valorRealizado: number;
  percentual: number;
  status: "ok" | "alerta" | "excedido";
}

interface BudgetsContextType {
  budgets: Budget[];
  loading: boolean;
  addBudget: (budget: Omit<Budget, "id" | "createdAt">) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Omit<Budget, "id" | "createdAt">>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getBudgetsByMes: (mes: string) => BudgetItem[];
  getTotalByMes: (mes: string) => { planejado: number; realizado: number; restante: number };
}

const BudgetsContext = createContext<BudgetsContextType | undefined>(undefined);

export function BudgetsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { payables } = usePayables();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setBudgets([]);
      return;
    }

    async function fetchBudgets() {
      setLoading(true);
      try {
        const records = await pb.collection("budgets").getList(1, 500, {
          filter: `userid = "${user.id}"`,
          sort: "-mes",
          requestKey: null,
        });

        setBudgets(
          records.items.map((b) => ({
            id: b.id,
            categoria: b.categoria,
            mes: b.mes,
            valorPlanejado: Number(b.valor_planejado),
            createdAt: new Date(b.created),
          }))
        );
      } catch (error) {
        console.error("Erro ao buscar orçamentos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBudgets();
  }, [user]);

  async function addBudget(data: Omit<Budget, "id" | "createdAt">) {
    if (!user) throw new Error("Usuário não autenticado");

    const record = await pb.collection("budgets").create({
      userid: user.id,
      categoria: data.categoria,
      mes: data.mes,
      valor_planejado: data.valorPlanejado,
    });

    const newBudget: Budget = {
      id: record.id,
      categoria: record.categoria,
      mes: record.mes,
      valorPlanejado: Number(record.valor_planejado),
      createdAt: new Date(record.created),
    };

    setBudgets([newBudget, ...budgets]);
  }

  async function updateBudget(id: string, data: Partial<Omit<Budget, "id" | "createdAt">>) {
    if (!user) throw new Error("Usuário não autenticado");

    const updateData: Record<string, unknown> = {};
    if (data.categoria) updateData.categoria = data.categoria;
    if (data.mes) updateData.mes = data.mes;
    if (data.valorPlanejado !== undefined) updateData.valor_planejado = data.valorPlanejado;

    await pb.collection("budgets").update(id, updateData);
    setBudgets(budgets.map((b) => (b.id === id ? { ...b, ...data } : b)));
  }

  async function deleteBudget(id: string) {
    if (!user) throw new Error("Usuário não autenticado");
    await pb.collection("budgets").delete(id);
    setBudgets(budgets.filter((b) => b.id !== id));
  }

  function getBudgetsByMes(mes: string): BudgetItem[] {
    const budgetsMes = budgets.filter((b) => b.mes === mes);

    return budgetsMes.map((budget) => {
      // Calcular realizado com base nas contas a pagar pagas naquele mês
      const realizado = payables
        .filter((p) => {
          if (p.status !== "pago") return false;
          if (p.categoria !== budget.categoria) return false;
          const dataPagamento = p.dataPagamento || p.dataVencimento;
          return dataPagamento?.startsWith(mes);
        })
        .reduce((sum, p) => sum + p.valor, 0);

      const percentual = budget.valorPlanejado > 0 ? (realizado / budget.valorPlanejado) * 100 : 0;
      const status: BudgetItem["status"] =
        percentual >= 100 ? "excedido" : percentual >= 80 ? "alerta" : "ok";

      return { ...budget, valorRealizado: realizado, percentual, status };
    });
  }

  function getTotalByMes(mes: string) {
    const items = getBudgetsByMes(mes);
    const planejado = items.reduce((sum, b) => sum + b.valorPlanejado, 0);
    const realizado = items.reduce((sum, b) => sum + b.valorRealizado, 0);
    return { planejado, realizado, restante: planejado - realizado };
  }

  return (
    <BudgetsContext.Provider value={{ budgets, loading, addBudget, updateBudget, deleteBudget, getBudgetsByMes, getTotalByMes }}>
      {children}
    </BudgetsContext.Provider>
  );
}

export function useBudgets(): BudgetsContextType {
  const context = useContext(BudgetsContext);
  if (!context) throw new Error("useBudgets deve ser usado dentro de BudgetsProvider");
  return context;
}
