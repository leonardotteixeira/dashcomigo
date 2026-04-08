import { AvatarUpload } from "../components/AvatarUpload";
import { ProfileForm } from "../components/ProfileForm";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export function Profile() {
  const navigate = useNavigate();
  const { user, updatePaymentReminders } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTogglePaymentReminders = async () => {
    if (!user) return;
    try {
      setIsUpdating(true);
      await updatePaymentReminders(!user.receivePaymentReminders);
    } catch (error) {
      console.error("Error updating payment reminders:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/app/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Meu Perfil</h1>
          <p className="text-sm text-muted-foreground mt-2">Gerencie suas informações pessoais e segurança</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid gap-6">
          {/* Avatar Section */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Foto de Perfil</h2>
            <AvatarUpload />
          </div>

          {/* Personal Info Section */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Informações Pessoais</h2>
            <ProfileForm />
          </div>

          {/* Security Section */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-2">Segurança</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Altere sua senha para manter sua conta segura
            </p>
            <ChangePasswordForm />
          </div>

          {/* Notifications Section */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Notificações</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={user?.receivePaymentReminders ?? true}
                  onChange={handleTogglePaymentReminders}
                  disabled={isUpdating}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-foreground font-medium">Lembretes de Cobrança</p>
                  <p className="text-sm text-muted-foreground">
                    Receba emails automáticos para acompanhar propostas vencidas e contas a pagar
                  </p>
                </div>
              </label>

              {user?.receivePaymentReminders && (
                <div className="ml-7 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-xs text-primary">
                    ✓ Você receberá até <strong>3 lembretes</strong> para cada proposta/conta vencida
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
