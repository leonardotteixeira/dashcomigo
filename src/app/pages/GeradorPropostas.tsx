import { useState, useEffect } from "react";
import {
  FileText, Download, Send, Eye, Info, Crown, Copy, Check, Sparkles,
  Plus, Filter, ArrowRight, MoreHorizontal, Trash2, ChevronRight,
  TrendingUp, Clock, X
} from "lucide-react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { pb, getVerifiedPlan } from "../../lib/pocketbase";

type Template = "basico" | "detalhado" | "premium";
type ProposalStatus = "aguardando" | "aprovada" | "recusada" | "paga" | "vencida";
type ProposalTipo = "contrato" | "orcamento";
type ViewMode = "list" | "create" | "view";
type FilterTab = "todas" | "aguardando" | "aprovadas" | "recusadas" | "pagas" | "vencidas";

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
  data_pagamento?: string;
  template: Template;
  created: string;
}

const TEMPLATES: { id: Template; label: string; desc: string; badge?: string }[] = [
  { id: "basico", label: "Básico", desc: "Simples e direto ao ponto" },
  { id: "detalhado", label: "Detalhado", desc: "Inclui escopo e cronograma", badge: "Popular" },
  { id: "premium", label: "Premium", desc: "Header destacado e termos", badge: "PRO" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  aguardando: { label: "Aguardando", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  aprovada: { label: "Aprovada", color: "bg-blue-100 text-blue-700 border-blue-300" },
  paga: { label: "Paga", color: "bg-green-100 text-green-700 border-green-300" },
  vencida: { label: "Vencida", color: "bg-red-100 text-red-700 border-red-300" },
  recusada: { label: "Recusada", color: "bg-orange-100 text-orange-700 border-orange-300" },
};

const getStatusConfig = (status: string) =>
  STATUS_CONFIG[status] ?? { label: status ?? "—", color: "bg-gray-100 text-gray-700 border-gray-300" };

const TIPO_CONFIG = {
  contrato: { label: "CONTRATO", color: "text-primary" },
  orcamento: { label: "ORÇAMENTO", color: "text-secondary" },
};

export function GeradorPropostas() {
  const { user, incrementProposalUsage } = useAuth();
  const navigate = useNavigate();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState<FilterTab>("todas");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  // Proposals list
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Form state
  const [template, setTemplate] = useState<Template>("basico");
  const [tipo, setTipo] = useState<ProposalTipo>("orcamento");
  const [nomeCliente, setNomeCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [nomeServico, setNomeServico] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(0);
  const [prazo, setPrazo] = useState("");
  const [condicoesPagamento, setCondicoesPagamento] = useState("50-50");
  const [validade, setValidade] = useState(7);
  const [saving, setSaving] = useState(false);

  // Dialogs
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentDateDialogOpen, setPaymentDateDialogOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [pendingPaymentProposalId, setPendingPaymentProposalId] = useState<string | null>(null);

  const FREE_LIMIT = 2;
  const limite = user?.plan === "pro" ? Infinity : FREE_LIMIT;
  const usageCount = user?.proposalUsageToday ?? 0;
  const limitReached = usageCount >= limite;

  // Fetch proposals — depend only on user.id to avoid re-triggering on every auth state update
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    const fetchProposals = async () => {
      setLoadingList(true);
      try {
        let records = await pb.collection("proposals").getList(1, 500, {
          filter: `user_id = "${user.id}"`,
          sort: "-created",
          requestKey: null,
        }).catch(() => null);

        if (!records || records.items.length === 0) {
          records = await pb.collection("proposals").getList(1, 500, {
            filter: `userid = "${user.id}"`,
            sort: "-created",
            requestKey: null,
          }).catch(() => null);
        }

        if (!cancelled && records) setProposals(records.items as Proposal[]);
      } catch (error) {
        console.error("[Propostas] Erro ao buscar:", error);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    };

    fetchProposals();
    return () => { cancelled = true; };
  }, [user?.id]);

  const fetchProposals = async () => {
    if (!user?.id) return;
    setLoadingList(true);
    try {
      // Try user_id first; some PocketBase setups use userid — handle both
      let records = await pb.collection("proposals").getList(1, 500, {
        filter: `user_id = "${user.id}"`,
        sort: "-created",
        requestKey: null,
      }).catch(() => null);

      if (!records || records.items.length === 0) {
        records = await pb.collection("proposals").getList(1, 500, {
          filter: `userid = "${user.id}"`,
          sort: "-created",
          requestKey: null,
        }).catch(() => null);
      }

      if (records) setProposals(records.items as Proposal[]);
    } catch (error) {
      console.error("[Propostas] Erro ao buscar:", error);
    } finally {
      setLoadingList(false);
    }
  };

  // Stats
  const stats = {
    total: proposals.length,
    aprovadas: proposals.filter(p => p.status === "aprovada").length,
    valorAprovado: proposals.filter(p => p.status === "aprovada").reduce((sum, p) => sum + Number(p.valor), 0),
    aguardando: proposals.filter(p => p.status === "aguardando").length,
  };

  // Filtered proposals
  const filteredProposals = activeTab === "todas"
    ? proposals
    : proposals.filter(p => p.status === activeTab.replace("s", "").replace("aprovada", "aprovada").replace("recusada", "recusada"));

  const getFilteredProposals = () => {
    if (activeTab === "todas") return proposals;
    if (activeTab === "aguardando") return proposals.filter(p => p.status === "aguardando");
    if (activeTab === "aprovadas") return proposals.filter(p => p.status === "aprovada");
    if (activeTab === "pagas") return proposals.filter(p => p.status === "paga");
    if (activeTab === "vencidas") return proposals.filter(p => p.status === "vencida");
    if (activeTab === "recusadas") return proposals.filter(p => p.status === "recusada");
    return proposals;
  };

  // Formatting
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatDateFull = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  };

  const getPagamentoText = (cond: string, val: number) => {
    if (cond === "integral") return `À vista: ${formatCurrency(val)}`;
    if (cond === "50-50") return `50%/50%: ${formatCurrency(val / 2)} + ${formatCurrency(val / 2)}`;
    if (cond === "30-70") return `30%/70%: ${formatCurrency(val * 0.3)} + ${formatCurrency(val * 0.7)}`;
    return `3x de ${formatCurrency(val / 3)}`;
  };

  const getProposalText = (p?: Proposal) => {
    const nc = p?.nome_cliente || nomeCliente;
    const ec = p?.email_cliente || emailCliente;
    const ns = p?.nome_servico || nomeServico;
    const desc = p?.descricao || descricao;
    const v = p?.valor || valor;
    const pr = p?.prazo || prazo;
    const cp = p?.condicoes_pagamento || condicoesPagamento;
    const val = p?.validade || validade;
    const tmpl = p?.template || template;

    const lines = [
      `PROPOSTA COMERCIAL`,
      `Data: ${new Date().toLocaleDateString("pt-BR")}`,
      ``,
      `CLIENTE`,
      `Nome: ${nc}`,
      `Email: ${ec}`,
      ``,
      `PROJETO`,
      `Serviço: ${ns}`,
      ``,
      `Descrição:`,
      desc,
      ``,
    ];

    if (tmpl === "detalhado" || tmpl === "premium") {
      lines.push(
        `ESCOPO DE ENTREGA`,
        `• Levantamento de requisitos e planejamento`,
        `• Desenvolvimento e implementação`,
        `• Revisões e ajustes`,
        `• Entrega final e suporte inicial`,
        ``,
        `CRONOGRAMA`,
        `• Prazo total: ${pr}`,
        ``
      );
    }

    lines.push(
      `INVESTIMENTO`,
      `Valor total: ${formatCurrency(v)}`,
      `Condições: ${getPagamentoText(cp, v)}`,
      ``,
      `PRAZO DE ENTREGA: ${pr}`,
      `VALIDADE: ${formatDateFull(val)}`,
    );

    if (tmpl === "premium") {
      lines.push(
        ``,
        `TERMOS E CONDIÇÕES`,
        `• O projeto inicia após pagamento da entrada`,
        `• Revisões incluídas: até 2 rodadas`,
        `• Direitos autorais transferidos após pagamento integral`,
        `• Alterações fora do escopo serão orçadas separadamente`,
      );
    }

    lines.push(``, `Meu Fluxo`);
    return lines.join("\n");
  };

  // Actions
  const resetForm = () => {
    setTemplate("basico");
    setTipo("orcamento");
    setNomeCliente("");
    setEmailCliente("");
    setNomeServico("");
    setDescricao("");
    setValor(0);
    setPrazo("");
    setCondicoesPagamento("50-50");
    setValidade(7);
  };

  const handleSave = async () => {
    if (limitReached) {
      setLimitDialogOpen(true);
      return;
    }
    if (!nomeCliente || !nomeServico) {
      toast.error("Preencha ao menos o nome do cliente e do serviço.");
      return;
    }

    // Validar email se preenchido
    if (emailCliente && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCliente)) {
      toast.error("E-mail do cliente inválido.");
      return;
    }

    setSaving(true);
    const validadeDate = validade
      ? new Date(new Date().setDate(new Date().getDate() + Number(validade))).toISOString().split("T")[0]
      : null;

    try {
      // Re-verificar plano e uso diário direto do PocketBase para evitar bypass client-side
      const freshPlan = await getVerifiedPlan(user!.id);
      if (freshPlan !== "pro") {
        const today = new Date().toISOString().split("T")[0];
        const profile = await pb.collection("profiles").getOne(user!.id, { requestKey: null });
        const lastReset = (profile.proposal_reset_date ?? "").slice(0, 10);
        const freshUsage = lastReset === today ? (profile.proposal_usage_today ?? 0) : 0;
        if (freshUsage >= FREE_LIMIT) {
          setLimitDialogOpen(true);
          setSaving(false);
          return;
        }
      }

      const record = await pb.collection("proposals").create({
        user_id: user!.id,
        userid: user!.id, // send both field name variants — PocketBase ignores unknown fields
        tipo: tipo || "orcamento",
        status: "aguardando",
        nome_cliente: nomeCliente,
        email_cliente: emailCliente || null,
        nome_servico: nomeServico,
        descricao: descricao || null,
        valor: parseFloat(String(valor)) || 0,
        prazo: prazo || null,
        condicoes_pagamento: condicoesPagamento || null,
        validade: validadeDate,
        template: template || "basico",
      });

      // Optimistic update: add the new proposal to local state immediately from the
      // returned record, without waiting for (or relying on) a re-fetch.
      const newProposal: Proposal = {
        id: record.id,
        tipo: (record.tipo || tipo) as ProposalTipo,
        status: "aguardando",
        nome_cliente: record.nome_cliente || nomeCliente,
        email_cliente: record.email_cliente || emailCliente,
        nome_servico: record.nome_servico || nomeServico,
        descricao: record.descricao || descricao,
        valor: Number(record.valor) || parseFloat(String(valor)) || 0,
        prazo: record.prazo || prazo,
        condicoes_pagamento: record.condicoes_pagamento || condicoesPagamento,
        validade: record.validade ?? Number(validade),
        template: (record.template || template) as Template,
        created: record.created || new Date().toISOString(),
      };
      setProposals((prev) => [newProposal, ...prev]);

      toast.success("Proposta criada com sucesso!");
      try { await incrementProposalUsage(); } catch {}
      resetForm();
      setViewMode("list");
      // Background re-fetch to sync any server-side changes (don't await — not critical)
      fetchProposals().catch(() => null);
    } catch (error: any) {
      const msg = error?.message || error?.data?.message || "Erro desconhecido";
      console.error("[Propostas] Erro ao criar:", error);
      toast.error("Erro ao salvar proposta: " + msg);
    }
    setSaving(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: ProposalStatus) => {
    if (newStatus === "paga") {
      // Show dialog to set payment date
      setPendingPaymentProposalId(id);
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setPaymentDateDialogOpen(true);
      return;
    }

    try {
      const updateData: Record<string, any> = { status: newStatus };
      await pb.collection("proposals").update(id, updateData);

      toast.success(`Proposta marcada como ${getStatusConfig(newStatus).label}`);
      await fetchProposals();
      if (selectedProposal?.id === id) {
        setSelectedProposal({ ...selectedProposal, status: newStatus });
      }
    } catch (error: any) {
      toast.error("Erro ao atualizar proposta");
    }
  };

  const handleConfirmPayment = async () => {
    if (!pendingPaymentProposalId || !paymentDate) {
      toast.error("Selecione uma data de pagamento");
      return;
    }

    try {
      await pb.collection("proposals").update(pendingPaymentProposalId, {
        status: "paga",
        data_pagamento: paymentDate,
      });

      toast.success("Proposta marcada como Paga");
      await fetchProposals();
      if (selectedProposal?.id === pendingPaymentProposalId) {
        setSelectedProposal({
          ...selectedProposal,
          status: "paga",
          data_pagamento: paymentDate,
        });
      }
      setPaymentDateDialogOpen(false);
      setPendingPaymentProposalId(null);
      setPaymentDate("");
    } catch (error: any) {
      toast.error("Erro ao atualizar proposta");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await pb.collection("proposals").delete(id);
      toast.success("Proposta excluída");
      await fetchProposals();
      if (selectedProposal?.id === id) setSelectedProposal(null);
    } catch (error: any) {
      toast.error("Erro ao excluir proposta");
    }
  };

  const handleCopyText = (p?: Proposal) => {
    navigator.clipboard.writeText(getProposalText(p)).then(() => {
      setCopied(true);
      toast.success("Proposta copiada!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSendEmail = (p?: Proposal) => {
    const email = p?.email_cliente || emailCliente;
    const servico = p?.nome_servico || nomeServico;
    const body = getProposalText(p);
    window.open(
      `mailto:${email}?subject=${encodeURIComponent(`Proposta Comercial - ${servico}`)}&body=${encodeURIComponent(body)}`
    );
  };

  const handleDownloadPDF = () => {
    document.body.classList.add("printing-proposal");
    window.print();
    document.body.classList.remove("printing-proposal");
  };

  const inputClass = "bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-xl focus:border-primary";

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "todas", label: "Todas" },
    { id: "aguardando", label: "Aguardando" },
    { id: "aprovadas", label: "Aprovadas" },
    { id: "pagas", label: "Pagas" },
    { id: "vencidas", label: "Vencidas" },
    { id: "recusadas", label: "Recusadas" },
  ];

  // ====== LIST VIEW ======
  if (viewMode === "list") {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#001529] mb-1">Propostas</h1>
            <p className="text-[rgba(0,21,41,0.6)]">Gerencie seus contratos e orçamentos com precisão</p>
          </div>
          <Button
            size="lg"
            className="bg-[#28A263] hover:bg-[#1f7d4a] text-white rounded-xl"
            onClick={() => { resetForm(); setViewMode("create"); }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Proposta
          </Button>
        </div>

        {/* Usage counter for free users */}
        {user?.plan !== "pro" && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
            <Info className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              Plano gratuito: <span className="text-foreground font-medium">{usageCount}/{FREE_LIMIT}</span> propostas criadas hoje
            </span>
            {limitReached && (
              <Button size="sm" className="ml-auto bg-[#28A263] hover:bg-primary text-foreground text-xs rounded-lg" onClick={() => navigate("/checkout")}>
                <Crown className="w-3 h-3 mr-1" /> Upgrade PRO
              </Button>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#28A263] text-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Proposal List */}
          <div className="lg:col-span-2 space-y-3">
            {loadingList ? (
              <div className="text-center py-12 text-muted-foreground">Carregando propostas...</div>
            ) : getFilteredProposals().length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {proposals.length === 0 ? "Nenhuma proposta ainda" : "Nenhuma proposta neste filtro"}
                </h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  {proposals.length === 0 ? "Crie sua primeira proposta comercial profissional" : "Tente outro filtro"}
                </p>
                {proposals.length === 0 && (
                  <Button className="bg-[#28A263] hover:bg-primary text-foreground rounded-xl" onClick={() => setViewMode("create")}>
                    <Plus className="w-4 h-4 mr-2" /> Criar Proposta
                  </Button>
                )}
              </div>
            ) : (
              getFilteredProposals().map(proposal => (
                <div
                  key={proposal.id}
                  onClick={() => setSelectedProposal(proposal)}
                  className={`p-5 bg-card rounded-2xl border cursor-pointer transition-all hover:border-primary/30 ${
                    selectedProposal?.id === proposal.id ? "border-primary/50" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold ${TIPO_CONFIG[proposal.tipo].color}`}>
                          {TIPO_CONFIG[proposal.tipo].label} #{proposal.id.slice(0, 4).toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getStatusConfig(proposal.status).color}`}>
                          {getStatusConfig(proposal.status).label}
                        </span>
                      </div>
                      <h3 className="text-foreground font-semibold truncate">{proposal.nome_servico}</h3>
                      <p className="text-muted-foreground text-sm">{proposal.nome_cliente}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-foreground font-bold">{formatCurrency(Number(proposal.valor))}</span>
                        <span className="text-muted-foreground">{formatDate(proposal.created)}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Active Document Preview */}
            {selectedProposal ? (
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="p-5 border-b border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-primary font-bold uppercase">Documento Ativo</span>
                    <button onClick={() => setSelectedProposal(null)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-foreground font-bold">Preview Rápido</h3>
                </div>

                <div className="p-5 space-y-4">
                  {/* Document info */}
                  <div className="bg-muted rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground text-sm font-medium truncate">{selectedProposal.nome_servico}</p>
                        <p className="text-muted-foreground text-xs">{selectedProposal.nome_cliente}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Status</span>
                        <span className={`font-medium ${getStatusConfig(selectedProposal.status).color.split(' ')[1]}`}>
                          {getStatusConfig(selectedProposal.status).label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick details */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor</span>
                      <span className="text-foreground font-bold">{formatCurrency(Number(selectedProposal.valor))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Prazo</span>
                      <span className="text-foreground">{selectedProposal.prazo || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pagamento</span>
                      <span className="text-foreground">{selectedProposal.condicoes_pagamento}</span>
                    </div>
                    {selectedProposal.data_pagamento && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Paga em</span>
                        <span className="text-primary font-medium">{formatDate(selectedProposal.data_pagamento)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Criada em</span>
                      <span className="text-foreground">{formatDate(selectedProposal.created)}</span>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-2 uppercase">Alterar Status</p>
                    <div className="flex flex-wrap gap-2">
                      {(["aguardando", "aprovada", "paga", "vencida", "recusada"] as ProposalStatus[]).map(s => (
                        <button
                          key={s}
                          onClick={() => handleUpdateStatus(selectedProposal.id, s)}
                          className={`flex-1 min-w-20 text-xs py-2 rounded-lg border font-medium transition-colors ${
                            selectedProposal.status === s
                              ? getStatusConfig(s).color
                              : "border-border text-muted-foreground hover:text-foreground hover:border-border"
                          }`}
                        >
                          {getStatusConfig(s).label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      className="bg-[#28A263] hover:bg-primary text-foreground rounded-lg text-xs"
                      onClick={() => handleCopyText(selectedProposal)}
                    >
                      {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                      {copied ? "Copiado" : "Copiar"}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-white/5 hover:bg-white/10 text-foreground border border-border rounded-lg text-xs"
                      onClick={() => handleSendEmail(selectedProposal)}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Enviar
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
                    onClick={() => handleDelete(selectedProposal.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Excluir proposta
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <Eye className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Selecione uma proposta para ver detalhes</p>
              </div>
            )}

            {/* Stats Card */}
            {proposals.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Resumo</span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {formatCurrency(stats.valorAprovado)}
                </div>
                <p className="text-sm text-muted-foreground">Em propostas aprovadas</p>
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{stats.total}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{stats.aprovadas}</div>
                    <div className="text-xs text-muted-foreground">Aprovadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">{stats.aguardando}</div>
                    <div className="text-xs text-muted-foreground">Pendentes</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Date Dialog */}
        <Dialog open={paymentDateDialogOpen} onOpenChange={setPaymentDateDialogOpen}>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Data de Pagamento</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Em qual data a proposta foi paga?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground mb-2 block">Data</Label>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="bg-muted border-border text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-[#28A263] hover:bg-primary text-foreground rounded-lg"
                  onClick={handleConfirmPayment}
                >
                  Confirmar
                </Button>
                <Button
                  className="flex-1 bg-white/5 hover:bg-white/10 text-foreground border border-border rounded-lg"
                  onClick={() => {
                    setPaymentDateDialogOpen(false);
                    setPendingPaymentProposalId(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Limit Dialog */}
        <Dialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
          <DialogContent className="max-w-md text-center bg-card border-border">
            <DialogHeader>
              <div className="flex justify-center mb-4 mt-2">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <Crown className="w-8 h-8 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground">Limite diário atingido!</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                Você usou todas as {FREE_LIMIT} propostas gratuitas de hoje. Faça upgrade para o PRO e gere propostas ilimitadas!
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Button size="lg" className="w-full bg-[#28A263] hover:bg-primary text-foreground rounded-xl" onClick={() => { setLimitDialogOpen(false); navigate("/checkout"); }}>
                <Crown className="w-4 h-4 mr-2" /> Ver Planos PRO
              </Button>
              <Button size="lg" className="w-full bg-white/5 hover:bg-white/10 text-foreground border border-border rounded-xl" onClick={() => setLimitDialogOpen(false)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ====== CREATE VIEW ======
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => setViewMode("list")}>
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nova Proposta</h1>
            <p className="text-muted-foreground text-sm">Preencha os campos e veja o preview em tempo real</p>
          </div>
        </div>
        {user?.plan !== "pro" && (
          <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${
            limitReached ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-primary/10 text-primary border-primary/20"
          }`}>
            {usageCount}/{FREE_LIMIT} hoje
          </span>
        )}
      </div>

      {/* Type + Template selector */}
      <div className="flex gap-4">
        <div className="p-4 bg-card rounded-2xl border border-border flex-shrink-0">
          <h3 className="text-xs font-bold text-muted-foreground uppercase mb-3">Tipo</h3>
          <div className="flex gap-2">
            {(["orcamento", "contrato"] as ProposalTipo[]).map(t => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  tipo === t ? "bg-[#28A263] text-foreground" : "bg-muted text-muted-foreground border border-border hover:text-foreground"
                }`}
              >
                {t === "orcamento" ? "Orçamento" : "Contrato"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-card rounded-2xl border border-border flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3 h-3 text-primary" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase">Modelo</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`relative p-3 rounded-xl border text-left transition-all ${
                  template === t.id ? "border-primary bg-primary/10" : "border-border bg-muted hover:border-border"
                }`}
              >
                {t.badge && (
                  <span className={`absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                    t.badge === "PRO" ? "bg-primary/20 text-primary" : "bg-blue-500/20 text-blue-400"
                  }`}>{t.badge}</span>
                )}
                <p className={`font-bold text-sm ${template === t.id ? "text-primary" : "text-foreground"}`}>{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-5">
          <div className="p-6 bg-card rounded-2xl border border-border">
            <h3 className="text-lg font-bold text-foreground mb-5">Dados do Cliente</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground mb-2 block">Nome do Cliente</Label>
                <Input value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} placeholder="Ex: João Silva" className={inputClass} />
              </div>
              <div>
                <Label className="text-muted-foreground mb-2 block">Email do Cliente</Label>
                <Input type="email" value={emailCliente} onChange={(e) => setEmailCliente(e.target.value)} placeholder="cliente@email.com" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-card rounded-2xl border border-border">
            <h3 className="text-lg font-bold text-foreground mb-5">Dados do Serviço</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground mb-2 block">Nome do Serviço/Projeto</Label>
                <Input value={nomeServico} onChange={(e) => setNomeServico(e.target.value)} placeholder="Ex: Desenvolvimento de Website" className={inputClass} />
              </div>
              <div>
                <Label className="text-muted-foreground mb-2 block">Descrição Detalhada</Label>
                <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva o escopo do projeto..." className={`min-h-[100px] ${inputClass}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground mb-2 block">Valor Total</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input type="number" value={valor} onChange={(e) => setValor(Number(e.target.value))} className={`pl-10 ${inputClass}`} min={0} />
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground mb-2 block">Prazo de Entrega</Label>
                  <Input value={prazo} onChange={(e) => setPrazo(e.target.value)} placeholder="Ex: 30 dias" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground mb-2 block">Condições de Pagamento</Label>
                  <Select value={condicoesPagamento} onValueChange={setCondicoesPagamento}>
                    <SelectTrigger className="bg-muted border-border text-foreground rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="integral">À vista</SelectItem>
                      <SelectItem value="50-50">50% + 50%</SelectItem>
                      <SelectItem value="30-70">30% + 70%</SelectItem>
                      <SelectItem value="3x">3x sem juros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-muted-foreground mb-2 block">Validade (dias)</Label>
                  <Input type="number" value={validade} onChange={(e) => setValidade(Number(e.target.value))} className={inputClass} min={1} max={90} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 bg-[#28A263] hover:bg-primary text-foreground rounded-xl h-12"
              onClick={handleSave}
              disabled={saving || !nomeCliente || !nomeServico}
            >
              {saving ? "Salvando..." : "Salvar Proposta"}
            </Button>
            <Button size="lg" className="bg-white/5 hover:bg-white/10 text-foreground border border-border rounded-xl h-12" onClick={handleDownloadPDF} disabled={!nomeCliente}>
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
            <Button size="lg" className="bg-white/5 hover:bg-white/10 text-foreground border border-border rounded-xl h-12" onClick={() => handleCopyText()}>
              <Copy className="w-4 h-4 mr-2" /> Copiar
            </Button>
            <Button size="lg" className="bg-white/5 hover:bg-white/10 text-foreground border border-border rounded-xl h-12" onClick={() => handleSendEmail()} disabled={!emailCliente}>
              <Send className="w-4 h-4 mr-2" /> Email
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="bg-card text-foreground px-6 py-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">Preview da Proposta</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                template === "basico" ? "bg-white/10 text-muted-foreground" :
                template === "detalhado" ? "bg-blue-500/20 text-blue-400" :
                "bg-primary/20 text-primary"
              }`}>
                {TEMPLATES.find(t => t.id === template)?.label}
              </span>
            </div>

            <div className="p-8 bg-white min-h-[500px]">
              <div id="proposal-preview" className="space-y-6">
                {template === "premium" ? (
                  <div className="bg-[#28A263] rounded-xl p-5 mb-2">
                    <h1 className="text-2xl font-bold text-foreground">Proposta Comercial</h1>
                    <p className="text-green-100 text-sm mt-1">{new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
                  </div>
                ) : (
                  <div className={`text-center pb-6 border-b-2 ${template === "detalhado" ? "border-blue-200" : "border-slate-200"}`}>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Proposta Comercial</h1>
                    <p className="text-slate-600">{new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
                  </div>
                )}

                <div>
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Cliente</h2>
                  <div className={`rounded-lg p-4 border ${template === "premium" ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
                    <p className="font-bold text-slate-900 text-lg">{nomeCliente || "[Nome do Cliente]"}</p>
                    <p className="text-slate-600 text-sm mt-1">{emailCliente || "[email@cliente.com]"}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Projeto</h2>
                  <p className="font-bold text-slate-900 text-lg">{nomeServico || "[Nome do Serviço]"}</p>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap mt-2">{descricao || "[Descrição]"}</p>
                </div>

                {(template === "detalhado" || template === "premium") && (
                  <div>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Escopo</h2>
                    <ul className="space-y-2">
                      {["Levantamento de requisitos", "Desenvolvimento e implementação", "Revisões e ajustes (até 2 rodadas)", "Entrega final e suporte"].map(item => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Separator />

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 text-center">
                  <p className="text-sm text-slate-600 mb-1">Valor Total</p>
                  <p className="text-4xl font-bold text-slate-900">{formatCurrency(valor)}</p>
                  {condicoesPagamento !== "integral" && (
                    <p className="text-sm text-slate-600 mt-2">{getPagamentoText(condicoesPagamento, valor)}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Prazo</p>
                    <p className="font-bold text-slate-900">{prazo || "[Prazo]"}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Válida até</p>
                    <p className="font-bold text-slate-900">{formatDateFull(validade)}</p>
                  </div>
                </div>

                {template === "premium" && (
                  <>
                    <Separator />
                    <div>
                      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Termos</h2>
                      <ul className="space-y-1.5">
                        {["Início após pagamento da entrada", "Até 2 rodadas de revisão", "Direitos transferidos após pagamento", "Alterações extras orçadas separadamente"].map(t => (
                          <li key={t} className="text-sm text-slate-600">• {t}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                <div className="text-center pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">Estamos à disposição para esclarecer dúvidas.</p>
                  <p className="text-xs text-slate-500 font-bold">Meu Fluxo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
