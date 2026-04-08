import { useState } from "react";
import { Plus, Trash2, CheckCircle, Clock, AlertCircle, Crown } from "lucide-react";
import { useReceivables, CATEGORIAS_RECEIVABLES, Receivable } from "../contexts/ReceivablesContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { format, isPast, isToday, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#001529]">Contas a Receber</h1>
          <p className="text-[rgba(0,21,41,0.6)] text-sm mt-1">Controle seus recebimentos e vencimentos</p>
        </div>
        <button
          onClick={() => {
            if (!canAddReceivable()) { toast.error("Limite atingido — faça upgrade para PRO"); return; }
            setDialogOpen(true);
          }}
          className="flex items-center gap-2 bg-[#28A263] hover:bg-[#1f7a4a] text-white font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Conta
        </button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-4">
          <p className="text-[rgba(0,21,41,0.6)] text-sm">Total Pendente</p>
          <p className="text-[#0066FF] text-xl font-bold mt-1">{fmt(totalPendente)}</p>
          <p className="text-[rgba(0,21,41,0.6)] text-xs mt-1">
            {receivables.filter((r) => r.status === "pendente").length} contas
          </p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-4">
          <p className="text-[rgba(0,21,41,0.6)] text-sm">Total Recebido</p>
          <p className="text-[#28A263] text-xl font-bold mt-1">{fmt(totalRecebido)}</p>
          <p className="text-[rgba(0,21,41,0.6)] text-xs mt-1">
            {receivables.filter((r) => r.status === "recebido").length} contas
          </p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-4">
          <p className="text-[rgba(0,21,41,0.6)] text-sm">Vencem em 7 dias</p>
          <p className="text-yellow-600 text-xl font-bold mt-1">{proximasAReceber.length}</p>
          <p className="text-[rgba(0,21,41,0.6)] text-xs mt-1">
            {fmt(proximasAReceber.reduce((s, r) => s + r.valor, 0))}
          </p>
        </div>
      </div>

      {/* Alertas */}
      {proximasAReceber.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-700 font-semibold text-sm">
              {proximasAReceber.length} conta(s) vencem nos próximos 7 dias
            </span>
          </div>
          {proximasAReceber.map((r) => (
            <p key={r.id} className="text-[rgba(0,21,41,0.6)] text-xs ml-6">
              • {r.descricao} — {fmt(r.valor)} —{" "}
              <span className="text-yellow-700">
                {format(new Date(r.dataVencimento + "T00:00:00"), "dd/MM", { locale: ptBR })}
              </span>
            </p>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        {(["todas", "pendente", "recebido"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              filtro === f
                ? "bg-[#28A263] text-white"
                : "bg-[#F8F9FA] text-[rgba(0,21,41,0.6)] hover:text-[#001529] border border-[rgba(0,0,0,0.1)]"
            }`}
          >
            {f === "todas" ? "Todas" : f === "pendente" ? "Pendentes" : "Recebidas"}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-[rgba(0,21,41,0.6)]">Carregando...</div>
      ) : receivablesFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-2xl">
          <p className="text-[rgba(0,21,41,0.6)]">
            {filtro === "todas" ? "Nenhuma conta cadastrada ainda." : `Nenhuma conta ${filtro === "pendente" ? "pendente" : "recebida"}.`}
          </p>
          {filtro === "todas" && (
            <button onClick={() => setDialogOpen(true)} className="mt-3 text-[#28A263] text-sm hover:underline">
              Adicionar primeira conta
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {receivablesFiltradas.map((receivable) => {
            const venc = getVencimentoLabel(receivable.dataVencimento);
            return (
              <div
                key={receivable.id}
                className={`bg-white border rounded-2xl p-4 flex items-center justify-between gap-4 ${
                  receivable.status === "recebido" ? "border-[rgba(0,0,0,0.1)] opacity-60" : "border-[rgba(0,0,0,0.1)]"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    receivable.status === "recebido" ? "bg-[#28A263]/10" : "bg-blue-100"
                  }`}>
                    {receivable.status === "recebido"
                      ? <CheckCircle className="w-4 h-4 text-[#28A263]" />
                      : <Clock className="w-4 h-4 text-[#0066FF]" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#001529] font-medium truncate">{receivable.descricao}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[rgba(0,21,41,0.6)] text-xs">{receivable.categoria}</span>
                      <span className="text-[rgba(0,21,41,0.6)] text-xs">•</span>
                      <span className={`text-xs ${venc.color}`}>{venc.label}</span>
                      {receivable.ehRecorrente && (
                        <>
                          <span className="text-[rgba(0,21,41,0.6)] text-xs">•</span>
                          <span className="text-blue-600 text-xs">🔄 {receivable.frequenciaRecorrencia}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`font-bold ${receivable.status === "recebido" ? "text-[#28A263]" : "text-[#0066FF]"}`}>
                    {fmt(receivable.valor)}
                  </span>

                  {receivable.status === "pendente" ? (
                    <button
                      onClick={() => handleMarcarRecebido(receivable)}
                      className="text-xs bg-[#28A263]/10 hover:bg-[#28A263]/20 text-[#28A263] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Receber ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarcarPendente(receivable)}
                      className="text-xs bg-[#F8F9FA] hover:bg-[#F5F7FA] text-[rgba(0,21,41,0.6)] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Desfazer
                    </button>
                  )}

                  <button onClick={() => handleDelete(receivable.id)} className="text-[rgba(0,21,41,0.6)] hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Limite FREE */}
      {limitStatus.limit !== Infinity && (
        <div className={`mt-6 rounded-2xl p-4 border ${
          limitStatus.percentage >= 100
            ? "bg-red-50 border-red-300"
            : limitStatus.percentage >= 80
            ? "bg-yellow-50 border-yellow-300"
            : "bg-[#F8F9FA] border-[rgba(0,0,0,0.1)]"
        }`}>
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-sm text-[#001529] font-medium">Recebimentos este mês</span>
              <span className="text-xs text-[rgba(0,21,41,0.6)] ml-2">(reseta todo dia 1)</span>
            </div>
            <span className={`text-sm font-bold ${
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
              <p className="text-xs text-[rgba(0,21,41,0.6)]">
                {limitStatus.percentage >= 100
                  ? "Limite atingido! Faça upgrade para continuar."
                  : `Restam apenas ${limitStatus.limit - limitStatus.used} lançamentos.`}
              </p>
              <button
                onClick={() => navigate("/checkout")}
                className="flex items-center gap-1 text-xs bg-[#28A263] hover:bg-[#1f7a4a] text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                <Crown className="w-3 h-3" />
                Upgrade PRO
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-[#001529] font-bold text-lg mb-4">Nova Conta a Receber</h2>
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
  );
}
