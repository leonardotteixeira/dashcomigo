import {
  Bell, X, CheckCircle, AlertCircle, Clock, TrendingUp,
  DollarSign, Target, AlertTriangle, CheckCheck,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useNotifications, type NotificationType } from "../contexts/NotificationsContext";

// ─── Icon + colour mapping per notification type ────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; color: string }
> = {
  payment_received:    { icon: CheckCircle,  color: "text-emerald-600 bg-emerald-50" },
  receivable_overdue:  { icon: AlertCircle,  color: "text-red-600 bg-red-50" },
  receivable_due_soon: { icon: Clock,        color: "text-amber-600 bg-amber-50" },
  payable_overdue:     { icon: AlertTriangle,color: "text-red-600 bg-red-50" },
  payable_due_soon:    { icon: Clock,        color: "text-amber-600 bg-amber-50" },
  negative_balance:    { icon: TrendingUp,   color: "text-red-600 bg-red-50" },
  high_costs:          { icon: AlertCircle,  color: "text-orange-600 bg-orange-50" },
  goal_reached:        { icon: Target,       color: "text-emerald-600 bg-emerald-50" },
  faturamento_limit:   { icon: DollarSign,   color: "text-amber-600 bg-amber-50" },
};

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1)  return "agora mesmo";
  if (minutes < 60) return `${minutes} min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  if (days === 1)   return "ontem";
  return `${days} dias atrás`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleClick = (id: string, href?: string) => {
    markAsRead(id);
    if (href) {
      navigate(href);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Notificações"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-destructive rounded-full text-[10px] font-bold text-white flex items-center justify-center px-0.5">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-xl shadow-xl z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
            <div>
              <h3 className="font-semibold text-foreground">Notificações</h3>
              <p className="text-xs text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} não ${unreadCount === 1 ? "lida" : "lidas"}`
                  : "Tudo em dia!"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 hover:bg-secondary rounded text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  title="Marcar todas como lidas"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-secondary rounded"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground text-sm">Nenhuma notificação</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Você será alertado sobre vencimentos, pagamentos e metas.
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = TYPE_CONFIG[n.type] ?? {
                  icon: Bell,
                  color: "text-muted-foreground bg-muted",
                };
                const Icon = cfg.icon;

                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n.id, n.href)}
                    className={`w-full text-left p-4 border-b border-border hover:bg-secondary/50 transition-colors ${
                      !n.read ? "bg-primary/[0.03]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-lg ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <p className="font-semibold text-sm text-foreground leading-tight">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-border flex-shrink-0">
              <button
                onClick={() => { markAllAsRead(); setIsOpen(false); }}
                className="w-full text-sm text-primary hover:underline font-medium py-1"
              >
                Marcar todas como lidas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
