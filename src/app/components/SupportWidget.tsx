import { MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export function SupportWidget() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!user || user.isAdmin) return null;
  if (pathname === "/app/suporte") return null;

  return (
    <button
      onClick={() => navigate("/app/suporte")}
      title="Abrir suporte"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#0E3B2E] text-white shadow-lg hover:bg-[#082219] hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
