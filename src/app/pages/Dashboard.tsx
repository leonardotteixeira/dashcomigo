import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRightLeft,
  Tag,
  TrendingUp,
  TrendingDown,
  FileText,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  ArrowRight,
  Lock,
  Crown,
  Wallet,
  AlertTriangle,
  Sparkles,
  Target,
  Calendar,
  Zap,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { useAuth } from "../contexts/AuthContext";
import { useCashFlow } from "../contexts/CashFlowContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";

const MEI_LIMIT_ANNUAL = 81000;

// ── helpers ──────────────────────────────────────────────────────────────────

function buildFaturamentoData(transactions: any[]) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("pt-BR", { month: "short" });
    const valor = transactions
      .filter((t) => t.tipo === "entrada" && t.data.startsWith(key))
      .reduce((s: number, t: any) => s + t.valor, 0);
    return { mes: label, valor, projecao: undefined as number | undefined };
  });

  const values = months.map((m) => m.valor);
  const nonZero = values.filter((v) => v > 0);
  let growthRate = 0.05;
  if (nonZero.length >= 2) {
    const rates = nonZero.slice(1).map((v, i) => (v - nonZero[i]) / Math.max(nonZero[i], 1));
    growthRate = Math.max(-0.1, Math.min(0.3, rates.reduce((a, b) => a + b, 0) / rates.length));
  }

  const lastReal = months[months.length - 1].valor;
  months[months.length - 1].projecao = lastReal; // ponto de conexão

  for (let i = 1; i <= 3; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    const label = d.toLocaleDateString("pt-BR", { month: "short" });
    months.push({
      mes: label,
      valor: undefined as any,
      projecao: lastReal * Math.pow(1 + growthRate, i),
    });
  }

  return { data: months, growthRate };
}

function buildAcoes(meiPct: number, margemLucro: number, totalSaidas: number, totalEntradas: number) {
  const acoes: {
    prioridade: "alta" | "media" | "baixa";
    titulo: string;
    descricao: string;
    prazo: string;
    concluido: boolean;
    impacto: string;
    href: string;
  }[] = [];

  if (meiPct > 80) {
    acoes.push({
      prioridade: "alta",
      titulo: "Avaliar migração para ME",
      descricao: `Faturamento em ${meiPct.toFixed(0)}% do limite MEI`,
      prazo: meiPct > 100 ? "Urgente" : "Este mês",
      concluido: false,
      impacto: "Evitar multas e impostos extras",
      href: "/app/mei-me",
    });
  }

  if (margemLucro > 0 && margemLucro < 20) {
    acoes.push({
      prioridade: "alta",
      titulo: "Revisar preços de serviços",
      descricao: `Margem atual ${margemLucro.toFixed(0)}% — abaixo do ideal`,
      prazo: "Este mês",
      concluido: false,
      impacto: "Aumentar rentabilidade",
      href: "/app/preco",
    });
  }

  if (totalEntradas > 0 && totalSaidas > totalEntradas * 0.7) {
    acoes.push({
      prioridade: "media",
      titulo: "Reduzir custos operacionais",
      descricao: "Custos acima de 70% da receita",
      prazo: "30 dias",
      concluido: false,
      impacto: "Melhorar fluxo de caixa",
      href: "/app",
    });
  }

  if (acoes.length === 0) {
    acoes.push({
      prioridade: "baixa",
      titulo: "Manter lançamentos atualizados",
      descricao: "Registros regulares geram insights precisos",
      prazo: "Contínuo",
      concluido: true,
      impacto: "Decisões mais precisas",
      href: "/app",
    });
  }

  return acoes;
}

function buildProximasObrigacoes() {
  const today = new Date();
  const obrigacoes: { titulo: string; data: string; valor: string; status: string }[] = [];

  for (let i = 0; i < 3; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 20);
    const isPast = today > d;
    if (i === 0 && isPast) continue;
    obrigacoes.push({
      titulo: `DAS — ${d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`,
      data: `20/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`,
      valor: "R$ 71,00",
      status: i === 0 ? "pendente" : "futura",
    });
  }

  const dasnYear = today.getMonth() >= 4 ? today.getFullYear() + 1 : today.getFullYear();
  obrigacoes.push({
    titulo: `Declaração Anual MEI (DASN) ${dasnYear}`,
    data: `31/05/${dasnYear}`,
    valor: "—",
    status: today.getMonth() >= 4 && dasnYear === today.getFullYear() ? "pendente" : "futura",
  });

  return obrigacoes;
}

