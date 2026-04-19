import { ArrowRight, TrendingUp, PieChart, Clock, Shield, CheckCircle } from "lucide-react";
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
            <a href="#beneficios" className="font-semibold transition-colors" style={{ color: "rgba(14,59,46,0.7)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0E3B2E")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(14,59,46,0.7)")}>
              Benefícios
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
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 right-0 w-[700px] h-[700px] -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
          style={{ background: "#7FD19F" }} />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center py-20">
          {/* Copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: "#EBE4D6", color: "#1F5A3A" }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#7FD19F" }} />
              Gestão financeira para MEI
            </div>

            <h1 className="font-extrabold leading-[1.05] tracking-tight" style={{ fontSize: "4rem", color: "#0E3B2E" }}>
              Domine suas finanças como nunca
            </h1>

            <p className="text-xl leading-relaxed" style={{ color: "rgba(14,59,46,0.7)", maxWidth: "480px" }}>
              A plataforma completa para MEIs crescerem com inteligência financeira e controle total.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center justify-center gap-2 px-10 py-5 rounded-lg font-bold text-lg transition-all shadow-lg"
                style={{ background: "#0E3B2E", color: "#F4EFE6" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#082219"; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#0E3B2E"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                Abra sua conta
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#ferramentas"
                className="flex items-center justify-center gap-2 px-10 py-5 rounded-lg font-bold text-lg transition-all border-2"
                style={{ borderColor: "rgba(14,59,46,0.3)", color: "#0E3B2E" }}
              >
                Conhecer soluções
              </a>
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

              {/* Chart */}
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

              {/* Transactions */}
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

            {/* Floating: Despesas */}
            <div className="absolute bottom-24 -right-6 rounded-xl shadow-xl p-4 w-48 animate-bounce"
              style={{ background: "#FFFFFF", border: "1px solid rgba(20,18,15,0.1)", animationDelay: "0.3s" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(14,59,46,0.5)" }}>Despesas (mês)</p>
              <p className="text-2xl font-bold" style={{ color: "#B04A3A" }}>-R$ 8.320</p>
              <div className="flex items-center gap-1 mt-1">
                <PieChart className="w-3 h-3" style={{ color: "rgba(14,59,46,0.5)" }} />
                <p className="text-xs font-semibold" style={{ color: "rgba(14,59,46,0.5)" }}>67% do previsto</p>
              </div>
            </div>

            {/* Floating: A Receber */}
            <div className="absolute top-44 -right-12 rounded-xl shadow-xl p-4 w-44 animate-bounce"
              style={{ background: "#FFFFFF", border: "1px solid rgba(20,18,15,0.1)", animationDelay: "0.6s" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(14,59,46,0.5)" }}>A Receber</p>
              <p className="text-2xl font-bold" style={{ color: "#0E3B2E" }}>R$ 5.200</p>
              <p className="text-xs mt-1" style={{ color: "rgba(14,59,46,0.5)" }}>3 faturas pendentes</p>
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

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="ferramentas" className="py-32" style={{ background: "#EBE4D6" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-extrabold mb-4 text-5xl" style={{ color: "#0E3B2E" }}>
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: "rgba(14,59,46,0.6)" }}>
              Soluções completas para você gerenciar seu negócio com inteligência
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: "Fluxo de Caixa", description: "Controle total de entradas e saídas em tempo real" },
              { icon: PieChart, title: "Relatórios", description: "Análises visuais para decisões inteligentes" },
              { icon: Clock, title: "Contas", description: "Gerencie prazos e compromissos financeiros" },
              { icon: Shield, title: "Segurança", description: "Seus dados 100% protegidos e criptografados" }
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title}
                  className="rounded-xl p-8 transition-all cursor-pointer group"
                  style={{ background: "#F4EFE6", border: "1px solid rgba(20,18,15,0.1)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(14,59,46,0.12)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors"
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

      {/* ── Benefits ────────────────────────────────────────────── */}
      <section id="beneficios" className="py-32" style={{ background: "#F4EFE6" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-extrabold mb-4 text-5xl" style={{ color: "#0E3B2E" }}>
              Mais de 1.000 funcionalidades<br />ao seu alcance
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: "rgba(14,59,46,0.6)" }}>
              Se precisar de ajuda, aqui você tem atendimento humanizado 24h por dia, 7 dias por semana
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { stat: "70%", label: "Redução no tempo de gestão", description: "Automatize tarefas repetitivas e foque no que importa" },
              { stat: "+25%", label: "Aumento na lucratividade", description: "Identifique despesas e oportunidades de otimização" },
              { stat: "100%", label: "Conformidade fiscal", description: "Registros organizados para suas declarações" }
            ].map((benefit) => (
              <div key={benefit.label}
                className="rounded-xl p-10 text-center transition-all"
                style={{ background: "#FFFFFF", border: "1px solid rgba(20,18,15,0.1)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(14,59,46,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
              >
                <p className="text-6xl font-extrabold mb-4" style={{ color: "#1F5A3A" }}>{benefit.stat}</p>
                <h3 className="font-bold mb-4 text-xl" style={{ color: "#0E3B2E" }}>{benefit.label}</h3>
                <p className="leading-relaxed" style={{ color: "rgba(14,59,46,0.6)" }}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────── */}
      <section id="planos" className="py-32" style={{ background: "#EBE4D6" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-extrabold mb-4 text-5xl" style={{ color: "#0E3B2E" }}>
              Planos para seu momento
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "rgba(14,59,46,0.6)" }}>
              Comece grátis e evolua conforme seu negócio cresce
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Gratuito", price: "R$ 0", period: "/mês",
                description: "Perfeito para começar",
                features: ["Dashboard completo", "Até 50 lançamentos/mês", "Relatórios básicos", "Contas a pagar e receber", "Suporte por email"],
                cta: "Começar grátis", highlighted: false
              },
              {
                name: "Pro", price: "R$ 29", period: "/mês",
                description: "Para MEIs em crescimento",
                features: ["Tudo do Gratuito", "Lançamentos ilimitados", "Relatórios avançados", "Automações e recorrências", "Categorização inteligente", "Suporte prioritário"],
                cta: "Começar teste grátis", highlighted: true
              },
              {
                name: "Premium", price: "R$ 59", period: "/mês",
                description: "Máximo controle e insights",
                features: ["Tudo do Pro", "Multi-empresas (até 3)", "Integrações bancárias", "Análise preditiva", "API de acesso", "Gerente de conta dedicado"],
                cta: "Falar com vendas", highlighted: false
              }
            ].map((plan) => (
              <div key={plan.name}
                className={`rounded-xl p-8 ${plan.highlighted ? "lg:scale-105" : ""}`}
                style={plan.highlighted
                  ? { background: "#0E3B2E", boxShadow: "0 20px 60px rgba(14,59,46,0.3)" }
                  : { background: "#F4EFE6", border: "1px solid rgba(20,18,15,0.13)" }
                }
              >
                <h3 className="font-bold text-xl mb-2" style={{ color: plan.highlighted ? "#F4EFE6" : "#0E3B2E" }}>
                  {plan.name}
                </h3>
                <p className="text-sm mb-6" style={{ color: plan.highlighted ? "rgba(244,239,230,0.7)" : "rgba(14,59,46,0.6)" }}>
                  {plan.description}
                </p>

                <div className="mb-8">
                  <span className="text-5xl font-extrabold" style={{ color: plan.highlighted ? "#7FD19F" : "#0E3B2E" }}>
                    {plan.price}
                  </span>
                  <span className="text-lg" style={{ color: plan.highlighted ? "rgba(244,239,230,0.6)" : "rgba(14,59,46,0.5)" }}>
                    {plan.period}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="block w-full text-center px-6 py-4 rounded-lg font-bold transition-all mb-8"
                  style={plan.highlighted
                    ? { background: "#7FD19F", color: "#0E3B2E" }
                    : { background: "#0E3B2E", color: "#F4EFE6" }
                  }
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  {plan.cta}
                </button>

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0"
                        style={{ color: plan.highlighted ? "#7FD19F" : "#1F5A3A" }} />
                      <span className="text-sm" style={{ color: plan.highlighted ? "rgba(244,239,230,0.9)" : "#0E3B2E" }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
          <h2 className="font-extrabold mb-6 text-5xl" style={{ color: "#F4EFE6" }}>
            Pronto para dominar suas finanças?
          </h2>
          <p className="text-xl mb-10 leading-relaxed font-light" style={{ color: "rgba(244,239,230,0.8)" }}>
            Junte-se a milhares de MEIs que já organizaram suas finanças com o DashComigo
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-lg font-bold text-lg transition-all shadow-2xl"
            style={{ background: "#7FD19F", color: "#0E3B2E" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#F4EFE6"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#7FD19F"; }}
          >
            Abrir minha conta
            <ArrowRight className="w-6 h-6" />
          </button>
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
                <li><a href="#beneficios" className="hover:text-white transition-colors">Benefícios</a></li>
                <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: "#F4EFE6" }}>Empresa</h4>
              <ul className="space-y-2 text-sm" style={{ color: "rgba(244,239,230,0.6)" }}>
                <li><Link to="/sobre" className="hover:text-white transition-colors">Sobre</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
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
