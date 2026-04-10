import { Link } from "react-router";
import { LandingNav } from "../components/LandingNav";
import { LandingFooter } from "../components/LandingFooter";
import {
  Clock, Shield, TrendingUp, Smartphone, Zap, HeadphonesIcon,
  CheckCircle, ArrowRight,
} from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Economize tempo",
    description:
      "Chega de planilhas complicadas e anotações no caderno. Com o FinMEI você registra uma transação em menos de 30 segundos e tem tudo organizado automaticamente.",
    highlight: "−3h por semana em burocracia",
  },
  {
    icon: TrendingUp,
    title: "Tome decisões com dados reais",
    description:
      "Visualize seu lucro real, identifique os meses mais fracos e descubra quais categorias consomem mais do seu caixa — tudo com gráficos simples e atualizados.",
    highlight: "Relatórios em tempo real",
  },
  {
    icon: Shield,
    title: "Fique em dia com o MEI",
    description:
      "Receba alertas de vencimento do DAS-MEI, controle o teto de faturamento anual e nunca seja pego de surpresa pela Receita Federal.",
    highlight: "Zero risco de desenquadramento",
  },
  {
    icon: Zap,
    title: "Tudo integrado",
    description:
      "Quando você marca uma conta como paga, ela já aparece no fluxo de caixa. Quando uma proposta é aprovada, o valor entra nas suas metas. Sem trabalho duplo.",
    highlight: "Sincronização automática",
  },
  {
    icon: Smartphone,
    title: "Acesse de qualquer lugar",
    description:
      "Plataforma 100% web, responsiva e rápida. Funciona no celular, tablet ou computador — sem precisar instalar nada.",
    highlight: "Funciona em qualquer dispositivo",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte humanizado",
    description:
      "Nossa equipe entende a rotina do MEI e está pronta para ajudar. Suporte por WhatsApp e e-mail com resposta em até 24 horas.",
    highlight: "Atendimento em português",
  },
];

const comparisons = [
  { feature: "Fluxo de caixa", finmei: true, planilha: false, outros: true },
  { feature: "Contas a pagar/receber", finmei: true, planilha: false, outros: true },
  { feature: "Geração de propostas", finmei: true, planilha: false, outros: false },
  { feature: "Alertas de DAS-MEI", finmei: true, planilha: false, outros: false },
  { feature: "Relatórios automáticos", finmei: true, planilha: false, outros: true },
  { feature: "Funciona no celular", finmei: true, planilha: false, outros: true },
  { feature: "Pensado para MEI", finmei: true, planilha: false, outros: false },
  { feature: "Plano gratuito real", finmei: true, planilha: true, outros: false },
];

export function Beneficios() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#001529] via-[#002140] to-[#003a6d]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block bg-white/10 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Por que escolher o FinMEI?
          </span>
          <h1 className="font-extrabold text-white text-5xl mb-6 leading-tight">
            Gestão financeira feita para o MEI brasileiro
          </h1>
          <p className="text-xl text-white/80 leading-relaxed font-light max-w-2xl mx-auto">
            Não é mais um software genérico de contabilidade. O FinMEI resolve os problemas reais de quem empreende no Brasil como MEI.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white" id="beneficios">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-bold text-[#001529] text-4xl mb-4">O que você ganha</h2>
            <p className="text-lg text-[#001529]/60 max-w-2xl mx-auto">
              Benefícios concretos que impactam diretamente o seu dia a dia e o crescimento do seu negócio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="bg-white border border-[#E5E7EB] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#003a6d]/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#003a6d]" />
                  </div>
                  <h3 className="font-bold text-[#001529] text-xl mb-3">{b.title}</h3>
                  <p className="text-[#001529]/60 leading-relaxed mb-4">{b.description}</p>
                  <span className="inline-block bg-[#003a6d]/8 text-[#003a6d] text-xs font-semibold px-3 py-1.5 rounded-full">
                    {b.highlight}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 bg-[#F5F7FA]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-bold text-[#001529] text-4xl mb-4">FinMEI vs alternativas</h2>
            <p className="text-lg text-[#001529]/60">Veja por que o FinMEI é a melhor escolha para o MEI</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#001529] text-white">
                  <th className="text-left p-5 font-semibold text-base">Funcionalidade</th>
                  <th className="text-center p-5 font-bold text-base text-[#4ECDC4]">FinMEI</th>
                  <th className="text-center p-5 font-semibold text-base text-white/70">Planilha</th>
                  <th className="text-center p-5 font-semibold text-base text-white/70">Outros ERPs</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-[#F5F7FA]"}>
                    <td className="p-4 text-[#001529] font-medium">{row.feature}</td>
                    <td className="p-4 text-center">
                      {row.finmei ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-[#001529]/30 text-xl">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.planilha ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-[#001529]/30 text-xl">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.outros ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-[#001529]/30 text-xl">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-2xl text-[#001529] font-medium italic leading-relaxed mb-6">
            "Antes eu gastava horas toda semana tentando organizar as finanças no Excel. Com o FinMEI, levo 10 minutos e tenho tudo que preciso para tomar decisões."
          </p>
          <p className="text-[#001529]/60 font-semibold">— Ana Silva, MEI de Serviços Digitais, São Paulo</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#001529] to-[#003a6d]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-extrabold text-white text-4xl mb-6">
            Experimente sem compromisso
          </h2>
          <p className="text-xl text-white/80 mb-10 font-light">
            Cadastro gratuito, sem cartão de crédito. Comece a usar agora.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-[#001529] px-10 py-5 rounded-lg font-bold hover:bg-white/90 transition-all shadow-2xl text-lg"
            >
              Criar conta grátis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/planos"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-5 rounded-lg font-semibold hover:bg-white/10 transition-all text-lg"
            >
              Ver planos
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
