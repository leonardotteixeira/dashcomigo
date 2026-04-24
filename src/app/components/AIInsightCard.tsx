import { useState, useEffect, useCallback } from "react";
import { Sparkles, AlertTriangle, RefreshCw, TrendingUp, ChevronRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFinancialMetrics } from "../../utils/useFinancialMetrics";
import { useCashFlow } from "../contexts/CashFlowContext";

interface Insight {
  titulo: string;
  resumo: string;
  alerta: string | null;
  sugestoes: string[];
  humor: "positivo" | "neutro" | "alerta";
  geradoEm: string;
}

function getCacheKey(userId: string): string {
  const today = new Date().toISOString().split("T")[0];
  return `ai_insight_${userId}_${today}`;
}

function loadFromCache(userId: string): Insight | null {
  try {
    const raw = localStorage.getItem(getCacheKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as Insight;
  } catch {
    return null;
  }
}

function saveToCache(userId: string, insight: Insight) {
  try {
    localStorage.setItem(getCacheKey(userId), JSON.stringify(insight));
  } catch {}
}

const HUMOR_CONFIG = {
  positivo: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    icon: TrendingUp,
    iconColor: "text-emerald-600",
    dot: "bg-emerald-400",
  },
  neutro: {
    border: "border-[#0E3B2E]/15",
    bg: "bg-[#F4EFE6]",
    badge: "bg-[#0E3B2E]/10 text-[#0E3B2E]",
    icon: Sparkles,
    iconColor: "text-[#0E3B2E]",
    dot: "bg-[#7FD19F]",
  },
  alerta: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    dot: "bg-amber-400",
  },
};

export default function AIInsightCard() {
  const { user } = useAuth();
  const { transactions } = useCashFlow();
  const {
    saldoAtual,
    monthReceitas,
    monthDespesas,
    monthLucro,
    receitasGrowthPct,
    despesasGrowthPct,
    loading: metricsLoading,
  } = useFinancialMetrics();

  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = useCallback(async (force = false) => {
    if (!user?.id || metricsLoading) return;

    // Usar cache se não forçar atualização
    if (!force) {
      const cached = loadFromCache(user.id);
      if (cached) {
        setInsight(cached);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_URL}/daily-insight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saldoAtual,
          monthReceitas,
          monthDespesas,
          monthLucro,
          receitasGrowthPct,
          despesasGrowthPct,
          totalTransacoes: transactions.length,
          userName: user.name?.split(" ")[0] || "usuário",
        }),
      });

      if (!res.ok) throw new Error("Erro ao gerar insight");

      const data: Insight = await res.json();
      setInsight(data);
      saveToCache(user.id, data);
    } catch (err: any) {
      setError("Não foi possível gerar o insight agora.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, metricsLoading, saldoAtual, monthReceitas, monthDespesas, monthLucro, receitasGrowthPct, despesasGrowthPct, transactions.length]);

  useEffect(() => {
    if (!metricsLoading) {
      fetchInsight();
    }
  }, [metricsLoading]);

  const cfg = HUMOR_CONFIG[insight?.humor ?? "neutro"];
  const Icon = cfg.icon;

  if (loading || metricsLoading) {
    return (
      <div className="rounded-2xl border border-[rgba(20,18,15,0.13)] bg-[#EBE4D6] p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[rgba(20,18,15,0.1)]" />
          <div className="h-4 w-32 bg-[rgba(20,18,15,0.1)] rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-[rgba(20,18,15,0.08)] rounded" />
          <div className="h-3 w-4/5 bg-[rgba(20,18,15,0.08)] rounded" />
          <div className="h-3 w-3/5 bg-[rgba(20,18,15,0.08)] rounded" />
        </div>
      </div>
    );
  }

  if (error && !insight) {
    return (
      <div className="rounded-2xl border border-[rgba(20,18,15,0.13)] bg-[#EBE4D6] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0E3B2E]/50 text-sm">
            <Sparkles className="w-4 h-4" />
            Análise IA indisponível
          </div>
          <button
            onClick={() => fetchInsight(true)}
            className="text-xs text-[#0E3B2E]/60 hover:text-[#0E3B2E] flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!insight) return null;

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5 space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0E3B2E] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#7FD19F]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0E3B2E]/50 uppercase tracking-wide">Análise IA</p>
            <p className="text-sm font-bold text-[#0E3B2E] leading-tight">{insight.titulo}</p>
          </div>
        </div>
        <button
          onClick={() => fetchInsight(true)}
          disabled={loading}
          title="Atualizar análise"
          className="text-[#0E3B2E]/40 hover:text-[#0E3B2E] transition-colors p-1 rounded-lg hover:bg-[#0E3B2E]/5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Resumo */}
      <p className="text-sm text-[#0E3B2E]/70 leading-relaxed">{insight.resumo}</p>

      {/* Alerta */}
      {insight.alerta && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-100 border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{insight.alerta}</p>
        </div>
      )}

      {/* Sugestões */}
      {insight.sugestoes.length > 0 && (
        <div className="space-y-1.5">
          {insight.sugestoes.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0 mt-1.5`} />
              <p className="text-xs text-[#0E3B2E]/65 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <p className="text-[10px] text-[#0E3B2E]/30">
        Atualizado hoje · Gerado por IA com base nos seus dados
      </p>
    </div>
  );
}
