import { useState } from "react";
import { Plus, Trash2, AlertTriangle, X, PieChart, Crown, Lock } from "lucide-react";
import { useBudgets } from "../contexts/BudgetsContext";
import { CATEGORIAS_PAYABLES } from "../contexts/PayablesContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#001529]">Orçamentos</h1>
          <p className="text-[rgba(0,21,41,0.6)] text-sm mt-1">Planeje seus gastos por categoria</p>
        </div>
        <button
          onClick={() => { resetForm(); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#28A263] hover:bg-[#1f7a4a] text-white font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Orçamento
        </button>
      </div>

      {/* Seletor de mês */}
      <div className="mb-6">
        <select
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
          className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl px-4 py-2.5 text-[#001529] focus:outline-none focus:border-[#28A263]/50"
        >
          {opcoesMeses.map((m) => (
            <option key={m} value={m}>{formatMes(m)}</option>
          ))}
        </select>
      </div>

      {/* Cards totais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-4">
          <p className="text-[rgba(0,21,41,0.6)] text-sm">Total Orçado</p>
          <p className="text-[#001529] text-xl font-bold mt-1">{fmt(totais.planejado)}</p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-4">
          <p className="text-[rgba(0,21,41,0.6)] text-sm">Total Gasto</p>
          <p className={`text-xl font-bold mt-1 ${totais.realizado > totais.planejado ? "text-red-500" : "text-[#28A263]"}`}>
            {fmt(totais.realizado)}
          </p>
        </div>
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-4">
          <p className="text-[rgba(0,21,41,0.6)] text-sm">Saldo Restante</p>
          <p className={`text-xl font-bold mt-1 ${totais.restante < 0 ? "text-red-500" : "text-[#28A263]"}`}>
            {fmt(totais.restante)}
          </p>
        </div>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-700 font-semibold text-sm">
              {alertas.length} categoria(s) com alerta
            </span>
          </div>
          {alertas.map((a) => (
            <p key={a.id} className="text-[rgba(0,21,41,0.6)] text-xs ml-6">
              • {a.categoria} — {a.percentual.toFixed(0)}% do orçado{" "}
              {a.status === "excedido" && <span className="text-red-600">(excedido!)</span>}
            </p>
          ))}
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-[rgba(0,21,41,0.6)]">Carregando...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-2xl">
          <PieChart className="w-10 h-10 text-[rgba(0,21,41,0.6)] mx-auto mb-3" />
          <p className="text-[rgba(0,21,41,0.6)]">Nenhum orçamento para {formatMes(mesSelecionado)}.</p>
          <button onClick={() => { resetForm(); setModalOpen(true); }} className="mt-3 text-[#28A263] text-sm hover:underline">
            Criar primeiro orçamento
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <p className="text-[#001529] font-medium">{item.categoria}</p>
                  {statusBadge(item.status)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-sm font-bold ${statusColor(item.status)}`}>
                      {fmt(item.valorRealizado)} / {fmt(item.valorPlanejado)}
                    </p>
                    <p className="text-[rgba(0,21,41,0.6)] text-xs">{item.percentual.toFixed(0)}% utilizado</p>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="text-[rgba(0,21,41,0.6)] hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Barra de progresso */}
              <div className="w-full bg-[#E8E8E8] rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    item.status === "excedido" ? "bg-red-500" : item.status === "alerta" ? "bg-yellow-500" : "bg-[#28A263]"
                  }`}
                  style={{ width: `${Math.min(item.percentual, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl w-full max-w-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#001529] font-bold text-lg">Novo Orçamento</h2>
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

                <div>
                  <label className="text-[rgba(0,21,41,0.6)] text-sm mb-1 block">Valor Planejado (R$) *</label>
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

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { resetForm(); setModalOpen(false); }} className="flex-1 bg-[#F8F9FA] hover:bg-[#F5F7FA] text-[#001529] px-4 py-2.5 rounded-xl transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 bg-[#28A263] hover:bg-[#1f7a4a] text-white font-semibold px-4 py-2.5 rounded-xl transition-colors">
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
