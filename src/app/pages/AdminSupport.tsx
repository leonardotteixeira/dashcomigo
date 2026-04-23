import { useState, useEffect, useRef } from "react";
import {
  Send,
  MessageCircle,
  Ticket,
  CheckCircle,
  Circle,
  Tag,
  ChevronLeft,
  RefreshCw,
  Search,
} from "lucide-react";
import { useSupport } from "../contexts/SupportContext";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router";
import { toast } from "sonner";

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatRelative(dateStr: string) {
  const d = new Date(dateStr);
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "agora";
  if (diffMins < 60) return `${diffMins}min`;
  const diffH = Math.floor(diffMins / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

type Filter = "all" | "open" | "closed" | "ticket";

const FILTER_LABELS: Record<Filter, string> = {
  all: "Todas",
  open: "Abertas",
  closed: "Fechadas",
  ticket: "Chamados",
};

export function AdminSupport() {
  const { user } = useAuth();
  const {
    conversations,
    selectedId,
    selectedMessages,
    loadingAdmin,
    selectConversation,
    adminReply,
    updateStatus,
    toggleTicket,
  } = useSupport();

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [togglingTicket, setTogglingTicket] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!user?.isAdmin) return <Navigate to="/app" replace />;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMessages]);

  const handleSelect = async (id: string) => {
    await selectConversation(id);
    setShowMobileChat(true);
  };

  const handleReply = async () => {
    if (!input.trim() || sending) return;
    const content = input;
    setInput("");
    setSending(true);
    try {
      await adminReply(content);
    } catch {
      toast.error("Erro ao enviar resposta. Tente novamente.");
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedConv || togglingStatus) return;
    setTogglingStatus(true);
    try {
      const next = selectedConv.status === "open" ? "closed" : "open";
      await updateStatus(selectedConv.id, next);
      toast.success(next === "closed" ? "Conversa encerrada." : "Conversa reaberta.");
    } catch {
      toast.error("Erro ao atualizar status.");
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleToggleTicket = async () => {
    if (!selectedConv || togglingTicket) return;
    setTogglingTicket(true);
    try {
      await toggleTicket(selectedConv.id, selectedConv.isTicket);
      toast.success(selectedConv.isTicket ? "Chamado removido." : "Marcado como chamado.");
    } catch {
      toast.error("Erro ao atualizar chamado.");
    } finally {
      setTogglingTicket(false);
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedId);

  const filtered = conversations.filter(c => {
    const matchFilter =
      filter === "all" ? true :
      filter === "open" ? c.status === "open" :
      filter === "closed" ? c.status === "closed" :
      c.isTicket;
    if (!matchFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (c.userName ?? "").toLowerCase().includes(q) ||
        (c.userEmail ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0E3B2E]">Admin — Suporte</h1>
        <p className="text-sm text-[rgba(14,59,46,0.6)] mt-1">
          {conversations.length} conversa{conversations.length !== 1 ? "s" : ""} ·{" "}
          {conversations.filter(c => c.status === "open").length} aberta{conversations.filter(c => c.status === "open").length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Two-column panel */}
      <div
        className="flex rounded-2xl border border-[rgba(20,18,15,0.13)] overflow-hidden shadow-sm bg-[#F4EFE6]"
        style={{ height: "calc(100vh - 260px)", minHeight: "600px" }}
      >
        {/* LEFT: Conversation list */}
        <div
          className={`flex-shrink-0 border-r border-[rgba(20,18,15,0.13)] flex flex-col bg-[#F4EFE6] ${
            showMobileChat ? "hidden lg:flex" : "flex"
          } w-full lg:w-[300px] xl:w-[340px]`}
        >
          {/* List header */}
          <div className="px-4 py-4 border-b border-[rgba(20,18,15,0.13)] bg-[#EBE4D6] space-y-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <p className="font-bold text-[#0E3B2E] text-sm">Conversas</p>
              {loadingAdmin && (
                <RefreshCw className="w-3.5 h-3.5 text-[rgba(14,59,46,0.4)] animate-spin" />
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgba(14,59,46,0.4)]" />
              <input
                type="text"
                placeholder="Buscar usuário..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[rgba(20,18,15,0.13)] bg-[#F4EFE6] text-[#0E3B2E] placeholder:text-[rgba(14,59,46,0.4)] focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/20"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 flex-wrap">
              {(["all", "open", "closed", "ticket"] as Filter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    filter === f
                      ? "bg-[#0E3B2E] text-white"
                      : "bg-[#F4EFE6] text-[rgba(14,59,46,0.6)] hover:bg-[rgba(14,59,46,0.08)]"
                  }`}
                >
                  {FILTER_LABELS[f]}
                  {f === "open" && (
                    <span className="ml-1 opacity-70">
                      {conversations.filter(c => c.status === "open").length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
                <p className="text-sm text-[rgba(14,59,46,0.4)]">
                  {loadingAdmin ? "Carregando..." : "Nenhuma conversa"}
                </p>
              </div>
            ) : (
              filtered.map(conv => {
                const isSelected = conv.id === selectedId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelect(conv.id)}
                    className="w-full text-left px-4 py-3.5 border-b border-[rgba(20,18,15,0.07)] transition-colors"
                    style={{
                      backgroundColor: isSelected
                        ? "rgba(14,59,46,0.08)"
                        : "transparent",
                    }}
                    onMouseEnter={e => {
                      if (!isSelected)
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(14,59,46,0.04)";
                    }}
                    onMouseLeave={e => {
                      if (!isSelected)
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-sm font-semibold text-[#0E3B2E] truncate">
                            {conv.userName || conv.userEmail?.split("@")[0] || "Usuário"}
                          </p>
                          {conv.isTicket && (
                            <Ticket className="w-3 h-3 text-[#0E3B2E]/50 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-[rgba(14,59,46,0.45)] truncate">
                          {conv.userEmail ?? "—"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span
                          className={`w-2 h-2 rounded-full mt-0.5 ${
                            conv.status === "open" ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                        <span className="text-xs text-[rgba(14,59,46,0.35)]">
                          {formatRelative(conv.updated)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Chat view */}
        <div className={`flex-1 flex flex-col min-w-0 ${showMobileChat ? "flex" : "hidden lg:flex"}`}>
          {!selectedConv ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-6">
              <div className="w-16 h-16 rounded-full bg-[#EBE4D6] flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-[#0E3B2E]/30" />
              </div>
              <div>
                <p className="font-semibold text-[#0E3B2E] mb-1">Selecione uma conversa</p>
                <p className="text-sm text-[rgba(14,59,46,0.5)]">
                  Escolha uma conversa na lista para visualizar e responder.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(20,18,15,0.13)] bg-[#EBE4D6] flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    className="lg:hidden p-1.5 rounded-lg hover:bg-[#F4EFE6] text-[rgba(14,59,46,0.6)] flex-shrink-0"
                    onClick={() => setShowMobileChat(false)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0E3B2E] text-sm truncate">
                      {selectedConv.userName || selectedConv.userEmail?.split("@")[0] || "Usuário"}
                    </p>
                    <p className="text-xs text-[rgba(14,59,46,0.5)] truncate">
                      {selectedConv.userEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {selectedConv.isTicket && (
                    <span className="hidden sm:flex text-xs font-medium px-2.5 py-1 rounded-full bg-[#0E3B2E]/10 text-[#0E3B2E] items-center gap-1.5">
                      <Ticket className="w-3 h-3" />
                      Chamado
                    </span>
                  )}

                  {/* Toggle ticket */}
                  <button
                    onClick={handleToggleTicket}
                    disabled={togglingTicket}
                    title={selectedConv.isTicket ? "Remover chamado" : "Marcar como chamado"}
                    className="p-2 rounded-lg hover:bg-[#F4EFE6] text-[rgba(14,59,46,0.6)] hover:text-[#0E3B2E] transition-colors disabled:opacity-40"
                  >
                    <Tag className="w-4 h-4" />
                  </button>

                  {/* Toggle open/closed */}
                  <button
                    onClick={handleToggleStatus}
                    disabled={togglingStatus}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 ${
                      selectedConv.status === "open"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-[rgba(14,59,46,0.08)] text-[#0E3B2E] hover:bg-[rgba(14,59,46,0.15)]"
                    }`}
                  >
                    {selectedConv.status === "open" ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Encerrar
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5" />
                        Reabrir
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
                {selectedMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-[rgba(14,59,46,0.4)]">Nenhuma mensagem ainda</p>
                  </div>
                ) : (
                  selectedMessages.map(msg => {
                    const isAdmin = msg.sender === "admin";
                    return (
                      <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[78%] flex flex-col gap-1 ${isAdmin ? "items-end" : "items-start"}`}>
                          <span className="text-xs font-medium text-[rgba(14,59,46,0.45)] px-1">
                            {isAdmin ? "Suporte (você)" : selectedConv.userName || "Usuário"}
                          </span>
                          <div
                            className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                              isAdmin
                                ? "bg-[#0E3B2E] text-white rounded-2xl rounded-br-sm"
                                : "bg-[#EBE4D6] text-[#0E3B2E] rounded-2xl rounded-bl-sm"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-xs text-[rgba(14,59,46,0.35)] px-1">
                            {formatTime(msg.created)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply input */}
              <div className="border-t border-[rgba(20,18,15,0.13)] px-4 py-4 flex-shrink-0">
                {selectedConv.status === "closed" ? (
                  <div className="flex items-center justify-center gap-2 py-2 text-sm text-[rgba(14,59,46,0.5)]">
                    Conversa encerrada —{" "}
                    <button
                      onClick={handleToggleStatus}
                      className="text-[#0E3B2E] font-semibold hover:underline"
                    >
                      Reabrir para responder
                    </button>
                  </div>
                ) : (
                  <div className="flex items-end gap-3">
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Responder como suporte… (Enter para enviar, Shift+Enter para nova linha)"
                      rows={1}
                      className="flex-1 resize-none rounded-xl border border-[rgba(20,18,15,0.13)] bg-[#EBE4D6] px-4 py-3 text-sm text-[#0E3B2E] placeholder:text-[rgba(14,59,46,0.4)] focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/25 overflow-y-auto"
                      style={{ minHeight: "48px", maxHeight: "128px" }}
                    />
                    <button
                      onClick={handleReply}
                      disabled={!input.trim() || sending}
                      className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-[#0E3B2E] text-white hover:bg-[#082219] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
