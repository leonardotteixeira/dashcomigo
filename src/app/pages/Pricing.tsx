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
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:py-24" style={{ background: "#F4EFE6" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0E3B2E" }}>
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(14,59,46,0.6)" }}>
            Comece grátis, faça upgrade quando precisar. Sem compromisso a longo prazo.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <button
            onClick={() => setBillingCycle("monthly")}
            className="px-6 py-2 rounded-full font-semibold transition-all"
            style={billingCycle === "monthly"
              ? { background: "#0E3B2E", color: "#F4EFE6" }
              : { background: "#EBE4D6", color: "#0E3B2E" }}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className="px-6 py-2 rounded-full font-semibold transition-all"
            style={billingCycle === "annual"
              ? { background: "#0E3B2E", color: "#F4EFE6" }
              : { background: "#EBE4D6", color: "#0E3B2E" }}
          >
            Anual
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
          {/* Free Plan */}
          <div className="relative p-8 rounded-2xl" style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.13)" }}>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-1" style={{ color: "#0E3B2E" }}>Gratuito</h3>
              <p className="text-sm" style={{ color: "rgba(14,59,46,0.6)" }}>Começar sem limite</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold" style={{ color: "#0E3B2E" }}>R$ 0</span>
                <span style={{ color: "rgba(14,59,46,0.6)" }}>/mês</span>
              </div>
              <p className="text-sm" style={{ color: "rgba(14,59,46,0.6)" }}>Para sempre grátis</p>
            </div>

            <button
              onClick={() => handleSelectPlan("free")}
              disabled={user?.plan === "free"}
              className="w-full py-3 rounded-lg font-semibold transition-all mb-8"
              style={user?.plan === "free"
                ? { background: "rgba(14,59,46,0.08)", color: "rgba(14,59,46,0.4)", cursor: "default" }
                : { background: "transparent", color: "#0E3B2E", border: "2px solid #0E3B2E" }}
            >
              {user?.plan === "free" ? "Seu plano atual" : "Começar grátis"}
            </button>

            <div className="space-y-3 pt-8" style={{ borderTop: "1px solid rgba(20,18,15,0.13)" }}>
              <p className="font-semibold text-sm" style={{ color: "#0E3B2E" }}>O que está incluso:</p>
              <ul className="space-y-2">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#1F5A3A" }} />
                    <span className="text-sm" style={{ color: "rgba(14,59,46,0.7)" }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PRO Plan - Featured */}
          <div className="relative p-8 rounded-2xl" style={{ background: "#0E3B2E", border: "2px solid #0E3B2E" }}>
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
              style={{ background: "#7FD19F", color: "#0E3B2E" }}>
              MAIS POPULAR
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-1" style={{ color: "#F4EFE6" }}>PRO</h3>
              <p className="text-sm font-semibold" style={{ color: "#7FD19F" }}>Acesso completo</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold" style={{ color: "#7FD19F" }}>
                  R$ {displayPrice.toFixed(2)}
                </span>
                <span style={{ color: "rgba(244,239,230,0.6)" }}>/mês</span>
              </div>
              {billingCycle === "monthly" && (
                <p className="text-sm font-semibold" style={{ color: "#7FD19F" }}>
                  🔥 1º mês: R$ {priceFirstMonth.toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold mb-8" style={{ color: "#7FD19F" }}>
              <Check className="w-4 h-4" />
              Cancele quando quiser
            </div>

            <button
              onClick={() => handleSelectPlan("pro")}
              disabled={user?.plan === "pro"}
              className="w-full py-3 rounded-lg font-semibold transition-all mb-8"
              style={user?.plan === "pro"
                ? { background: "rgba(244,239,230,0.1)", color: "rgba(244,239,230,0.4)", cursor: "default" }
                : { background: "#7FD19F", color: "#0E3B2E" }}
            >
              {user?.plan === "pro" ? "Seu plano atual" : "Assinar PRO"}
            </button>

            <div className="space-y-3 pt-8" style={{ borderTop: "1px solid rgba(244,239,230,0.15)" }}>
              <p className="font-semibold text-sm" style={{ color: "#F4EFE6" }}>Tudo do plano Gratuito, mais:</p>
              <ul className="space-y-2">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#7FD19F" }} />
                    <span className="text-sm" style={{ color: "rgba(244,239,230,0.8)" }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "#0E3B2E" }}>Perguntas frequentes</h2>
            <p style={{ color: "rgba(14,59,46,0.6)" }}>Encontre respostas para as dúvidas mais comuns</p>
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
              <div key={idx} className="p-6 rounded-lg" style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.13)" }}>
                <p className="font-semibold mb-3 text-sm" style={{ color: "#0E3B2E" }}>{item.q}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(14,59,46,0.6)" }}>{item.a}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="p-8 rounded-2xl text-center" style={{ background: "#0E3B2E" }}>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "#F4EFE6" }}>Pronto para começar?</h3>
            <p className="mb-8" style={{ color: "rgba(244,239,230,0.75)" }}>
              Crie sua conta gratuitamente. Faça upgrade para PRO quando precisar de recursos avançados.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/app")}
                  className="px-8 py-3 rounded-lg font-semibold transition-all"
                  style={{ background: "#7FD19F", color: "#0E3B2E" }}
                >
                  Ir para o Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-8 py-3 rounded-lg font-semibold transition-all"
                    style={{ background: "#7FD19F", color: "#0E3B2E" }}
                  >
                    Começar Grátis
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-8 py-3 rounded-lg font-semibold transition-all"
                    style={{ background: "transparent", color: "#F4EFE6", border: "1px solid rgba(244,239,230,0.3)" }}
                  >
                    Fazer Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