const chartStyle = {
  cartesian: "#2A2A2A",
  axis: "#686F6F",
  tooltip: { background: "#1B1B1B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" },
};

// ── Component ─────────────────────────────────────────────────────────────────

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { summary, insights, getLimitStatus, transactions } = useCashFlow();
  const limitStatus = getLimitStatus();

  const [acoesChecked, setAcoesChecked] = useState<Record<number, boolean>>({});

  const meiPercentage = summary.totalEntradas > 0
    ? (summary.totalEntradas / MEI_LIMIT_ANNUAL) * 100
    : 0;

  const perdasAnuais = Math.max(0, (summary.totalEntradas - MEI_LIMIT_ANNUAL) * 0.15);

  // Scores
  const saudeScore = summary.margemLucro >= 40 ? Math.min(95, 78 + summary.margemLucro * 0.2)
    : summary.margemLucro >= 20 ? 45 + summary.margemLucro
    : Math.max(10, summary.margemLucro * 2);

  const tributacaoScore = meiPercentage < 50 ? 80
    : meiPercentage <= 100 ? Math.max(45, 80 - meiPercentage * 0.4)
    : Math.max(10, 45 - (meiPercentage - 100) * 0.3);

  const crescimentoScore = summary.margemLucro >= 30 && transactions.length > 5 ? 82
    : summary.margemLucro >= 15 ? 55
    : 30;

  const { data: faturamentoData, growthRate } = useMemo(
    () => buildFaturamentoData(transactions),
    [transactions]
  );

  const acoes = useMemo(
    () => buildAcoes(meiPercentage, summary.margemLucro, summary.totalSaidas, summary.totalEntradas),
    [meiPercentage, summary]
  );

  const proximasObrigacoes = useMemo(() => buildProximasObrigacoes(), []);

  const progressoAcoes = Math.round(
    (Object.values(acoesChecked).filter(Boolean).length + acoes.filter((a) => a.concluido).length)
    / Math.max(acoes.length, 1) * 100
  );

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

  const tools = [
    { id: "fluxo", icon: Wallet, title: "Fluxo de Caixa", description: "Registre entradas e saídas e visualize a saúde financeira", accent: "#2DDB81", stats: user?.plan === "pro" ? "Ilimitado" : `${limitStatus.used}/${limitStatus.limit} este mês`, path: "/app", isPro: false, isLocked: false },
    { id: "mei-me", icon: ArrowRightLeft, title: "Simulador MEI → ME", description: "Compare impostos e descubra quando migrar do MEI", accent: "#28A263", stats: "Economia média: R$ 3.480/ano", path: "/app/mei-me", isPro: false, isLocked: false },
    { id: "preco", icon: Tag, title: "Simulador de Preço Ideal", description: "Calcule o preço perfeito considerando custos e margem", accent: "#C0F497", stats: "Margem ideal: 40-60%", path: "/app/preco", isPro: true, isLocked: user?.plan !== "pro" },
    { id: "lucro", icon: TrendingUp, title: "Simulador de Lucro", description: "Projete receitas, custos e descubra seu ponto de equilíbrio", accent: "#3AFF99", stats: "Break-even em 6 meses", path: "/app/lucro", isPro: true, isLocked: user?.plan !== "pro" },
    { id: "propostas", icon: FileText, title: "Gerador de Propostas", description: "Crie propostas comerciais profissionais em minutos", accent: "#2DDB81", stats: user?.plan === "pro" ? "Ilimitado" : `${user?.proposalUsageToday || 0}/2 hoje`, path: "/app/propostas", isPro: false, isLocked: false },
  ];

  const alertActionMap: Record<string, { href: string; label: string }> = {
    "limite-mei":      { href: "/app/mei-me",   label: "Simular MEI→ME" },
    "margem-baixa":    { href: "/app/preco",     label: "Ver Simulador de Preço" },
    "custos-altos":    { href: "/app/lucro",     label: "Ver Simulador de Lucro" },
    "saldo-negativo":  { href: "/app",           label: "Ver Fluxo de Caixa" },
    "comece-agora":    { href: "/app",           label: "Adicionar lançamento" },
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          Olá, <span className="capitalize">{user?.name?.split(" ")[0] ?? ""}!</span> 👋
        </h1>
        <p className="text-[#A1A1A1]">Acompanhe seus indicadores e acesse ferramentas essenciais</p>
      </div>

      {/* ── Hero Banner MEI ── */}
      {meiPercentage > 80 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="p-8 md:p-10 bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white relative overflow-hidden rounded-2xl border-2 border-red-400">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                  {meiPercentage > 100 ? "🔴 Alerta Crítico" : "🟡 Atenção"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {meiPercentage > 100
                  ? `Você está perdendo ${fmt(perdasAnuais)} por ano!`
                  : `Você está em ${meiPercentage.toFixed(0)}% do limite MEI`}
              </h2>
              <p className="text-lg mb-4 opacity-95">
                {meiPercentage > 100
                  ? `Seu faturamento ultrapassou o limite MEI. Cada mês sem migrar para ME custa mais em impostos e multas.`
                  : `Você está se aproximando do limite anual de R$ 81.000. Considere planejar a migração para ME.`}
              </p>
              {meiPercentage > 100 && (
                <div className="p-3 bg-white/10 rounded-xl mb-5 backdrop-blur flex items-center gap-4 text-sm flex-wrap">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-yellow-300 rounded-full animate-pulse inline-block" />Impostos extras estimados: {fmt(perdasAnuais)}/ano</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-bold rounded-xl" onClick={() => navigate("/app/mei-me")}>
                  Simular migração para ME <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Score Cards ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-bold text-white mb-4">Diagnóstico do Seu Negócio</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              pergunta: "Seu dinheiro está sob controle?",
              score: Math.round(saudeScore),
              progressClass: "[&>div]:bg-[#2DDB81]",
              scoreColor: saudeScore >= 60 ? "text-[#2DDB81]" : saudeScore >= 40 ? "text-yellow-400" : "text-[#FF4F3D]",
              verdict: saudeScore >= 60 ? "✓ Sim, está saudável" : saudeScore >= 40 ? "⚠️ Pode melhorar" : "⚠️ Margem baixa",
              sub: saudeScore >= 60 ? "Continue assim para crescer" : "Revise preços e custos",
              icon: saudeScore >= 60 ? CheckCircle2 : AlertCircle,
              iconColor: saudeScore >= 60 ? "text-[#2DDB81]" : "text-[#FF973E]",
              border: saudeScore >= 60 ? "" : saudeScore >= 40 ? "border-yellow-500/30" : "border-[#FF4F3D]/30",
            },
            {
              pergunta: "Você paga imposto demais?",
              score: Math.round(tributacaoScore),
              progressClass: tributacaoScore >= 60 ? "[&>div]:bg-[#2DDB81]" : tributacaoScore >= 40 ? "[&>div]:bg-orange-500" : "[&>div]:bg-[#FF4F3D]",
              scoreColor: tributacaoScore >= 60 ? "text-[#2DDB81]" : tributacaoScore >= 40 ? "text-[#FF973E]" : "text-[#FF4F3D]",
              verdict: tributacaoScore >= 60 ? "✓ Não, está eficiente" : tributacaoScore >= 40 ? "⚠️ Fique atento" : "⚠️ Sim, pode reduzir!",
              sub: tributacaoScore >= 60 ? "Tributação dentro do ideal" : "Use o Simulador MEI→ME",
              icon: tributacaoScore >= 60 ? CheckCircle2 : AlertCircle,
              iconColor: tributacaoScore >= 60 ? "text-[#2DDB81]" : "text-[#FF973E]",
              border: tributacaoScore < 60 ? "border-orange-500/30" : "",
            },
            {
              pergunta: "Seu negócio pode crescer mais?",
              score: Math.round(crescimentoScore),
              progressClass: "[&>div]:bg-blue-400",
              scoreColor: "text-blue-400",
              verdict: crescimentoScore >= 70 ? "✓ Sim, muito potencial!" : crescimentoScore >= 50 ? "📈 Potencial moderado" : "📊 Adicione mais dados",
              sub: crescimentoScore >= 70 ? "Projeção de crescimento positiva" : "Continue registrando lançamentos",
              icon: TrendingUp,
              iconColor: "text-blue-400",
              border: "",
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className={`p-6 bg-[#1B1B1B] rounded-2xl border ${card.border || "border-white/5"} hover:border-[#28A263]/20 transition-colors`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-white text-sm leading-snug pr-4">{card.pergunta}</span>
                  <Icon className={`w-5 h-5 flex-shrink-0 ${card.iconColor}`} />
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className={`text-4xl font-bold ${card.scoreColor}`}>{card.score}</span>
                  <span className="text-[#686F6F] mb-1">/100</span>
                </div>
                <Progress value={card.score} className={`h-2 mb-3 bg-white/10 ${card.progressClass}`} />
                <p className={`text-sm font-medium ${card.scoreColor}`}>{card.verdict}</p>
                <p className="text-xs text-[#686F6F] mt-1">{card.sub}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Alertas Inteligentes ── */}
      {insights.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-bold text-white mb-4">Alertas Inteligentes</h2>
          <div className="grid gap-3">
            {insights.map((insight) => {
              const action = alertActionMap[insight.id];
              const cardClass = insight.tipo === "alerta" ? "bg-red-500/10 border-red-500/20"
                : insight.tipo === "sucesso" ? "bg-[#28A263]/10 border-[#28A263]/20"
                : "bg-blue-500/10 border-blue-500/20";
              const iconColor = insight.tipo === "alerta" ? "text-red-400"
                : insight.tipo === "sucesso" ? "text-[#2DDB81]" : "text-blue-400";
              const badgeClass = insight.tipo === "alerta" ? "bg-red-500/20 text-red-300"
                : insight.tipo === "sucesso" ? "bg-[#28A263]/20 text-[#2DDB81]"
                : "bg-blue-500/20 text-blue-300";
              const badgeLabel = insight.tipo === "alerta" ? "🔴 Urgente"
                : insight.tipo === "sucesso" ? "🟢 Oportunidade" : "🟡 Atenção";
              const textColor = insight.tipo === "alerta" ? "text-red-300"
                : insight.tipo === "sucesso" ? "text-[#C0F497]" : "text-blue-300";

              return (
                <div key={insight.id} className={`flex gap-4 p-5 rounded-2xl border ${cardClass}`}>
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    {insight.tipo === "sucesso"
                      ? <CheckCircle className={`h-5 w-5 ${iconColor}`} />
                      : <AlertCircle className={`h-5 w-5 ${iconColor}`} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`text-sm font-medium ${textColor}`}>
                        <span className="mr-1">{insight.icone}</span>
                        {insight.mensagem}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${badgeClass}`}>
                        {badgeLabel}
                      </span>
                    </div>
                    {action && (
                      <button
                        className={`mt-2 text-xs font-semibold flex items-center gap-1 ${iconColor} hover:opacity-80 transition-opacity`}
                        onClick={() => navigate(action.href)}
                      >
                        {action.label} <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Main 2-column layout ── */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Projeção de faturamento */}
          {transactions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
                {/* Auto-insight */}
                <div className="mb-4 p-3 bg-[#28A263]/10 border border-[#28A263]/20 rounded-xl flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-[#2DDB81] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#C0F497]">
                    <strong>Projeção automática:</strong> Com base no histórico, seu faturamento
                    {growthRate >= 0
                      ? ` cresce ~${(growthRate * 100).toFixed(0)}% ao mês`
                      : ` reduziu ~${(Math.abs(growthRate) * 100).toFixed(0)}% ao mês`}
                    . A linha tracejada mostra os próximos 3 meses.
                  </p>
                </div>

                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-white">Projeção de Faturamento</h2>
                    <p className="text-sm text-[#A1A1A1]">Últimos 6 meses + próximos 3 meses</p>
                  </div>
                  {growthRate > 0 && (
                    <span className="text-xs bg-[#28A263]/20 text-[#2DDB81] px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />+{(growthRate * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={faturamentoData}>
                    <defs>
                      <linearGradient id="gradValor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#28A263" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#28A263" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradProj" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5B5FFF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#5B5FFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.cartesian} />
                    <XAxis dataKey="mes" stroke={chartStyle.axis} tick={{ fontSize: 11, fill: chartStyle.axis }} />
                    <YAxis stroke={chartStyle.axis} tick={{ fontSize: 11, fill: chartStyle.axis }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(v: number) => fmt(v)}
                      contentStyle={chartStyle.tooltip}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Area type="monotone" dataKey="valor" stroke="#28A263" strokeWidth={2} fillOpacity={1} fill="url(#gradValor)" name="Real" connectNulls />
                    <Area type="monotone" dataKey="projecao" stroke="#5B5FFF" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#gradProj)" name="Projeção" connectNulls />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Lucro do mês", value: fmt(summary.lucro), trend: summary.lucro >= 0 ? "up" : "down", color: summary.lucro >= 0 ? "#2DDB81" : "#FF4F3D", sub: summary.lucro >= 0 ? "positivo" : "negativo" },
              { label: "Margem de lucro", value: `${summary.margemLucro.toFixed(1)}%`, trend: summary.margemLucro >= 20 ? "up" : "down", color: summary.margemLucro >= 20 ? "#28A263" : "#FF4F3D", sub: summary.margemLucro >= 20 ? "saudável" : "baixa" },
              { label: "Total de entradas", value: fmt(summary.totalEntradas), trend: "up", color: "#2DDB81", sub: "receita total" },
              { label: "Lançamentos", value: user?.plan === "pro" ? `${limitStatus.used}` : `${limitStatus.used}/${limitStatus.limit}`, trend: limitStatus.percentage > 80 ? "warning" : "up", color: limitStatus.percentage > 80 ? "#FF973E" : "#28A263", sub: user?.plan === "pro" ? "ilimitado" : limitStatus.percentage > 80 ? "Atenção" : "disponível" },
            ].map((m, i) => (
              <div key={i} className="p-5 bg-[#1B1B1B] rounded-2xl border border-white/5 hover:border-[#28A263]/20 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-[#A1A1A1] font-medium">{m.label}</span>
                  {m.trend === "up" && <TrendingUp className="w-4 h-4" style={{ color: m.color }} />}
                  {m.trend === "down" && <TrendingDown className="w-4 h-4 text-[#FF4F3D]" />}
                  {m.trend === "warning" && <AlertCircle className="w-4 h-4 text-[#FF973E]" />}
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: m.color }}>{m.value}</div>
                <div className="text-xs text-[#686F6F]">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Tools Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Ferramentas Disponíveis</h2>
              <button className="text-sm text-[#2DDB81] border border-white/20 rounded-full px-4 py-2 hover:bg-white/5 transition-colors" onClick={() => navigate("/app/mei-me")}>
                Ver todas
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div key={tool.id} className="relative">
                    <div
                      className={`p-6 bg-[#1D1D1D] rounded-2xl border border-white/5 transition-all duration-300 cursor-pointer group ${tool.isLocked ? "opacity-60" : "hover:border-[#28A263]/30 hover:bg-[#1B1B1B]"}`}
                      onClick={() => tool.isLocked ? navigate("/checkout") : navigate(tool.path)}
                    >
                      {tool.isPro && (
                        <span className="absolute top-4 right-4 text-[9px] px-2 py-1 bg-[#28A263]/20 text-[#2DDB81] rounded-full font-semibold flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5" /> PRO
                        </span>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${tool.accent}20` }}>
                          <Icon className="w-6 h-6" style={{ color: tool.accent }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-white mb-1 group-hover:text-[#C0F497] transition-colors">{tool.title}</h3>
                          <p className="text-[#686F6F] text-sm mb-3 leading-relaxed">{tool.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#5F6868]">{tool.stats}</span>
                            {!tool.isLocked && <ArrowRight className="w-4 h-4 text-[#28A263] group-hover:translate-x-1 transition-transform" />}
                          </div>
                        </div>
                      </div>
                      {tool.isLocked && (
                        <div className="absolute inset-0 bg-[#141414]/70 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm">
                          <Lock className="w-10 h-10 text-[#A1A1A1] mb-3" />
                          <p className="text-white font-bold text-sm mb-2">Disponível no PRO</p>
                          <Button size="sm" className="bg-[#28A263] hover:bg-[#2DDB81] text-white text-xs rounded-xl" onClick={(e) => { e.stopPropagation(); navigate("/checkout"); }}>
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
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Plano de Ação */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#2DDB81]" />
                  <h3 className="font-bold text-white">Plano de Ação</h3>
                </div>
                <div className="text-sm">
                  <span className="font-bold text-[#2DDB81]">{progressoAcoes}%</span>
                  <span className="text-[#686F6F]"> completo</span>
                </div>
              </div>

              <Progress value={progressoAcoes} className="h-2 mb-5 bg-white/10 [&>div]:bg-[#28A263]" />

              <div className="space-y-3">
                {acoes.map((acao, idx) => {
                  const isChecked = acoesChecked[idx] ?? acao.concluido;
                  const borderColor = acao.prioridade === "alta" ? "border-l-red-500 border-red-500/20" : acao.prioridade === "media" ? "border-l-yellow-500 border-yellow-500/20" : "border-l-blue-500 border-blue-500/20";
                  const bgColor = acao.prioridade === "alta" ? "bg-red-500/10" : acao.prioridade === "media" ? "bg-yellow-500/10" : "bg-blue-500/10";
                  const badgeColor = acao.prioridade === "alta" ? "bg-red-500/20 text-red-300" : acao.prioridade === "media" ? "bg-yellow-500/20 text-yellow-300" : "bg-blue-500/20 text-blue-300";

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border-l-4 border ${borderColor} ${bgColor} ${isChecked ? "opacity-50" : ""} transition-all`}
                    >
                      <div className="flex items-start gap-2">
                        <button
                          className="mt-0.5 flex-shrink-0"
                          onClick={() => setAcoesChecked((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                        >
                          {isChecked
                            ? <CheckCircle2 className="h-4 w-4 text-[#2DDB81]" />
                            : <div className={`h-4 w-4 rounded border-2 ${acao.prioridade === "alta" ? "border-red-400" : acao.prioridade === "media" ? "border-yellow-400" : "border-blue-400"}`} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <span className={`font-semibold text-sm text-white ${isChecked ? "line-through" : ""}`}>{acao.titulo}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap ${badgeColor}`}>{acao.prazo}</span>
                          </div>
                          <p className="text-xs text-[#686F6F] mt-0.5">{acao.descricao}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-[#2DDB81] font-medium">💰 {acao.impacto}</span>
                            {!isChecked && (
                              <button onClick={() => navigate(acao.href)} className="text-[10px] text-[#A1A1A1] hover:text-white flex items-center gap-0.5">
                                Ver <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-[#28A263]/10 border border-[#28A263]/20 rounded-xl">
                <p className="text-xs text-[#C0F497]">
                  <strong>💡 Dica:</strong> Completar todas as ações melhora os scores do seu negócio.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Próximas Obrigações */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-[#A1A1A1]" />
                <h3 className="font-bold text-white">Próximas Obrigações</h3>
              </div>
              <div className="space-y-2">
                {proximasObrigacoes.map((ob, i) => (
                  <div key={i} className="p-3 bg-[#141414] rounded-xl">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium text-white leading-tight pr-2">{ob.titulo}</p>
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ob.status === "pendente" ? "bg-orange-500" : "bg-[#686F6F]"}`} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#686F6F]">{ob.data}</span>
                      <span className="text-xs font-medium text-[#A1A1A1]">{ob.valor}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#686F6F] mt-3">Valores de referência para MEI — consulte seu contador para valores exatos.</p>
            </div>
          </motion.div>

          {/* Quick value props */}
          <div className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5">
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: TrendingUp, title: "Análise Completa", desc: "Combine todas as ferramentas para uma visão 360°" },
                { icon: Zap, title: "Decisões Rápidas", desc: "Resultados em tempo real para decidir com confiança" },
                { icon: Target, title: "Metas Claras", desc: "Saiba exatamente o que fazer para crescer" }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="text-center">
                    <div className="w-10 h-10 bg-[#28A263]/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-5 h-5 text-[#2DDB81]" />
                    </div>
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-[#A1A1A1] mt-1">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
