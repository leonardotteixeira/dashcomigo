import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Check,
  X,
  MessageCircle,
  Shield,
  CalendarCheck,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

// ─── Plan data ────────────────────────────────────────────────────────────────

const FREE_FEATURES = [
  { text: "Dashboard com indicadores básicos", included: true },
  { text: "Fluxo de caixa: 30 lançamentos/mês", included: true },
  { text: "Contas a pagar e receber: 30 itens", included: true },
  { text: "Propostas comerciais: 2 por dia", included: true },
  { text: "Simulador MEI → ME", included: true },
  { text: "Estoque: 10 produtos", included: true },
  { text: "Relatórios avançados", included: false },
  { text: "Especialista financeiro", included: false },
];

const BASIC_FEATURES = [
  { text: "Tudo do Gratuito, sem limites de uso", included: true },
  { text: "Fluxo de caixa e lançamentos ilimitados", included: true },
  { text: "Propostas e contratos ilimitados", included: true },
  { text: "Clientes e fornecedores ilimitados", included: true },
  { text: "Relatórios completos com exportação", included: true },
  { text: "Simuladores avançados (preço ideal, lucro)", included: true },
  { text: "Metas financeiras com histórico", included: true },
  { text: "Alertas e insights automáticos", included: true },
  { text: "Especialista financeiro", included: false },
];

const PREMIUM_SPECIALIST = [
  {
    icon: CalendarCheck,
    title: "Sessão mensal de 30 min",
    description: "Revisão do seu negócio com um especialista — por vídeo ou WhatsApp.",
  },
  {
    icon: MessageCircle,
    title: "Suporte assíncrono ilimitado",
    description: "Dúvidas respondidas por chat em até 1 dia útil. Sem esperar.",
  },
  {
    icon: UserCheck,
    title: "Plano financeiro personalizado",
    description: "Orientação sobre precificação, reservas, corte de gastos e crescimento.",
  },
];

const PREMIUM_FEATURES = [
  "Tudo do Básico, sem exceção",
  "Sessão mensal com especialista (30 min)",
  "Suporte assíncrono por chat e e-mail",
  "Plano financeiro personalizado",
  "Orientação em decisões financeiras",
  "Análise mensal do desempenho do negócio",
  "Acesso prioritário a novos recursos",
];

