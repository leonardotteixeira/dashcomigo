import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../../lib/supabase";
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
      const { data } = await supabase
        .from("obligations")
        .select("*")
        .eq("user_id", user.id)
        .order("data", { ascending: true });

      setObligations(data || []);
    } catch (error) {
      console.error("Erro ao buscar obrigações:", error);
    } finally {
      setLoading(false);
    }
  };

  const addObligation = async (ob: Omit<Obligation, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("obligations")
        .insert([{ ...ob, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      if (data) setObligations([...obligations, data]);
    } catch (error) {
      console.error("Erro ao adicionar obrigação:", error);
      throw error;
    }
  };

  const updateObligation = async (id: string, ob: Partial<Obligation>) => {
    try {
      const { error } = await supabase
        .from("obligations")
        .update(ob)
        .eq("id", id);

      if (error) throw error;
      setObligations(obligations.map(o => (o.id === id ? { ...o, ...ob } : o)));
    } catch (error) {
      console.error("Erro ao atualizar obrigação:", error);
      throw error;
    }
  };

  const deleteObligation = async (id: string) => {
    try {
      const { error } = await supabase
        .from("obligations")
        .delete()
        .eq("id", id);

      if (error) throw error;
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
