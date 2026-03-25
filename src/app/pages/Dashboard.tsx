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
  DollarSign,
  Lock,
  Crown,
  Zap
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { useCashFlow } from "../contexts/CashFlowContext";

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { summary, insights, getLimitStatus } = useCashFlow();
  const limitStatus = getLimitStatus();

  const tools = [
    {
      id: "mei-me",
      icon: ArrowRightLeft,
      title: "Simulador MEI → ME",
      description: "Compare impostos e descubra quando vale a pena migrar do MEI para Microempresa",
      color: "from-purple-600 to-blue-600",
      stats: "Economia média: R$ 3.480/ano",
      path: "/app/mei-me",
      isPro: false,
      isLocked: false
    },
    {
      id: "preco",
      icon: Tag,
      title: "Simulador de Preço Ideal",
      description: "Calcule o preço perfeito considerando custos, margem e mercado",
      color: "from-green-600 to-emerald-600",
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
      color: "from-blue-600 to-cyan-600",
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
      color: "from-orange-600 to-red-600",
      stats: user?.plan === "pro" ? "Ilimitado" : `${user?.proposalUsageToday || 0}/2 hoje`,
      path: "/app/propostas",
      isPro: false,
      isLocked: false,
      hasUsageLimit: user?.plan !== "pro"
    }
  ];

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

  const quickMetrics = [
    {
      label: "Lucro do mês",
      value: fmt(summary.lucro),
      change: summary.lucro >= 0 ? "positivo" : "negativo",
      trend: summary.lucro >= 0 ? "up" as const : "down" as const,
      color: summary.lucro >= 0 ? "text-green-600" : "text-red-600"
    },
    {
      label: "Margem de lucro",
      value: `${summary.margemLucro.toFixed(1)}%`,
      change: summary.margemLucro >= 20 ? "saudável" : "baixa",
      trend: summary.margemLucro >= 20 ? "up" as const : "down" as const,
      color: summary.margemLucro >= 20 ? "text-blue-600" : "text-red-600"
    },
    {
      label: "Total de entradas",
      value: fmt(summary.totalEntradas),
      change: "receita total",
      trend: "up" as const,
      color: "text-green-600"
    },
    {
      label: "Lançamentos este mês",
      value: user?.plan === "pro" ? `${limitStatus.used}` : `${limitStatus.used}/${limitStatus.limit}`,
      change: user?.plan === "pro" ? "ilimitado" : limitStatus.percentage > 80 ? "Atenção" : "disponível",
      trend: limitStatus.percentage > 80 ? "warning" as const : "up" as const,
      color: limitStatus.percentage > 80 ? "text-orange-600" : "text-purple-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Visão Geral do Negócio
        </h1>
        <p className="text-lg text-slate-600">
          Acompanhe seus indicadores e acesse ferramentas essenciais
        </p>
      </div>

      {/* Alerts — insights reais do CashFlowContext */}
      {insights.length > 0 && (
        <div className="grid gap-4">
          {insights.map((insight) => (
            <Alert
              key={insight.id}
              className={`border-2 ${
                insight.tipo === "alerta"
                  ? "bg-red-50 border-red-300"
                  : insight.tipo === "sucesso"
                  ? "bg-green-50 border-green-300"
                  : "bg-blue-50 border-blue-300"
              }`}
            >
              {insight.tipo === "sucesso" ? (
                <CheckCircle className={`h-5 w-5 text-green-600`} />
              ) : (
                <AlertCircle className={`h-5 w-5 ${
                  insight.tipo === "alerta" ? "text-red-600" : "text-blue-600"
                }`} />
              )}
              <AlertDescription className={
                insight.tipo === "alerta"
                  ? "text-red-900"
                  : insight.tipo === "sucesso"
                  ? "text-green-900"
                  : "text-blue-900"
              }>
                <span className="mr-2">{insight.icone}</span>
                {insight.mensagem}
                {insight.id === "limite-mei" && (
                  <Button
                    variant="link"
                    className="text-blue-900 font-bold p-0 h-auto ml-2"
                    onClick={() => navigate("/app/mei-me")}
                  >
                    Simular agora →
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickMetrics.map((metric, index) => (
          <Card key={index} className="p-6 border-2 border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm text-slate-600 font-medium">{metric.label}</span>
              {metric.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
              {metric.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600" />}
              {metric.trend === "warning" && <AlertCircle className="w-4 h-4 text-orange-600" />}
            </div>
            <div className={`text-3xl font-bold ${metric.color} mb-1`}>
              {metric.value}
            </div>
            <div className={`text-sm ${
              metric.trend === "up" ? "text-green-600" :
              metric.trend === "down" ? "text-red-600" :
              "text-orange-600"
            }`}>
              {metric.change}
            </div>
          </Card>
        ))}
      </div>

      {/* Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Ferramentas Disponíveis
          </h2>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            <DollarSign className="w-4 h-4 mr-2" />
            Nova Simulação
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const handleClick = () => {
              if (tool.isLocked) {
                navigate("/pricing");
              } else {
                navigate(tool.path);
              }
            };

            return (
              <div key={tool.id} className="relative">
                <Card
                  className={`p-8 border-2 transition-all duration-300 cursor-pointer group ${
                    tool.isLocked 
                      ? "border-slate-300 opacity-75" 
                      : "border-slate-200 hover:border-purple-300 hover:shadow-xl"
                  }`}
                  onClick={handleClick}
                >
                  {/* PRO Badge */}
                  {tool.isPro && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                      <Crown className="w-3 h-3 mr-1" />
                      PRO
                    </Badge>
                  )}

                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg flex-shrink-0 ${
                      tool.isLocked ? "opacity-50" : "group-hover:scale-110"
                    } transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-xl font-bold text-slate-900 mb-2 ${
                        tool.isLocked ? "" : "group-hover:text-purple-600"
                      } transition-colors`}>
                        {tool.title}
                      </h3>
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 font-medium">
                          {tool.stats}
                        </span>
                        {!tool.isLocked && (
                          <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lock Overlay */}
                  {tool.isLocked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-lg flex flex-col items-center justify-center backdrop-blur-sm">
                      <Lock className="w-12 h-12 text-white mb-3" />
                      <p className="text-white font-bold text-lg mb-2">Disponível no plano PRO</p>
                      <Button
                        size="sm"
                        className="bg-white text-purple-600 hover:bg-slate-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/pricing");
                        }}
                      >
                        <Crown className="w-4 h-4 mr-1" />
                        Ver Planos
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-8 bg-gradient-to-br from-slate-50 to-purple-50/30 border-2 border-slate-200">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-slate-900 mb-2">Análise Completa</h3>
            <p className="text-sm text-slate-600">
              Combine todas as ferramentas para ter uma visão 360° do seu negócio
            </p>
          </div>
          
          <div>
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-slate-900 mb-2">Decisões Rápidas</h3>
            <p className="text-sm text-slate-600">
              Resultados em tempo real para você tomar decisões com confiança
            </p>
          </div>
          
          <div>
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-slate-900 mb-2">Metas Claras</h3>
            <p className="text-sm text-slate-600">
              Entenda exatamente o que precisa fazer para crescer
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}