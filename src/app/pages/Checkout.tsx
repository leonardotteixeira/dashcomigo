import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Crown, Check, ArrowLeft, Loader2 } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.plan === "pro") { navigate("/app"); return; }

    async function createPayment() {
      try {
        const res = await fetch(`${API_URL}/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user!.id,
            name: user!.name,
            email: user!.email,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao criar cobrança");

        // Redireciona para a página de pagamento do Asaas
        window.location.href = data.paymentUrl;
      } catch (err: any) {
        setError(err.message || "Erro ao conectar com o servidor de pagamentos.");
        setLoading(false);
      }
    }

    createPayment();
  }, [user, navigate]);

  if (!user) return null;

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

          {loading && !error && (
            <>
              <p className="text-slate-600 mb-6">Preparando seu pagamento...</p>
              <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-6" />
              <p className="text-sm text-slate-500">
                Você será redirecionado para a página de pagamento segura do Asaas.
              </p>
            </>
          )}

          {error && (
            <>
              <Alert className="bg-red-50 border-2 border-red-200 text-left mb-6">
                <AlertDescription className="text-red-900">
                  {error}
                </AlertDescription>
              </Alert>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </Button>
            </>
          )}

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
