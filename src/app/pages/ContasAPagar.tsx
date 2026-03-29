import { useState } from "react";
import { Plus, Trash2, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, Crown, Zap } from "lucide-react";
import { usePayables, CATEGORIAS_PAYABLES, Payable } from "../contexts/PayablesContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { format, isPast, isToday, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export function ContasAPagar() {
  const {
    payables,
    loading,
    addPayable,
    updatePayable,
    deletePayable,
    getProximasAVencer,
    getLimitStatus,
    canAddPayable,
  } = usePayables();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtro, setFiltro] = useState<"todas" | "pendente" | "pago">("todas");

  // Form state
  const [formDescricao, setFormDescricao] = useState("");
  const [formValor, setFormValor] = useState("");
  const [formCategoria, setFormCategoria] = useState("");
  const [formVencimento, setFormVencimento] = useState("");
  const [formRecorrente, setFormRecorrente] = useState(false);
  const [formFrequencia, setFormFrequencia] = useState<"mensal" | "anual" | "">("");
  const [formAnotacoes, setFormAnotacoes] = useState("");

  const limitStatus = getLimitStatus();
  const proximasAVencer = getProximasAVencer(7);
  const navigate = useNavigate();

  const payablesFiltradas = filtro === "todas"
    ? payables
    : payables.filter((p) => p.status === filtro);

  const totalPendente = payables
    .filter((p) => p.status === "pendente")
    .reduce((sum, p) => sum + p.valor, 0);

  const totalPago = payables
    .filter((p) => p.status === "pago")
    .reduce((sum, p) => sum + p.valor, 0);

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

    if (!canAddPayable()) {
      toast.error("Limite atingido", {
        description: "Faça upgrade para PRO para adicionar mais contas.",
      });
      return;
    }

    try {
      await addPayable({
        descricao: formDescricao,
        valor: parseFloat(formValor),
        categoria: formCategoria,
        dataVencimento: formVencimento, // input type="date" já retorna YYYY-MM-DD
        status: "pendente",
        ehRecorrente: formRecorrente,
        frequenciaRecorrencia: formRecorrente && formFrequencia ? formFrequencia as "mensal" | "anual" : undefined,
        anotacoes: formAnotacoes || undefined,
      });

      toast.success("Conta adicionada!", {
        description: `${formDescricao} — ${fmt(parseFloat(formValor))}`,
      });

      resetForm();
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("Erro ao adicionar conta", {
        description: error?.message || "Tente novamente",
      });
    }
  }

  async function handleMarcarPago(payable: Payable) {
    try {
      await updatePayable(payable.id, {
        status: "pago",
        dataPagamento: new Date().toISOString().split("T")[0],
      });
      toast.success("Marcada como paga! ✅");
    } catch {
      toast.error("Erro ao atualizar conta");
    }
  }

  async function handleMarcarPendente(payable: Payable) {
    try {
      await updatePayable(payable.id, {
        status: "pendente",
        dataPagamento: undefined,
      });
      toast.info("Marcada como pendente");
    } catch {
      toast.error("Erro ao atualizar conta");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePayable(id);
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
    return {
      label: format(data, "dd/MM/yyyy", { locale: ptBR }),
      color: "text-[#A1A1A1]",
    };
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contas a Pagar</h1>
          <p className="text-[#A1A1A1] text-sm mt-1">
            Controle suas despesas e vencimentos
          </p>
        </div>
        <button
          onClick={() => {
            if (!canAddPayable()) {
              toast.error("Limite atingido — faça upgrade para PRO");
              return;
            }
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
          <p className="text-red-400 text-xl font-bold mt-1">{fmt(totalPendente)}</p>
          <p className="text-[#A1A1A1] text-xs mt-1">
            {payables.filter((p) => p.status === "pendente").length} contas
          </p>
        </div>
        <div className="bg-[#1B1B1B] border border-white/5 rounded-2xl p-4">
          <p className="text-[#A1A1A1] text-sm">Total Pago</p>
          <p className="text-[#2DDB81] text-xl font-bold mt-1">{fmt(totalPago)}</p>
          <p className="text-[#A1A1A1] text-xs mt-1">
            {payables.filter((p) => p.status === "pago").length} contas
          </p>
        </div>
        <div className="bg-[#1B1B1B] border border-white/5 rounded-2xl p-4">
          <p className="text-[#A1A1A1] text-sm">Vencem em 7 dias</p>
          <p className="text-yellow-400 text-xl font-bold mt-1">
            {proximasAVencer.length}
          </p>
          <p className="text-[#A1A1A1] text-xs mt-1">
            {fmt(proximasAVencer.reduce((s, p) => s + p.valor, 0))}
          </p>
        </div>
      </div>

      {/* Alertas de vencimento */}
      {proximasAVencer.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">
              {proximasAVencer.length} conta(s) vencem nos próximos 7 dias
            </span>
          </div>
          {proximasAVencer.map((p) => (
            <p key={p.id} className="text-[#A1A1A1] text-xs ml-6">
              • {p.descricao} — {fmt(p.valor)} —{" "}
              <span className="text-yellow-400">
                {format(new Date(p.dataVencimento + "T00:00:00"), "dd/MM", { locale: ptBR })}
              </span>
            </p>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        {(["todas", "pendente", "pago"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              filtro === f
                ? "bg-[#2DDB81] text-black"
                : "bg-[#1B1B1B] text-[#A1A1A1] hover:text-white border border-white/5"
            }`}
          >
            {f === "todas" ? "Todas" : f === "pendente" ? "Pendentes" : "Pagas"}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-[#A1A1A1]">Carregando...</div>
      ) : payablesFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-[#1B1B1B] border border-white/5 rounded-2xl">
          <p className="text-[#A1A1A1]">
            {filtro === "todas"
              ? "Nenhuma conta cadastrada ainda."
              : `Nenhuma conta ${filtro === "pendente" ? "pendente" : "paga"}.`}
          </p>
          {filtro === "todas" && (
            <button
              onClick={() => setDialogOpen(true)}
              className="mt-3 text-[#2DDB81] text-sm hover:underline"
            >
              Adicionar primeira conta
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {payablesFiltradas.map((payable) => {
            const venc = getVencimentoLabel(payable.dataVencimento);
            return (
              <div
                key={payable.id}
                className={`bg-[#1B1B1B] border rounded-2xl p-4 flex items-center justify-between gap-4 ${
                  payable.status === "pago"
                    ? "border-white/5 opacity-60"
                    : "border-white/5"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      payable.status === "pago"
                        ? "bg-[#2DDB81]/20"
                        : "bg-red-500/20"
                    }`}
                  >
                    {payable.status === "pago" ? (
                      <CheckCircle className="w-4 h-4 text-[#2DDB81]" />
                    ) : (
                      <Clock className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{payable.descricao}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#A1A1A1] text-xs">{payable.categoria}</span>
                      <span className="text-[#A1A1A1] text-xs">•</span>
                      <span className={`text-xs ${venc.color}`}>{venc.label}</span>
                      {payable.ehRecorrente && (
                        <>
                          <span className="text-[#A1A1A1] text-xs">•</span>
                          <span className="text-blue-400 text-xs">
                            🔄 {payable.frequenciaRecorrencia}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`font-bold ${payable.status === "pago" ? "text-[#2DDB81]" : "text-red-400"}`}>
                    {fmt(payable.valor)}
                  </span>

                  {payable.status === "pendente" ? (
                    <button
                      onClick={() => handleMarcarPago(payable)}
                      className="text-xs bg-[#2DDB81]/20 hover:bg-[#2DDB81]/30 text-[#2DDB81] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Pagar ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarcarPendente(payable)}
                      className="text-xs bg-white/5 hover:bg-white/10 text-[#A1A1A1] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Desfazer
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(payable.id)}
                    className="text-[#A1A1A1] hover:text-red-400 transition-colors"
                  >
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
            ? "bg-red-500/10 border-red-500/30"
            : limitStatus.percentage >= 80
            ? "bg-yellow-500/10 border-yellow-500/30"
            : "bg-[#1B1B1B] border-white/5"
        }`}>
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-sm text-white font-medium">Contas este mês</span>
              <span className="text-xs text-[#A1A1A1] ml-2">(reseta todo dia 1)</span>
            </div>
            <span className={`text-sm font-bold ${
              limitStatus.percentage >= 100 ? "text-red-400" :
              limitStatus.percentage >= 80 ? "text-yellow-400" : "text-white"
            }`}>
              {limitStatus.used}/{limitStatus.limit}
            </span>
          </div>
          <div className="w-full bg-[#2a2a2a] rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all ${
                limitStatus.percentage >= 100 ? "bg-red-500" :
                limitStatus.percentage >= 80 ? "bg-yellow-400" : "bg-[#2DDB81]"
              }`}
              style={{ width: `${Math.min(limitStatus.percentage, 100)}%` }}
            />
          </div>
          {limitStatus.percentage >= 80 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#A1A1A1]">
                {limitStatus.percentage >= 100
                  ? "Limite atingido! Faça upgrade para continuar."
                  : `Restam apenas ${limitStatus.limit - limitStatus.used} lançamentos.`}
              </p>
              <button
                onClick={() => navigate("/checkout")}
                className="flex items-center gap-1 text-xs bg-[#2DDB81] hover:bg-[#28C974] text-black font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                <Crown className="w-3 h-3" />
                Upgrade PRO
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Nova Conta */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1B1B1B] border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-white font-bold text-lg mb-4">Nova Conta a Pagar</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Descrição */}
                <div>
                  <label className="text-[#A1A1A1] text-sm mb-1 block">Descrição *</label>
                  <input
                    type="text"
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    placeholder="Ex: Aluguel do escritório"
                    required
                    className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#2DDB81]/50"
                  />
                </div>

                {/* Valor + Vencimento */}
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

                {/* Categoria */}
                <div>
                  <label className="text-[#A1A1A1] text-sm mb-1 block">Categoria *</label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value)}
                    required
                    className="w-full bg-[#252525] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#2DDB81]/50"
                  >
                    <option value="">Selecione...</option>
                    {CATEGORIAS_PAYABLES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Recorrente */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="recorrente"
                    checked={formRecorrente}
                    onChange={(e) => setFormRecorrente(e.target.checked)}
                    className="w-4 h-4 accent-[#2DDB81]"
                  />
                  <label htmlFor="recorrente" className="text-[#A1A1A1] text-sm cursor-pointer">
                    Conta recorrente
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

                {/* Anotações */}
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

                {/* Botões */}
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
