import { Bell, X, CheckCircle, AlertCircle, Info, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";

const notifications = [
  {
    id: 1,
    type: "success",
    icon: CheckCircle,
    title: "Pagamento Recebido",
    message: "Cliente XYZ - R$ 3.500,00 creditado",
    time: "5 min atrás",
    unread: true,
  },
  {
    id: 2,
    type: "warning",
    icon: AlertCircle,
    title: "Conta Vencendo",
    message: "Aluguel vence em 2 dias - R$ 2.500,00",
    time: "1 hora atrás",
    unread: true,
  },
  {
    id: 3,
    type: "info",
    icon: TrendingUp,
    title: "Meta Atingida",
    message: "Você bateu a meta mensal de receitas!",
    time: "3 horas atrás",
    unread: false,
  },
  {
    id: 4,
    type: "upgrade",
    icon: DollarSign,
    title: "Economia Detectada",
    message: "Upgrade PRO pode economizar R$ 1.200/ano",
    time: "Hoje",
    unread: true,
  },
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-success bg-success/10";
      case "warning":
        return "text-warning bg-warning/10";
      case "info":
        return "text-accent bg-accent/10";
      case "upgrade":
        return "text-amber-500 bg-amber-500/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-xl shadow-xl z-50 max-h-[600px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-foreground">Notificações</h3>
                <p className="text-xs text-muted-foreground">
                  Você tem {unreadCount} não lidas
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-secondary rounded"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                const iconColor = getIconColor(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                      notification.unread ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-foreground">
                            {notification.title}
                          </h4>
                          {notification.unread && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-border">
              <button className="w-full text-sm text-primary hover:underline font-medium">
                Ver todas as notificações
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
