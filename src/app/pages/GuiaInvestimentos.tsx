import {
  TrendingUp,
  Shield,
  Landmark,
  PiggyBank,
  LineChart,
  ExternalLink,
  ArrowRight,
  Info,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { KPICard } from "../components/KPICard";
import { PageHeader } from "../components/PageHeader";

const investmentOptions = [
  {
    id: 1,
    category: "Tesouro Direto",
    title: "Tesouro Selic",
    description: "Liquidez diária e baixo risco. Ideal para reserva de emergência.",
    rentability: "100% CDI",
    minValue: "R$ 30",
    risk: "Muito Baixo",
    icon: Landmark,
    color: "#003a6d",
    benefits: [
      "Liquidez diária",
      "Garantido pelo governo",
      "Baixíssimo risco",
    ],
    externalLink: "https://www.tesourodireto.com.br",
  },
  {
    id: 2,
    category: "Tesouro Direto",
    title: "Tesouro IPCA+",
    description: "Proteção contra inflação com rentabilidade real.",
    rentability: "IPCA + 6% a.a.",
    minValue: "R$ 30",
    risk: "Baixo",
    icon: Shield,
    color: "#10b981",
    benefits: [
      "Protege da inflação",
      "Rentabilidade real",
      "Garantido pelo governo",
    ],
    externalLink: "https://www.tesourodireto.com.br",
  },
  {
    id: 3,
    category: "Renda Fixa",
    title: "CDB",
    description: "Certificado de Depósito Bancário com boa rentabilidade.",
    rentability: "110% a 130% CDI",
    minValue: "R$ 1.000",
    risk: "Baixo",
    icon: PiggyBank,
    color: "#3b82f6",
    benefits: [
      "Coberto pelo FGC",
      "Rentabilidade superior à poupança",
      "Diversas opções de prazo",
    ],
    externalLink: "https://www.xpi.com.br/investimentos/renda-fixa/cdb",
  },
  {
    id: 4,
    category: "Renda Fixa",
    title: "LCI / LCA",
    description: "Letras isentas de imposto de renda.",
    rentability: "90% a 100% CDI",
    minValue: "R$ 1.000",
    risk: "Baixo",
    icon: TrendingUp,
    color: "#8b5cf6",
    benefits: [
      "Isento de IR",
      "Coberto pelo FGC",
      "Ideal para médio prazo",
    ],
    externalLink: "https://www.xpi.com.br/investimentos/renda-fixa/lci-lca",
  },
  {
    id: 5,
    category: "Fundos de Investimento",
    title: "Fundos de Renda Fixa",
    description: "Gestão profissional de carteira de renda fixa.",
    rentability: "CDI + 1% a.a.",
    minValue: "R$ 500",
    risk: "Baixo a Médio",
    icon: LineChart,
    color: "#f59e0b",
    benefits: [
      "Gestão profissional",
      "Diversificação automática",
      "Liquidez D+0 ou D+30",
    ],
    externalLink: "https://www.xpi.com.br/investimentos/fundos",
  },
  {
    id: 6,
    category: "Fundos de Investimento",
    title: "Fundos Multimercado",
    description: "Diversificação em várias classes de ativos.",
    rentability: "CDI + 3% a.a.",
    minValue: "R$ 1.000",
    risk: "Médio",
    icon: TrendingUp,
    color: "#ef4444",
    benefits: [
      "Diversificação ampla",
      "Potencial de maior retorno",
      "Gestão ativa",
    ],
    externalLink: "https://www.xpi.com.br/investimentos/fundos",
  },
];

export function GuiaInvestimentos() {
  const lowRiskInvestments = investmentOptions.filter(i => i.risk === "Muito Baixo" || i.risk === "Baixo").length;
  const mediumRiskInvestments = investmentOptions.filter(i => i.risk.includes("Médio")).length;

  return (
    <div className="space-y-6">
      {/* Header with PageHeader component */}
      <PageHeader
        title="Sugestões de Investimentos"
        subtitle="Faça seu dinheiro trabalhar para você com investimentos inteligentes"
      />

      {/* KPI Cards - Premium Financial Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          label="Opções Disponíveis"
          value={`${investmentOptions.length} investimentos`}
          description="Produtos financeiros selecionados para MEIs e pequenos empresários"
          icon={TrendingUp}
          color="blue"
        />

        <KPICard
          label="Baixo Risco"
          value={`${lowRiskInvestments} opções`}
          description="Segurança máxima com cobertura do FGC ou garantia do governo federal"
          icon={Shield}
          color="green"
        />

        <KPICard
          label="Alto Retorno"
          value={`${mediumRiskInvestments} oportunidades`}
          description="Maior potencial de rendimento para quem busca crescimento no longo prazo"
          icon={Sparkles}
          color="purple"
        />
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-br from-[#001529] via-[#002140] to-[#003a6d] rounded-2xl p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-xl mb-2">
              Por que investir seu dinheiro parado?
            </h2>
            <p className="text-white/90 mb-4">
              Manter dinheiro parado na conta corrente faz você perder poder de
              compra com a inflação. Investimentos conservadores oferecem
              segurança e rentabilidade superior à poupança.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="font-semibold mb-1">Segurança</p>
                <p className="text-sm text-white/80">
                  Investimentos garantidos pelo governo ou FGC
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="font-semibold mb-1">Rentabilidade</p>
                <p className="text-sm text-white/80">
                  Ganhe até 10x mais que a poupança
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="font-semibold mb-1">Liquidez</p>
                <p className="text-sm text-white/80">
                  Resgate quando precisar (maioria D+0 ou D+1)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Options */}
      <div className="space-y-4">
        <h2 className="font-bold text-xl text-[#001529]">
          Opções de Investimento
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {investmentOptions.map((investment) => {
            const Icon = investment.icon;
            return (
              <div
                key={investment.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${investment.color}15` }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: investment.color }}
                      />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#001529]/60 uppercase tracking-wider">
                        {investment.category}
                      </span>
                      <h3 className="font-bold text-lg text-[#001529] mt-1">
                        {investment.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#001529]/70 mb-4">
                  {investment.description}
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#F5F7FA] rounded-lg p-3">
                    <p className="text-xs text-[#001529]/60 mb-1">
                      Rentabilidade
                    </p>
                    <p className="font-bold text-sm text-[#001529]">
                      {investment.rentability}
                    </p>
                  </div>
                  <div className="bg-[#F5F7FA] rounded-lg p-3">
                    <p className="text-xs text-[#001529]/60 mb-1">
                      Valor Mínimo
                    </p>
                    <p className="font-bold text-sm text-[#001529]">
                      {investment.minValue}
                    </p>
                  </div>
                  <div className="bg-[#F5F7FA] rounded-lg p-3">
                    <p className="text-xs text-[#001529]/60 mb-1">Risco</p>
                    <p className="font-bold text-sm text-[#001529]">
                      {investment.risk}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {investment.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#10b981]" />
                      <span className="text-sm text-[#001529]/70">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href={investment.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#003a6d] text-white px-4 py-3 rounded-lg hover:bg-[#002a50] transition-colors font-semibold group-hover:gap-3"
                >
                  Investir Agora
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#001529]/60 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-[#001529] mb-2">
              Aviso Importante
            </p>
            <p className="text-sm text-[#001529]/70">
              As informações apresentadas são apenas para fins educacionais e não
              constituem recomendação de investimento. Rentabilidades passadas
              não garantem resultados futuros. Consulte um assessor de
              investimentos para decisões personalizadas. Os links direcionam
              para plataformas externas de investimento.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-bold text-2xl text-[#001529] mb-3">
            Pronto para começar a investir?
          </h2>
          <p className="text-[#001529]/70 mb-6">
            Escolha a opção que mais se adequa ao seu perfil e objetivos
            financeiros. Comece com valores pequenos e aumente gradualmente.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://www.tesourodireto.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#003a6d] text-white px-6 py-3 rounded-lg hover:bg-[#002a50] transition-colors font-semibold"
            >
              Tesouro Direto
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://www.xpi.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-[#003a6d] border-2 border-[#003a6d] px-6 py-3 rounded-lg hover:bg-[#F5F7FA] transition-colors font-semibold"
            >
              Outras Opções
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
