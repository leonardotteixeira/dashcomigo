import { useState, useEffect, Fragment } from "react";
import {
  Plus, ArrowUpRight, ArrowDownRight, Search, User, Building2,
  Crown, TrendingUp, TrendingDown, DollarSign, Trash2, X, Loader2,
  AlertTriangle, CheckCircle2, Download, ChevronDown, ChevronUp,
  Paperclip, FileText, ExternalLink,
} from "lucide-react";
import { KPICard } from "../components/KPICard";
import { PageHeader } from "../components/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import { useCashFlow, Transaction } from "../contexts/CashFlowContext";
import { pb } from "../../lib/pocketbase";
import { toast } from "sonner";
import { exportToXlsx } from "../../utils/exportXlsx";

// ─── Types ────────────────────────────────────────────────────────────────────

type PfPj = "PF" | "PJ";
type TipoTransacao = "entrada" | "saida";
type ActiveTab = "all" | "PJ" | "PF";

// ─── Heuristic PF/PJ Classifier ───────────────────────────────────────────────

const PF_KEYWORDS = [
  "salário", "salario", "pix", "retirada", "pro-labore", "prolabore",
  "pessoal", "alimentação", "alimentacao", "lazer", "saúde", "saude",
  "farmácia", "farmacia", "mercado", "supermercado", "academia",
];

const PJ_KEYWORDS = [
  "fornecedor", "nota fiscal", "nota_fiscal", "nf", "cliente", "serviço",
  "servico", "contrato", "aluguel", "energia", "água", "agua", "internet",
  "telefone", "software", "licença", "licenca", "material", "escritório",
  "escritorio", "marketing", "publicidade", "equipamento", "manutenção",
  "manutencao", "frete", "logística", "logistica",
];

function classifyPfPj(
  descricao: string,
  valor: number,
  tipo: TipoTransacao,
): { pfpj: PfPj; score: number } {
  const lower = descricao.toLowerCase();

  for (const kw of PF_KEYWORDS) {
    if (lower.includes(kw)) return { pfpj: "PF", score: 90 };
  }
  for (const kw of PJ_KEYWORDS) {
    if (lower.includes(kw)) return { pfpj: "PJ", score: 90 };
  }

  // Amount-based heuristics
  if (tipo === "saida") {
    if (valor > 2000) return { pfpj: "PJ", score: 75 };
    if (valor < 100) return { pfpj: "PF", score: 65 };
  }
  if (tipo === "entrada" && valor > 2000) {
    return { pfpj: "PJ", score: 75 };
  }

  // Default to PJ for business context
  return { pfpj: "PJ", score: 55 };
}

// ─── Categories ──────────────────────────────────────────────────────────────

const CATEGORIES_INCOME = [
  "Serviços", "Produto", "Freelance", "Consultoria", "Salário",
  "Aluguel Recebido", "Reembolso", "Outros",
];

