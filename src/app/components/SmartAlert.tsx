import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { SimulationResult } from "./SimulatorSection";

interface SmartAlertProps {
  result: SimulationResult | null;
}

export function SmartAlert({ result }: SmartAlertProps) {
  if (!result) return null;

  const limiteMEI = 6750; // R$ 6.750/mês
  const percentualLimite = (result.faturamento / limiteMEI) * 100;

  const getAlertConfig = () => {
    // Caso 1: Muito próximo ou acima do limite
    if (result.faturamento > limiteMEI) {
      return {
        variant: "destructive" as const,
        icon: AlertTriangle,
        title: "⚠️ Você ultrapassou o limite do MEI!",
        description: `Seu faturamento de R$ ${result.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} está acima do limite mensal de R$ 6.750. Você precisa migrar para ME imediatamente para evitar problemas com a Receita Federal.`,
        bgColor: "bg-red-50 border-red-300"
      };
    }

    if (percentualLimite > 85) {
      return {
        variant: "default" as const,
        icon: AlertTriangle,
        title: "⚠️ Atenção: Você está próximo do limite do MEI",
        description: `Seu faturamento atual representa ${percentualLimite.toFixed(0)}% do limite mensal. Considere planejar a transição para ME nos próximos meses para evitar surpresas.`,
        bgColor: "bg-orange-50 border-orange-300"
      };
    }

    // Caso 2: ME é mais vantajoso
    if (result.recomendacao === "ME") {
      const economiaAnual = Math.abs(result.economia) * 12;
      return {
        variant: "default" as const,
        icon: CheckCircle,
        title: "✅ Vale a pena migrar para ME!",
        description: `Com seu faturamento atual, você economizaria R$ ${Math.abs(result.economia).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por mês, totalizando R$ ${economiaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por ano como Microempresa.`,
        bgColor: "bg-green-50 border-green-300"
      };
    }

    // Caso 3: MEI ainda é vantajoso
    return {
      variant: "default" as const,
      icon: Info,
      title: "💡 MEI ainda é a melhor opção",
      description: `Para seu faturamento atual, o MEI continua sendo mais vantajoso. Você está em ${percentualLimite.toFixed(0)}% do limite. Continue monitorando seu crescimento.`,
      bgColor: "bg-blue-50 border-blue-300"
    };
  };

  const config = getAlertConfig();
  const Icon = config.icon;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <Alert className={`${config.bgColor} border-2 p-6`}>
          <Icon className="h-6 w-6" />
          <AlertTitle className="text-xl font-bold mb-2 ml-8">
            {config.title}
          </AlertTitle>
          <AlertDescription className="text-base ml-8 text-slate-700">
            {config.description}
          </AlertDescription>
        </Alert>

        {/* Barra de progresso do limite MEI */}
        {result.faturamento <= limiteMEI && (
          <div className="mt-6 rounded-xl p-6 border-2 border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-700">
                Limite do MEI
              </span>
              <span className="text-sm font-bold text-purple-600">
                {percentualLimite.toFixed(1)}%
              </span>
            </div>
            
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentualLimite > 85
                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                    : percentualLimite > 70
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-green-500 to-blue-500'
                }`}
                style={{ width: `${Math.min(percentualLimite, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-slate-600 mt-2">
              <span>R$ 0</span>
              <span className="font-medium">
                R$ {result.faturamento.toLocaleString('pt-BR')} / R$ {limiteMEI.toLocaleString('pt-BR')}
              </span>
              <span>Limite mensal</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
