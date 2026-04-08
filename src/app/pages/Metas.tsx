import { useState } from "react";
import { Plus, Target, X, Trash2, TrendingUp, Crown, Lock } from "lucide-react";
import { useGoals } from "../contexts/GoalsContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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

  if (user?.plan !== "pro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-16 h-16 bg-[#28A263]/10 rounded-2xl flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-[#28A263]" />
        </div>
        <h2 className="text-2xl font-bold text-[#001529] mb-3">Metas de Receita são exclusivas do PRO</h2>
        <p className="text-[rgba(0,21,41,0.6)] mb-8 max-w-md">
          Defina metas mensais e acompanhe seu progresso em tempo real com o plano PRO.
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

  const [modalOpen, setModalOpen] = useState(false);
  const [formMes, setFormMes] = useState(mesAtual());
  const [formValor, setFormValor] = useState("");
  const [formCategoria, setFormCategoria] = useState("");

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
    if (percentual >= 100) return "bg-[#28A263]";
    if (percentual >= 70) return "bg-yellow-500";
    return "bg-red-500";
  }

  function corTexto(percentual: number) {
    if (percentual >= 100) return "text-[#28A263]";
    if (percentual >= 70) return "text-yellow-600";
    return "text-red-500";
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#001529]">Metas de Receita</h1>
          <p className="text-[rgba(0,21,41,0.6)] text-sm mt-1">Defina e acompanhe suas metas mensais</p>
        </div>
        <button
          onClick={() => { resetForm(); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#28A263] hover:bg-[#1f7a4a] text-white font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </div>

      {/* Card principal — mês atual */}
      {loading ? (
        <div className="text-center py-12 text-[rgba(0,21,41,0.6)]">Carregando...</div>
      ) : metaMesAtual ? (
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[rgba(0,21,41,0.6)] text-sm">{formatMes(mesAtual())}</p>
              <h2 className="text-[#001529] text-2xl font-bold mt-1">
                {fmt(metaMesAtual.valorRealizado)}
                <span className="text-[rgba(0,21,41,0.6)] text-base font-normal"> / {fmt(metaMesAtual.valorMeta)}</span>
              </h2>
              {metaMesAtual.categoria && (
                <p className="text-[rgba(0,21,41,0.6)] text-xs mt-1">Foco: {metaMesAtual.categoria}</p>
              )}
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${corTexto(metaMesAtual.percentual)}`}>
                {metaMesAtual.percentual.toFixed(0)}%
              </p>
              <p className="text-[rgba(0,21,41,0.6)] text-xs mt-1">
                {metaMesAtual.status === "alcancada"
                  ? "✅ Meta atingida!"
                  : `${diasRestantesNoMes()} dias restantes`}
              </p>
            </div>
          </div>

          {/* Barra */}
          <div className="w-full bg-[#E8E8E8] rounded-full h-3 mb-3">
            <div
              className={`h-3 rounded-full transition-all ${corProgresso(metaMesAtual.percentual)}`}
              style={{ width: `${Math.min(metaMesAtual.percentual, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-[rgba(0,21,41,0.6)]">
            <span>Falta: {fmt(Math.max(0, metaMesAtual.valorMeta - metaMesAtual.valorRealizado))}</span>
            <button onClick={() => handleDelete(metaMesAtual.id)} className="text-[rgba(0,21,41,0.6)] hover:text-red-500 transition-colors flex items-center gap-1">
              <Trash2 className="w-3 h-3" />
              Remover meta
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-dashed border-[rgba(0,0,0,0.2)] rounded-2xl p-8 mb-6 text-center">
          <Target className="w-10 h-10 text-[rgba(0,21,41,0.6)] mx-auto mb-3" />
          <p className="text-[rgba(0,21,41,0.6)] mb-2">Nenhuma meta definida para {formatMes(mesAtual())}</p>
          <button
            onClick={() => { resetForm(); setModalOpen(true); }}
            className="text-[#28A263] text-sm hover:underline"
          >
            Definir meta do mês
          </button>
        </div>
      )}

      {/* Histórico */}
      {historico.length > 0 && (
        <div>
          <h2 className="text-[#001529] font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#28A263]" />
            Histórico
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {historico.map((goal) => {
              const [ano, m] = goal.mes.split("-");
              const isAtual = goal.mes === mesAtual();
              return (
                <div
                  key={goal.id}
                  className={`bg-white border rounded-2xl p-4 ${
                    goal.status === "alcancada"
                      ? "border-[#28A263]/30"
                      : goal.status === "nao_alcancada"
                      ? "border-red-500/30"
                      : "border-[rgba(0,0,0,0.1)]"
                  }`}
                >
                  <p className="text-[rgba(0,21,41,0.6)] text-xs">
                    {MESES_NOMES[parseInt(m) - 1]} {ano}
                    {isAtual && <span className="ml-1 text-[#28A263]">• atual</span>}
                  </p>
                  <p className={`text-lg font-bold mt-1 ${corTexto(goal.percentual)}`}>
                    {goal.percentual.toFixed(0)}%
                  </p>
                  <p className="text-[rgba(0,21,41,0.6)] text-xs mt-0.5">
                    {fmt(goal.valorRealizado)} / {fmt(goal.valorMeta)}
                  </p>
                  {/* Mini barra */}
                  <div className="w-full bg-[#E8E8E8] rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full ${corProgresso(goal.percentual)}`}
                      style={{ width: `${Math.min(goal.percentual, 100)}%` }}
                    />
                  </div>
                  <p className="text-[rgba(0,21,41,0.6)] text-xs mt-1.5">
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
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl w-full max-w-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#001529] font-bold text-lg">Nova Meta</h2>
                <button onClick={() => { resetForm(); setModalOpen(false); }} className="text-[rgba(0,21,41,0.6)] hover:text-[#001529]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[rgba(0,21,41,0.6)] text-sm mb-1 block">Mês *</label>
                  <select
                    value={formMes}
                    onChange={(e) => setFormMes(e.target.value)}
                    required
                    className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-xl px-4 py-2.5 text-[#001529] focus:outline-none focus:border-[#28A263]/50"
                  >
                    {opcoesMeses.map((m) => (
                      <option key={m} value={m}>{formatMes(m)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[rgba(0,21,41,0.6)] text-sm mb-1 block">Meta de Receita (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formValor}
                    onChange={(e) => setFormValor(e.target.value)}
                    placeholder="Ex: 10.000,00"
                    required
                    className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-xl px-4 py-2.5 text-[#001529] placeholder-[rgba(0,21,41,0.4)] focus:outline-none focus:border-[#28A263]/50"
                  />
                </div>

                <div>
                  <label className="text-[rgba(0,21,41,0.6)] text-sm mb-1 block">Categoria focada (opcional)</label>
                  <input
                    type="text"
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value)}
                    placeholder="Ex: Consultoria, Vendas..."
                    className="w-full bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-xl px-4 py-2.5 text-[#001529] placeholder-[rgba(0,21,41,0.4)] focus:outline-none focus:border-[#28A263]/50"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { resetForm(); setModalOpen(false); }} className="flex-1 bg-[#F8F9FA] hover:bg-[#F5F7FA] text-[#001529] px-4 py-2.5 rounded-xl transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 bg-[#28A263] hover:bg-[#1f7a4a] text-white font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    Definir Meta
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
