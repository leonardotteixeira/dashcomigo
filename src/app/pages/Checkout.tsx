import { useState } from "react";
import { useNavigate } from "react-router";
import { Crown, Check, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuth } from "../contexts/AuthContext";
import { pb } from "../../lib/pocketbase";

// Usa URL relativa como fallback — frontend e API rodam no mesmo servidor (Railway)
const API_URL = import.meta.env.VITE_API_URL || "";

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
  const [name, setName] = useState(user?.name || "");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) { navigate("/login"); return null; }
  if (user.plan === "pro") { navigate("/app"); return null; }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const digits = cpfCnpj.replace(/\D/g, "");
    if (digits.length !== 11 && digits.length !== 14) {
      setError("CPF deve ter 11 dígitos ou CNPJ 14 dígitos.");
      return;
    }
    if (!name.trim() || name.trim().length < 2) {
      setError("Informe seu nome completo.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${pb.authStore.token}`,
        },
        body: JSON.stringify({
          userId: user!.id,
          name: name.trim(),
          email: user!.email,
          cpfCnpj: digits,
        }),
      });

      const text = await res.text();
      if (!text) throw new Error("Servidor retornou resposta vazia.");
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.error || "Erro ao criar cobrança");

      // Salva paymentId para verificação na página de sucesso
      sessionStorage.setItem("asaas_payment_id", data.paymentId);
      sessionStorage.setItem("asaas_user_id", user!.id);
      window.location.href = data.paymentUrl;
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com o servidor de pagamentos.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/pricing")}
          className="mb-6 text-[#0E3B2E] hover:text-[#28A263] hover:bg-[#F0F8F5] rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos planos
        </Button>

        <div className="p-8 bg-white rounded-3xl border border-[#E8EBF1] shadow-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/10 rounded-2xl mb-4">
            <Crown className="w-8 h-8 text-[#28A263]" />
          </div>

          <h1 className="text-3xl font-bold text-[#0E3B2E] mb-2">Upgrade para Premium</h1>
          <p className="text-[rgba(0,21,41,0.6)] mb-4">Desbloqueie todas as funcionalidades</p>

          {/* Price highlight */}
          <div className="mb-6 p-4 bg-[#F0F8F5] border border-[#28A263]/20 rounded-2xl">
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-4xl font-bold text-[#28A263]">R$ 9,90</span>
              <span className="text-[rgba(0,21,41,0.6)]">/mês</span>
            </div>
            <p className="text-xs text-[rgba(0,21,41,0.6)]">Apenas no 1º mês • Depois R$ 29,90/mês</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0E3B2E] text-left mb-2">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full px-4 py-3 bg-white border border-[#E8EBF1] text-[#0E3B2E] placeholder:text-[rgba(0,21,41,0.4)] rounded-xl focus:border-[#28A263] focus:outline-none focus:ring-1 focus:ring-[#28A263]/20 transition-colors"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0E3B2E] text-left mb-2">
                CPF ou CNPJ
              </label>
              <input
                type="text"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={18}
                className="w-full px-4 py-3 bg-white border border-[#E8EBF1] text-[#0E3B2E] placeholder:text-[rgba(0,21,41,0.4)] rounded-xl focus:border-[#28A263] focus:outline-none focus:ring-1 focus:ring-[#28A263]/20 transition-colors"
                disabled={loading}
                required
              />
            </div>

            {error && (
              <Alert className="bg-red-50 border border-red-200 text-left">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#28A263] hover:bg-[#1f7a4a] text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Benefits list */}
          <div className="space-y-3 text-left">
            {[
              "Fluxo de caixa: lançamentos ilimitados",
              "Simulador de Preço Ideal (Premium)",
              "Simulador de Lucro com projeções (Premium)",
              "Propostas comerciais ilimitadas",
              "Relatórios e exportações completos",
              "PIX, boleto ou cartão",
              "Cancele quando quiser",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#28A263] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[rgba(0,21,41,0.6)]">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[rgba(0,21,41,0.4)] mt-6">
            🔒 Pagamento 100% seguro processado pela <strong>Asaas</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
