import { useState } from "react";
import { Calculator, TrendingUp, Info, ArrowRight, Tag, Lock, Crown } from "lucide-react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Slider } from "../components/ui/slider";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export function SimuladorPreco() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.plan !== "pro") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#1B1B1B] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-[#A1A1A1]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Disponível no plano PRO</h2>
          <p className="text-[#A1A1A1] mb-6">
            O Simulador de Preço Ideal está disponível apenas para assinantes PRO.
            Calcule o preço perfeito para seus produtos e serviços.
          </p>
          <Button
            size="lg"
            className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl"
            onClick={() => navigate("/checkout")}
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

  const calcularPreco = () => {
    const custoTotal = custo + (tempoHoras * valorHora) + custoOperacional;
    const precoIdeal = custoTotal / (1 - margemDesejada / 100);
    const lucro = precoIdeal - custoTotal;
    const margemReal = (lucro / precoIdeal) * 100;
    return { precoIdeal, lucro, margemReal, custoTotal };
  };

  const resultado = calcularPreco();

  const getMargemStatus = () => {
    if (margemDesejada < 30) return { label: "Atenção", color: "text-[#FF4F3D]", bg: "bg-[#FF4F3D]/10 border-[#FF4F3D]/20" };
    if (margemDesejada < 40) return { label: "Razoável", color: "text-[#FF973E]", bg: "bg-[#FF973E]/10 border-[#FF973E]/20" };
    if (margemDesejada <= 60) return { label: "Ideal", color: "text-[#2DDB81]", bg: "bg-[#28A263]/10 border-[#28A263]/20" };
    return { label: "Alta", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" };
  };

  const status = getMargemStatus();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const inputClass = "bg-[#141414] border-white/10 text-white placeholder:text-[#686F6F] rounded-xl focus:border-[#28A263]";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C0F497]/20 rounded-2xl flex items-center justify-center">
            <Tag className="w-6 h-6 text-[#C0F497]" />
          </div>
          Simulador de Preço Ideal
        </h1>
        <p className="text-[#A1A1A1]">
          Calcule o preço perfeito para seus produtos ou serviços considerando custos e margem desejada
        </p>
      </div>

      {/* Info Alert */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
        <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-300">
          A margem ideal para serviços é entre <strong className="text-blue-200">40-60%</strong> e para produtos físicos entre{" "}
          <strong className="text-blue-200">30-50%</strong>
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Card */}
        <div className="space-y-6">
          <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6">Dados do Produto/Serviço</h3>

            <div className="space-y-6">
              <div>
                <Label className="text-[#A1A1A1] font-medium mb-3 block">
                  Custo direto do produto/serviço
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1A1] font-medium">R$</span>
                  <Input
                    type="number"
                    value={custo}
                    onChange={(e) => setCusto(Number(e.target.value))}
                    className={`pl-12 text-xl font-bold h-12 ${inputClass}`}
                    min={0}
                  />
                </div>
                <p className="text-xs text-[#686F6F] mt-2">Matéria-prima, fornecedores, insumos básicos</p>
              </div>

              <div>
                <Label className="text-[#A1A1A1] font-medium mb-3 block">
                  Tempo investido (opcional)
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-[#686F6F] mb-1.5 block">Horas</Label>
                    <Input
                      type="number"
                      value={tempoHoras}
                      onChange={(e) => setTempoHoras(Number(e.target.value))}
                      className={inputClass}
                      min={0}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[#686F6F] mb-1.5 block">Valor/hora</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1A1] text-sm">R$</span>
                      <Input
                        type="number"
                        value={valorHora}
                        onChange={(e) => setValorHora(Number(e.target.value))}
                        className={`pl-9 ${inputClass}`}
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-[#A1A1A1] font-medium mb-3 block">
                  Custos operacionais (opcional)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1A1]">R$</span>
                  <Input
                    type="number"
                    value={custoOperacional}
                    onChange={(e) => setCustoOperacional(Number(e.target.value))}
                    className={`pl-12 ${inputClass}`}
                    min={0}
                  />
                </div>
                <p className="text-xs text-[#686F6F] mt-2">Embalagem, frete, marketing, etc</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-[#A1A1A1] font-medium">Margem de lucro desejada</Label>
                  <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
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
                  <Input
                    type="number"
                    value={margemDesejada}
                    onChange={(e) => setMargemDesejada(Number(e.target.value))}
                    className={`w-20 text-center font-bold ${inputClass}`}
                    min={10}
                    max={80}
                  />
                </div>

                <div className="flex justify-between text-xs text-[#686F6F] mt-2">
                  <span>10%</span>
                  <span className="text-[#2DDB81] font-medium">Ideal: 40-60%</span>
                  <span>80%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="p-6 bg-[#141414] rounded-2xl border border-white/5">
            <h4 className="font-bold text-white mb-4">Composição de Custos</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#A1A1A1]">Custo direto</span>
                <span className="font-bold text-white">{formatCurrency(custo)}</span>
              </div>
              {tempoHoras > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A1A1]">Tempo ({tempoHoras}h × {formatCurrency(valorHora)})</span>
                  <span className="font-bold text-white">{formatCurrency(tempoHoras * valorHora)}</span>
                </div>
              )}
              {custoOperacional > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#A1A1A1]">Custos operacionais</span>
                  <span className="font-bold text-white">{formatCurrency(custoOperacional)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-white/5">
                <div className="flex justify-between">
                  <span className="font-bold text-white">Custo Total</span>
                  <span className="font-bold text-white text-lg">{formatCurrency(resultado.custoTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="space-y-6">
          <div className="p-8 bg-[#28A263]/10 rounded-2xl border border-[#28A263]/20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#28A263]/20 text-[#2DDB81] rounded-full text-sm font-bold mb-4">
                <Calculator className="w-4 h-4" />
                Preço Sugerido
              </div>

              <div className="text-6xl font-bold text-[#2DDB81] mb-2">
                {formatCurrency(resultado.precoIdeal)}
              </div>

              <p className="text-[#A1A1A1]">Com margem de {margemDesejada}%</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#141414] rounded-xl p-4 border border-white/5 text-center">
                <div className="text-sm text-[#A1A1A1] mb-1">Lucro por venda</div>
                <div className="text-2xl font-bold text-[#2DDB81]">{formatCurrency(resultado.lucro)}</div>
              </div>
              <div className="bg-[#141414] rounded-xl p-4 border border-white/5 text-center">
                <div className="text-sm text-[#A1A1A1] mb-1">Margem real</div>
                <div className="text-2xl font-bold text-[#2DDB81]">{resultado.margemReal.toFixed(1)}%</div>
              </div>
            </div>

            {/* Visual Margin Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-[#A1A1A1]">Custo</span>
                <span className="text-[#A1A1A1]">Lucro</span>
              </div>
              <div className="h-8 bg-[#141414] rounded-lg overflow-hidden flex border border-white/5">
                <div
                  className="bg-[#FF4F3D] flex items-center justify-center text-white text-sm font-bold"
                  style={{ width: `${(resultado.custoTotal / resultado.precoIdeal) * 100}%` }}
                >
                  {((resultado.custoTotal / resultado.precoIdeal) * 100).toFixed(0)}%
                </div>
                <div
                  className="bg-[#28A263] flex items-center justify-center text-white text-sm font-bold"
                  style={{ width: `${resultado.margemReal}%` }}
                >
                  {resultado.margemReal.toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2DDB81]" />
              Análise e Recomendações
            </h4>

            <div className="space-y-3">
              {margemDesejada < 30 && (
                <div className="p-3 rounded-xl bg-[#FF4F3D]/10 border border-[#FF4F3D]/20">
                  <p className="text-sm text-red-300">
                    Margem muito baixa! Você pode estar deixando dinheiro na mesa.
                  </p>
                </div>
              )}

              {margemDesejada >= 40 && margemDesejada <= 60 && (
                <div className="p-3 rounded-xl bg-[#28A263]/10 border border-[#28A263]/20">
                  <p className="text-sm text-[#C0F497]">
                    Margem ideal! Seu preço está competitivo e lucrativo.
                  </p>
                </div>
              )}

              <div className="bg-[#141414] rounded-xl p-4 border border-white/5">
                <div className="text-sm text-[#A1A1A1] mb-3">Para atingir suas metas:</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#686F6F]">10 vendas/mês:</span>
                    <span className="font-bold text-white">{formatCurrency(resultado.lucro * 10)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#686F6F]">30 vendas/mês:</span>
                    <span className="font-bold text-white">{formatCurrency(resultado.lucro * 30)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#686F6F]">50 vendas/mês:</span>
                    <span className="font-bold text-[#2DDB81] text-base">{formatCurrency(resultado.lucro * 50)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#141414] rounded-xl p-4 border border-white/5">
                <div className="text-sm font-bold text-white mb-2">💡 Dica profissional:</div>
                <p className="text-sm text-[#A1A1A1]">
                  Considere criar pacotes com diferentes faixas de preço para atingir diferentes perfis de clientes.
                </p>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-[#28A263] hover:bg-[#2DDB81] text-white h-14 text-lg rounded-xl"
          >
            Salvar Simulação
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
