import { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import type { RiskProfile } from '../../types/investments';

interface QuestionarioRiscoProps {
  onComplete: (profile: {
    experience: 'iniciante' | 'intermediario' | 'avancado';
    tolerance: RiskProfile;
    timeHorizon: number;
  }) => void;
}

export function QuestionarioRisco({ onComplete }: QuestionarioRiscoProps) {
  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState<'iniciante' | 'intermediario' | 'avancado' | null>(null);
  const [tolerance, setTolerance] = useState<RiskProfile | null>(null);
  const [timeHorizon, setTimeHorizon] = useState<string>('');

  const questions = [
    {
      title: 'Qual sua experiência com investimentos?',
      options: [
        { label: 'Iniciante - Primeira vez', value: 'iniciante' },
        { label: 'Intermediário - Já investi antes', value: 'intermediario' },
        { label: 'Avançado - Investidor experiente', value: 'avancado' },
      ],
      current: experience,
      setCurrent: setExperience,
    },
    {
      title: 'Qual seu perfil de tolerância ao risco?',
      options: [
        { label: 'Conservador - Segurança em primeiro lugar', value: 'conservador' },
        { label: 'Moderado - Equilíbrio entre segurança e retorno', value: 'moderado' },
        { label: 'Agressivo - Busco máximo retorno', value: 'agressivo' },
      ],
      current: tolerance,
      setCurrent: setTolerance,
    },
  ];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else if (step === 2 && timeHorizon && experience && tolerance) {
      onComplete({
        experience,
        tolerance,
        timeHorizon: parseInt(timeHorizon),
      });
    }
  };

  const isStepValid = () => {
    if (step === 0) return experience !== null;
    if (step === 1) return tolerance !== null;
    return timeHorizon !== '';
  };

  return (
    <div className="space-y-6">
      {step < 2 && (
        <div>
          <h3 className="text-lg font-bold text-[#001529] mb-4">{questions[step].title}</h3>
          <div className="space-y-3">
            {questions[step].options.map((option) => (
              <button
                key={option.value}
                onClick={() => questions[step].setCurrent(option.value as any)}
                className={`w-full p-4 rounded-lg border transition-all text-left ${
                  questions[step].current === option.value
                    ? 'bg-[#28A263]/10 border-[#28A263] bg-white'
                    : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#28A263]/30'
                }`}
              >
                <p className="font-medium text-[#001529]">{option.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-lg font-bold text-[#001529] mb-4">Qual seu horizonte de investimento?</h3>
          <div className="space-y-3">
            <Label className="text-[#001529] font-medium">Anos até precisar do dinheiro</Label>
            <input
              type="number"
              min="1"
              max="50"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value)}
              placeholder="Ex: 10"
              className="w-full p-3 rounded-lg bg-white border border-[#E5E7EB] text-[#001529] text-lg focus:outline-none focus:ring-2 focus:ring-[#28A263]/20"
            />
            <p className="text-xs text-[rgba(0,21,41,0.55)]">
              {timeHorizon && (
                <>
                  {parseInt(timeHorizon) < 2 && 'Muito curto - Conservador recomendado'}
                  {parseInt(timeHorizon) >= 2 && parseInt(timeHorizon) < 5 && 'Curto prazo - Moderado mais seguro'}
                  {parseInt(timeHorizon) >= 5 && parseInt(timeHorizon) < 10 && 'Médio prazo - Moderado recomendado'}
                  {parseInt(timeHorizon) >= 10 && 'Longo prazo - Permite mais agressividade'}
                </>
              )}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        {step > 0 && (
          <Button
            type="button"
            className="flex-1 bg-white text-[#001529] border border-[#E5E7EB] hover:bg-[#F9FAFB]"
            onClick={() => setStep(step - 1)}
          >
            Voltar
          </Button>
        )}
        <Button
          type="button"
          disabled={!isStepValid()}
          className="flex-1 bg-[#28A263] text-white hover:bg-[#20915a] disabled:opacity-50"
          onClick={handleNext}
        >
          {step < 2 ? 'Próximo' : 'Concluir'}
        </Button>
      </div>
    </div>
  );
}
