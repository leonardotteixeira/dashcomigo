import { ArrowRight, TrendingUp, PieChart, Clock, Shield, CheckCircle, Users, MessageCircle, CalendarCheck, UserCheck, AlertCircle, ChevronRight, Zap, Quote, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Logo, LogoMark } from "../components/ui/Logo";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "#F4EFE6" }}>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: "#F4EFE6", borderColor: "rgba(20,18,15,0.13)" }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <span className="hidden sm:inline"><Logo /></span>
            <span className="sm:hidden"><LogoMark size={32} /></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#ferramentas" className="font-semibold transition-colors" style={{ color: "rgba(14,59,46,0.7)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0E3B2E")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(14,59,46,0.7)")}>
              Ferramentas
            </a>
            <a href="#especialista" className="font-semibold transition-colors" style={{ color: "rgba(14,59,46,0.7)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0E3B2E")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(14,59,46,0.7)")}>
              Especialista
            </a>
            <a href="#planos" className="font-semibold transition-colors" style={{ color: "rgba(14,59,46,0.7)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0E3B2E")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(14,59,46,0.7)")}>
              Planos
            </a>
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
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20" style={{ background: "#F4EFE6" }}>
        <div className="absolute top-1/2 right-0 w-[700px] h-[700px] -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
          style={{ background: "#7FD19F" }} />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center py-20">
          {/* Copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: "#EBE4D6", color: "#1F5A3A" }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#7FD19F" }} />
              Gestão financeira para MEI e pequenas empresas
            </div>

            <h1 className="font-extrabold leading-[1.05] tracking-tight" style={{ fontSize: "clamp(2.5rem,5vw,4rem)", color: "#0E3B2E" }}>
              Tome o controle das suas finanças —{" "}
              <span style={{ color: "#1F5A3A", textDecoration: "underline", textDecorationColor: "#7FD19F", textDecorationThickness: "3px" }}>
                com orientação real
              </span>
            </h1>

            <p className="text-xl leading-relaxed" style={{ color: "rgba(14,59,46,0.7)", maxWidth: "500px" }}>
              O DashComigo combina gestão financeira completa com o apoio de um especialista humano.
              Para você não precisar tomar decisões importantes sozinho.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center justify-center gap-2 px-10 py-5 rounded-lg font-bold text-lg transition-all shadow-lg"
                style={{ background: "#0E3B2E", color: "#F4EFE6" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#082219"; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0E3B2E"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                Começar gratuitamente
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#especialista"
                className="flex items-center justify-center gap-2 px-10 py-5 rounded-lg font-bold text-lg transition-all border-2"
                style={{ borderColor: "rgba(14,59,46,0.3)", color: "#0E3B2E" }}
              >
                Conhecer o Premium
              </a>
            </div>

            {/* Trust micro-signals */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              <span className="flex items-center gap-2 text-sm font-medium" style={{ color: "rgba(14,59,46,0.6)" }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#1F5A3A" }} />
                Cancele quando quiser
              </span>
              <span className="flex items-center gap-2 text-sm font-medium" style={{ color: "rgba(14,59,46,0.6)" }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#1F5A3A" }} />
                Sem compromisso
              </span>
              <span className="flex items-center gap-2 text-sm font-medium" style={{ color: "rgba(14,59,46,0.6)" }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#1F5A3A" }} />
                Especialista humano real
              </span>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative hidden lg:block h-[560px]">
            {/* Main card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl p-6 w-[460px]"
              style={{ background: "#FFFFFF", border: "1px solid rgba(20,18,15,0.1)" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "rgba(14,59,46,0.5)" }}>Saldo Atual</p>
                  <p className="text-3xl font-bold" style={{ color: "#0E3B2E" }}>R$ 24.580,00</p>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(127,209,159,0.15)" }}>
                  <TrendingUp className="w-5 h-5" style={{ color: "#1F5A3A" }} />
                </div>
              </div>

              <div className="h-28 mb-4 rounded-lg relative overflow-hidden" style={{ background: "rgba(127,209,159,0.08)" }}>
                <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#7FD19F" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#7FD19F" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,80 L 50,60 L 100,70 L 150,40 L 200,45 L 250,30 L 300,35 L 350,20 L 400,25"
                    fill="none" stroke="#7FD19F" strokeWidth="2.5" />
                  <path d="M 0,80 L 50,60 L 100,70 L 150,40 L 200,45 L 250,30 L 300,35 L 350,20 L 400,25 L 400,100 L 0,100 Z"
                    fill="url(#chartGrad)" />
                </svg>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(127,209,159,0.15)" }}>
                      <ArrowRight className="w-4 h-4 -rotate-45" style={{ color: "#1F5A3A" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#0E3B2E" }}>Serviço Design</p>
                      <p className="text-xs" style={{ color: "rgba(14,59,46,0.5)" }}>Hoje • 14:30</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold" style={{ color: "#1F5A3A" }}>+R$ 2.500,00</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(176,74,58,0.1)" }}>
                      <ArrowRight className="w-4 h-4 rotate-45" style={{ color: "#B04A3A" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#0E3B2E" }}>Fornecedor ABC</p>
                      <p className="text-xs" style={{ color: "rgba(14,59,46,0.5)" }}>Ontem • 10:15</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold" style={{ color: "#B04A3A" }}>-R$ 850,00</p>
                </div>
              </div>
            </div>

            {/* Floating: Receitas */}
            <div className="absolute top-12 -left-4 rounded-xl shadow-xl p-4 w-48 animate-bounce"
              style={{ background: "#FFFFFF", border: "1px solid rgba(20,18,15,0.1)", animationDelay: "0s" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(14,59,46,0.5)" }}>Receitas (mês)</p>
              <p className="text-2xl font-bold" style={{ color: "#1F5A3A" }}>+R$ 12.450</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" style={{ color: "#7FD19F" }} />
                <p className="text-xs font-semibold" style={{ color: "#7FD19F" }}>+32.5%</p>
              </div>
            </div>

            {/* Floating: Especialista */}
            <div className="absolute top-44 -right-12 rounded-xl shadow-xl p-4 w-52 animate-bounce"
              style={{ background: "#0E3B2E", border: "1px solid rgba(127,209,159,0.2)", animationDelay: "0.4s" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(127,209,159,0.25)" }}>
                  <UserCheck className="w-4 h-4" style={{ color: "#7FD19F" }} />
                </div>
                <p className="text-xs font-bold" style={{ color: "#7FD19F" }}>Especialista Premium</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(244,239,230,0.8)" }}>
                "Sua margem está ótima — mas dá para cortar mais R$400/mês aqui."
              </p>
            </div>

            {/* Floating: Despesas */}
            <div className="absolute bottom-24 -right-6 rounded-xl shadow-xl p-4 w-44 animate-bounce"
              style={{ background: "#FFFFFF", border: "1px solid rgba(20,18,15,0.1)", animationDelay: "0.2s" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(14,59,46,0.5)" }}>Despesas (mês)</p>
              <p className="text-2xl font-bold" style={{ color: "#B04A3A" }}>-R$ 8.320</p>
              <div className="flex items-center gap-1 mt-1">
                <PieChart className="w-3 h-3" style={{ color: "rgba(14,59,46,0.5)" }} />
                <p className="text-xs font-semibold" style={{ color: "rgba(14,59,46,0.5)" }}>67% do previsto</p>
              </div>
            </div>

            {/* DAS-MEI badge */}
            <div className="absolute bottom-12 left-8 rounded-lg shadow-xl px-4 py-2"
              style={{ background: "#0E3B2E" }}>
              <p className="text-xs font-semibold" style={{ color: "rgba(244,239,230,0.8)" }}>DAS-MEI vence em:</p>
              <p className="text-lg font-bold" style={{ color: "#F4EFE6" }}>8 dias</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2" style={{ color: "rgba(14,59,46,0.4)" }}>
            <span className="text-sm font-medium">Role para descobrir</span>
            <ArrowRight className="w-5 h-5 rotate-90" />
          </div>
        </div>
      </section>

      {/* ── Pain section ────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "#0E3B2E" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#7FD19F" }}>A realidade de quem empreende sozinho</p>
            <h2 className="font-extrabold text-4xl md:text-5xl mb-5" style={{ color: "#F4EFE6" }}>
              Você se identifica com alguma dessas situações?
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "rgba(244,239,230,0.65)" }}>
              A maioria dos MEIs fecha o mês sem saber se tiveram lucro de verdade. Não é falta de esforço — é falta de orientação.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              {
                icon: AlertCircle,
                problem: "Fechei o mês com saldo positivo, mas sinto que não sobra nada",
                detail: "Receita boa, mas despesas escondidas e retiradas sem controle corroem tudo sem você perceber."
              },
              {
                icon: PieChart,
                problem: "Precifiquei um serviço e só depois percebi que estava no prejuízo",
                detail: "Sem uma base clara de custos e margem, qualquer preço parece razoável — até a conta chegar."
              },
              {
                icon: Clock,
                problem: "Estou chegando perto do limite MEI e não sei o que fazer",
                detail: "O limite de R$ 81.000 por ano pode virar um problema grande se você não planejar a transição com antecedência."
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="rounded-2xl p-6" style={{ background: "rgba(244,239,230,0.06)", border: "1px solid rgba(244,239,230,0.12)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(127,209,159,0.15)" }}>
                    <Icon className="w-5 h-5" style={{ color: "#7FD19F" }} />
                  </div>
                  <p className="font-bold text-base mb-3 leading-snug" style={{ color: "#F4EFE6" }}>
                    "{item.problem}"
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(244,239,230,0.55)" }}>{item.detail}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl" style={{ background: "rgba(127,209,159,0.12)", border: "1px solid rgba(127,209,159,0.25)" }}>
              <ChevronRight className="w-5 h-5" style={{ color: "#7FD19F" }} />
              <p className="font-semibold" style={{ color: "#F4EFE6" }}>
                Com o plano <span style={{ color: "#7FD19F" }}>Premium</span>, você tem um especialista para resolver exatamente isso
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="ferramentas" className="py-32" style={{ background: "#EBE4D6" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#1F5A3A" }}>Ferramentas</p>
            <h2 className="font-extrabold mb-4 text-4xl md:text-5xl" style={{ color: "#0E3B2E" }}>
              Tudo que seu negócio precisa em um só lugar
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "rgba(14,59,46,0.6)" }}>
              A ferramenta resolve o registro. O especialista resolve a decisão.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: "Fluxo de Caixa", description: "Controle total de entradas e saídas. Saiba exatamente onde seu dinheiro está indo." },
              { icon: PieChart, title: "Relatórios", description: "Visualize sua margem, custos e crescimento em gráficos claros e prontos para decisão." },
              { icon: Clock, title: "Contas a Pagar/Receber", description: "Nunca esqueça um vencimento. Controle seus compromissos financeiros com antecedência." },
              { icon: Zap, title: "Simuladores", description: "Calcule preços, margens e cenários antes de fechar qualquer proposta ou contrato." }
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title}
                  className="rounded-xl p-8 transition-all cursor-default group"
                  style={{ background: "#F4EFE6", border: "1px solid rgba(20,18,15,0.1)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(14,59,46,0.12)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: "rgba(14,59,46,0.08)" }}>
                    <Icon className="w-7 h-7" style={{ color: "#0E3B2E" }} />
                  </div>
                  <h3 className="font-bold mb-3 text-xl" style={{ color: "#0E3B2E" }}>{feature.title}</h3>
                  <p className="leading-relaxed" style={{ color: "rgba(14,59,46,0.6)" }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Specialist ──────────────────────────────────────────── */}
      <section id="especialista" className="py-32" style={{ background: "#F4EFE6" }}>
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-20">
            <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#1F5A3A" }}>Exclusivo no plano Premium</p>
            <h2 className="font-extrabold text-4xl md:text-5xl mb-5 leading-tight" style={{ color: "#0E3B2E" }}>
              Você não está sozinho.
              <br />
              <span style={{ color: "#1F5A3A" }}>Tem alguém do seu lado.</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "rgba(14,59,46,0.65)" }}>
              Além de toda a plataforma, o plano Premium inclui um especialista financeiro humano que te orienta todo mês — não um chatbot, não um FAQ.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">

            {/* Left: what the specialist does */}
            <div className="space-y-6">
              {[
                {
                  icon: CalendarCheck,
                  title: "Sessão mensal de 30 minutos",
                  description: "Revisão completa do mês com um especialista — por vídeo ou WhatsApp. Suas despesas, sua margem, suas dúvidas. Uma conversa que vale mais que qualquer relatório.",
                  highlight: true
                },
                {
                  icon: MessageCircle,
                  title: "Suporte assíncrono ilimitado",
                  description: "Dúvidas respondidas por chat em até 1 dia útil, o mês inteiro. Surgiu uma dúvida antes de fechar um contrato? Antes de tomar crédito? É para isso.",
                  highlight: false
                },
                {
                  icon: UserCheck,
                  title: "Plano financeiro personalizado",
                  description: "Orientação prática sobre precificação, reservas, corte de gastos e oportunidades de crescimento — adaptada ao seu negócio específico.",
                  highlight: false
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title}
                    className="flex gap-5 p-5 rounded-xl transition-all"
                    style={{
                      background: item.highlight ? "#0E3B2E" : "#EBE4D6",
                      border: `1px solid ${item.highlight ? "transparent" : "rgba(20,18,15,0.08)"}`
                    }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: item.highlight ? "rgba(127,209,159,0.2)" : "rgba(14,59,46,0.1)" }}>
                      <Icon className="w-6 h-6" style={{ color: item.highlight ? "#7FD19F" : "#0E3B2E" }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-2" style={{ color: item.highlight ? "#F4EFE6" : "#0E3B2E" }}>{item.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: item.highlight ? "rgba(244,239,230,0.7)" : "rgba(14,59,46,0.65)" }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: value comparison + CTA */}
            <div className="space-y-6">
              {/* Value anchor card */}
              <div className="rounded-2xl p-8" style={{ background: "#EBE4D6", border: "1px solid rgba(14,59,46,0.12)" }}>
                <Quote className="w-8 h-8 mb-5" style={{ color: "#1F5A3A", opacity: 0.4 }} />
                <p className="text-lg font-semibold leading-relaxed mb-6" style={{ color: "#0E3B2E" }}>
                  "Uma consulta avulsa com um contador ou consultor financeiro custa entre{" "}
                  <span style={{ fontWeight: 800 }}>R$ 200 e R$ 500</span>.
                  Com o plano Premium, você tem isso incluído — todo mês."
                </p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(14,59,46,0.12)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(14,59,46,0.1)" }}>
                    <Users className="w-5 h-5" style={{ color: "#1F5A3A" }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#0E3B2E" }}>Equipe DashComigo</p>
                    <p className="text-xs" style={{ color: "rgba(14,59,46,0.55)" }}>Especialistas em finanças para MEI</p>
                  </div>
                </div>
              </div>

              {/* Risk reduction */}
              <div className="rounded-2xl p-6" style={{ background: "#0E3B2E" }}>
                <p className="font-bold text-base mb-4" style={{ color: "#7FD19F" }}>Uma decisão errada pode custar caro.</p>
                <div className="space-y-3">
                  {[
                    "Precificação abaixo do custo real → meses trabalhando no prejuízo",
                    "Ultrapassar o limite MEI sem planejamento → multas e imposto retroativo",
                    "Retirar mais do que o negócio suporta → capital de giro insuficiente"
                  ].map((risk, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(176,74,58,0.25)" }}>
                        <X className="w-3 h-3" style={{ color: "#e87c6e" }} />
                      </div>
                      <p className="text-sm" style={{ color: "rgba(244,239,230,0.75)" }}>{risk}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm mt-5 font-medium" style={{ color: "rgba(244,239,230,0.55)" }}>
                  O plano Premium custa menos que uma hora de consultoria. E você tem isso todo mês.
                </p>
              </div>

              <button
                onClick={() => navigate("/pricing")}
                className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all"
                style={{ background: "#0E3B2E", color: "#F4EFE6" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#082219"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0E3B2E"; }}
              >
                Ver planos e assinar o Premium
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Three outcomes */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { stat: "30 dias", label: "Para sentir a diferença", description: "Nossos clientes relatam mais clareza financeira já no primeiro mês de orientação." },
              { stat: "1×/mês", label: "Sessão com especialista", description: "Uma revisão mensal dedicada ao seu negócio. Suas metas, seus números, suas decisões." },
              { stat: "Ilimitado", label: "Suporte no mês todo", description: "Dúvidas no chat respondidas em até 1 dia útil — sem precisar esperar a sessão." }
            ].map((item) => (
              <div key={item.label}
                className="rounded-xl p-8 text-center"
                style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.1)" }}
              >
                <p className="text-4xl font-extrabold mb-3" style={{ color: "#1F5A3A" }}>{item.stat}</p>
                <h3 className="font-bold text-base mb-3" style={{ color: "#0E3B2E" }}>{item.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(14,59,46,0.6)" }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison: Básico vs Premium ──────────────────────── */}
      <section className="py-24" style={{ background: "#EBE4D6" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-extrabold text-3xl md:text-4xl mb-4" style={{ color: "#0E3B2E" }}>
              A diferença que muda tudo
            </h2>
            <p className="text-lg" style={{ color: "rgba(14,59,46,0.65)" }}>Dois planos, duas experiências completamente diferentes.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Básico */}
            <div className="rounded-2xl p-8" style={{ background: "#F4EFE6", border: "2px solid rgba(14,59,46,0.2)" }}>
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(14,59,46,0.5)" }}>Plano Básico</p>
                <p className="text-2xl font-extrabold" style={{ color: "#0E3B2E" }}>Você organiza.</p>
              </div>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(14,59,46,0.65)" }}>
                Ferramentas completas para registrar, acompanhar e exportar. Você tem os dados — e toma as decisões sozinho.
              </p>
              <div className="space-y-3">
                {["Fluxo de caixa ilimitado", "Relatórios e exportações", "Propostas ilimitadas", "Simuladores avançados", "Suporte por chat"].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#1F5A3A" }} />
                    <span className="text-sm" style={{ color: "rgba(14,59,46,0.8)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 font-extrabold text-xl" style={{ color: "#0E3B2E" }}>R$ 29,90<span className="text-sm font-normal" style={{ color: "rgba(14,59,46,0.5)" }}>/mês</span></p>
            </div>

            {/* Premium */}
            <div className="rounded-2xl p-8 relative" style={{ background: "#0E3B2E" }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ background: "#7FD19F", color: "#0E3B2E" }}>
                RECOMENDADO
              </div>
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(127,209,159,0.7)" }}>Plano Premium</p>
                <p className="text-2xl font-extrabold" style={{ color: "#F4EFE6" }}>Você tem orientação.</p>
              </div>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(244,239,230,0.65)" }}>
                Tudo do Básico, mais um especialista humano que revisa seu negócio todo mês e te ajuda a tomar as decisões certas.
              </p>
              <div className="space-y-3">
                {[
                  "Tudo do Básico, sem exceção",
                  "Sessão mensal com especialista (30 min)",
                  "Suporte por chat ilimitado (até 1 dia útil)",
                  "Plano financeiro personalizado",
                  "Acesso prioritário a novos recursos"
                ].map((f, i) => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: i < 1 ? "rgba(127,209,159,0.5)" : "#7FD19F" }} />
                    <span className="text-sm" style={{ color: i < 1 ? "rgba(244,239,230,0.6)" : "#F4EFE6", fontWeight: i >= 1 ? 500 : 400 }}>{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <p className="font-extrabold text-xl" style={{ color: "#7FD19F" }}>R$ 89,90<span className="text-sm font-normal" style={{ color: "rgba(244,239,230,0.5)" }}>/mês</span></p>
                <p className="text-xs mt-1" style={{ color: "rgba(244,239,230,0.5)" }}>1º mês por R$ 59,90 — inclui sua primeira sessão com o especialista</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────── */}
      <section id="planos" className="py-32" style={{ background: "#F4EFE6" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#1F5A3A" }}>Planos e preços</p>
            <h2 className="font-extrabold mb-4 text-4xl md:text-5xl" style={{ color: "#0E3B2E" }}>
              Escolha como quer crescer
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "rgba(14,59,46,0.6)" }}>
              Comece grátis. Evolua quando fizer sentido. Cancele quando quiser.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {/* Gratuito */}
            <div className="rounded-2xl p-8 flex flex-col"
              style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.13)" }}>
              <div className="mb-6">
                <h3 className="font-bold text-xl mb-1" style={{ color: "#0E3B2E" }}>Gratuito</h3>
                <p className="text-sm" style={{ color: "rgba(14,59,46,0.6)" }}>Comece sem gastar nada</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-extrabold" style={{ color: "#0E3B2E" }}>R$ 0</span>
                <span className="text-base ml-1" style={{ color: "rgba(14,59,46,0.5)" }}>/mês</span>
                <p className="text-xs mt-1" style={{ color: "rgba(14,59,46,0.45)" }}>Para sempre grátis</p>
              </div>
              <button onClick={() => navigate("/signup")}
                className="w-full py-3.5 rounded-xl font-bold transition-all mb-8"
                style={{ background: "transparent", color: "#0E3B2E", border: "2px solid #0E3B2E" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#0E3B2E"; e.currentTarget.style.color = "#F4EFE6"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0E3B2E"; }}>
                Criar conta grátis
              </button>
              <ul className="space-y-3 flex-1">
                {["Dashboard com relatórios básicos", "30 lançamentos/mês", "Contas a pagar e receber", "2 propostas por dia", "Simulador MEI"].map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#1F5A3A" }} />
                    <span className="text-sm" style={{ color: "rgba(14,59,46,0.75)" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium – hero */}
            <div className="rounded-2xl p-8 flex flex-col lg:scale-105"
              style={{ background: "#0E3B2E", boxShadow: "0 20px 60px rgba(14,59,46,0.3)" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(127,209,159,0.2)", color: "#7FD19F" }}>
                  RECOMENDADO
                </span>
              </div>
              <div className="mb-6 mt-3">
                <h3 className="font-bold text-xl mb-1" style={{ color: "#F4EFE6" }}>Premium</h3>
                <p className="text-sm" style={{ color: "rgba(244,239,230,0.65)" }}>A plataforma + um especialista do seu lado.</p>
              </div>
              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold" style={{ color: "#7FD19F" }}>R$ 59,90</span>
                  <span className="text-base" style={{ color: "rgba(244,239,230,0.5)" }}>/1º mês</span>
                </div>
                <p className="text-sm mt-1" style={{ color: "rgba(244,239,230,0.45)" }}>Depois R$ 89,90/mês — cancele quando quiser</p>
              </div>
              <p className="text-xs mb-6 leading-relaxed px-3 py-2 rounded-lg" style={{ background: "rgba(127,209,159,0.1)", color: "rgba(244,239,230,0.7)", border: "1px solid rgba(127,209,159,0.15)" }}>
                O 1º mês inclui sua primeira sessão com o especialista. Experimente a orientação na prática antes de qualquer compromisso.
              </p>
              <button onClick={() => navigate("/signup")}
                className="w-full py-3.5 rounded-xl font-bold transition-all mb-6"
                style={{ background: "#7FD19F", color: "#0E3B2E" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F4EFE6"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#7FD19F"; }}>
                Experimentar o Premium →
              </button>
              <ul className="space-y-3 flex-1">
                {[
                  { text: "Tudo do Básico, sem exceção", highlight: false },
                  { text: "Sessão mensal com especialista (30 min)", highlight: true },
                  { text: "Suporte por chat ilimitado (até 1 dia útil)", highlight: true },
                  { text: "Plano financeiro personalizado", highlight: true },
                  { text: "Acesso prioritário a novos recursos", highlight: false }
                ].map(({ text, highlight }) => (
                  <li key={text} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#7FD19F" }} />
                    <span className="text-sm" style={{ color: "rgba(244,239,230,0.85)", fontWeight: highlight ? 600 : 400 }}>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Básico */}
            <div className="rounded-2xl p-8 flex flex-col"
              style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.13)" }}>
              <div className="mb-6">
                <h3 className="font-bold text-xl mb-1" style={{ color: "#0E3B2E" }}>Básico</h3>
                <p className="text-sm" style={{ color: "rgba(14,59,46,0.6)" }}>Gestão completa. Você no controle.</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-extrabold" style={{ color: "#0E3B2E" }}>R$ 29,90</span>
                <span className="text-base ml-1" style={{ color: "rgba(14,59,46,0.5)" }}>/mês</span>
                <p className="text-xs mt-1" style={{ color: "rgba(14,59,46,0.45)" }}>Menos de R$ 1,00 por dia</p>
              </div>
              <button onClick={() => navigate("/signup")}
                className="w-full py-3.5 rounded-xl font-bold transition-all mb-8"
                style={{ background: "transparent", color: "#0E3B2E", border: "2px solid #0E3B2E" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#0E3B2E"; e.currentTarget.style.color = "#F4EFE6"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0E3B2E"; }}>
                Assinar Básico
              </button>
              <ul className="space-y-3 flex-1">
                {["Tudo do Gratuito, sem limites", "Fluxo de caixa ilimitado", "Propostas ilimitadas", "Relatórios e exportações completas", "Simuladores avançados", "Suporte por chat"].map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#1F5A3A" }} />
                    <span className="text-sm" style={{ color: "rgba(14,59,46,0.75)" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <p className="text-center mt-10 text-sm" style={{ color: "rgba(14,59,46,0.45)" }}>
            Não tem cartão? Comece pelo plano Gratuito — sem limite de tempo.
          </p>
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
          <h2 className="font-extrabold mb-6 text-4xl md:text-5xl leading-tight" style={{ color: "#F4EFE6" }}>
            Clareza financeira começa<br />com o primeiro passo.
          </h2>
          <p className="text-xl mb-10 leading-relaxed font-light max-w-2xl mx-auto" style={{ color: "rgba(244,239,230,0.7)" }}>
            Abra sua conta grátis agora. Experimente o Premium com um especialista real — e veja a diferença nos primeiros 30 dias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-lg font-bold text-lg transition-all shadow-2xl"
              style={{ background: "#7FD19F", color: "#0E3B2E" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F4EFE6"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#7FD19F"; }}
            >
              Criar conta grátis
              <ArrowRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-lg font-bold text-lg transition-all border-2"
              style={{ borderColor: "rgba(244,239,230,0.25)", color: "#F4EFE6" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(244,239,230,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(244,239,230,0.25)"; }}
            >
              Ver planos Premium
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10">
            {["Cancele quando quiser, sem multa", "Resultados visíveis nos primeiros 30 dias", "Especialista humano real — não um bot"].map(t => (
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
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <Logo variant="knockout" />
              </div>
              <p className="text-sm" style={{ color: "rgba(244,239,230,0.6)" }}>
                Gestão financeira inteligente para microempreendedores individuais.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: "#F4EFE6" }}>Produto</h4>
              <ul className="space-y-2 text-sm" style={{ color: "rgba(244,239,230,0.6)" }}>
                <li><a href="#ferramentas" className="hover:text-white transition-colors">Ferramentas</a></li>
                <li><a href="#especialista" className="hover:text-white transition-colors">Especialista Premium</a></li>
                <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: "#F4EFE6" }}>Empresa</h4>
              <ul className="space-y-2 text-sm" style={{ color: "rgba(244,239,230,0.6)" }}>
                <li><Link to="/sobre" className="hover:text-white transition-colors">Sobre</Link></li>
                <li><Link to="/contato" className="hover:text-white transition-colors">Contato</Link></li>
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
