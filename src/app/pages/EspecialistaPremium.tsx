import { useState } from "react";
import { ArrowRight, CheckCircle, CalendarCheck, MessageCircle, UserCheck, ChevronDown, ChevronRight, AlertCircle, PieChart, Clock, TrendingUp, Quote, X, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Logo, LogoMark } from "../components/ui/Logo";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-xl overflow-hidden transition-all"
      style={{ borderColor: open ? "rgba(14,59,46,0.3)" : "rgba(14,59,46,0.13)", background: open ? "#EBE4D6" : "#F4EFE6" }}
    >
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-base pr-4" style={{ color: "#0E3B2E" }}>{question}</span>
        <ChevronDown
          className="w-5 h-5 flex-shrink-0 transition-transform"
          style={{ color: "#1F5A3A", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-base leading-relaxed" style={{ color: "rgba(14,59,46,0.7)" }}>{answer}</p>
        </div>
      )}
    </div>
  );
}

export function EspecialistaPremium() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "#F4EFE6" }}>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: "#F4EFE6", borderColor: "rgba(20,18,15,0.13)" }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="hidden sm:inline"><Logo /></span>
            <span className="sm:hidden"><LogoMark size={32} /></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/#ferramentas" className="font-semibold transition-colors" style={{ color: "rgba(14,59,46,0.7)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0E3B2E")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(14,59,46,0.7)")}>
              Ferramentas
            </Link>
            <Link to="/especialista" className="font-semibold transition-colors" style={{ color: "#0E3B2E", borderBottom: "2px solid #1F5A3A" }}>
              Especialista
            </Link>
            <Link to="/pricing" className="font-semibold transition-colors" style={{ color: "rgba(14,59,46,0.7)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0E3B2E")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(14,59,46,0.7)")}>
              Planos
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="font-semibold transition-colors"
              style={{ color: "#0E3B2E" }}
            >
              Entrar
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 rounded-lg font-semibold transition-all"
              style={{ background: "#0E3B2E", color: "#F4EFE6" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#082219")}
              onMouseLeave={e => (e.currentTarget.style.background = "#0E3B2E")}
            >
              Abrir conta
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20" style={{ background: "#0E3B2E" }}>
        {/* Radial glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-15 blur-[100px]" style={{ background: "#7FD19F" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-[80px]" style={{ background: "#7FD19F" }} />

        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8"
            style={{ background: "rgba(127,209,159,0.15)", color: "#7FD19F", border: "1px solid rgba(127,209,159,0.2)" }}>
            <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ background: "#7FD19F" }} />
            Exclusivo no plano Premium
          </div>

          <h1 className="font-extrabold leading-[1.08] tracking-tight mb-8"
            style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", color: "#F4EFE6" }}>
            Você não está sozinho<br />
            <span style={{ color: "#7FD19F" }}>gerenciando suas finanças.</span>
          </h1>

          <p className="text-xl leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: "rgba(244,239,230,0.72)" }}>
            Com o plano Premium, você tem um especialista financeiro humano do seu lado —
            orientando suas decisões, revisando seus números e te ajudando a crescer com clareza.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center justify-center gap-2 px-10 py-5 rounded-lg font-bold text-lg transition-all shadow-xl"
              style={{ background: "#7FD19F", color: "#0E3B2E" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F4EFE6"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#7FD19F"; }}
            >
              Experimentar o Premium por R$ 59,90
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center justify-center gap-2 px-10 py-5 rounded-lg font-bold text-lg transition-all border-2"
              style={{ borderColor: "rgba(244,239,230,0.25)", color: "#F4EFE6" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(244,239,230,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(244,239,230,0.25)"; }}
            >
              Ver todos os planos
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {["1º mês por R$ 59,90", "Depois R$ 89,90/mês", "Cancele quando quiser"].map(t => (
              <span key={t} className="flex items-center gap-2 text-sm" style={{ color: "rgba(244,239,230,0.5)" }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#7FD19F" }} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem ─────────────────────────────────────────────── */}
      <section className="py-28" style={{ background: "#F4EFE6" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#1F5A3A" }}>Por que isso importa</p>
            <h2 className="font-extrabold text-4xl md:text-5xl mb-5" style={{ color: "#0E3B2E" }}>
              Gerir um negócio sozinho<br />é difícil. E caro.
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "rgba(14,59,46,0.65)" }}>
              Não é falta de esforço. É falta de orientação. A maioria dos MEIs enfrenta exatamente essas situações.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              {
                icon: PieChart,
                title: "Não sabe se está tendo lucro de verdade",
                body: "Você tem receita entrando, mas no final do mês não sobra o que deveria. O dinheiro some sem explicação clara."
              },
              {
                icon: AlertCircle,
                title: "Toma decisões importantes sem base",
                body: "Fechar um contrato grande, aumentar preço, contratar alguém — decisões que pedem orientação, mas você decide sozinho."
              },
              {
                icon: Clock,
                title: "Mistura conta pessoal e empresa",
                body: "Sem separação clara, é impossível saber o que é lucro do negócio e o que é gasto pessoal. A confusão se acumula."
              },
              {
                icon: TrendingUp,
                title: "Descobre os problemas quando já é tarde",
                body: "Estourar o limite MEI sem planejamento, tomar crédito na hora errada, cobrar pouco por meses. Erros que poderiam ser evitados."
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-5 p-6 rounded-2xl"
                  style={{ background: "#EBE4D6", border: "1px solid rgba(14,59,46,0.1)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(14,59,46,0.1)" }}>
                    <Icon className="w-5 h-5" style={{ color: "#0E3B2E" }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-2" style={{ color: "#0E3B2E" }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(14,59,46,0.65)" }}>{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
              style={{ background: "#EBE4D6", border: "1px solid rgba(14,59,46,0.15)" }}>
              <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "#1F5A3A" }} />
              <p className="font-semibold" style={{ color: "#0E3B2E" }}>
                O especialista Premium existe para resolver exatamente isso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Solution ────────────────────────────────────────────── */}
      <section className="py-28" style={{ background: "#EBE4D6" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#1F5A3A" }}>O que você recebe</p>
            <h2 className="font-extrabold text-4xl md:text-5xl mb-5" style={{ color: "#0E3B2E" }}>
              Mais que um app.<br />Um parceiro financeiro.
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "rgba(14,59,46,0.65)" }}>
              O especialista não só analisa seus dados — ele te orienta sobre o que fazer com eles.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: CalendarCheck,
                title: "Sessão mensal de revisão",
                description: "30 a 45 minutos com um especialista, por vídeo ou WhatsApp. Revisão completa: margens, despesas, metas, próximos passos.",
                outcome: "Você sai da sessão sabendo exatamente o que fazer no mês seguinte.",
                highlight: true
              },
              {
                icon: MessageCircle,
                title: "Suporte assíncrono ilimitado",
                description: "Pergunte quando precisar — antes de assinar um contrato, na dúvida sobre um preço, antes de tomar crédito. Resposta em até 1 dia útil.",
                outcome: "Nenhuma decisão importante tomada no escuro.",
                highlight: false
              },
              {
                icon: UserCheck,
                title: "Plano financeiro personalizado",
                description: "Seu especialista monta um plano adaptado ao seu tipo de negócio: precificação, reservas, corte de gastos, estratégia de crescimento.",
                outcome: "Orientação que faz sentido para o SEU negócio — não um template genérico.",
                highlight: false
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}
                  className="rounded-2xl p-8 flex flex-col"
                  style={{
                    background: item.highlight ? "#0E3B2E" : "#F4EFE6",
                    border: `1px solid ${item.highlight ? "transparent" : "rgba(14,59,46,0.1)"}`
                  }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: item.highlight ? "rgba(127,209,159,0.18)" : "rgba(14,59,46,0.08)" }}>
                    <Icon className="w-7 h-7" style={{ color: item.highlight ? "#7FD19F" : "#0E3B2E" }} />
                  </div>
                  <h3 className="font-bold text-xl mb-3" style={{ color: item.highlight ? "#F4EFE6" : "#0E3B2E" }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: item.highlight ? "rgba(244,239,230,0.65)" : "rgba(14,59,46,0.65)" }}>
                    {item.description}
                  </p>
                  <div className="rounded-xl px-4 py-3"
                    style={{ background: item.highlight ? "rgba(127,209,159,0.12)" : "rgba(14,59,46,0.06)", border: `1px solid ${item.highlight ? "rgba(127,209,159,0.2)" : "rgba(14,59,46,0.08)"}` }}>
                    <p className="text-xs font-semibold leading-relaxed" style={{ color: item.highlight ? "#7FD19F" : "#1F5A3A" }}>
                      → {item.outcome}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="py-28" style={{ background: "#F4EFE6" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#1F5A3A" }}>Como funciona</p>
            <h2 className="font-extrabold text-4xl md:text-5xl mb-5" style={{ color: "#0E3B2E" }}>
              Simples desde o início
            </h2>
            <p className="text-xl" style={{ color: "rgba(14,59,46,0.65)" }}>
              Você não precisa saber de finanças para começar. É para isso que existe o especialista.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 hidden md:block" style={{ background: "rgba(14,59,46,0.12)" }} />

            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Abra sua conta e organize suas finanças",
                  description: "Registre suas entradas, saídas e contas. O app já começa a gerar insights automáticos sobre o seu negócio. Leva menos de 10 minutos para ter uma visão clara do seu fluxo de caixa."
                },
                {
                  step: "02",
                  title: "Receba insights automáticos",
                  description: "O DashComigo analisa seus dados e sinaliza o que merece atenção: despesas acima do esperado, margem caindo, contas vencendo. Você sempre sabe o que está acontecendo."
                },
                {
                  step: "03",
                  title: "Reúna-se com seu especialista uma vez por mês",
                  description: "Uma conversa de 30 a 45 minutos, por vídeo ou WhatsApp. Você apresenta as dúvidas do mês, o especialista analisa seus números e te dá orientações concretas."
                },
                {
                  step: "04",
                  title: "Receba um plano de ação claro",
                  description: "Depois de cada sessão, você sai com clareza sobre o que priorizar: onde cortar, onde investir, como precificar, o que comunicar a clientes. Sem dúvidas em aberto."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 relative">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center z-10"
                    style={{ background: i === 2 ? "#0E3B2E" : "#EBE4D6", border: `2px solid ${i === 2 ? "transparent" : "rgba(14,59,46,0.13)"}` }}>
                    <span className="text-lg font-extrabold" style={{ color: i === 2 ? "#7FD19F" : "#0E3B2E" }}>{item.step}</span>
                  </div>
                  <div className="flex-1 pt-3 pb-6">
                    <h3 className="font-bold text-xl mb-2" style={{ color: "#0E3B2E" }}>{item.title}</h3>
                    <p className="text-base leading-relaxed" style={{ color: "rgba(14,59,46,0.65)" }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What you get ────────────────────────────────────────── */}
      <section className="py-28" style={{ background: "#EBE4D6" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
              <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#1F5A3A" }}>Resumo do plano Premium</p>
              <h2 className="font-extrabold text-4xl md:text-5xl mb-6" style={{ color: "#0E3B2E" }}>
                O que você recebe<br />todo mês
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: "rgba(14,59,46,0.65)" }}>
                Além de toda a plataforma de gestão financeira, o Premium inclui suporte humano contínuo. Não é um benefício secundário — é o principal diferencial.
              </p>

              <div className="space-y-4">
                {[
                  { text: "1 sessão mensal com especialista (30–45 min)", detail: "Por vídeo ou WhatsApp, no seu horário", priority: true },
                  { text: "Suporte assíncrono ilimitado", detail: "Chat respondido em até 1 dia útil, o mês todo", priority: true },
                  { text: "Plano financeiro personalizado", detail: "Orientação adaptada ao seu negócio específico", priority: true },
                  { text: "Fluxo de caixa, relatórios e propostas ilimitados", detail: "Toda a plataforma, sem restrições", priority: false },
                  { text: "Simuladores de preço, lucro e MEI", detail: "Para calcular antes de decidir", priority: false },
                  { text: "Acesso prioritário a novos recursos", detail: "Você testa antes de todo mundo", priority: false }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl"
                    style={{ background: item.priority ? "#F4EFE6" : "transparent", border: item.priority ? "1px solid rgba(14,59,46,0.1)" : "none" }}>
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: item.priority ? "#1F5A3A" : "rgba(14,59,46,0.4)" }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#0E3B2E", fontWeight: item.priority ? 700 : 500 }}>{item.text}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(14,59,46,0.55)" }}>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Value anchor */}
            <div className="space-y-5">
              <div className="rounded-2xl p-8" style={{ background: "#0E3B2E" }}>
                <Quote className="w-8 h-8 mb-5 opacity-40" style={{ color: "#7FD19F" }} />
                <p className="text-xl font-semibold leading-relaxed mb-6" style={{ color: "#F4EFE6" }}>
                  "Uma consulta avulsa com um contador ou consultor financeiro custa entre{" "}
                  <span className="font-extrabold" style={{ color: "#7FD19F" }}>R$ 200 e R$ 500</span>.
                  Com o Premium, você tem isso todo mês — mais o app completo."
                </p>
                <div className="pt-5" style={{ borderTop: "1px solid rgba(244,239,230,0.12)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold" style={{ color: "#F4EFE6" }}>Plano Premium</p>
                      <p className="text-sm" style={{ color: "rgba(244,239,230,0.5)" }}>Especialista + plataforma completa</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold" style={{ color: "#7FD19F" }}>R$ 89,90</p>
                      <p className="text-xs" style={{ color: "rgba(244,239,230,0.45)" }}>1º mês por R$ 59,90</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ background: "#F4EFE6", border: "1px solid rgba(14,59,46,0.13)" }}>
                <p className="font-bold text-base mb-4" style={{ color: "#0E3B2E" }}>Riscos reais de decidir sem orientação:</p>
                <div className="space-y-3">
                  {[
                    "Cobrar menos que o custo real por meses → prejuízo acumulado",
                    "Ultrapassar o limite MEI sem planejar → imposto retroativo",
                    "Retirar mais do que o caixa aguenta → sem capital de giro"
                  ].map((risk, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(176,74,58,0.12)" }}>
                        <X className="w-3 h-3" style={{ color: "#B04A3A" }} />
                      </div>
                      <p className="text-sm" style={{ color: "rgba(14,59,46,0.7)" }}>{risk}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-4 font-medium" style={{ color: "rgba(14,59,46,0.45)" }}>
                  O Premium custa menos que o custo de um único erro evitável.
                </p>
              </div>

              <button
                onClick={() => navigate("/signup")}
                className="w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg"
                style={{ background: "#0E3B2E", color: "#F4EFE6" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#082219"; e.currentTarget.style.transform = "scale(1.01)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0E3B2E"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                Começar por R$ 59,90 no 1º mês
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-sm" style={{ color: "rgba(14,59,46,0.45)" }}>Depois R$ 89,90/mês. Cancele quando quiser, sem multa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ─────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "#0E3B2E" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: Shield, stat: "30 dias", label: "Para sentir a diferença", sub: "Nossos clientes percebem clareza financeira já no primeiro mês" },
              { icon: CalendarCheck, stat: "1×/mês", label: "Sessão com especialista", sub: "Uma revisão dedicada ao seu negócio, seus números, suas metas" },
              { icon: MessageCircle, stat: "< 1 dia", label: "Tempo de resposta", sub: "Suporte assíncrono com resposta em até 1 dia útil, mês todo" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="py-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(127,209,159,0.15)" }}>
                    <Icon className="w-6 h-6" style={{ color: "#7FD19F" }} />
                  </div>
                  <p className="text-3xl font-extrabold mb-1" style={{ color: "#7FD19F" }}>{item.stat}</p>
                  <p className="font-bold mb-2" style={{ color: "#F4EFE6" }}>{item.label}</p>
                  <p className="text-sm" style={{ color: "rgba(244,239,230,0.5)" }}>{item.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="py-28" style={{ background: "#F4EFE6" }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#1F5A3A" }}>Dúvidas frequentes</p>
            <h2 className="font-extrabold text-4xl mb-5" style={{ color: "#0E3B2E" }}>Perguntas sobre o especialista</h2>
          </div>

          <div className="space-y-3">
            <FaqItem
              question="O que acontece na sessão mensal?"
              answer="É uma conversa de 30 a 45 minutos focada no seu negócio. O especialista revisa seus números do mês — margem, despesas, receita — identifica o que precisa de atenção e te orienta sobre o que priorizar. Você pode trazer perguntas específicas, situações em que está em dúvida ou decisões que está pensando em tomar."
            />
            <FaqItem
              question="O especialista é uma IA ou um humano real?"
              answer="É um especialista humano real. Não é um chatbot, não é IA gerando respostas automáticas. É uma pessoa treinada em finanças para MEI e pequenas empresas que revisa seu caso individualmente e te orienta de forma personalizada."
            />
            <FaqItem
              question="Preciso ter conhecimento de finanças para aproveitar o serviço?"
              answer="Não. O especialista faz exatamente o trabalho de traduzir seus números em linguagem simples. Você não precisa saber o que é EBITDA ou fluxo de caixa descontado — o especialista vai explicar o que importa para o seu negócio, do jeito que faz sentido para você."
            />
            <FaqItem
              question="Esse serviço é para MEI ou serve para outros tipos de empresa?"
              answer="O foco principal é MEI e pequenas empresas — mas o serviço funciona muito bem para qualquer empreendedor que está começando a organizar suas finanças ou precisa de orientação para crescer com mais segurança."
            />
            <FaqItem
              question="Como funciona o suporte assíncrono? Posso perguntar qualquer coisa?"
              answer="Sim. Durante o mês, você pode enviar perguntas por chat — antes de fechar um contrato, na dúvida sobre um preço, ao avaliar um gasto, ao precisar entender um relatório. O especialista responde em até 1 dia útil. Não é um FAQ automatizado: cada resposta é personalizada para a sua situação."
            />
            <FaqItem
              question="Posso cancelar quando quiser?"
              answer="Sim, sem multa e sem burocracia. Se quiser cancelar, basta acessar as configurações da sua conta. Você continua com acesso até o fim do período que já pagou."
            />
            <FaqItem
              question="O que acontece se eu não usar a sessão mensal?"
              answer="A sessão é um benefício seu — mas não é obrigatória. Se você não agendar no mês, ela simplesmente não acontece. Não acumula, não é cobrada extra, não tem penalidade. Dito isso, quem usa a sessão regularmente tende a ter resultados bem mais consistentes."
            />
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ background: "#0E3B2E" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: "#7FD19F" }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: "#7FD19F" }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: "#7FD19F" }}>Comece hoje</p>
          <h2 className="font-extrabold mb-6 leading-tight" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "#F4EFE6" }}>
            Clareza financeira com alguém<br />do seu lado para chegar lá.
          </h2>
          <p className="text-xl mb-10 leading-relaxed font-light max-w-2xl mx-auto" style={{ color: "rgba(244,239,230,0.7)" }}>
            O primeiro mês inclui sua primeira sessão com o especialista. Experimente a orientação na prática antes de qualquer compromisso.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="inline-flex items-center gap-3 px-12 py-5 rounded-xl font-bold text-lg transition-all shadow-2xl mb-5"
            style={{ background: "#7FD19F", color: "#0E3B2E" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#F4EFE6"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#7FD19F"; }}
          >
            Experimentar o Premium por R$ 59,90
            <ArrowRight className="w-6 h-6" />
          </button>

          <p className="text-sm mb-10" style={{ color: "rgba(244,239,230,0.45)" }}>
            Depois R$ 89,90/mês · Cancele quando quiser, sem multa
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {["Resultados visíveis nos primeiros 30 dias", "Especialista humano real — não um bot", "Sem compromisso de permanência"].map(t => (
              <span key={t} className="flex items-center gap-2 text-sm" style={{ color: "rgba(244,239,230,0.55)" }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#7FD19F" }} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="py-12" style={{ background: "#082219", borderTop: "1px solid rgba(244,239,230,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="mb-4"><Logo variant="knockout" /></div>
              <p className="text-sm" style={{ color: "rgba(244,239,230,0.6)" }}>
                Gestão financeira inteligente para microempreendedores individuais.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: "#F4EFE6" }}>Produto</h4>
              <ul className="space-y-2 text-sm" style={{ color: "rgba(244,239,230,0.6)" }}>
                <li><Link to="/" className="hover:text-white transition-colors">Início</Link></li>
                <li><Link to="/especialista" className="hover:text-white transition-colors">Especialista Premium</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Planos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: "#F4EFE6" }}>Legal</h4>
              <ul className="space-y-2 text-sm" style={{ color: "rgba(244,239,230,0.6)" }}>
                <li><Link to="/privacidade" className="hover:text-white transition-colors">Privacidade</Link></li>
                <li><Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-sm" style={{ borderTop: "1px solid rgba(244,239,230,0.1)", color: "rgba(244,239,230,0.5)" }}>
            <p>&copy; 2026 DashComigo. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
