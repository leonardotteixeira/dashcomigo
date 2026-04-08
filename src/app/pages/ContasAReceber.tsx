import { useState } from "react";
import { Plus, Trash2, CheckCircle, Clock, AlertCircle, Crown, Zap } from "lucide-react";
import { useReceivables, CATEGORIAS_RECEIVABLES, Receivable } from "../contexts/ReceivablesContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { format, isPast, isToday, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PremiumPageLayout } from "../components/PremiumPageLayout";
import { colors } from "../../utils/designTokens";

export function ContasAReceber() {
  const {
    receivables,
    loading,
    addReceivable,
    updateReceivable,
    deleteReceivable,
    getProximasAReceber,
    getLimitStatus,
    canAddReceivable,
  } = useReceivables();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtro, setFiltro] = useState<"todas" | "pendente" | "recebido">("todas");

  const [formDescricao, setFormDescricao] = useState("");
  const [formValor, setFormValor] = useState("");
  const [formCategoria, setFormCategoria] = useState("");
  const [formVencimento, setFormVencimento] = useState("");
  const [formRecorrente, setFormRecorrente] = useState(false);
  const [formFrequencia, setFormFrequencia] = useState<"mensal" | "anual" | "">("");
  const [formAnotacoes, setFormAnotacoes] = useState("");

  const limitStatus = getLimitStatus();
  const navigate = useNavigate();
  const proximasAReceber = getProximasAReceber(7);

  const receivablesFiltradas = filtro === "todas"
    ? receivables
    : receivables.filter((r) => r.status === filtro);

  const totalPendente = receivables
    .filter((r) => r.status === "pendente")
    .reduce((sum, r) => sum + r.valor, 0);

  const totalRecebido = receivables
    .filter((r) => r.status === "recebido")
    .reduce((sum, r) => sum + r.valor, 0);

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  function resetForm() {
    setFormDescricao("");
    setFormValor("");
    setFormCategoria("");
    setFormVencimento("");
    setFormRecorrente(false);
    setFormFrequencia("");
    setFormAnotacoes("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formDescricao || !formValor || !formCategoria || !formVencimento) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if (!canAddReceivable()) {
      toast.error("Limite atingido", { description: "Faça upgrade para PRO para adicionar mais contas." });
      return;
    }
    try {
      await addReceivable({
        descricao: formDescricao,
        valor: parseFloat(formValor),
        categoria: formCategoria,
        dataVencimento: formVencimento,
        status: "pendente",
        ehRecorrente: formRecorrente,
        frequenciaRecorrencia: formRecorrente && formFrequencia ? formFrequencia as "mensal" | "anual" : undefined,
        anotacoes: formAnotacoes || undefined,
      });
      toast.success("Conta adicionada!", { description: `${formDescricao} — ${fmt(parseFloat(formValor))}` });
      resetForm();
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("Erro ao adicionar conta", { description: error?.message || "Tente novamente" });
    }
  }

  async function handleMarcarRecebido(receivable: Receivable) {
    try {
      await updateReceivable(receivable.id, {
        status: "recebido",
        dataRecebimento: new Date().toISOString().split("T")[0],
      });
      toast.success("Marcada como recebida! ✅");
    } catch {
      toast.error("Erro ao atualizar conta");
    }
  }

  async function handleMarcarPendente(receivable: Receivable) {
    try {
      await updateReceivable(receivable.id, { status: "pendente", dataRecebimento: undefined });
      toast.info("Marcada como pendente");
    } catch {
      toast.error("Erro ao atualizar conta");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteReceivable(id);
      toast.success("Conta removida");
    } catch {
      toast.error("Erro ao remover conta");
    }
  }

  function getVencimentoLabel(dataVencimento: string) {
    const data = new Date(dataVencimento + "T00:00:00");
    if (isToday(data)) return { label: "Vence hoje", color: "text-yellow-600" };
    if (isPast(data)) return { label: "Vencida", color: "text-red-500" };
    const dias = differenceInDays(data, new Date());
    if (dias <= 3) return { label: `${dias}d para vencer`, color: "text-orange-600" };
    if (dias <= 7) return { label: `${dias}d para vencer`, color: "text-yellow-600" };
    return { label: format(data, "dd/MM/yyyy", { locale: ptBR }), color: "text-[rgba(0,21,41,0.5)]" };
  }

  return (
    <PremiumPageLayout
      title="Contas a Receber"
      description="Controle seus recebimentos e vencimentos"
      actions={
        <button
          onClick={() => {
            if (!canAddReceivable()) { toast.error("Limite atingido — faça upgrade para PRO"); return; }
            setDialogOpen(true);
          }}
          style={{ backgroundColor: colors.primary }}
          className="flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nova Conta
        </button>
      }
    >
      <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.1)]">
          <div className="w-11 h-11 bg-[#0066FF]/20 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-[#0066FF]" />
          </div>
          <p className="text-sm text-[rgba(0,21,41,0.6)] mb-1">Total Pendente</p>
          <p className="text-2xl font-bold text-[#0066FF]">{fmt(totalPendente)}</p>
          <p className="text-xs text-[rgba(0,21,41,0.5)] mt-2">
            {receivables.filter((r) => r.status === "pendente").length} contas
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.1)]">
          <div className="w-11 h-11 bg-[#28A263]/20 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle className="w-5 h-5 text-[#28A263]" />
          </div>
          <p className="text-sm text-[rgba(0,21,41,0.6)] mb-1">Total Recebido</p>
          <p className="text-2xl font-bold text-[#28A263]">{fmt(totalRecebido)}</p>
          <p className="text-xs text-[rgba(0,21,41,0.5)] mt-2">
            {receivables.filter((r) => r.status === "recebido").length} contas
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.1)]">
          <div className="w-11 h-11 bg-yellow-600/20 rounded-xl flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-sm text-[rgba(0,21,41,0.6)] mb-1">Vencem em 7 dias</p>
          <p className="text-2xl font-bold text-yellow-600">{proximasAReceber.length}</p>
          <p className="text-xs text-[rgba(0,21,41,0.5)] mt-2">
            {fmt(proximasAReceber.reduce((s, r) => s + r.valor, 0))}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {proximasAReceber.length > 0 && (
        <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-200">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-900">{proximasAReceber.length} conta(s) vencem nos próximos 7 dias</h3>
              <div className="space-y-1.5 mt-3">
                {proximasAReceber.map((r) => (
                  <p key={r.id} className="text-sm text-yellow-700">
                    {r.descricao} — {fmt(r.valor)} — Vence {format(new Date(r.dataVencimento + "T00:00:00"), "dd/MM", { locale: ptBR })}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {(["todas", "pendente", "recebido"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filtro === f
                ? "text-white"
                : "bg-[#F8F9FA] text-[rgba(0,21,41,0.6)] hover:bg-[#F5F7FA] border border-[rgba(0,0,0,0.1)]"
            }`}
            style={filtro === f ? { backgroundColor: colors.primary } : undefined}
          >
            {f === "todas" ? "Todas" : f === "pendente" ? "Pendentes" : "Recebidas"}
          </button>
        ))}
      </div>

      {/* Receivables List */}
      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.05)]">
          <h3 className="font-bold text-lg text-[#001529]">Contas a Receber</h3>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[rgba(0,21,41,0.6)]">Carregando...</div>
        ) : receivablesFiltradas.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Clock className="w-10 h-10 text-[rgba(0,21,41,0.3)] mx-auto mb-3" />
            <p className="text-[rgba(0,21,41,0.6)]">
              {filtro === "todas" ? "Nenhuma conta cadastrada ainda." : `Nenhuma conta ${filtro === "pendente" ? "pendente" : "recebida"}.`}
            </p>
            {filtro === "todas" && (
              <button onClick={() => setDialogOpen(true)} className="mt-3 text-[#28A263] text-sm font-medium hover:underline">
                Adicionar primeira conta
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[rgba(0,0,0,0.05)]">
            {receivablesFiltradas.map((receivable) => {
              const venc = getVencimentoLabel(receivable.dataVencimento);
              return (
                <div
                  key={receivable.id}
                  className={`px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#F8F9FA]/50 transition-colors ${
                    receivable.status === "recebido" ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      receivable.status === "recebido" ? "bg-[#28A263]/20" : "bg-[#0066FF]/20"
                    }`}>
                      {receivable.status === "recebido"
                        ? <CheckCircle className="w-5 h-5 text-[#28A263]" />
                        : <Clock className="w-5 h-5 text-[#0066FF]" />
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[#001529] font-medium">{receivable.descricao}</p>
                      <div className="flex items-center gap-2 flex-wrap text-xs text-[rgba(0,21,41,0.5)] mt-1">
                        <span>{receivable.categoria}</span>
                        <span>•</span>
                        <span className={venc.color}>{venc.label}</span>
                        {receivable.ehRecorrente && (
                          <>
                            <span>•</span>
                            <span>🔄 {receivable.frequenciaRecorrencia}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`font-bold text-lg ${receivable.status === "recebido" ? "text-[#28A263]" : "text-[#0066FF]"}`}>
                      {fmt(receivable.valor)}
                    </span>

                    {receivable.status === "pendente" ? (
                      <button
                        onClick={() => handleMarcarRecebido(receivable)}
                        className="text-xs bg-[#28A263] hover:bg-[#1f7d4a] text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        Marcar Recebido
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarcarPendente(receivable)}
                        className="text-xs bg-[#F8F9FA] hover:bg-[#F5F7FA] text-[rgba(0,21,41,0.6)] px-3 py-1.5 rounded-lg font-medium transition-colors border border-[rgba(0,0,0,0.1)]"
                      >
                        Desfazer
                      </button>
                    )}

                    <button onClick={() => handleDelete(receivable.id)} className="text-[rgba(0,21,41,0.5)] hover:text-[#FF4F3D] transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Free Plan Limit */}
      {limitStatus.limit !== Infinity && (
        <div className={`p-6 rounded-2xl border ${
          limitStatus.percentage >= 100
            ? "bg-red-50 border-red-200"
            : limitStatus.percentage >= 80
            ? "bg-yellow-50 border-yellow-200"
            : "bg-[#F8F9FA] border-[rgba(0,0,0,0.1)]"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-[#001529]">Recebimentos este mês</h3>
              <p className="text-xs text-[rgba(0,21,41,0.5)] mt-0.5">Reseta todo dia 1</p>
            </div>
            <span className={`text-lg font-bold ${
              limitStatus.percentage >= 100 ? "text-red-500" :
              limitStatus.percentage >= 80 ? "text-yellow-600" : "text-[#001529]"
            }`}>
              {limitStatus.used}/{limitStatus.limit}
            </span>
          </div>
          <div className="w-full bg-[#E8E8E8] rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all ${
                limitStatus.percentage >= 100 ? "bg-red-500" :
                limitStatus.percentage >= 80 ? "bg-yellow-500" : "bg-[#28A263]"
              }`}
              style={{ width: `${Math.min(limitStatus.percentage, 100)}%` }}
            />
          </div>
          {limitStatus.percentage >= 80 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-[rgba(0,21,41,0.6)]">
                {limitStatus.percentage >= 100
                  ? "Limite atingido! Faça upgrade para continuar."
                  : `Restam ${limitStatus.limit - limitStatus.used} contas este mês.`}
              </p>
              <button
                onClick={() => navigate("/checkout")}
                className="flex items-center gap-2 text-sm bg-[#28A263] hover:bg-[#1f7d4a] text-white font-bold px-4 py-2 rounded-lg transition-colors"
              >
                <Crown className="w-4 h-4" />
                Upgrade PRO
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="p-6 border-b border-[rgba(0,0,0,0.05)]">
              <h2 className="text-[#001529] font-bold text-xl">Nova Conta a Receber</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[rgba(0,21,41,0.6)] text-sm mb-1 block">Descrição *</label>
                  <input
                    type="text"
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    placeholder="Ex: Serviço de consultoria"
                    required
                    className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-xl px-4 py-2.5 text-[#001529] placeholder-[rgba(0,21,41,0.4)] focus:outline-none focus:border-[#28A263]/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[rgba(0,21,41,0.6)] text-sm mb-1 block">Valor (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formValor}
                      onChange={(e) => setFormValor(e.target.value)}
                      placeholder="0,00"
                      required
                      className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-xl px-4 py-2.5 text-[#001529] placeholder-[rgba(0,21,41,0.4)] focus:outline-none focus:border-[#28A263]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[rgba(0,21,41,0.6)] text-sm mb-1 block">Vencimento *</label>
                    <input
                      type="date"
                      value={formVencimento}
                      onChange={(e) => setFormVencimento(e.target.value)}
                      required
                      className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-xl px-4 py-2.5 text-[#001529] focus:outline-none focus:border-[#28A263]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[rgba(0,21,41,0.6)] text-sm mb-1 block">Categoria *</label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value)}
                    required
                    className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-xl px-4 py-2.5 text-[#001529] focus:outline-none focus:border-[#28A263]/50"
                  >
                    <option value="">Selecione...</option>
                    {CATEGORIAS_RECEIVABLES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="recorrente"
                    checked={formRecorrente}
                    onChange={(e) => setFormRecorrente(e.target.checked)}
                    className="w-4 h-4 accent-[#28A263]"
                  />
                  <label htmlFor="recorrente" className="text-[rgba(0,21,41,0.6)] text-sm cursor-pointer">
                    Recebimento recorrente
                  </label>
                </div>

                {formRecorrente && (
                  <div>
                    <label className="text-[rgba(0,21,41,0.6)] text-sm mb-1 block">Frequência</label>
                    <select
                      value={formFrequencia}
                      onChange={(e) => setFormFrequencia(e.target.value as "mensal" | "anual")}
                      className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-xl px-4 py-2.5 text-[#001529] focus:outline-none focus:border-[#28A263]/50"
                    >
                      <option value="">Selecione...</option>
                      <option value="mensal">Mensal</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-[rgba(0,21,41,0.6)] text-sm mb-1 block">Anotações (opcional)</label>
                  <textarea
                    value={formAnotacoes}
                    onChange={(e) => setFormAnotacoes(e.target.value)}
                    placeholder="Observações..."
                    rows={2}
                    className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-xl px-4 py-2.5 text-[#001529] placeholder-[rgba(0,21,41,0.4)] focus:outline-none focus:border-[#28A263]/50 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { resetForm(); setDialogOpen(false); }}
                    className="flex-1 bg-[#F8F9FA] hover:bg-[#F5F7FA] text-[#001529] px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#28A263] hover:bg-[#1f7a4a] text-white font-semibold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </PremiumPageLayout>
  );
}
