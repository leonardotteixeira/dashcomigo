import { ArrowRight, Star } from "lucide-react";
import { Button } from "./ui/button";

interface HeroSectionProps {
  onScrollToSimulator: () => void;
}

export function HeroSection({ onScrollToSimulator }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-black pt-24 pb-32 min-h-[90vh] flex items-center">
      {/* Glow Effects */}
      <div className="absolute top-[200px] right-[-100px] w-[600px] h-[600px] bg-[#C0F497] rounded-full opacity-10 blur-[150px]" />
      <div className="absolute top-[300px] right-[50px] w-[400px] h-[400px] bg-[#2DDB81] rounded-full opacity-15 blur-[100px]" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#2DDB81] rounded-full opacity-5 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            {/* Star Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#F9D006] text-[#F9D006]" />
                ))}
              </div>
              <span className="text-[#808080] text-sm">
                Baseado em <span className="text-[#CCCCCC]">10.000+</span> avaliações
              </span>
            </div>

            <h1 className="text-5xl lg:text-[72px] font-bold text-[#F7F7F7] leading-[1em]">
              Controle total do seu{" "}
              <span className="text-[#2DDB81]">negócio</span>
            </h1>

            <p className="text-lg text-[#F7F7F7] leading-relaxed max-w-[510px] font-medium">
              Hub do Empreendedor é a plataforma completa para empreendedores que
              querem controlar finanças, simular impostos e crescer com inteligência.
            </p>

            <div className="flex items-center gap-4">
              <div className="text-[#28A263] text-sm font-medium leading-tight">
                Comece a controlar seu<br />negócio de forma inteligente
              </div>
              <Button
                size="lg"
                className="bg-[#28A263] hover:bg-[#2DDB81] text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
                onClick={onScrollToSimulator}
              >
                Começar Grátis
              </Button>
            </div>
          </div>

          {/* Visual Element - Dashboard Preview */}
          <div className="relative hidden lg:block">
            {/* Card principal */}
            <div className="relative bg-[#1B1B1B] rounded-3xl p-8 shadow-2xl border border-white/5">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#A1A1A1]">Seu faturamento</span>
                  <span className="text-2xl font-bold text-white">R$ 8.500</span>
                </div>

                <div className="h-2 bg-[#22242F] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#28A263] to-[#2DDB81] rounded-full" style={{ width: '65%' }} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#22242F] rounded-2xl p-4 border border-white/5">
                    <div className="text-xs text-red-400 font-medium mb-1">MEI</div>
                    <div className="text-2xl font-bold text-red-400">R$ 810</div>
                    <div className="text-xs text-[#9C9EAB] mt-1">impostos/mês</div>
                  </div>

                  <div className="bg-[#22242F] rounded-2xl p-4 border border-[#28A263]/30 relative">
                    <div className="absolute -top-2 -right-2 bg-[#28A263] text-white text-xs px-2 py-1 rounded-full font-medium">
                      Melhor
                    </div>
                    <div className="text-xs text-[#2DDB81] font-medium mb-1">ME</div>
                    <div className="text-2xl font-bold text-[#2DDB81]">R$ 520</div>
                    <div className="text-xs text-[#9C9EAB] mt-1">impostos/mês</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#28A263]/20 to-[#2DDB81]/10 rounded-2xl p-4 border border-[#28A263]/20">
                  <div className="text-sm font-medium text-[#C0F497]">
                    Economia anual projetada
                  </div>
                  <div className="text-3xl font-bold text-[#2DDB81] mt-2">
                    R$ 3.480
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-[#22242F] rounded-2xl shadow-lg p-4 border border-white/5 transform rotate-3">
              <div className="text-xs text-[#9C9EAB]">Tempo até o limite</div>
              <div className="text-xl font-bold text-white">8 meses</div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-[#28A263] rounded-2xl shadow-lg p-4 text-white transform -rotate-3">
              <div className="text-xs opacity-90">Crescimento</div>
              <div className="text-xl font-bold">+25%</div>
            </div>

            {/* Green circle decoration */}
            <div className="absolute -top-8 right-20 w-[180px] h-[180px] bg-[#2DDB81] rounded-full opacity-80 -z-10 blur-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
