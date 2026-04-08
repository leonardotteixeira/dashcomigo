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

      <main className="pt-16 space-y-6">
        <HeroSection onScrollToSimulator={scrollToSimulator} />

        {/* Quick Access to Platform - Premium Section */}
        <section className="py-32 bg-white relative overflow-hidden">
          {/* Subtle glow effects */}
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#28A263] rounded-full opacity-3 blur-[120px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex px-4 py-2 bg-[#28A263]/8 rounded-full mb-6 border border-[#28A263]/15 backdrop-blur-sm">
                <span className="text-xs text-[#28A263] font-bold uppercase tracking-wider">
                  Ferramentas Poderosas
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#001529] mb-6 leading-tight">
                Escolha entre <span className="text-[#28A263]">10+ ferramentas</span> essenciais
              </h2>
              <p className="text-lg sm:text-xl text-[rgba(0,21,41,0.65)] max-w-2xl mx-auto leading-relaxed">
                {isAuthenticated
                  ? "Acesse todas as ferramentas do seu dashboard para gerenciar finanças com inteligência"
                  : "Comece grátis e tenha acesso imediato a ferramentas profissionais de gestão financeira"}
              </p>
            </div>

            {/* Highlight Fluxo de Caixa - Premium Card */}
            <div className="mb-20 p-10 sm:p-14 bg-gradient-to-br from-[#28A263]/5 to-white rounded-3xl border border-[#28A263]/15 shadow-lg hover:shadow-xl hover:border-[#28A263]/30 transition-all duration-300">
              <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-14">
                <div className="w-24 h-24 bg-[#28A263] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-5">
                    <h3 className="text-3xl sm:text-4xl font-bold text-[#001529]">Fluxo de Caixa Inteligente</h3>
                    <span className="px-3 py-1.5 bg-[#10b981]/15 text-[#10b981] text-xs font-bold rounded-full border border-[#10b981]/25 uppercase tracking-wide">
                      Novo
                    </span>
                  </div>
                  <p className="text-lg text-[rgba(0,21,41,0.65)] mb-8 leading-relaxed">
                    Registre entradas e saídas com facilidade, receba insights automáticos e tome decisões baseadas em dados reais do seu negócio.
                  </p>
                  <p className="text-lg font-semibold text-[#001529] mb-8">Simples como um caderno, inteligente como um contador.</p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-10">
                    {["30 lançamentos/mês grátis", "Alertas automáticos", "Categorias inteligentes", "Sem complexidade"].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-base text-[rgba(0,21,41,0.65)]">
                        <Check className="w-5 h-5 text-[#28A263] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="lg"
                    className="bg-[#28A263] hover:bg-[#20915a] text-white rounded-xl h-13 px-8 font-semibold shadow-lg hover:shadow-xl transition-all"
                    onClick={() => navigate(isAuthenticated ? "/app" : "/signup")}
                  >
                    {isAuthenticated ? "Acessar Fluxo de Caixa" : "Começar Grátis"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Cards Grid - Premium Layout */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {/* Free Tool 1 */}
              <div className="group bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#28A263]/25 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#28A263]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/15 transition-colors">
                  <svg className="w-7 h-7 text-[#28A263]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="inline-block px-3 py-1.5 bg-[#28A263]/10 text-[#28A263] text-xs font-bold rounded-full border border-[#28A263]/15 mb-5 uppercase tracking-wide">
                  Grátis
                </span>
                <h3 className="text-xl font-bold text-[#001529] mb-3">Simulador MEI → ME</h3>
                <p className="text-base text-[rgba(0,21,41,0.65)] mb-7">Compare impostos sem precisar se cadastrar. Descubra quando migrar.</p>
                <Button
                  className="w-full bg-white text-[#28A263] hover:bg-[#F8F9FA] rounded-xl border border-[#28A263]/20 font-semibold transition-all h-12"
                  onClick={() => navigate("/app/mei-me")}
                >
                  Simular Grátis
                </Button>
              </div>

              {/* Free with signup */}
              <div className="group bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#28A263]/25 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#28A263]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/15 transition-colors">
                  <svg className="w-7 h-7 text-[#28A263]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="inline-block px-3 py-1.5 bg-[#28A263]/10 text-[#28A263] text-xs font-bold rounded-full border border-[#28A263]/15 mb-5 uppercase tracking-wide">
                  Grátis
                </span>
                <h3 className="text-xl font-bold text-[#001529] mb-3">Gerador de Propostas</h3>
                <p className="text-base text-[rgba(0,21,41,0.65)] mb-7">Crie 2 propostas profissionais por dia. Sem templates limitados.</p>
                <Button
                  className="w-full bg-white text-[#28A263] hover:bg-[#F8F9FA] rounded-xl border border-[#28A263]/20 font-semibold transition-all h-12"
                  onClick={() => navigate(isAuthenticated ? "/app/propostas" : "/signup")}
                >
                  {isAuthenticated ? "Acessar" : "Criar Conta"}
                </Button>
              </div>

              {/* PRO Tools */}
              <div className="group relative bg-gradient-to-br from-[#28A263]/8 to-white border-2 border-[#28A263]/25 rounded-2xl p-8 hover:border-[#28A263]/40 hover:shadow-xl transition-all duration-300 shadow-lg">
                <div className="absolute -top-4 -right-4 bg-[#28A263] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">Premium</div>
                <div className="w-14 h-14 bg-[#28A263]/15 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/20 transition-colors">
                  <Crown className="w-7 h-7 text-[#28A263]" />
                </div>
                <span className="inline-block px-3 py-1.5 bg-[#28A263]/15 text-[#28A263] text-xs font-bold rounded-full border border-[#28A263]/25 mb-5 uppercase tracking-wide">
                  PRO
                </span>
                <h3 className="text-xl font-bold text-[#001529] mb-3">Simuladores Avançados</h3>
                <p className="text-base text-[rgba(0,21,41,0.65)] mb-8">Acesso ilimitado a Preço Ideal, Lucro e projeções detalhadas.</p>
                <Button
                  className="w-full bg-[#28A263] hover:bg-[#20915a] text-white rounded-xl font-semibold transition-all h-12 shadow-lg hover:shadow-xl"
                  onClick={() => navigate("/pricing")}
                >
                  Ver Planos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-center pt-12">
              <Button
                size="lg"
                className="bg-white text-[#28A263] hover:bg-[#F8F9FA] px-8 h-13 rounded-xl border border-[#28A263]/20 font-semibold transition-all shadow-sm hover:shadow-md"
                onClick={() => navigate(isAuthenticated ? "/app" : "/signup")}
              >
                {isAuthenticated ? "Ir para o Dashboard" : "Criar Conta Grátis"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Gestão Financeira Completa - Premium Features Section */}
        <section className="py-32 bg-[#F5F7FA] relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#28A263] rounded-full opacity-3 blur-[120px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex px-4 py-2 bg-white rounded-full mb-6 border border-[#E5E7EB] backdrop-blur-sm">
                <span className="text-xs text-[#001529] font-bold uppercase tracking-wider">
                  Gestão Completa
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#001529] mb-6 leading-tight">
                Organize suas <span className="text-[#28A263]">finanças com precisão</span>
              </h2>
              <p className="text-lg sm:text-xl text-[rgba(0,21,41,0.65)] max-w-2xl mx-auto leading-relaxed">
                Controle completo sobre contas, clientes, orçamentos e metas em um só lugar. Tudo integrado e sincronizado.
              </p>
            </div>

            {/* Feature Cards Grid - 2x2 */}
            <div className="grid md:grid-cols-2 gap-8 mb-20">
              {/* Contas a Receber */}
              <div className="group bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#28A263]/25 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#28A263]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/15 transition-colors">
                  <TrendingUp className="w-7 h-7 text-[#28A263]" />
                </div>
                <h3 className="text-xl font-bold text-[#001529] mb-4">Contas a Receber</h3>
                <p className="text-base text-[rgba(0,21,41,0.65)] mb-8 leading-relaxed">
                  Rastreie receitas pendentes, vencimentos próximos e configure recorrências automáticas. Nunca perca uma cobrança.
                </p>
                <ul className="space-y-3">
                  {["Alertas inteligentes de vencimento", "Recorrências automáticas", "Categorização inteligente"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-base text-[rgba(0,21,41,0.65)]">
                      <Check className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clientes e Fornecedores */}
              <div className="group bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#28A263]/25 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#28A263]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/15 transition-colors">
                  <Users className="w-7 h-7 text-[#28A263]" />
                </div>
                <h3 className="text-xl font-bold text-[#001529] mb-4">Clientes & Fornecedores</h3>
                <p className="text-base text-[rgba(0,21,41,0.65)] mb-8 leading-relaxed">
                  Centralize todos os contatos com dados, documentos e histórico. Organize com etiquetas e notas personalizadas.
                </p>
                <ul className="space-y-3">
                  {["CPF/CNPJ centralizado", "Classificação por tipo", "Busca e filtros avançados"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-base text-[rgba(0,21,41,0.65)]">
                      <Check className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Orçamentos */}
              <div className="group bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#28A263]/25 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#28A263]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/15 transition-colors">
                  <PieChart className="w-7 h-7 text-[#28A263]" />
                </div>
                <h3 className="text-xl font-bold text-[#001529] mb-4">Orçamentos Inteligentes</h3>
                <p className="text-base text-[rgba(0,21,41,0.65)] mb-8 leading-relaxed">
                  Planeje gastos mensais por categoria e acompanhe em tempo real. Receba alertas quando aproximar dos limites.
                </p>
                <ul className="space-y-3">
                  {["Comparativo planejado vs realizado", "Alertas de limite de gastos", "Histórico mensal detalhado"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-base text-[rgba(0,21,41,0.65)]">
                      <Check className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metas de Receita */}
              <div className="group bg-white border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#28A263]/25 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-[#28A263]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#28A263]/15 transition-colors">
                  <Target className="w-7 h-7 text-[#28A263]" />
                </div>
                <h3 className="text-xl font-bold text-[#001529] mb-4">Metas de Receita</h3>
                <p className="text-base text-[rgba(0,21,41,0.65)] mb-8 leading-relaxed">
                  Defina metas ambiciosas e acompanhe o progresso com gráficos visuais. Histórico de 6 meses para análise.
                </p>
                <ul className="space-y-3">
                  {["Progresso visual em tempo real", "Histórico de 6 meses", "Metas por categoria customizável"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-base text-[rgba(0,21,41,0.65)]">
                      <Check className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center pt-12">
              <Button
                size="lg"
                className="bg-[#28A263] hover:bg-[#20915a] text-white px-8 h-13 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
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
