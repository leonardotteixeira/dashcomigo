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
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex px-4 py-2 bg-[#28A263]/10 border border-[#28A263]/15 rounded-full mb-8">
            <span className="text-xs text-[#28A263] font-bold uppercase tracking-widest">
              Planos e Preços
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#001529] mb-6 leading-tight">
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg sm:text-xl text-[rgba(0,21,41,0.65)] max-w-3xl mx-auto">
            Comece grátis, faça upgrade quando precisar. Sem compromisso a longo prazo.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              billingCycle === "monthly"
                ? "bg-[#28A263] text-white shadow-md"
                : "bg-[#F8F9FA] text-[#001529] hover:bg-[#F0F2F5] border border-[rgba(0,0,0,0.08)]"
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
              billingCycle === "annual"
                ? "bg-[#28A263] text-white shadow-md"
                : "bg-[#F8F9FA] text-[#001529] hover:bg-[#F0F2F5] border border-[rgba(0,0,0,0.08)]"
            }`}
          >
            Anual
            {billingCycle === "annual" && savings > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                Economize R$ {savings}
              </span>
            )}
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* Free Plan */}
          <div className="group relative p-10 bg-white border border-[rgba(0,0,0,0.08)] rounded-3xl hover:border-[rgba(0,0,0,0.12)] hover:shadow-lg transition-all duration-300">
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#28A263]/12 rounded-2xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-[#28A263]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#001529]">Gratuito</h3>
                  <p className="text-sm text-[rgba(0,21,41,0.6)]">Começar sem limite</p>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-bold text-[#001529]">R$ 0</span>
                  <span className="text-[rgba(0,21,41,0.65)]">/mês</span>
                </div>
                <p className="text-sm text-[rgba(0,21,41,0.6)]">Para sempre grátis</p>
              </div>

              <Button
                onClick={() => handleSelectPlan("free")}
                disabled={user?.plan === "free"}
                className={`w-full h-12 rounded-lg font-semibold transition-all ${
                  user?.plan === "free"
                    ? "bg-[#F8F9FA] text-[rgba(0,21,41,0.5)] cursor-default"
                    : "bg-white text-[#28A263] hover:bg-[#F8F9FA] border border-[#28A263]/20 shadow-sm"
                }`}
              >
                {user?.plan === "free" ? "Seu plano atual" : "Começar grátis"}
              </Button>
            </div>

            <div className="space-y-4 border-t border-[rgba(0,0,0,0.08)] pt-10">
              <p className="font-bold text-[#001529]">O que está incluso:</p>
              <ul className="space-y-3">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#28A263] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[rgba(0,21,41,0.65)]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PRO Plan - Featured */}
          <div className="group relative p-10 bg-gradient-to-br from-[#28A263]/8 to-white border-2 border-[#28A263]/30 rounded-3xl hover:border-[#28A263]/50 hover:shadow-xl transition-all duration-300 shadow-lg md:ring-2 md:ring-[#28A263]/20">
            {/* Badge */}
            <div className="absolute -top-4 right-8 bg-[#28A263] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              Mais Popular
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#28A263]/15 rounded-2xl flex items-center justify-center">
                  <Crown className="w-7 h-7 text-[#28A263]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#001529]">PRO</h3>
                  <p className="text-sm text-[#28A263] font-semibold">Acesso completo</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-6xl font-bold text-[#28A263]">
                    R$ {displayPrice.toFixed(2)}
                  </span>
                  <span className="text-[rgba(0,21,41,0.65)]">/mês</span>
                </div>

                {billingCycle === "monthly" ? (
                  <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4">
                    <span className="text-sm font-bold text-amber-800">
                      🔥 1º mês: R$ {priceFirstMonth.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-[#28A263]/10 border border-[#28A263]/20 rounded-lg px-4 py-2 mb-4">
                    <span className="text-sm font-bold text-[#28A263]">
                      Economize R$ {savings}/ano
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm font-semibold text-[#28A263]">
                  <Check className="w-4 h-4" />
                  Cancele quando quiser
                </div>
              </div>

              <Button
                onClick={() => handleSelectPlan("pro")}
                disabled={user?.plan === "pro"}
                className={`w-full h-12 rounded-lg font-semibold transition-all shadow-md ${
                  user?.plan === "pro"
                    ? "bg-[#F8F9FA] text-[rgba(0,21,41,0.5)] cursor-default"
                    : "bg-[#28A263] hover:bg-[#1F8C50] text-white hover:shadow-lg"
                }`}
              >
                {user?.plan === "pro" ? (
                  <>
                    <Crown className="w-4 h-4 mr-2 inline" />
                    Seu plano atual
                  </>
                ) : (
                  <>
                    Assinar Plano PRO
                    <ArrowRight className="ml-2 w-4 h-4 inline" />
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4 border-t border-[#28A263]/15 pt-10">
              <p className="font-bold text-[#001529]">Tudo do plano Gratuito, mais:</p>
              <ul className="space-y-3">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#28A263] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[rgba(0,21,41,0.65)]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security Badge */}
            <div className="mt-10 pt-8 border-t border-[#28A263]/15 flex items-center justify-center gap-2 text-xs text-[rgba(0,21,41,0.6)]">
              <Shield className="w-4 h-4 text-[#28A263]" />
              Pagamento 100% seguro via <strong>Asaas</strong>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#001529] mb-2">Perguntas frequentes</h2>
            <p className="text-[rgba(0,21,41,0.65)]">Encontre respostas para as dúvidas mais comuns</p>
          </div>

          <div className="grid gap-4">
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
                a: "Clique em 'Assinar Plano PRO', preencha seus dados pessoais e escolha o método de pagamento (PIX, boleto ou cartão de crédito). O acesso é imediato.",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-[#F8F9FA] border border-[rgba(0,0,0,0.08)] rounded-xl hover:border-[rgba(0,0,0,0.12)] hover:shadow-sm transition-all">
                <p className="font-semibold text-[#001529] mb-3">{item.q}</p>
                <p className="text-[rgba(0,21,41,0.65)] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 p-10 bg-gradient-to-br from-[#28A263]/8 to-white border border-[#28A263]/15 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-[#001529] mb-3">Pronto para começar?</h3>
            <p className="text-[rgba(0,21,41,0.65)] mb-8 max-w-2xl mx-auto">
              Crie sua conta gratuitamente e acesse todas as ferramentas. Faça upgrade para PRO quando estiver pronto para usar recursos avançados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => navigate("/app")}
                    className="bg-[#28A263] hover:bg-[#1F8C50] text-white rounded-lg font-semibold h-12 transition-all shadow-md hover:shadow-lg"
                  >
                    Ir para o Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => navigate("/pricing")}
                    className="bg-white hover:bg-[#F8F9FA] text-[#28A263] border border-[#28A263]/20 rounded-lg font-semibold h-12 transition-all"
                  >
                    Comparar Planos
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/signup")}
                    className="bg-[#28A263] hover:bg-[#1F8C50] text-white rounded-lg font-semibold h-12 transition-all shadow-md hover:shadow-lg"
                  >
                    Começar Grátis
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-white hover:bg-[#F8F9FA] text-[#28A263] border border-[#28A263]/20 rounded-lg font-semibold h-12 transition-all"
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
