import { useState } from "react";
import {
  Plus,
  Trash2,
  Package,
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  SlidersHorizontal,
  Search,
  ChevronDown,
  X,
} from "lucide-react";
import { useInventory } from "../contexts/InventoryContext";
import { toast } from "sonner";
import {
  InventoryItem,
  CATEGORIAS_ESTOQUE,
  MOVEMENT_REASONS,
  MovementType,
  MovementReason,
} from "../types/inventory";
import {
  formatCurrency,
  isItemInAlert,
  sortItems,
  filterItems,
  searchItems,
} from "../utils/inventoryCalculations";

type SortBy = "nome" | "quantidade" | "preco" | "valor" | "categoria";
type ModalMode = "item" | "movimento" | null;

export function Estoque() {
  const {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    addMovement,
    getSummary,
    getLimitStatus,
    canAddItem,
    getAlertItems,
  } = useInventory();

  const [modal, setModal] = useState<ModalMode>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"ativo" | "inativo" | "">("");
  const [filtroAlerta, setFiltroAlerta] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("nome");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Form: novo item
  const [formNome, setFormNome] = useState("");
  const [formDescricao, setFormDescricao] = useState("");
  const [formCategoria, setFormCategoria] = useState("");
  const [formQuantidade, setFormQuantidade] = useState("");
  const [formPreco, setFormPreco] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formQtdMinima, setFormQtdMinima] = useState("");

  // Form: movimento
  const [movTipo, setMovTipo] = useState<MovementType>("entrada");
  const [movQuantidade, setMovQuantidade] = useState("");
  const [movMotivo, setMovMotivo] = useState<MovementReason | "">("");
  const [movAnotacoes, setMovAnotacoes] = useState("");
  const [movData, setMovData] = useState(new Date().toISOString().split("T")[0]);

  const summary = getSummary();
  const limitStatus = getLimitStatus();
  const alertItems = getAlertItems();

  // Filter + sort pipeline
  let displayed = searchQuery ? searchItems(items, searchQuery) : items;
  displayed = filterItems(displayed, {
    status: filtroStatus || undefined,
    categoria: filtroCategoria || undefined,
    onlyAlerts: filtroAlerta,
  });
  displayed = sortItems(displayed, sortBy);

  function resetItemForm() {
    setFormNome("");
    setFormDescricao("");
    setFormCategoria("");
    setFormQuantidade("");
    setFormPreco("");
    setFormSku("");
    setFormQtdMinima("");
  }

  function resetMovForm() {
    setMovTipo("entrada");
    setMovQuantidade("");
    setMovMotivo("");
    setMovAnotacoes("");
    setMovData(new Date().toISOString().split("T")[0]);
  }

  function openMovimento(item: InventoryItem) {
    setSelectedItem(item);
    resetMovForm();
    setModal("movimento");
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!canAddItem()) {
      toast.error("Limite atingido — faça upgrade para PRO");
      return;
    }
    try {
      await addItem({
        user_id: "",
        nome: formNome,
        descricao: formDescricao || undefined,
        quantidade: Number(formQuantidade),
        preco_unitario: Number(formPreco),
        categoria: formCategoria,
        sku: formSku || undefined,
        quantidade_minima: formQtdMinima ? Number(formQtdMinima) : undefined,
        status: "ativo",
      });
      toast.success("Item adicionado ao estoque!");
      resetItemForm();
      setModal(null);
    } catch (err: any) {
      toast.error("Erro ao adicionar item", { description: err?.message });
    }
  }

  async function handleMovimento(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await addMovement({
        inventory_id: selectedItem.id,
        user_id: "",
        tipo: movTipo,
        quantidade: Number(movQuantidade),
        motivo: movMotivo as MovementReason | undefined,
        data: movData,
        anotacoes: movAnotacoes || undefined,
      });
      const tipoLabel = movTipo === "entrada" ? "Entrada" : movTipo === "saida" ? "Saída" : "Ajuste";
      toast.success(`${tipoLabel} registrada com sucesso!`);
      resetMovForm();
      setModal(null);
      setSelectedItem(null);
    } catch (err: any) {
      toast.error("Erro ao registrar movimento", { description: err?.message });
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteItem(id);
      toast.success("Item removido do estoque");
    } catch {
      toast.error("Erro ao remover item");
    }
  }

  async function handleToggleStatus(item: InventoryItem) {
    try {
      const novoStatus = item.status === "ativo" ? "inativo" : "ativo";
      await updateItem(item.id, { status: novoStatus });
      toast.success(`Item ${novoStatus === "ativo" ? "ativado" : "desativado"}`);
    } catch {
      toast.error("Erro ao atualizar status");
    }
  }

  const categorias = [...new Set(items.map((i) => i.categoria))].filter(Boolean);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estoque</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie seus produtos e movimentações</p>
        </div>
        <button
          onClick={() => {
            if (!canAddItem()) {
              toast.error("Limite atingido — faça upgrade para PRO");
              return;
            }
            resetItemForm();
            setModal("item");
          }}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Item
        </button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-muted-foreground text-xs">Total de Itens</p>
          <p className="text-foreground text-xl font-bold mt-1">{summary.totalItems}</p>
          <p className="text-muted-foreground text-xs mt-1">{summary.categoryCount} categorias</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-muted-foreground text-xs">Valor em Estoque</p>
          <p className="text-primary text-xl font-bold mt-1">{formatCurrency(summary.totalValue)}</p>
          <p className="text-muted-foreground text-xs mt-1">custo total</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-muted-foreground text-xs">Alertas</p>
          <p className={`text-xl font-bold mt-1 ${alertItems.length > 0 ? "text-red-400" : "text-foreground"}`}>
            {alertItems.length}
          </p>
          <p className="text-muted-foreground text-xs mt-1">abaixo do mínimo</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-muted-foreground text-xs">Uso do Plano</p>
          <p className="text-foreground text-xl font-bold mt-1">
            {limitStatus.used}/{limitStatus.limit === Infinity ? "∞" : limitStatus.limit}
          </p>
          {limitStatus.limit !== Infinity && (
            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
              <div
                className="bg-primary h-1.5 rounded-full"
                style={{ width: `${Math.min(limitStatus.percentage, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Alerta de estoque baixo */}
      {alertItems.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-semibold text-sm">
              {alertItems.length} item(ns) com estoque abaixo do mínimo
            </span>
          </div>
          {alertItems.map((item) => (
            <p key={item.id} className="text-muted-foreground text-xs ml-6">
              • {item.nome} — <span className="text-red-400">{item.quantidade} un</span>{" "}
              (mínimo: {item.quantidade_minima})
            </p>
          ))}
        </div>
      )}

      {/* Filtros e busca */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome ou SKU..."
            className="bg-transparent text-foreground text-sm outline-none w-full placeholder-muted-foreground"
          />
        </div>

        {/* Categoria */}
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-muted-foreground focus:outline-none"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value as "ativo" | "inativo" | "")}
          className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-muted-foreground focus:outline-none"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>

        {/* Ordenar */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-muted-foreground focus:outline-none"
        >
          <option value="nome">Ordenar: Nome</option>
          <option value="quantidade">Ordenar: Quantidade</option>
          <option value="preco">Ordenar: Preço</option>
          <option value="valor">Ordenar: Valor total</option>
          <option value="categoria">Ordenar: Categoria</option>
        </select>

        {/* Toggle alertas */}
        <button
          onClick={() => setFiltroAlerta(!filtroAlerta)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
            filtroAlerta
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : "bg-card text-muted-foreground border-border hover:text-foreground"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Alertas
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Carregando estoque...</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {items.length === 0 ? "Nenhum item cadastrado ainda." : "Nenhum item encontrado com os filtros atuais."}
          </p>
          {items.length === 0 && (
            <button
              onClick={() => { resetItemForm(); setModal("item"); }}
              className="mt-3 text-primary text-sm hover:underline"
            >
              Adicionar primeiro item
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((item) => {
            const alerta = isItemInAlert(item);
            const valorTotal = item.quantidade * item.preco_unitario;
            const isExpanded = expandedItem === item.id;

            return (
              <div
                key={item.id}
                className={`bg-card border rounded-2xl transition-all ${
                  alerta ? "border-red-500/40" : "border-border"
                } ${item.status === "inativo" ? "opacity-50" : ""}`}
              >
                {/* Linha principal */}
                <div className="flex items-center gap-3 p-4">
                  {/* Ícone */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    alerta ? "bg-red-500/20" : "bg-primary/10"
                  }`}>
                    {alerta
                      ? <AlertTriangle className="w-4 h-4 text-red-400" />
                      : <Package className="w-4 h-4 text-primary" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-foreground font-medium truncate">{item.nome}</p>
                      {item.sku && (
                        <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                          {item.sku}
                        </span>
                      )}
                      {item.status === "inativo" && (
                        <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                          inativo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <span className="text-muted-foreground text-xs">{item.categoria}</span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className={`text-xs font-medium ${alerta ? "text-red-400" : "text-muted-foreground"}`}>
                        {item.quantidade} un
                        {item.quantidade_minima ? ` (mín: ${item.quantidade_minima})` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Valor + ações */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-foreground text-sm font-semibold">{formatCurrency(valorTotal)}</p>
                      <p className="text-muted-foreground text-xs">{formatCurrency(item.preco_unitario)}/un</p>
                    </div>

                    <button
                      onClick={() => openMovimento(item)}
                      title="Registrar movimento"
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Expandido */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border pt-3">
                    <div className="sm:hidden mb-3">
                      <p className="text-foreground text-sm font-semibold">{formatCurrency(valorTotal)}</p>
                      <p className="text-muted-foreground text-xs">{formatCurrency(item.preco_unitario)}/un</p>
                    </div>
                    {item.descricao && (
                      <p className="text-muted-foreground text-sm mb-3">{item.descricao}</p>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => openMovimento(item)}
                        className="flex items-center gap-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <ArrowDownCircle className="w-3.5 h-3.5" />
                        Entrada
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          resetMovForm();
                          setMovTipo("saida");
                          setModal("movimento");
                        }}
                        className="flex items-center gap-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        Saída
                      </button>
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 text-muted-foreground px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {item.status === "ativo" ? "Desativar" : "Ativar"}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-colors ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Novo Item */}
      {modal === "item" && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground font-bold text-lg">Novo Item de Estoque</h2>
                <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="text-muted-foreground text-sm mb-1 block">Nome *</label>
                  <input
                    type="text"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="Ex: Camiseta P"
                    required
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground text-sm mb-1 block">Categoria *</label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value)}
                    required
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50"
                  >
                    <option value="">Selecione...</option>
                    {CATEGORIAS_ESTOQUE.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground text-sm mb-1 block">Quantidade *</label>
                    <input
                      type="number"
                      min="0"
                      value={formQuantidade}
                      onChange={(e) => setFormQuantidade(e.target.value)}
                      placeholder="0"
                      required
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm mb-1 block">Preço unit. (R$) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formPreco}
                      onChange={(e) => setFormPreco(e.target.value)}
                      placeholder="0,00"
                      required
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground text-sm mb-1 block">SKU (opcional)</label>
                    <input
                      type="text"
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      placeholder="CAM-P-001"
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm mb-1 block">Qtd. mínima</label>
                    <input
                      type="number"
                      min="0"
                      value={formQtdMinima}
                      onChange={(e) => setFormQtdMinima(e.target.value)}
                      placeholder="10"
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground text-sm mb-1 block">Descrição (opcional)</label>
                  <textarea
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    placeholder="Detalhes do item..."
                    rows={2}
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-foreground px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Movimento */}
      {modal === "movimento" && selectedItem && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-foreground font-bold text-lg">Registrar Movimento</h2>
                <button onClick={() => { setModal(null); setSelectedItem(null); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{selectedItem.nome} — {selectedItem.quantidade} un em estoque</p>

              <form onSubmit={handleMovimento} className="space-y-4">
                {/* Tipo */}
                <div>
                  <label className="text-muted-foreground text-sm mb-2 block">Tipo de movimento *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["entrada", "saida", "ajuste"] as MovementType[]).map((tipo) => (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => setMovTipo(tipo)}
                        className={`py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                          movTipo === tipo
                            ? tipo === "entrada"
                              ? "bg-primary/20 text-primary border border-[#2DDB81]/40"
                              : tipo === "saida"
                              ? "bg-red-500/20 text-red-400 border border-red-500/40"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                            : "bg-input-background text-muted-foreground border border-border hover:text-foreground"
                        }`}
                      >
                        {tipo === "entrada" ? "Entrada" : tipo === "saida" ? "Saída" : "Ajuste"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground text-sm mb-1 block">
                      {movTipo === "ajuste" ? "Nova quantidade *" : "Quantidade *"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={movQuantidade}
                      onChange={(e) => setMovQuantidade(e.target.value)}
                      placeholder="0"
                      required
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm mb-1 block">Data *</label>
                    <input
                      type="date"
                      value={movData}
                      onChange={(e) => setMovData(e.target.value)}
                      required
                      className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground text-sm mb-1 block">Motivo</label>
                  <select
                    value={movMotivo}
                    onChange={(e) => setMovMotivo(e.target.value as MovementReason | "")}
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50"
                  >
                    <option value="">Selecione...</option>
                    {MOVEMENT_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground text-sm mb-1 block">Anotações (opcional)</label>
                  <textarea
                    value={movAnotacoes}
                    onChange={(e) => setMovAnotacoes(e.target.value)}
                    placeholder="Observações..."
                    rows={2}
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>

                {movTipo !== "ajuste" && movQuantidade && (
                  <div className={`text-xs px-3 py-2 rounded-lg ${
                    movTipo === "entrada"
                      ? "bg-primary/10 text-primary"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    Novo saldo: {
                      movTipo === "entrada"
                        ? selectedItem.quantidade + Number(movQuantidade)
                        : Math.max(0, selectedItem.quantidade - Number(movQuantidade))
                    } un
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setModal(null); setSelectedItem(null); }}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-foreground px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Confirmar
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
