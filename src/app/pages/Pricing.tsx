import { useState } from "react";
import { useNavigate } from "react-router";
import { Check, Zap, Crown, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";

export function Pricing() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const handleSelectPlan = (planType: "free" | "pro") => {
    if (!isAuthenticated) {
      navigate("/signup");
      return;
    }

    if (planType === "pro") {
      navigate("/checkout");
    } else {
      navigate("/app");
    }
  };

  const priceMonthly = 29.90;
  const priceFirstMonth = 9.90;
  const priceAnnual = priceMonthly * 10; // 10 meses no ano (desconto)

  const displayPrice = billingCycle === "annual" ? priceAnnual : priceMonthly;
  const displayFirstMonthPrice = billingCycle === "annual" ? priceAnnual * 0.5 : priceFirstMonth;
  const savings = billingCycle === "annual" ? Math.round((priceMonthly * 12) - (priceMonthly * 10)) : 0;

  const FREE_FEATURES = [
    "Simulador MEI → ME ilimitado",
    "Fluxo de Caixa: 30 lançamentos/mês",
    "2 propostas comerciais por dia",
    "Acesso ao dashboard",
    "Relatórios básicos",
  ];

  const PRO_FEATURES = [
    "Fluxo de caixa: lançamentos ilimitados",
    "Simulador de Preço Ideal (exclusivo)",
    "Simulador de Lucro com projeções",
    "Propostas ilimitadas",
    "Relatórios e exportações completos",
    "Gráficos avançados (AreaChart, BarChart)",
    "Alertas inteligentes e insights",
    "Suporte prioritário",
  ];

  return (
    <div className="min-h-screen bg-[#141414] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-[#28A263]/20 border border-[#28A263]/20 rounded-full mb-6">
            <span className="text-xs text-[#2DDB81] font-bold uppercase tracking-wider">
              Planos e Preços
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg text-[#A1A1A1] max-w-2xl mx-auto mb-8">
            Comece grátis e faça upgrade quando precisar de mais recursos
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#28A263] text-white"
                  : "bg-white/5 text-[#A1A1A1] hover:bg-white/10"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded-xl font-medium transition-all relative ${
                billingCycle === "annual"
                  ? "bg-[#28A263] text-white"
                  : "bg-white/5 text-[#A1A1A1] hover:bg-white/10"
              }`}
            >
              Anual
              {billingCycle === "annual" && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {savings > 0 && `Economize R$ ${savings.toFixed(0)}`}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 bg-[#1B1B1B] rounded-3xl border border-white/5 hover:border-white/10 transition-all">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#A1A1A1]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Gratuito</h3>
                  <p className="text-sm text-[#A1A1A1]">Para começar</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">R$ 0</span>
                  <span className="text-[#A1A1A1]">/mês</span>
                </div>
                <p className="text-sm text-[#686F6F] mt-2">Para sempre grátis</p>
              </div>

              <Button
                size="lg"
                onClick={() => handleSelectPlan("free")}
                disabled={user?.plan === "free"}
                className={`w-full rounded-xl h-12 font-medium transition-all ${
                  user?.plan === "free"
                    ? "bg-white/10 text-[#A1A1A1] cursor-default"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {user?.plan === "free" ? "Plano Atual" : "Começar Grátis"}
              </Button>
            </div>

            <div className="space-y-4">
              <p className="font-bold text-white text-sm">O que está incluso:</p>
              <ul className="space-y-3">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#2DDB81] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#A1A1A1]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PRO Plan */}
          <div className="p-8 bg-gradient-to-br from-[#28A263]/20 to-[#2DDB81]/10 rounded-3xl border-2 border-[#28A263]/30 relative overflow-hidden hover:border-[#28A263]/50 transition-all shadow-xl">
            {/* Popular badge */}
            <div className="absolute top-0 right-0 bg-[#28A263] text-black text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
              MAIS POPULAR
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#28A263]/30 rounded-2xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-[#2DDB81]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">PRO</h3>
                  <p className="text-sm text-[#2DDB81]">Acesso completo</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-[#2DDB81]">
                    R$ {displayPrice.toFixed(2)}
                  </span>
                  <span className="text-[#A1A1A1]">/mês</span>
                </div>

                {billingCycle === "monthly" ? (
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-3 py-2 inline-block mb-3">
                    <p className="text-sm font-bold text-yellow-300">
                      🔥 Apenas 1º mês R$ {priceFirstMonth.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#28A263]/20 border border-[#28A263]/30 rounded-xl px-3 py-2 inline-block mb-3">
                    <p className="text-sm font-bold text-[#2DDB81]">
                      💰 Economize R$ {savings.toFixed(0)}/ano
                    </p>
                  </div>
                )}

                <p className="text-sm text-[#2DDB81] font-medium">
                  ✓ Cancele quando quiser
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => handleSelectPlan("pro")}
                disabled={user?.plan === "pro"}
                className={`w-full rounded-xl h-12 font-medium transition-all ${
                  user?.plan === "pro"
                    ? "bg-white/10 text-[#A1A1A1] cursor-default"
                    : "bg-[#28A263] hover:bg-[#2DDB81] text-black"
                }`}
              >
                {user?.plan === "pro" ? (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Plano Atual
                  </>
                ) : (
                  <>
                    Assinar Plano PRO
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <p className="font-bold text-white text-sm">Tudo do Gratuito, mais:</p>
              <ul className="space-y-3">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#2DDB81] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#A1A1A1]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-[#686F6F] text-center">
                🔒 Pagamento 100% seguro processado pela <strong>Asaas</strong>
              </p>
            </div>
          </div>
        </div>

        {/* FAQ / CTA Section */}
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Perguntas frequentes</h2>
          <div className="grid gap-6">
            {[
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou penalidades.",
              },
              {
                q: "Qual é a diferença entre os planos?",
                a: "O plano gratuito inclui 30 lançamentos mensais e 2 propostas/dia. PRO oferece lançamentos ilimitados, acesso aos simuladores avançados e propostas ilimitadas.",
              },
              {
                q: "Como faço para fazer upgrade?",
                a: "Clique em 'Assinar Plano PRO', preencha seus dados e escolha o método de pagamento (PIX, boleto ou cartão).",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-[#1B1B1B] rounded-2xl border border-white/5 text-left">
                <p className="font-bold text-white mb-2">{item.q}</p>
                <p className="text-[#A1A1A1] text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
