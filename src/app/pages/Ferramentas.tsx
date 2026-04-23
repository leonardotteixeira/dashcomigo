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
    badge: "Premium",
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
    badge: "Premium",
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
    <div className="min-h-screen" style={{ background: "#F4EFE6" }}>
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-20" style={{ background: "#0E3B2E" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(127,209,159,0.2)", color: "#7FD19F" }}>
            Todas as ferramentas em um só lugar
          </span>
          <h1 className="font-extrabold text-5xl mb-6 leading-tight" style={{ color: "#F4EFE6" }}>
            Tudo que o MEI precisa para crescer com controle
          </h1>
          <p className="text-xl leading-relaxed font-light max-w-2xl mx-auto"
            style={{ color: "rgba(244,239,230,0.75)" }}>
            Do fluxo de caixa às propostas comerciais — o DashComigo centraliza a gestão financeira do seu negócio em uma plataforma simples e intuitiva.
          </p>
          <div className="flex justify-center gap-4 mt-10">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition-all shadow-xl text-lg"
              style={{ background: "#7FD19F", color: "#0E3B2E" }}
            >
              Testar grátis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-24" id="ferramentas" style={{ background: "#EBE4D6" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4" style={{ color: "#0E3B2E" }}>Ferramentas disponíveis</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(14,59,46,0.6)" }}>
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
                  className="group rounded-2xl p-6 transition-all block"
                  style={{ background: "#F4EFE6", border: "1px solid rgba(20,18,15,0.1)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(14,59,46,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                      style={{ background: "rgba(14,59,46,0.08)" }}>
                      <Icon className="w-6 h-6" style={{ color: "#0E3B2E" }} />
                    </div>
                    {tool.badge && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        tool.badge === "Premium" ? "bg-amber-100 text-amber-700" : ""
                      }`}
                        style={tool.badge !== "Premium" ? { background: "rgba(127,209,159,0.2)", color: "#1F5A3A" } : {}}>
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: "#0E3B2E" }}>{tool.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(14,59,46,0.6)" }}>{tool.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#1F5A3A" }}>
                    Abrir ferramenta <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "#0E3B2E" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-extrabold text-4xl mb-6" style={{ color: "#F4EFE6" }}>
            Comece a usar hoje, grátis
          </h2>
          <p className="text-xl mb-10 font-light" style={{ color: "rgba(244,239,230,0.75)" }}>
            Acesso imediato a todas as ferramentas essenciais. Sem cartão de crédito.
          </p>
          <Link
            to="/signup"
            className="inline-block px-10 py-5 rounded-lg font-bold transition-all shadow-2xl text-lg"
            style={{ background: "#7FD19F", color: "#0E3B2E" }}
          >
            Criar conta gratuita
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
