import { useState } from "react";
import { useNavigate } from "react-router";
import { Crown, Check, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function formatCpfCnpj(value: string) {
  const digits = value.replace(/\D/g, "");
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

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) { navigate("/login"); return null; }
  if (user.plan === "pro") { navigate("/app"); return null; }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const digits = cpfCnpj.replace(/\D/g, "");
    if (digits.length !== 11 && digits.length !== 14) {
      setError("CPF deve ter 11 digitos ou CNPJ 14 digitos.");
      return;
    }

    if (!API_URL) {
      setError("URL da API de pagamentos nao configurada.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          name: user!.name,
          email: user!.email,
          cpfCnpj: digits,
        }),
      });

      const text = await res.text();
      if (!text) throw new Error("Servidor retornou resposta vazia.");
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.error || "Erro ao criar cobranca");

      window.location.href = data.paymentUrl;
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com o servidor de pagamentos.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/pricing")}
          className="mb-6 text-[#A1A1A1] hover:text-white hover:bg-white/5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos planos
        </Button>

        <div className="p-8 bg-[#1B1B1B] rounded-3xl border border-white/5 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/20 rounded-2xl mb-4">
            <Crown className="w-8 h-8 text-[#2DDB81]" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Upgrade para PRO</h1>
          <p className="text-[#A1A1A1] mb-6">Desbloqueie todas as funcionalidades</p>

          <form onSubmit={handleSubmit} className="mt-6">
            <label className="block text-sm font-medium text-[#A1A1A1] text-left mb-2">
              CPF ou CNPJ
            </label>
            <input
              type="text"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={18}
              className="w-full px-4 py-3 bg-[#141414] border border-white/10 text-white placeholder:text-[#686F6F] rounded-xl focus:border-[#28A263] focus:outline-none transition-colors mb-4"
              disabled={loading}
              required
            />

            {error && (
              <Alert className="bg-red-500/10 border border-red-500/20 text-left mb-4">
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#28A263] hover:bg-[#2DDB81] text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2 inline" />
                  Processando...
                </>
              ) : (
                "Continuar para pagamento"
              )}
            </button>
          </form>

          {/* Price highlight */}
          <div className="mb-6 p-4 bg-[#28A263]/10 border border-[#28A263]/20 rounded-2xl">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-4xl font-bold text-[#2DDB81]">R$ 9,90</span>
              <span className="text-[#A1A1A1]">/mês</span>
            </div>
            <p className="text-xs text-[#A1A1A1]">Apenas no 1º mês • Depois R$ 29,90/mês</p>
          </div>

          {/* Benefits list */}
          <div className="space-y-3 text-left">
            {[
              "Fluxo de caixa: lançamentos ilimitados",
              "Simulador de Preço Ideal (PRO)",
              "Simulador de Lucro com projeções (PRO)",
              "Propostas comerciais ilimitadas",
              "Relatórios e exportações completos",
              "PIX, boleto ou cartão",
              "Cancele quando quiser",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#2DDB81] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[#A1A1A1]">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#686F6F] mt-6">
            🔒 Pagamento 100% seguro processado pela <strong>Asaas</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
