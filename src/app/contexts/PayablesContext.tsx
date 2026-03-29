import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { pb } from "../../lib/pocketbase";

export interface Payable {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  dataVencimento: string;
  status: "pendente" | "pago";
  ehRecorrente: boolean;
  frequenciaRecorrencia?: "mensal" | "anual";
  dataPagamento?: string;
  anotacoes?: string;
  createdAt: Date;
}

interface PayablesContextType {
  payables: Payable[];
  loading: boolean;
  addPayable: (payable: Omit<Payable, "id" | "createdAt">) => Promise<void>;
  updatePayable: (id: string, payable: Partial<Omit<Payable, "id" | "createdAt">>) => Promise<void>;
  deletePayable: (id: string) => Promise<void>;
  getProximasAVencer: (dias?: number) => Payable[];
  getPayablesByStatus: (status: "pendente" | "pago") => Payable[];
  getLimitStatus: () => { used: number; limit: number; percentage: number };
  canAddPayable: () => boolean;
}

const PayablesContext = createContext<PayablesContextType | undefined>(undefined);

export const CATEGORIAS_PAYABLES = [
  "Aluguel",
  "Serviços",
  "Taxas/Tarifas",
  "Fornecedores",
  "Funcionários",
  "Impostos",
  "Seguros",
  "Outros"
];

const FREE_LIMIT = 30;

export function PayablesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [payables, setPayables] = useState<Payable[]>([]);
  const [loading, setLoading] = useState(false);

  // Busca contas a pagar do PocketBase sempre que o usuário mudar
  useEffect(() => {
    if (!user) {
      setPayables([]);
      return;
    }

    async function fetchPayables() {
      setLoading(true);
      try {
        const records = await pb.collection("payables").getList(1, 500, {
          filter: `userid = "${user.id}"`,
          sort: "-data_vencimento",
          requestKey: null,
        });

        setPayables(
          records.items.map((p) => ({
            id: p.id,
            descricao: p.descricao,
            valor: Number(p.valor),
            categoria: p.categoria,
            dataVencimento: p.data_vencimento?.split(" ")[0] ?? p.data_vencimento,
            status: p.status as "pendente" | "pago",
            ehRecorrente: p.eh_recorrente ?? false,
            frequenciaRecorrencia: p.frequencia_recorrencia ?? null,
            dataPagamento: p.data_pagamento ? p.data_pagamento.split(" ")[0] : undefined,
            anotacoes: p.anotacoes ?? undefined,
            createdAt: new Date(p.created),
          }))
        );
      } catch (error) {
        console.error("Erro ao buscar contas a pagar:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPayables();
  }, [user]);

  async function addPayable(payableData: Omit<Payable, "id" | "createdAt">) {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      const createData: Record<string, unknown> = {
        userid: user.id,
        descricao: payableData.descricao,
        valor: payableData.valor,
        categoria: payableData.categoria,
        data_vencimento: payableData.dataVencimento,
        status: payableData.status,
        eh_recorrente: payableData.ehRecorrente,
      };

      if (payableData.frequenciaRecorrencia) {
        createData.frequencia_recorrencia = payableData.frequenciaRecorrencia;
      }
      if (payableData.dataPagamento) {
        createData.data_pagamento = payableData.dataPagamento;
      }
      if (payableData.anotacoes) {
        createData.anotacoes = payableData.anotacoes;
      }

      const record = await pb.collection("payables").create(createData);

      const newPayable: Payable = {
        id: record.id,
        descricao: record.descricao,
        valor: Number(record.valor),
        categoria: record.categoria,
        dataVencimento: record.data_vencimento?.split(" ")[0] ?? record.data_vencimento,
        status: record.status,
        ehRecorrente: record.eh_recorrente ?? false,
        frequenciaRecorrencia: record.frequencia_recorrencia ?? null,
        dataPagamento: record.data_pagamento ? record.data_pagamento.split(" ")[0] : undefined,
        anotacoes: record.anotacoes ?? undefined,
        createdAt: new Date(record.created),
      };

      setPayables([newPayable, ...payables]);
    } catch (error) {
      console.error("Erro ao adicionar conta a pagar:", error);
      throw error;
    }
  }

  async function updatePayable(id: string, payableData: Partial<Omit<Payable, "id" | "createdAt">>) {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      const updateData: Record<string, unknown> = {};

      if (payableData.descricao) updateData.descricao = payableData.descricao;
      if (payableData.valor) updateData.valor = payableData.valor;
      if (payableData.categoria) updateData.categoria = payableData.categoria;
      if (payableData.dataVencimento) updateData.data_vencimento = payableData.dataVencimento;
      if (payableData.status) updateData.status = payableData.status;
      if (payableData.ehRecorrente !== undefined) updateData.eh_recorrente = payableData.ehRecorrente;
      if (payableData.frequenciaRecorrencia !== undefined) updateData.frequencia_recorrencia = payableData.frequenciaRecorrencia;
      if (payableData.dataPagamento) updateData.data_pagamento = payableData.dataPagamento;
      if (payableData.anotacoes !== undefined) updateData.anotacoes = payableData.anotacoes;

      await pb.collection("payables").update(id, updateData);

      setPayables(
        payables.map((p) =>
          p.id === id
            ? {
                ...p,
                ...payableData,
              }
            : p
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar conta a pagar:", error);
      throw error;
    }
  }

  async function deletePayable(id: string) {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      await pb.collection("payables").delete(id);
      setPayables(payables.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar conta a pagar:", error);
      throw error;
    }
  }

  function getProximasAVencer(dias = 7): Payable[] {
    const hoje = new Date();
    const dataLimite = new Date(hoje.getTime() + dias * 24 * 60 * 60 * 1000);

    return payables.filter((p) => {
      if (p.status === "pago") return false;
      const vencimento = new Date(p.dataVencimento);
      return vencimento >= hoje && vencimento <= dataLimite;
    });
  }

  function getPayablesByStatus(status: "pendente" | "pago"): Payable[] {
    return payables.filter((p) => p.status === status);
  }

  function getLimitStatus() {
    const used = payables.length;
    const limit = user?.plan === "pro" ? Infinity : FREE_LIMIT;
    const percentage = limit === Infinity ? 0 : (used / limit) * 100;
    return { used, limit, percentage };
  }

  function canAddPayable(): boolean {
    if (user?.plan === "pro") return true;
    const { used, limit } = getLimitStatus();
    return used < limit;
  }

  return (
    <PayablesContext.Provider
      value={{
        payables,
        loading,
        addPayable,
        updatePayable,
        deletePayable,
        getProximasAVencer,
        getPayablesByStatus,
        getLimitStatus,
        canAddPayable,
      }}
    >
      {children}
    </PayablesContext.Provider>
  );
}

export function usePayables(): PayablesContextType {
  const context = useContext(PayablesContext);
  if (!context) {
    throw new Error("usePayables deve ser usado dentro de um PayablesProvider");
  }
  return context;
}
