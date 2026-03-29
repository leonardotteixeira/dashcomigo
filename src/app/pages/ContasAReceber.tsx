import { useState } from "react";
import { Plus, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useReceivables, CATEGORIAS_RECEIVABLES, Receivable } from "../contexts/ReceivablesContext";
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
    if (isToday(data)) return { label: "Vence hoje", color: "text-yellow-400" };
    if (isPast(data)) return { label: "Vencida", color: "text-red-400" };
    const dias = differenceInDays(data, new Date());
    if (dias <= 3) return { label: `${dias}d para vencer`, color: "text-orange-400" };
    if (dias <= 7) return { label: `${dias}d para vencer`, color: "text-yellow-400" };
    return { label: format(data, "dd/MM/yyyy", { locale: ptBR }), color: "text-[#A1A1A1]" };
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contas a Receber</h1>
          <p className="text-[#A1A1A1] text-sm mt-1">Controle seus recebimentos e vencimentos</p>
        </div>
        <button
          onClick={() => {
            if (!canAddReceivable()) { toast.error("Limite atingido — faça upgrade para PRO"); return; }
            setDialogOpen(true);
          }}
          className="flex items-center gap-2 bg-[#2DDB81] hover:bg-[#28C974] text-black font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Conta
        </button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1B1B1B] border border-white/5 rounded-2xl p-4">
          <p className="text-[#A1A1A1] text-sm">Total Pendente</p>
          <p className="text-blue-400 text-xl font-bold mt-1">{fmt(totalPendente)}</p>
          <p className="text-[#A1A1A1] text-xs mt-1">
            {receivables.filter((r) => r.status === "pendente").length} contas
          </p>
        </div>
        <div className="bg-[#1B1B1B] border border-white/5 rounded-2xl p-4">
          <p className="text-[#A1A1A1] text-sm">Total Recebido</p>
          <p className="text-[#2DDB81] text-xl font-bold mt-1">{fmt(totalRecebido)}</p>
          <p className="text-[#A1A1A1] text-xs mt-1">
            {receivables.filter((r) => r.status === "recebido").length} contas
          </p>
        </div>
        <div className="bg-[#1B1B1B] border border-white/5 rounded-2xl p-4">
          <p className="text-[#A1A1A1] text-sm">Vencem em 7 dias</p>
          <p className="text-yellow-400 text-xl font-bold mt-1">{proximasAReceber.length}</p>
          <p className="text-[#A1A1A1] text-xs mt-1">
            {fmt(proximasAReceber.reduce((s, r) => s + r.valor, 0))}
          </p>
        </div>
      </div>

      {/* Alertas */}
      {proximasAReceber.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">
              {proximasAReceber.length} conta(s) vencem nos próximos 7 dias
            </span>
          </div>
          {proximasAReceber.map((r) => (
            <p key={r.id} className="text-[#A1A1A1] text-xs ml-6">
              • {r.descricao} — {fmt(r.valor)} —{" "}
              <span className="text-yellow-400">
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
                ? "bg-[#2DDB81] text-black"
                : "bg-[#1B1B1B] text-[#A1A1A1] hover:text-white border border-white/5"
            }`}
          >
            {f === "todas" ? "Todas" : f === "pendente" ? "Pendentes" : "Recebidas"}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-[#A1A1A1]">Carregando...</div>
      ) : receivablesFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-[#1B1B1B] border border-white/5 rounded-2xl">
          <p className="text-[#A1A1A1]">
            {filtro === "todas" ? "Nenhuma conta cadastrada ainda." : `Nenhuma conta ${filtro === "pendente" ? "pendente" : "recebida"}.`}
          </p>
          {filtro === "todas" && (
            <button onClick={() => setDialogOpen(true)} className="mt-3 text-[#2DDB81] text-sm hover:underline">
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
                className={`bg-[#1B1B1B] border rounded-2xl p-4 flex items-center justify-between gap-4 ${
                  receivable.status === "recebido" ? "border-white/5 opacity-60" : "border-white/5"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    receivable.status === "recebido" ? "bg-[#2DDB81]/20" : "bg-blue-500/20"
                  }`}>
                    {receivable.status === "recebido"
                      ? <CheckCircle className="w-4 h-4 text-[#2DDB81]" />
                      : <Clock className="w-4 h-4 text-blue-400" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{receivable.descricao}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#A1A1A1] text-xs">{receivable.categoria}</span>
                      <span className="text-[#A1A1A1] text-xs">•</span>
                      <span className={`text-xs ${venc.color}`}>{venc.label}</span>
                      {receivable.ehRecorrente && (
                        <>
                          <span className="text-[#A1A1A1] text-xs">•</span>
                          <span className="text-blue-400 text-xs">🔄 {receivable.frequenciaRecorrencia}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`font-bold ${receivable.status === "recebido" ? "text-[#2DDB81]" : "text-blue-400"}`}>
                    {fmt(receivable.valor)}
                  </span>

                  {receivable.status === "pendente" ? (
                    <button
                      onClick={() => handleMarcarRecebido(receivable)}
                      className="text-xs bg-[#2DDB81]/20 hover:bg-[#2DDB81]/30 text-[#2DDB81] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Receber ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarcarPendente(receivable)}
                      className="text-xs bg-white/5 hover:bg-white/10 text-[#A1A1A1] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Desfazer
                    </button>
                  )}

                  <button onClick={() => handleDelete(receivable.id)} className="text-[#A1A1A1] hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Limite */}
      {limitStatus.limit !== Infinity && (
        <div className="mt-6 bg-[#1B1B1B] border border-white/5 rounded-2xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#A1A1A1]">Contas cadastradas</span>
            <span className="text-white">{limitStatus.used}/{limitStatus.limit}</span>
          </div>
          <div className="w-full bg-[#2a2a2a] rounded-full h-2">
            <div className="bg-[#2DDB81] h-2 rounded-full transition-all" style={{ width: `${Math.min(limitStatus.percentage, 100)}%` }} />
          </div>
        </div>
      )}

      {/* Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1B1B1B] border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-white font-bold text-lg mb-4">Nova Conta a Receber</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[#A1A1A1] text-sm mb-1 block">Descrição *</label>
                  <input
                    type="text"
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    placeholder="Ex: Serviço de consultoria"
                    required
                    className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#2DDB81]/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#A1A1A1] text-sm mb-1 block">Valor (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formValor}
                      onChange={(e) => setFormValor(e.target.value)}
                      placeholder="0,00"
                      required
                      className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#2DDB81]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[#A1A1A1] text-sm mb-1 block">Vencimento *</label>
                    <input
                      type="date"
                      value={formVencimento}
                      onChange={(e) => setFormVencimento(e.target.value)}
                      required
                      className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#2DDB81]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#A1A1A1] text-sm mb-1 block">Categoria *</label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value)}
                    required
                    className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#2DDB81]/50"
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
                    className="w-4 h-4 accent-[#2DDB81]"
                  />
                  <label htmlFor="recorrente" className="text-[#A1A1A1] text-sm cursor-pointer">
                    Recebimento recorrente
                  </label>
                </div>

                {formRecorrente && (
                  <div>
                    <label className="text-[#A1A1A1] text-sm mb-1 block">Frequência</label>
                    <select
                      value={formFrequencia}
                      onChange={(e) => setFormFrequencia(e.target.value as "mensal" | "anual")}
                      className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#2DDB81]/50"
                    >
                      <option value="">Selecione...</option>
                      <option value="mensal">Mensal</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-[#A1A1A1] text-sm mb-1 block">Anotações (opcional)</label>
                  <textarea
                    value={formAnotacoes}
                    onChange={(e) => setFormAnotacoes(e.target.value)}
                    placeholder="Observações..."
                    rows={2}
                    className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#2DDB81]/50 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { resetForm(); setDialogOpen(false); }}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#2DDB81] hover:bg-[#28C974] text-black font-semibold px-4 py-2.5 rounded-xl transition-colors"
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
