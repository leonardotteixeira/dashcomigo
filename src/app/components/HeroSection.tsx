import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { LogoMark } from "./ui/Logo";

interface HeroSectionProps {
  onScrollToSimulator: () => void;
}

export function HeroSection({ onScrollToSimulator }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#F4EFE6] pt-24 pb-32 min-h-[90vh] flex items-center">
      {/* Glow Effects */}
      <div className="absolute top-[200px] right-[-100px] w-[600px] h-[600px] bg-[#7FD19F] rounded-full opacity-5 blur-[150px]" />
      <div className="absolute top-[300px] right-[50px] w-[400px] h-[400px] bg-[#7FD19F] rounded-full opacity-8 blur-[100px]" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#7FD19F] opacity-3 blur-[120px]" />

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
              <span className="text-[rgba(20,18,15,0.6)] text-sm">
                Baseado em <span className="text-[#0E3B2E] font-medium">10.000+</span> avaliações
              </span>
            </div>

            <h1 className="text-5xl lg:text-[72px] font-bold text-[#0E3B2E] leading-[1em]">
              Controle total do seu{" "}
              <span className="text-[#1F5A3A]">negócio</span>
            </h1>

            <p className="text-lg text-[rgba(20,18,15,0.65)] leading-relaxed max-w-[510px] font-medium">
              DashComigo é a plataforma completa para empreendedores que
              querem controlar finanças, simular impostos e crescer com inteligência.
            </p>

            <div className="flex items-center gap-4">
              <div className="text-[#1F5A3A] text-sm font-medium leading-tight">
                Comece a controlar seu<br />negócio de forma inteligente
              </div>
              <Button
                size="lg"
                className="bg-[#0E3B2E] hover:bg-[#082219] text-[#F4EFE6] px-8 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
                onClick={onScrollToSimulator}
              >
                Começar Grátis
              </Button>
            </div>
          </div>

          {/* Visual Element - Dashboard Preview */}
          <div className="relative hidden lg:block">
            <div className="bg-[#F4EFE6] rounded-2xl overflow-hidden shadow-lg border border-[rgba(20,18,15,0.13)] scale-105">
              {/* Sidebar mock */}
              <div className="flex">
                <div className="w-[220px] bg-[#EBE4D6] p-8 min-h-[520px] border-r border-[rgba(20,18,15,0.13)]">
                  <div className="flex items-center gap-2 mb-10">
                    <LogoMark size={28} />
                    <span className="text-[#0E3B2E] text-sm font-bold">DashComigo</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-[#0E3B2E]/10 rounded-full px-4 py-2">
                      <div className="w-2 h-2 bg-[#0E3B2E] rounded-full" />
                      <span className="text-[#0E3B2E] text-xs font-semibold">Dashboard</span>
                    </div>
                    {["Simuladores", "Propostas", "Fluxo de Caixa", "Relatórios", "Configurações"].map((item) => (
                      <div key={item} className="flex items-center gap-3 px-4 py-2">
                        <div className="w-2 h-2 bg-[rgba(20,18,15,0.2)] rounded-full" />
                        <span className="text-[rgba(20,18,15,0.5)] text-xs">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Main content mock */}
                <div className="flex-1 p-8">
                  <div className="text-[#0E3B2E] text-base font-semibold mb-1">Bem-vindo de volta!</div>
                  <div className="text-[rgba(20,18,15,0.5)] text-xs mb-6">Seu painel financeiro</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#EBE4D6] rounded-lg p-5 border border-[rgba(20,18,15,0.13)]">
                      <div className="text-[rgba(20,18,15,0.5)] text-xs mb-2">Receitas</div>
                      <div className="text-[#1F5A3A] text-2xl font-bold">R$ 12.450</div>
                    </div>
                    <div className="bg-[#EBE4D6] rounded-lg p-5 border border-[rgba(20,18,15,0.13)]">
                      <div className="text-[rgba(20,18,15,0.5)] text-xs mb-2">Despesas</div>
                      <div className="text-[#B04A3A] text-2xl font-bold">R$ 4.280</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-[#EBE4D6] rounded-lg p-4 border border-[rgba(20,18,15,0.13)]">
                      <div className="text-[rgba(20,18,15,0.5)] text-xs mb-1">Saldo</div>
                      <div className="text-[#0E3B2E] text-lg font-bold">R$ 8.170</div>
                    </div>
                    <div className="bg-[#EBE4D6] rounded-lg p-4 border border-[rgba(20,18,15,0.13)]">
                      <div className="text-[rgba(20,18,15,0.5)] text-xs mb-1">Margem</div>
                      <div className="text-[#1F5A3A] text-lg font-bold">65,6%</div>
                    </div>
                  </div>
                  {/* Chart mock */}
                  <div className="mt-4 bg-[#EBE4D6] rounded-lg p-4 h-[200px] flex items-end gap-2 border border-[rgba(20,18,15,0.13)]">
                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 68, 92].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[#0E3B2E] rounded-t-sm opacity-70"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Element */}
            <div className="absolute -bottom-4 -left-4 bg-[#0E3B2E] rounded-2xl shadow-lg p-4 text-[#F4EFE6] transform -rotate-3">
              <div className="text-xs opacity-90">Crescimento</div>
              <div className="text-xl font-bold">+25%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
