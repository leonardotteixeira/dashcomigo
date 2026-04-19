import { useState } from "react";
import { useNavigate } from "react-router";
import { Check, MessageCircle, Zap, Shield, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const FREE_FEATURES = [
  "Dashboard com relatórios básicos",
  "Simulador MEI → ME",
  "Fluxo de caixa: 30 lançamentos/mês",
  "Contas a pagar e receber: 30 itens",
  "Propostas comerciais: 2 por dia",
  "Estoque: 10 produtos",
];

const ESSENCIAL_FEATURES = [
  "Tudo do Gratuito, sem limites",
  "Fluxo de caixa ilimitado",
  "Propostas ilimitadas",
  "Clientes e fornecedores ilimitados",
  "Relatórios e exportações completas",
  "Simuladores avançados (preço ideal, lucro)",
  "Metas financeiras com histórico",
  "Alertas inteligentes e insights",
  "Suporte por chat (até 24h)",
];

const TREZENTOS_FEATURES = [
  "Tudo do Essencial, sem exceção",
  "Especialista financeiro dedicado",
  "Atendimento por WhatsApp + chat",
  "Resposta em até 1 dia útil",
  "Orientação prática sobre suas finanças",
  "Análise periódica do seu negócio",
  "Acesso prioritário a novos recursos",
];

const FAQS = [
  {
    q: "O preço de R$ 59,90 é permanente?",
    a: "Quem assinar durante o lançamento mantém esse valor enquanto a assinatura estiver ativa. Após o período de lançamento, novos contratos do 360 serão R$ 99,90/mês.",
  },
  {
    q: "O que é o especialista do plano 360?",
    a: "É um profissional financeiro real que acompanha seu negócio pelo WhatsApp e chat. Você tira dúvidas, recebe orientações práticas e não precisa tomar decisões financeiras sozinho.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim, sem multas ou compromissos. Você mantém o acesso até o fim do período pago.",
  },
  {
    q: "Qual a diferença entre Essencial e 360?",
    a: "No Essencial você tem a plataforma completa e gerencia tudo sozinho. No 360 você tem a plataforma completa mais um especialista humano do seu lado para orientar suas decisões.",
  },
];

export function Pricing() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleSelectPlan = (plan: "free" | "essencial" | "360") => {
    if (!isAuthenticated) {
      navigate("/signup");
      return;
    }
    if (plan === "free") navigate("/app");
    else navigate("/checkout");
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:py-24" style={{ background: "#F4EFE6" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider"
            style={{ background: "rgba(127,209,159,0.2)", color: "#1F5A3A" }}>
            Planos e preços
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0E3B2E" }}>
            Escolha como quer crescer
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(14,59,46,0.6)" }}>
            Comece grátis. Evolua quando fizer sentido. Sem compromisso de longo prazo.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">

          {/* Gratuito */}
          <div className="relative p-8 rounded-2xl flex flex-col"
            style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.13)" }}>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(14,59,46,0.5)" }}>Plano</p>
              <h3 className="text-2xl font-bold mb-1" style={{ color: "#0E3B2E" }}>Gratuito</h3>
              <p className="text-sm" style={{ color: "rgba(14,59,46,0.6)" }}>Comece sem gastar nada</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold" style={{ color: "#0E3B2E" }}>R$ 0</span>
                <span className="text-sm" style={{ color: "rgba(14,59,46,0.5)" }}>/mês</span>
              </div>
              <p className="text-xs" style={{ color: "rgba(14,59,46,0.5)" }}>Para sempre grátis</p>
            </div>

            <button
              onClick={() => handleSelectPlan("free")}
              disabled={user?.plan === "free"}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all mb-8"
              style={user?.plan === "free"
                ? { background: "rgba(14,59,46,0.06)", color: "rgba(14,59,46,0.35)", cursor: "default" }
                : { background: "transparent", color: "#0E3B2E", border: "2px solid #0E3B2E" }}
            >
              {user?.plan === "free" ? "Seu plano atual" : "Criar conta grátis"}
            </button>

            <div className="flex-1 space-y-2.5 pt-6" style={{ borderTop: "1px solid rgba(20,18,15,0.1)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(14,59,46,0.5)" }}>Incluso:</p>
              {FREE_FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#1F5A3A" }} />
                  <span className="text-sm" style={{ color: "rgba(14,59,46,0.7)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Essencial */}
          <div className="relative p-8 rounded-2xl flex flex-col"
            style={{ background: "#0E3B2E", border: "2px solid #0E3B2E" }}>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(127,209,159,0.6)" }}>Plano</p>
              <h3 className="text-2xl font-bold mb-1" style={{ color: "#F4EFE6" }}>Essencial</h3>
              <p className="text-sm" style={{ color: "rgba(244,239,230,0.65)" }}>Gestão completa. Você no controle.</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold" style={{ color: "#7FD19F" }}>R$ 29,90</span>
                <span className="text-sm" style={{ color: "rgba(244,239,230,0.5)" }}>/mês</span>
              </div>
              <p className="text-xs" style={{ color: "rgba(244,239,230,0.5)" }}>Menos de R$ 1,00 por dia</p>
            </div>

            <button
              onClick={() => handleSelectPlan("essencial")}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all mb-8"
              style={{ background: "#7FD19F", color: "#0E3B2E" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F4EFE6"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#7FD19F"; }}
            >
              Assinar Essencial
            </button>

            <div className="flex-1 space-y-2.5 pt-6" style={{ borderTop: "1px solid rgba(244,239,230,0.12)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(127,209,159,0.6)" }}>Incluso:</p>
              {ESSENCIAL_FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#7FD19F" }} />
                  <span className="text-sm" style={{ color: "rgba(244,239,230,0.8)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 360 — Launch */}
          <div className="relative p-8 rounded-2xl flex flex-col"
            style={{ background: "#F4EFE6", border: "2px solid #0E3B2E" }}>

            {/* Launch badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
              style={{ background: "#0E3B2E", color: "#7FD19F" }}>
              <Zap className="w-3 h-3" />
              🚀 Preço de lançamento
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(14,59,46,0.5)" }}>Plano</p>
              <h3 className="text-2xl font-bold mb-1" style={{ color: "#0E3B2E" }}>360</h3>
              <p className="text-sm font-medium" style={{ color: "#1F5A3A" }}>A plataforma + um especialista do seu lado.</p>
            </div>

            <div className="mb-2">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold" style={{ color: "#0E3B2E" }}>R$ 59,90</span>
                <span className="text-sm" style={{ color: "rgba(14,59,46,0.5)" }}>/mês</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm line-through" style={{ color: "rgba(14,59,46,0.35)" }}>R$ 99,90/mês</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(127,209,159,0.25)", color: "#1F5A3A" }}>
                  −40%
                </span>
              </div>
            </div>

            {/* Guarantee line */}
            <p className="text-xs mb-8 leading-relaxed" style={{ color: "rgba(14,59,46,0.6)" }}>
              ✓ Quem entrar agora mantém R$ 59,90 enquanto a assinatura estiver ativa.
            </p>

            <button
              onClick={() => handleSelectPlan("360")}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all mb-6 shadow-lg"
              style={{ background: "#0E3B2E", color: "#F4EFE6" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1F5A3A"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0E3B2E"; }}
            >
              Quero meu especialista →
            </button>

            {/* WhatsApp highlight */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6"
              style={{ background: "rgba(14,59,46,0.06)", border: "1px solid rgba(14,59,46,0.1)" }}>
              <MessageCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#1F5A3A" }} />
              <p className="text-xs font-medium" style={{ color: "#1F5A3A" }}>
                Especialista disponível por WhatsApp + chat
              </p>
            </div>

            <div className="flex-1 space-y-2.5 pt-6" style={{ borderTop: "1px solid rgba(20,18,15,0.1)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(14,59,46,0.5)" }}>Incluso:</p>
              {TREZENTOS_FEATURES.map((f, i) => (
                <div key={f} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: i === 1 ? "#0E3B2E" : "#1F5A3A", fontWeight: i === 1 ? "bold" : "normal" }} />
                  <span className="text-sm" style={{ color: i === 1 ? "#0E3B2E" : "rgba(14,59,46,0.75)", fontWeight: i === 1 ? "600" : "400" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social proof strip */}
        <div className="flex items-center justify-center gap-8 flex-wrap mb-20">
          {[
            { icon: Shield, text: "Cancele quando quiser" },
            { icon: Users, text: "Especialista humano real" },
            { icon: Zap, text: "Acesso imediato" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4" style={{ color: "#1F5A3A" }} />
              <span className="text-sm font-medium" style={{ color: "rgba(14,59,46,0.7)" }}>{text}</span>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "#0E3B2E" }}>Perguntas frequentes</h2>
            <p style={{ color: "rgba(14,59,46,0.6)" }}>Tudo que você precisa saber antes de assinar</p>
          </div>

          <div className="grid gap-4 mb-20">
            {FAQS.map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl" style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.1)" }}>
                <p className="font-semibold mb-2 text-sm" style={{ color: "#0E3B2E" }}>{item.q}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(14,59,46,0.65)" }}>{item.a}</p>
              </div>
            ))}
          </div>

          {/* CTA bottom */}
          <div className="p-10 rounded-2xl text-center" style={{ background: "#0E3B2E" }}>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "#F4EFE6" }}>Não sabe qual plano escolher?</h3>
            <p className="mb-8" style={{ color: "rgba(244,239,230,0.7)" }}>
              Comece pelo Gratuito. Se precisar de mais controle, mude para o Essencial.<br />
              Se quiser apoio humano, o 360 está aqui — e o preço de lançamento não dura para sempre.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/app")}
                  className="px-8 py-3 rounded-xl font-semibold transition-all"
                  style={{ background: "#7FD19F", color: "#0E3B2E" }}
                >
                  Ir para o Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-8 py-3 rounded-xl font-bold transition-all"
                    style={{ background: "#7FD19F", color: "#0E3B2E" }}
                  >
                    Começar grátis agora
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-8 py-3 rounded-xl font-semibold transition-all"
                    style={{ background: "transparent", color: "#F4EFE6", border: "1px solid rgba(244,239,230,0.25)" }}
                  >
                    Já tenho conta
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
