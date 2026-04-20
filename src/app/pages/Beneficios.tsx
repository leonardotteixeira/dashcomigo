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
      "Chega de planilhas complicadas e anotações no caderno. Com o DashComigo você registra uma transação em menos de 30 segundos e tem tudo organizado automaticamente.",
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
    <div className="min-h-screen" style={{ background: "#F4EFE6" }}>
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-20" style={{ background: "#0E3B2E" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(127,209,159,0.2)", color: "#7FD19F" }}>
            Por que escolher o DashComigo?
          </span>
          <h1 className="font-extrabold text-5xl mb-6 leading-tight" style={{ color: "#F4EFE6" }}>
            Gestão financeira feita para o MEI brasileiro
          </h1>
          <p className="text-xl leading-relaxed font-light max-w-2xl mx-auto"
            style={{ color: "rgba(244,239,230,0.75)" }}>
            Não é mais um software genérico de contabilidade. O DashComigo resolve os problemas reais de quem empreende no Brasil como MEI.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24" id="beneficios" style={{ background: "#F4EFE6" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4" style={{ color: "#0E3B2E" }}>O que você ganha</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(14,59,46,0.6)" }}>
              Benefícios concretos que impactam diretamente o seu dia a dia e o crescimento do seu negócio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="rounded-2xl p-7 transition-shadow hover:shadow-md"
                  style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.1)" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: "rgba(14,59,46,0.08)" }}>
                    <Icon className="w-6 h-6" style={{ color: "#0E3B2E" }} />
                  </div>
                  <h3 className="font-bold text-xl mb-3" style={{ color: "#0E3B2E" }}>{b.title}</h3>
                  <p className="leading-relaxed mb-4" style={{ color: "rgba(14,59,46,0.6)" }}>{b.description}</p>
                  <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(127,209,159,0.2)", color: "#1F5A3A" }}>
                    {b.highlight}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24" style={{ background: "#EBE4D6" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-bold text-4xl mb-4" style={{ color: "#0E3B2E" }}>DashComigo vs alternativas</h2>
            <p className="text-lg" style={{ color: "rgba(14,59,46,0.6)" }}>Veja por que o DashComigo é a melhor escolha para o MEI</p>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(20,18,15,0.13)" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "#0E3B2E" }}>
                  <th className="text-left p-5 font-semibold text-base" style={{ color: "#F4EFE6" }}>Funcionalidade</th>
                  <th className="text-center p-5 font-bold text-base" style={{ color: "#7FD19F" }}>DashComigo</th>
                  <th className="text-center p-5 font-semibold text-base" style={{ color: "rgba(244,239,230,0.7)" }}>Planilha</th>
                  <th className="text-center p-5 font-semibold text-base" style={{ color: "rgba(244,239,230,0.7)" }}>Outros ERPs</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 0 ? "#F4EFE6" : "#EBE4D6" }}>
                    <td className="p-4 font-medium" style={{ color: "#0E3B2E" }}>{row.feature}</td>
                    <td className="p-4 text-center">
                      {row.finmei ? (
                        <CheckCircle className="w-5 h-5 mx-auto" style={{ color: "#7FD19F" }} />
                      ) : (
                        <span className="text-xl" style={{ color: "rgba(14,59,46,0.3)" }}>—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.planilha ? (
                        <CheckCircle className="w-5 h-5 mx-auto" style={{ color: "#7FD19F" }} />
                      ) : (
                        <span className="text-xl" style={{ color: "rgba(14,59,46,0.3)" }}>—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.outros ? (
                        <CheckCircle className="w-5 h-5 mx-auto" style={{ color: "#7FD19F" }} />
                      ) : (
                        <span className="text-xl" style={{ color: "rgba(14,59,46,0.3)" }}>—</span>
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
      <section className="py-20" style={{ background: "#F4EFE6" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-2xl font-medium italic leading-relaxed mb-6" style={{ color: "#0E3B2E" }}>
            "Antes eu gastava horas toda semana tentando organizar as finanças no Excel. Com o DashComigo, levo 10 minutos e tenho tudo que preciso para tomar decisões."
          </p>
          <p className="font-semibold" style={{ color: "rgba(14,59,46,0.6)" }}>— Ana Silva, MEI de Serviços Digitais, São Paulo</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "#0E3B2E" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-extrabold text-4xl mb-6" style={{ color: "#F4EFE6" }}>
            Experimente sem compromisso
          </h2>
          <p className="text-xl mb-10 font-light" style={{ color: "rgba(244,239,230,0.75)" }}>
            Cadastro gratuito, sem cartão de crédito. Comece a usar agora.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-lg font-bold transition-all shadow-2xl text-lg"
              style={{ background: "#7FD19F", color: "#0E3B2E" }}
            >
              Criar conta grátis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/planos"
              className="inline-flex items-center gap-2 px-8 py-5 rounded-lg font-semibold transition-all text-lg"
              style={{ border: "1px solid rgba(244,239,230,0.3)", color: "#F4EFE6" }}
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
