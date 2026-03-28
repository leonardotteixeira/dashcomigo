import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Calculator,
  FileText,
  DollarSign,
  Zap,
  Shield,
  PieChart,
  Sparkles,
  CheckCircle2,
  Crown,
} from "lucide-react";

const FEATURES = [
  {
    id: "welcome",
    title: "Bem-vindo ao Hub!",
    subtitle: "Conheça as ferramentas que vão transformar a gestão do seu negócio.",
    color: "#2DDB81",
    icon: Sparkles,
    highlights: [
      "Simuladores tributários inteligentes",
      "Controle financeiro completo",
      "Propostas comerciais profissionais",
      "Dashboard com insights em tempo real",
    ],
    preview: (
      <div className="relative bg-[#141414] rounded-2xl border border-white/10 p-6 mx-auto max-w-sm">
        <div className="flex items-center gap-3 mb-5">
          <img src="/logo.png" alt="" className="h-10 w-auto" />
          <span className="text-white font-bold">Meu Fluxo</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Simulador MEI", Icon: Calculator, color: "bg-emerald-500/20", iconColor: "text-emerald-400" },
            { label: "Fluxo de Caixa", Icon: BarChart3, color: "bg-blue-500/20", iconColor: "text-blue-400" },
            { label: "Propostas", Icon: FileText, color: "bg-purple-500/20", iconColor: "text-purple-400" },
            { label: "Dashboard", Icon: PieChart, color: "bg-orange-500/20", iconColor: "text-orange-400" },
          ].map((item) => (
            <div key={item.label} className={`${item.color} rounded-xl p-3 text-center`}>
              <item.Icon className={`w-6 h-6 mx-auto mb-1 ${item.iconColor}`} />
              <span className="text-xs text-white/80 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "fluxo-caixa",
    title: "Fluxo de Caixa",
    subtitle: "Registre receitas e despesas, acompanhe seu saldo e receba alertas inteligentes automaticamente.",
    color: "#3B82F6",
    icon: BarChart3,
    highlights: [
      "Lançamentos categorizados por tipo",
      "Saldo e margem de lucro em tempo real",
      "Alertas quando custos estão altos",
      "Sugestão automática de migração MEI → ME",
    ],
    preview: (
      <div className="bg-[#141414] rounded-2xl border border-white/10 p-5 mx-auto max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white font-bold text-sm">Fluxo de Caixa</span>
          <span className="text-xs text-[#2DDB81] bg-[#2DDB81]/10 px-2 py-1 rounded-full">Março 2026</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#1B1B1B] rounded-xl p-3 text-center">
            <p className="text-[10px] text-[#A1A1A1]">Receitas</p>
            <p className="text-sm font-bold text-[#2DDB81]">R$ 12.500</p>
          </div>
          <div className="bg-[#1B1B1B] rounded-xl p-3 text-center">
            <p className="text-[10px] text-[#A1A1A1]">Despesas</p>
            <p className="text-sm font-bold text-red-400">R$ 4.200</p>
          </div>
          <div className="bg-[#1B1B1B] rounded-xl p-3 text-center">
            <p className="text-[10px] text-[#A1A1A1]">Saldo</p>
            <p className="text-sm font-bold text-white">R$ 8.300</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { label: "Cliente A — Projeto Web", val: "+R$ 5.000", color: "text-[#2DDB81]" },
            { label: "Aluguel escritório", val: "-R$ 1.200", color: "text-red-400" },
            { label: "Cliente B — Consultoria", val: "+R$ 3.500", color: "text-[#2DDB81]" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center bg-[#1B1B1B] rounded-lg px-3 py-2">
              <span className="text-xs text-[#C8C9D0]">{item.label}</span>
              <span className={`text-xs font-bold ${item.color}`}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "simulador-mei",
    title: "Simulador MEI → ME",
    subtitle: "Compare seus impostos como MEI e ME no Simples Nacional. Descubra se vale a pena migrar.",
    color: "#2DDB81",
    icon: Calculator,
    highlights: [
      "Comparativo lado a lado MEI vs ME",
      "Cálculo com alíquotas oficiais do Simples",
      "Economia anual estimada",
      "100% gratuito, sem cadastro",
    ],
    preview: (
      <div className="bg-[#141414] rounded-2xl border border-white/10 p-5 mx-auto max-w-sm">
        <div className="text-center mb-4">
          <span className="text-white font-bold text-sm">MEI vs ME — Comparativo</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#1B1B1B] rounded-xl p-4 text-center border border-white/5">
            <p className="text-xs text-[#A1A1A1] mb-1">Custo MEI</p>
            <p className="text-lg font-bold text-yellow-400">R$ 76,60</p>
            <p className="text-[10px] text-[#686F6F]">/mês fixo</p>
          </div>
          <div className="bg-[#1B1B1B] rounded-xl p-4 text-center border border-[#28A263]/30">
            <p className="text-xs text-[#A1A1A1] mb-1">Custo ME</p>
            <p className="text-lg font-bold text-[#2DDB81]">R$ 540</p>
            <p className="text-[10px] text-[#686F6F]">6% s/ R$ 9.000</p>
          </div>
        </div>
        <div className="bg-[#28A263]/10 border border-[#28A263]/20 rounded-xl p-3 text-center">
          <p className="text-xs text-[#A1A1A1]">Economia anual estimada</p>
          <p className="text-xl font-bold text-[#2DDB81]">R$ 5.560</p>
        </div>
      </div>
    ),
  },
  {
    id: "simuladores-pro",
    title: "Simuladores PRO",
    subtitle: "Calcule o preço ideal dos seus serviços e projete seu lucro futuro com cenários personalizados.",
    color: "#A855F7",
    icon: Crown,
    highlights: [
      "Simulador de Preço: custos + margem ideal",
      "Simulador de Lucro: projeção a 12 meses",
      "Cenários otimista, realista e pessimista",
      "Disponível no plano PRO",
    ],
    preview: (
      <div className="bg-[#141414] rounded-2xl border border-white/10 p-5 mx-auto max-w-sm">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
            <DollarSign className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <p className="text-xs text-white font-medium">Preço Ideal</p>
            <p className="text-lg font-bold text-purple-400">R$ 150/h</p>
          </div>
          <div className="flex-1 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
            <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-xs text-white font-medium">Lucro Projetado</p>
            <p className="text-lg font-bold text-blue-400">R$ 180k</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 bg-[#1B1B1B] rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-[#2DDB81] rounded-full" />
            </div>
            <span className="text-[10px] text-[#A1A1A1] w-16">Otimista</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 bg-[#1B1B1B] rounded-full overflow-hidden">
              <div className="h-full w-[60%] bg-blue-400 rounded-full" />
            </div>
            <span className="text-[10px] text-[#A1A1A1] w-16">Realista</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 bg-[#1B1B1B] rounded-full overflow-hidden">
              <div className="h-full w-[35%] bg-yellow-400 rounded-full" />
            </div>
            <span className="text-[10px] text-[#A1A1A1] w-16">Pessimista</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "propostas",
    title: "Gerador de Propostas",
    subtitle: "Crie orçamentos e contratos profissionais em minutos. Gerencie status e envie para seus clientes.",
    color: "#F59E0B",
    icon: FileText,
    highlights: [
      "Templates de orçamento e contrato",
      "Preview em tempo real",
      "Gerenciamento de status por proposta",
      "Copiar, enviar por email ou baixar PDF",
    ],
    preview: (
      <div className="bg-[#141414] rounded-2xl border border-white/10 p-5 mx-auto max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white font-bold text-sm">Propostas</span>
          <div className="flex gap-2">
            <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">3 Aguardando</span>
            <span className="text-[10px] bg-[#2DDB81]/20 text-[#2DDB81] px-2 py-0.5 rounded-full">5 Aprovadas</span>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { cliente: "Maria Silva", tipo: "Orçamento", valor: "R$ 4.500", status: "Aprovada", statusColor: "text-[#2DDB81] bg-[#2DDB81]/10" },
            { cliente: "João Santos", tipo: "Contrato", valor: "R$ 12.000", status: "Aguardando", statusColor: "text-yellow-400 bg-yellow-500/10" },
            { cliente: "Ana Costa", tipo: "Orçamento", valor: "R$ 2.800", status: "Aprovada", statusColor: "text-[#2DDB81] bg-[#2DDB81]/10" },
          ].map((p) => (
            <div key={p.cliente} className="bg-[#1B1B1B] rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-white font-medium">{p.cliente}</p>
                <p className="text-[10px] text-[#686F6F]">{p.tipo} — {p.valor}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.statusColor}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "dashboard",
    title: "Dashboard Inteligente",
    subtitle: "Visão geral do seu negócio com métricas, gráficos e insights personalizados num só lugar.",
    color: "#F97316",
    icon: PieChart,
    highlights: [
      "Resumo financeiro mensal consolidado",
      "Gráficos de receita vs despesa",
      "Insights automáticos do seu negócio",
      "Acesso rápido a todas as ferramentas",
    ],
    preview: (
      <div className="bg-[#141414] rounded-2xl border border-white/10 p-5 mx-auto max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white font-bold text-sm">Dashboard</span>
          <span className="text-[10px] text-[#A1A1A1]">Março 2026</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-[#1B1B1B] rounded-xl p-3">
            <p className="text-[10px] text-[#A1A1A1]">Receita Total</p>
            <p className="text-sm font-bold text-[#2DDB81]">R$ 25.400</p>
            <p className="text-[10px] text-[#2DDB81]">↑ 12% vs mês anterior</p>
          </div>
          <div className="bg-[#1B1B1B] rounded-xl p-3">
            <p className="text-[10px] text-[#A1A1A1]">Margem Lucro</p>
            <p className="text-sm font-bold text-white">68%</p>
            <p className="text-[10px] text-[#2DDB81]">↑ 5% vs mês anterior</p>
          </div>
        </div>
        <div className="bg-[#1B1B1B] rounded-xl p-3">
          <p className="text-[10px] text-[#A1A1A1] mb-2">Receita vs Despesa</p>
          <div className="flex items-end gap-1 h-16">
            {[40, 65, 50, 80, 70, 90, 75, 85, 60, 95, 70, 88].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col gap-0.5">
                <div className="bg-[#2DDB81] rounded-sm" style={{ height: `${h}%` }} />
                <div className="bg-red-400/60 rounded-sm" style={{ height: `${h * 0.35}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "ready",
    title: "Tudo pronto!",
    subtitle: "Você está a um clique de começar. Explore as ferramentas e faça seu negócio crescer.",
    color: "#2DDB81",
    icon: CheckCircle2,
    highlights: [
      "Fluxo de Caixa para controlar finanças",
      "Simulador MEI → ME gratuito e ilimitado",
      "Propostas comerciais profissionais",
      "Dashboard com visão completa do negócio",
    ],
    preview: (
      <div className="bg-[#141414] rounded-2xl border border-white/10 p-6 mx-auto max-w-sm text-center">
        <div className="w-20 h-20 bg-[#28A263]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-10 h-10 text-[#2DDB81]" />
        </div>
        <h3 className="text-white font-bold text-lg mb-2">Você está pronto!</h3>
        <p className="text-[#A1A1A1] text-sm mb-4">
          Todas as ferramentas estão disponíveis para você explorar agora mesmo.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: BarChart3, label: "Fluxo de Caixa", color: "text-blue-400" },
            { icon: Calculator, label: "Simulador MEI", color: "text-[#2DDB81]" },
            { icon: FileText, label: "Propostas", color: "text-yellow-400" },
            { icon: PieChart, label: "Dashboard", color: "text-orange-400" },
          ].map((item) => (
            <div key={item.label} className="bg-[#1B1B1B] rounded-lg p-2 flex items-center gap-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-[10px] text-white/80">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const TOTAL_STEPS = FEATURES.length;

export function Onboarding() {
  const { completeOnboarding, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);

  const current = FEATURES[step];
  const isLast = step === TOTAL_STEPS - 1;

  // Navega para /app assim que onboardingCompleted for atualizado no estado
  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate("/app");
    }
  }, [user?.onboardingCompleted, navigate]);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await completeOnboarding({});
      // Aguarda o state ser atualizado via useEffect
    } catch (error) {
      console.error("Erro ao completar onboarding:", error);
      // Força navegação mesmo se falhar, mas loga o erro
      navigate("/app/dashboard");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    setSaving(true);
    try {
      await completeOnboarding({});
    } catch (error) {
      console.error("Erro ao pular onboarding:", error);
      navigate("/app/dashboard");
    } finally {
      setSaving(false);
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-6">
          {FEATURES.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i <= step ? current.color : "rgba(255,255,255,0.08)",
              }}
            />
          ))}
        </div>

        {/* Main card */}
        <div className="bg-[#1B1B1B] rounded-3xl border border-white/5 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-8"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${current.color}20` }}
                >
                  <current.icon className="w-5 h-5" style={{ color: current.color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{current.title}</h2>
                </div>
              </div>
              <p className="text-[#A1A1A1] text-sm mb-6 leading-relaxed">{current.subtitle}</p>

              {/* Preview */}
              <div className="mb-6">
                {current.preview}
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {current.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: current.color }} />
                    <span className="text-sm text-[#C8C9D0]">{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="px-8 pb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {step > 0 && (
                <Button
                  variant="ghost"
                  onClick={goBack}
                  className="text-[#A1A1A1] hover:text-white hover:bg-white/5 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              )}
              <button
                onClick={handleSkip}
                disabled={saving}
                className="text-xs text-[#686F6F] hover:text-[#A1A1A1] transition-colors"
              >
                Pular tour
              </button>
            </div>

            {!isLast ? (
              <Button
                onClick={goNext}
                className="text-white rounded-xl px-6"
                style={{ backgroundColor: current.color }}
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={saving}
                className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl px-6"
              >
                {saving ? "Carregando..." : "Começar a usar"}
                {!saving && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </div>

        {/* Step counter */}
        <p className="text-center text-xs text-[#686F6F] mt-4">
          {step + 1} de {TOTAL_STEPS}
        </p>
      </div>
    </div>
  );
}