const FAQS = [
  {
    q: "O que é exatamente o especialista financeiro do Premium?",
    a: "É um profissional real — não um bot — que acompanha o seu negócio. Uma vez por mês você tem uma sessão de 30 minutos (vídeo ou WhatsApp) para revisar suas finanças, tirar dúvidas e traçar prioridades. No intervalo, você acessa suporte assíncrono por chat para perguntas rápidas, respondidas em até 1 dia útil.",
  },
  {
    q: "O primeiro mês do Premium custa R$ 59,90. E depois?",
    a: "A partir do segundo mês, o valor é R$ 89,90/mês. O primeiro mês existe para você experimentar o serviço sem compromisso — inclusive a sessão com o especialista. Se não ver valor, cancele antes de ser cobrado novamente.",
  },
  {
    q: "Qual a diferença real entre Básico e Premium?",
    a: "No Básico você tem uma plataforma completa para organizar suas finanças sozinho. No Premium você tem a mesma plataforma mais alguém do seu lado: um especialista que te orienta nas decisões, revisa seu negócio mensalmente e responde suas dúvidas. É a diferença entre ter as informações e saber o que fazer com elas.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Sem multa, sem burocracia. Você mantém o acesso até o fim do período pago e não é cobrado novamente.",
  },
  {
    q: "Serve para quem está começando?",
    a: "Especialmente para quem está começando. É quando mais surgem dúvidas sobre precificação, impostos, separação de contas PF e PJ e quanto guardar. Ter um especialista nessa fase evita erros que custam caro depois.",
  },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      className="w-full text-left p-6 rounded-xl transition-all"
      style={{
        background: open ? "#EBE4D6" : "#F4EFE6",
        border: `1px solid ${open ? "rgba(14,59,46,0.2)" : "rgba(20,18,15,0.1)"}`,
      }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-semibold text-sm leading-snug" style={{ color: "#0E3B2E" }}>{q}</p>
        {open
          ? <ChevronUp className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#0E3B2E" }} />
          : <ChevronDown className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "rgba(14,59,46,0.4)" }} />}
      </div>
      {open && (
        <p className="text-sm leading-relaxed mt-3" style={{ color: "rgba(14,59,46,0.65)" }}>{a}</p>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Pricing() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const isPro = user?.plan === "pro";

  const handleSelectPlan = (plan: "free" | "basic" | "premium") => {
    if (!isAuthenticated) {
      navigate("/signup");
      return;
    }
    if (plan === "free") navigate("/app");
    else navigate("/checkout");
  };

  return (
    <div className="min-h-screen" style={{ background: "#F4EFE6" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-24">

        {/* ── Header ── */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span
            className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider"
            style={{ background: "rgba(127,209,159,0.2)", color: "#1F5A3A" }}
          >
            Planos e preços
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight" style={{ color: "#0E3B2E" }}>
            Chega de tomar decisões financeiras no escuro
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "rgba(14,59,46,0.65)" }}>
            Organize suas finanças com a plataforma — ou vá além e tenha um especialista
            orientando cada decisão do seu negócio.
          </p>
        </div>

        {/* ── Plans Grid ── */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* Gratuito */}
          <div
            className="relative p-7 rounded-2xl flex flex-col"
            style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.13)" }}
          >
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(14,59,46,0.45)" }}>
                Para começar
              </p>
              <h3 className="text-2xl font-bold mb-1" style={{ color: "#0E3B2E" }}>Gratuito</h3>
              <p className="text-sm" style={{ color: "rgba(14,59,46,0.55)" }}>
                Experimente sem compromisso
              </p>
            </div>

            <div className="mb-7">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold" style={{ color: "#0E3B2E" }}>R$ 0</span>
                <span className="text-sm" style={{ color: "rgba(14,59,46,0.45)" }}>/mês</span>
              </div>
              <p className="text-xs mt-1" style={{ color: "rgba(14,59,46,0.45)" }}>Para sempre grátis</p>
            </div>

            <button
              onClick={() => handleSelectPlan("free")}
              disabled={!isPro && isAuthenticated}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all mb-7"
              style={
                !isPro && isAuthenticated
                  ? { background: "rgba(14,59,46,0.06)", color: "rgba(14,59,46,0.35)", cursor: "default" }
                  : { background: "transparent", color: "#0E3B2E", border: "2px solid rgba(14,59,46,0.25)" }
              }
            >
              {!isPro && isAuthenticated ? "Seu plano atual" : "Criar conta grátis"}
            </button>

            <div className="flex-1 space-y-2.5 pt-6" style={{ borderTop: "1px solid rgba(20,18,15,0.1)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(14,59,46,0.45)" }}>
                Incluso:
              </p>
              {FREE_FEATURES.map((f) => (
                <div key={f.text} className="flex items-start gap-2.5">
                  {f.included
                    ? <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#1F5A3A" }} />
                    : <X className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(14,59,46,0.2)" }} />}
                  <span
                    className="text-sm"
                    style={{ color: f.included ? "rgba(14,59,46,0.7)" : "rgba(14,59,46,0.3)" }}
                  >
                    {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Básico */}
          <div
            className="relative p-7 rounded-2xl flex flex-col"
            style={{ background: "#fff", border: "2px solid rgba(14,59,46,0.2)" }}
          >
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(14,59,46,0.45)" }}>
                Para quem quer controle
              </p>
              <h3 className="text-2xl font-bold mb-1" style={{ color: "#0E3B2E" }}>Básico</h3>
              <p className="text-sm font-medium" style={{ color: "rgba(14,59,46,0.6)" }}>
                Plataforma completa. Você no comando.
              </p>
            </div>

            <div className="mb-7">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold" style={{ color: "#0E3B2E" }}>R$ 29,90</span>
                <span className="text-sm" style={{ color: "rgba(14,59,46,0.45)" }}>/mês</span>
              </div>
              <p className="text-xs mt-1" style={{ color: "rgba(14,59,46,0.45)" }}>
                Menos de R$ 1,00 por dia
              </p>
            </div>

            <button
              onClick={() => handleSelectPlan("basic")}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all mb-7"
              style={{ background: "#0E3B2E", color: "#F4EFE6" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1F5A3A"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0E3B2E"; }}
            >
              Assinar Básico
            </button>

            <div className="flex-1 space-y-2.5 pt-6" style={{ borderTop: "1px solid rgba(20,18,15,0.08)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(14,59,46,0.45)" }}>
                Incluso:
              </p>
              {BASIC_FEATURES.map((f) => (
                <div key={f.text} className="flex items-start gap-2.5">
                  {f.included
                    ? <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#1F5A3A" }} />
                    : <X className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "rgba(14,59,46,0.2)" }} />}
                  <span
                    className="text-sm"
                    style={{ color: f.included ? "rgba(14,59,46,0.75)" : "rgba(14,59,46,0.3)" }}
                  >
                    {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium — Hero */}
          <div
            className="relative p-7 rounded-2xl flex flex-col"
            style={{ background: "#0E3B2E", border: "2px solid #0E3B2E" }}
          >
            {/* Badge */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-md"
              style={{ background: "#7FD19F", color: "#0A2E22" }}
            >
              <Star className="w-3 h-3 fill-current" />
              Recomendado
            </div>

            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(127,209,159,0.55)" }}>
                Para quem quer orientação
              </p>
              <h3 className="text-2xl font-bold mb-1" style={{ color: "#F4EFE6" }}>Premium</h3>
              <p className="text-sm font-medium" style={{ color: "rgba(244,239,230,0.7)" }}>
                A plataforma completa + um especialista do seu lado.
              </p>
            </div>

            {/* Pricing */}
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold" style={{ color: "#7FD19F" }}>R$ 59,90</span>
                <span className="text-sm" style={{ color: "rgba(244,239,230,0.45)" }}>no 1º mês</span>
              </div>
              <p className="text-sm mt-1" style={{ color: "rgba(244,239,230,0.5)" }}>
                Depois R$ 89,90/mês — cancele quando quiser
              </p>
            </div>

            {/* Trial framing */}
            <div
              className="rounded-xl px-4 py-3 mb-6 mt-3"
              style={{ background: "rgba(127,209,159,0.12)", border: "1px solid rgba(127,209,159,0.2)" }}
            >
              <p className="text-xs font-semibold leading-relaxed" style={{ color: "#7FD19F" }}>
                O primeiro mês inclui sua sessão com o especialista.
                Experimente a orientação na prática — veja o resultado antes de decidir continuar.
              </p>
            </div>

            <button
              onClick={() => handleSelectPlan("premium")}
              className="w-full py-3.5 rounded-xl font-bold text-sm transition-all mb-6 shadow-lg"
              style={{ background: "#7FD19F", color: "#0A2E22" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#9BE3B7"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#7FD19F"; }}
            >
              Quero meu especialista →
            </button>

            {/* Specialist highlight */}
            <div
              className="rounded-xl p-4 mb-6 space-y-4"
              style={{ background: "rgba(244,239,230,0.06)", border: "1px solid rgba(244,239,230,0.1)" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(127,209,159,0.7)" }}>
                O que o especialista faz por você:
              </p>
              {PREMIUM_SPECIALIST.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(127,209,159,0.15)" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#7FD19F" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight" style={{ color: "#F4EFE6" }}>{title}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(244,239,230,0.55)" }}>{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="flex-1 space-y-2.5 pt-5" style={{ borderTop: "1px solid rgba(244,239,230,0.1)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(127,209,159,0.55)" }}>
                Tudo incluso:
              </p>
              {PREMIUM_FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#7FD19F" }} />
                  <span className="text-sm" style={{ color: "rgba(244,239,230,0.8)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Plan comparison callout ── */}
        <div
          className="rounded-2xl px-8 py-6 mb-20 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center sm:text-left"
          style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.1)" }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(14,59,46,0.45)" }}>Básico</p>
            <p className="font-semibold" style={{ color: "#0E3B2E" }}>Você organiza suas finanças</p>
            <p className="text-sm mt-0.5" style={{ color: "rgba(14,59,46,0.55)" }}>Com dados claros para tomar decisões</p>
          </div>
          <div className="hidden sm:block w-px h-12" style={{ background: "rgba(14,59,46,0.15)" }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#1F5A3A" }}>Premium</p>
            <p className="font-semibold" style={{ color: "#0E3B2E" }}>Você tem alguém te orientando</p>
            <p className="text-sm mt-0.5" style={{ color: "rgba(14,59,46,0.55)" }}>Um especialista que conhece seu negócio</p>
          </div>
        </div>

        {/* ── Trust strip ── */}
        <div className="flex items-center justify-center gap-8 flex-wrap mb-20">
          {[
            { icon: Shield, text: "Cancele quando quiser, sem multa" },
            { icon: CalendarCheck, text: "Resultados visíveis nos primeiros 30 dias" },
            { icon: UserCheck, text: "Especialista humano real — não um bot" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4" style={{ color: "#1F5A3A" }} />
              <span className="text-sm font-medium" style={{ color: "rgba(14,59,46,0.65)" }}>{text}</span>
            </div>
          ))}
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "#0E3B2E" }}>Perguntas frequentes</h2>
            <p style={{ color: "rgba(14,59,46,0.55)" }}>Tudo que você precisa saber antes de assinar</p>
          </div>

          <div className="grid gap-3 mb-20">
            {FAQS.map((item, idx) => (
              <FaqItem key={idx} q={item.q} a={item.a} />
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <div className="p-10 rounded-2xl text-center" style={{ background: "#0E3B2E" }}>
            <p className="text-sm font-semibold mb-3" style={{ color: "rgba(127,209,159,0.8)" }}>
              Não sabe por onde começar?
            </p>
            <h3 className="text-2xl font-bold mb-4" style={{ color: "#F4EFE6" }}>
              Comece grátis. Evolua quando fizer sentido.
            </h3>
            <p className="mb-8 leading-relaxed" style={{ color: "rgba(244,239,230,0.65)" }}>
              Use a plataforma sem pagar nada. Se quiser um especialista ao seu lado para
              orientar suas decisões, o Premium tem um primeiro mês para você experimentar
              sem risco.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/app")}
                  className="px-8 py-3 rounded-xl font-semibold transition-all"
                  style={{ background: "#7FD19F", color: "#0A2E22" }}
                >
                  Ir para o Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleSelectPlan("premium")}
                    className="px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg"
                    style={{ background: "#7FD19F", color: "#0A2E22" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#9BE3B7"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#7FD19F"; }}
                  >
                    Experimentar o Premium por R$ 59,90
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-8 py-3 rounded-xl font-semibold transition-all"
                    style={{ background: "transparent", color: "#F4EFE6", border: "1px solid rgba(244,239,230,0.25)" }}
                  >
                    Começar grátis
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
