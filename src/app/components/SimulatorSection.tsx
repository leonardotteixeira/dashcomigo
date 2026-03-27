import { useState } from "react";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";

export interface SimulationResult {
  faturamento: number;
  tipoAtividade: string;
  despesas: number;
  meiImposto: number;
  meImposto: number;
  meiLucro: number;
  meLucro: number;
  economia: number;
  recomendacao: "MEI" | "ME" | "Limite";
}

interface SimulatorSectionProps {
  onSimulate: (result: SimulationResult) => void;
}

export function SimulatorSection({ onSimulate }: SimulatorSectionProps) {
  const [faturamento, setFaturamento] = useState(8500);
  const [tipoAtividade, setTipoAtividade] = useState("servicos");
  const [despesas, setDespesas] = useState(2000);
  const [resultado, setResultado] = useState<SimulationResult | null>(null);

  const calcularImpostos = () => {
    const meiValorFixo = tipoAtividade === "servicos" ? 75 :
                         tipoAtividade === "comercio" ? 71 : 76;

    let aliquotaSimples = 0;

    if (tipoAtividade === "servicos") {
      if (faturamento <= 5000) aliquotaSimples = 0.06;
      else if (faturamento <= 10000) aliquotaSimples = 0.09;
      else if (faturamento <= 20000) aliquotaSimples = 0.12;
      else aliquotaSimples = 0.14;
    } else if (tipoAtividade === "comercio") {
      if (faturamento <= 5000) aliquotaSimples = 0.04;
      else if (faturamento <= 10000) aliquotaSimples = 0.06;
      else if (faturamento <= 20000) aliquotaSimples = 0.08;
      else aliquotaSimples = 0.10;
    } else {
      if (faturamento <= 5000) aliquotaSimples = 0.045;
      else if (faturamento <= 10000) aliquotaSimples = 0.07;
      else if (faturamento <= 20000) aliquotaSimples = 0.09;
      else aliquotaSimples = 0.11;
    }

    const meiImposto = meiValorFixo;
    const meImposto = faturamento * aliquotaSimples;

    const meiLucro = faturamento - despesas - meiImposto;
    const meLucro = faturamento - despesas - meImposto;

    const economia = meiImposto - meImposto;

    let recomendacao: "MEI" | "ME" | "Limite" = "MEI";
    if (faturamento > 81000 / 12) {
      recomendacao = "Limite";
    } else if (meLucro > meiLucro) {
      recomendacao = "ME";
    }

    const result: SimulationResult = {
      faturamento,
      tipoAtividade,
      despesas,
      meiImposto,
      meImposto,
      meiLucro,
      meLucro,
      economia,
      recomendacao
    };

    setResultado(result);
    onSimulate(result);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <section id="simulador" className="py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#28A263]/20 border border-[#28A263]/20 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4 text-[#2DDB81]" />
            <span className="text-[#2DDB81]">Simulador gratuito</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Compare MEI vs Microempresa
          </h2>

          <p className="text-lg text-[#A1A1A1] max-w-2xl mx-auto">
            Insira seus dados e descubra qual regime tributário é mais vantajoso para o seu negócio
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Card */}
          <div className="p-8 bg-[#1B1B1B] rounded-2xl border border-white/5">
            <div className="space-y-6">
              <div>
                <Label htmlFor="faturamento" className="text-base font-semibold text-white mb-3 block">
                  Faturamento mensal
                </Label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1A1] font-medium">
                    R$
                  </span>
                  <Input
                    id="faturamento"
                    type="number"
                    value={faturamento}
                    onChange={(e) => setFaturamento(Number(e.target.value))}
                    className="pl-12 text-2xl font-bold h-14 bg-[#141414] border-white/10 text-white rounded-xl"
                    min={0}
                    max={30000}
                  />
                </div>

                <div className="mt-4">
                  <Slider
                    value={[faturamento]}
                    onValueChange={(value) => setFaturamento(value[0])}
                    min={1000}
                    max={30000}
                    step={500}
                    className="py-4"
                  />
                </div>

                <div className="flex justify-between text-sm text-[#A1A1A1] mt-2">
                  <span>R$ 1.000</span>
                  <span className="font-medium text-[#2DDB81]">Limite MEI: R$ 6.750/mês</span>
                  <span>R$ 30.000</span>
                </div>
              </div>

              <div>
                <Label htmlFor="atividade" className="text-base font-semibold text-white mb-3 block">
                  Tipo de atividade
                </Label>
                <Select value={tipoAtividade} onValueChange={setTipoAtividade}>
                  <SelectTrigger id="atividade" className="h-12 text-base bg-[#141414] border-white/10 text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1B1B1B] border-white/10 text-white">
                    <SelectItem value="servicos">Serviços</SelectItem>
                    <SelectItem value="comercio">Comércio</SelectItem>
                    <SelectItem value="industria">Indústria</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="despesas" className="text-base font-semibold text-white mb-3 block">
                  Despesas mensais (opcional)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1A1]">
                    R$
                  </span>
                  <Input
                    id="despesas"
                    type="number"
                    value={despesas}
                    onChange={(e) => setDespesas(Number(e.target.value))}
                    className="pl-12 h-12 text-base bg-[#141414] border-white/10 text-white rounded-xl"
                    min={0}
                  />
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-[#28A263] hover:bg-[#2DDB81] text-black h-14 text-lg font-semibold rounded-xl"
                onClick={calcularImpostos}
              >
                <Calculator className="mr-2 w-5 h-5" />
                Calcular comparação
              </Button>
            </div>
          </div>

          {/* Results Card */}
          <div className="space-y-6">
            {resultado ? (
              <>
                <div className={`p-8 rounded-2xl border-2 ${
                  resultado.recomendacao === 'MEI' ? 'border-[#28A263]/50 bg-[#28A263]/10' :
                  resultado.recomendacao === 'ME' ? 'border-blue-500/50 bg-blue-500/10' :
                  'border-orange-500/50 bg-orange-500/10'
                }`}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">Resultado</h3>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                        resultado.recomendacao === 'MEI' ? 'bg-[#28A263]/20 text-[#2DDB81]' :
                        resultado.recomendacao === 'ME' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {resultado.recomendacao === 'Limite' ? '⚠️ Atenção!' : `✓ Recomendado: ${resultado.recomendacao}`}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#141414] rounded-xl p-4 border border-white/5">
                        <div className="text-sm text-[#A1A1A1] mb-1">MEI - Impostos</div>
                        <div className="text-2xl font-bold text-white">{formatCurrency(resultado.meiImposto)}</div>
                        <div className="text-xs text-[#686F6F] mt-1">por mês</div>
                      </div>

                      <div className="bg-[#141414] rounded-xl p-4 border border-white/5">
                        <div className="text-sm text-[#A1A1A1] mb-1">ME - Impostos</div>
                        <div className="text-2xl font-bold text-white">{formatCurrency(resultado.meImposto)}</div>
                        <div className="text-xs text-[#686F6F] mt-1">por mês</div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-[#A1A1A1] mb-1">MEI - Lucro líquido</div>
                          <div className="text-xl font-bold text-white">{formatCurrency(resultado.meiLucro)}</div>
                        </div>

                        <div>
                          <div className="text-sm text-[#A1A1A1] mb-1">ME - Lucro líquido</div>
                          <div className="text-xl font-bold text-white">{formatCurrency(resultado.meLucro)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#28A263] to-[#2DDB81] rounded-xl p-6 text-black">
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-6 h-6" />
                        <span className="font-semibold">
                          {resultado.economia > 0 ? 'Economia como ME' : 'Economia como MEI'}
                        </span>
                      </div>
                      <div className="text-3xl font-bold">{formatCurrency(Math.abs(resultado.economia))}/mês</div>
                      <div className="text-sm opacity-90 mt-2">
                        {formatCurrency(Math.abs(resultado.economia) * 12)} por ano
                      </div>
                    </div>
                  </div>
                </div>

                {resultado.recomendacao === 'Limite' && (
                  <div className="p-6 bg-orange-500/10 rounded-2xl border-2 border-orange-500/30">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">⚠️</div>
                      <div>
                        <h4 className="font-bold text-orange-400 mb-1">Você está próximo do limite do MEI!</h4>
                        <p className="text-sm text-orange-300">
                          O limite anual do MEI é R$ 81.000 (R$ 6.750/mês). Com esse faturamento, você deve considerar migrar para ME imediatamente.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 rounded-2xl border-2 border-dashed border-white/10 bg-white/5">
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-[#686F6F] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Preencha os dados ao lado
                  </h3>
                  <p className="text-[#A1A1A1]">
                    Os resultados aparecerão aqui após o cálculo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
