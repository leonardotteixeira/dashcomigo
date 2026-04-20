import { AlertCircle, TrendingUp, FileText, DollarSign, Clock, Lock, Zap } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useCashFlow } from "../contexts/CashFlowContext";
import { useReceivables } from "../contexts/ReceivablesContext";
import { usePayables } from "../contexts/PayablesContext";
import { useFinancialMetrics } from "../../utils/useFinancialMetrics";

export default function PrioridadesDoDia() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transactions } = useCashFlow();
  const { receivables } = useReceivables();
  const { payables } = usePayables();
  const { monthReceitas, monthDespesas, despesasGrowthPct, fmt } = useFinancialMetrics();

  const isPro = user?.plan === "pro";

  // Generate dynamic suggestions based on real data
  const generateSuggestions = () => {
    const suggestions = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Check for overdue receivables
    const overdueReceivables = receivables.filter((r) => {
      if (r.status === "recebido") return false;
      try {
        const dueDate = new Date(r.dataVencimento + "T00:00:00");
        return dueDate < today;
      } catch {
        return false;
      }
    });

    if (overdueReceivables.length > 0) {
      const totalOverdue = overdueReceivables.reduce((sum, r) => sum + r.valor, 0);
      suggestions.push({
        id: "overdue-receivables",
        title: `${overdueReceivables.length} contas a receber atrasadas`,
        subtitle: `${fmt(totalOverdue)} aguardando recebimento`,
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        iconBg: "bg-red-100",
        action: "Ver detalhes",
        onClick: () => navigate("/app/contas-a-receber"),
        priority: "high",
      });
    }

    // 2. Check expense increase
    if (despesasGrowthPct > 20) {
      suggestions.push({
        id: "expense-increase",
        title: `Despesas aumentaram ${despesasGrowthPct.toFixed(1)}% este mês`,
        subtitle: "Analise categorias para otimizar gastos",
        icon: TrendingUp,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        iconBg: "bg-orange-100",
        action: "Analisar",
        onClick: () => navigate("/app/relatorios"),
        locked: !isPro,
        proFeature: true,
        priority: "medium",
      });
    }

    // 3. Check for unpaid payables
    const unpaidPayables = payables.filter((p) => p.status !== "pago");
    if (unpaidPayables.length > 0) {
      const totalUnpaid = unpaidPayables.reduce((sum, p) => sum + p.valor, 0);
      suggestions.push({
        id: "unpaid-payables",
        title: `${unpaidPayables.length} contas a pagar pendentes`,
        subtitle: `${fmt(totalUnpaid)} em obrigações`,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        iconBg: "bg-yellow-100",
        action: "Ver detalhes",
        onClick: () => navigate("/app/contas-a-pagar"),
        priority: "high",
      });
    }

    // 4. Revenue growth opportunity
    if (monthReceitas > 0 && monthDespesas < monthReceitas * 0.7) {
      const availableForInvestment = monthReceitas - monthDespesas;
      suggestions.push({
        id: "investment-opportunity",
        title: "Sua receita cresceu — considere investir",
        subtitle: `Você tem ~${fmt(availableForInvestment)} disponível`,
        icon: DollarSign,
        color: "text-green-600",
        bgColor: "bg-green-50",
        iconBg: "bg-green-100",
        action: "Ver investimentos",
        onClick: () => navigate("/app/investimentos"),
        priority: "low",
      });
    }

    // 5. Reports not created (PRO feature)
    const hasReports = false; // This would need to be checked from context
    if (!hasReports && isPro) {
      suggestions.push({
        id: "create-report",
        title: "Crie seu primeiro relatório",
        subtitle: "Obtenha insights detalhados do seu negócio",
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        iconBg: "bg-blue-100",
        action: "Criar",
        onClick: () => navigate("/app/relatorios"),
        priority: "medium",
      });
    }

    // 6. AI Simulator suggestion (PRO only)
    if (isPro) {
      suggestions.push({
        id: "ai-simulator",
        title: "Simule cenários com IA",
        subtitle: "Teste diferentes estratégias financeiras",
        icon: Zap,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        iconBg: "bg-purple-100",
        action: "Acessar",
        onClick: () => navigate("/app/simuladores"),
        priority: "low",
      });
    }

    return suggestions.slice(0, 5); // Max 5 suggestions
  };

  const suggestions = generateSuggestions();

  if (suggestions.length === 0) {
    return null; // Don't show if no suggestions
  }

  return (
    <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-[#0E3B2E]">Prioridades do Dia</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={suggestion.id}
              onClick={suggestion.onClick}
              disabled={suggestion.locked}
              className={`w-full text-left flex items-start gap-3 p-3.5 rounded-lg border border-[rgba(20,18,15,0.13)] transition-all ${
                suggestion.locked
                  ? "opacity-60 cursor-not-allowed hover:border-[rgba(20,18,15,0.13)]"
                  : "hover:border-[#0E3B2E]/30 hover:shadow-sm cursor-pointer"
              } ${suggestion.bgColor}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${suggestion.iconBg} flex items-center justify-center mt-0.5`}>
                <Icon className={`w-5 h-5 ${suggestion.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-sm text-[#0E3B2E]">{suggestion.title}</p>
                  {suggestion.proFeature && (
                    <span className="flex-shrink-0 text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#0E3B2E]/60">{suggestion.subtitle}</p>
              </div>

              {suggestion.locked ? (
                <div className="flex-shrink-0 flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <Lock className="w-4 h-4" />
                </div>
              ) : (
                <div className="flex-shrink-0 text-xs text-[#0E3B2E] font-semibold">{suggestion.action} →</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
