import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { BenefitsSection } from "../components/BenefitsSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { CTASection } from "../components/CTASection";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { ArrowRight, Check, Crown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const scrollToSimulator = () => {
    navigate("/app/mei-me");
  };

  return (
    <div className="min-h-screen bg-black">
      <Header onScrollToSimulator={scrollToSimulator} />

      <main className="pt-16">
        <HeroSection onScrollToSimulator={scrollToSimulator} />

        {/* Quick Access to Platform */}
        <section className="py-20 bg-black relative overflow-hidden">
          {/* Glow effects */}
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#C0F497] rounded-full opacity-5 blur-[150px]" />
          <div className="absolute top-[0px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#2DDB81] rounded-full opacity-8 blur-[100px]" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex px-4 py-2 bg-[#22242F] rounded-full mb-4">
                <span className="text-xs text-[#DEDFE3] font-medium uppercase tracking-wider">
                  Ferramentas Completas
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#F4F4F6] mb-4">
                Escolha entre <span className="text-white">10+</span> ferramentas
              </h2>
              <p className="text-lg text-[#C8C9D0]">
                {isAuthenticated
                  ? "Acesse o dashboard para gerenciar suas finanças"
                  : "Cadastre-se grátis e comece a controlar seu fluxo de caixa agora"}
              </p>
            </div>

            {/* Highlight Fluxo de Caixa */}
            <div className="mb-8 p-8 bg-[#111218] rounded-[32px] border border-white/5">
              <div className="flex items-start gap-6 flex-wrap">
                <div className="w-16 h-16 bg-[#28A263] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-[#F4F4F6]">Fluxo de Caixa Inteligente</h3>
                    <span className="px-3 py-1 bg-[#2DDB81]/20 text-[#2DDB81] text-xs font-semibold rounded-full border border-[#2DDB81]/30">
                      NOVO!
                    </span>
                  </div>
                  <p className="text-[#C8C9D0] mb-4">
                    Registre entradas e saídas, veja insights automáticos e tome decisões baseadas em dados reais do seu negócio.
                    <strong className="text-[#F4F4F6]"> Simples como um caderno, inteligente como um contador.</strong>
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    {["30 lançamentos/mês grátis", "Alertas automáticos", "Categorias pré-definidas", "Sem planilhas complicadas"].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-[#C8C9D0]">
                        <Check className="w-4 h-4 text-[#2DDB81]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="lg"
                    className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl"
                    onClick={() => navigate(isAuthenticated ? "/app" : "/signup")}
                  >
                    {isAuthenticated ? "Acessar Fluxo de Caixa" : "Começar Grátis"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Cards - horizontal scroll on mobile */}
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide mb-8">
              {/* Free Tool */}
              <div className="min-w-[300px] flex-1 h-[380px] bg-[#111218] rounded-3xl overflow-hidden relative group snap-start">
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute w-[136px] h-[136px] left-1/2 -translate-x-1/2 top-[80px] bg-[#C0F497] rounded-full opacity-80 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="inline-block px-3 py-1 bg-[#2DDB81]/20 text-[#2DDB81] text-xs font-semibold rounded-full border border-[#2DDB81]/30 mb-3">
                    GRÁTIS
                  </span>
                  <h3 className="text-lg font-medium text-[#C8C9D0] mb-1">Simulador MEI → ME</h3>
                  <p className="text-sm text-[#868898] mb-4">Compare impostos sem cadastro</p>
                  <Button
                    className="w-full bg-[#22242F] hover:bg-[#28A263] text-white rounded-xl border border-white/5 transition-colors"
                    onClick={() => navigate("/app/mei-me")}
                  >
                    Simular Grátis
                  </Button>
                </div>
              </div>

              {/* Free with signup */}
              <div className="min-w-[300px] flex-1 h-[380px] bg-[#111218] rounded-3xl overflow-hidden relative group snap-start">
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute w-[200px] h-[200px] right-[-50px] top-[-50px] bg-[#2DDB81] rounded-[999px_999px_999px_128px] opacity-60 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="inline-block px-3 py-1 bg-[#28A263]/20 text-[#28A263] text-xs font-semibold rounded-full border border-[#28A263]/30 mb-3">
                    GRÁTIS
                  </span>
                  <h3 className="text-lg font-medium text-[#C8C9D0] mb-1">Gerador de Propostas</h3>
                  <p className="text-sm text-[#868898] mb-4">2 propostas por dia gratuitamente</p>
                  <Button
                    className="w-full bg-[#22242F] hover:bg-[#28A263] text-white rounded-xl border border-white/5 transition-colors"
                    onClick={() => navigate(isAuthenticated ? "/app/propostas" : "/signup")}
                  >
                    {isAuthenticated ? "Acessar" : "Criar Conta"}
                  </Button>
                </div>
              </div>

              {/* PRO Tools */}
              <div className="min-w-[300px] flex-1 h-[380px] bg-[#111218] rounded-3xl overflow-hidden relative group snap-start">
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute w-[232px] h-[128px] right-[-20px] top-[60px] rotate-[135deg] bg-[#2DDB81] rounded-full opacity-70 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#C0F497]/20 text-[#C0F497] text-xs font-semibold rounded-full border border-[#C0F497]/30 mb-3">
                    <Crown className="w-3 h-3" />
                    PRO
                  </span>
                  <h3 className="text-lg font-medium text-[#C8C9D0] mb-1">Simuladores PRO</h3>
                  <p className="text-sm text-[#868898] mb-4">Preço Ideal + Lucro ilimitados</p>
                  <Button
                    className="w-full bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl transition-colors"
                    onClick={() => navigate("/pricing")}
                  >
                    Ver Planos
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-[#22242F] hover:bg-[#28A263] text-white px-8 py-6 text-lg rounded-xl border border-white/5 transition-colors"
                onClick={() => navigate(isAuthenticated ? "/app" : "/signup")}
              >
                {isAuthenticated ? "Ir para o Dashboard" : "Criar Conta Grátis"}
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
