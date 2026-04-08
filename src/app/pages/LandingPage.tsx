import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { BenefitsSection } from "../components/BenefitsSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { CTASection } from "../components/CTASection";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { ArrowRight, Check, Crown, TrendingUp, Users, PieChart, Target, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const scrollToSimulator = () => {
    navigate("/app/mei-me");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onScrollToSimulator={scrollToSimulator} />

      <main className="pt-16">
        <HeroSection onScrollToSimulator={scrollToSimulator} />

        {/* Quick Access to Platform - Premium Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Subtle glow effects */}
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#28A263] rounded-full opacity-3 blur-[120px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex px-3 py-1.5 bg-[#28A263]/8 rounded-full mb-6 border border-[#28A263]/15">
                <span className="text-xs text-[#28A263] font-semibold uppercase tracking-wider">
                  Ferramentas Poderosas
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#001529] mb-6 leading-tight">
                Escolha entre <span className="text-[#28A263]">10+ ferramentas</span> essenciais
              </h2>
              <p className="text-lg sm:text-xl text-[rgba(0,21,41,0.65)] max-w-2xl mx-auto">
                {isAuthenticated
                  ? "Acesse todas as ferramentas do seu dashboard para gerenciar finanças com inteligência"
                  : "Comece grátis e tenha acesso imediato a ferramentas profissionais de gestão financeira"}
              </p>
            </div>

            {/* Highlight Fluxo de Caixa - Premium Card */}
            <div className="mb-16 p-8 sm:p-12 bg-gradient-to-br from-[#28A263]/5 to-white rounded-3xl border border-[#28A263]/15 shadow-sm hover:border-[#28A263]/25 transition-all duration-300">
              <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
                <div className="w-20 h-20 bg-[#28A263] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h3 className="text-3xl font-bold text-[#001529]">Fluxo de Caixa Inteligente</h3>
                    <span className="px-3 py-1 bg-[#28A263]/15 text-[#28A263] text-xs font-bold rounded-full border border-[#28A263]/25 uppercase tracking-wide">
                      Novo
                    </span>
                  </div>
                  <p className="text-lg text-[rgba(0,21,41,0.65)] mb-6 leading-relaxed">
                    Registre entradas e saídas com facilidade, receba insights automáticos e tome decisões baseadas em dados reais do seu negócio.
                    <span className="block font-semibold text-[#001529] mt-2">Simples como um caderno, inteligente como um contador.</span>
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {["30 lançamentos/mês grátis", "Alertas automáticos", "Categorias inteligentes", "Sem complexidade"].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-[rgba(0,21,41,0.65)]">
                        <Check className="w-5 h-5 text-[#28A263] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="lg"
                    className="bg-[#28A263] hover:bg-[#1F8C50] text-white rounded-xl h-12 px-6 font-semibold shadow-lg hover:shadow-xl transition-all"
                    onClick={() => navigate(isAuthenticated ? "/app" : "/signup")}
                  >
                    {isAuthenticated ? "Acessar Fluxo de Caixa" : "Começar Grátis"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Cards Grid - Premium Layout */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {/* Free Tool 1 */}
              <div className="group bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl p-8 hover:border-[#28A263]/20 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#28A263]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/15 transition-colors">
                  <svg className="w-7 h-7 text-[#28A263]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="inline-block px-2.5 py-1 bg-[#28A263]/10 text-[#28A263] text-xs font-bold rounded-full border border-[#28A263]/15 mb-4 uppercase tracking-wide">
                  Grátis
                </span>
                <h3 className="text-xl font-bold text-[#001529] mb-2">Simulador MEI → ME</h3>
                <p className="text-sm text-[rgba(0,21,41,0.65)] mb-6">Compare impostos sem precisar se cadastrar. Descubra quando migrar.</p>
                <Button
                  className="w-full bg-white text-[#28A263] hover:bg-[#F8F9FA] rounded-xl border border-[#28A263]/20 font-semibold transition-all h-11"
                  onClick={() => navigate("/app/mei-me")}
                >
                  Simular Grátis
                </Button>
              </div>

              {/* Free with signup */}
              <div className="group bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl p-8 hover:border-[#28A263]/20 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#28A263]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/15 transition-colors">
                  <svg className="w-7 h-7 text-[#28A263]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="inline-block px-2.5 py-1 bg-[#28A263]/10 text-[#28A263] text-xs font-bold rounded-full border border-[#28A263]/15 mb-4 uppercase tracking-wide">
                  Grátis
                </span>
                <h3 className="text-xl font-bold text-[#001529] mb-2">Gerador de Propostas</h3>
                <p className="text-sm text-[rgba(0,21,41,0.65)] mb-6">Crie 2 propostas profissionais por dia. Sem templates limitados.</p>
                <Button
                  className="w-full bg-white text-[#28A263] hover:bg-[#F8F9FA] rounded-xl border border-[#28A263]/20 font-semibold transition-all h-11"
                  onClick={() => navigate(isAuthenticated ? "/app/propostas" : "/signup")}
                >
                  {isAuthenticated ? "Acessar" : "Criar Conta"}
                </Button>
              </div>

              {/* PRO Tools */}
              <div className="group relative bg-gradient-to-br from-[#28A263]/8 to-white border border-[#28A263]/25 rounded-2xl p-8 hover:border-[#28A263]/40 hover:shadow-lg transition-all duration-300">
                <div className="absolute -top-3 -right-3 bg-[#28A263] text-white text-xs font-bold px-3 py-1 rounded-full">Premium</div>
                <div className="w-14 h-14 bg-[#28A263]/15 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/20 transition-colors">
                  <Crown className="w-7 h-7 text-[#28A263]" />
                </div>
                <span className="inline-block px-2.5 py-1 bg-[#28A263]/15 text-[#28A263] text-xs font-bold rounded-full border border-[#28A263]/25 mb-4 uppercase tracking-wide">
                  PRO
                </span>
                <h3 className="text-xl font-bold text-[#001529] mb-2">Simuladores Avançados</h3>
                <p className="text-sm text-[rgba(0,21,41,0.65)] mb-6">Acesso ilimitado a Preço Ideal, Lucro e projeções detalhadas.</p>
                <Button
                  className="w-full bg-[#28A263] hover:bg-[#1F8C50] text-white rounded-xl font-semibold transition-all h-11 shadow-md hover:shadow-lg"
                  onClick={() => navigate("/pricing")}
                >
                  Ver Planos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-center pt-8">
              <Button
                size="lg"
                className="bg-white text-[#28A263] hover:bg-[#F8F9FA] px-8 h-12 rounded-xl border border-[#28A263]/20 font-semibold transition-all shadow-sm hover:shadow-md"
                onClick={() => navigate(isAuthenticated ? "/app" : "/signup")}
              >
                {isAuthenticated ? "Ir para o Dashboard" : "Criar Conta Grátis"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Gestão Financeira Completa - Premium Features Section */}
        <section className="py-24 bg-[#F8F9FA] relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#28A263] rounded-full opacity-3 blur-[120px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex px-3 py-1.5 bg-white rounded-full mb-6 border border-[rgba(0,0,0,0.08)]">
                <span className="text-xs text-[#001529] font-semibold uppercase tracking-wider">
                  Gestão Completa
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#001529] mb-6 leading-tight">
                Organize suas <span className="text-[#28A263]">finanças com precisão</span>
              </h2>
              <p className="text-lg sm:text-xl text-[rgba(0,21,41,0.65)] max-w-2xl mx-auto">
                Controle completo sobre contas, clientes, orçamentos e metas em um só lugar. Tudo integrado e sincronizado.
              </p>
            </div>

            {/* Feature Cards Grid - 2x2 */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Contas a Receber */}
              <div className="group bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl p-8 hover:border-[#28A263]/20 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#28A263]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/15 transition-colors">
                  <TrendingUp className="w-7 h-7 text-[#28A263]" />
                </div>
                <h3 className="text-xl font-bold text-[#001529] mb-3">Contas a Receber</h3>
                <p className="text-sm text-[rgba(0,21,41,0.65)] mb-6 leading-relaxed">
                  Rastreie receitas pendentes, vencimentos próximos e configure recorrências automáticas. Nunca perca uma cobrança.
                </p>
                <ul className="space-y-3">
                  {["Alertas inteligentes de vencimento", "Recorrências automáticas", "Categorização inteligente"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[rgba(0,21,41,0.65)]">
                      <Check className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clientes e Fornecedores */}
              <div className="group bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl p-8 hover:border-[#28A263]/20 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#28A263]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/15 transition-colors">
                  <Users className="w-7 h-7 text-[#28A263]" />
                </div>
                <h3 className="text-xl font-bold text-[#001529] mb-3">Clientes & Fornecedores</h3>
                <p className="text-sm text-[rgba(0,21,41,0.65)] mb-6 leading-relaxed">
                  Centralize todos os contatos com dados, documentos e histórico. Organize com etiquetas e notas personalizadas.
                </p>
                <ul className="space-y-3">
                  {["CPF/CNPJ centralizado", "Classificação por tipo", "Busca e filtros avançados"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[rgba(0,21,41,0.65)]">
                      <Check className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Orçamentos */}
              <div className="group bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl p-8 hover:border-[#28A263]/20 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#28A263]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/15 transition-colors">
                  <PieChart className="w-7 h-7 text-[#28A263]" />
                </div>
                <h3 className="text-xl font-bold text-[#001529] mb-3">Orçamentos Inteligentes</h3>
                <p className="text-sm text-[rgba(0,21,41,0.65)] mb-6 leading-relaxed">
                  Planeje gastos mensais por categoria e acompanhe em tempo real. Receba alertas quando aproximar dos limites.
                </p>
                <ul className="space-y-3">
                  {["Comparativo planejado vs realizado", "Alertas de limite de gastos", "Histórico mensal detalhado"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[rgba(0,21,41,0.65)]">
                      <Check className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metas de Receita */}
              <div className="group bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl p-8 hover:border-[#28A263]/20 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#28A263]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/15 transition-colors">
                  <Target className="w-7 h-7 text-[#28A263]" />
                </div>
                <h3 className="text-xl font-bold text-[#001529] mb-3">Metas de Receita</h3>
                <p className="text-sm text-[rgba(0,21,41,0.65)] mb-6 leading-relaxed">
                  Defina metas ambiciosas e acompanhe o progresso com gráficos visuais. Histórico de 6 meses para análise.
                </p>
                <ul className="space-y-3">
                  {["Progresso visual em tempo real", "Histórico de 6 meses", "Metas por categoria customizável"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[rgba(0,21,41,0.65)]">
                      <Check className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center pt-8">
              <Button
                size="lg"
                className="bg-[#28A263] hover:bg-[#1F8C50] text-white px-8 h-12 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                onClick={() => navigate(isAuthenticated ? "/app" : "/signup")}
              >
                {isAuthenticated ? "Acessar Agora" : "Começar Grátis"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        <BenefitsSection />
        <TestimonialsSection />
        <CTASection onScrollToSimulator={scrollToSimulator} />
      </main>

      <Footer />
    </div>
  );
}
