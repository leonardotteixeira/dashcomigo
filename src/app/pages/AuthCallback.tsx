import { useEffect } from "react";
import { useNavigate } from "react-router";
import { pb } from "../../lib/pocketbase";
import { LayoutDashboard } from "lucide-react";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // PocketBase handles OAuth callback automatically
    // Just check if user is authenticated
    if (pb.authStore.isValid && pb.authStore.model) {
      navigate("/app", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#28A263]/10 rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-4 animate-pulse">
          <LayoutDashboard className="w-8 h-8 text-[#28A263]" />
        </div>
        <p className="text-[#001529] font-semibold text-lg mb-1">Entrando...</p>
        <p className="text-[rgba(0,21,41,0.6)] text-sm">Aguarde um momento</p>
      </div>
    </div>
  );
}
