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
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">

        {status === "loading" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/20 rounded-2xl shadow-lg mb-6">
              <Loader2 className="w-8 h-8 text-[#2DDB81] animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verificando seu e-mail...</h1>
            <p className="text-[#A1A1A1]">Aguarde um momento.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/20 rounded-2xl shadow-lg mb-6">
              <CheckCircle className="w-8 h-8 text-[#2DDB81]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">E-mail confirmado! 🎉</h1>
            <p className="text-[#A1A1A1] mb-8">Sua conta foi verificada com sucesso. Agora você pode usar o Bubuya.</p>
            <button
              onClick={() => navigate("/app")}
              className="bg-[#28A263] hover:bg-[#2DDB81] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Ir para o app
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-2xl shadow-lg mb-6">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Link inválido ou expirado</h1>
            <p className="text-[#A1A1A1] mb-8">
              O link de verificação é inválido ou já expirou. Faça login e solicite um novo link.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#28A263] hover:bg-[#2DDB81] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Ir para o login
            </button>
          </>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-[#A1A1A1] text-sm">
          <Mail className="w-4 h-4 text-[#2DDB81]" />
          <span>contato@bubuya.com.br</span>
        </div>

      </div>
    </div>
  );
}
