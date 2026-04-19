import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { pb } from "../../lib/pocketbase";

export function ConfirmEmail() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    pb.collection("profiles")
      .confirmVerification(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">

        {status === "loading" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/10 rounded-2xl shadow-sm mb-6">
              <Loader2 className="w-8 h-8 text-[#28A263] animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-[#0E3B2E] mb-2">Verificando seu e-mail...</h1>
            <p className="text-[rgba(0,21,41,0.6)]">Aguarde um momento.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/10 rounded-2xl shadow-sm mb-6">
              <CheckCircle className="w-8 h-8 text-[#28A263]" />
            </div>
            <h1 className="text-2xl font-bold text-[#0E3B2E] mb-2">E-mail confirmado! 🎉</h1>
            <p className="text-[rgba(0,21,41,0.6)] mb-8">Sua conta foi verificada com sucesso. Agora você pode usar o DashComigo.</p>
            <button
              onClick={() => navigate("/app")}
              className="bg-[#28A263] hover:bg-[#1f7a4a] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Ir para o app
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl shadow-sm mb-6">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#0E3B2E] mb-2">Link inválido ou expirado</h1>
            <p className="text-[rgba(0,21,41,0.6)] mb-8">
              O link de verificação é inválido ou já expirou. Faça login e solicite um novo link.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#28A263] hover:bg-[#1f7a4a] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Ir para o login
            </button>
          </>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-[rgba(0,21,41,0.6)] text-sm">
          <Mail className="w-4 h-4 text-[#28A263]" />
          <span>contato@bubuya.com.br</span>
        </div>

      </div>
    </div>
  );
}
