import { X, Check, Shield, MessageCircle, Zap } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { useNavigate } from "react-router";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: "limit_reached" | "feature_locked" | "export_blocked";
  featureName?: string;
}

const CONTENT = {
  limit_reached: {
    eyebrow: "Limite atingido",
    title: "Você não precisa parar aqui",
    body: "Seus lançamentos do mês acabaram. Com o Essencial ou 360, você registra tudo sem interrupção — e o negócio continua rodando.",
  },
  feature_locked: {
    eyebrow: "Recurso Premium",
    title: (name?: string) => `${name || "Este recurso"} não está no Gratuito`,
    body: "Desbloqueie a plataforma completa com o Essencial, ou tenha a plataforma + um especialista humano com o 360.",
  },
  export_blocked: {
    eyebrow: "Exportações esgotadas",
    title: "Seus relatórios merecem sair do sistema",
    body: "Você atingiu o limite de exportações do mês. Com o Essencial ou 360, exporte quando quiser — sem burocracia.",
  },
};

export default function PaywallModal({ isOpen, onClose, trigger, featureName }: PaywallModalProps) {
  const navigate = useNavigate();
  const c = CONTENT[trigger];
  const title = typeof c.title === "function" ? c.title(featureName) : c.title;

  const handleUpgrade = (plan: "essencial" | "360") => {
    onClose();
    navigate("/checkout");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 border-none overflow-hidden"
        style={{ background: "#F4EFE6" }}>

        {/* Header */}
        <div className="p-7 pb-5 relative" style={{ background: "#0E3B2E" }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16"
            style={{ background: "rgba(127,209,159,0.08)" }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(244,239,230,0.1)", color: "rgba(244,239,230,0.7)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,239,230,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(244,239,230,0.1)"; }}
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(127,209,159,0.8)" }}>
            {c.eyebrow}
          </p>
          <h2 className="text-xl font-bold leading-snug" style={{ color: "#F4EFE6" }}>{title}</h2>
        </div>

        {/* Body */}
        <div className="p-7">
          <p className="text-sm leading-relaxed mb-7" style={{ color: "rgba(14,59,46,0.7)" }}>
            {c.body}
          </p>

          {/* Plan comparison — compact */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Essencial */}
            <div className="p-4 rounded-xl" style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.1)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(14,59,46,0.5)" }}>Essencial</p>
              <p className="text-lg font-bold mb-1" style={{ color: "#0E3B2E" }}>R$ 29,90</p>
              <p className="text-xs mb-3" style={{ color: "rgba(14,59,46,0.5)" }}>/mês</p>
              {["Plataforma completa", "Sem limites", "Suporte por chat"].map(f => (
                <div key={f} className="flex items-center gap-1.5 mb-1">
                  <Check className="w-3 h-3 flex-shrink-0" style={{ color: "#1F5A3A" }} />
                  <span className="text-xs" style={{ color: "rgba(14,59,46,0.7)" }}>{f}</span>
                </div>
              ))}
              <button
                onClick={() => handleUpgrade("essencial")}
                className="w-full mt-3 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{ background: "transparent", color: "#0E3B2E", border: "1.5px solid #0E3B2E" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#0E3B2E"; e.currentTarget.style.color = "#F4EFE6"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0E3B2E"; }}
              >
                Assinar Essencial
              </button>
            </div>

            {/* 360 */}
            <div className="p-4 rounded-xl relative" style={{ background: "#0E3B2E" }}>
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
                style={{ background: "#7FD19F", color: "#0E3B2E" }}>
                Recomendado
              </div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(127,209,159,0.6)" }}>360</p>
              <div className="mb-1">
                <p className="text-lg font-bold" style={{ color: "#7FD19F" }}>R$ 59,90</p>
                <p className="text-xs line-through" style={{ color: "rgba(244,239,230,0.35)" }}>R$ 99,90/mês</p>
              </div>
              <p className="text-xs mb-3" style={{ color: "rgba(244,239,230,0.4)" }}>preço de lançamento</p>
              {["Tudo do Essencial", "+ Especialista humano", "WhatsApp + chat"].map((f, i) => (
                <div key={f} className="flex items-center gap-1.5 mb-1">
                  <Check className="w-3 h-3 flex-shrink-0" style={{ color: i === 1 ? "#7FD19F" : "rgba(127,209,159,0.6)" }} />
                  <span className="text-xs font-medium" style={{ color: i === 1 ? "#7FD19F" : "rgba(244,239,230,0.75)", fontWeight: i === 1 ? "600" : "400" }}>{f}</span>
                </div>
              ))}
              <button
                onClick={() => handleUpgrade("360")}
                className="w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all"
                style={{ background: "#7FD19F", color: "#0E3B2E" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F4EFE6"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#7FD19F"; }}
              >
                Quero o 360 →
              </button>
            </div>
          </div>

          {/* Reassurance */}
          <div className="flex items-center justify-center gap-5">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" style={{ color: "rgba(14,59,46,0.5)" }} />
              <span className="text-xs" style={{ color: "rgba(14,59,46,0.5)" }}>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" style={{ color: "rgba(14,59,46,0.5)" }} />
              <span className="text-xs" style={{ color: "rgba(14,59,46,0.5)" }}>Acesso imediato</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
