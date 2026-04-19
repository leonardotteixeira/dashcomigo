import { Link } from "react-router";
import { LandingNav } from "../components/LandingNav";
import { LandingFooter } from "../components/LandingFooter";
import {
  TrendingUp, FileText, Receipt, CreditCard, BarChart3,
  Calculator, Package, Users, Target, Zap, ArrowRight,
} from "lucide-react";

const tools = [
  {
    icon: TrendingUp,
    title: "Fluxo de Caixa",
    description:
      "Registre entradas e saídas, visualize seu saldo em tempo real e acompanhe a saúde financeira do seu negócio mês a mês.",
    href: "/app",
    badge: null,
  },
  {
    icon: CreditCard,
    title: "Contas a Pagar",
    description:
      "Cadastre suas despesas futuras, defina datas de vencimento e receba alertas antes de atrasar qualquer pagamento.",
    href: "/app/contas-a-pagar",
    badge: null,
  },
  {
    icon: Receipt,
    title: "Contas a Receber",
    description:
      "Controle o que seus clientes devem, acompanhe recebimentos pendentes e nunca perca uma cobrança.",
    href: "/app/contas-a-receber",
    badge: null,
  },
  {
    icon: FileText,
    title: "Propostas e Contratos",
    description:
      "Crie orçamentos e contratos profissionais em segundos, envie por e-mail e acompanhe o status de cada proposta.",
    href: "/app/propostas",
    badge: "Popular",
  },
  {
    icon: BarChart3,
    title: "Relatórios Financeiros",
    description:
      "Veja gráficos de receita vs despesa, margem de lucro, categorias mais custosas e tendências do seu negócio.",
    href: "/app/relatorios",
    badge: "PRO",
  },
  {
    icon: Calculator,
    title: "Simuladores",
    description:
      "Simule o impacto de virar ME, calcule o preço ideal dos seus serviços e descubra quando seu negócio fica lucrativo.",
    href: "/app/simuladores",
    badge: null,
  },
  {
    icon: Package,
    title: "Controle de Estoque",
    description:
      "Gerencie seus produtos, acompanhe entradas e saídas e evite rupturas que prejudicam suas vendas.",
    href: "/app/estoque",
    badge: null,
  },
  {
    icon: Users,
    title: "Clientes e Fornecedores",
    description:
      "Mantenha um cadastro completo dos seus contatos comerciais para agilizar cobranças e pedidos.",
    href: "/app/clientes",
    badge: null,
  },
  {
    icon: Target,
    title: "Metas Financeiras",
    description:
      "Defina objetivos mensais ou anuais de receita, economias e lucro — e acompanhe seu progresso com visualizações claras.",
    href: "/app/metas",
    badge: "PRO",
  },
  {
    icon: Zap,
    title: "DAS-MEI Automático",
    description:
      "Gere e acompanhe o boleto do DAS-MEI direto pela plataforma, sem precisar acessar o Portal do Empreendedor toda vez.",
    href: "/app/das-mei",
    badge: null,
  },
];

export function Ferramentas() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#001529] via-[#002140] to-[#003a6d]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block bg-white/10 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Todas as ferramentas em um só lugar
          </span>
          <h1 className="font-extrabold text-white text-5xl mb-6 leading-tight">
            Tudo que o MEI precisa para crescer com controle
          </h1>
          <p className="text-xl text-white/80 leading-relaxed font-light max-w-2xl mx-auto">
            Do fluxo de caixa às propostas comerciais — o DashComigo centraliza a gestão financeira do seu negócio em uma plataforma simples e intuitiva.
          </p>
          <div className="flex justify-center gap-4 mt-10">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-[#001529] px-8 py-4 rounded-lg font-bold hover:bg-white/90 transition-all shadow-xl text-lg"
            >
              Testar grátis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-24 bg-white" id="ferramentas">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-bold text-[#001529] text-4xl mb-4">Ferramentas disponíveis</h2>
            <p className="text-lg text-[#001529]/60 max-w-2xl mx-auto">
              Cada ferramenta foi desenvolvida pensando nas necessidades reais do microempreendedor individual brasileiro.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  to={tool.href}
                  className="group bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-[#003a6d]/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#003a6d]/10 flex items-center justify-center group-hover:bg-[#003a6d]/20 transition-colors">
                      <Icon className="w-6 h-6 text-[#003a6d]" />
                    </div>
                    {tool.badge && (
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          tool.badge === "PRO"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#001529] text-lg mb-2">{tool.title}</h3>
                  <p className="text-[#001529]/60 text-sm leading-relaxed">{tool.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-[#003a6d] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Abrir ferramenta <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#001529] to-[#003a6d]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-extrabold text-white text-4xl mb-6">
            Comece a usar hoje, grátis
          </h2>
          <p className="text-xl text-white/80 mb-10 font-light">
            Acesso imediato a todas as ferramentas essenciais. Sem cartão de crédito.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-[#001529] px-10 py-5 rounded-lg font-bold hover:bg-white/90 transition-all shadow-2xl text-lg"
          >
            Criar conta gratuita
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
