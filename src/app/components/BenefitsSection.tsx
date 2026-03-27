import { TrendingDown, Shield, BarChart3, Clock } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: TrendingDown,
      title: "Economia real de impostos",
      description: "Compare cenários reais e descubra quanto você pode economizar ao escolher o regime tributário correto.",
    },
    {
      icon: BarChart3,
      title: "Planejamento financeiro",
      description: "Visualize projeções de crescimento e entenda o impacto dos impostos no seu lucro líquido.",
    },
    {
      icon: Shield,
      title: "Decisão segura",
      description: "Tome decisões embasadas em dados e evite surpresas com a Receita Federal.",
    },
    {
      icon: Clock,
      title: "Resultado instantâneo",
      description: "Simule quantas vezes quiser, gratuitamente, com respostas imediatas.",
    }
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2DDB81] rounded-full opacity-5 blur-[150px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#F4F4F6] mb-4">
            Por que usar nosso{" "}
            <span className="text-[#2DDB81]">simulador</span>?
          </h2>
          <p className="text-lg text-[#C8C9D0] max-w-3xl mx-auto">
            Ferramentas profissionais para ajudar você a tomar a melhor decisão para o seu negócio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="p-6 bg-[#111218] rounded-3xl border border-white/5 hover:border-[#28A263]/30 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#22242F] flex items-center justify-center mb-5 group-hover:bg-[#28A263]/20 transition-colors">
                  <Icon className="w-7 h-7 text-[#2DDB81]" />
                </div>
                <h3 className="text-lg font-bold text-[#F4F4F6] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-[#9C9EAB] leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-[#111218] rounded-[32px] p-12 border border-white/5 relative overflow-hidden">
          {/* Glow inside stats */}
          <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-[#2DDB81] rounded-full opacity-10 blur-[100px]" />

          <div className="grid md:grid-cols-3 gap-8 text-center relative z-10">
            <div>
              <div className="text-5xl font-bold text-[#2DDB81] mb-2">98%</div>
              <div className="text-[#9C9EAB]">Taxa de satisfação</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#2DDB81] mb-2">5.000+</div>
              <div className="text-[#9C9EAB]">Simulações realizadas</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#2DDB81] mb-2">R$ 2,3M</div>
              <div className="text-[#9C9EAB]">Em economia identificada</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
