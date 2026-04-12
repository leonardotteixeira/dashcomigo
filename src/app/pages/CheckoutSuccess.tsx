import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Crown, Check, ArrowRight, Sparkles, Zap, Gift, Loader2, AlertCircle } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";

type Status = "polling" | "success" | "timeout";

const MAX_ATTEMPTS = 12;   // 12 × 3s = 36 segundos máximo
const POLL_INTERVAL = 3000; // 3 segundos

export function CheckoutSuccess() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [status, setStatus] = useState<Status>(() =>
    user?.plan === "pro" ? "success" : "polling"
  );
  const attemptRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Já é PRO — mostra sucesso imediatamente
    if (user?.plan === "pro") {
      setStatus("success");
      return;
    }

    // Não está logado — manda pro login
    if (!user) {
      navigate("/login");
      return;
    }

    // Polling: aguarda webhook da Asaas atualizar o plano
    const poll = async () => {
      attemptRef.current += 1;
      await refreshUser();

      // refreshUser atualiza o contexto; o useEffect re-executa quando user muda
      if (attemptRef.current >= MAX_ATTEMPTS) {
        setStatus("timeout");
      } else {
        timerRef.current = setTimeout(poll, POLL_INTERVAL);
      }
    };

    timerRef.current = setTimeout(poll, POLL_INTERVAL);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user?.plan]); // re-executa quando o plano mudar

  // ── Loading (aguardando webhook) ──────────────────────────────────────────
  if (status === "polling") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#28A263]/10 rounded-3xl mb-6">
            <Loader2 className="w-10 h-10 text-[#28A263] animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-[#001529] mb-3">
            Confirmando seu pagamento...
          </h1>
          <p className="text-[rgba(0,21,41,0.6)] mb-6">
            Aguarde enquanto processamos seu upgrade para PRO.
            <br />Isso leva apenas alguns segundos.
          </p>
          <div className="flex justify-center gap-2">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i < attemptRef.current
                    ? "w-4 bg-[#28A263]"
                    : "w-2 bg-[#E8EBF1]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Timeout (webhook demorou demais) ─────────────────────────────────────
  if (status === "timeout") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-50 rounded-3xl mb-6">
            <AlertCircle className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#001529] mb-3">
            Pagamento em processamento
          </h1>
          <p className="text-[rgba(0,21,41,0.6)] mb-2">
            Seu pagamento foi recebido, mas a confirmação está demorando mais que o esperado.
          </p>
          <p className="text-[rgba(0,21,41,0.6)] mb-8">
            Seu plano será atualizado automaticamente em minutos.
            Se não receber a confirmação em 10 minutos, entre em contato.
          </p>
          <div className="space-y-3">
            <Button
              className="w-full bg-[#28A263] hover:bg-[#1f7a4a] text-white"
              onClick={async () => {
                setStatus("polling");
                attemptRef.current = 0;
              }}
            >
              Verificar novamente
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/app")}
            >
              Ir para o Dashboard
            </Button>
            <p className="text-sm text-[rgba(0,21,41,0.6)]">
              Suporte:{" "}
              <a
                href="mailto:contato@bubuya.com.br"
                className="text-[#28A263] font-semibold hover:underline"
              >
                contato@bubuya.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Sucesso ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="p-12 border border-[#E8EBF1] bg-white text-center relative overflow-hidden shadow-sm">
          {/* Decoração de fundo */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Zap className="absolute top-8 left-8 w-10 h-10 text-[#28A263] opacity-5 animate-bounce" />
            <Sparkles className="absolute top-16 right-8 w-8 h-8 text-[#28A263] opacity-5 animate-pulse" />
            <Gift className="absolute bottom-16 left-16 w-10 h-10 text-[#28A263] opacity-5 animate-bounce" />
            <Check className="absolute bottom-8 right-16 w-8 h-8 text-[#28A263] opacity-5 animate-pulse" />
          </div>

          <div className="relative z-10">
            {/* Ícone animado */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#28A263]/10 rounded-3xl shadow-md mb-6 animate-bounce">
              <Crown className="w-12 h-12 text-[#28A263]" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#28A263]/10 text-[#28A263] rounded-full text-sm font-bold mb-4">
              <Check className="w-4 h-4" />
              Pagamento Confirmado
            </div>

            <h1 className="text-4xl font-bold text-[#001529] mb-3">
              Bem-vindo ao PRO! 🎉
            </h1>
            <p className="text-lg text-[rgba(0,21,41,0.6)] mb-4">
              Sua conta foi atualizada com sucesso
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0F8F5] border border-[#28A263]/20 rounded-xl mb-8">
              <Crown className="w-5 h-5 text-[#28A263]" />
              <span className="font-bold text-[#28A263]">
                {user?.name} • Plano PRO Ativo
              </span>
            </div>

            {/* Recursos desbloqueados */}
            <Card className="p-6 bg-[#F9FAFB] border border-[#E8EBF1] mb-8 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#28A263]" />
                <h3 className="font-bold text-[#001529]">Recursos Desbloqueados:</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Fluxo de caixa ilimitado",
                  "Simulador de Preço Ideal",
                  "Simulador de Lucro",
                  "Propostas ilimitadas",
                  "Relatórios completos",
                  "Exportação em PDF",
                  "Histórico completo",
                  "Suporte prioritário",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
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
                onClick={() => navigate("/app/dashboard")}
              >
                Explorar todos os recursos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border border-[#E8EBF1] text-[#001529] hover:bg-[#F9FAFB]"
                onClick={() => navigate("/app/preco")}
              >
                Testar Simulador de Preço
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-[#E8EBF1]">
              <p className="text-sm text-[rgba(0,21,41,0.6)]">
                Obrigado por confiar no <strong>Meu Fluxo</strong>!<br />
                Estamos aqui para ajudar seu negócio a crescer.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-[rgba(0,21,41,0.6)]">
            Precisa de ajuda?{" "}
            <a
              href="mailto:contato@bubuya.com.br"
              className="text-[#28A263] hover:text-[#1f7a4a] font-semibold transition-colors"
            >
              contato@bubuya.com.br
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
