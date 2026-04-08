import { X, Zap, Check, TrendingUp, Shield, Clock, Crown } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: "limit_reached" | "feature_locked" | "export_blocked";
  featureName?: string;
}

export default function PaywallModal({ isOpen, onClose, trigger, featureName }: PaywallModalProps) {
  const content = {
    limit_reached: {
      title: "Aproveite todos os recursos",
      subtitle: "Continue gerenciando suas finanças sem interrupções",
      description: "Você está próximo do limite do plano gratuito. Com o plano PRO, você não precisa se preocupar com limites.",
    },
    feature_locked: {
      title: `Desbloqueie ${featureName || "este recurso"}`,
      subtitle: "Turbine sua gestão financeira com o plano PRO",
      description: "Este recurso está disponível exclusivamente para usuários PRO. Faça upgrade e aproveite todas as funcionalidades.",
    },
    export_blocked: {
      title: "Continue exportando seus relatórios",
      subtitle: "Nunca mais fique sem exportações",
      description: "Você atingiu o limite de exportações do plano gratuito. Com o plano PRO, exporte quantas vezes precisar.",
    },
  };

  const current = content[trigger];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 bg-white border-none overflow-hidden">
        {/* Header mais limpo */}
        <div className="bg-gradient-to-br from-[#001529] via-[#002140] to-[#003a6d] text-white p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
              <Crown className="w-6 h-6 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">
              {current.title}
            </h2>
            
            <p className="text-white/90 text-sm">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Body com benefícios */}
        <div className="p-8">
          <p className="text-sm text-[#001529]/70 mb-6">
            {current.description}
          </p>

          {/* Benefícios em destaque */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#001529]">
                  Transações e exportações ilimitadas
                </p>
                <p className="text-xs text-[#001529]/60">
                  Sem se preocupar com limites mensais
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#001529]">
                  Relatórios avançados e insights
                </p>
                <p className="text-xs text-[#001529]/60">
                  Análises detalhadas para melhores decisões
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#001529]">
                  Integrações e automações
                </p>
                <p className="text-xs text-[#001529]/60">
                  Conecte com seu banco e economize tempo
                </p>
              </div>
            </div>
          </div>

          {/* Preço com ancoragem */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 mb-5 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#001529]/60 mb-1">A partir de</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#001529]">R$ 29,90</span>
                  <span className="text-sm text-[#001529]/60">/mês</span>
                </div>
                <p className="text-xs text-[#001529]/60 mt-1">
                  Menos de R$ 1,00 por dia
                </p>
              </div>
              <div className="text-right">
                <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-1">
                  -40% OFF
                </div>
                <p className="text-xs text-[#001529]/60 line-through">R$ 49,90</p>
              </div>
            </div>
          </div>

          {/* CTA Principal */}
          <button className="w-full bg-gradient-to-r from-[#003a6d] to-[#0066FF] text-white font-bold py-4 rounded-xl hover:from-[#002a5d] hover:to-[#0056EF] transition-all shadow-lg mb-3">
            Fazer Upgrade para PRO
          </button>

          {/* Redutores de fricção */}
          <div className="flex items-center justify-center gap-6 text-xs text-[#001529]/60">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>7 dias grátis</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}