import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowRight, ArrowLeft, CheckCircle2, Briefcase, Package, ShoppingBag, Sparkles, TrendingDown, Rocket, BarChart3, Target } from "lucide-react";

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface FormData {
  cpfCnpj: string;
  tipoNegocio: string;
  faturamentoMensal: string;
  objetivo: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCpfCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function formatBRL(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const num = parseInt(digits, 10) / 100;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ─── Dados das opções de seleção ─────────────────────────────────────────────
const TIPOS_NEGOCIO = [
  { id: "servicos", label: "Serviços", icon: Briefcase },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "comercio", label: "Comércio", icon: ShoppingBag },
  { id: "outros", label: "Outros", icon: Sparkles },
];

const OBJETIVOS = [
  { id: "reduzir-impostos", label: "Reduzir impostos", icon: TrendingDown },
  { id: "crescer-negocio", label: "Crescer o negócio", icon: Rocket },
  { id: "organizar-financas", label: "Organizar finanças", icon: BarChart3 },
  { id: "outros", label: "Outros", icon: Target },
];

const TOTAL_STEPS = 5;

// ─── Componente principal ─────────────────────────────────────────────────────
export function Onboarding() {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1=forward, -1=backward
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>({
    cpfCnpj: "",
    tipoNegocio: "",
    faturamentoMensal: "",
    objetivo: "",
  });

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSkip = async () => {
    setSaving(true);
    try {
      await completeOnboarding({});
    } catch {/* silently ignore */}
    navigate("/app/dashboard");
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const faturamento = form.faturamentoMensal
        ? parseFloat(form.faturamentoMensal.replace(/\D/g, "")) / 100
        : undefined;
      await completeOnboarding({
        cpfCnpj: form.cpfCnpj || undefined,
        tipoNegocio: form.tipoNegocio || undefined,
        faturamentoMensal: faturamento,
        objetivo: form.objetivo || undefined,
      });
    } catch {/* silently ignore */}
    navigate("/app/dashboard");
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Hub do Empreendedor" className="h-26 w-auto" />
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i + 1 <= step ? "bg-[#28A263]" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Step card */}
        <div className="bg-[#1B1B1B] rounded-3xl border border-white/5 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="p-8"
            >
              {/* Step 1 — Boas-vindas */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#28A263]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-[#2DDB81]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Bem-vindo, {user?.name.split(" ")[0]}!
                    </h2>
                    <p className="text-[#A1A1A1] text-sm leading-relaxed">
                      Vamos configurar seu perfil em menos de 2 minutos para personalizar sua experiência.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-[#A1A1A1] mb-2 block">Seu nome</Label>
                      <Input
                        value={user?.name ?? ""}
                        readOnly
                        className="bg-[#141414] border-white/10 text-white rounded-xl opacity-60"
                      />
                    </div>
                    <div>
                      <Label className="text-[#A1A1A1] mb-2 block">Seu email</Label>
                      <Input
                        value={user?.email ?? ""}
                        readOnly
                        className="bg-[#141414] border-white/10 text-white rounded-xl opacity-60"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 — CPF/CNPJ */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Seu CPF ou CNPJ</h2>
                    <p className="text-[#A1A1A1] text-sm">
                      Usamos para personalizar as simulações tributárias.
                    </p>
                  </div>
                  <div>
                    <Label className="text-[#A1A1A1] mb-2 block">CPF / CNPJ</Label>
                    <Input
                      value={form.cpfCnpj}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, cpfCnpj: formatCpfCnpj(e.target.value) }))
                      }
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      className="bg-[#141414] border-white/10 text-white placeholder:text-[#686F6F] rounded-xl h-12"
                    />
                  </div>
                </div>
              )}

              {/* Step 3 — Tipo de negócio */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Qual é o seu negócio?</h2>
                    <p className="text-[#A1A1A1] text-sm">
                      Escolha a categoria que melhor descreve sua atividade.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {TIPOS_NEGOCIO.map((tipo) => {
                      const Icon = tipo.icon;
                      return (
                        <button
                          key={tipo.id}
                          onClick={() => setForm((f) => ({ ...f, tipoNegocio: tipo.id }))}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            form.tipoNegocio === tipo.id
                              ? "border-[#28A263] bg-[#28A263]/10"
                              : "border-white/10 bg-[#141414] hover:border-white/20"
                          }`}
                        >
                          <Icon className={`w-6 h-6 mb-2 ${form.tipoNegocio === tipo.id ? "text-[#2DDB81]" : "text-[#A1A1A1]"}`} />
                          <p className={`font-bold text-sm ${form.tipoNegocio === tipo.id ? "text-[#2DDB81]" : "text-white"}`}>
                            {tipo.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4 — Faturamento */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Faturamento mensal</h2>
                    <p className="text-[#A1A1A1] text-sm">
                      Valor aproximado para calibrarmos seus alertas e simulações.
                    </p>
                  </div>
                  <div>
                    <Label className="text-[#A1A1A1] mb-2 block">Faturamento médio por mês</Label>
                    <Input
                      value={form.faturamentoMensal}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, faturamentoMensal: formatBRL(e.target.value) }))
                      }
                      placeholder="R$ 0,00"
                      inputMode="numeric"
                      className="bg-[#141414] border-white/10 text-white placeholder:text-[#686F6F] rounded-xl h-12 text-lg"
                    />
                    <p className="text-xs text-[#686F6F] mt-2">Limite MEI: R$ 6.750/mês (R$ 81.000/ano)</p>
                  </div>
                </div>
              )}

              {/* Step 5 — Objetivo */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Qual é seu objetivo?</h2>
                    <p className="text-[#A1A1A1] text-sm">
                      Vamos priorizar as ferramentas que fazem mais sentido para você.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {OBJETIVOS.map((obj) => {
                      const Icon = obj.icon;
                      return (
                        <button
                          key={obj.id}
                          onClick={() => setForm((f) => ({ ...f, objetivo: obj.id }))}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            form.objetivo === obj.id
                              ? "border-[#28A263] bg-[#28A263]/10"
                              : "border-white/10 bg-[#141414] hover:border-white/20"
                          }`}
                        >
                          <Icon className={`w-6 h-6 mb-2 ${form.objetivo === obj.id ? "text-[#2DDB81]" : "text-[#A1A1A1]"}`} />
                          <p className={`font-bold text-sm ${form.objetivo === obj.id ? "text-[#2DDB81]" : "text-white"}`}>
                            {obj.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation footer */}
          <div className="px-8 pb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {step > 1 && (
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
                className="text-xs text-[#686F6F] hover:text-[#A1A1A1] transition-colors"
              >
                Pular por agora
              </button>
            </div>

            {step < TOTAL_STEPS ? (
              <Button
                onClick={goNext}
                className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl px-6"
              >
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={saving}
                className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl px-6"
              >
                {saving ? "Salvando..." : "Começar agora"}
                {!saving && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </div>

        {/* Step counter */}
        <p className="text-center text-xs text-[#686F6F] mt-4">
          Passo {step} de {TOTAL_STEPS}
        </p>
      </div>
    </div>
  );
}
