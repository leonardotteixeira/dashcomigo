import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useInvestments } from '../contexts/InvestmentsContext';
import { useNavigate } from 'react-router';
import { QuestionarioRisco } from '../components/Investments/QuestionarioRisco';
import { CalculadoraDisponivel } from '../components/Investments/CalculadoraDisponivel';
import { AlocacaoVisual } from '../components/Investments/AlocacaoVisual';
import { InvestmentCard } from '../components/Investments/InvestmentCard';
import { DisclaimerAviso } from '../components/Investments/DisclaimerAviso';

export function RecomendacoesInvestimento() {
  const navigate = useNavigate();
  const { available, calculateAvailable, getRecommendations, detectRiskProfile } = useInvestments();
  const [step, setStep] = useState<'questionnaire' | 'recommendations'>('questionnaire');
  const [allocation, setAllocation] = useState(null as any);

  const handleQuestionarioComplete = (answers: {
    experience: 'iniciante' | 'intermediario' | 'avancado';
    tolerance: 'conservador' | 'moderado' | 'agressivo';
    timeHorizon: number;
  }) => {
    const riskProfile = detectRiskProfile(answers.experience, answers.tolerance, answers.timeHorizon);

    const profile = {
      userid: 'temp', // Will be set properly with auth
      riskTolerance: answers.tolerance,
      investmentExperience: answers.experience,
      timeHorizonYears: answers.timeHorizon,
      investmentGoal: 'crescimento' as const,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      availableToInvest: available?.availableForInvestment || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewAt: new Date(),
    };

    const alloc = getRecommendations(profile);
    setAllocation(alloc);
    setStep('recommendations');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Recomendações de Investimento</h1>
          <p className="text-[#A1A1A1]">Descubra onde investir seu dinheiro de forma segura</p>
        </div>
        <Button
          variant="ghost"
          size="lg"
          className="text-[#A1A1A1] hover:text-white"
          onClick={() => navigate('/app/dashboard')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Disclaimer */}
      <DisclaimerAviso />

      {step === 'questionnaire' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Questionnaire */}
          <div className="p-6 bg-[#1B1B1B] rounded-xl border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-6">
              Vamos conhecer seu perfil
            </h2>
            <QuestionarioRisco onComplete={handleQuestionarioComplete} />
          </div>

          {/* Info side */}
          <div className="space-y-6">
            {/* Available calculation */}
            {available && <CalculadoraDisponivel available={available} />}

            {/* Tips */}
            <div className="p-6 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <h3 className="font-bold text-blue-300 mb-2">💡 Dicas para melhor resultado</h3>
              <ul className="text-xs text-blue-200 space-y-2">
                <li>✓ Responda baseado em seu perfil real, não em esperança</li>
                <li>✓ Considere seu horizonte de tempo realista</li>
                <li>✓ Lembre-se: maior risco = maior possibilidade de perda</li>
                <li>✓ Revise essas recomendações a cada 6 meses</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {step === 'recommendations' && allocation && (
        <div className="space-y-6">
          {/* Alocação visual */}
          <AlocacaoVisual allocation={allocation} />

          {/* Investimentos por bucket */}
          <div className="space-y-6">
            {/* Curto prazo */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">⏱️ Curto Prazo (até 1 ano)</h2>
              <p className="text-[#A1A1A1] mb-4">
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
            <div className="pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">📈 Médio Prazo (1 a 5 anos)</h2>
              <p className="text-[#A1A1A1] mb-4">
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
            <div className="pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">🚀 Longo Prazo (5+ anos)</h2>
              <p className="text-[#A1A1A1] mb-4">
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
            <h3 className="font-bold text-[#2DDB81] mb-3">📋 Próximos passos</h3>
            <ol className="text-sm text-[#A1A1A1] space-y-2 ml-4 list-decimal">
              <li>Escolha pelo menos um investimento de cada bucket</li>
              <li>Abra conta nos provedores (Tesouro Direto, Nubank, etc)</li>
              <li>Comece com valores pequenos para aprender</li>
              <li>Configure aportes periódicos (automático)</li>
              <li>Revise essa alocação a cada 6-12 meses</li>
            </ol>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 justify-center pt-6">
            <Button
              className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
              onClick={() => setStep('questionnaire')}
            >
              Refazer Questionário
            </Button>
            <Button
              className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-lg"
              onClick={() => navigate('/app/dashboard')}
            >
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
