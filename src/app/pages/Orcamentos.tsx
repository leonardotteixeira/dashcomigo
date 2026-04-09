import { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { pb } from "../../lib/pocketbase";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { KPICard } from "../components/KPICard";
import { PageHeader } from "../components/PageHeader";

type ProposalStatus = "aguardando" | "aprovada" | "recusada" | "paga" | "vencida";
type ProposalTipo = "contrato" | "orcamento";
type FilterTab = "todos" | "aguardando" | "aprovadas" | "pagas" | "recusadas";

interface Proposal {
  id: string;
  tipo: ProposalTipo;
  status: ProposalStatus;
  nome_cliente: string;
  email_cliente: string;
  nome_servico: string;
  descricao: string;
  valor: number;
  prazo: string;
  condicoes_pagamento: string;
  validade: number;
  template: "basico" | "detalhado" | "premium";
  created: string;
}

interface CreateFormData {
  nome_servico: string;
  nome_cliente: string;
  email_cliente: string;
  valor: string;
  descricao: string;
  prazo: string;
  condicoes_pagamento: string;
  tipo: ProposalTipo;
  validade: string;
}

const STATUS_CONFIG: Record<
  ProposalStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  aguardando: {
    label: "Aguardando",
    badgeClass: "bg-orange-100 text-orange-700 border border-orange-200",
    dotClass: "bg-orange-500",
  },
  aprovada: {
    label: "Aprovada",
    badgeClass: "bg-blue-100 text-blue-700 border border-blue-200",
    dotClass: "bg-blue-500",
  },
  paga: {
    label: "Paga",
    badgeClass: "bg-green-100 text-green-700 border border-green-200",
    dotClass: "bg-green-500",
  },
  recusada: {
    label: "Recusada",
    badgeClass: "bg-red-100 text-red-700 border border-red-200",
    dotClass: "bg-red-500",
  },
  vencida: {
    label: "Vencida",
    badgeClass: "bg-gray-100 text-gray-600 border border-gray-200",
    dotClass: "bg-gray-400",
  },
};

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "aguardando", label: "Aguardando" },
  { key: "aprovadas", label: "Aprovadas" },
  { key: "pagas", label: "Pagas" },
  { key: "recusadas", label: "Recusadas" },
];

