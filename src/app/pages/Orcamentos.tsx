import { useState } from "react";
import { Plus, Trash2, AlertTriangle, X, PieChart, Crown, Lock, TrendingUp } from "lucide-react";
import { useBudgets } from "../contexts/BudgetsContext";
import { CATEGORIAS_PAYABLES } from "../contexts/PayablesContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { PremiumPageLayout } from "../components/PremiumPageLayout";
import { colors } from "../../utils/designTokens";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function mesAtual() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatMes(mes: string) {
  const [ano, m] = mes.split("-");
  return `${MESES[parseInt(m) - 1]} ${ano}`;
}

function gerarOpcoesMeses() {
  const opcoes = [];
  const now = new Date();
  for (let i = -3; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    opcoes.push(val);
  }
  return opcoes;
}

export function Orcamentos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { budgets, loading, addBudget, deleteBudget, getBudgetsByMes, getTotalByMes } = useBudgets();

  if (user?.plan !== "pro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-16 h-16 bg-[#28A263]/10 rounded-2xl flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-[#28A263]" />
        </div>
        <h2 className="text-2xl font-bold text-[#001529] mb-3">Orçamentos são exclusivos do PRO</h2>
        <p className="text-[rgba(0,21,41,0.6)] mb-8 max-w-md">
          Planeje seus gastos por categoria e compare com o realizado em tempo real com o plano PRO.
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="flex items-center gap-2 bg-[#28A263] hover:bg-[#1f7a4a] text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          <Crown className="w-5 h-5" />
          Fazer Upgrade para PRO
        </button>
      </div>
    );
  }

  const [mesSelecionado, setMesSelecionado] = useState(mesAtual());
  const [modalOpen, setModalOpen] = useState(false);
  const [formCategoria, setFormCategoria] = useState("");
  const [formValor, setFormValor] = useState("");
  const [formMes, setFormMes] = useState(mesAtual());

  const items = getBudgetsByMes(mesSelecionado);
  const totais = getTotalByMes(mesSelecionado);
  const opcoesMeses = gerarOpcoesMeses();

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const alertas = items.filter((i) => i.status !== "ok");

  function resetForm() {
    setFormCategoria("");
    setFormValor("");
    setFormMes(mesAtual());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formCategoria || !formValor || !formMes) { toast.error("Preencha todos os campos"); return; }

    // Verificar se já existe orçamento para esta categoria/mês
    const existe = budgets.find((b) => b.categoria === formCategoria && b.mes === formMes);
    if (existe) { toast.error("Já existe um orçamento para esta categoria neste mês"); return; }

    try {
      await addBudget({ categoria: formCategoria, mes: formMes, valorPlanejado: parseFloat(formValor) });
      toast.success("Orçamento adicionado!");
      resetForm();
      setModalOpen(false);
    } catch (error: any) {
      toast.error("Erro ao adicionar orçamento", { description: error?.message });
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteBudget(id);
      toast.success("Orçamento removido");
    } catch {
      toast.error("Erro ao remover orçamento");
    }
  }

  function statusColor(status: "ok" | "alerta" | "excedido") {
    if (status === "excedido") return "text-red-500";
    if (status === "alerta") return "text-yellow-600";
    return "text-[#28A263]";
  }

  function statusBadge(status: "ok" | "alerta" | "excedido") {
    if (status === "excedido") return <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-600 rounded-full">Excedido</span>;
    if (status === "alerta") return <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Alerta</span>;
    return <span className="text-[10px] px-2 py-0.5 bg-[#28A263]/10 text-[#28A263] rounded-full">Ok</span>;
  }

  return (
    <PremiumPageLayout
      title="Orçamentos"
      description="Planeje seus gastos por categoria"
      actions={
        <button
          onClick={() => { resetForm(); setModalOpen(true); }}
          style={{ backgroundColor: colors.primary }}
          className="flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Orçamento
        </button>
      }
    >
      <div className="space-y-8">

        {/* Month Selector */}
        <div>
          <label className="text-sm font-medium mb-2 block" style={{ color: colors.textSecondary }}>Mês</label>
          <select
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(e.target.value)}
            className="max-w-xs rounded-xl px-4 py-2.5 focus:outline-none transition-colors"
            style={{
              backgroundColor: colors.bgLight,
              borderColor: colors.borderDefault,
              color: colors.textPrimary,
              border: `1px solid ${colors.borderDefault}`,
            }}
          >
            {opcoesMeses.map((m) => (
              <option key={m} value={m}>{formatMes(m)}</option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div
            className="rounded-2xl p-6 shadow-sm border"
            style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${colors.secondary}/10` }}
            >
              <PieChart className="w-5 h-5" style={{ color: colors.secondary }} />
            </div>
            <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>Total Orçado</p>
            <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{fmt(totais.planejado)}</p>
          </div>
          <div
            className="rounded-2xl p-6 shadow-sm border"
            style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{
                backgroundColor: totais.realizado > totais.planejado ? `${colors.danger}/10` : `${colors.primary}/10`,
              }}
            >
              <AlertTriangle
                className="w-5 h-5"
                style={{
                  color: totais.realizado > totais.planejado ? colors.danger : colors.primary,
                }}
              />
            </div>
            <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>Total Gasto</p>
            <p
              className="text-2xl font-bold"
              style={{
                color: totais.realizado > totais.planejado ? colors.danger : colors.primary,
              }}
            >
              {fmt(totais.realizado)}
            </p>
          </div>
          <div
            className="rounded-2xl p-6 shadow-sm border"
            style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{
                backgroundColor: totais.restante < 0 ? `${colors.danger}/10` : `${colors.success}/10`,
              }}
            >
              <TrendingUp
                className="w-5 h-5"
                style={{
                  color: totais.restante < 0 ? colors.danger : colors.success,
                }}
              />
            </div>
            <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>Saldo Restante</p>
            <p
              className="text-2xl font-bold"
              style={{
                color: totais.restante < 0 ? colors.danger : colors.success,
              }}
            >
              {fmt(totais.restante)}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {alertas.length > 0 && (
          <div
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: `${colors.warning}/10`,
              borderColor: `${colors.warning}/20`,
            }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.warning }} />
              <div>
                <h3 className="font-bold" style={{ color: colors.textPrimary }}>
                  {alertas.length} categoria(s) com alerta
                </h3>
                <div className="space-y-1.5 mt-3">
                  {alertas.map((a) => (
                    <p key={a.id} className="text-sm" style={{ color: colors.textSecondary }}>
                      {a.categoria} — {a.percentual.toFixed(0)}% do orçado
                      {a.status === "excedido" && (
                        <span className="font-medium ml-1" style={{ color: colors.danger }}>
                          (excedido!)
                        </span>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Budgets List */}
        <div
          className="rounded-2xl shadow-sm border overflow-hidden"
          style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
        >
          <div
            className="px-6 py-4"
            style={{
              borderBottom: `1px solid ${colors.borderDefault}`,
            }}
          >
            <h3 className="font-bold text-lg" style={{ color: colors.textPrimary }}>
              Orçamentos — {formatMes(mesSelecionado)}
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-12" style={{ color: colors.textSecondary }}>
              Carregando...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 px-6">
              <PieChart className="w-10 h-10 mx-auto mb-3" style={{ color: `${colors.textSecondary}` }} />
              <p style={{ color: colors.textSecondary }}>Nenhum orçamento para {formatMes(mesSelecionado)}.</p>
              <button
                onClick={() => { resetForm(); setModalOpen(true); }}
                className="mt-3 text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: colors.primary }}
              >
                Criar primeiro orçamento
              </button>
            </div>
          ) : (
            <div style={{ borderTop: `1px solid ${colors.borderDefault}` }}>
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="px-6 py-4 hover:opacity-75 transition-opacity"
                  style={{
                    borderBottom: idx < items.length - 1 ? `1px solid ${colors.borderDefault}` : "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium" style={{ color: colors.textPrimary }}>
                        {item.categoria}
                      </p>
                      {statusBadge(item.status)}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: statusColorValue(item.status) }}>
                          {fmt(item.valorRealizado)} / {fmt(item.valorPlanejado)}
                        </p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>
                          {item.percentual.toFixed(0)}% utilizado
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="hover:opacity-70 transition-opacity p-1"
                        style={{ color: colors.textSecondary }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: colors.borderDefault }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(item.percentual, 100)}%`,
                        backgroundColor:
                          item.status === "excedido"
                            ? colors.danger
                            : item.status === "alerta"
                              ? colors.warning
                              : colors.primary,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div
              className="rounded-2xl w-full max-w-sm border"
              style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg" style={{ color: colors.textPrimary }}>
                    Novo Orçamento
                  </h2>
                  <button
                    onClick={() => { resetForm(); setModalOpen(false); }}
                    style={{ color: colors.textSecondary }}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm mb-1 block" style={{ color: colors.textSecondary }}>
                      Mês *
                    </label>
                    <select
                      value={formMes}
                      onChange={(e) => setFormMes(e.target.value)}
                      required
                      className="w-full rounded-xl px-4 py-2.5 focus:outline-none transition-colors"
                      style={{
                        backgroundColor: colors.bgLighter,
                        borderColor: colors.borderDefault,
                        color: colors.textPrimary,
                        border: `1px solid ${colors.borderDefault}`,
                      }}
                    >
                      {opcoesMeses.map((m) => (
                        <option key={m} value={m}>{formatMes(m)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm mb-1 block" style={{ color: colors.textSecondary }}>
                      Categoria *
                    </label>
                    <select
                      value={formCategoria}
                      onChange={(e) => setFormCategoria(e.target.value)}
                      required
                      className="w-full rounded-xl px-4 py-2.5 focus:outline-none transition-colors"
                      style={{
                        backgroundColor: colors.bgLighter,
                        borderColor: colors.borderDefault,
                        color: colors.textPrimary,
                        border: `1px solid ${colors.borderDefault}`,
                      }}
                    >
                      <option value="">Selecione...</option>
                      {CATEGORIAS_PAYABLES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm mb-1 block" style={{ color: colors.textSecondary }}>
                      Valor Planejado (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formValor}
                      onChange={(e) => setFormValor(e.target.value)}
                      placeholder="0,00"
                      required
                      className="w-full rounded-xl px-4 py-2.5 focus:outline-none transition-colors"
                      style={{
                        backgroundColor: colors.bgLighter,
                        borderColor: colors.borderDefault,
                        color: colors.textPrimary,
                        border: `1px solid ${colors.borderDefault}`,
                      }}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { resetForm(); setModalOpen(false); }}
                      className="flex-1 px-4 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: colors.bgLighter,
                        color: colors.textPrimary,
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={{ backgroundColor: colors.primary }}
                      className="flex-1 text-white font-semibold px-4 py-2.5 rounded-xl transition-opacity hover:opacity-90"
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

  function statusColorValue(status: "ok" | "alerta" | "excedido") {
    if (status === "excedido") return colors.danger;
    if (status === "alerta") return colors.warning;
    return colors.primary;
  }
}
