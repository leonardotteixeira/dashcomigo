import { useState } from "react";
import { Bell, User, Lock, Shield, Crown, Camera, KeyRound } from "lucide-react";
import { AvatarUpload } from "../components/AvatarUpload";
import { ProfileForm } from "../components/ProfileForm";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { useAuth } from "../contexts/AuthContext";
import { KPICard } from "../components/KPICard";
import { PageHeader } from "../components/PageHeader";

export function Profile() {
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

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais e configurações"
      />

      {/* Banner card */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">{initials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-[#001529] truncate">
              {user?.name ?? "—"}
            </p>
            <p className="text-sm text-[#001529]/60 mt-0.5">Microempreendedor Individual</p>
            <span
              className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold ${
                user?.plan === "pro"
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                  : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}
            >
              {user?.plan === "pro" ? "Plano PRO" : "Plano Gratuito"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          icon={Crown}
          label="Plano Atual"
          value={user?.plan === "pro" ? "PRO" : "Gratuito"}
          description="Upgrade para desbloquear todos os recursos"
          color="blue"
        />
        <KPICard
          icon={Shield}
          label="Segurança"
          value="Ativa"
          description="Sua conta está protegida com senha"
          color="green"
        />
        <KPICard
          icon={Bell}
          label="Notificações"
          value={user?.receivePaymentReminders ? "Ativas" : "Desativadas"}
          description="Lembretes de cobranças e vencimentos"
          color={user?.receivePaymentReminders ? "green" : "orange"}
        />
      </div>

      {/* Foto de Perfil */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Camera className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-base font-bold text-[#001529]">Foto de Perfil</h2>
        </div>
        <AvatarUpload />
      </div>

      {/* Informações Pessoais */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <User className="w-5 h-5 text-purple-500" />
          </div>
          <h2 className="text-base font-bold text-[#001529]">Informações Pessoais</h2>
        </div>
        <ProfileForm />
      </div>

      {/* Segurança */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#001529]">Segurança</h2>
            <p className="text-sm text-[#001529]/60 mt-0.5">
              Altere sua senha para manter sua conta segura
            </p>
          </div>
        </div>
        <ChangePasswordForm />
      </div>

      {/* Notificações */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-orange-500" />
          </div>
          <h2 className="text-base font-bold text-[#001529]">Notificações</h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-[#E5E7EB] bg-gray-50 hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={user?.receivePaymentReminders ?? true}
              onChange={handleTogglePaymentReminders}
              disabled={isUpdating}
              className="w-4 h-4 cursor-pointer mt-0.5 flex-shrink-0 accent-green-600"
            />
            <div className="flex-1">
              <p className="font-medium text-[#001529]">Lembretes de Cobrança</p>
              <p className="text-sm text-[#001529]/60 mt-0.5">
                Receba emails automáticos para acompanhar propostas vencidas e contas a pagar
              </p>
            </div>
          </label>

          {user?.receivePaymentReminders && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50">
              <p className="text-sm text-blue-700">
                ✓ Você receberá até <strong>3 lembretes</strong> para cada proposta/conta vencida
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
