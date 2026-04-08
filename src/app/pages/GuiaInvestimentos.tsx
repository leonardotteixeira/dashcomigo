import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useInvestments } from '../contexts/InvestmentsContext';
import { useNavigate } from 'react-router';
import { CalculadoraDisponivel } from '../components/Investments/CalculadoraDisponivel';
import { AlocacaoVisual } from '../components/Investments/AlocacaoVisual';
import { InvestmentCard } from '../components/Investments/InvestmentCard';
import { DisclaimerAviso } from '../components/Investments/DisclaimerAviso';

export function GuiaInvestimentos() {
  const navigate = useNavigate();
  const { available, getRecommendations } = useInvestments();

  // Usar perfil padrão: Moderado
  const defaultProfile = {
    userid: 'temp',
    riskTolerance: 'moderado' as const,
    investmentExperience: 'intermediario' as const,
    timeHorizonYears: 5,
    investmentGoal: 'crescimento' as const,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    availableToInvest: available?.availableForInvestment || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastReviewAt: new Date(),
  };

  const allocation = getRecommendations(defaultProfile);

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001529] mb-1">Guia de Investimentos</h1>
          <p className="text-[rgba(0,21,41,0.6)]">Descubra onde investir seu dinheiro de forma segura</p>
        </div>
        <Button
          variant="ghost"
          size="lg"
          className="text-[rgba(0,21,41,0.6)] hover:text-[#001529]"
          onClick={() => navigate('/app/dashboard')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Disclaimer */}
      <DisclaimerAviso />

      {/* Calculadora de Disponível */}
      {available && (
        <div>
          <h2 className="text-2xl font-bold text-[#001529] mb-4">💰 Quanto Você Pode Investir</h2>
          <CalculadoraDisponivel available={available} />
        </div>
      )}

      {/* Alocação Visual */}
      <div>
        <h2 className="text-2xl font-bold text-[#001529] mb-4">📊 Estratégia de Alocação</h2>
        <AlocacaoVisual allocation={allocation} />
      </div>

      {/* Investimentos por bucket */}
      <div className="space-y-6">
        {/* Curto prazo */}
        <div>
          <h2 className="text-2xl font-bold text-[#001529] mb-4">⏱️ Curto Prazo (até 1 ano)</h2>
          <p className="text-[rgba(0,21,41,0.6)] mb-4">
            Para dinheiro que você pode precisar em breve. Baixo risco, retorno moderado.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {allocation.curto_prazo.recommendations.map((rec) => (
              <InvestmentCard
                key={rec.id}
                recommendation={rec}
                highlight={rec.recommended}
              />
            ))}
          </div>
        </div>

        {/* Médio prazo */}
        <div className="pt-6 border-t border-[rgba(0,0,0,0.1)]">
          <h2 className="text-2xl font-bold text-[#001529] mb-4">📈 Médio Prazo (1 a 5 anos)</h2>
          <p className="text-[rgba(0,21,41,0.6)] mb-4">
            Equilíbrio entre segurança e crescimento. Risco moderado, bom retorno.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {allocation.medio_prazo.recommendations.map((rec) => (
              <InvestmentCard
                key={rec.id}
                recommendation={rec}
                highlight={rec.recommended}
              />
            ))}
          </div>
        </div>

        {/* Longo prazo */}
        <div className="pt-6 border-t border-[rgba(0,0,0,0.1)]">
          <h2 className="text-2xl font-bold text-[#001529] mb-4">🚀 Longo Prazo (5+ anos)</h2>
          <p className="text-[rgba(0,21,41,0.6)] mb-4">
            Para construir patrimônio. Maior risco, maior potencial de retorno.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {allocation.longo_prazo.recommendations.map((rec) => (
              <InvestmentCard
                key={rec.id}
                recommendation={rec}
                highlight={rec.recommended}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Próximos passos */}
      <div className="p-6 bg-[#28A263]/10 rounded-xl border border-[#28A263]/20">
        <h3 className="font-bold text-[#28A263] mb-3">📋 Próximos passos</h3>
        <ol className="text-sm text-[rgba(0,21,41,0.6)] space-y-2 ml-4 list-decimal">
          <li>Escolha pelo menos um investimento de cada período</li>
          <li>Abra conta nos provedores (Tesouro Direto, Nubank, etc)</li>
          <li>Comece com valores pequenos para aprender</li>
          <li>Configure aportes periódicos (automático)</li>
          <li>Revise essa alocação a cada 6-12 meses</li>
        </ol>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3 justify-center pt-6">
        <Button
          className="bg-[#28A263] hover:bg-[#1f7a4a] text-white rounded-lg"
          onClick={() => navigate('/app/dashboard')}
        >
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  );
}
