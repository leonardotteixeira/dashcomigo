import { useState } from "react";
import { useNavigate } from "react-router";
import { Crown, Check, ArrowLeft, Loader2 } from "lucide-react";
import { Card } from "../components/ui/card";
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button variant="ghost" onClick={() => navigate("/pricing")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos planos
        </Button>

        <Card className="p-8 border-2 border-slate-200 shadow-xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">Upgrade para PRO</h1>

          <form onSubmit={handleSubmit} className="mt-4">
            <label className="block text-sm font-medium text-slate-700 text-left mb-1">
              CPF ou CNPJ
            </label>
            <input
              type="text"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={18}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-900 focus:border-purple-500 focus:outline-none transition-colors mb-4"
              disabled={loading}
              required
            />

            {error && (
              <Alert className="bg-red-50 border-2 border-red-200 text-left mb-4">
                <AlertDescription className="text-red-900">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                "Continuar para pagamento"
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-sm text-slate-600 text-left">
            {[
              "1º mês por R$ 9,90",
              "A partir do 2º mês: R$ 29,90/mês",
              "PIX, boleto ou cartão",
              "Cancele quando quiser",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 mt-6">
            🔒 Pagamento 100% seguro processado pela <strong>Asaas</strong>
          </p>
        </Card>
      </div>
    </div>
  );
}
