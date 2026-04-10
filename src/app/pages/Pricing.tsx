import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Check, Zap, Crown, ArrowRight, Shield } from "lucide-react";
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
  const priceAnnual = priceMonthly * 10;

  const displayPrice = billingCycle === "annual" ? priceAnnual : priceMonthly;
  const savings = billingCycle === "annual" ? Math.round((priceMonthly * 12) - (priceMonthly * 10)) : 0;

  const FREE_FEATURES = [
    "Dashboard com relatórios básicos",
    "Simulador MEI → ME ilimitado",
    "Fluxo de Caixa: 30 lançamentos/mês",
    "Contas a Pagar: 30 itens",
    "Contas a Receber: 30 itens",
    "Clientes/Fornecedores: 30 contatos",
    "Propostas comerciais: 2 por dia",
    "Orçamentos por categoria: 5/mês",
    "Estoque: 10 produtos",
  ];

  const PRO_FEATURES = [
    "Tudo do plano Gratuito com limites ilimitados",
    "Fluxo de caixa: lançamentos ilimitados",
    "Contas a Pagar/Receber: ilimitados",
    "Clientes/Fornecedores: ilimitados",
    "Orçamentos: ilimitados",
    "Estoque: ilimitado",
    "Propostas: ilimitadas",
    "Simulador de Preço Ideal",
    "Simulador de Lucro com projeções",
    "Metas de Receita com histórico",
    "Relatórios e exportações completos",
    "Alertas inteligentes e insights",
  ];

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            Comece grátis, faça upgrade quando precisar. Sem compromisso a longo prazo.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              billingCycle === "monthly"
                ? "bg-[#1D4ED8] text-white"
                : "bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]"
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              billingCycle === "annual"
                ? "bg-[#1D4ED8] text-white"
                : "bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]"
            }`}
          >
            Anual
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
          {/* Free Plan */}
          <div className="relative p-8 bg-white border border-[#E2E8F0] rounded-2xl">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#0F172A] mb-1">Gratuito</h3>
              <p className="text-sm text-[#64748B]">Começar sem limite</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold text-[#0F172A]">R$ 0</span>
                <span className="text-[#64748B]">/mês</span>
              </div>
              <p className="text-sm text-[#64748B]">Para sempre grátis</p>
            </div>

            <Button
              onClick={() => handleSelectPlan("free")}
              disabled={user?.plan === "free"}
              className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 ${
                user?.plan === "free"
                  ? "bg-[#F1F5F9] text-[#94A3B8] cursor-default"
                  : "bg-white text-[#1D4ED8] hover:bg-[#F1F5F9] border-2 border-[#1D4ED8]"
              }`}
            >
              {user?.plan === "free" ? "Seu plano atual" : "Começar grátis"}
            </Button>

            <div className="space-y-3 border-t border-[#E2E8F0] pt-8">
              <p className="font-semibold text-[#0F172A] text-sm">O que está incluso:</p>
              <ul className="space-y-2">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#475569]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PRO Plan - Featured */}
          <div className="relative p-8 bg-[#EFF6FF] border-2 border-[#1D4ED8] rounded-2xl">
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D4ED8] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              MAIS POPULAR
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[#0F172A] mb-1">PRO</h3>
              <p className="text-sm text-[#1D4ED8] font-semibold">Acesso completo</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-[#1D4ED8]">
                  R$ {displayPrice.toFixed(2)}
                </span>
                <span className="text-[#64748B]">/mês</span>
              </div>
              {billingCycle === "monthly" && (
                <p className="text-sm text-[#F59E0B] font-semibold">
                  🔥 1º mês: R$ {priceFirstMonth.toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-[#1D4ED8] mb-8">
              <Check className="w-4 h-4" />
              Cancele quando quiser
            </div>

            <Button
              onClick={() => handleSelectPlan("pro")}
              disabled={user?.plan === "pro"}
              className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 ${
                user?.plan === "pro"
                  ? "bg-[#E5E7EB] text-[#6B7280] cursor-default"
                  : "bg-[#1D4ED8] hover:bg-[#1E40AF] text-white"
              }`}
            >
              {user?.plan === "pro" ? "Seu plano atual" : "Assinar PRO"}
            </Button>

            <div className="space-y-3 border-t border-[#BFDBFE] pt-8">
              <p className="font-semibold text-[#0F172A] text-sm">Tudo do plano Gratuito, mais:</p>
              <ul className="space-y-2">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#475569]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Perguntas frequentes</h2>
            <p className="text-[#64748B]">Encontre respostas para as dúvidas mais comuns</p>
          </div>

          <div className="grid gap-4 mb-20">
            {[
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim! Cancele sua assinatura a qualquer momento sem taxas, multas ou compromissos adicionais. Você mantém o acesso até o fim do período pago.",
              },
              {
                q: "Qual é a diferença entre os planos?",
                a: "O plano Gratuito inclui 30 lançamentos/mês e 2 propostas/dia. PRO oferece lançamentos ilimitados, propostas ilimitadas e acesso aos simuladores avançados (Preço Ideal, Lucro, etc).",
              },
              {
                q: "Como faço para fazer upgrade?",
                a: "Clique em 'Assinar PRO', preencha seus dados pessoais e escolha o método de pagamento (PIX, boleto ou cartão de crédito). O acesso é imediato.",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                <p className="font-semibold text-[#0F172A] mb-3 text-sm">{item.q}</p>
                <p className="text-sm text-[#64748B] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="p-8 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-[#0F172A] mb-3">Pronto para começar?</h3>
            <p className="text-[#64748B] mb-8">
              Crie sua conta gratuitamente. Faça upgrade para PRO quando precisar de recursos avançados.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => navigate("/app")}
                    className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg font-semibold py-2 transition-all"
                  >
                    Ir para o Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/signup")}
                    className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg font-semibold py-2 transition-all"
                  >
                    Começar Grátis
                  </Button>
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-white hover:bg-[#F1F5F9] text-[#1D4ED8] border-2 border-[#1D4ED8] rounded-lg font-semibold py-2 transition-all"
                  >
                    Fazer Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
