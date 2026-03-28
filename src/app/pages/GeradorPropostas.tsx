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
import { pb } from "../../lib/pocketbase";

type Template = "basico" | "detalhado" | "premium";
type ProposalStatus = "aguardando" | "aprovada" | "recusada";
type ProposalTipo = "contrato" | "orcamento";
type ViewMode = "list" | "create" | "view";
type FilterTab = "todas" | "aguardando" | "aprovadas" | "recusadas";

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
  template: Template;
  created: string;
}

const TEMPLATES: { id: Template; label: string; desc: string; badge?: string }[] = [
  { id: "basico", label: "Básico", desc: "Simples e direto ao ponto" },
  { id: "detalhado", label: "Detalhado", desc: "Inclui escopo e cronograma", badge: "Popular" },
  { id: "premium", label: "Premium", desc: "Header destacado e termos", badge: "PRO" },
];

const STATUS_CONFIG = {
  aguardando: { label: "Aguardando", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  aprovada: { label: "Aprovada", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  recusada: { label: "Recusada", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const TIPO_CONFIG = {
  contrato: { label: "CONTRATO", color: "text-[#2DDB81]" },
  orcamento: { label: "ORÇAMENTO", color: "text-blue-400" },
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

  const FREE_LIMIT = 2;
  const limite = user?.plan === "pro" ? Infinity : FREE_LIMIT;
  const usageCount = user?.proposalUsageToday ?? 0;
  const limitReached = usageCount >= limite;

  // Fetch proposals
  useEffect(() => {
    if (!user) return;
    fetchProposals();
  }, [user]);

  const fetchProposals = async () => {
    if (!user) return;
    setLoadingList(true);
    try {
      const records = await pb.collection("proposals").getList(1, 500, {
        filter: `user_id = "${user.id}"`,
        sort: "-created",
      });
      setProposals(records.items as Proposal[]);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
    setLoadingList(false);
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
    if (activeTab === "aprovadas") return proposals.filter(p => p.status === "aprovada");
    if (activeTab === "recusadas") return proposals.filter(p => p.status === "recusada");
    if (activeTab === "aguardando") return proposals.filter(p => p.status === "aguardando");
    return proposals;
  };

  // Formatting
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
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
      await pb.collection("proposals").create({
        user_id: user!.id,
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

      toast.success("Proposta criada com sucesso!");
      try { await incrementProposalUsage(); } catch {}
      resetForm();
      await fetchProposals();
      setViewMode("list");
    } catch (error: any) {
      toast.error("Erro ao salvar proposta: " + error.message);
    }
    setSaving(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: ProposalStatus) => {
    try {
      await pb.collection("proposals").update(id, {
        status: newStatus,
      });

      toast.success(`Proposta marcada como ${STATUS_CONFIG[newStatus].label}`);
      await fetchProposals();
      if (selectedProposal?.id === id) {
        setSelectedProposal({ ...selectedProposal, status: newStatus });
      }
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

  const inputClass = "bg-[#141414] border-white/10 text-white placeholder:text-[#686F6F] rounded-xl focus:border-[#28A263]";

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "todas", label: "Todas" },
    { id: "aguardando", label: "Aguardando" },
    { id: "aprovadas", label: "Aprovadas" },
    { id: "recusadas", label: "Recusadas" },
  ];

  // ====== LIST VIEW ======
  if (viewMode === "list") {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Propostas</h1>
            <p className="text-[#A1A1A1] mt-1">Gerencie seus contratos e orçamentos com precisão editorial</p>
          </div>
          <Button
            size="lg"
            className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl"
            onClick={() => { resetForm(); setViewMode("create"); }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Proposta
          </Button>
        </div>

        {/* Usage counter for free users */}
        {user?.plan !== "pro" && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1B1B1B] border border-white/5">
            <Info className="h-4 w-4 text-[#2DDB81] flex-shrink-0" />
            <span className="text-sm text-[#A1A1A1]">
              Plano gratuito: <span className="text-white font-medium">{usageCount}/{FREE_LIMIT}</span> propostas criadas hoje
            </span>
            {limitReached && (
              <Button size="sm" className="ml-auto bg-[#28A263] hover:bg-[#2DDB81] text-white text-xs rounded-lg" onClick={() => navigate("/checkout")}>
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
                  ? "bg-[#28A263] text-white"
                  : "bg-[#1B1B1B] text-[#A1A1A1] hover:text-white border border-white/5"
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
              <div className="text-center py-12 text-[#A1A1A1]">Carregando propostas...</div>
            ) : getFilteredProposals().length === 0 ? (
              <div className="text-center py-16 bg-[#1B1B1B] rounded-2xl border border-white/5">
                <FileText className="w-12 h-12 text-[#686F6F] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {proposals.length === 0 ? "Nenhuma proposta ainda" : "Nenhuma proposta neste filtro"}
                </h3>
                <p className="text-[#A1A1A1] mb-6 text-sm">
                  {proposals.length === 0 ? "Crie sua primeira proposta comercial profissional" : "Tente outro filtro"}
                </p>
                {proposals.length === 0 && (
                  <Button className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl" onClick={() => setViewMode("create")}>
                    <Plus className="w-4 h-4 mr-2" /> Criar Proposta
                  </Button>
                )}
              </div>
            ) : (
              getFilteredProposals().map(proposal => (
                <div
                  key={proposal.id}
                  onClick={() => setSelectedProposal(proposal)}
                  className={`p-5 bg-[#1B1B1B] rounded-2xl border cursor-pointer transition-all hover:border-[#28A263]/30 ${
                    selectedProposal?.id === proposal.id ? "border-[#28A263]/50" : "border-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold ${TIPO_CONFIG[proposal.tipo].color}`}>
                          {TIPO_CONFIG[proposal.tipo].label} #{proposal.id.slice(0, 4).toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_CONFIG[proposal.status].color}`}>
                          {STATUS_CONFIG[proposal.status].label}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold truncate">{proposal.nome_servico}</h3>
                      <p className="text-[#A1A1A1] text-sm">{proposal.nome_cliente}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-white font-bold">{formatCurrency(Number(proposal.valor))}</span>
                        <span className="text-[#686F6F]">{formatDate(proposal.created)}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#686F6F] flex-shrink-0 mt-2" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Active Document Preview */}
            {selectedProposal ? (
              <div className="bg-[#1B1B1B] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-5 border-b border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#2DDB81] font-bold uppercase">Documento Ativo</span>
                    <button onClick={() => setSelectedProposal(null)} className="text-[#686F6F] hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-white font-bold">Preview Rápido</h3>
                </div>

                <div className="p-5 space-y-4">
                  {/* Document info */}
                  <div className="bg-[#141414] rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#28A263]/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#2DDB81]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{selectedProposal.nome_servico}</p>
                        <p className="text-[#686F6F] text-xs">{selectedProposal.nome_cliente}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#A1A1A1]">Status</span>
                        <span className={`font-medium ${STATUS_CONFIG[selectedProposal.status].color.split(' ')[1]}`}>
                          {STATUS_CONFIG[selectedProposal.status].label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick details */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A1A1A1]">Valor</span>
                      <span className="text-white font-bold">{formatCurrency(Number(selectedProposal.valor))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A1A1A1]">Prazo</span>
                      <span className="text-white">{selectedProposal.prazo || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A1A1A1]">Pagamento</span>
                      <span className="text-white">{selectedProposal.condicoes_pagamento}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A1A1A1]">Criada em</span>
                      <span className="text-white">{formatDate(selectedProposal.created)}</span>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div>
                    <p className="text-xs text-[#A1A1A1] font-medium mb-2 uppercase">Alterar Status</p>
                    <div className="flex gap-2">
                      {(["aguardando", "aprovada", "recusada"] as ProposalStatus[]).map(s => (
                        <button
                          key={s}
                          onClick={() => handleUpdateStatus(selectedProposal.id, s)}
                          className={`flex-1 text-xs py-2 rounded-lg border font-medium transition-colors ${
                            selectedProposal.status === s
                              ? STATUS_CONFIG[s].color
                              : "border-white/10 text-[#686F6F] hover:text-white hover:border-white/20"
                          }`}
                        >
                          {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-lg text-xs"
                      onClick={() => handleCopyText(selectedProposal)}
                    >
                      {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                      {copied ? "Copiado" : "Copiar"}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs"
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
              <div className="bg-[#1B1B1B] rounded-2xl border border-white/5 p-8 text-center">
                <Eye className="w-8 h-8 text-[#686F6F] mx-auto mb-3" />
                <p className="text-[#A1A1A1] text-sm">Selecione uma proposta para ver detalhes</p>
              </div>
            )}

            {/* Stats Card */}
            {proposals.length > 0 && (
              <div className="bg-[#1B1B1B] rounded-2xl border border-white/5 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-[#2DDB81]" />
                  <span className="text-xs text-[#A1A1A1]">Resumo</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {formatCurrency(stats.valorAprovado)}
                </div>
                <p className="text-sm text-[#A1A1A1]">Em propostas aprovadas</p>
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{stats.total}</div>
                    <div className="text-xs text-[#686F6F]">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#2DDB81]">{stats.aprovadas}</div>
                    <div className="text-xs text-[#686F6F]">Aprovadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">{stats.aguardando}</div>
                    <div className="text-xs text-[#686F6F]">Pendentes</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Limit Dialog */}
        <Dialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
          <DialogContent className="max-w-md text-center bg-[#1B1B1B] border-white/10">
            <DialogHeader>
              <div className="flex justify-center mb-4 mt-2">
                <div className="w-16 h-16 bg-[#28A263]/20 rounded-2xl flex items-center justify-center">
                  <Crown className="w-8 h-8 text-[#2DDB81]" />
                </div>
              </div>
              <DialogTitle className="text-2xl font-bold text-white">Limite diário atingido!</DialogTitle>
              <DialogDescription className="text-[#A1A1A1] mt-2">
                Você usou todas as {FREE_LIMIT} propostas gratuitas de hoje. Faça upgrade para o PRO e gere propostas ilimitadas!
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 mt-4">
              <Button size="lg" className="w-full bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl" onClick={() => { setLimitDialogOpen(false); navigate("/checkout"); }}>
                <Crown className="w-4 h-4 mr-2" /> Ver Planos PRO
              </Button>
              <Button size="lg" className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl" onClick={() => setLimitDialogOpen(false)}>
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
          <Button variant="ghost" className="text-[#A1A1A1] hover:text-white" onClick={() => setViewMode("list")}>
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Nova Proposta</h1>
            <p className="text-[#A1A1A1] text-sm">Preencha os campos e veja o preview em tempo real</p>
          </div>
        </div>
        {user?.plan !== "pro" && (
          <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${
            limitReached ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-[#28A263]/10 text-[#2DDB81] border-[#28A263]/20"
          }`}>
            {usageCount}/{FREE_LIMIT} hoje
          </span>
        )}
      </div>

      {/* Type + Template selector */}
      <div className="flex gap-4">
        <div className="p-4 bg-[#1B1B1B] rounded-2xl border border-white/5 flex-shrink-0">
          <h3 className="text-xs font-bold text-[#A1A1A1] uppercase mb-3">Tipo</h3>
          <div className="flex gap-2">
            {(["orcamento", "contrato"] as ProposalTipo[]).map(t => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  tipo === t ? "bg-[#28A263] text-white" : "bg-[#141414] text-[#A1A1A1] border border-white/10 hover:text-white"
                }`}
              >
                {t === "orcamento" ? "Orçamento" : "Contrato"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-[#1B1B1B] rounded-2xl border border-white/5 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3 h-3 text-[#2DDB81]" />
            <h3 className="text-xs font-bold text-[#A1A1A1] uppercase">Modelo</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`relative p-3 rounded-xl border text-left transition-all ${
                  template === t.id ? "border-[#28A263] bg-[#28A263]/10" : "border-white/10 bg-[#141414] hover:border-white/20"
                }`}
              >
                {t.badge && (
                  <span className={`absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                    t.badge === "PRO" ? "bg-[#28A263]/20 text-[#2DDB81]" : "bg-blue-500/20 text-blue-400"
                  }`}>{t.badge}</span>
                )}
                <p className={`font-bold text-sm ${template === t.id ? "text-[#2DDB81]" : "text-white"}`}>{t.label}</p>
                <p className="text-xs text-[#686F6F]">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-5">
          <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-5">Dados do Cliente</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-[#A1A1A1] mb-2 block">Nome do Cliente</Label>
                <Input value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} placeholder="Ex: João Silva" className={inputClass} />
              </div>
              <div>
                <Label className="text-[#A1A1A1] mb-2 block">Email do Cliente</Label>
                <Input type="email" value={emailCliente} onChange={(e) => setEmailCliente(e.target.value)} placeholder="cliente@email.com" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-5">Dados do Serviço</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-[#A1A1A1] mb-2 block">Nome do Serviço/Projeto</Label>
                <Input value={nomeServico} onChange={(e) => setNomeServico(e.target.value)} placeholder="Ex: Desenvolvimento de Website" className={inputClass} />
              </div>
              <div>
                <Label className="text-[#A1A1A1] mb-2 block">Descrição Detalhada</Label>
                <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva o escopo do projeto..." className={`min-h-[100px] ${inputClass}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#A1A1A1] mb-2 block">Valor Total</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1A1]">R$</span>
                    <Input type="number" value={valor} onChange={(e) => setValor(Number(e.target.value))} className={`pl-10 ${inputClass}`} min={0} />
                  </div>
                </div>
                <div>
                  <Label className="text-[#A1A1A1] mb-2 block">Prazo de Entrega</Label>
                  <Input value={prazo} onChange={(e) => setPrazo(e.target.value)} placeholder="Ex: 30 dias" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#A1A1A1] mb-2 block">Condições de Pagamento</Label>
                  <Select value={condicoesPagamento} onValueChange={setCondicoesPagamento}>
                    <SelectTrigger className="bg-[#141414] border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1B1B1B] border-white/10 text-white">
                      <SelectItem value="integral">À vista</SelectItem>
                      <SelectItem value="50-50">50% + 50%</SelectItem>
                      <SelectItem value="30-70">30% + 70%</SelectItem>
                      <SelectItem value="3x">3x sem juros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[#A1A1A1] mb-2 block">Validade (dias)</Label>
                  <Input type="number" value={validade} onChange={(e) => setValidade(Number(e.target.value))} className={inputClass} min={1} max={90} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl h-12"
              onClick={handleSave}
              disabled={saving || !nomeCliente || !nomeServico}
            >
              {saving ? "Salvando..." : "Salvar Proposta"}
            </Button>
            <Button size="lg" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl h-12" onClick={handleDownloadPDF} disabled={!nomeCliente}>
              <Download className="w-4 h-4 mr-2" /> PDF
            </Button>
            <Button size="lg" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl h-12" onClick={() => handleCopyText()}>
              <Copy className="w-4 h-4 mr-2" /> Copiar
            </Button>
            <Button size="lg" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl h-12" onClick={() => handleSendEmail()} disabled={!emailCliente}>
              <Send className="w-4 h-4 mr-2" /> Email
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <div className="bg-[#1D1D1D] text-white px-6 py-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#2DDB81]" />
                <span className="font-bold text-white">Preview da Proposta</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                template === "basico" ? "bg-white/10 text-[#A1A1A1]" :
                template === "detalhado" ? "bg-blue-500/20 text-blue-400" :
                "bg-[#28A263]/20 text-[#2DDB81]"
              }`}>
                {TEMPLATES.find(t => t.id === template)?.label}
              </span>
            </div>

            <div className="p-8 bg-white min-h-[500px]">
              <div id="proposal-preview" className="space-y-6">
                {template === "premium" ? (
                  <div className="bg-[#28A263] rounded-xl p-5 mb-2">
                    <h1 className="text-2xl font-bold text-white">Proposta Comercial</h1>
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
