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

          {/* Right - Dashboard Preview (dark mockup) */}
          <div className="relative hidden lg:block">
            <div className="bg-[#141414] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
              {/* Sidebar mock */}
              <div className="flex">
                <div className="w-[200px] bg-[#1B1B1B] p-6 min-h-[400px]">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-7 h-7 bg-[#28A263] rounded-lg flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm font-bold">Hub</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-[#28A263]/10 rounded-full px-4 py-2">
                      <div className="w-2 h-2 bg-[#28A263] rounded-full" />
                      <span className="text-[#28A263] text-xs font-semibold">Dashboard</span>
                    </div>
                    {["Simuladores", "Propostas", "Fluxo de Caixa", "Relatórios", "Configurações"].map((item) => (
                      <div key={item} className="flex items-center gap-3 px-4 py-2">
                        <div className="w-2 h-2 bg-[#A1A1A1] rounded-full opacity-30" />
                        <span className="text-[#A1A1A1] text-xs">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Main content mock */}
                <div className="flex-1 p-6">
                  <div className="text-white text-sm font-semibold mb-1">Bem-vindo de volta!</div>
                  <div className="text-[#A1A1A1] text-xs mb-6">Seu painel financeiro</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1B1B1B] rounded-lg p-4">
                      <div className="text-[#A1A1A1] text-xs mb-2">Receitas</div>
                      <div className="text-[#2DDB81] text-lg font-bold">R$ 12.450</div>
                    </div>
                    <div className="bg-[#1D1D1D] rounded-lg p-4">
                      <div className="text-[#A1A1A1] text-xs mb-2">Despesas</div>
                      <div className="text-red-400 text-lg font-bold">R$ 4.280</div>
                    </div>
                  </div>
                  {/* Chart mock */}
                  <div className="mt-4 bg-[#1D1D1D] rounded-lg p-4 h-[140px] flex items-end gap-2">
                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[#28A263] rounded-t-sm opacity-70"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
