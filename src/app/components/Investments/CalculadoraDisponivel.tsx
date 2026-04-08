import type { AvailableCalculation } from '../../types/investments';

interface CalculadoraDisponivelProps {
  available: AvailableCalculation;
}

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

export function CalculadoraDisponivel({ available }: CalculadoraDisponivelProps) {
  const percentage = available.currentBalance > 0
    ? (available.availableForInvestment / available.currentBalance) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="p-6 bg-[#1B1B1B] rounded-xl border border-white/5">
        <h3 className="text-lg font-bold text-white mb-4">Cálculo do Disponível</h3>

        {/* Breakdown table */}
        <div className="space-y-3 mb-6">
          {available.details.map((detail, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-[#0F0F0F] rounded-lg">
              <span className="text-[#A1A1A1]">{detail.label}</span>
              <span className={`font-bold text-lg ${detail.amount > 0 ? 'text-[#2DDB81]' : 'text-[#FF4F3D]'}`}>
                {detail.amount > 0 ? '+' : '-'}{fmt(Math.abs(detail.amount))}
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-4 bg-[#28A263]/10 rounded-lg border border-[#28A263]/20">
          <p className="text-sm text-[#A1A1A1] mb-1">Total Disponível para Investir</p>
          <p className="text-3xl font-bold text-[#2DDB81]">{fmt(available.availableForInvestment)}</p>
          <p className="text-xs text-[#A1A1A1] mt-2">
            {percentage.toFixed(0)}% do seu saldo atual
          </p>
        </div>

        {/* Explanation */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-300">
            <strong>Como calculamos:</strong> Pegamos seu saldo atual e descontamos:
            <br />• Fundo de emergência (3 meses de despesas)
            <br />• Capital de giro mínimo (30 dias de despesa)
            <br />• Contas a pagar nos próximos 30 dias
            <br />
            O que sobra é seguro para investir sem afetar sua operação!
          </p>
        </div>
      </div>

      {available.availableForInvestment < 100 && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-sm text-orange-300">
            ⚠️ Seu saldo disponível é baixo. Recomendamos focar em aumentar seu fundo de emergência antes de investir.
          </p>
        </div>
      )}
    </div>
  );
}
