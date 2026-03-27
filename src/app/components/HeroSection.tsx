import { ArrowRight, Calculator, Star } from "lucide-react";
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
