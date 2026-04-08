import { useState } from "react";
import { Plus, Trash2, Users, Search, X, Pencil } from "lucide-react";
import { useContacts, Contact } from "../contexts/ContactsContext";
import { toast } from "sonner";

type Filtro = "todos" | "cliente" | "fornecedor";

export function ClientesFornecedores() {
  const { contacts, loading, addContact, updateContact, deleteContact, getLimitStatus, canAddContact } = useContacts();

  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Contact | null>(null);

  const [formNome, setFormNome] = useState("");
  const [formTipo, setFormTipo] = useState<"cliente" | "fornecedor" | "ambos">("cliente");
  const [formEmail, setFormEmail] = useState("");
  const [formTelefone, setFormTelefone] = useState("");
  const [formDocumento, setFormDocumento] = useState("");
  const [formCidade, setFormCidade] = useState("");
  const [formEndereco, setFormEndereco] = useState("");
  const [formAnotacoes, setFormAnotacoes] = useState("");

  const limitStatus = getLimitStatus();

  const totalClientes = contacts.filter((c) => (c.tipo === "cliente" || c.tipo === "ambos") && c.ativo).length;
  const totalFornecedores = contacts.filter((c) => (c.tipo === "fornecedor" || c.tipo === "ambos") && c.ativo).length;

  let displayed = filtro === "todos"
    ? contacts
    : contacts.filter((c) => c.tipo === filtro || c.tipo === "ambos");

  if (busca) {
    const q = busca.toLowerCase();
    displayed = displayed.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.documento?.includes(q) ||
        c.cidade?.toLowerCase().includes(q)
    );
  }

  function resetForm() {
    setFormNome("");
    setFormTipo("cliente");
    setFormEmail("");
    setFormTelefone("");
    setFormDocumento("");
    setFormCidade("");
    setFormEndereco("");
    setFormAnotacoes("");
    setEditando(null);
  }

  function abrirEditar(contact: Contact) {
    setEditando(contact);
    setFormNome(contact.nome);
    setFormTipo(contact.tipo);
    setFormEmail(contact.email || "");
    setFormTelefone(contact.telefone || "");
    setFormDocumento(contact.documento || "");
    setFormCidade(contact.cidade || "");
    setFormEndereco(contact.endereco || "");
    setFormAnotacoes(contact.anotacoes || "");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formNome || !formTipo) { toast.error("Preencha os campos obrigatórios"); return; }

    try {
      const data = {
        nome: formNome,
        tipo: formTipo,
        email: formEmail || undefined,
        telefone: formTelefone || undefined,
        documento: formDocumento || undefined,
        cidade: formCidade || undefined,
        endereco: formEndereco || undefined,
        anotacoes: formAnotacoes || undefined,
        ativo: true,
      };

      if (editando) {
        await updateContact(editando.id, data);
        toast.success("Contato atualizado!");
      } else {
        if (!canAddContact()) { toast.error("Limite atingido — faça upgrade para PRO"); return; }
        await addContact(data);
        toast.success("Contato adicionado!");
      }

      resetForm();
      setModalOpen(false);
    } catch (error: any) {
      toast.error("Erro ao salvar contato", { description: error?.message });
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteContact(id);
      toast.success("Contato removido");
    } catch {
      toast.error("Erro ao remover contato");
    }
  }

  function tipoBadge(tipo: Contact["tipo"]) {
    if (tipo === "cliente") return <span className="text-[10px] px-2 py-0.5 bg-primary/15 text-primary rounded-full font-medium">Cliente</span>;
    if (tipo === "fornecedor") return <span className="text-[10px] px-2 py-0.5 bg-blue-500/15 text-blue-400 rounded-full font-medium">Fornecedor</span>;
    return <span className="text-[10px] px-2 py-0.5 bg-purple-500/15 text-purple-400 rounded-full font-medium">Ambos</span>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001529] mb-1">Clientes & Fornecedores</h1>
          <p className="text-[rgba(0,21,41,0.6)]">Gerencie seus contatos comerciais</p>
        </div>
        <button
          onClick={() => { if (!canAddContact()) { toast.error("Limite atingido — faça upgrade para PRO"); return; } resetForm(); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#28A263] hover:bg-[#1f7d4a] text-white font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Contato
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.1)]">
          <div className="w-11 h-11 bg-[#0066FF]/20 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-[#0066FF]" />
          </div>
          <p className="text-sm text-[rgba(0,21,41,0.6)] mb-1">Total de Contatos</p>
          <p className="text-2xl font-bold text-[#001529]">{contacts.length}</p>
          <p className="text-xs text-[rgba(0,21,41,0.5)] mt-2">ativos e inativos</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.1)]">
          <div className="w-11 h-11 bg-[#28A263]/20 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-[#28A263]" />
          </div>
          <p className="text-sm text-[rgba(0,21,41,0.6)] mb-1">Clientes</p>
          <p className="text-2xl font-bold text-[#28A263]">{totalClientes}</p>
          <p className="text-xs text-[rgba(0,21,41,0.5)] mt-2">ativos</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-[rgba(0,0,0,0.1)]">
          <div className="w-11 h-11 bg-[#0066FF]/20 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-[#0066FF]" />
          </div>
          <p className="text-sm text-[rgba(0,21,41,0.6)] mb-1">Fornecedores</p>
          <p className="text-2xl font-bold text-[#0066FF]">{totalFornecedores}</p>
          <p className="text-xs text-[rgba(0,21,41,0.5)] mt-2">ativos</p>
        </div>
      </div>

      {/* Busca + Filtros */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, email ou CPF/CNPJ..."
            className="bg-transparent text-foreground text-sm outline-none w-full placeholder-muted-foreground"
          />
        </div>
        {(["todos", "cliente", "fornecedor"] as Filtro[]).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filtro === f ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            {f === "todos" ? "Todos" : f === "cliente" ? "Clientes" : "Fornecedores"}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-2xl">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {contacts.length === 0 ? "Nenhum contato cadastrado ainda." : "Nenhum contato encontrado."}
          </p>
          {contacts.length === 0 && (
            <button onClick={() => { resetForm(); setModalOpen(true); }} className="mt-3 text-primary text-sm hover:underline">
              Adicionar primeiro contato
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((contact) => (
            <div key={contact.id} className={`bg-card border border-border rounded-2xl p-4 flex items-center gap-4 ${!contact.ativo ? "opacity-50" : ""}`}>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-foreground font-bold text-sm">{contact.nome.charAt(0).toUpperCase()}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-foreground font-medium truncate">{contact.nome}</p>
                  {tipoBadge(contact.tipo)}
                </div>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  {contact.email && <span className="text-muted-foreground text-xs">{contact.email}</span>}
                  {contact.telefone && (
                    <>
                      {contact.email && <span className="text-muted-foreground text-xs">•</span>}
                      <span className="text-muted-foreground text-xs">{contact.telefone}</span>
                    </>
                  )}
                  {contact.cidade && (
                    <>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs">{contact.cidade}</span>
                    </>
                  )}
                  {contact.documento && (
                    <>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs">{contact.documento}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => abrirEditar(contact)}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Limite */}
      {limitStatus.limit !== Infinity && (
        <div className="mt-6 bg-card border border-border rounded-2xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Contatos cadastrados</span>
            <span className="text-foreground">{limitStatus.used}/{limitStatus.limit}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${Math.min(limitStatus.percentage, 100)}%` }} />
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground font-bold text-lg">{editando ? "Editar Contato" : "Novo Contato"}</h2>
                <button onClick={() => { resetForm(); setModalOpen(false); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-muted-foreground text-sm mb-1 block">Nome *</label>
                  <input
                    type="text"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    placeholder="Nome completo ou razão social"
                    required
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground text-sm mb-1 block">Tipo *</label>
                  <select
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value as "cliente" | "fornecedor" | "ambos")}
                    required
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-primary/50"
                  >
                    <option value="cliente">Cliente</option>
                    <option value="fornecedor">Fornecedor</option>
                    <option value="ambos">Ambos</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground text-sm mb-1 block">Email</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm mb-1 block">Telefone</label>
                    <input
                      type="text"
                      value={formTelefone}
                      onChange={(e) => setFormTelefone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground text-sm mb-1 block">CPF / CNPJ</label>
                    <input
                      type="text"
                      value={formDocumento}
                      onChange={(e) => setFormDocumento(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm mb-1 block">Cidade</label>
                    <input
                      type="text"
                      value={formCidade}
                      onChange={(e) => setFormCidade(e.target.value)}
                      placeholder="São Paulo"
                      className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground text-sm mb-1 block">Endereço</label>
                  <input
                    type="text"
                    value={formEndereco}
                    onChange={(e) => setFormEndereco(e.target.value)}
                    placeholder="Rua, número, bairro"
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground text-sm mb-1 block">Anotações</label>
                  <textarea
                    value={formAnotacoes}
                    onChange={(e) => setFormAnotacoes(e.target.value)}
                    placeholder="Observações..."
                    rows={2}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { resetForm(); setModalOpen(false); }}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-foreground px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    {editando ? "Salvar" : "Adicionar"}
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
