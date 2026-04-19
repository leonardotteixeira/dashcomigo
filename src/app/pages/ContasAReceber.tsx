import {
  Plus,
  CheckCircle,
  Clock,
  Calendar,
  Filter,
  Download,
  TrendingUp,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { KPICard } from "../components/KPICard";
import { PageHeader } from "../components/PageHeader";
import { useReceivables, CATEGORIAS_RECEIVABLES } from "../contexts/ReceivablesContext";
import { exportToXlsx } from "../../utils/exportXlsx";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { LimitBanner } from "../components/LimitBanner";
import { LimitReachedModal } from "../components/LimitReachedModal";
import { isLimitReached } from "../../utils/featureAccessService";

type FilterType = "all" | "pendente" | "recebido" | "vencido";

function computeStatus(item: { status: "pendente" | "recebido"; dataVencimento: string | undefined | null }): "pendente" | "recebido" | "vencido" {
  if (item.status === "recebido") return "recebido";

  // Validate date
  if (!item.dataVencimento) {
    console.warn("Missing dataVencimento for item:", item);
    return "pendente";
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const venc = new Date(item.dataVencimento + "T00:00:00");

    // Check if date is valid
    if (isNaN(venc.getTime())) {
      console.warn("Invalid dataVencimento:", item.dataVencimento);
      return "pendente";
    }

    if (venc < today) return "vencido";
    return "pendente";
  } catch (err) {
    console.warn("Error computing status for:", item, err);
    return "pendente";
  }
}

const STATUS_INFO = {
  pendente: {
    label: "A Receber",
    textClass: "text-yellow-600",
    bgClass: "bg-yellow-50",
    borderClass: "border-yellow-200",
    Icon: Clock,
  },
  recebido: {
    label: "Recebido",
    textClass: "text-green-600",
    bgClass: "bg-green-50",
    borderClass: "border-green-200",
    Icon: CheckCircle,
  },
  vencido: {
    label: "Vencido",
    textClass: "text-red-600",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
    Icon: AlertTriangle,
  },
} as const;

const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Safely format a date string, return "Sem data" if invalid */
const fmtDate = (s: string | undefined | null): string => {
  if (!s) return "Sem data";
  try {
    const d = new Date(s + "T00:00:00");
    if (isNaN(d.getTime())) return "Sem data";
    return d.toLocaleDateString("pt-BR");
  } catch {
    console.warn("Invalid date:", s);
    return "Sem data";
  }
};

export function ContasAReceber() {
  const {
    receivables,
    loading,
    addReceivable,
    updateReceivable,
    deleteReceivable,
    canAddReceivable,
  } = useReceivables();
  const { user } = useAuth();

  const [filter, setFilter] = useState<FilterType>("all");
  const [receiving, setReceiving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    categoria: CATEGORIAS_RECEIVABLES[0],
    dataVencimento: new Date().toISOString().slice(0, 10),
    ehRecorrente: false,
    frequenciaRecorrencia: "mensal" as "mensal" | "anual",
    anotacoes: "",
  });

  // ─── Feature gating ─────────────────────────────────────────────────────────
  const thisMonthCount = (() => {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const filtered = receivables.filter((r) => {
      if (!(r as any).createdAt) return false;
      try {
        const d = new Date((r as any).createdAt);
        if (isNaN(d.getTime())) return false;
        return d.toISOString().substring(0, 7) === currentMonth;
      } catch {
        return false;
      }
    });
    return filtered.length > 0 ? filtered.length : receivables.length;
  })();

  // Computed status for every item + filter invalid dates
  const enriched = receivables
    .filter((r) => {
      // Skip records with invalid dates
      if (!r.dataVencimento) {
        console.warn("Skipping record with missing dataVencimento:", r);
        return false;
      }
      try {
        const d = new Date(r.dataVencimento + "T00:00:00");
        return !isNaN(d.getTime());
      } catch {
        console.warn("Skipping record with invalid dataVencimento:", r);
        return false;
      }
    })
    .map((r) => ({
      ...r,
      computedStatus: computeStatus(r),
    }));

  const filtered = enriched.filter((r) => {
    if (filter === "all") return true;
    return r.computedStatus === filter;
  });

  const totalPendente = enriched
    .filter((r) => r.computedStatus === "pendente")
    .reduce((s, r) => s + r.valor, 0);

  const totalVencido = enriched
    .filter((r) => r.computedStatus === "vencido")
    .reduce((s, r) => s + r.valor, 0);

  const totalRecebido = enriched
    .filter((r) => r.computedStatus === "recebido")
    .reduce((s, r) => s + r.valor, 0);

  const grandTotal = totalPendente + totalVencido + totalRecebido;
  const taxaRecebimento = grandTotal > 0 ? Math.round((totalRecebido / grandTotal) * 100) : 0;

  // Mark as received
  async function handleReceiver(id: string) {
    setReceiving(id);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await updateReceivable(id, { status: "recebido", dataRecebimento: today });
      toast.success("Conta marcada como recebida!");
    } catch {
      toast.error("Erro ao atualizar conta");
    }
    setReceiving(null);
  }

  // Delete
  async function handleDelete(id: string) {
    if (!confirm("Excluir esta conta a receber?")) return;
    setDeleting(id);
    try {
      await deleteReceivable(id);
      toast.success("Conta excluída");
    } catch {
      toast.error("Erro ao excluir conta");
    }
    setDeleting(null);
  }

  // Export xlsx
  function handleExport() {
    const rows = enriched.map((r) => ({
      Descrição: r.descricao,
      Categoria: r.categoria,
      Valor: r.valor,
      Vencimento: fmtDate(r.dataVencimento),
      Status: STATUS_INFO[r.computedStatus].label,
      "Data Recebimento": r.dataRecebimento ? fmtDate(r.dataRecebimento) : "",
      Anotações: r.anotacoes ?? "",
    }));
    exportToXlsx(rows, "contas-a-receber");
    toast.success("Exportado com sucesso!");
  }

  // Add new receivable
  async function handleSave() {
    if (!form.descricao.trim()) { toast.error("Informe a descrição"); return; }
    const valor = parseFloat(form.valor.replace(",", "."));
    if (!valor || valor <= 0) { toast.error("Informe um valor válido"); return; }
    if (!form.dataVencimento) { toast.error("Informe a data de vencimento"); return; }
    if (!canAddReceivable()) { toast.error("Limite de contas a receber atingido. Faça upgrade para PRO."); return; }

    setSaving(true);
    try {
      await addReceivable({
        descricao: form.descricao.trim(),
        valor,
        categoria: form.categoria,
        dataVencimento: form.dataVencimento,
        status: "pendente",
        ehRecorrente: form.ehRecorrente,
        frequenciaRecorrencia: form.ehRecorrente ? form.frequenciaRecorrencia : undefined,
        anotacoes: form.anotacoes.trim() || undefined,
      });
      toast.success("Conta a receber adicionada!");
      setShowModal(false);
      setForm({
        descricao: "",
        valor: "",
        categoria: CATEGORIAS_RECEIVABLES[0],
        dataVencimento: new Date().toISOString().slice(0, 10),
        ehRecorrente: false,
        frequenciaRecorrencia: "mensal",
        anotacoes: "",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    }
    setSaving(false);
  }

  const countByFilter = (f: FilterType) => {
    if (f === "all") return enriched.length;
    return enriched.filter((r) => r.computedStatus === f).length;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contas a Receber"
        description="Acompanhe seus recebíveis e pagamentos de clientes"
        actions={
          <button
            onClick={() => {
              if (isLimitReached("accounts_receivable", thisMonthCount, user?.plan ?? "free")) {
                setShowLimitModal(true);
              } else {
                setShowModal(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#0E3B2E" }}
          >
            <Plus className="w-4 h-4" />
            Nova Conta
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          label="A Receber"
          value={fmtBRL(totalPendente + totalVencido)}
          icon={Clock}
          color="blue"
        />
        <KPICard
          label="Recebido (total)"
          value={fmtBRL(totalRecebido)}
          icon={CheckCircle}
          color="green"
        />
        <KPICard
          label="Taxa de Recebimento"
          value={`${taxaRecebimento}%`}
          icon={TrendingUp}
          color={taxaRecebimento >= 70 ? "green" : taxaRecebimento >= 40 ? "orange" : "red"}
        />
      </div>

      {/* Filters + Export */}
      <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[rgba(0,21,41,0.4)]" />
            {(["all", "pendente", "vencido", "recebido"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-xl transition-all ${
                  filter === f
                    ? "bg-[#0E3B2E] text-white shadow-sm"
                    : "bg-[#F4EFE6] text-[#0E3B2E] hover:bg-[rgba(20,18,15,0.13)]"
                }`}
              >
                {f === "all" ? "Todas" : STATUS_INFO[f].label}
                {countByFilter(f) > 0 && (
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    filter === f ? "bg-white/20 text-white" : "bg-[rgba(20,18,15,0.13)] text-[rgba(0,21,41,0.6)]"
                  }`}>
                    {countByFilter(f)}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#0E3B2E] hover:bg-[#F4EFE6] transition-all border border-[rgba(20,18,15,0.13)]"
          >
            <Download className="w-4 h-4" />
            Exportar XLSX
          </button>
        </div>
      </div>

      <LimitBanner feature="accounts_receivable" usage={thisMonthCount} plan={user?.plan ?? "free"} className="mb-4" />

      {/* List */}
      {loading ? (
        <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-16 text-center shadow-sm">
          <p className="text-[rgba(0,21,41,0.5)] text-sm">Carregando...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-16 text-center shadow-sm">
          <p className="text-[rgba(0,21,41,0.5)] text-sm font-medium">
            {receivables.length === 0
              ? "Nenhuma conta a receber cadastrada. Clique em Nova Conta para começar."
              : "Nenhuma conta encontrada para o filtro selecionado."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const info = STATUS_INFO[item.computedStatus];
            const StatusIcon = info.Icon;
            const isReceiving = receiving === item.id;
            const isDeleting = deleting === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl p-5 hover:shadow-md transition-all group ${info.borderClass}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${info.bgClass}`}>
                      <StatusIcon className={`w-5 h-5 ${info.textClass}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="font-bold text-[#0E3B2E] truncate">{item.descricao}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${info.bgClass} ${info.textClass}`}>
                          {info.label}
                        </span>
                        {item.ehRecorrente && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-purple-50 text-purple-600">
                            Recorrente · {item.frequenciaRecorrencia}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[rgba(0,21,41,0.5)] font-medium">{item.categoria}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <div className="flex items-center gap-1 text-xs text-[rgba(0,21,41,0.5)]">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.computedStatus === "recebido" && item.dataRecebimento
                            ? `Recebido em ${fmtDate(item.dataRecebimento)}`
                            : `Venc. ${fmtDate(item.dataVencimento)}`}
                        </div>
                        {item.anotacoes && (
                          <span className="text-xs text-[rgba(0,21,41,0.4)] italic truncate max-w-xs">
                            {item.anotacoes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{fmtBRL(item.valor)}</p>
                    </div>

                    {item.computedStatus !== "recebido" && (
                      <button
                        onClick={() => handleReceiver(item.id)}
                        disabled={isReceiving}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 transition-all"
                      >
                        {isReceiving ? "..." : "Marcar recebido"}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[rgba(0,21,41,0.3)] hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <LimitReachedModal
        open={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        feature="accounts_receivable"
        plan={user?.plan ?? "free"}
        usage={thisMonthCount}
      />

      {/* Nova Conta Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-[rgba(20,18,15,0.13)]">
              <h2 className="text-lg font-bold text-[#0E3B2E]">Nova Conta a Receber</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-[#F4EFE6] transition-colors"
              >
                <X className="w-4 h-4 text-[rgba(0,21,41,0.5)]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0E3B2E] mb-1.5">Descrição *</label>
                <input
                  type="text"
                  placeholder="Ex: Projeto Website — Cliente X"
                  value={form.descricao}
                  onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-[rgba(20,18,15,0.13)] focus:border-[#0E3B2E] focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0E3B2E] mb-1.5">Valor (R$) *</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0,00"
                    value={form.valor}
                    onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-[rgba(20,18,15,0.13)] focus:border-[#0E3B2E] focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0E3B2E] mb-1.5">Vencimento *</label>
                  <input
                    type="date"
                    value={form.dataVencimento}
                    onChange={(e) => setForm((f) => ({ ...f, dataVencimento: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-[rgba(20,18,15,0.13)] focus:border-[#0E3B2E] focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0E3B2E] mb-1.5">Categoria</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-[rgba(20,18,15,0.13)] focus:border-[#0E3B2E] focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/10 bg-white"
                >
                  {CATEGORIAS_RECEIVABLES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="recorrente"
                  type="checkbox"
                  checked={form.ehRecorrente}
                  onChange={(e) => setForm((f) => ({ ...f, ehRecorrente: e.target.checked }))}
                  className="w-4 h-4 rounded border-[rgba(20,18,15,0.13)] accent-[#0E3B2E]"
                />
                <label htmlFor="recorrente" className="text-sm text-[#0E3B2E] font-medium cursor-pointer">
                  Recorrente
                </label>
                {form.ehRecorrente && (
                  <select
                    value={form.frequenciaRecorrencia}
                    onChange={(e) => setForm((f) => ({ ...f, frequenciaRecorrencia: e.target.value as "mensal" | "anual" }))}
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-[rgba(20,18,15,0.13)] focus:border-[#0E3B2E] focus:outline-none bg-white"
                  >
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0E3B2E] mb-1.5">Anotações</label>
                <textarea
                  rows={2}
                  placeholder="Observações opcionais..."
                  value={form.anotacoes}
                  onChange={(e) => setForm((f) => ({ ...f, anotacoes: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-[rgba(20,18,15,0.13)] focus:border-[#0E3B2E] focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/10 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-[rgba(20,18,15,0.13)] text-[#0E3B2E] hover:bg-[#F4EFE6] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl text-white bg-[#0E3B2E] hover:bg-[#0052CC] disabled:opacity-50 transition-all"
              >
                {saving ? "Salvando..." : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
