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
    if (isToday(data)) return { label: "Vence hoje", color: "text-yellow-600" };
    if (isPast(data)) return { label: "Vencida", color: "text-red-500" };
    const dias = differenceInDays(data, new Date());
    if (dias <= 3) return { label: `${dias}d para vencer`, color: "text-orange-600" };
    if (dias <= 7) return { label: `${dias}d para vencer`, color: "text-yellow-600" };
    return {
      label: format(data, "dd/MM/yyyy", { locale: ptBR }),
      color: "text-[rgba(0,21,41,0.5)]",
    };
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#001529]">Contas a Pagar</h1>
          <p className="text-[rgba(0,21,41,0.6)] text-sm mt-1">
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
          <p className="text-red-500 text-xl font-bold mt-1">{fmt(totalPendente)}</p>
          <p className="text-[rgba(0,21,41,0.6)] text-xs mt-1">
            {payables.filter((p) => p.status === "pendente").length} contas
          </p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-4">
          <p className="text-[rgba(0,21,41,0.6)] text-sm">Total Pago</p>
          <p className="text-[#28A263] text-xl font-bold mt-1">{fmt(totalPago)}</p>
          <p className="text-[rgba(0,21,41,0.6)] text-xs mt-1">
            {payables.filter((p) => p.status === "pago").length} contas
          </p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-4">
          <p className="text-[rgba(0,21,41,0.6)] text-sm">Vencem em 7 dias</p>
          <p className="text-yellow-600 text-xl font-bold mt-1">
            {proximasAVencer.length}
          </p>
          <p className="text-[rgba(0,21,41,0.6)] text-xs mt-1">
            {fmt(proximasAVencer.reduce((s, p) => s + p.valor, 0))}
          </p>
        </div>
      </div>

      {/* Alertas de vencimento */}
      {proximasAVencer.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-700 font-semibold text-sm">
              {proximasAVencer.length} conta(s) vencem nos próximos 7 dias
            </span>
          </div>
          {proximasAVencer.map((p) => (
            <p key={p.id} className="text-[rgba(0,21,41,0.6)] text-xs ml-6">
              • {p.descricao} — {fmt(p.valor)} —{" "}
              <span className="text-yellow-700">
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
                ? "bg-[#28A263] text-white"
                : "bg-[#F8F9FA] text-[rgba(0,21,41,0.6)] hover:text-[#001529] border border-[rgba(0,0,0,0.1)]"
            }`}
          >
            {f === "todas" ? "Todas" : f === "pendente" ? "Pendentes" : "Pagas"}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-[rgba(0,21,41,0.6)]">Carregando...</div>
      ) : payablesFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-2xl">
          <p className="text-[rgba(0,21,41,0.6)]">
            {filtro === "todas"
              ? "Nenhuma conta cadastrada ainda."
              : `Nenhuma conta ${filtro === "pendente" ? "pendente" : "paga"}.`}
          </p>
          {filtro === "todas" && (
            <button
              onClick={() => setDialogOpen(true)}
              className="mt-3 text-[#28A263] text-sm hover:underline"
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
                className={`bg-white border rounded-2xl p-4 flex items-center justify-between gap-4 ${
                  payable.status === "pago"
                    ? "border-[rgba(0,0,0,0.1)] opacity-60"
                    : "border-[rgba(0,0,0,0.1)]"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      payable.status === "pago"
                        ? "bg-[#28A263]/10"
                        : "bg-red-100"
                    }`}
                  >
                    {payable.status === "pago" ? (
                      <CheckCircle className="w-4 h-4 text-[#28A263]" />
                    ) : (
                      <Clock className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#001529] font-medium truncate">{payable.descricao}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[rgba(0,21,41,0.6)] text-xs">{payable.categoria}</span>
                      <span className="text-[rgba(0,21,41,0.6)] text-xs">•</span>
                      <span className={`text-xs ${venc.color}`}>{venc.label}</span>
                      {payable.ehRecorrente && (
                        <>
                          <span className="text-[rgba(0,21,41,0.6)] text-xs">•</span>
                          <span className="text-blue-600 text-xs">
                            🔄 {payable.frequenciaRecorrencia}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`font-bold ${payable.status === "pago" ? "text-[#28A263]" : "text-red-500"}`}>
                    {fmt(payable.valor)}
                  </span>

                  {payable.status === "pendente" ? (
                    <button
                      onClick={() => handleMarcarPago(payable)}
                      className="text-xs bg-[#28A263]/10 hover:bg-[#28A263]/20 text-[#28A263] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Pagar ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarcarPendente(payable)}
                      className="text-xs bg-[#F8F9FA] hover:bg-[#F5F7FA] text-[rgba(0,21,41,0.6)] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Desfazer
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(payable.id)}
                    className="text-[rgba(0,21,41,0.6)] hover:text-red-500 transition-colors"
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
            ? "bg-red-50 border-red-300"
            : limitStatus.percentage >= 80
            ? "bg-yellow-50 border-yellow-300"
            : "bg-[#F8F9FA] border-[rgba(0,0,0,0.1)]"
        }`}>
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-sm text-[#001529] font-medium">Contas este mês</span>
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

      {/* Modal Nova Conta */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-[#001529] font-bold text-lg mb-4">Nova Conta a Pagar</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Descrição */}
                <div>
                  <label className="text-[rgba(0,21,41,0.6)] text-sm mb-1 block">Descrição *</label>
                  <input
                    type="text"
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    placeholder="Ex: Aluguel do escritório"
                    required
                    className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-xl px-4 py-2.5 text-[#001529] placeholder-[rgba(0,21,41,0.4)] focus:outline-none focus:border-[#28A263]/50"
                  />
                </div>

                {/* Valor + Vencimento */}
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

                {/* Categoria */}
                <div>
                  <label className="text-[rgba(0,21,41,0.6)] text-sm mb-1 block">Categoria *</label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value)}
                    required
                    className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-xl px-4 py-2.5 text-[#001529] focus:outline-none focus:border-[#28A263]/50"
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
                    className="w-4 h-4 accent-[#28A263]"
                  />
                  <label htmlFor="recorrente" className="text-[rgba(0,21,41,0.6)] text-sm cursor-pointer">
                    Conta recorrente
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

                {/* Anotações */}
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

                {/* Botões */}
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
