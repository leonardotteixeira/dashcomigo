import { ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import type { InvestmentRecommendation } from '../../types/investments';

interface InvestmentCardProps {
  recommendation: InvestmentRecommendation;
  highlight?: boolean;
}

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

const getRiskColor = (level: string) => {
  switch (level) {
    case 'minimo':
      return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-300' };
    case 'baixo':
      return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300' };
    case 'medio':
      return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-300' };
    case 'alto':
      return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-300' };
    default:
      return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-300' };
  }
};

const getRiskLabel = (level: string) => {
  const labels: Record<string, string> = {
    minimo: '🛡️ Mínimo',
    baixo: '✓ Baixo',
    medio: '⚠️ Médio',
    alto: '📈 Alto',
  };
  return labels[level] || level;
};

export function InvestmentCard({ recommendation, highlight = false }: InvestmentCardProps) {
  const riskColors = getRiskColor(recommendation.riskLevel);

  return (
    <div
      className={`p-6 rounded-xl border transition-all ${
        highlight
          ? 'bg-white border-[#28A263]/30 shadow-md hover:shadow-lg'
          : 'bg-white border-[#E5E7EB] hover:shadow-md'
      }`}
    >
      {recommendation.recommended && (
        <div className="mb-3 inline-block px-2 py-1 bg-[#28A263]/10 border border-[#28A263]/30 rounded-lg">
          <p className="text-xs font-bold text-[#28A263]">⭐ Recomendado</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-[#001529] mb-1">{recommendation.name}</h3>
        <p className="text-sm text-[rgba(0,21,41,0.6)]">{recommendation.description}</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
          <p className="text-xs text-[rgba(0,21,41,0.6)]">Rentabilidade</p>
          <p className="text-lg font-bold text-[#28A263]">{(recommendation.expectedAnnualReturn * 100).toFixed(1)}%</p>
          <p className="text-xs text-[rgba(0,21,41,0.55)]">ao ano</p>
        </div>

        <div className={`p-3 rounded-lg border`}>
          <p className="text-xs text-[rgba(0,21,41,0.6)]">Risco</p>
          <p className={`font-bold`}>{getRiskLabel(recommendation.riskLevel)}</p>
          <p className="text-xs text-[rgba(0,21,41,0.55)]">Volatilidade</p>
        </div>
      </div>

      {/* Valor mínimo */}
      <div className="mb-4 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
        <p className="text-xs text-[rgba(0,21,41,0.6)]">Valor Mínimo para Começar</p>
        <p className="font-bold text-[#001529]">{fmt(recommendation.minAmount)}</p>
      </div>

      {/* Como funciona */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-[#001529] mb-2">Como funciona?</h4>
        <p className="text-sm text-[rgba(0,21,41,0.6)] leading-relaxed">{recommendation.howItWorks}</p>
      </div>

      {/* Vantagens e desvantagens */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-xs font-bold text-[#28A263] mb-2">✅ Vantagens</h4>
          <ul className="text-xs text-[rgba(0,21,41,0.6)] space-y-1">
            {recommendation.pros.map((pro, idx) => (
              <li key={idx}>• {pro}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-amber-600 mb-2">⚠️ Desvantagens</h4>
          <ul className="text-xs text-[rgba(0,21,41,0.6)] space-y-1">
            {recommendation.cons.map((con, idx) => (
              <li key={idx}>• {con}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Provider info */}
      {recommendation.provider && (
        <div className="mb-4 text-xs text-[rgba(0,21,41,0.55)]">
          Provedor: <span className="text-[#001529] font-medium">{recommendation.provider}</span>
        </div>
      )}

      {/* CTA Button */}
      {recommendation.externalLink && (
        <Button
          className="w-full bg-[#28A263] hover:bg-[#20915a] text-white rounded-lg flex items-center justify-center gap-2 font-semibold"
          onClick={() => window.open(recommendation.externalLink, '_blank')}
        >
          Investir Agora
          <ExternalLink className="w-4 h-4" />
        </Button>
      )}

      {!recommendation.externalLink && (
        <Button
          disabled
          className="w-full bg-[#F9FAFB] text-[rgba(0,21,41,0.4)] rounded-lg border border-[#E5E7EB]"
        >
          Em desenvolvimento
        </Button>
      )}
    </div>
  );
}