const CATEGORIES_EXPENSE = [
  "Despesas Operacionais", "Infraestrutura", "Tecnologia", "Marketing",
  "Material de Escritório", "Transporte", "Alimentação", "Saúde",
  "Pessoal / Retirada", "Impostos", "Outros",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (iso?: string | null): string => {
  if (!iso) return "—";
  try {
    const datePart = iso.split("T")[0].split(" ")[0];
    const parts = datePart.split("-");
    if (parts.length < 3) return "—";
    const [y, m, d] = parts;
    // Validate parsed values
    const d_num = parseInt(d, 10);
    const m_num = parseInt(m, 10);
    const y_num = parseInt(y, 10);
    if (d_num < 1 || d_num > 31 || m_num < 1 || m_num > 12 || y_num < 1900) return "—";
    return `${d}/${m}/${y}`;
  } catch {
    console.warn("Invalid date:", iso);
    return "—";
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function FluxoCaixa() {
  const { user, incrementTransactionUsage } = useAuth();
  const { transactions, addTransaction: ctxAddTransaction, deleteTransaction: ctxDeleteTransaction, loading, updateTransactionAttachments } = useCashFlow();

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | TipoTransacao>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    tipo: "entrada" as TipoTransacao,
    categoria: "",
    data: new Date().toISOString().split("T")[0],
    pfpj: "PJ" as PfPj,
    pfpj_score: 100,
  });
  const [suggestion, setSuggestion] = useState<{ pfpj: PfPj; score: number } | null>(null);
  const [showReviewAlert, setShowReviewAlert] = useState(false);
  const [manualPfPj, setManualPfPj] = useState(false);

  // ─── Auto-suggest when description or valor changes ───────────────────────

  useEffect(() => {
    const trimmed = formData.descricao.trim();
    const val = parseFloat(formData.valor) || 0;
    if (trimmed.length < 3) {
      setSuggestion(null);
      setShowReviewAlert(false);
      return;
    }
    const s = classifyPfPj(trimmed, val, formData.tipo);
    setSuggestion(s);
    setShowReviewAlert(s.score < 70);
    // Only auto-apply if user hasn't manually selected PF/PJ
    if (!manualPfPj) {
      setFormData((f) => ({ ...f, pfpj: s.pfpj, pfpj_score: s.score }));
    }
  }, [formData.descricao, formData.valor, formData.tipo, manualPfPj]);

  // ─── Create transaction ───────────────────────────────────────────────────

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const valor = parseFloat(formData.valor);
    if (!valor || valor <= 0) { toast.error("Informe um valor válido."); return; }
    if (!formData.categoria) { toast.error("Selecione uma categoria."); return; }
    if (user.plan === "free" && user.transactionsUsageToday >= 100) {
      toast.error("Limite mensal atingido. Faça upgrade para Premium.");
      return;
    }

    setSaving(true);
    try {
      await ctxAddTransaction({
        valor,
        tipo: formData.tipo,
        categoria: formData.categoria,
        data: formData.data,
        descricao: formData.descricao,
        pfpj: formData.pfpj,
        pfpjScore: formData.pfpj_score,
      });
      await incrementTransactionUsage();
      toast.success("Transação registrada!");
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error("[FluxoCaixa] handleCreate error:", err);
      toast.error("Erro ao salvar transação.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta transação?")) return;
    try {
      await ctxDeleteTransaction(id);
      toast.success("Transação excluída.");
    } catch {
      toast.error("Erro ao excluir transação.");
    }
  };

  const resetForm = () => {
    setFormData({
      descricao: "",
      valor: "",
      tipo: "entrada",
      categoria: "",
      data: new Date().toISOString().split("T")[0],
      pfpj: "PJ",
      pfpj_score: 100,
    });
    setSuggestion(null);
    setShowReviewAlert(false);
    setManualPfPj(false);
  };

  // ─── Derived values ───────────────────────────────────────────────────────

  const filtered = transactions.filter((t) => {
    if (activeTab !== "all" && t.pfpj !== activeTab) return false;
    if (typeFilter !== "all" && t.tipo !== typeFilter) return false;
    if (
      search &&
      !(t.descricao ?? "").toLowerCase().includes(search.toLowerCase()) &&
      !t.categoria.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const calcKpis = (list: Transaction[]) => {
    const income = list.filter((t) => t.tipo === "entrada").reduce((s, t) => s + t.valor, 0);
    const expense = list.filter((t) => t.tipo === "saida").reduce((s, t) => s + t.valor, 0);
    return { income, expense, balance: income - expense };
  };

  const kpiAll = calcKpis(transactions);
  const kpiPJ = calcKpis(transactions.filter((t) => t.pfpj === "PJ"));
  const kpiPF = calcKpis(transactions.filter((t) => t.pfpj === "PF"));

  const activeKpi =
    activeTab === "PJ" ? kpiPJ : activeTab === "PF" ? kpiPF : kpiAll;

  // Usage limit
  const limit = 100;
  const used = user?.transactionsUsageToday ?? 0;
  const limitPct = (used / limit) * 100;

  const categories =
    formData.tipo === "entrada" ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;

  // ─── Upload attachment ────────────────────────────────────────────────────

  const handleUploadAttachment = async (id: string, file: File) => {
    setUploadingId(id);
    try {
      const formData = new FormData();
      formData.append("attachments", file);
      const updated = await pb.collection("transactions").update(id, formData);
      const newAttachments = Array.isArray(updated.attachments) ? updated.attachments : [];
      updateTransactionAttachments(id, newAttachments);
      toast.success("Anexo enviado!");
    } catch {
      toast.error("Erro ao enviar anexo");
    }
    setUploadingId(null);
  };

  // ─── Export ───────────────────────────────────────────────────────────────

  const handleExport = () => {
    const rows = filtered.map((t) => ({
      Data: fmtDate(t.data),
      Descrição: t.descricao || "—",
      Categoria: t.categoria,
      Tipo: t.tipo === "entrada" ? "Receita" : "Despesa",
      "PF/PJ": t.pfpj,
      "Valor (R$)": t.tipo === "entrada" ? t.valor : -t.valor,
    }));
    exportToXlsx(rows, "fluxo-de-caixa");
    toast.success("Exportado com sucesso!");
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fluxo de Caixa"
        description="Gerencie entradas e saídas separando finanças pessoais (PF) e empresariais (PJ)"
        actions={
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 bg-[#7FD19F] hover:bg-[#1F5A3A] text-[#0E3B2E] px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        }
      />

      {/* Free plan limit warning */}
      {limitPct > 70 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-amber-800 text-sm">
                {limitPct >= 100 ? "Limite atingido" : "Limite próximo"}
              </span>
            </div>
            <p className="text-xs text-amber-700 mb-2">
              {used} de {limit} transações mensais do plano gratuito
            </p>
            <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${limitPct >= 100 ? "bg-red-500" : "bg-amber-500"}`}
                style={{ width: `${Math.min(limitPct, 100)}%` }}
              />
            </div>
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors">
            Upgrade Premium
          </button>
        </div>
      )}

      {/* PF/PJ TABs */}
      <div className="flex gap-1 bg-[#F4EFE6] rounded-xl p-1 w-fit">
        {(
          [
            { key: "all", label: "Todos", Icon: null },
            { key: "PJ", label: "Empresa (PJ)", Icon: Building2 },
            { key: "PF", label: "Pessoal (PF)", Icon: User },
          ] as const
        ).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === key
                ? "bg-white text-[#0E3B2E] shadow-sm"
                : "text-[rgba(0,21,41,0.55)] hover:text-[#0E3B2E]"
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
            {label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          icon={TrendingUp}
          label={
            activeTab === "PJ"
              ? "Receitas Empresa"
              : activeTab === "PF"
              ? "Receitas Pessoais"
              : "Total Receitas"
          }
          value={`+R$ ${fmtBRL(activeKpi.income)}`}
          color="green"
        />
        <KPICard
          icon={TrendingDown}
          label={
            activeTab === "PJ"
              ? "Despesas Empresa"
              : activeTab === "PF"
              ? "Despesas Pessoais"
              : "Total Despesas"
          }
          value={`-R$ ${fmtBRL(activeKpi.expense)}`}
          color="red"
        />
        <KPICard
          icon={DollarSign}
          label={
            activeTab === "PJ"
              ? "Caixa Real da Empresa"
              : activeTab === "PF"
              ? "Saldo Pessoal"
              : "Saldo do Período"
          }
          value={`${activeKpi.balance >= 0 ? "+" : "-"}R$ ${fmtBRL(Math.abs(activeKpi.balance))}`}
          color={activeKpi.balance >= 0 ? "green" : "red"}
        />
      </div>

      {/* PF/PJ split summary (only in "all" tab) */}
      {activeTab === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-semibold text-[#0E3B2E] text-sm">Empresa (PJ)</span>
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-[rgba(0,21,41,0.5)] text-xs mb-0.5">Receitas</p>
                <p className="font-bold text-green-600">+R$ {fmtBRL(kpiPJ.income)}</p>
              </div>
              <div className="text-right">
                <p className="text-[rgba(0,21,41,0.5)] text-xs mb-0.5">Despesas</p>
                <p className="font-bold text-red-500">-R$ {fmtBRL(kpiPJ.expense)}</p>
              </div>
              <div className="text-right">
                <p className="text-[rgba(0,21,41,0.5)] text-xs mb-0.5">Saldo</p>
                <p className={`font-bold ${kpiPJ.balance >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {kpiPJ.balance >= 0 ? "+" : "-"}R$ {fmtBRL(Math.abs(kpiPJ.balance))}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-semibold text-[#0E3B2E] text-sm">Pessoal (PF)</span>
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-[rgba(0,21,41,0.5)] text-xs mb-0.5">Receitas</p>
                <p className="font-bold text-green-600">+R$ {fmtBRL(kpiPF.income)}</p>
              </div>
              <div className="text-right">
                <p className="text-[rgba(0,21,41,0.5)] text-xs mb-0.5">Despesas</p>
                <p className="font-bold text-red-500">-R$ {fmtBRL(kpiPF.expense)}</p>
              </div>
              <div className="text-right">
                <p className="text-[rgba(0,21,41,0.5)] text-xs mb-0.5">Saldo</p>
                <p className={`font-bold ${kpiPF.balance >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {kpiPF.balance >= 0 ? "+" : "-"}R$ {fmtBRL(Math.abs(kpiPF.balance))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="border border-[rgba(20,18,15,0.13)] rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-[#F4EFE6] px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-[rgba(0,21,41,0.4)]" />
          <input
            type="text"
            placeholder="Buscar por descrição ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1 text-[#0E3B2E] placeholder:text-[rgba(0,21,41,0.4)]"
          />
        </div>
        <div className="flex gap-2">
          {(
            [
              { key: "all", label: "Todos" },
              { key: "entrada", label: "Receitas" },
              { key: "saida", label: "Despesas" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === key
                  ? key === "entrada"
                    ? "bg-green-500 text-white"
                    : key === "saida"
                    ? "bg-red-500 text-white"
                    : "bg-[#0E3B2E] text-white"
                  : "bg-[#F4EFE6] text-[rgba(0,21,41,0.6)] hover:bg-[rgba(20,18,15,0.13)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 border border-[rgba(20,18,15,0.13)] rounded-lg text-xs font-semibold text-[rgba(0,21,41,0.6)] hover:bg-[#F4EFE6] transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Exportar XLSX
        </button>
      </div>

      {/* Transactions table */}
      <div className="border border-[rgba(20,18,15,0.13)] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#7FD19F]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[rgba(0,21,41,0.5)] text-sm">
              {transactions.length === 0
                ? 'Nenhuma transação registrada. Clique em "Nova Transação" para começar.'
                : "Nenhuma transação encontrada com os filtros selecionados."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F4EFE6] border-b border-[rgba(20,18,15,0.13)]">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[rgba(0,21,41,0.5)] uppercase tracking-wider">Data</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[rgba(0,21,41,0.5)] uppercase tracking-wider">Descrição</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[rgba(0,21,41,0.5)] uppercase tracking-wider">Categoria</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[rgba(0,21,41,0.5)] uppercase tracking-wider">Tipo</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[rgba(0,21,41,0.5)] uppercase tracking-wider">Valor</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EFE6]">
                {filtered.map((t) => {
                  const isExpanded = expandedId === t.id;
                  return (
                    <Fragment key={t.id}>
                      <tr
                        className="hover:bg-[#F9FAFB] transition-colors group cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : t.id)}
                      >
                        <td className="px-5 py-3.5 whitespace-nowrap text-sm text-[rgba(0,21,41,0.7)]">
                          {fmtDate(t.data)}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-[#0E3B2E]">{t.descricao || "—"}</span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                                t.pfpj === "PF"
                                  ? "bg-purple-50 text-purple-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {t.pfpj === "PF" ? <User className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                              {t.pfpj}
                            </span>
                            {(t.pfpjScore ?? 100) < 70 && (
                              <span className="text-amber-500" title={`Confiança: ${(t.pfpjScore ?? 100)}%`}>
                                <AlertTriangle className="w-3 h-3" />
                              </span>
                            )}
                            {(t.attachments ?? []).length > 0 && (
                              <span className="text-[rgba(0,21,41,0.4)]" title={`${(t.attachments ?? []).length} anexo(s)`}>
                                <Paperclip className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-sm text-[rgba(0,21,41,0.55)]">{t.categoria}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                              t.tipo === "entrada"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {t.tipo === "entrada" ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {t.tipo === "entrada" ? "Receita" : "Despesa"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                          <span
                            className={`font-bold text-sm ${
                              t.tipo === "entrada" ? "text-green-600" : "text-red-500"
                            }`}
                          >
                            {t.tipo === "entrada" ? "+" : "-"}R$ {fmtBRL(t.valor)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-[rgba(0,21,41,0.3)] hover:text-red-500 transition-all"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <span className="p-1 text-[rgba(0,21,41,0.3)]">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </span>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#F9FAFB]">
                          <td colSpan={6} className="px-5 py-4 border-t border-[rgba(20,18,15,0.13)]">
                            <div className="flex flex-wrap gap-6 text-sm">
                              {/* Meta */}
                              <div className="space-y-1 min-w-[140px]">
                                <p className="text-xs font-semibold text-[rgba(0,21,41,0.4)] uppercase tracking-wider">Classificação</p>
                                <p className="text-[#0E3B2E] font-medium">
                                  <span className="inline-flex items-center gap-1.5">
                                    {t.pfpj === "PF" ? <User className="w-3.5 h-3.5 flex-shrink-0" /> : <Building2 className="w-3.5 h-3.5 flex-shrink-0" />}
                                    {t.pfpj === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                                  </span>
                                  {(t.pfpjScore ?? 100) < 100 && (
                                    <span className={`ml-2 text-xs ${(t.pfpjScore ?? 100) < 70 ? "text-amber-500" : "text-green-600"}`}>
                                      ({(t.pfpjScore ?? 100)}% confiança)
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="space-y-1 min-w-[140px]">
                                <p className="text-xs font-semibold text-[rgba(0,21,41,0.4)] uppercase tracking-wider">Criado em</p>
                                <p className="text-[#0E3B2E] font-medium">
                                  {fmtDate(
                                    t.createdAt instanceof Date && !isNaN(t.createdAt.getTime())
                                      ? t.createdAt.toISOString()
                                      : typeof t.createdAt === "string"
                                      ? t.createdAt
                                      : undefined
                                  )}
                                </p>
                              </div>
                              {/* Attachments */}
                              <div className="flex-1 space-y-2 min-w-[200px]">
                                <p className="text-xs font-semibold text-[rgba(0,21,41,0.4)] uppercase tracking-wider">Anexos</p>
                                {(t.attachments ?? []).length === 0 ? (
                                  <p className="text-xs text-[rgba(0,21,41,0.4)]">Nenhum anexo</p>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    {(t.attachments ?? []).map((filename) => (
                                      <a
                                        key={filename}
                                        href={`${pb.baseUrl}/api/files/transactions/${t.id}/${filename}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[rgba(20,18,15,0.13)] text-xs text-[#0E3B2E] hover:bg-[#EBE4D6] transition-colors"
                                      >
                                        <FileText className="w-3 h-3" />
                                        {filename.length > 20 ? filename.slice(0, 20) + "…" : filename}
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    ))}
                                  </div>
                                )}
                                <label
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-dashed border-[rgba(20,18,15,0.13)] text-xs text-[rgba(0,21,41,0.5)] hover:border-[#0E3B2E] hover:text-[#0E3B2E] cursor-pointer transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {uploadingId === t.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Paperclip className="w-3 h-3" />
                                  )}
                                  {uploadingId === t.id ? "Enviando..." : "Adicionar anexo"}
                                  <input
                                    type="file"
                                    className="hidden"
                                    disabled={uploadingId === t.id}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleUploadAttachment(t.id, file);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Nova Transação Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ background: "#F4EFE6" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(20,18,15,0.13)]">
              <h2 className="text-lg font-bold text-[#0E3B2E]">Nova Transação</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-[rgba(0,21,41,0.4)] hover:text-[#0E3B2E] rounded-lg hover:bg-[#F4EFE6] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-5">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold text-[#0E3B2E] mb-2">Tipo</label>
                <div className="flex gap-2">
                  {(["entrada", "saida"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setFormData((f) => ({
                          ...f,
                          tipo: t,
                          categoria: "",
                        }))
                      }
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        formData.tipo === t
                          ? t === "entrada"
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-red-500 border-red-500 text-white"
                          : "bg-[#EBE4D6] border-[rgba(20,18,15,0.13)] text-[rgba(0,21,41,0.6)] hover:border-[#0E3B2E]"
                      }`}
                    >
                      {t === "entrada" ? "↑ Receita" : "↓ Despesa"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-[#0E3B2E] mb-2">Descrição</label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData((f) => ({ ...f, descricao: e.target.value }))}
                  placeholder="Ex: Pagamento Cliente X"
                  className="w-full h-11 px-4 border border-[rgba(20,18,15,0.13)] rounded-xl text-sm text-[#0E3B2E] placeholder:text-[rgba(0,21,41,0.4)] outline-none focus:border-[#7FD19F] focus:ring-2 focus:ring-[#7FD19F]/15 transition-all"
                  required
                />
              </div>

              {/* Valor + Data */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0E3B2E] mb-2">Valor (R$)</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData((f) => ({ ...f, valor: e.target.value }))}
                    placeholder="0,00"
                    className="w-full h-11 px-4 border border-[rgba(20,18,15,0.13)] rounded-xl text-sm text-[#0E3B2E] placeholder:text-[rgba(0,21,41,0.4)] outline-none focus:border-[#7FD19F] focus:ring-2 focus:ring-[#7FD19F]/15 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0E3B2E] mb-2">Data</label>
                  <input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData((f) => ({ ...f, data: e.target.value }))}
                    className="w-full h-11 px-4 border border-[rgba(20,18,15,0.13)] rounded-xl text-sm text-[#0E3B2E] outline-none focus:border-[#7FD19F] focus:ring-2 focus:ring-[#7FD19F]/15 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-semibold text-[#0E3B2E] mb-2">Categoria</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData((f) => ({ ...f, categoria: e.target.value }))}
                  className="w-full h-11 px-4 border border-[rgba(20,18,15,0.13)] rounded-xl text-sm text-[#0E3B2E] outline-none focus:border-[#7FD19F] focus:ring-2 focus:ring-[#7FD19F]/15 transition-all bg-white"
                  required
                >
                  <option value="">Selecionar...</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* PF/PJ Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#0E3B2E]">Classificação</label>
                  {suggestion && (
                    <span
                      className={`text-xs font-medium flex items-center gap-1 ${
                        suggestion.score >= 70 ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      {suggestion.score >= 70 ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      Sugestão {suggestion.score}% confiança
                    </span>
                  )}
                </div>

                {/* Low confidence alert */}
                {showReviewAlert && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      Não temos certeza sobre a classificação desta transação. Por favor, confirme se é pessoal (PF) ou empresarial (PJ).
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setManualPfPj(true); setFormData((f) => ({ ...f, pfpj: "PJ", pfpj_score: 100 })); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-all"
                    style={formData.pfpj === "PJ"
                      ? { background: "#0E3B2E", borderColor: "#0E3B2E", color: "#F4EFE6" }
                      : { background: "#EBE4D6", borderColor: "rgba(20,18,15,0.13)", color: "rgba(0,21,41,0.55)" }}
                  >
                    <Building2 className="w-4 h-4" />
                    Empresa
                  </button>
                  <button
                    type="button"
                    onClick={() => { setManualPfPj(true); setFormData((f) => ({ ...f, pfpj: "PF", pfpj_score: 100 })); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-all"
                    style={formData.pfpj === "PF"
                      ? { background: "#7FD19F", borderColor: "#1F5A3A", color: "#0E3B2E" }
                      : { background: "#EBE4D6", borderColor: "rgba(20,18,15,0.13)", color: "rgba(0,21,41,0.55)" }}
                  >
                    <User className="w-4 h-4" />
                    Pessoal
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-[rgba(20,18,15,0.13)] rounded-xl text-sm font-semibold text-[rgba(0,21,41,0.6)] hover:bg-[#F4EFE6] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#7FD19F] hover:bg-[#1F5A3A] text-[#0E3B2E] rounded-xl text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Salvando..." : "Salvar Transação"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
