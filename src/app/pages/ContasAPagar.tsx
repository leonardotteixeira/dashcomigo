import { useState } from "react";
import { Plus, Trash2, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, Crown, Zap, Receipt, X } from "lucide-react";
import { usePayables, CATEGORIAS_PAYABLES, Payable } from "../contexts/PayablesContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { format, isPast, isToday, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { colors, spacing } from "../../utils/designTokens";
import { PremiumPageLayout } from "../components/PremiumPageLayout";
import { KPICard } from "../components/KPICard";
import { KPISection } from "../components/KPISection";

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
        dataVencimento: formVencimento,
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
    if (isToday(data)) return { label: "Vence hoje", color: colors.warning };
    if (isPast(data)) return { label: "Vencida", color: colors.danger };
    const dias = differenceInDays(data, new Date());
    if (dias <= 3) return { label: `${dias}d para vencer`, color: colors.danger };
    if (dias <= 7) return { label: `${dias}d para vencer`, color: colors.warning };
    return {
      label: format(data, "dd/MM/yyyy", { locale: ptBR }),
      color: colors.textSecondary,
    };
  }

  return (
    <PremiumPageLayout
      title="Contas a Pagar"
      description="Controle suas despesas e vencimentos com precisão"
      actions={
        <button
          onClick={() => {
            if (!canAddPayable()) {
              toast.error("Limite atingido — faça upgrade para PRO");
              return;
            }
            setDialogOpen(true);
          }}
          className="flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all"
          style={{ backgroundColor: colors.primary }}
        >
          <Plus className="w-5 h-5" />
          Nova Conta
        </button>
      }
    >
      <div className={spacing.sectionGap}>
        {/* KPI Cards */}
        <KPISection columns={3}>
          <KPICard
            icon={Receipt}
            label="Total Pendente"
            value={fmt(totalPendente)}
            color="blue"
          />
          <KPICard
            icon={CheckCircle}
            label="Total Pago"
            value={fmt(totalPago)}
            color="green"
          />
          <KPICard
            icon={AlertCircle}
            label="Vencendo em 7 dias"
            value={proximasAVencer.length}
            color="orange"
          />
        </KPISection>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider font-medium" style={{ color: colors.textSecondary }}>Total Pendente</p>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.danger}/10` }}>
                <AlertCircle className="w-5 h-5" style={{ color: colors.danger }} />
              </div>
            </div>
            <p className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>{fmt(totalPendente)}</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              {payables.filter((p) => p.status === "pendente").length} contas
            </p>
          </div>
          <div className="rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider font-medium" style={{ color: colors.textSecondary }}>Total Pago</p>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.success}/10` }}>
                <CheckCircle className="w-5 h-5" style={{ color: colors.success }} />
              </div>
            </div>
            <p className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>{fmt(totalPago)}</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              {payables.filter((p) => p.status === "pago").length} contas
            </p>
          </div>
          <div className="rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider font-medium" style={{ color: colors.textSecondary }}>Vencem em 7 dias</p>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.warning}/10` }}>
                <Clock className="w-5 h-5" style={{ color: colors.warning }} />
              </div>
            </div>
            <p className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>{proximasAVencer.length}</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              {fmt(proximasAVencer.reduce((s, p) => s + p.valor, 0))}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {proximasAVencer.length > 0 && (
          <div className="p-6 rounded-2xl border shadow-sm" style={{ backgroundColor: `${colors.warning}/10`, borderColor: colors.warning }}>
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.warning }} />
              <div>
                <h3 className="font-bold" style={{ color: colors.warning }}>{proximasAVencer.length} conta(s) vencem nos próximos 7 dias</h3>
                <div className="space-y-1.5 mt-3">
                  {proximasAVencer.map((p) => (
                    <p key={p.id} className="text-sm" style={{ color: colors.textSecondary }}>
                      {p.descricao} — {fmt(p.valor)} — Vence {format(new Date(p.dataVencimento + "T00:00:00"), "dd/MM", { locale: ptBR })}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2">
            {(["todas", "pendente", "pago"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: filtro === f ? colors.primary : colors.bgLighter,
                  color: filtro === f ? "white" : colors.textSecondary,
                  border: `1px solid ${filtro === f ? colors.primary : colors.borderDefault}`
                }}
              >
                {f === "todas" ? "Todas" : f === "pendente" ? "Pendentes" : "Pagas"}
              </button>
            ))}
          </div>
        </div>

        {/* Accounts List */}
        <div className="rounded-2xl shadow-sm border overflow-hidden" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
          <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderDefault}` }}>
            <h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>Contas</h3>
          </div>

          {loading ? (
            <div className="text-center py-12" style={{ color: colors.textSecondary }}>Carregando...</div>
          ) : payablesFiltradas.length === 0 ? (
            <div className="text-center py-12 px-6">
              <Zap className="w-10 h-10 mx-auto mb-3" style={{ color: `${colors.textSecondary}66` }} />
              <p style={{ color: colors.textSecondary }}>
                {filtro === "todas"
                  ? "Nenhuma conta cadastrada ainda."
                  : `Nenhuma conta ${filtro === "pendente" ? "pendente" : "paga"}.`}
              </p>
              {filtro === "todas" && (
                <button
                  onClick={() => setDialogOpen(true)}
                  className="mt-3 text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: colors.primary }}
                >
                  Adicionar primeira conta
                </button>
              )}
            </div>
          ) : (
            <div>
              {payablesFiltradas.map((payable) => {
                const venc = getVencimentoLabel(payable.dataVencimento);
                return (
                  <div
                    key={payable.id}
                    className="px-6 py-4 flex items-center justify-between gap-4 border-b transition-colors hover:opacity-80"
                    style={{
                      borderColor: colors.borderDefault,
                      backgroundColor: payable.status === "pago" ? colors.bgLighter : colors.bgLight,
                      opacity: payable.status === "pago" ? 0.7 : 1
                    }}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: payable.status === "pago" ? `${colors.success}/20` : `${colors.danger}/20` }}
                      >
                        {payable.status === "pago" ? (
                          <CheckCircle className="w-5 h-5" style={{ color: colors.success }} />
                        ) : (
                          <Clock className="w-5 h-5" style={{ color: colors.danger }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium" style={{ color: colors.textPrimary }}>{payable.descricao}</p>
                        <div className="flex items-center gap-2 flex-wrap text-xs mt-1" style={{ color: colors.textSecondary }}>
                          <span>{payable.categoria}</span>
                          <span>•</span>
                          <span style={{ color: venc.color }}>{venc.label}</span>
                          {payable.ehRecorrente && (
                            <>
                              <span>•</span>
                              <span>🔄 {payable.frequenciaRecorrencia}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-bold text-lg" style={{ color: payable.status === "pago" ? colors.success : colors.danger }}>
                        {fmt(payable.valor)}
                      </span>

                      {payable.status === "pendente" ? (
                        <button
                          onClick={() => handleMarcarPago(payable)}
                          className="text-xs text-white px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-90"
                          style={{ backgroundColor: colors.primary }}
                        >
                          Marcar Pago
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarcarPendente(payable)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border"
                          style={{ backgroundColor: colors.bgLighter, color: colors.textSecondary, borderColor: colors.borderDefault }}
                        >
                          Desfazer
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(payable.id)}
                        className="p-1 hover:opacity-80 transition-opacity"
                        style={{ color: colors.danger }}
                      >
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
          <div
            className="p-6 rounded-2xl border shadow-sm"
            style={{
              backgroundColor: limitStatus.percentage >= 100 ? `${colors.danger}/10` : limitStatus.percentage >= 80 ? `${colors.warning}/10` : colors.bgLighter,
              borderColor: limitStatus.percentage >= 100 ? colors.danger : limitStatus.percentage >= 80 ? colors.warning : colors.borderDefault
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold" style={{ color: colors.textPrimary }}>Contas este mês</h3>
                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>Reseta todo dia 1</p>
              </div>
              <span className="text-lg font-bold" style={{
                color: limitStatus.percentage >= 100 ? colors.danger : limitStatus.percentage >= 80 ? colors.warning : colors.textPrimary
              }}>
                {limitStatus.used}/{limitStatus.limit}
              </span>
            </div>
            <div className="w-full rounded-full h-2 mb-3" style={{ backgroundColor: colors.bgLighter }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(limitStatus.percentage, 100)}%`,
                  backgroundColor: limitStatus.percentage >= 100 ? colors.danger : limitStatus.percentage >= 80 ? colors.warning : colors.success
                }}
              />
            </div>
            {limitStatus.percentage >= 80 && (
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {limitStatus.percentage >= 100
                    ? "Limite atingido! Faça upgrade para continuar."
                    : `Restam ${limitStatus.limit - limitStatus.used} contas este mês.`}
                </p>
                <button
                  onClick={() => navigate("/checkout")}
                  className="flex items-center gap-2 text-sm text-white font-bold px-4 py-2 rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: colors.primary }}
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
            <div className="rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg border" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
              <div className="p-6" style={{ borderBottom: `1px solid ${colors.borderDefault}` }}>
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-xl" style={{ color: colors.textPrimary }}>Nova Conta a Pagar</h2>
                  <button onClick={() => { resetForm(); setDialogOpen(false); }} className="hover:opacity-70 transition-opacity" style={{ color: colors.textSecondary }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit} className={spacing.elementGap}>
                  {/* Description */}
                  <div>
                    <label className="text-sm mb-1 block" style={{ color: colors.textSecondary }}>Descrição *</label>
                    <input
                      type="text"
                      value={formDescricao}
                      onChange={(e) => setFormDescricao(e.target.value)}
                      placeholder="Ex: Aluguel do escritório"
                      required
                      className="w-full rounded-lg px-4 py-2.5 focus:outline-none transition-colors"
                      style={{
                        backgroundColor: colors.bgLighter,
                        borderColor: colors.borderDefault,
                        color: colors.textPrimary,
                        border: `1px solid ${colors.borderDefault}`
                      }}
                    />
                  </div>

                  {/* Value + Due Date */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm mb-1 block" style={{ color: colors.textSecondary }}>Valor (R$) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formValor}
                        onChange={(e) => setFormValor(e.target.value)}
                        placeholder="0,00"
                        required
                        className="w-full rounded-lg px-4 py-2.5 focus:outline-none transition-colors"
                        style={{
                          backgroundColor: colors.bgLighter,
                          borderColor: colors.borderDefault,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.borderDefault}`
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block" style={{ color: colors.textSecondary }}>Vencimento *</label>
                      <input
                        type="date"
                        value={formVencimento}
                        onChange={(e) => setFormVencimento(e.target.value)}
                        required
                        className="w-full rounded-lg px-4 py-2.5 focus:outline-none transition-colors"
                        style={{
                          backgroundColor: colors.bgLighter,
                          borderColor: colors.borderDefault,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.borderDefault}`
                        }}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm mb-1 block" style={{ color: colors.textSecondary }}>Categoria *</label>
                    <select
                      value={formCategoria}
                      onChange={(e) => setFormCategoria(e.target.value)}
                      required
                      className="w-full rounded-lg px-4 py-2.5 focus:outline-none transition-colors"
                      style={{
                        backgroundColor: colors.bgLighter,
                        borderColor: colors.borderDefault,
                        color: colors.textPrimary,
                        border: `1px solid ${colors.borderDefault}`
                      }}
                    >
                      <option value="">Selecione...</option>
                      {CATEGORIAS_PAYABLES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Recurring */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="recorrente"
                      checked={formRecorrente}
                      onChange={(e) => setFormRecorrente(e.target.checked)}
                      className="w-4 h-4"
                      style={{ accentColor: colors.primary }}
                    />
                    <label htmlFor="recorrente" className="text-sm cursor-pointer" style={{ color: colors.textSecondary }}>
                      Conta recorrente
                    </label>
                  </div>

                  {formRecorrente && (
                    <div>
                      <label className="text-sm mb-1 block" style={{ color: colors.textSecondary }}>Frequência</label>
                      <select
                        value={formFrequencia}
                        onChange={(e) => setFormFrequencia(e.target.value as "mensal" | "anual")}
                        className="w-full rounded-lg px-4 py-2.5 focus:outline-none transition-colors"
                        style={{
                          backgroundColor: colors.bgLighter,
                          borderColor: colors.borderDefault,
                          color: colors.textPrimary,
                          border: `1px solid ${colors.borderDefault}`
                        }}
                      >
                        <option value="">Selecione...</option>
                        <option value="mensal">Mensal</option>
                        <option value="anual">Anual</option>
                      </select>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="text-sm mb-1 block" style={{ color: colors.textSecondary }}>Anotações (opcional)</label>
                    <textarea
                      value={formAnotacoes}
                      onChange={(e) => setFormAnotacoes(e.target.value)}
                      placeholder="Observações..."
                      rows={2}
                      className="w-full rounded-lg px-4 py-2.5 focus:outline-none transition-colors resize-none"
                      style={{
                        backgroundColor: colors.bgLighter,
                        borderColor: colors.borderDefault,
                        color: colors.textPrimary,
                        border: `1px solid ${colors.borderDefault}`
                      }}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { resetForm(); setDialogOpen(false); }}
                      className="flex-1 px-4 py-2.5 rounded-lg transition-colors hover:opacity-80"
                      style={{ backgroundColor: colors.bgLighter, color: colors.textPrimary }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 text-white font-semibold px-4 py-2.5 rounded-lg transition-all hover:opacity-90"
                      style={{ backgroundColor: colors.primary }}
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
