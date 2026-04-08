import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { KeyRound } from "lucide-react";

export function PasswordResetRedirect() {
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      navigate(`/auth/confirm-password-reset?token=${token}`);
    } else {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/10 rounded-2xl shadow-sm mb-4 animate-pulse">
          <KeyRound className="w-8 h-8 text-[#28A263]" />
        </div>
        <p className="text-[#001529] font-semibold text-lg mb-2">Redirecionando...</p>
        <p className="text-[rgba(0,21,41,0.6)] text-sm">Aguarde um momento</p>
      </div>
    </div>
  );
}
