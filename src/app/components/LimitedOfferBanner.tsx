import { Crown, X, Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function LimitedOfferBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-[#001529] via-[#003a6d] to-[#0066FF] text-white border-b border-white/10 relative z-[60]">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between py-2.5 gap-4">
          {/* Left: Message */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="hidden sm:flex w-7 h-7 rounded-lg bg-amber-500 items-center justify-center flex-shrink-0">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">
                  Plano PRO com 40% OFF
                </span>
                <span className="hidden md:inline text-xs text-white/80">
                  • De R$ 49,90 por apenas
                </span>
                <span className="text-sm font-bold">
                  R$ 29,90/mês
                </span>
              </div>
            </div>
          </div>

          {/* Right: Timer + CTA */}
          <div className="flex items-center gap-3">
            {/* Timer - apenas desktop */}
            <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-medium text-white/90">
                Termina em:
              </span>
              <span className="text-sm font-mono font-bold">
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>

            {/* CTA Button */}
            <button className="bg-white text-[#003a6d] font-semibold px-4 py-1.5 rounded-lg hover:bg-white/95 transition-all text-sm whitespace-nowrap flex items-center gap-1.5 shadow-lg">
              <span>Assinar PRO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
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