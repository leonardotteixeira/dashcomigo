import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { pb } from "../../lib/pocketbase";
import type { Obligation } from "../types/obligations";

interface ObligationsContextType {
  obligations: Obligation[];
  loading: boolean;
  addObligation: (ob: Omit<Obligation, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>;
  updateObligation: (id: string, ob: Partial<Obligation>) => Promise<void>;
  deleteObligation: (id: string) => Promise<void>;
  completeObligation: (id: string) => Promise<void>;
}

const ObligationsContext = createContext<ObligationsContextType | undefined>(undefined);

export function ObligationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchObligations();
  }, [user?.id]);

  const fetchObligations = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const records = await pb.collection("obligations").getList(1, 500, {
        filter: `user_id = "${user.id}"`,
        sort: "data",
      });

      setObligations(records.items as Obligation[]);
    } catch (error) {
      console.error("Erro ao buscar obrigações:", error);
    } finally {
      setLoading(false);
    }
  };

  const addObligation = async (ob: Omit<Obligation, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return;
    try {
      const record = await pb.collection("obligations").create({
        ...ob,
        user_id: user.id,
      });

      setObligations([...obligations, record as Obligation]);
    } catch (error) {
      console.error("Erro ao adicionar obrigação:", error);
      throw error;
    }
  };

  const updateObligation = async (id: string, ob: Partial<Obligation>) => {
    try {
      const record = await pb.collection("obligations").update(id, ob);
      setObligations(obligations.map(o => (o.id === id ? (record as Obligation) : o)));
    } catch (error) {
      console.error("Erro ao atualizar obrigação:", error);
      throw error;
    }
  };

  const deleteObligation = async (id: string) => {
    try {
      await pb.collection("obligations").delete(id);
      setObligations(obligations.filter(o => o.id !== id));
    } catch (error) {
      console.error("Erro ao deletar obrigação:", error);
      throw error;
    }
  };

  const completeObligation = async (id: string) => {
    await updateObligation(id, { status: "completa" });
  };

  return (
    <ObligationsContext.Provider value={{ obligations, loading, addObligation, updateObligation, deleteObligation, completeObligation }}>
      {children}
    </ObligationsContext.Provider>
  );
}

export function useObligations() {
  const context = useContext(ObligationsContext);
  if (context === undefined) {
    throw new Error("useObligations deve ser usado dentro de ObligationsProvider");
  }
  return context;
}
