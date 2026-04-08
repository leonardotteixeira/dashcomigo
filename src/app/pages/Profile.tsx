import { AvatarUpload } from "../components/AvatarUpload";
import { ProfileForm } from "../components/ProfileForm";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { ArrowLeft, Bell, User, Lock, Shield } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { colors } from "../../utils/designTokens";

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
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate("/app/dashboard")}
          className="mb-6 rounded-lg transition-colors"
          style={{ color: colors.textSecondary }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>Meu Perfil</h1>
        <p style={{ color: colors.textSecondary }}>Gerencie suas informações pessoais e segurança</p>
      </div>

      {/* Content */}
      <div className="grid gap-6">
        {/* Avatar Section */}
        <div
          className="rounded-2xl p-6 sm:p-8 shadow-sm border transition-all"
          style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${colors.secondary}/10` }}
            >
              <User className="w-5 h-5" style={{ color: colors.secondary }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              Foto de Perfil
            </h2>
          </div>
          <AvatarUpload />
        </div>

        {/* Personal Info Section */}
        <div
          className="rounded-2xl p-6 sm:p-8 shadow-sm border transition-all"
          style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${colors.primary}/10` }}
            >
              <User className="w-5 h-5" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              Informações Pessoais
            </h2>
          </div>
          <ProfileForm />
        </div>

        {/* Security Section */}
        <div
          className="rounded-2xl p-6 sm:p-8 shadow-sm border transition-all"
          style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${colors.danger}/10` }}
            >
              <Lock className="w-5 h-5" style={{ color: colors.danger }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                Segurança
              </h2>
            </div>
          </div>
          <p className="text-sm mb-6" style={{ color: colors.textSecondary }}>
            Altere sua senha para manter sua conta segura
          </p>
          <ChangePasswordForm />
        </div>

        {/* Notifications Section */}
        <div
          className="rounded-2xl p-6 sm:p-8 shadow-sm border transition-all"
          style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${colors.warning}/10` }}
            >
              <Bell className="w-5 h-5" style={{ color: colors.warning }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              Notificações
            </h2>
          </div>

          <div className="space-y-4">
            <label
              className="flex items-start gap-3 cursor-pointer p-4 rounded-xl transition-colors border"
              style={{
                backgroundColor: colors.bgLighter,
                borderColor: colors.borderDefault,
              }}
            >
              <input
                type="checkbox"
                checked={user?.receivePaymentReminders ?? true}
                onChange={handleTogglePaymentReminders}
                disabled={isUpdating}
                className="w-4 h-4 cursor-pointer mt-1 flex-shrink-0 accent-[#28A263]"
              />
              <div className="flex-1">
                <p className="font-medium" style={{ color: colors.textPrimary }}>
                  Lembretes de Cobrança
                </p>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Receba emails automáticos para acompanhar propostas vencidas e contas a pagar
                </p>
              </div>
            </label>

            {user?.receivePaymentReminders && (
              <div
                className="ml-0 p-4 rounded-xl border"
                style={{
                  backgroundColor: `${colors.primary}/10`,
                  borderColor: `${colors.primary}/20`,
                }}
              >
                <p className="text-sm" style={{ color: colors.primary }}>
                  ✓ Você receberá até <strong>3 lembretes</strong> para cada proposta/conta vencida
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
