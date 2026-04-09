import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { pb, getVerifiedPlan } from "../../lib/pocketbase";

export interface Contact {
  id: string;
  nome: string;
  tipo: "cliente" | "fornecedor" | "ambos";
  email?: string;
  telefone?: string;
  documento?: string;
  endereco?: string;
  cidade?: string;
  anotacoes?: string;
  ativo: boolean;
  createdAt: Date;
}

interface ContactsContextType {
  contacts: Contact[];
  loading: boolean;
  addContact: (contact: Omit<Contact, "id" | "createdAt">) => Promise<void>;
  updateContact: (id: string, contact: Partial<Omit<Contact, "id" | "createdAt">>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  getClientes: () => Contact[];
  getFornecedores: () => Contact[];
  searchContacts: (query: string) => Contact[];
  getLimitStatus: () => { used: number; limit: number; percentage: number };
  canAddContact: () => boolean;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

const FREE_LIMIT = 30;

export function ContactsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setContacts([]);
      return;
    }

    async function fetchContacts() {
      setLoading(true);
      try {
        const records = await pb.collection("contacts").getList(1, 500, {
          filter: `userid = "${user.id}"`,
          sort: "nome",
          requestKey: null,
        });

        setContacts(
          records.items.map((c) => ({
            id: c.id,
            nome: c.nome,
            tipo: c.tipo as "cliente" | "fornecedor" | "ambos",
            email: c.email || undefined,
            telefone: c.telefone || undefined,
            documento: c.documento || undefined,
            endereco: c.endereco || undefined,
            cidade: c.cidade || undefined,
            anotacoes: c.anotacoes || undefined,
            ativo: c.ativo ?? true,
            createdAt: new Date(c.created),
          }))
        );
      } catch (error) {
        console.error("Erro ao buscar contatos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, [user?.id]);

  async function addContact(data: Omit<Contact, "id" | "createdAt">) {
    if (!user) throw new Error("Usuário não autenticado");
    const plan = await getVerifiedPlan(user.id);
    if (plan !== "pro" && contacts.length >= FREE_LIMIT) throw new Error("Limite de contatos atingido");

    const createData: Record<string, unknown> = {
      userid: user.id,
      nome: data.nome,
      tipo: data.tipo,
      ativo: data.ativo,
    };

    if (data.email) createData.email = data.email;
    if (data.telefone) createData.telefone = data.telefone;
    if (data.documento) createData.documento = data.documento;
    if (data.endereco) createData.endereco = data.endereco;
    if (data.cidade) createData.cidade = data.cidade;
    if (data.anotacoes) createData.anotacoes = data.anotacoes;

    const record = await pb.collection("contacts").create(createData);

    const newContact: Contact = {
      id: record.id,
      nome: record.nome,
      tipo: record.tipo,
      email: record.email || undefined,
      telefone: record.telefone || undefined,
      documento: record.documento || undefined,
      endereco: record.endereco || undefined,
      cidade: record.cidade || undefined,
      anotacoes: record.anotacoes || undefined,
      ativo: record.ativo ?? true,
      createdAt: new Date(record.created),
    };

    setContacts([newContact, ...contacts]);
  }

  async function updateContact(id: string, data: Partial<Omit<Contact, "id" | "createdAt">>) {
    if (!user) throw new Error("Usuário não autenticado");

    const updateData: Record<string, unknown> = {};
    if (data.nome) updateData.nome = data.nome;
    if (data.tipo) updateData.tipo = data.tipo;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.telefone !== undefined) updateData.telefone = data.telefone;
    if (data.documento !== undefined) updateData.documento = data.documento;
    if (data.endereco !== undefined) updateData.endereco = data.endereco;
    if (data.cidade !== undefined) updateData.cidade = data.cidade;
    if (data.anotacoes !== undefined) updateData.anotacoes = data.anotacoes;
    if (data.ativo !== undefined) updateData.ativo = data.ativo;

    await pb.collection("contacts").update(id, updateData);
    setContacts(contacts.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }

  async function deleteContact(id: string) {
    if (!user) throw new Error("Usuário não autenticado");
    await pb.collection("contacts").delete(id);
    setContacts(contacts.filter((c) => c.id !== id));
  }

  function getClientes() {
    return contacts.filter((c) => (c.tipo === "cliente" || c.tipo === "ambos") && c.ativo);
  }

  function getFornecedores() {
    return contacts.filter((c) => (c.tipo === "fornecedor" || c.tipo === "ambos") && c.ativo);
  }

  function searchContacts(query: string) {
    const q = query.toLowerCase();
    return contacts.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.documento?.includes(q) ||
        c.cidade?.toLowerCase().includes(q)
    );
  }

  function getLimitStatus() {
    const used = contacts.length;
    const limit = user?.plan === "pro" ? Infinity : FREE_LIMIT;
    const percentage = limit === Infinity ? 0 : (used / limit) * 100;
    return { used, limit, percentage };
  }

  function canAddContact(): boolean {
    if (user?.plan === "pro") return true;
    const { used, limit } = getLimitStatus();
    return used < limit;
  }

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        loading,
        addContact,
        updateContact,
        deleteContact,
        getClientes,
        getFornecedores,
        searchContacts,
        getLimitStatus,
        canAddContact,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts(): ContactsContextType {
  const context = useContext(ContactsContext);
  if (!context) throw new Error("useContacts deve ser usado dentro de ContactsProvider");
  return context;
}