const EMPTY_FORM: CreateFormData = {
  nome_servico: "",
  nome_cliente: "",
  email_cliente: "",
  valor: "",
  descricao: "",
  prazo: "",
  condicoes_pagamento: "",
  tipo: "orcamento",
  validade: "30",
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

export function Orcamentos() {
  const { user } = useAuth();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<CreateFormData>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    loadProposals();
  }, [user?.id]);

  async function loadProposals() {
    try {
      setLoading(true);
      const records = await pb.collection("proposals").getFullList<Proposal>({
        filter: `userid = "${user!.id}"`,
        sort: "-created",
        requestKey: null,
      });
      setProposals(records);
    } catch (err: any) {
      if (err?.name !== "ClientResponseError" || err?.status !== 0) {
        toast.error("Erro ao carregar orçamentos");
      }
    } finally {
      setLoading(false);
    }
  }

  const totalCount = proposals.length;
  const pendingSum = proposals
    .filter((p) => p.status === "aguardando")
    .reduce((s, p) => s + (p.valor || 0), 0);
  const approvedSum = proposals
    .filter((p) => p.status === "aprovada" || p.status === "paga")
    .reduce((s, p) => s + (p.valor || 0), 0);

  const filteredProposals = proposals.filter((p) => {
    if (activeTab === "todos") return true;
    if (activeTab === "aguardando") return p.status === "aguardando";
    if (activeTab === "aprovadas") return p.status === "aprovada";
    if (activeTab === "pagas") return p.status === "paga";
    if (activeTab === "recusadas") return p.status === "recusada";
    return true;
  });

  async function handleStatusChange(id: string, newStatus: ProposalStatus) {
    try {
      setUpdatingId(id);
      await pb.collection("proposals").update(id, { status: newStatus });
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      toast.success("Status atualizado com sucesso");
    } catch {
      toast.error("Erro ao atualizar status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      await pb.collection("proposals").delete(id);
      setProposals((prev) => prev.filter((p) => p.id !== id));
      setExpandedId(null);
      setConfirmDeleteId(null);
      toast.success("Orçamento excluído");
    } catch {
      toast.error("Erro ao excluir orçamento");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;
    if (!formData.nome_servico.trim()) {
      toast.error("Nome do serviço é obrigatório");
      return;
    }
    if (!formData.nome_cliente.trim()) {
      toast.error("Nome do cliente é obrigatório");
      return;
    }
    if (!formData.valor || isNaN(parseFloat(formData.valor))) {
      toast.error("Valor inválido");
      return;
    }
    try {
      setCreating(true);
      const payload = {
        userid: user.id,
        nome_servico: formData.nome_servico.trim(),
        nome_cliente: formData.nome_cliente.trim(),
        email_cliente: formData.email_cliente.trim(),
        valor: parseFloat(formData.valor),
        descricao: formData.descricao.trim(),
        prazo: formData.prazo.trim(),
        condicoes_pagamento: formData.condicoes_pagamento.trim(),
        tipo: formData.tipo,
        validade: parseInt(formData.validade) || 30,
        status: "aguardando" as ProposalStatus,
        template: "basico" as const,
      };
      const created = await pb.collection("proposals").create<Proposal>(payload);
      setProposals((prev) => [created, ...prev]);
      setShowCreateModal(false);
      setFormData(EMPTY_FORM);
      toast.success("Orçamento criado com sucesso");
    } catch {
      toast.error("Erro ao criar orçamento");
    } finally {
      setCreating(false);
    }
  }

  function handleFormChange(
    field: keyof CreateFormData,
    value: string
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  const statusActionsFor = (current: ProposalStatus): { label: string; value: ProposalStatus; className: string }[] => {
    const options: { label: string; value: ProposalStatus; className: string }[] = [];
    if (current !== "aprovada") {
      options.push({ label: "Marcar como Aprovada", value: "aprovada", className: "text-blue-600 hover:bg-blue-50" });
    }
    if (current !== "paga") {
      options.push({ label: "Marcar como Paga", value: "paga", className: "text-green-600 hover:bg-green-50" });
    }
    if (current !== "recusada") {
      options.push({ label: "Marcar como Recusada", value: "recusada", className: "text-red-600 hover:bg-red-50" });
    }
    return options;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orçamentos"
        description="Gerencie seus orçamentos e propostas comerciais"
        actions={
          <button
            onClick={() => { setFormData(EMPTY_FORM); setShowCreateModal(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Novo Orçamento
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          icon={FileText}
          label="Total de Orçamentos"
          value={totalCount}
          description="Todos os orçamentos criados"
          color="blue"
        />
        <KPICard
          icon={Clock}
          label="Valor Pendente"
          value={formatCurrency(pendingSum)}
          description="Aguardando aprovação do cliente"
          color="orange"
        />
        <KPICard
          icon={DollarSign}
          label="Valor Aprovado"
          value={formatCurrency(approvedSum)}
          description="Propostas aceitas e pagas"
          color="green"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-card border border-border rounded-xl w-fit">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mb-4 opacity-40" />
          <p className="text-foreground font-medium mb-1">Nenhum orçamento encontrado</p>
          <p className="text-sm text-muted-foreground">
            {activeTab === "todos"
              ? "Crie seu primeiro orçamento clicando em Novo Orçamento"
              : "Nenhum orçamento com esse status"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProposals.map((proposal) => {
            const config = STATUS_CONFIG[proposal.status] ?? STATUS_CONFIG.vencida;
            const isExpanded = expandedId === proposal.id;
            const isUpdating = updatingId === proposal.id;
            const isDeleting = deletingId === proposal.id;
            const isConfirmDelete = confirmDeleteId === proposal.id;

            return (
              <div
                key={proposal.id}
                className="bg-card border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-md"
              >
                {/* Card Header — always visible */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : proposal.id)}
                  className="w-full text-left p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {proposal.nome_servico}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {proposal.nome_cliente}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Criado em {formatDate(proposal.created)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="font-bold text-foreground text-base">
                      {formatCurrency(proposal.valor)}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${config.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
                      {config.label}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded Section */}
                {isExpanded && (
                  <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">
                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {proposal.email_cliente && (
                        <div>
                          <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">
                            Email do Cliente
                          </span>
                          <p className="text-foreground mt-0.5">{proposal.email_cliente}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">
                          Tipo
                        </span>
                        <p className="text-foreground mt-0.5 capitalize">{proposal.tipo}</p>
                      </div>
                      {proposal.prazo && (
                        <div>
                          <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">
                            Prazo
                          </span>
                          <p className="text-foreground mt-0.5">{proposal.prazo}</p>
                        </div>
                      )}
                      {proposal.condicoes_pagamento && (
                        <div>
                          <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">
                            Condições de Pagamento
                          </span>
                          <p className="text-foreground mt-0.5">{proposal.condicoes_pagamento}</p>
                        </div>
                      )}
                      {proposal.validade && (
                        <div>
                          <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">
                            Validade
                          </span>
                          <p className="text-foreground mt-0.5">{proposal.validade} dias</p>
                        </div>
                      )}
                    </div>

                    {proposal.descricao && (
                      <div>
                        <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">
                          Descrição
                        </span>
                        <p className="text-foreground text-sm mt-1 whitespace-pre-wrap leading-relaxed">
                          {proposal.descricao}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                      {/* Status change buttons */}
                      {statusActionsFor(proposal.status).map((action) => (
                        <button
                          key={action.value}
                          onClick={() => handleStatusChange(proposal.id, action.value)}
                          disabled={isUpdating}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border border-border transition-colors ${action.className} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
                          ) : null}
                          {action.label}
                        </button>
                      ))}

                      <div className="flex-1" />

                      {/* Delete */}
                      {isConfirmDelete ? (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span className="text-xs text-red-700 font-medium">Confirmar exclusão?</span>
                          <button
                            onClick={() => handleDelete(proposal.id)}
                            disabled={isDeleting}
                            className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Excluir"}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-xs text-gray-500 hover:text-gray-700 ml-1"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(proposal.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Excluir
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => { if (!creating) { setShowCreateModal(false); } }}
          />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
              <div>
                <h2 className="text-lg font-bold text-foreground">Novo Orçamento</h2>
                <p className="text-sm text-muted-foreground">Preencha os dados do orçamento</p>
              </div>
              <button
                onClick={() => { if (!creating) setShowCreateModal(false); }}
                disabled={creating}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {/* Tipo */}
              <div className="flex gap-2">
                {(["orcamento", "contrato"] as ProposalTipo[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleFormChange("tipo", t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      formData.tipo === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {t === "orcamento" ? "Orçamento" : "Contrato"}
                  </button>
                ))}
              </div>

              {/* Nome do Serviço */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Nome do Serviço <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nome_servico}
                  onChange={(e) => handleFormChange("nome_servico", e.target.value)}
                  placeholder="Ex: Desenvolvimento de Website"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                  required
                />
              </div>

              {/* Nome do Cliente */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Nome do Cliente <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nome_cliente}
                  onChange={(e) => handleFormChange("nome_cliente", e.target.value)}
                  placeholder="Ex: Empresa XYZ Ltda"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                  required
                />
              </div>

              {/* Email do Cliente */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email do Cliente</label>
                <input
                  type="email"
                  value={formData.email_cliente}
                  onChange={(e) => handleFormChange("email_cliente", e.target.value)}
                  placeholder="cliente@empresa.com"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                />
              </div>

              {/* Valor */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Valor (R$) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => handleFormChange("valor", e.target.value)}
                  placeholder="0,00"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                  required
                />
              </div>

              {/* Prazo + Validade (side by side) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Prazo</label>
                  <input
                    type="text"
                    value={formData.prazo}
                    onChange={(e) => handleFormChange("prazo", e.target.value)}
                    placeholder="Ex: 30 dias"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Validade (dias)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.validade}
                    onChange={(e) => handleFormChange("validade", e.target.value)}
                    placeholder="30"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Condições de Pagamento */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Condições de Pagamento</label>
                <input
                  type="text"
                  value={formData.condicoes_pagamento}
                  onChange={(e) => handleFormChange("condicoes_pagamento", e.target.value)}
                  placeholder="Ex: 50% na aprovação, 50% na entrega"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                />
              </div>

              {/* Descrição */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => handleFormChange("descricao", e.target.value)}
                  placeholder="Descreva os serviços, escopo e detalhes relevantes..."
                  rows={4}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Criar Orçamento
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
