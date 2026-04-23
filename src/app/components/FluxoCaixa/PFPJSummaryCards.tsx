import { User, Building2 } from 'lucide-react';
import { PFPJSummary } from '../../types/pfpj';
import { formatCurrency } from '../../utils/reportCalculations';

interface PFPJSummaryCardsProps {
  summary: PFPJSummary | null;
  loading?: boolean;
}

export function PFPJSummaryCards({ summary, loading = false }: PFPJSummaryCardsProps) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-32 bg-[#1B1B1B] rounded-xl border border-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* PESSOAL (PF) */}
      <div className="p-6 bg-[#1B1B1B] rounded-xl border border-[#5B5FFF]/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-[#A1A1A1] mb-1">Pessoal (PF)</p>
            <h3 className="text-2xl font-bold text-[#5B5FFF]">{formatCurrency(summary.pf.balance)}</h3>
          </div>
          <div className="w-12 h-12 bg-[#5B5FFF]/20 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-[#5B5FFF]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-[#686F6F]">Entradas</p>
            <p className="text-[#A1A1A1] font-medium">{formatCurrency(summary.pf.totalIncoming)}</p>
          </div>
          <div>
            <p className="text-[#686F6F]">Saídas</p>
            <p className="text-[#A1A1A1] font-medium">{formatCurrency(summary.pf.totalOutgoing)}</p>
          </div>
        </div>

        {summary.pf.transactionCount > 0 && (
          <p className="text-xs text-[#686F6F] mt-3">
            {summary.pf.transactionCount} transação(ões)
          </p>
        )}
      </div>

      {/* EMPRESA (PJ) */}
      <div className="p-6 bg-[#1B1B1B] rounded-xl border border-[#28A263]/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-[#A1A1A1] mb-1">Empresa (PJ)</p>
            <h3 className="text-2xl font-bold text-[#28A263]">{formatCurrency(summary.pj.balance)}</h3>
          </div>
          <div className="w-12 h-12 bg-[#28A263]/20 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#28A263]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-[#686F6F]">Receitas</p>
            <p className="text-[#A1A1A1] font-medium">{formatCurrency(summary.pj.totalIncoming)}</p>
          </div>
          <div>
            <p className="text-[#686F6F]">Despesas</p>
            <p className="text-[#A1A1A1] font-medium">{formatCurrency(summary.pj.totalOutgoing)}</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#686F6F]">Lucro</span>
            <span className="font-medium text-[#28A263]">{formatCurrency(summary.pj.profit)}</span>
          </div>
          <div className="flex justify-between items-center text-xs mt-1">
            <span className="text-[#686F6F]">Margem</span>
            <span className="font-medium text-[#28A263]">{summary.pj.profitMargin.toFixed(1)}%</span>
          </div>
        </div>

        {summary.pj.transactionCount > 0 && (
          <p className="text-xs text-[#686F6F] mt-3">
            {summary.pj.transactionCount} transação(ões)
          </p>
        )}
      </div>
    </div>
  );
}
