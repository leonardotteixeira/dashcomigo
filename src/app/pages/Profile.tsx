import { AvatarUpload } from "../components/AvatarUpload";
import { ProfileForm } from "../components/ProfileForm";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { ArrowLeft, Bell, User, Lock, Shield } from "lucide-react";
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[rgba(0,0,0,0.1)] px-4 sm:px-6 py-6 sm:py-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/app/dashboard")}
            className="text-[rgba(0,21,41,0.6)] hover:text-[#001529] hover:bg-[rgba(0,0,0,0.05)] rounded-xl mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-[#001529]">Meu Perfil</h1>
          <p className="text-[rgba(0,21,41,0.6)] mt-2">Gerencie suas informações pessoais e segurança</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid gap-6">
          {/* Avatar Section */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-6 sm:p-8 transition-all hover:border-[rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-[#001529]">Foto de Perfil</h2>
            </div>
            <AvatarUpload />
          </div>

          {/* Personal Info Section */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-6 sm:p-8 transition-all hover:border-[rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#28A263]/20 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-[#28A263]" />
              </div>
              <h2 className="text-lg font-bold text-[#001529]">Informações Pessoais</h2>
            </div>
            <ProfileForm />
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-6 sm:p-8 transition-all hover:border-[rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#001529]">Segurança</h2>
              </div>
            </div>
            <p className="text-sm text-[rgba(0,21,41,0.6)] mb-6">
              Altere sua senha para manter sua conta segura
            </p>
            <ChangePasswordForm />
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-6 sm:p-8 transition-all hover:border-[rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-lg font-bold text-[#001529]">Notificações</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer p-4 bg-[#F8F9FA] hover:bg-[rgba(0,0,0,0.05)] rounded-xl transition-colors border border-[rgba(0,0,0,0.05)]">
                <input
                  type="checkbox"
                  checked={user?.receivePaymentReminders ?? true}
                  onChange={handleTogglePaymentReminders}
                  disabled={isUpdating}
                  className="w-4 h-4 accent-[#28A263] cursor-pointer mt-1 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-[#001529] font-medium">Lembretes de Cobrança</p>
                  <p className="text-sm text-[rgba(0,21,41,0.6)]">
                    Receba emails automáticos para acompanhar propostas vencidas e contas a pagar
                  </p>
                </div>
              </label>

              {user?.receivePaymentReminders && (
                <div className="ml-0 p-4 bg-[#28A263]/10 border border-[#28A263]/20 rounded-xl">
                  <p className="text-sm text-[#28A263]">
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
