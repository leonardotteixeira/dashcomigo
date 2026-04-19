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
      <div className="p-6 rounded-xl border border-[#E8EBF1] shadow-sm">
        <h3 className="text-lg font-bold text-[#0E3B2E] mb-4">Cálculo do Disponível</h3>

        {/* Breakdown table */}
        <div className="space-y-3 mb-6">
          {available.details.map((detail, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg border border-[rgba(20,18,15,0.13)]">
              <span className="text-[rgba(0,21,41,0.6)]">{detail.label}</span>
              <span className={`font-bold text-lg ${detail.amount > 0 ? 'text-[#28A263]' : 'text-[#EF4444]'}`}>
                {detail.amount > 0 ? '+' : '-'}{fmt(Math.abs(detail.amount))}
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-4 bg-[#28A263]/10 rounded-lg border border-[#28A263]/20">
          <p className="text-sm text-[rgba(0,21,41,0.6)] mb-1">Total Disponível para Investir</p>
          <p className="text-3xl font-bold text-[#28A263]">{fmt(available.availableForInvestment)}</p>
          <p className="text-xs text-[rgba(0,21,41,0.55)] mt-2">
            {percentage.toFixed(0)}% do seu saldo atual
          </p>
        </div>

        {/* Explanation */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
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
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">
            ⚠️ Seu saldo disponível é baixo. Recomendamos focar em aumentar seu fundo de emergência antes de investir.
          </p>
        </div>
      )}
    </div>
  );
}
