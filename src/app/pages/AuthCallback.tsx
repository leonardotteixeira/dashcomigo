import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";
import { LayoutDashboard } from "lucide-react";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Processa o token de OAuth da URL
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/app", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#28A263]/20 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 animate-pulse">
          <LayoutDashboard className="w-8 h-8 text-[#2DDB81]" />
        </div>
        <p className="text-white font-semibold text-lg mb-1">Entrando...</p>
        <p className="text-[#A1A1A1] text-sm">Aguarde um momento</p>
      </div>
    </div>
  );
}
