import {
  Plus, AlertCircle, CheckCircle, Clock, Calendar,
  Filter, Download, Loader2, X, Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "../components/PageHeader";
import { usePayables, CATEGORIAS_PAYABLES, type Payable } from "../contexts/PayablesContext";
import { exportToXlsx } from "../../utils/exportXlsx";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtBRL = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const fmtDate = (iso?: string) => {
  if (!iso) return "—";
  const datePart = iso.split("T")[0].split(" ")[0];
  const parts = datePart.split("-");
  if (parts.length < 3) return iso;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
};

function getDaysUntilDue(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function computeStatus(payable: Payable): "pendente" | "pago" | "vencido" {
  if (payable.status === "pago") return "pago";
  const days = getDaysUntilDue(payable.dataVencimento);
  if (days < 0) return "vencido";
  return "pendente";
}

const STATUS_CFG = {
  pendente: {
    label: "Pendente",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: Clock,
  },
  pago: {
    label: "Pago",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: CheckCircle,
  },
  vencido: {
    label: "Vencido",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: AlertCircle,
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContasAPagar() {
  const { payables, loading, addPayable, updatePayable, deletePayable } = usePayables();

  const [filter, setFilter] = useState<"all" | "pendente" | "vencido" | "pago">("all");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    categoria: "",
    dataVencimento: "",
    ehRecorrente: false,
    frequenciaRecorrencia: "mensal" as "mensal" | "anual",
    anotacoes: "",
  });

  // ─── Derived data ───────────────────────────────────────────────────────────

  const withStatus = payables.map((p) => ({ ...p, computedStatus: computeStatus(p) }));

  const filtered = withStatus.filter((p) => {
    if (filter === "all") return true;
    return p.computedStatus === filter;
  });

  const totalPending = withStatus
    .filter((p) => p.computedStatus === "pendente")
    .reduce((s, p) => s + p.valor, 0);
  const totalOverdue = withStatus
    .filter((p) => p.computedStatus === "vencido")
    .reduce((s, p) => s + p.valor, 0);
  const totalPaid = withStatus
    .filter((p) => p.computedStatus === "pago")
    .reduce((s, p) => s + p.valor, 0);

  const pendingCount = withStatus.filter((p) => p.computedStatus === "pendente").length;
  const overdueCount = withStatus.filter((p) => p.computedStatus === "vencido").length;
  const paidCount = withStatus.filter((p) => p.computedStatus === "pago").length;

  // ─── Actions ────────────────────────────────────────────────────────────────

  const handlePayNow = async (id: string) => {
    if (!confirm("Confirmar pagamento desta conta?")) return;
    setPayingId(id);
    try {
      const today = new Date().toISOString().split("T")[0];
      await updatePayable(id, { status: "pago", dataPagamento: today });
      toast.success("Conta marcada como paga!");
    } catch {
      toast.error("Erro ao registrar pagamento.");
    } finally {
      setPayingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta conta?")) return;
    try {
      await deletePayable(id);
      toast.success("Conta excluída.");
    } catch {
      toast.error("Erro ao excluir conta.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valor = parseFloat(form.valor);
    if (!valor || valor <= 0) { toast.error("Informe um valor válido."); return; }
    if (!form.categoria) { toast.error("Selecione uma categoria."); return; }
    if (!form.dataVencimento) { toast.error("Informe a data de vencimento."); return; }

    setSaving(true);
    try {
      await addPayable({
        descricao: form.descricao,
        valor,
        categoria: form.categoria,
        dataVencimento: form.dataVencimento,
        status: "pendente",
        ehRecorrente: form.ehRecorrente,
        frequenciaRecorrencia: form.ehRecorrente ? form.frequenciaRecorrencia : undefined,
        anotacoes: form.anotacoes || undefined,
      });
      toast.success("Conta adicionada!");
      setShowModal(false);
      setForm({ descricao: "", valor: "", categoria: "", dataVencimento: "", ehRecorrente: false, frequenciaRecorrencia: "mensal", anotacoes: "" });
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao salvar conta.");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const rows = filtered.map((p) => ({
      Descrição: p.descricao,
      Categoria: p.categoria,
      Valor: p.valor,
      Vencimento: fmtDate(p.dataVencimento),
      Status: STATUS_CFG[p.computedStatus].label,
      "Data Pagamento": p.dataPagamento ? fmtDate(p.dataPagamento) : "",
      Recorrente: p.ehRecorrente ? "Sim" : "Não",
      Observações: p.anotacoes ?? "",
    }));
    exportToXlsx(rows, "contas-a-pagar");
    toast.success("Arquivo exportado!");
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contas a Pagar"
        description="Gerencie e acompanhe suas obrigações financeiras"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#28A263] hover:bg-[#20915a] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Conta
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "A Pagar", value: fmtBRL(totalPending), count: pendingCount, sub: "contas pendentes", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
          { label: "Vencidas", value: fmtBRL(totalOverdue), count: overdueCount, sub: "contas atrasadas", color: "text-red-600", bg: "bg-red-50", icon: AlertCircle },
          { label: "Pagas (mês)", value: fmtBRL(totalPaid), count: paidCount, sub: "contas quitadas", color: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
        ].map(({ label, value, count, sub, color, bg, icon: Icon }) => (
          <div key={label} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="text-xs font-semibold text-[#001529]/60 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-2xl font-bold text-[#001529] mb-1">{value}</p>
            <p className="text-xs text-[#001529]/50">{count} {sub}</p>
          </div>
        ))}
      </div>

      {/* Filters + Export */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#001529]/50" />
          <div className="flex gap-2">
            {(
              [
                { key: "all", label: "Todas", active: "bg-[#003a6d] text-white" },
                { key: "pendente", label: "Pendentes", active: "bg-amber-500 text-white" },
                { key: "vencido", label: "Vencidas", active: "bg-red-500 text-white" },
                { key: "pago", label: "Pagas", active: "bg-green-500 text-white" },
              ] as const
            ).map(({ key, label, active }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  filter === key ? active : "bg-[#F5F7FA] text-[#001529] hover:bg-[#E5E7EB]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 border border-[#E5E7EB] rounded-lg hover:bg-[#F5F7FA] transition-colors text-xs font-semibold text-[#001529]"
        >
          <Download className="w-3.5 h-3.5" />
          Exportar
        </button>
      </div>

      {/* Bills List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#28A263]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 text-center">
          <p className="text-[#001529]/50 text-sm">
            {payables.length === 0
              ? "Nenhuma conta cadastrada. Clique em \"Nova Conta\" para começar."
              : "Nenhuma conta com este filtro."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((bill) => {
            const cfg = STATUS_CFG[bill.computedStatus];
            const StatusIcon = cfg.icon;
            const daysUntil = getDaysUntilDue(bill.dataVencimento);

            return (
              <div
                key={bill.id}
                className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <StatusIcon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-[#001529]">{bill.descricao}</h3>
                        {bill.ehRecorrente && (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#003a6d]/10 text-[#003a6d]">
                            Recorrente
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#001529]/60 mb-2">{bill.categoria}</p>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#001529]/40" />
                        <span className="text-xs text-[#001529]/70">
                          Vencimento: {fmtDate(bill.dataVencimento)}
                        </span>
                        {bill.computedStatus === "pendente" && daysUntil <= 5 && daysUntil > 0 && (
                          <span className="text-xs text-amber-600 font-semibold">
                            (em {daysUntil} {daysUntil === 1 ? "dia" : "dias"})
                          </span>
                        )}
                        {bill.computedStatus === "pendente" && daysUntil === 0 && (
                          <span className="text-xs text-amber-600 font-semibold">(vence hoje)</span>
                        )}
                        {bill.computedStatus === "pago" && bill.dataPagamento && (
                          <span className="text-xs text-green-600">
                            • Pago em {fmtDate(bill.dataPagamento)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-[#001529] mb-2">{fmtBRL(bill.valor)}</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                      {cfg.label}
                    </span>
                    {bill.computedStatus !== "pago" && (
                      <button
                        onClick={() => handlePayNow(bill.id)}
                        disabled={payingId === bill.id}
                        className="mt-2 flex items-center gap-1 w-full justify-center bg-[#003a6d] hover:bg-[#002a50] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-60"
                      >
                        {payingId === bill.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        Pagar Agora
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(bill.id)}
                      className="mt-1 opacity-0 group-hover:opacity-100 p-1 text-[#001529]/30 hover:text-red-500 transition-all block ml-auto"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Nova Conta Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-bold text-[#001529]">Nova Conta a Pagar</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-[#001529]/40 hover:text-[#001529] rounded-lg hover:bg-[#F5F7FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#001529] mb-2">Descrição</label>
                <input
                  type="text"
                  value={form.descricao}
                  onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                  placeholder="Ex: Aluguel Escritório"
                  className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm text-[#001529] placeholder:text-[#001529]/40 outline-none focus:border-[#28A263] focus:ring-2 focus:ring-[#28A263]/15 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#001529] mb-2">Valor (R$)</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.valor}
                    onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                    placeholder="0,00"
                    className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm text-[#001529] outline-none focus:border-[#28A263] focus:ring-2 focus:ring-[#28A263]/15 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#001529] mb-2">Vencimento</label>
                  <input
                    type="date"
                    value={form.dataVencimento}
                    onChange={(e) => setForm((f) => ({ ...f, dataVencimento: e.target.value }))}
                    className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm text-[#001529] outline-none focus:border-[#28A263] focus:ring-2 focus:ring-[#28A263]/15 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#001529] mb-2">Categoria</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                  className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm text-[#001529] outline-none focus:border-[#28A263] bg-white transition-all"
                  required
                >
                  <option value="">Selecionar...</option>
                  {CATEGORIAS_PAYABLES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#001529] mb-2">Observações</label>
                <textarea
                  value={form.anotacoes}
                  onChange={(e) => setForm((f) => ({ ...f, anotacoes: e.target.value }))}
                  placeholder="Informações adicionais..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#001529] placeholder:text-[#001529]/40 outline-none focus:border-[#28A263] focus:ring-2 focus:ring-[#28A263]/15 transition-all resize-none"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.ehRecorrente}
                  onChange={(e) => setForm((f) => ({ ...f, ehRecorrente: e.target.checked }))}
                  className="w-4 h-4 accent-[#28A263]"
                />
                <span className="text-sm font-medium text-[#001529]">Conta recorrente</span>
              </label>

              {form.ehRecorrente && (
                <div>
                  <label className="block text-sm font-semibold text-[#001529] mb-2">Frequência</label>
                  <select
                    value={form.frequenciaRecorrencia}
                    onChange={(e) => setForm((f) => ({ ...f, frequenciaRecorrencia: e.target.value as "mensal" | "anual" }))}
                    className="w-full h-11 px-4 border border-[#E5E7EB] rounded-xl text-sm text-[#001529] outline-none focus:border-[#28A263] bg-white"
                  >
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#001529]/60 hover:bg-[#F5F7FA] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#28A263] hover:bg-[#20915a] text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Salvando..." : "Salvar Conta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
