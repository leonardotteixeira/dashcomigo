import { useState } from "react";
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
  Lock,
  Crown,
  Wallet,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { canAccess } from "../../utils/featureAccessService";
import { useRealInvestments } from "../hooks/useRealInvestments";
import { resyncPluggyUser } from "../../lib/pluggy";

const TYPE_COLORS: Record<string, string> = {
  'Renda Fixa': '#10b981',
  'Ações': '#3b82f6',
  'Fundo de Investimento': '#8b5cf6',
  'ETF': '#f59e0b',
  'COE': '#ef4444',
  'FII': '#06b6d4',
  'Criptomoeda': '#f97316',
  'Previdência': '#6366f1',
  'Título': '#84cc16',
  'Outros': '#6b7280',
};

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
    benefits: ["Liquidez diária", "Garantido pelo governo", "Baixíssimo risco"],
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
    benefits: ["Protege da inflação", "Rentabilidade real", "Garantido pelo governo"],
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
    benefits: ["Coberto pelo FGC", "Rentabilidade superior à poupança", "Diversas opções de prazo"],
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
    benefits: ["Isento de IR", "Coberto pelo FGC", "Ideal para médio prazo"],
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
    benefits: ["Gestão profissional", "Diversificação automática", "Liquidez D+0 ou D+30"],
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
    benefits: ["Diversificação ampla", "Potencial de maior retorno", "Gestão ativa"],
    externalLink: "https://www.xpi.com.br/investimentos/fundos",
  },
];

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function RealPortfolio({ investments, summary, onRefresh }: {
  investments: any[];
  summary: any;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Total Investido</p>
          <p className="font-bold text-lg text-gray-900">{fmt(summary.totalInvested)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Valor Atual</p>
          <p className="font-bold text-lg text-gray-900">{fmt(summary.totalCurrent)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Retorno</p>
          <p className={`font-bold text-lg ${summary.totalReturn >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {summary.totalReturn >= 0 ? '+' : ''}{fmt(summary.totalReturn)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Rentabilidade</p>
          <p className={`font-bold text-lg ${summary.returnPct >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {summary.returnPct >= 0 ? '+' : ''}{summary.returnPct.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Distribuição por tipo */}
      {Object.keys(summary.byType).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Distribuição por Tipo</h3>
          <div className="space-y-3">
            {Object.entries(summary.byType).map(([type, data]: [string, any]) => {
              const pct = summary.totalCurrent > 0 ? (data.current / summary.totalCurrent) * 100 : 0;
              const color = TYPE_COLORS[type] || '#6b7280';
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{type} ({data.count})</span>
                    <span className="text-gray-500">{fmt(data.current)} · {pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Seus Investimentos ({investments.length})</h3>
          <button
            onClick={onRefresh}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Atualizar
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {investments.map((inv: any) => {
            const current = inv.current_value || 0;
            const rawInvested = inv.invested_amount || 0;
            // Sanitiza: se perda > 90% é dado inválido (sandbox), mostra sem retorno
            const invested = (rawInvested > 0 && current / rawInvested >= 0.1)
              ? rawInvested : current;
            const ret = current - invested;
            const retPct = invested > 0 ? (ret / invested) * 100 : 0;
            const hasReturn = rawInvested > 0 && current / rawInvested >= 0.1;
            const color = TYPE_COLORS[inv.type] || '#6b7280';
            return (
              <div key={inv.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{inv.name}</p>
                    <p className="text-xs text-gray-500">{inv.type}{inv.subtype ? ` · ${inv.subtype}` : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">{fmt(current)}</p>
                  {hasReturn ? (
                    <p className={`text-xs ${ret >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {ret >= 0 ? '+' : ''}{retPct.toFixed(2)}%
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">—</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function GuiaInvestimentos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { investments, summary, loading, refresh } = useRealInvestments();

  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const hasRealData = !loading && investments.length > 0;

  async function handleSync() {
    if (!user?.id) return;
    setSyncing(true);
    setSyncMsg(null);
    try {
      // Lê itemId do localStorage (gravado quando o usuário conectou o banco)
      const storedItemId = localStorage.getItem(`pluggy_item_id_${user.id}`);
      const result = await resyncPluggyUser(user.id, storedItemId);
      await refresh();
      setSyncMsg({
        type: 'success',
        text: `Sincronizado! ${result.investments?.imported ?? 0} novos, ${result.investments?.updated ?? 0} atualizados.`,
      });
    } catch (err: any) {
      const isNetworkError = err?.message?.includes('fetch') || err?.message?.includes('Failed to fetch');
      const isItemMissing = err?.message?.includes('itemIdMissing') || err?.message?.includes('Item ID');
      setSyncMsg({
        type: 'error',
        text: isNetworkError
          ? 'Backend não está rodando. Execute: npx ts-node server.ts'
          : isItemMissing
          ? 'Reconecte seu banco pelo Dashboard → botão "Conectar Banco" para habilitar o sync.'
          : err?.message || 'Erro ao sincronizar.',
      });
    } finally {
      setSyncing(false);
    }
  }

  if (!canAccess("investments", user?.plan ?? "free")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0E3B2E] to-[#0E3B2E] flex items-center justify-center mb-6 shadow-xl">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#0E3B2E] mb-3">
          Guia de Investimentos — Exclusivo Premium
        </h2>
        <p className="text-[#0E3B2E]/60 mb-8 max-w-md">
          Aprenda a investir de forma inteligente com estratégias personalizadas para MEIs. Disponível apenas no Plano Premium.
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0E3B2E] to-[#0066FF] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-md"
        >
          <Crown className="w-5 h-5" />
          Fazer Upgrade para Premium
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-bold text-2xl text-[#0E3B2E] mb-1">
            {hasRealData ? 'Minha Carteira' : 'Sugestões de Investimentos'}
          </h1>
          <p className="text-[#0E3B2E]/60">
            {hasRealData
              ? `${investments.length} ativo${investments.length !== 1 ? 's' : ''} importado${investments.length !== 1 ? 's' : ''} via Open Finance`
              : 'Faça seu dinheiro trabalhar para você com investimentos inteligentes'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasRealData && (
            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              <Wallet className="w-4 h-4" />
              <span>Open Finance · {fmt(summary.totalCurrent)}</span>
            </div>
          )}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-[#0E3B2E] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0a2e22] transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar Carteira'}
          </button>
        </div>
      </div>

      {/* Mensagem de sync */}
      {syncMsg && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
          syncMsg.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{syncMsg.text}</span>
        </div>
      )}

      {/* Banner: sem dados ainda */}
      {!loading && !hasRealData && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Nenhum investimento encontrado</p>
            <p className="text-amber-700 text-sm mt-1">
              Clique em <strong>"Sincronizar Carteira"</strong> acima (backend precisa estar rodando:{' '}
              <code className="bg-amber-100 px-1 rounded">npx ts-node server.ts</code>).
              Se os dados estiverem errados, limpe a collection <code className="bg-amber-100 px-1 rounded">investments</code> no PocketBase Admin e sincronize novamente.
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12 text-gray-400">Carregando carteira...</div>
      )}

      {/* Carteira Real */}
      {hasRealData && <RealPortfolio investments={investments} summary={summary} onRefresh={refresh} />}

      {/* Sugestões genéricas */}
      {!loading && !hasRealData && (
        <>
          {/* Info Banner */}
          <div className="bg-gradient-to-br from-[#0E3B2E] via-[#0E3B2E] to-[#0E3B2E] rounded-2xl p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-xl mb-2">Por que investir seu dinheiro parado?</h2>
                <p className="text-white/90 mb-4">
                  Manter dinheiro parado na conta corrente faz você perder poder de compra com a inflação.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="font-semibold mb-1">Segurança</p>
                    <p className="text-sm text-white/80">Investimentos garantidos pelo governo ou FGC</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="font-semibold mb-1">Rentabilidade</p>
                    <p className="text-sm text-white/80">Ganhe até 10x mais que a poupança</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="font-semibold mb-1">Liquidez</p>
                    <p className="text-sm text-white/80">Resgate quando precisar (maioria D+0 ou D+1)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opções */}
          <div className="space-y-4">
            <h2 className="font-bold text-xl text-[#0E3B2E]">Opções de Investimento</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {investmentOptions.map((investment) => {
                const Icon = investment.icon;
                return (
                  <div
                    key={investment.id}
                    className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${investment.color}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: investment.color }} />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#0E3B2E]/60 uppercase tracking-wider">
                          {investment.category}
                        </span>
                        <h3 className="font-bold text-lg text-[#0E3B2E] mt-1">{investment.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-[#0E3B2E]/70 mb-4">{investment.description}</p>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-[#F4EFE6] rounded-lg p-3">
                        <p className="text-xs text-[#0E3B2E]/60 mb-1">Rentabilidade</p>
                        <p className="font-bold text-sm text-[#0E3B2E]">{investment.rentability}</p>
                      </div>
                      <div className="bg-[#F4EFE6] rounded-lg p-3">
                        <p className="text-xs text-[#0E3B2E]/60 mb-1">Valor Mínimo</p>
                        <p className="font-bold text-sm text-[#0E3B2E]">{investment.minValue}</p>
                      </div>
                      <div className="bg-[#F4EFE6] rounded-lg p-3">
                        <p className="text-xs text-[#0E3B2E]/60 mb-1">Risco</p>
                        <p className="font-bold text-sm text-[#0E3B2E]">{investment.risk}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {investment.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#10b981]" />
                          <span className="text-sm text-[#0E3B2E]/70">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <a
                      href={investment.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#0E3B2E] text-white px-4 py-3 rounded-lg hover:bg-[#002a50] transition-colors font-semibold"
                    >
                      Investir Agora <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#F4EFE6] border border-[rgba(20,18,15,0.13)] rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#0E3B2E]/60 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#0E3B2E]/70">
                As informações apresentadas são apenas para fins educacionais e não constituem
                recomendação de investimento. Rentabilidades passadas não garantem resultados futuros.
                Consulte um assessor de investimentos para decisões personalizadas.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#0E3B2E] to-[#002a50] rounded-2xl p-8 text-center">
            <h2 className="font-bold text-2xl text-white mb-3">Receba Recomendações Personalizadas</h2>
            <p className="text-white/80 mb-6">
              Responda um breve questionário e descubra a melhor estratégia para seu perfil.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={() => navigate("/app/recomendacoes-investimento")}
                className="flex items-center gap-2 bg-white text-[#0E3B2E] px-6 py-3 rounded-lg hover:bg-white/95 transition-colors font-semibold"
              >
                Obter Recomendações <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://www.tesourodireto.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors font-semibold border border-white/20"
              >
                Tesouro Direto <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
