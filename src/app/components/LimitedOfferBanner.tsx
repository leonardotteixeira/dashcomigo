import { Crown, X, Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  onDismiss?: () => void;
}

export default function LimitedOfferBanner({ onDismiss }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible || user?.plan === "pro") return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className="text-white border-b border-white/10 relative z-[60]"
      style={{ background: "#0E3B2E" }}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between py-2.5 gap-4">
          {/* Left */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="hidden sm:flex w-7 h-7 rounded-lg items-center justify-center flex-shrink-0"
              style={{ background: "#7FD19F" }}>
              <Crown className="w-4 h-4" style={{ color: "#0E3B2E" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm" style={{ color: "#F4EFE6" }}>
                  Plano PRO com 40% OFF
                </span>
                <span className="hidden md:inline text-xs" style={{ color: "rgba(244,239,230,0.7)" }}>
                  • De R$ 49,90 por apenas
                </span>
                <span className="text-sm font-bold" style={{ color: "#7FD19F" }}>
                  R$ 29,90/mês
                </span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border"
              style={{ background: "rgba(244,239,230,0.08)", borderColor: "rgba(244,239,230,0.2)" }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#7FD19F" }} />
              <span className="text-xs font-medium" style={{ color: "rgba(244,239,230,0.8)" }}>
                Termina em:
              </span>
              <span className="text-sm font-mono font-bold" style={{ color: "#F4EFE6" }}>
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="font-semibold px-4 py-1.5 rounded-lg transition-all text-sm whitespace-nowrap flex items-center gap-1.5 shadow-lg"
              style={{ background: "#7FD19F", color: "#0E3B2E" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F4EFE6"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#7FD19F"; }}
            >
              <span>Assinar PRO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg transition-colors flex-shrink-0"
              style={{ color: "rgba(244,239,230,0.6)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(244,239,230,0.1)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              aria-label="Fechar banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
