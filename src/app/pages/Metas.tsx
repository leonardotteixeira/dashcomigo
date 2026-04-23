import { useState } from "react";
import { Plus, Target, X, Trash2, TrendingUp, Crown, Lock } from "lucide-react";
import { useGoals } from "../contexts/GoalsContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { colors, spacing } from "../../utils/designTokens";
import { PremiumPageLayout } from "../components/PremiumPageLayout";

const MESES_NOMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const MESES_COMPLETOS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function mesAtual() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatMes(mes: string) {
  const [ano, m] = mes.split("-");
  return `${MESES_COMPLETOS[parseInt(m) - 1]} ${ano}`;
}

function gerarOpcoesMeses() {
  const opcoes = [];
  const now = new Date();
  for (let i = -2; i <= 4; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    opcoes.push(val);
  }
  return opcoes;
}

function diasRestantesNoMes() {
  const now = new Date();
  const ultimoDia = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return ultimoDia.getDate() - now.getDate();
}

export function Metas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { goals, loading, addGoal, deleteGoal, getGoalByMes, getHistorico } = useGoals();

  // All hooks MUST be declared before any conditional return
  const [modalOpen, setModalOpen] = useState(false);
  const [formMes, setFormMes] = useState(mesAtual());
  const [formValor, setFormValor] = useState("");
  const [formCategoria, setFormCategoria] = useState("");

  if (user?.plan !== "pro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${colors.primary}/10` }}>
          <Lock className="w-8 h-8" style={{ color: colors.primary }} />
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: colors.textPrimary }}>Metas de Receita são exclusivas do Premium</h2>
        <p className="mb-8 max-w-md" style={{ color: colors.textSecondary }}>
          Defina metas mensais e acompanhe seu progresso em tempo real com o plano Premium.
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-all"
          style={{ backgroundColor: colors.primary }}
        >
          <Crown className="w-5 h-5" />
          Fazer Upgrade para Premium
        </button>
      </div>
    );
  }

  const metaMesAtual = getGoalByMes(mesAtual());
  const historico = getHistorico(6);
  const opcoesMeses = gerarOpcoesMeses();

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  function resetForm() {
    setFormMes(mesAtual());
    setFormValor("");
    setFormCategoria("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formMes || !formValor) { toast.error("Preencha todos os campos"); return; }

    const existe = goals.find((g) => g.mes === formMes);
    if (existe) { toast.error("Já existe uma meta para este mês"); return; }

    try {
      await addGoal({
        mes: formMes,
        valorMeta: parseFloat(formValor),
        categoria: formCategoria || undefined,
      });
      toast.success("Meta definida!");
      resetForm();
      setModalOpen(false);
    } catch (error: any) {
      toast.error("Erro ao salvar meta", { description: error?.message });
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteGoal(id);
      toast.success("Meta removida");
    } catch {
      toast.error("Erro ao remover meta");
    }
  }

  function corProgresso(percentual: number) {
    if (percentual >= 100) return colors.success;
    if (percentual >= 70) return colors.warning;
    return colors.danger;
  }

  function corTexto(percentual: number) {
    if (percentual >= 100) return colors.success;
    if (percentual >= 70) return colors.warning;
    return colors.danger;
  }

  return (
    <PremiumPageLayout
      title="Metas de Receita"
      description="Defina e acompanhe suas metas mensais"
      actions={
        <button
          onClick={() => { resetForm(); setModalOpen(true); }}
          className="flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all"
          style={{ backgroundColor: colors.primary }}
        >
          <Plus className="w-5 h-5" />
          Nova Meta
        </button>
      }
    >
      <div className={spacing.sectionGap}>

        {/* Current Month Card */}
        {loading ? (
          <div className="text-center py-12" style={{ color: colors.textSecondary }}>Carregando...</div>
        ) : metaMesAtual ? (
          <div className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>{formatMes(mesAtual())}</p>
                <h2 className="text-2xl font-bold mt-1" style={{ color: colors.textPrimary }}>
                  {fmt(metaMesAtual.valorRealizado)}
                  <span className="text-base font-normal" style={{ color: colors.textSecondary }}> / {fmt(metaMesAtual.valorMeta)}</span>
                </h2>
                {metaMesAtual.categoria && (
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Foco: {metaMesAtual.categoria}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold" style={{ color: corTexto(metaMesAtual.percentual) }}>
                  {metaMesAtual.percentual.toFixed(0)}%
                </p>
                <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                {metaMesAtual.status === "alcancada"
                  ? "✅ Meta atingida!"
                  : `${diasRestantesNoMes()} dias restantes`}
              </p>
            </div>
          </div>

            {/* Progress Bar */}
            <div className="w-full rounded-full h-3 mb-3" style={{ backgroundColor: colors.bgLighter }}>
              <div
                className="h-3 rounded-full transition-all"
                style={{ width: `${Math.min(metaMesAtual.percentual, 100)}%`, backgroundColor: corProgresso(metaMesAtual.percentual) }}
              />
            </div>

            <div className="flex justify-between text-xs" style={{ color: colors.textSecondary }}>
              <span>Falta: {fmt(Math.max(0, metaMesAtual.valorMeta - metaMesAtual.valorRealizado))}</span>
              <button onClick={() => handleDelete(metaMesAtual.id)} className="hover:opacity-80 transition-opacity flex items-center gap-1" style={{ color: colors.danger }}>
                <Trash2 className="w-3 h-3" />
                Remover meta
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-dashed rounded-2xl p-8 text-center" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${colors.textSecondary}/10` }}>
              <Target className="w-5 h-5" style={{ color: colors.textSecondary }} />
            </div>
            <p className="mb-2" style={{ color: colors.textSecondary }}>Nenhuma meta definida para {formatMes(mesAtual())}</p>
            <button
              onClick={() => { resetForm(); setModalOpen(true); }}
              className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: colors.primary }}
            >
              Definir meta do mês
            </button>
          </div>
        )}

        {/* History Section */}
        {historico.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textPrimary }}>
              <TrendingUp className="w-4 h-4" style={{ color: colors.primary }} />
              Histórico
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {historico.map((goal) => {
                const [ano, m] = goal.mes.split("-");
                const isAtual = goal.mes === mesAtual();
                const borderColor = goal.status === "alcancada" ? colors.success : goal.status === "nao_alcancada" ? colors.danger : colors.borderDefault;
                return (
                  <div
                    key={goal.id}
                    className="bg-[#EBE4D6] rounded-2xl p-6 shadow-sm border"
                    style={{ backgroundColor: colors.bgLight, borderColor }}
                  >
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      {MESES_NOMES[parseInt(m) - 1]} {ano}
                      {isAtual && <span className="ml-1" style={{ color: colors.primary }}>• atual</span>}
                    </p>
                    <p className="text-lg font-bold mt-1" style={{ color: corTexto(goal.percentual) }}>
                      {goal.percentual.toFixed(0)}%
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                      {fmt(goal.valorRealizado)} / {fmt(goal.valorMeta)}
                    </p>
                    {/* Mini progress bar */}
                    <div className="w-full rounded-full h-1.5 mt-2" style={{ backgroundColor: colors.bgLighter }}>
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.min(goal.percentual, 100)}%`, backgroundColor: corProgresso(goal.percentual) }}
                      />
                    </div>
                    <p className="text-xs mt-1.5" style={{ color: colors.textSecondary }}>
                      {goal.status === "alcancada" ? "✅ Atingida" : goal.status === "nao_alcancada" ? "❌ Não atingida" : "⏳ Em andamento"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="bg-[#EBE4D6] rounded-2xl w-full max-w-sm shadow-sm border" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg" style={{ color: colors.textPrimary }}>Nova Meta</h2>
                  <button onClick={() => { resetForm(); setModalOpen(false); }} className="hover:opacity-70 transition-opacity" style={{ color: colors.textSecondary }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className={spacing.elementGap}>
                  <div>
                    <label className="text-sm mb-1 block" style={{ color: colors.textSecondary }}>Mês *</label>
                    <select
                      value={formMes}
                      onChange={(e) => setFormMes(e.target.value)}
                      required
                      className="w-full rounded-lg px-4 py-2.5 focus:outline-none transition-colors"
                      style={{
                        backgroundColor: colors.bgLighter,
                        borderColor: colors.borderDefault,
                        color: colors.textPrimary,
                        border: `1px solid ${colors.borderDefault}`
                      }}
                    >
                      {opcoesMeses.map((m) => (
                        <option key={m} value={m}>{formatMes(m)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm mb-1 block" style={{ color: colors.textSecondary }}>Meta de Receita (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formValor}
                      onChange={(e) => setFormValor(e.target.value)}
                      placeholder="Ex: 10.000,00"
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
                    <label className="text-sm mb-1 block" style={{ color: colors.textSecondary }}>Categoria focada (opcional)</label>
                    <input
                      type="text"
                      value={formCategoria}
                      onChange={(e) => setFormCategoria(e.target.value)}
                      placeholder="Ex: Consultoria, Vendas..."
                      className="w-full rounded-lg px-4 py-2.5 focus:outline-none transition-colors"
                      style={{
                        backgroundColor: colors.bgLighter,
                        borderColor: colors.borderDefault,
                        color: colors.textPrimary,
                        border: `1px solid ${colors.borderDefault}`
                      }}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => { resetForm(); setModalOpen(false); }} className="flex-1 px-4 py-2.5 rounded-lg transition-colors hover:opacity-80" style={{ backgroundColor: colors.bgLighter, color: colors.textPrimary }}>
                      Cancelar
                    </button>
                    <button type="submit" className="flex-1 text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all" style={{ backgroundColor: colors.primary }}>
                      Definir Meta
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
