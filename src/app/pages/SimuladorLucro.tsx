import { useState } from "react";
import { TrendingUp, AlertCircle, ArrowRight, Info, Lock, Crown } from "lucide-react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
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
          <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Disponível no plano PRO</h2>
          <p className="text-slate-600 mb-6">
            O Simulador de Lucro está disponível apenas para assinantes PRO.
            Projete receitas, custos e descubra seu ponto de equilíbrio.
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
  const [receitaMensal, setReceitaMensal] = useState(10000);
  const [custosFixos, setCustosFixos] = useState(2500);
  const [custosVariaveis, setCustosVariaveis] = useState(3000);
  const [cenario, setCenario] = useState<"pessimista" | "realista" | "otimista">("realista");

  const calcularLucro = () => {
    const custoTotal = custosFixos + custosVariaveis;
    const lucroLiquido = receitaMensal - custoTotal;
    const margemLucro = (lucroLiquido / receitaMensal) * 100;
    const breakEven = custosFixos / (1 - (custosVariaveis / receitaMensal));
    
    return {
      lucroLiquido,
      margemLucro,
      breakEven,
      custoTotal
    };
  };

  const resultado = calcularLucro();

  const gerarProjecao = () => {
    const data = [];
    const multiplicadores = {
      pessimista: 0.9,
      realista: 1.1,
      otimista: 1.25
    };

    for (let mes = 1; mes <= 12; mes++) {
      const crescimento = Math.pow(multiplicadores[cenario], mes / 3);
      const receita = receitaMensal * crescimento;
      const custos = (custosFixos + custosVariaveis) * (cenario === "pessimista" ? 1.05 : 1.02) ** (mes / 3);
      const lucro = receita - custos;
      
      data.push({
        mes: `Mês ${mes}`,
        receita: receita,
        custos: custos,
        lucro: lucro,
        lucroAcumulado: data.reduce((acc, item) => acc + item.lucro, lucro)
      });
    }
    
    return data;
  };

  const projecaoData = gerarProjecao();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getMargemStatus = () => {
    if (resultado.margemLucro < 10) return { label: "Crítica", color: "text-red-600", bg: "bg-red-50 border-red-300" };
    if (resultado.margemLucro < 20) return { label: "Baixa", color: "text-orange-600", bg: "bg-orange-50 border-orange-300" };
    if (resultado.margemLucro < 30) return { label: "Razoável", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-300" };
    return { label: "Excelente", color: "text-green-600", bg: "bg-green-50 border-green-300" };
  };

  const status = getMargemStatus();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          Simulador de Lucro
        </h1>
        <p className="text-lg text-slate-600">
          Calcule seu lucro líquido, descubra o ponto de equilíbrio e projete cenários futuros
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="bg-blue-50 border-2 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Dica:</strong> Uma margem de lucro saudável está entre <strong>20-40%</strong>. 
          O ponto de equilíbrio indica quanto você precisa faturar para cobrir todos os custos.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <Card className="p-6 border-2 border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Dados Financeiros</h3>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="receita" className="text-base font-semibold text-slate-900 mb-3 block">
                Receita mensal
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">R$</span>
                <Input
                  id="receita"
                  type="number"
                  value={receitaMensal}
                  onChange={(e) => setReceitaMensal(Number(e.target.value))}
                  className="pl-12 text-xl font-bold h-12"
                  min={0}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fixos" className="text-base font-semibold text-slate-900 mb-3 block">
                Custos fixos
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">R$</span>
                <Input
                  id="fixos"
                  type="number"
                  value={custosFixos}
                  onChange={(e) => setCustosFixos(Number(e.target.value))}
                  className="pl-12"
                  min={0}
                />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Aluguel, salários, internet, etc
              </p>
            </div>

            <div>
              <Label htmlFor="variaveis" className="text-base font-semibold text-slate-900 mb-3 block">
                Custos variáveis
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">R$</span>
                <Input
                  id="variaveis"
                  type="number"
                  value={custosVariaveis}
                  onChange={(e) => setCustosVariaveis(Number(e.target.value))}
                  className="pl-12"
                  min={0}
                />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Matéria-prima, comissões, frete, etc
              </p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Custo Total</span>
                <span className="font-bold text-slate-900 text-lg">{formatCurrency(resultado.custoTotal)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className={`p-6 border-2 ${resultado.lucroLiquido > 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
              <div className="text-sm text-slate-600 mb-2">Lucro Líquido</div>
              <div className={`text-3xl font-bold ${resultado.lucroLiquido > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(resultado.lucroLiquido)}
              </div>
              <div className="text-xs text-slate-600 mt-2">por mês</div>
            </Card>

            <Card className={`p-6 border-2 ${status.bg}`}>
              <div className="text-sm text-slate-600 mb-2">Margem de Lucro</div>
              <div className={`text-3xl font-bold ${status.color}`}>
                {resultado.margemLucro.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-600 mt-2">{status.label}</div>
            </Card>

            <Card className="p-6 border-2 bg-blue-50 border-blue-300">
              <div className="text-sm text-slate-600 mb-2">Break-even</div>
              <div className="text-3xl font-bold text-blue-700">
                {formatCurrency(resultado.breakEven)}
              </div>
              <div className="text-xs text-slate-600 mt-2">faturamento mínimo</div>
            </Card>
          </div>

          {/* Visual Breakdown */}
          <Card className="p-6 border-2 border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Composição Financeira</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Receita</span>
                  <span className="font-bold text-slate-900">{formatCurrency(receitaMensal)}</span>
                </div>
                <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Custos Fixos</span>
                  <span className="font-bold text-slate-900">{formatCurrency(custosFixos)}</span>
                </div>
                <div className="h-3 bg-red-400 rounded-full" style={{ width: `${(custosFixos / receitaMensal) * 100}%` }} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Custos Variáveis</span>
                  <span className="font-bold text-slate-900">{formatCurrency(custosVariaveis)}</span>
                </div>
                <div className="h-3 bg-orange-400 rounded-full" style={{ width: `${(custosVariaveis / receitaMensal) * 100}%` }} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Lucro</span>
                  <span className="font-bold text-green-700">{formatCurrency(resultado.lucroLiquido)}</span>
                </div>
                <div className="h-3 bg-green-500 rounded-full" style={{ width: `${resultado.margemLucro}%` }} />
              </div>
            </div>
          </Card>

          {/* Alerts */}
          {resultado.margemLucro < 15 && (
            <Alert className="bg-red-50 border-2 border-red-300">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-900">
                <strong>Atenção!</strong> Sua margem de lucro está muito baixa. 
                Considere reduzir custos ou aumentar preços.
              </AlertDescription>
            </Alert>
          )}

          {resultado.lucroLiquido < 0 && (
            <Alert className="bg-red-50 border-2 border-red-300">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-900">
                <strong>Prejuízo detectado!</strong> Seus custos estão maiores que sua receita. 
                É urgente reavaliar sua operação.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Projections */}
      <Card className="p-8 border-2 border-slate-200">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Projeção de Cenários</h3>
          
          <Tabs value={cenario} onValueChange={(v) => setCenario(v as any)}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="pessimista">Pessimista</TabsTrigger>
              <TabsTrigger value="realista">Realista</TabsTrigger>
              <TabsTrigger value="otimista">Otimista</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Evolução Mensal</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={projecaoData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area type="monotone" dataKey="receita" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReceita)" name="Receita" />
                <Area type="monotone" dataKey="lucro" stroke="#10b981" fillOpacity={1} fill="url(#colorLucro)" name="Lucro" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Lucro Acumulado</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projecaoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="lucroAcumulado" fill="#10b981" name="Lucro Acumulado" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border-2 border-slate-200">
          <div className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(projecaoData[11]?.lucroAcumulado || 0)}
            </div>
            <div className="text-sm text-slate-600 mt-1">Lucro acumulado (12 meses)</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(projecaoData[11]?.receita || 0)}
            </div>
            <div className="text-sm text-slate-600 mt-1">Faturamento projetado (mês 12)</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-slate-900">
              {((projecaoData[11]?.lucro || 0) / (projecaoData[11]?.receita || 1) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600 mt-1">Margem projetada (mês 12)</div>
          </div>
        </div>
      </Card>

      <Button 
        size="lg"
        className="w-full max-w-md mx-auto flex bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white h-14 text-lg"
      >
        Salvar Projeção
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );
}
