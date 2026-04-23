import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { pb } from "../../lib/pocketbase";

export interface Conversation {
  id: string;
  userId: string;
  status: "open" | "closed";
  isTicket: boolean;
  created: string;
  updated: string;
  userName?: string;
  userEmail?: string;
}

export interface SupportMessage {
  id: string;
  conversationId: string;
  sender: "user" | "admin";
  content: string;
  created: string;
}

interface SupportContextType {
  myConversation: Conversation | null;
  messages: SupportMessage[];
  loadingConversation: boolean;
  sendMessage: (content: string) => Promise<void>;
  markAsTicket: () => Promise<void>;
  conversations: Conversation[];
  selectedId: string | null;
  selectedMessages: SupportMessage[];
  loadingAdmin: boolean;
  selectConversation: (id: string) => Promise<void>;
  adminReply: (content: string) => Promise<void>;
  updateStatus: (id: string, status: "open" | "closed") => Promise<void>;
  toggleTicket: (id: string, current: boolean) => Promise<void>;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

const POLL_MS = 4000;

function mapConv(r: Record<string, any>): Conversation {
  return {
    id: r.id,
    userId: r.user_id,
    status: r.status as "open" | "closed",
    isTicket: !!r.is_ticket,
    created: r.created,
    updated: r.updated,
    userName: r.expand?.user_id?.name,
    userEmail: r.expand?.user_id?.email,
  };
}

function mapMsg(r: Record<string, any>): SupportMessage {
  return {
    id: r.id,
    conversationId: r.conversation_id,
    sender: r.sender as "user" | "admin",
    content: r.content,
    created: r.created,
  };
}

export function SupportProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [myConversation, setMyConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loadingConversation, setLoadingConversation] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<SupportMessage[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const userPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const adminListPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const adminMsgPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchMessages(convId: string): Promise<SupportMessage[]> {
    try {
      const res = await pb.collection("support_messages").getList(1, 500, {
        filter: `conversation_id = "${convId}"`,
        sort: "created",
        requestKey: null,
      });
      return res.items.map(mapMsg);
    } catch {
      return [];
    }
  }

  // User: load their conversation on mount
  useEffect(() => {
    if (userPollRef.current) clearInterval(userPollRef.current);
    if (!user || user.isAdmin) {
      setMyConversation(null);
      setMessages([]);
      return;
    }
    let alive = true;
    setLoadingConversation(true);
    (async () => {
      try {
        const res = await pb.collection("support_conversations").getList(1, 1, {
          filter: `user_id = "${user.id}"`,
          sort: "-created",
          requestKey: null,
        });
        if (!alive) return;
        if (res.items.length > 0) {
          const conv = mapConv(res.items[0]);
          setMyConversation(conv);
          const msgs = await fetchMessages(conv.id);
          if (alive) setMessages(msgs);
        }
      } finally {
        if (alive) setLoadingConversation(false);
      }
    })();
    return () => { alive = false; };
  }, [user?.id, user?.isAdmin]);

  // User: poll messages when conversation exists
  useEffect(() => {
    if (userPollRef.current) clearInterval(userPollRef.current);
    if (!myConversation || !user || user.isAdmin) return;
    userPollRef.current = setInterval(async () => {
      const msgs = await fetchMessages(myConversation.id);
      setMessages(msgs);
    }, POLL_MS);
    return () => { if (userPollRef.current) clearInterval(userPollRef.current); };
  }, [myConversation?.id, user?.isAdmin]);

  async function sendMessage(content: string) {
    if (!user || !content.trim()) return;
    let conv = myConversation;
    if (!conv) {
      const r = await pb.collection("support_conversations").create({
        user_id: user.id,
        status: "open",
        is_ticket: false,
      });
      conv = mapConv(r);
      setMyConversation(conv);
    }
    const r = await pb.collection("support_messages").create({
      conversation_id: conv.id,
      sender: "user",
      content: content.trim(),
    });
    setMessages(prev => [...prev, mapMsg(r)]);
  }

  async function markAsTicket() {
    if (!myConversation) return;
    await pb.collection("support_conversations").update(myConversation.id, { is_ticket: true });
    setMyConversation({ ...myConversation, isTicket: true });
  }

  // Admin: load all conversations
  async function loadConversations() {
    try {
      const res = await pb.collection("support_conversations").getList(1, 200, {
        sort: "-updated",
        expand: "user_id",
        requestKey: null,
      });
      setConversations(res.items.map(mapConv));
    } catch {
      // silent — admin may not have visited the panel yet
    }
  }

  useEffect(() => {
    if (!user?.isAdmin) {
      if (adminListPollRef.current) clearInterval(adminListPollRef.current);
      if (adminMsgPollRef.current) clearInterval(adminMsgPollRef.current);
      return;
    }
    setLoadingAdmin(true);
    loadConversations().finally(() => setLoadingAdmin(false));
    adminListPollRef.current = setInterval(loadConversations, POLL_MS);
    return () => {
      if (adminListPollRef.current) clearInterval(adminListPollRef.current);
      if (adminMsgPollRef.current) clearInterval(adminMsgPollRef.current);
    };
  }, [user?.isAdmin]);

  async function selectConversation(id: string) {
    setSelectedId(id);
    const msgs = await fetchMessages(id);
    setSelectedMessages(msgs);
    if (adminMsgPollRef.current) clearInterval(adminMsgPollRef.current);
    adminMsgPollRef.current = setInterval(async () => {
      const updated = await fetchMessages(id);
      setSelectedMessages(updated);
    }, POLL_MS);
  }

  async function adminReply(content: string) {
    if (!selectedId || !content.trim()) return;
    const r = await pb.collection("support_messages").create({
      conversation_id: selectedId,
      sender: "admin",
      content: content.trim(),
    });
    setSelectedMessages(prev => [...prev, mapMsg(r)]);
  }

  async function updateStatus(id: string, status: "open" | "closed") {
    await pb.collection("support_conversations").update(id, { status });
    setConversations(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    if (myConversation?.id === id) setMyConversation(prev => prev ? { ...prev, status } : null);
  }

  async function toggleTicket(id: string, current: boolean) {
    await pb.collection("support_conversations").update(id, { is_ticket: !current });
    setConversations(prev => prev.map(c => c.id === id ? { ...c, isTicket: !current } : c));
  }

  return (
    <SupportContext.Provider value={{
      myConversation, messages, loadingConversation, sendMessage, markAsTicket,
      conversations, selectedId, selectedMessages, loadingAdmin,
      selectConversation, adminReply, updateStatus, toggleTicket,
    }}>
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const ctx = useContext(SupportContext);
  if (!ctx) throw new Error("useSupport must be inside SupportProvider");
  return ctx;
}
