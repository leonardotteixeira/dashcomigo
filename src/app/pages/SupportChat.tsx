import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, Ticket, CheckCircle, Lock, HeadphonesIcon, MessageSquare, Zap } from "lucide-react";
import { useNavigate } from "react-router";
import { useSupport } from "../contexts/SupportContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Hoje";
  if (d.toDateString() === yesterday.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

interface MessageGroup {
  date: string;
  msgs: ReturnType<typeof useSupport>["messages"];
}

function groupByDate(msgs: ReturnType<typeof useSupport>["messages"]): MessageGroup[] {
  const groups: MessageGroup[] = [];
  msgs.forEach(msg => {
    const d = formatDate(msg.created);
    const last = groups[groups.length - 1];
    if (!last || last.date !== d) {
      groups.push({ date: d, msgs: [msg] });
    } else {
      last.msgs.push(msg);
    }
  });
  return groups;
}

export function SupportChat() {
  const navigate = useNavigate();
  const {
    myConversation,
    messages,
    loadingConversation,
    sendMessage,
    markAsTicket,
  } = useSupport();
  const { user } = useAuth();

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [openingTicket, setOpeningTicket] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const content = input;
    setInput("");
    setSending(true);
    try {
      await sendMessage(content);
    } catch {
      toast.error("Não foi possível enviar a mensagem. Tente novamente.");
      setInput(content);
    } finally {
      setSending(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpenTicket = async () => {
    if (openingTicket) return;
    setOpeningTicket(true);
    try {
      await markAsTicket();
      toast.success("Chamado aberto! Nossa equipe terá prioridade na sua solicitação.");
    } catch {
      toast.error("Não foi possível abrir o chamado.");
    } finally {
      setOpeningTicket(false);
    }
  };

  const groups = groupByDate(messages);
  const isClosed = myConversation?.status === "closed";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0E3B2E]">Suporte</h1>
        <p className="text-sm text-[rgba(14,59,46,0.6)] mt-1">
          Fale diretamente com nossa equipe. Respondemos em até 24h úteis.
        </p>
      </div>

      {/* Chat container */}
      <div
        className="flex flex-col rounded-2xl border border-[rgba(20,18,15,0.13)] overflow-hidden shadow-sm bg-[#F4EFE6]"
        style={{ height: "calc(100vh - 260px)", minHeight: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(20,18,15,0.13)] bg-[#EBE4D6] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0E3B2E] flex items-center justify-center">
              <HeadphonesIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-[#0E3B2E] text-sm">Suporte DashComigo</p>
                {user?.plan && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                    user.plan === "pro" ? "bg-purple-100 text-purple-700" :
                    user.plan === "premium" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {user.plan === "pro" ? "PRO" : user.plan === "premium" ? "Premium" : "Gratuito"}
                  </span>
                )}
              </div>
              <p className="text-xs text-[rgba(14,59,46,0.6)]">
                {loadingConversation
                  ? "Carregando..."
                  : isClosed
                  ? "Conversa encerrada"
                  : myConversation
                  ? "Conversa ativa · Resposta em até 24h úteis"
                  : "Pronto para te ajudar"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {myConversation?.isTicket && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#0E3B2E]/10 text-[#0E3B2E] flex items-center gap-1.5">
                <Ticket className="w-3 h-3" />
                Chamado aberto
              </span>
            )}
            {isClosed && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3" />
                Resolvido
              </span>
            )}
            {myConversation && !myConversation.isTicket && !isClosed && (
              <button
                onClick={handleOpenTicket}
                disabled={openingTicket}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[rgba(20,18,15,0.13)] text-[#0E3B2E] hover:bg-[#F4EFE6] transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Ticket className="w-3 h-3" />
                {openingTicket ? "Abrindo..." : "Abrir chamado"}
              </button>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loadingConversation ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#0E3B2E]/20 border-t-[#0E3B2E] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-[rgba(14,59,46,0.6)]">Carregando conversa...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-5 py-10">
              <div className="w-16 h-16 rounded-full bg-[#EBE4D6] flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-[#0E3B2E]/40" />
              </div>
              <div className="max-w-xs">
                <p className="font-semibold text-[#0E3B2E] mb-2">Como podemos ajudar?</p>
                <p className="text-sm text-[rgba(14,59,46,0.6)] leading-relaxed">
                  Envie sua dúvida ou problema abaixo. Nossa equipe responde em até 24 horas úteis.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                {[
                  "Tenho dúvidas sobre meu plano",
                  "Encontrei um problema técnico",
                  "Quero cancelar minha assinatura",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-sm text-left px-4 py-2.5 rounded-lg border border-[rgba(20,18,15,0.13)] text-[rgba(14,59,46,0.7)] hover:bg-[#EBE4D6] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {groups.map((group) => (
                <div key={group.date}>
                  {/* Date divider */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-[rgba(20,18,15,0.1)]" />
                    <span className="text-xs text-[rgba(14,59,46,0.45)] px-2 flex-shrink-0">
                      {group.date}
                    </span>
                    <div className="flex-1 h-px bg-[rgba(20,18,15,0.1)]" />
                  </div>

                  <div className="space-y-3">
                    {group.msgs.map((msg) => {
                      const isUser = msg.sender === "user";
                      return (
                        <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
                            {!isUser && (
                              <span className="text-xs font-medium text-[rgba(14,59,46,0.5)] px-1">
                                Suporte
                              </span>
                            )}
                            <div
                              className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                                isUser
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
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Upgrade & WhatsApp section */}
        {!isClosed && (
          <div className="border-t border-[rgba(20,18,15,0.13)] bg-[#EBE4D6]/50 px-4 py-3 flex flex-col gap-2">
            {/* Free user upgrade prompt */}
            {user?.plan === "free" && (
              <button
                onClick={() => navigate("/planos")}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors text-left"
              >
                <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-blue-900">Respostas mais rápidas</p>
                  <p className="text-xs text-blue-700">Upgrade para Premium ⚡</p>
                </div>
              </button>
            )}

            {/* Premium user: upsell to PRO for WhatsApp */}
            {user?.plan === "premium" && (
              <button
                onClick={() => navigate("/planos")}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors text-left"
              >
                <MessageSquare className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-purple-900">Planejamento financeiro personalizado</p>
                  <p className="text-xs text-purple-700">Converse via WhatsApp com especialista — Upgrade PRO</p>
                </div>
              </button>
            )}

            {/* PRO user: WhatsApp access */}
            {user?.plan === "pro" && (
              <a
                href="https://api.whatsapp.com/send?phone=5585988881234&text=Ol%C3%A1%2C%20sou%20usu%C3%A1rio%20PRO%20do%20DashComigo.%20Gostaria%20de%20planejar%20meu%20crescimento%20financeiro."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-lg bg-green-50 border border-green-100 hover:bg-green-100 transition-colors text-left"
              >
                <MessageSquare className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-green-900">Especialista Financeiro</p>
                  <p className="text-xs text-green-700">Converse no WhatsApp (resposta em até 2h úteis)</p>
                </div>
              </a>
            )}

            {/* Non-PRO: locked WhatsApp */}
            {user?.plan !== "pro" && (
              <button
                onClick={() => navigate("/planos")}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-150 transition-colors text-left opacity-60"
              >
                <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-700">WhatsApp com Especialista (PRO)</p>
                  <p className="text-xs text-gray-600">Desbloqueie com upgrade PRO</p>
                </div>
              </button>
            )}
          </div>
        )}
        <div className="border-t border-[rgba(20,18,15,0.13)] px-4 py-4 bg-[#F4EFE6] flex-shrink-0">
          {isClosed ? (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-[rgba(14,59,46,0.5)]">
              <Lock className="w-4 h-4" />
              Esta conversa foi encerrada pela equipe de suporte.
            </div>
          ) : (
            <div className="flex items-end gap-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem… (Enter para enviar, Shift+Enter para nova linha)"
                rows={1}
                className="flex-1 resize-none rounded-xl border border-[rgba(20,18,15,0.13)] bg-[#EBE4D6] px-4 py-3 text-sm text-[#0E3B2E] placeholder:text-[rgba(14,59,46,0.4)] focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/25 overflow-y-auto"
                style={{ minHeight: "48px", maxHeight: "128px" }}
              />
              <button
                onClick={handleSend}
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
      </div>
    </div>
  );
}
