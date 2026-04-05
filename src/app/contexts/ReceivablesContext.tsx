import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { pb, getVerifiedPlan } from "../../lib/pocketbase";

export interface Receivable {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  dataVencimento: string;
  status: "pendente" | "recebido";
  ehRecorrente: boolean;
  frequenciaRecorrencia?: "mensal" | "anual";
  dataRecebimento?: string;
  anotacoes?: string;
  createdAt: Date;
}

interface ReceivablesContextType {
  receivables: Receivable[];
  loading: boolean;
  addReceivable: (receivable: Omit<Receivable, "id" | "createdAt">) => Promise<void>;
  updateReceivable: (id: string, receivable: Partial<Omit<Receivable, "id" | "createdAt">>) => Promise<void>;
  deleteReceivable: (id: string) => Promise<void>;
  getProximasAReceber: (dias?: number) => Receivable[];
  getReceivablesByStatus: (status: "pendente" | "recebido") => Receivable[];
  getLimitStatus: () => { used: number; limit: number; percentage: number };
  canAddReceivable: () => boolean;
}

const ReceivablesContext = createContext<ReceivablesContextType | undefined>(undefined);

export const CATEGORIAS_RECEIVABLES = [
  "Serviços Prestados",
  "Vendas",
  "Consultorias",
  "Mensalidades",
  "Comissões",
  "Freelance",
  "Outros",
];

const FREE_LIMIT = 10;

function getMesAtual() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function ReceivablesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setReceivables([]);
      return;
    }

    async function fetchReceivables() {
      setLoading(true);
      try {
        const records = await pb.collection("receivables").getList(1, 500, {
          filter: `userid = "${user.id}"`,
          sort: "-data_vencimento",
          requestKey: null,
        });

        setReceivables(
          records.items.map((r) => ({
            id: r.id,
            descricao: r.descricao,
            valor: Number(r.valor),
            categoria: r.categoria,
            dataVencimento: r.data_vencimento?.split(" ")[0] ?? r.data_vencimento,
            status: r.status as "pendente" | "recebido",
            ehRecorrente: r.eh_recorrente ?? false,
            frequenciaRecorrencia: r.frequencia_recorrencia ?? undefined,
            dataRecebimento: r.data_recebimento ? r.data_recebimento.split(" ")[0] : undefined,
            anotacoes: r.anotacoes ?? undefined,
            createdAt: new Date(r.created),
          }))
        );
      } catch (error) {
        console.error("Erro ao buscar contas a receber:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReceivables();
  }, [user]);

  async function addReceivable(data: Omit<Receivable, "id" | "createdAt">) {
    if (!user) throw new Error("Usuário não autenticado");
    const plan = await getVerifiedPlan(user.id);
    if (plan !== "pro" && receivables.length >= FREE_LIMIT) throw new Error("Limite de contas a receber atingido");

    const createData: Record<string, unknown> = {
      userid: user.id,
      descricao: data.descricao,
      valor: data.valor,
      categoria: data.categoria,
      data_vencimento: data.dataVencimento,
      status: data.status,
      eh_recorrente: data.ehRecorrente,
    };

    if (data.frequenciaRecorrencia) createData.frequencia_recorrencia = data.frequenciaRecorrencia;
    if (data.dataRecebimento) createData.data_recebimento = data.dataRecebimento;
    if (data.anotacoes) createData.anotacoes = data.anotacoes;

    const record = await pb.collection("receivables").create(createData);

    const newReceivable: Receivable = {
      id: record.id,
      descricao: record.descricao,
      valor: Number(record.valor),
      categoria: record.categoria,
      dataVencimento: record.data_vencimento?.split(" ")[0] ?? record.data_vencimento,
      status: record.status,
      ehRecorrente: record.eh_recorrente ?? false,
      frequenciaRecorrencia: record.frequencia_recorrencia ?? undefined,
      dataRecebimento: record.data_recebimento ? record.data_recebimento.split(" ")[0] : undefined,
      anotacoes: record.anotacoes ?? undefined,
      createdAt: new Date(record.created),
    };

    setReceivables([newReceivable, ...receivables]);
  }

  async function updateReceivable(id: string, data: Partial<Omit<Receivable, "id" | "createdAt">>) {
    if (!user) throw new Error("Usuário não autenticado");

    const updateData: Record<string, unknown> = {};
    if (data.descricao) updateData.descricao = data.descricao;
    if (data.valor) updateData.valor = data.valor;
    if (data.categoria) updateData.categoria = data.categoria;
    if (data.dataVencimento) updateData.data_vencimento = data.dataVencimento;
    if (data.status) updateData.status = data.status;
    if (data.ehRecorrente !== undefined) updateData.eh_recorrente = data.ehRecorrente;
    if (data.frequenciaRecorrencia !== undefined) updateData.frequencia_recorrencia = data.frequenciaRecorrencia;
    if (data.dataRecebimento !== undefined) updateData.data_recebimento = data.dataRecebimento;
    if (data.anotacoes !== undefined) updateData.anotacoes = data.anotacoes;

    await pb.collection("receivables").update(id, updateData);
    setReceivables(receivables.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }

  async function deleteReceivable(id: string) {
    if (!user) throw new Error("Usuário não autenticado");
    await pb.collection("receivables").delete(id);
    setReceivables(receivables.filter((r) => r.id !== id));
  }

  function getProximasAReceber(dias = 7): Receivable[] {
    const hoje = new Date();
    const limite = new Date(hoje.getTime() + dias * 24 * 60 * 60 * 1000);
    return receivables.filter((r) => {
      if (r.status === "recebido") return false;
      const venc = new Date(r.dataVencimento);
      return venc >= hoje && venc <= limite;
    });
  }

  function getReceivablesByStatus(status: "pendente" | "recebido") {
    return receivables.filter((r) => r.status === status);
  }

  function getLimitStatus() {
    const mesAtual = getMesAtual();
    const used = receivables.filter((r) => r.createdAt.toISOString().startsWith(mesAtual)).length;
    const limit = user?.plan === "pro" ? Infinity : FREE_LIMIT;
    const percentage = limit === Infinity ? 0 : (used / limit) * 100;
    return { used, limit, percentage };
  }

  function canAddReceivable(): boolean {
    if (user?.plan === "pro") return true;
    const { used, limit } = getLimitStatus();
    return used < limit;
  }

  return (
    <ReceivablesContext.Provider
      value={{
        receivables,
        loading,
        addReceivable,
        updateReceivable,
        deleteReceivable,
        getProximasAReceber,
        getReceivablesByStatus,
        getLimitStatus,
        canAddReceivable,
      }}
    >
      {children}
    </ReceivablesContext.Provider>
  );
}

export function useReceivables(): ReceivablesContextType {
  const context = useContext(ReceivablesContext);
  if (!context) throw new Error("useReceivables deve ser usado dentro de ReceivablesProvider");
  return context;
}
