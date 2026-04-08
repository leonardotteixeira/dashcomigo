import type { InvestmentAllocation } from '../../types/investments';

interface AlocacaoVisualProps {
  allocation: InvestmentAllocation;
}

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

export function AlocacaoVisual({ allocation }: AlocacaoVisualProps) {
  const buckets = [
    {
      label: 'Curto Prazo',
      subtitle: 'Até 1 ano',
      icon: '⏱️',
      color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      textColor: 'text-blue-300',
      amount: allocation.curto_prazo.amount,
      percentage: allocation.curto_prazo.percentage,
    },
    {
      label: 'Médio Prazo',
      subtitle: '1 a 5 anos',
      icon: '📈',
      color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
      textColor: 'text-yellow-300',
      amount: allocation.medio_prazo.amount,
      percentage: allocation.medio_prazo.percentage,
    },
    {
      label: 'Longo Prazo',
      subtitle: '5+ anos',
      icon: '🚀',
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
      textColor: 'text-green-300',
      amount: allocation.longo_prazo.amount,
      percentage: allocation.longo_prazo.percentage,
    },
  ];

  const getReturnColor = (amount: number, index: number) => {
    if (index === 0) return 'text-blue-300';
    if (index === 1) return 'text-yellow-300';
    return 'text-green-300';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Sua Alocação</h3>
        <p className="text-sm text-[#A1A1A1]">Perfil: {allocation.riskProfile === 'conservador' ? '🛡️ Conservador' : allocation.riskProfile === 'moderado' ? '⚖️ Moderado' : '📈 Agressivo'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {buckets.map((bucket, idx) => (
          <div key={idx} className={`p-6 rounded-xl border bg-gradient-to-br ${bucket.color}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-2xl mb-1">{bucket.icon}</p>
                <p className="font-bold text-white">{bucket.label}</p>
                <p className="text-xs text-[#A1A1A1]">{bucket.subtitle}</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${bucket.textColor}`}>{bucket.percentage.toFixed(0)}%</p>
                <p className="text-xs text-[#A1A1A1]">{buckets.length} buckets</p>
              </div>
            </div>

            <div className="p-3 bg-[#0F0F0F]/50 rounded-lg">
              <p className="text-xs text-[#A1A1A1]">Valor alocado</p>
              <p className={`text-lg font-bold ${getReturnColor(bucket.amount, idx)}`}>
                {fmt(bucket.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Retorno esperado */}
      <div className="p-6 bg-[#1B1B1B] rounded-xl border border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#A1A1A1] mb-1">Retorno Anual Esperado</p>
            <p className="text-3xl font-bold text-[#2DDB81]">{fmt(allocation.projectedAnnualReturn)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#A1A1A1] mb-1">Esta recomendação é válida por</p>
            <p className="font-bold text-white">90 dias</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs text-[#A1A1A1]">
            💡 Baseado em rentabilidades históricas. Passado não garante futuro.
          </p>
        </div>
      </div>
    </div>
  );
}
