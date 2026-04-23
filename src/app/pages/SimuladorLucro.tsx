import { useState } from "react";
import { TrendingUp, AlertCircle, ArrowRight, Info, Lock, Crown, BarChart3, Target } from "lucide-react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export function SimuladorLucro() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.plan !== "pro") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-[rgba(0,21,41,0.6)]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0E3B2E] mb-3">Disponível no plano Premium</h2>
          <p className="text-[rgba(0,21,41,0.6)] mb-6">
            O Simulador de Lucro está disponível apenas para assinantes Premium.
            Projete receitas, custos e descubra seu ponto de equilíbrio.
          </p>
          <Button
            size="lg"
            className="bg-[#7FD19F] hover:bg-[#1F8C50] text-white rounded-xl"
            onClick={() => navigate("/checkout")}
          >
            <Crown className="w-4 h-4 mr-2" />
            Ver Planos Premium
          </Button>
        </div>
      </div>
    );
  }

  const [receitaMensal, setReceitaMensal] = useState(10000);
  const [custosFixos, setCustosFixos] = useState(2500);
  const [custosVariaveis, setCustosVariaveis] = useState(3000);
  const [cenario, setCenario] = useState<"pessimista" | "realista" | "otimista">("realista");

  const calcularLucro = () => {
    const custoTotal = custosFixos + custosVariaveis;
    const lucroLiquido = receitaMensal - custoTotal;
    const margemLucro = (lucroLiquido / receitaMensal) * 100;
    const breakEven = custosFixos / (1 - (custosVariaveis / receitaMensal));
    return { lucroLiquido, margemLucro, breakEven, custoTotal };
  };

  const resultado = calcularLucro();

  const gerarProjecao = () => {
    const data = [];
    const multiplicadores = { pessimista: 0.9, realista: 1.1, otimista: 1.25 };

    for (let mes = 1; mes <= 12; mes++) {
      const crescimento = Math.pow(multiplicadores[cenario], mes / 3);
      const receita = receitaMensal * crescimento;
      const custos = (custosFixos + custosVariaveis) * (cenario === "pessimista" ? 1.05 : 1.02) ** (mes / 3);
      const lucro = receita - custos;
      data.push({
        mes: `Mês ${mes}`,
        receita,
        custos,
        lucro,
        lucroAcumulado: data.reduce((acc, item) => acc + item.lucro, lucro)
      });
    }
    return data;
  };

  const projecaoData = gerarProjecao();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(value);

  const getMargemStatus = () => {
    if (resultado.margemLucro < 10) return { label: "Crítica", color: "text-[#FF4F3D]" };
    if (resultado.margemLucro < 20) return { label: "Baixa", color: "text-[#FF973E]" };
    if (resultado.margemLucro < 30) return { label: "Razoável", color: "text-yellow-400" };
    return { label: "Excelente", color: "text-[#2DDB81]" };
  };

  const status = getMargemStatus();

  const inputClass = "bg-white border-[rgba(0,0,0,0.1)] text-[#0E3B2E] placeholder:text-[rgba(0,21,41,0.5)] rounded-xl focus:border-[#7FD19F]";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[rgba(0,0,0,0.1)] px-4 sm:px-6 py-6 sm:py-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0E3B2E]">Simulador de Lucro</h1>
              <p className="text-[rgba(0,21,41,0.6)] mt-2">
                Calcule seu lucro líquido, descubra o ponto de equilíbrio e projete cenários futuros
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 space-y-8">

        {/* Info Alert */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong className="text-blue-900">Dica:</strong> Uma margem de lucro saudável está entre{" "}
            <strong className="text-blue-900">20-40%</strong>. O ponto de equilíbrio indica quanto você precisa faturar para cobrir todos os custos.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="p-6 rounded-2xl border border-[rgba(0,0,0,0.1)]">
          <h3 className="text-lg font-bold text-[#0E3B2E] mb-6">Dados Financeiros</h3>

          <div className="space-y-6">
            <div>
              <Label className="text-[rgba(0,21,41,0.6)] font-medium mb-3 block">Receita mensal</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(0,21,41,0.6)] font-medium">R$</span>
                <Input
                  type="number"
                  value={receitaMensal}
                  onChange={(e) => setReceitaMensal(Number(e.target.value))}
                  className={`pl-12 text-xl font-bold h-12 ${inputClass}`}
                  min={0}
                />
              </div>
            </div>

            <div>
              <Label className="text-[rgba(0,21,41,0.6)] font-medium mb-3 block">Custos fixos</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(0,21,41,0.6)]">R$</span>
                <Input
                  type="number"
                  value={custosFixos}
                  onChange={(e) => setCustosFixos(Number(e.target.value))}
                  className={`pl-12 ${inputClass}`}
                  min={0}
                />
              </div>
              <p className="text-xs text-[rgba(0,21,41,0.5)] mt-2">Aluguel, salários, internet, etc</p>
            </div>

            <div>
              <Label className="text-[rgba(0,21,41,0.6)] font-medium mb-3 block">Custos variáveis</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(0,21,41,0.6)]">R$</span>
                <Input
                  type="number"
                  value={custosVariaveis}
                  onChange={(e) => setCustosVariaveis(Number(e.target.value))}
                  className={`pl-12 ${inputClass}`}
                  min={0}
                />
              </div>
              <p className="text-xs text-[rgba(0,21,41,0.5)] mt-2">Matéria-prima, comissões, frete, etc</p>
            </div>

            <div className="pt-4 border-t border-[rgba(0,0,0,0.1)]">
              <div className="flex justify-between">
                <span className="text-[rgba(0,21,41,0.6)] text-sm">Custo Total</span>
                <span className="font-bold text-[#0E3B2E] text-lg">{formatCurrency(resultado.custoTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-6 rounded-2xl border ${resultado.lucroLiquido > 0 ? "bg-[#7FD19F]/10 border-[#7FD19F]/20" : "bg-red-500/10 border-red-500/20"}`}>
              <div className="text-sm text-[rgba(0,21,41,0.6)] mb-2">Lucro Líquido</div>
              <div className={`text-3xl font-bold ${resultado.lucroLiquido > 0 ? "text-[#7FD19F]" : "text-red-600"}`}>
                {formatCurrency(resultado.lucroLiquido)}
              </div>
              <div className="text-xs text-[rgba(0,21,41,0.5)] mt-2">por mês</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)]">
              <div className="text-sm text-[rgba(0,21,41,0.6)] mb-2">Margem de Lucro</div>
              <div className={`text-3xl font-bold ${status.color}`}>
                {resultado.margemLucro.toFixed(1)}%
              </div>
              <div className="text-xs text-[rgba(0,21,41,0.5)] mt-2">{status.label}</div>
            </div>

            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="text-sm text-[rgba(0,21,41,0.6)] mb-2">Break-even</div>
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(resultado.breakEven)}
              </div>
              <div className="text-xs text-[rgba(0,21,41,0.5)] mt-2">faturamento mínimo</div>
            </div>
          </div>

          {/* Visual Breakdown */}
          <div className="p-6 rounded-2xl border border-[rgba(0,0,0,0.1)]">
            <h3 className="font-bold text-[#0E3B2E] mb-4">Composição Financeira</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[rgba(0,21,41,0.6)]">Receita</span>
                  <span className="font-bold text-[#0E3B2E]">{formatCurrency(receitaMensal)}</span>
                </div>
                <div className="h-2.5 bg-[#7FD19F] rounded-full" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[rgba(0,21,41,0.6)]">Custos Fixos</span>
                  <span className="font-bold text-[#0E3B2E]">{formatCurrency(custosFixos)}</span>
                </div>
                <div className="h-2.5 bg-red-600 rounded-full" style={{ width: `${(custosFixos / receitaMensal) * 100}%` }} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[rgba(0,21,41,0.6)]">Custos Variáveis</span>
                  <span className="font-bold text-[#0E3B2E]">{formatCurrency(custosVariaveis)}</span>
                </div>
                <div className="h-2.5 bg-orange-500 rounded-full" style={{ width: `${(custosVariaveis / receitaMensal) * 100}%` }} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[rgba(0,21,41,0.6)]">Lucro</span>
                  <span className="font-bold text-[#7FD19F]">{formatCurrency(resultado.lucroLiquido)}</span>
                </div>
                <div className="h-2.5 bg-[#7FD19F] rounded-full" style={{ width: `${Math.max(0, resultado.margemLucro)}%` }} />
              </div>
            </div>
          </div>

          {/* Alerts */}
          {resultado.margemLucro < 15 && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                <strong className="text-red-900">Atenção!</strong> Sua margem de lucro está muito baixa.
                Considere reduzir custos ou aumentar preços.
              </p>
            </div>
          )}

          {resultado.lucroLiquido < 0 && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                <strong className="text-red-900">Prejuízo detectado!</strong> Seus custos estão maiores que sua receita.
                É urgente reavaliar sua operação.
              </p>
            </div>
          )}
        </div>
      </div>

        {/* Projections */}
        <div className="p-8 rounded-2xl border border-[rgba(0,0,0,0.1)]">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[#0E3B2E] mb-4">Projeção de Cenários</h3>

          <Tabs value={cenario} onValueChange={(v) => setCenario(v as any)}>
            <TabsList className="bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-xl">
              <TabsTrigger value="pessimista" className="data-[state=active]:bg-[#7FD19F] data-[state=active]:text-white text-[rgba(0,21,41,0.6)] rounded-lg">Pessimista</TabsTrigger>
              <TabsTrigger value="realista" className="data-[state=active]:bg-[#7FD19F] data-[state=active]:text-white text-[rgba(0,21,41,0.6)] rounded-lg">Realista</TabsTrigger>
              <TabsTrigger value="otimista" className="data-[state=active]:bg-[#7FD19F] data-[state=active]:text-white text-[rgba(0,21,41,0.6)] rounded-lg">Otimista</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-[#0E3B2E] mb-4">Evolução Mensal</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={projecaoData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7FD19F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7FD19F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7FD19F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7FD19F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="mes" stroke="rgba(0,21,41,0.5)" tick={{ fontSize: 11, fill: "rgba(0,21,41,0.5)" }} />
                <YAxis stroke="rgba(0,21,41,0.5)" tick={{ fontSize: 11, fill: "rgba(0,21,41,0.5)" }} tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ background: "white", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", color: "#001529" }}
                />
                <Legend wrapperStyle={{ color: "rgba(0,21,41,0.6)" }} />
                <Area type="monotone" dataKey="receita" stroke="#7FD19F" fillOpacity={1} fill="url(#colorReceita)" name="Receita" />
                <Area type="monotone" dataKey="lucro" stroke="#7FD19F" fillOpacity={1} fill="url(#colorLucro)" name="Lucro" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="font-bold text-[#0E3B2E] mb-4">Lucro Acumulado</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projecaoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="mes" stroke="rgba(0,21,41,0.5)" tick={{ fontSize: 11, fill: "rgba(0,21,41,0.5)" }} />
                <YAxis stroke="rgba(0,21,41,0.5)" tick={{ fontSize: 11, fill: "rgba(0,21,41,0.5)" }} tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ background: "white", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", color: "#001529" }}
                />
                <Legend wrapperStyle={{ color: "rgba(0,21,41,0.6)" }} />
                <Bar dataKey="lucroAcumulado" fill="#7FD19F" name="Lucro Acumulado" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6 bg-[#F8F9FA] rounded-2xl p-6 border border-[rgba(0,0,0,0.1)]">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <BarChart3 className="w-8 h-8 text-[#7FD19F]" />
            </div>
            <div className="text-2xl font-bold text-[#0E3B2E]">
              {formatCurrency(projecaoData[11]?.lucroAcumulado || 0)}
            </div>
            <div className="text-sm text-[rgba(0,21,41,0.6)] mt-1">Lucro acumulado (12 meses)</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp className="w-8 h-8 text-[#7FD19F]" />
            </div>
            <div className="text-2xl font-bold text-[#0E3B2E]">
              {formatCurrency(projecaoData[11]?.receita || 0)}
            </div>
            <div className="text-sm text-[rgba(0,21,41,0.6)] mt-1">Faturamento projetado (mês 12)</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Target className="w-8 h-8 text-[#7FD19F]" />
            </div>
            <div className="text-2xl font-bold text-[#0E3B2E]">
              {((projecaoData[11]?.lucro || 0) / (projecaoData[11]?.receita || 1) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-[rgba(0,21,41,0.6)] mt-1">Margem projetada (mês 12)</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
