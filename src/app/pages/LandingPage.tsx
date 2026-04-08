import { ArrowRight, TrendingUp, PieChart, Clock, Shield, Zap, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003a6d] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl text-[#001529]">FinMEI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="#ferramentas" className="text-[#001529]/70 hover:text-[#001529] transition-colors font-semibold">
              Ferramentas
            </Link>
            <a href="#beneficios" className="text-[#001529]/70 hover:text-[#001529] transition-colors font-semibold">
              Benefícios
            </a>
            <a href="#planos" className="text-[#001529]/70 hover:text-[#001529] transition-colors font-semibold">
              Planos
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-[#001529] font-semibold hover:text-[#003a6d] transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-[#003a6d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002a50] transition-all"
            >
              Abrir conta
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#001529] via-[#002140] to-[#003a6d]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h1 className="font-extrabold text-white leading-[1.05] tracking-tight" style={{ fontSize: "4.5rem" }}>
              Domine suas finanças como nunca
            </h1>

            <p className="text-2xl text-white/80 leading-relaxed font-light">
              A plataforma completa para MEIs crescerem com inteligência financeira e controle total.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center justify-center gap-2 bg-white text-[#001529] px-10 py-5 rounded-lg font-bold hover:bg-white/90 transition-all shadow-2xl text-lg"
              >
                Abra sua conta
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#ferramentas"
                className="flex items-center justify-center gap-2 border-2 border-white/30 text-white px-10 py-5 rounded-lg font-bold hover:bg-white/10 transition-all text-lg backdrop-blur-sm"
              >
                Conhecer soluções
              </a>
            </div>
          </div>

          {/* Product Mockup with Floating Elements */}
          <div className="relative hidden lg:block h-[600px]">
            {/* Main Dashboard Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-[480px] border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-[#001529]/60 font-semibold uppercase tracking-wider">Saldo Atual</p>
                  <p className="text-3xl font-bold text-[#001529] mt-1">R$ 24.580,00</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#10b981]" />
                </div>
              </div>

              {/* Mini Chart */}
              <div className="h-32 mb-4 bg-gradient-to-t from-[#10b981]/10 to-transparent rounded-lg relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                  <path
                    d="M 0,80 L 50,60 L 100,70 L 150,40 L 200,45 L 250,30 L 300,35 L 350,20 L 400,25"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <path
                    d="M 0,80 L 50,60 L 100,70 L 150,40 L 200,45 L 250,30 L 300,35 L 350,20 L 400,25 L 400,100 L 0,100 Z"
                    fill="url(#gradient)"
                    opacity="0.3"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Transaction List Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-[#10b981] -rotate-45" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#001529]">Serviço Design</p>
                      <p className="text-xs text-[#001529]/60">Hoje • 14:30</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#10b981]">+R$ 2.500,00</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ef4444]/10 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-[#ef4444] rotate-45" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#001529]">Fornecedor ABC</p>
                      <p className="text-xs text-[#001529]/60">Ontem • 10:15</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#ef4444]">-R$ 850,00</p>
                </div>
              </div>
            </div>

            {/* Floating Card: Revenue */}
            <div className="absolute top-12 -left-4 bg-white rounded-xl shadow-xl p-4 w-48 border border-white/20 animate-bounce" style={{ animationDelay: "0s" }}>
              <p className="text-xs text-[#001529]/60 font-semibold uppercase tracking-wider mb-2">Receitas (mês)</p>
              <p className="text-2xl font-bold text-[#10b981]">+R$ 12.450</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-[#10b981]" />
                <p className="text-xs text-[#10b981] font-semibold">+32.5%</p>
              </div>
            </div>

            {/* Floating Card: Expense */}
            <div className="absolute bottom-24 -right-6 bg-white rounded-xl shadow-xl p-4 w-48 border border-white/20 animate-bounce" style={{ animationDelay: "0.3s" }}>
              <p className="text-xs text-[#001529]/60 font-semibold uppercase tracking-wider mb-2">Despesas (mês)</p>
              <p className="text-2xl font-bold text-[#ef4444]">-R$ 8.320</p>
              <div className="flex items-center gap-1 mt-1">
                <PieChart className="w-3 h-3 text-[#001529]/60" />
                <p className="text-xs text-[#001529]/60 font-semibold">67% do previsto</p>
              </div>
            </div>

            {/* Floating Card: Pending */}
            <div className="absolute top-44 -right-12 bg-white rounded-xl shadow-xl p-4 w-44 border border-white/20 animate-bounce" style={{ animationDelay: "0.6s" }}>
              <p className="text-xs text-[#001529]/60 font-semibold uppercase tracking-wider mb-2">A Receber</p>
              <p className="text-2xl font-bold text-[#f59e0b]">R$ 5.200</p>
              <p className="text-xs text-[#001529]/60 mt-1">3 faturas pendentes</p>
            </div>

            {/* Floating Badge: DAS-MEI */}
            <div className="absolute bottom-12 left-8 bg-gradient-to-r from-[#003a6d] to-[#0066FF] rounded-lg shadow-xl px-4 py-2">
              <p className="text-xs text-white/80 font-semibold">DAS-MEI vence em:</p>
              <p className="text-lg font-bold text-white">8 dias</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-sm font-medium">Role para descobrir</span>
            <ArrowRight className="w-5 h-5 rotate-90" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="ferramentas" className="py-32 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-extrabold text-[#001529] mb-4 text-5xl">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-[#001529]/60 max-w-3xl mx-auto">
              Soluções completas para você gerenciar seu negócio com inteligência
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Fluxo de Caixa",
                description: "Controle total de entradas e saídas em tempo real"
              },
              {
                icon: PieChart,
                title: "Relatórios",
                description: "Análises visuais para decisões inteligentes"
              },
              {
                icon: Clock,
                title: "Contas",
                description: "Gerencie prazos e compromissos financeiros"
              },
              {
                icon: Shield,
                title: "Segurança",
                description: "Seus dados 100% protegidos e criptografados"
              }
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-xl p-8 hover:shadow-xl transition-all cursor-pointer group border border-transparent hover:border-[#003a6d]/20"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#003a6d]/10 flex items-center justify-center mb-6 group-hover:bg-[#003a6d] transition-colors">
                    <Icon className="w-7 h-7 text-[#003a6d] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#001529] mb-3 text-xl">{feature.title}</h3>
                  <p className="text-[#001529]/60 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-extrabold text-[#001529] mb-4 text-5xl">
              Mais de 1.000 funcionalidades<br />ao seu alcance
            </h2>
            <p className="text-xl text-[#001529]/60 max-w-3xl mx-auto">
              Se precisar de ajuda, aqui você tem atendimento humanizado 24h por dia, 7 dias por semana
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                stat: "70%",
                label: "Redução no tempo de gestão",
                description: "Automatize tarefas repetitivas e foque no que importa"
              },
              {
                stat: "+25%",
                label: "Aumento na lucratividade",
                description: "Identifique despesas e oportunidades de otimização"
              },
              {
                stat: "100%",
                label: "Conformidade fiscal",
                description: "Registros organizados para suas declarações"
              }
            ].map((benefit) => (
              <div
                key={benefit.label}
                className="bg-white rounded-xl p-10 text-center border border-[#E5E7EB] hover:border-[#003a6d]/30 hover:shadow-lg transition-all"
              >
                <p className="text-6xl font-extrabold text-[#003a6d] mb-4">{benefit.stat}</p>
                <h3 className="font-bold text-[#001529] mb-4 text-xl">{benefit.label}</h3>
                <p className="text-[#001529]/60 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-32 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-extrabold text-[#001529] mb-4 text-5xl">
              Planos para seu momento
            </h2>
            <p className="text-xl text-[#001529]/60 max-w-2xl mx-auto">
              Comece grátis e evolua conforme seu negócio cresce
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Gratuito",
                price: "R$ 0",
                period: "/mês",
                description: "Perfeito para começar",
                features: [
                  "Dashboard completo",
                  "Até 50 lançamentos/mês",
                  "Relatórios básicos",
                  "Contas a pagar e receber",
                  "Suporte por email"
                ],
                cta: "Começar grátis",
                highlighted: false
              },
              {
                name: "Pro",
                price: "R$ 29",
                period: "/mês",
                description: "Para MEIs em crescimento",
                features: [
                  "Tudo do Gratuito",
                  "Lançamentos ilimitados",
                  "Relatórios avançados",
                  "Automações e recorrências",
                  "Categorização inteligente",
                  "Suporte prioritário"
                ],
                cta: "Começar teste grátis",
                highlighted: true
              },
              {
                name: "Premium",
                price: "R$ 59",
                period: "/mês",
                description: "Máximo controle e insights",
                features: [
                  "Tudo do Pro",
                  "Multi-empresas (até 3)",
                  "Integrações bancárias",
                  "Análise preditiva",
                  "API de acesso",
                  "Gerente de conta dedicado"
                ],
                cta: "Falar com vendas",
                highlighted: false
              }
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-8 ${
                  plan.highlighted
                    ? "bg-[#003a6d] text-white shadow-2xl lg:scale-105"
                    : "bg-white border border-[#E5E7EB]"
                }`}
              >
                <h3 className={`font-bold text-xl mb-2 ${plan.highlighted ? "text-white" : "text-[#001529]"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.highlighted ? "text-white/80" : "text-[#001529]/60"}`}>
                  {plan.description}
                </p>

                <div className="mb-8">
                  <span className={`text-5xl font-extrabold ${plan.highlighted ? "text-white" : "text-[#001529]"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ${plan.highlighted ? "text-white/70" : "text-[#001529]/60"}`}>
                    {plan.period}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className={`block w-full text-center px-6 py-4 rounded-lg font-bold transition-all mb-8 ${
                    plan.highlighted
                      ? "bg-white text-[#003a6d] hover:bg-white/90"
                      : "bg-[#003a6d] text-white hover:bg-[#002a50]"
                  }`}
                >
                  {plan.cta}
                </button>

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? "text-white" : "text-[#003a6d]"
                      }`} />
                      <span className={`text-sm ${plan.highlighted ? "text-white/90" : "text-[#001529]"}`}>
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

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-br from-[#001529] to-[#003a6d] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-extrabold text-white mb-6 text-5xl">
            Pronto para dominar suas finanças?
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed font-light">
            Junte-se a milhares de MEIs que já organizaram suas finanças com o FinMEI
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="inline-flex items-center gap-3 bg-white text-[#001529] px-10 py-5 rounded-lg font-bold hover:bg-white/90 transition-all shadow-2xl text-lg"
          >
            Abrir minha conta
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001529] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">FinMEI</span>
              </div>
              <p className="text-sm text-white/60">
                Gestão financeira inteligente para microempreendedores individuais.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#ferramentas" className="hover:text-white transition-colors">Ferramentas</a></li>
                <li><a href="#beneficios" className="hover:text-white transition-colors">Benefícios</a></li>
                <li><a href="#planos" className="hover:text-white transition-colors">Planos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/60">
            <p>&copy; 2026 FinMEI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
