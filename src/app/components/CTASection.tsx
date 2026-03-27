import { ArrowRight, Calculator } from "lucide-react";
import { Button } from "./ui/button";

interface CTASectionProps {
  onScrollToSimulator: () => void;
}

export function CTASection({ onScrollToSimulator }: CTASectionProps) {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Big green circle decoration */}
      <div className="absolute -bottom-[400px] -right-[300px] w-[1104px] h-[1104px] bg-[#2DDB81] rounded-full opacity-20" />
      <div className="absolute -bottom-[400px] -right-[300px] w-[1104px] h-[1104px] bg-[#2DDB81] rounded-full opacity-5 blur-[50px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="space-y-8">
            <div className="inline-flex px-4 py-2 bg-[#22242F] rounded-full">
              <span className="text-xs text-[#DEDFE3] font-medium uppercase tracking-wider">
                COMECE AGORA
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#F4F4F6] leading-tight">
              A melhor ferramenta para o seu negócio!
            </h2>

            <p className="text-lg text-[#9C9EAB] font-medium leading-relaxed">
              Faça sua simulação gratuita agora e descubra se vale a pena migrar do MEI para ME.
              Leva menos de 2 minutos e pode economizar milhares de reais por ano.
            </p>

            <div className="flex items-center gap-4">
              <Button
                size="lg"
                className="bg-[#28A263] hover:bg-[#2DDB81] text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
                onClick={onScrollToSimulator}
              >
                <Calculator className="mr-2 w-5 h-5" />
                Começar Grátis
              </Button>
              <div className="text-[#28A263] text-sm font-medium leading-tight">
                Comece a trabalhar de forma<br />eficiente com o Hub
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-[#9C9EAB]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#2DDB81]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% gratuito
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#2DDB81]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Sem cadastro
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#2DDB81]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Resultado instantâneo
              </div>
            </div>
          </div>

          {/* Right - MEI Simulator Preview */}
          <div className="relative hidden lg:block">
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
          </div>
        </div>
      </div>
    </section>
  );
}
