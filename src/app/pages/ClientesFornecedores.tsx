import { useState } from "react";
import {
  Plus,
  Search,
  User,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Mail,
  Phone,
  FileText,
  MapPin,
  StickyNote,
  X,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { KPICard } from "../components/KPICard";
import { useContacts, Contact } from "../contexts/ContactsContext";
import { toast } from "sonner";

// ─── Tipo do formulário ────────────────────────────────────────────────────────
interface ContactFormState {
  nome: string;
  tipo: "cliente" | "ambos";
  email: string;
  telefone: string;
  documento: string;
  endereco: string;
  cidade: string;
  anotacoes: string;
  ativo: boolean;
}

const emptyForm: ContactFormState = {
  nome: "",
  tipo: "cliente",
  email: "",
  telefone: "",
  documento: "",
  endereco: "",
  cidade: "",
  anotacoes: "",
  ativo: true,
};

// ─── Modal de formulário ───────────────────────────────────────────────────────
interface ContactModalProps {
  title: string;
  initial: ContactFormState;
  onClose: () => void;
  onSave: (data: ContactFormState) => Promise<void>;
}

function ContactModal({ title, initial, onClose, onSave }: ContactModalProps) {
  const [form, setForm] = useState<ContactFormState>(initial);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) {
      toast.error("O nome é obrigatório");
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast.error("Erro ao salvar contato");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Nome <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
              placeholder="Nome do cliente"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
            <select
              value={form.tipo}
              onChange={(e) => set("tipo", e.target.value as "cliente" | "ambos")}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
            >
              <option value="cliente">Cliente</option>
              <option value="ambos">Cliente e Fornecedor</option>
            </select>
          </div>

          {/* Email + Telefone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="email@exemplo.com"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Telefone</label>
              <input
                type="text"
                value={form.telefone}
                onChange={(e) => set("telefone", e.target.value)}
                placeholder="(11) 9 9999-9999"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Documento */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              CPF / CNPJ
            </label>
            <input
              type="text"
              value={form.documento}
              onChange={(e) => set("documento", e.target.value)}
              placeholder="000.000.000-00"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Endereço + Cidade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Endereço</label>
              <input
                type="text"
                value={form.endereco}
                onChange={(e) => set("endereco", e.target.value)}
                placeholder="Rua, número"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Cidade</label>
              <input
                type="text"
                value={form.cidade}
                onChange={(e) => set("cidade", e.target.value)}
                placeholder="São Paulo"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Anotações */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Anotações</label>
            <textarea
              value={form.anotacoes}
              onChange={(e) => set("anotacoes", e.target.value)}
              placeholder="Observações adicionais..."
              rows={3}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Ativo toggle */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-foreground">Ativo</span>
            <button
              type="button"
              onClick={() => set("ativo", !form.ativo)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.ativo ? "bg-primary" : "bg-secondary border border-border"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.ativo ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal de confirmação de exclusão ─────────────────────────────────────────
interface DeleteModalProps {
  name: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function DeleteModal({ name, onClose, onConfirm }: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      toast.error("Erro ao excluir contato");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Excluir cliente</h3>
            <p className="text-xs text-muted-foreground">Esta ação não pode ser desfeita</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Tem certeza que deseja excluir <strong className="text-foreground">{name}</strong>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2 rounded-lg bg-destructive text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card individual de cliente ────────────────────────────────────────────────
interface ContactCardProps {
  contact: Contact;
  onEdit: (c: Contact) => void;
  onDelete: (c: Contact) => void;
}

function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-md">
      {/* Header row – always visible */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-primary" />
        </div>

        {/* Name + badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground truncate">{contact.nome}</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                contact.tipo === "ambos"
                  ? "bg-purple-500/10 text-purple-400"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {contact.tipo === "ambos" ? "Cliente/Fornecedor" : "Cliente"}
            </span>
            {!contact.ativo && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive">
                Inativo
              </span>
            )}
          </div>
          {contact.email && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{contact.email}</p>
          )}
        </div>

        {/* Actions + chevron */}
        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(contact)}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(contact)}
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="text-muted-foreground ml-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="border-t border-border px-4 py-3 space-y-2 bg-secondary/30">
          {contact.telefone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{contact.telefone}</span>
            </div>
          )}
          {contact.documento && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{contact.documento}</span>
            </div>
          )}
          {(contact.endereco || contact.cidade) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {[contact.endereco, contact.cidade].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
          {contact.anotacoes && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <StickyNote className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{contact.anotacoes}</span>
            </div>
          )}
          {!contact.telefone &&
            !contact.documento &&
            !contact.endereco &&
            !contact.cidade &&
            !contact.anotacoes && (
              <p className="text-xs text-muted-foreground italic">Sem informações adicionais</p>
            )}
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────
export function ClientesFornecedores() {
  const {
    loading,
    addContact,
    updateContact,
    deleteContact,
    getClientes,
    canAddContact,
    getLimitStatus,
  } = useContacts();

  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  // Clientes = tipo "cliente" | "ambos"
  const clientes = getClientes();

  // Filtro local de busca
  const filtered = clientes.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.nome.toLowerCase().includes(q) ||
      (c.email?.toLowerCase().includes(q) ?? false) ||
      (c.documento?.toLowerCase().includes(q) ?? false)
    );
  });

  // KPIs
  const totalClientes = clientes.length;
  const clientesAtivos = clientes.filter((c) => c.ativo).length;
  const clientesAmbos = clientes.filter((c) => c.tipo === "ambos").length;
  const limitStatus = getLimitStatus();

  // Handlers
  function handleNewClick() {
    if (!canAddContact()) {
      toast.error(
        `Limite de ${limitStatus.limit} contatos atingido. Faça upgrade para Pro para adicionar mais.`
      );
      return;
    }
    setShowCreateModal(true);
  }

  async function handleCreate(data: ContactFormState) {
    await addContact({ ...data });
    toast.success("Cliente adicionado com sucesso!");
  }

  async function handleEdit(data: ContactFormState) {
    if (!editTarget) return;
    await updateContact(editTarget.id, { ...data });
    toast.success("Cliente atualizado com sucesso!");
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteContact(deleteTarget.id);
    toast.success("Cliente excluído com sucesso!");
  }

  function openEdit(contact: Contact) {
    setEditTarget(contact);
  }

  function openDelete(contact: Contact) {
    setDeleteTarget(contact);
  }

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie seus clientes e acompanhe o histórico
          </p>
        </div>
        <button
          onClick={handleNewClick}
          className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          icon={Users}
          label="Total de Clientes"
          value={totalClientes}
          description={`${limitStatus.used} de ${limitStatus.limit === Infinity ? "ilimitado" : limitStatus.limit} contatos usados`}
          color="blue"
        />
        <KPICard
          icon={UserCheck}
          label="Clientes Ativos"
          value={clientesAtivos}
          description={`${totalClientes - clientesAtivos} inativos`}
          color="green"
        />
        <KPICard
          icon={TrendingUp}
          label="Cliente e Fornecedor"
          value={clientesAmbos}
          description="Contatos com papel duplo"
          color="purple"
        />
      </div>

      {/* ── Limit warning ── */}
      {limitStatus.limit !== Infinity && limitStatus.percentage >= 80 && (
        <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <p className="text-sm text-orange-400">
            Você usou {limitStatus.used} de {limitStatus.limit} contatos ({Math.round(limitStatus.percentage)}%).{" "}
            <span className="font-semibold">Faça upgrade para Pro para remover o limite.</span>
          </p>
        </div>
      )}

      {/* ── Search ── */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email ou documento..."
            className="bg-transparent border-none outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Contact list ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            {search ? "Nenhum cliente encontrado para essa busca." : "Nenhum cliente cadastrado ainda."}
          </p>
          {!search && (
            <button
              onClick={handleNewClick}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              <Plus className="w-4 h-4" />
              Adicionar Primeiro Cliente
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {/* ── Create modal ── */}
      {showCreateModal && (
        <ContactModal
          title="Novo Cliente"
          initial={emptyForm}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
        />
      )}

      {/* ── Edit modal ── */}
      {editTarget && (
        <ContactModal
          title="Editar Cliente"
          initial={{
            nome: editTarget.nome,
            tipo: editTarget.tipo === "fornecedor" ? "ambos" : (editTarget.tipo as "cliente" | "ambos"),
            email: editTarget.email ?? "",
            telefone: editTarget.telefone ?? "",
            documento: editTarget.documento ?? "",
            endereco: editTarget.endereco ?? "",
            cidade: editTarget.cidade ?? "",
            anotacoes: editTarget.anotacoes ?? "",
            ativo: editTarget.ativo,
          }}
          onClose={() => setEditTarget(null)}
          onSave={handleEdit}
        />
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.nome}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
