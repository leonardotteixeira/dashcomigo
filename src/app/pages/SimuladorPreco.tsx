import { useState } from "react";
import { Calculator, TrendingUp, Info, ArrowRight, Tag, Lock, Crown } from "lucide-react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Slider } from "../components/ui/slider";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export function SimuladorPreco() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.plan !== "pro") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Disponível no plano PRO</h2>
          <p className="text-slate-600 mb-6">
            O Simulador de Preço Ideal está disponível apenas para assinantes PRO.
            Calcule o preço perfeito para seus produtos e serviços.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            onClick={() => navigate("/pricing")}
          >
            <Crown className="w-4 h-4 mr-2" />
            Ver Planos PRO
          </Button>
        </div>
      </div>
    );
  }
  const [custo, setCusto] = useState(100);
  const [margemDesejada, setMargemDesejada] = useState(40);
  const [tempoHoras, setTempoHoras] = useState(0);
  const [valorHora, setValorHora] = useState(50);
  const [custoOperacional, setCustoOperacional] = useState(0);
  const [condicoesPagamento, setCondicoesPagamento] = useState("50-50");
  
  const calcularPreco = () => {
    const custoTotal = custo + (tempoHoras * valorHora) + custoOperacional;
    const precoIdeal = custoTotal / (1 - margemDesejada / 100);
    const lucro = precoIdeal - custoTotal;
    const margemReal = (lucro / precoIdeal) * 100;
    
    return {
      precoIdeal,
      lucro,
      margemReal,
      custoTotal
    };
  };

  const resultado = calcularPreco();
  
  const getMargemStatus = () => {
    if (margemDesejada < 30) return { label: "Atenção", color: "bg-red-100 text-red-700 border-red-300" };
    if (margemDesejada < 40) return { label: "Razoável", color: "bg-yellow-100 text-yellow-700 border-yellow-300" };
    if (margemDesejada <= 60) return { label: "Ideal", color: "bg-green-100 text-green-700 border-green-300" };
    return { label: "Alta", color: "bg-blue-100 text-blue-700 border-blue-300" };
  };

  const status = getMargemStatus();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Tag className="w-6 h-6 text-white" />
          </div>
          Simulador de Preço Ideal
        </h1>
        <p className="text-lg text-slate-600">
          Calcule o preço perfeito para seus produtos ou serviços considerando custos e margem desejada
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="bg-blue-50 border-2 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-900">
          A margem ideal para serviços é entre <strong>40-60%</strong> e para produtos físicos entre <strong>30-50%</strong>
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Card */}
        <div className="space-y-6">
          <Card className="p-6 border-2 border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Dados do Produto/Serviço</h3>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="custo" className="text-base font-semibold text-slate-900 mb-3 block">
                  Custo direto do produto/serviço
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">R$</span>
                  <Input
                    id="custo"
                    type="number"
                    value={custo}
                    onChange={(e) => setCusto(Number(e.target.value))}
                    className="pl-12 text-xl font-bold h-12"
                    min={0}
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Matéria-prima, fornecedores, insumos básicos
                </p>
              </div>

              <div>
                <Label htmlFor="tempo" className="text-base font-semibold text-slate-900 mb-3 block">
                  Tempo investido (opcional)
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-slate-600">Horas</Label>
                    <Input
                      id="tempo"
                      type="number"
                      value={tempoHoras}
                      onChange={(e) => setTempoHoras(Number(e.target.value))}
                      className="mt-1"
                      min={0}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-slate-600">Valor/hora</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-sm">R$</span>
                      <Input
                        type="number"
                        value={valorHora}
                        onChange={(e) => setValorHora(Number(e.target.value))}
                        className="pl-9"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="operacional" className="text-base font-semibold text-slate-900 mb-3 block">
                  Custos operacionais (opcional)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">R$</span>
                  <Input
                    id="operacional"
                    type="number"
                    value={custoOperacional}
                    onChange={(e) => setCustoOperacional(Number(e.target.value))}
                    className="pl-12"
                    min={0}
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Embalagem, frete, marketing, etc
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold text-slate-900">
                    Margem de lucro desejada
                  </Label>
                  <Badge className={`${status.color} border`}>
                    {status.label}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <Slider
                    value={[margemDesejada]}
                    onValueChange={(value) => setMargemDesejada(value[0])}
                    min={10}
                    max={80}
                    step={5}
                    className="flex-1"
                  />
                  <div className="w-20">
                    <Input
                      type="number"
                      value={margemDesejada}
                      onChange={(e) => setMargemDesejada(Number(e.target.value))}
                      className="text-center font-bold"
                      min={10}
                      max={80}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-slate-600 mt-2">
                  <span>10%</span>
                  <span className="font-medium text-green-600">Ideal: 40-60%</span>
                  <span>80%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Cost Breakdown */}
          <Card className="p-6 bg-slate-50 border-2 border-slate-200">
            <h4 className="font-bold text-slate-900 mb-4">Composição de Custos</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Custo direto</span>
                <span className="font-bold text-slate-900">{formatCurrency(custo)}</span>
              </div>
              {tempoHoras > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tempo ({tempoHoras}h × {formatCurrency(valorHora)})</span>
                  <span className="font-bold text-slate-900">{formatCurrency(tempoHoras * valorHora)}</span>
                </div>
              )}
              {custoOperacional > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Custos operacionais</span>
                  <span className="font-bold text-slate-900">{formatCurrency(custoOperacional)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-300">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Custo Total</span>
                  <span className="font-bold text-slate-900 text-lg">{formatCurrency(resultado.custoTotal)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Result Card */}
        <div className="space-y-6">
          <Card className="p-8 border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-bold mb-4">
                <Calculator className="w-4 h-4" />
                Preço Sugerido
              </div>
              
              <div className="text-6xl font-bold text-green-700 mb-2">
                {formatCurrency(resultado.precoIdeal)}
              </div>
              
              <p className="text-slate-600">
                Com margem de {margemDesejada}%
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border-2 border-green-200 text-center">
                <div className="text-sm text-slate-600 mb-1">Lucro por venda</div>
                <div className="text-2xl font-bold text-green-700">{formatCurrency(resultado.lucro)}</div>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-green-200 text-center">
                <div className="text-sm text-slate-600 mb-1">Margem real</div>
                <div className="text-2xl font-bold text-green-700">{resultado.margemReal.toFixed(1)}%</div>
              </div>
            </div>

            {/* Visual Margin Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700">Custo</span>
                <span className="text-slate-700">Lucro</span>
              </div>
              <div className="h-8 bg-white rounded-lg overflow-hidden flex border-2 border-green-200">
                <div 
                  className="bg-red-400 flex items-center justify-center text-white text-sm font-bold"
                  style={{ width: `${(resultado.custoTotal / resultado.precoIdeal) * 100}%` }}
                >
                  {((resultado.custoTotal / resultado.precoIdeal) * 100).toFixed(0)}%
                </div>
                <div 
                  className="bg-green-500 flex items-center justify-center text-white text-sm font-bold"
                  style={{ width: `${resultado.margemReal}%` }}
                >
                  {resultado.margemReal.toFixed(0)}%
                </div>
              </div>
            </div>
          </Card>

          {/* Insights */}
          <Card className="p-6 border-2 border-blue-200 bg-blue-50">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Análise e Recomendações
            </h4>
            
            <div className="space-y-3">
              {margemDesejada < 30 && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800 text-sm">
                    ⚠️ Margem muito baixa! Você pode estar deixando dinheiro na mesa.
                  </AlertDescription>
                </Alert>
              )}
              
              {margemDesejada >= 40 && margemDesejada <= 60 && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800 text-sm">
                    ✅ Margem ideal! Seu preço está competitivo e lucrativo.
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="text-sm text-slate-600 mb-2">Para atingir suas metas:</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>10 vendas/mês:</span>
                    <span className="font-bold text-slate-900">{formatCurrency(resultado.lucro * 10)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30 vendas/mês:</span>
                    <span className="font-bold text-slate-900">{formatCurrency(resultado.lucro * 30)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>50 vendas/mês:</span>
                    <span className="font-bold text-green-600 text-base">{formatCurrency(resultado.lucro * 50)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="text-sm font-bold text-slate-900 mb-2">💡 Dica profissional:</div>
                <p className="text-sm text-slate-700">
                  Considere criar pacotes com diferentes faixas de preço para atingir diferentes perfis de clientes.
                </p>
              </div>
            </div>
          </Card>

          <Button 
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-14 text-lg"
          >
            Salvar Simulação
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}