import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useCashFlow } from "./CashFlowContext";
import { pb, getVerifiedPlan } from "../../lib/pocketbase";

export interface Goal {
  id: string;
  mes: string; // "YYYY-MM"
  valorMeta: number;
  categoria?: string;
  createdAt: Date;
}

interface GoalWithProgress extends Goal {
  valorRealizado: number;
  percentual: number;
  status: "em_andamento" | "alcancada" | "nao_alcancada";
}

interface GoalsContextType {
  goals: Goal[];
  loading: boolean;
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => Promise<void>;
  updateGoal: (id: string, goal: Partial<Omit<Goal, "id" | "createdAt">>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  getGoalByMes: (mes: string) => GoalWithProgress | null;
  getHistorico: (meses?: number) => GoalWithProgress[];
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

function mesAtual() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function GoalsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { transactions } = useCashFlow();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setGoals([]);
      return;
    }

    async function fetchGoals() {
      setLoading(true);
      try {
        const records = await pb.collection("goals").getList(1, 200, {
          filter: `userid = "${user.id}"`,
          sort: "-mes",
          requestKey: null,
        });

        setGoals(
          records.items.map((g) => ({
            id: g.id,
            mes: g.mes,
            valorMeta: Number(g.valor_meta),
            categoria: g.categoria || undefined,
            createdAt: new Date(g.created),
          }))
        );
      } catch (error) {
        console.error("Erro ao buscar metas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGoals();
  }, [user?.id]);

  async function addGoal(data: Omit<Goal, "id" | "createdAt">) {
    if (!user) throw new Error("Usuário não autenticado");
    const plan = await getVerifiedPlan(user.id);
    if (plan !== "pro") throw new Error("Metas de receita são apenas para plano Premium");

    const createData: Record<string, unknown> = {
      userid: user.id,
      mes: data.mes,
      valor_meta: data.valorMeta,
    };
    if (data.categoria) createData.categoria = data.categoria;

    const record = await pb.collection("goals").create(createData);

    const newGoal: Goal = {
      id: record.id,
      mes: record.mes,
      valorMeta: Number(record.valor_meta),
      categoria: record.categoria || undefined,
      createdAt: new Date(record.created),
    };

    setGoals([newGoal, ...goals]);
  }

  async function updateGoal(id: string, data: Partial<Omit<Goal, "id" | "createdAt">>) {
    if (!user) throw new Error("Usuário não autenticado");

    const updateData: Record<string, unknown> = {};
    if (data.mes) updateData.mes = data.mes;
    if (data.valorMeta !== undefined) updateData.valor_meta = data.valorMeta;
    if (data.categoria !== undefined) updateData.categoria = data.categoria;

    await pb.collection("goals").update(id, updateData);
    setGoals(goals.map((g) => (g.id === id ? { ...g, ...data } : g)));
  }

  async function deleteGoal(id: string) {
    if (!user) throw new Error("Usuário não autenticado");
    await pb.collection("goals").delete(id);
    setGoals(goals.filter((g) => g.id !== id));
  }

  function calcularRealizado(mes: string, categoria?: string): number {
    return transactions
      .filter((t) => {
        if (t.tipo !== "entrada") return false;
        const dataMes = t.data?.substring(0, 7);
        if (dataMes !== mes) return false;
        if (categoria && t.categoria !== categoria) return false;
        return true;
      })
      .reduce((sum, t) => sum + t.valor, 0);
  }

  function buildGoalWithProgress(goal: Goal): GoalWithProgress {
    const now = new Date();
    const mesFuturo = goal.mes > mesAtual();
    const valorRealizado = mesFuturo ? 0 : calcularRealizado(goal.mes, goal.categoria);
    const percentual = goal.valorMeta > 0 ? (valorRealizado / goal.valorMeta) * 100 : 0;

    let status: GoalWithProgress["status"] = "em_andamento";
    if (percentual >= 100) {
      status = "alcancada";
    } else if (goal.mes < mesAtual()) {
      status = "nao_alcancada";
    }

    return { ...goal, valorRealizado, percentual, status };
  }

  function getGoalByMes(mes: string): GoalWithProgress | null {
    const goal = goals.find((g) => g.mes === mes);
    if (!goal) return null;
    return buildGoalWithProgress(goal);
  }

  function getHistorico(meses = 6): GoalWithProgress[] {
    return goals.slice(0, meses).map(buildGoalWithProgress);
  }

  return (
    <GoalsContext.Provider value={{ goals, loading, addGoal, updateGoal, deleteGoal, getGoalByMes, getHistorico }}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals(): GoalsContextType {
  const context = useContext(GoalsContext);
  if (!context) throw new Error("useGoals deve ser usado dentro de GoalsProvider");
  return context;
}
