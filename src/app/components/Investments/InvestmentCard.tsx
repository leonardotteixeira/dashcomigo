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
          ? 'bg-gradient-to-br from-[#28A263]/20 to-[#1B1B1B] border-[#28A263]/30 shadow-lg shadow-[#28A263]/10'
          : 'bg-[#1B1B1B] border-white/5 hover:border-white/10'
      }`}
    >
      {recommendation.recommended && (
        <div className="mb-3 inline-block px-2 py-1 bg-[#28A263]/20 border border-[#28A263] rounded-lg">
          <p className="text-xs font-bold text-[#2DDB81]">⭐ Recomendado</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-1">{recommendation.name}</h3>
        <p className="text-sm text-[#A1A1A1]">{recommendation.description}</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-[#0F0F0F] rounded-lg">
          <p className="text-xs text-[#A1A1A1]">Rentabilidade</p>
          <p className="text-lg font-bold text-[#2DDB81]">{(recommendation.expectedAnnualReturn * 100).toFixed(1)}%</p>
          <p className="text-xs text-[#686F6F]">ao ano</p>
        </div>

        <div className={`p-3 rounded-lg ${riskColors.bg} border ${riskColors.border}`}>
          <p className="text-xs text-[#A1A1A1]">Risco</p>
          <p className={`font-bold ${riskColors.text}`}>{getRiskLabel(recommendation.riskLevel)}</p>
          <p className="text-xs text-[#A1A1A1]">Volatilidade</p>
        </div>
      </div>

      {/* Valor mínimo */}
      <div className="mb-4 p-3 bg-[#0F0F0F] rounded-lg">
        <p className="text-xs text-[#A1A1A1]">Valor Mínimo para Começar</p>
        <p className="font-bold text-white">{fmt(recommendation.minAmount)}</p>
      </div>

      {/* Como funciona */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-white mb-2">Como funciona?</h4>
        <p className="text-sm text-[#A1A1A1] leading-relaxed">{recommendation.howItWorks}</p>
      </div>

      {/* Vantagens e desvantagens */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-xs font-bold text-green-300 mb-2">✅ Vantagens</h4>
          <ul className="text-xs text-[#A1A1A1] space-y-1">
            {recommendation.pros.map((pro, idx) => (
              <li key={idx}>• {pro}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-orange-300 mb-2">⚠️ Desvantagens</h4>
          <ul className="text-xs text-[#A1A1A1] space-y-1">
            {recommendation.cons.map((con, idx) => (
              <li key={idx}>• {con}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Provider info */}
      {recommendation.provider && (
        <div className="mb-4 text-xs text-[#686F6F]">
          Provedor: <span className="text-[#A1A1A1]">{recommendation.provider}</span>
        </div>
      )}

      {/* CTA Button */}
      {recommendation.externalLink && (
        <Button
          className="w-full bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-lg flex items-center justify-center gap-2"
          onClick={() => window.open(recommendation.externalLink, '_blank')}
        >
          Investir Agora
          <ExternalLink className="w-4 h-4" />
        </Button>
      )}

      {!recommendation.externalLink && (
        <Button
          disabled
          className="w-full bg-white/5 text-[#A1A1A1] rounded-lg"
        >
          Em desenvolvimento
        </Button>
      )}
    </div>
  );
}
