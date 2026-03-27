import { useNavigate } from "react-router";
import {
  ArrowRightLeft,
  Tag,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  TrendingDown,
  Lock,
  Crown,
  Wallet,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useCashFlow } from "../contexts/CashFlowContext";

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { summary, insights, getLimitStatus } = useCashFlow();
  const limitStatus = getLimitStatus();

  const tools = [
    {
      id: "fluxo",
      icon: Wallet,
      title: "Fluxo de Caixa",
      description: "Registre entradas e saídas e visualize a saúde financeira do seu negócio",
      accent: "#2DDB81",
      stats: user?.plan === "pro" ? "Ilimitado" : `${limitStatus.used}/${limitStatus.limit} este mês`,
      path: "/app",
      isPro: false,
      isLocked: false
    },
    {
      id: "mei-me",
      icon: ArrowRightLeft,
      title: "Simulador MEI → ME",
      description: "Compare impostos e descubra quando migrar do MEI",
      accent: "#28A263",
      stats: "Economia média: R$ 3.480/ano",
      path: "/app/mei-me",
      isPro: false,
      isLocked: false
    },
    {
      id: "preco",
      icon: Tag,
      title: "Simulador de Preço Ideal",
      description: "Calcule o preço perfeito considerando custos e margem",
      accent: "#C0F497",
      stats: "Margem ideal: 40-60%",
      path: "/app/preco",
      isPro: true,
      isLocked: user?.plan !== "pro"
    },
    {
      id: "lucro",
      icon: TrendingUp,
      title: "Simulador de Lucro",
      description: "Projete receitas, custos e descubra seu ponto de equilíbrio",
      accent: "#3AFF99",
      stats: "Break-even em 6 meses",
      path: "/app/lucro",
      isPro: true,
      isLocked: user?.plan !== "pro"
    },
    {
      id: "propostas",
      icon: FileText,
      title: "Gerador de Propostas",
      description: "Crie propostas comerciais profissionais em minutos",
      accent: "#2DDB81",
      stats: user?.plan === "pro" ? "Ilimitado" : `${user?.proposalUsageToday || 0}/2 hoje`,
      path: "/app/propostas",
      isPro: false,
      isLocked: false,
    }
  ];

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

  const quickMetrics = [
    {
      label: "Lucro do mês",
      value: fmt(summary.lucro),
      trend: summary.lucro >= 0 ? "up" as const : "down" as const,
      color: summary.lucro >= 0 ? "#2DDB81" : "#FF4F3D",
      sub: summary.lucro >= 0 ? "positivo" : "negativo"
    },
    {
      label: "Margem de lucro",
      value: `${summary.margemLucro.toFixed(1)}%`,
      trend: summary.margemLucro >= 20 ? "up" as const : "down" as const,
      color: summary.margemLucro >= 20 ? "#28A263" : "#FF4F3D",
      sub: summary.margemLucro >= 20 ? "saudável" : "baixa"
    },
    {
      label: "Total de entradas",
      value: fmt(summary.totalEntradas),
      trend: "up" as const,
      color: "#2DDB81",
      sub: "receita total"
    },
    {
      label: "Lançamentos",
      value: user?.plan === "pro" ? `${limitStatus.used}` : `${limitStatus.used}/${limitStatus.limit}`,
      trend: limitStatus.percentage > 80 ? "warning" as const : "up" as const,
      color: limitStatus.percentage > 80 ? "#FF973E" : "#28A263",
      sub: user?.plan === "pro" ? "ilimitado" : limitStatus.percentage > 80 ? "Atenção" : "disponível"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          Visão Geral do Negócio
        </h1>
        <p className="text-[#A1A1A1]">
          Acompanhe seus indicadores e acesse ferramentas essenciais
        </p>
      </div>

      {/* Alerts */}
      {insights.length > 0 && (
        <div className="grid gap-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`flex items-start gap-3 p-4 rounded-2xl border ${
                insight.tipo === "alerta"
                  ? "bg-red-500/10 border-red-500/20"
                  : insight.tipo === "sucesso"
                  ? "bg-[#28A263]/10 border-[#28A263]/20"
                  : "bg-blue-500/10 border-blue-500/20"
              }`}
            >
              {insight.tipo === "sucesso" ? (
                <CheckCircle className="h-5 w-5 text-[#2DDB81] flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  insight.tipo === "alerta" ? "text-red-400" : "text-blue-400"
                }`} />
              )}
              <p className={`text-sm ${
                insight.tipo === "alerta" ? "text-red-300" :
                insight.tipo === "sucesso" ? "text-[#C0F497]" : "text-blue-300"
              }`}>
                <span className="mr-2">{insight.icone}</span>
                {insight.mensagem}
                {insight.id === "limite-mei" && (
                  <button
                    className="ml-2 font-bold underline"
                    onClick={() => navigate("/app/mei-me")}
                  >
                    Simular agora →
                  </button>
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickMetrics.map((metric, index) => (
          <div key={index} className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5 hover:border-[#28A263]/20 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm text-[#A1A1A1] font-medium">{metric.label}</span>
              {metric.trend === "up" && <TrendingUp className="w-4 h-4" style={{ color: metric.color }} />}
              {metric.trend === "down" && <TrendingDown className="w-4 h-4 text-[#FF4F3D]" />}
              {metric.trend === "warning" && <AlertCircle className="w-4 h-4 text-[#FF973E]" />}
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: metric.color }}>
              {metric.value}
            </div>
            <div className="text-xs text-[#686F6F]">{metric.sub}</div>
          </div>
        ))}
      </div>

      {/* Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            Ferramentas Disponíveis
          </h2>
          <button
            className="text-sm text-[#2DDB81] border border-white/20 rounded-full px-4 py-2 hover:bg-white/5 transition-colors"
            onClick={() => navigate("/app/mei-me")}
          >
            Ver todas
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const handleClick = () => {
              if (tool.isLocked) navigate("/checkout");
              else navigate(tool.path);
            };

            return (
              <div key={tool.id} className="relative">
                <div
                  className={`p-6 bg-[#1D1D1D] rounded-2xl border border-white/5 transition-all duration-300 cursor-pointer group ${
                    tool.isLocked
                      ? "opacity-60"
                      : "hover:border-[#28A263]/30 hover:bg-[#1B1B1B]"
                  }`}
                  onClick={handleClick}
                >
                  {tool.isPro && (
                    <span className="absolute top-4 right-4 text-[9px] px-2 py-1 bg-[#28A263]/20 text-[#2DDB81] rounded-full font-semibold flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5" /> PRO
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${tool.accent}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: tool.accent }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white mb-1 group-hover:text-[#C0F497] transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-[#686F6F] text-sm mb-3 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#5F6868] font-medium">
                          {tool.stats}
                        </span>
                        {!tool.isLocked && (
                          <ArrowRight className="w-4 h-4 text-[#28A263] group-hover:translate-x-1 transition-transform" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lock overlay */}
                  {tool.isLocked && (
                    <div className="absolute inset-0 bg-[#141414]/70 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm">
                      <Lock className="w-10 h-10 text-[#A1A1A1] mb-3" />
                      <p className="text-white font-bold text-sm mb-2">Disponível no PRO</p>
                      <Button
                        size="sm"
                        className="bg-[#28A263] hover:bg-[#2DDB81] text-white text-xs rounded-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/checkout");
                        }}
                      >
                        <Crown className="w-3 h-3 mr-1" /> Ver Planos
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-8 bg-[#1B1B1B] rounded-2xl border border-white/5">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-white mb-2">Análise Completa</h3>
            <p className="text-sm text-[#A1A1A1]">
              Combine todas as ferramentas para ter uma visão 360° do seu negócio
            </p>
          </div>
          <div>
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-white mb-2">Decisões Rápidas</h3>
            <p className="text-sm text-[#A1A1A1]">
              Resultados em tempo real para tomar decisões com confiança
            </p>
          </div>
          <div>
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-white mb-2">Metas Claras</h3>
            <p className="text-sm text-[#A1A1A1]">
              Entenda exatamente o que precisa fazer para crescer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
