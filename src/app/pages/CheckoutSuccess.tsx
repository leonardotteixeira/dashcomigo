import { useNavigate } from "react-router";
import { Crown, Check, ArrowRight, Sparkles, Zap, Gift } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export function CheckoutSuccess() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect if not PRO
    if (!user || user.plan !== "pro") {
      navigate("/app");
    }
  }, [user, navigate]);

  if (!user || user.plan !== "pro") return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="p-12 border border-[#E8EBF1] bg-white text-center relative overflow-hidden shadow-sm">
          {/* Celebration effects background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 text-6xl animate-bounce"><Zap className="w-12 h-12 text-[#28A263]" /></div>
            <div className="absolute top-20 right-10 text-4xl animate-pulse"><Sparkles className="w-10 h-10 text-[#28A263]" /></div>
            <div className="absolute bottom-20 left-20 text-5xl animate-bounce delay-100"><Gift className="w-12 h-12 text-[#28A263]" /></div>
            <div className="absolute bottom-10 right-20 text-4xl animate-pulse delay-200"><Check className="w-10 h-10 text-[#28A263]" /></div>
          </div>

          <div className="relative z-10">
            {/* Crown icon with animation */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#28A263]/10 rounded-3xl shadow-md mb-6 animate-bounce">
              <Crown className="w-12 h-12 text-[#28A263]" />
            </div>

            {/* Success message */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#28A263]/10 text-[#28A263] rounded-full text-sm font-bold mb-4">
                <Check className="w-4 h-4" />
                Pagamento Confirmado
              </div>

              <h1 className="text-4xl font-bold text-[#001529] mb-4">
                Bem-vindo ao PRO!
              </h1>

              <p className="text-lg text-[rgba(0,21,41,0.6)] mb-2">
                Sua conta foi atualizada com sucesso
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0F8F5] border border-[#28A263]/20 rounded-xl">
                <Crown className="w-5 h-5 text-[#28A263]" />
                <span className="font-bold text-[#28A263]">
                  {user.name} • Plano PRO
                </span>
              </div>
            </div>

            {/* Benefits unlocked */}
            <Card className="p-6 bg-[#F9FAFB] border border-[#E8EBF1] mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#28A263]" />
                <h3 className="font-bold text-[#001529]">Recursos Desbloqueados:</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-left">
                {[
                  "Simulador de Preço Ideal",
                  "Simulador de Lucro",
                  "Propostas ilimitadas",
                  "Templates premium",
                  "Exportação em PDF",
                  "Histórico completo",
                  "Suporte prioritário",
                  "Novos recursos"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                    <span className="text-[rgba(0,21,41,0.6)]">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* CTAs */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-[#28A263] hover:bg-[#1f7a4a] text-white h-14 text-lg font-semibold"
                onClick={() => navigate("/app")}
              >
                Explorar todos os recursos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                size="lg"
                className="w-full border border-[#E8EBF1] bg-white text-[#001529] hover:bg-[#F9FAFB]"
                onClick={() => navigate("/app/preco")}
              >
                Testar Simulador de Preço
              </Button>
            </div>

            {/* Thank you message */}
            <div className="mt-8 pt-8 border-t border-[#E8EBF1]">
              <p className="text-sm text-[rgba(0,21,41,0.6)]">
                Obrigado por confiar no <strong>Meu Fluxo</strong>!<br />
                Estamos aqui para ajudar seu negócio a crescer.
              </p>
            </div>
          </div>
        </Card>

        {/* Support info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[rgba(0,21,41,0.6)]">
            Precisa de ajuda? Entre em contato pelo{" "}
            <a href="mailto:contato@bubuya.com.br" className="text-[#28A263] hover:text-[#1f7a4a] font-semibold transition-colors">
              contato@bubuya.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
