import { useState, useRef } from "react";
import {
  Bell,
  User,
  Lock,
  Shield,
  Crown,
  Camera,
  KeyRound,
  Building2,
  Calendar,
  TrendingUp,
  Info,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFinancialMetrics } from "../../utils/useFinancialMetrics";
import { PageHeader } from "../components/PageHeader";
import { useNavigate } from "react-router";

export function Profile() {
  const { user, updateProfile, changePassword, uploadAvatar, updatePaymentReminders } =
    useAuth();
  const navigate = useNavigate();
  const { monthReceitas, fmt, loading: metricsLoading } = useFinancialMetrics();

  // ── Avatar ─────────────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setAvatarLoading(true);
      await uploadAvatar(file);
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setAvatarLoading(false);
    }
  };

  // ── Personal info form ────────────────────────────────────────────────────
  const [personalForm, setPersonalForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    cnpj: user?.cnpj ?? "",
    address: user?.address ?? "",
    activityType: user?.company ?? "",
  });
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalSuccess, setPersonalSuccess] = useState(false);
  const [personalError, setPersonalError] = useState<string | null>(null);

  const handlePersonalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalError(null);
    if (!personalForm.name.trim()) {
      setPersonalError("Nome é obrigatório");
      return;
    }
    try {
      setPersonalLoading(true);
      await updateProfile({
        name: personalForm.name,
        phone: personalForm.phone || undefined,
        company: personalForm.activityType || undefined,
        cnpj: personalForm.cnpj || undefined,
        address: personalForm.address || undefined,
      });
      setPersonalSuccess(true);
      setTimeout(() => setPersonalSuccess(false), 3000);
    } catch (err) {
      setPersonalError(err instanceof Error ? err.message : "Erro ao salvar informações");
    } finally {
      setPersonalLoading(false);
    }
  };

  const handlePersonalCancel = () => {
    setPersonalForm({
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      cnpj: user?.cnpj ?? "",
      address: user?.address ?? "",
      activityType: user?.company ?? "",
    });
    setPersonalError(null);
    setPersonalSuccess(false);
  };

  // ── Password form ─────────────────────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (!passwordForm.currentPassword) {
      setPasswordError("Digite sua senha atual");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("A nova senha deve ter no mínimo 8 caracteres");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError("A nova senha deve ser diferente da atual");
      return;
    }
    try {
      setPasswordLoading(true);
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setTimeout(
        () =>
          navigate("/login", {
            state: { message: "Senha alterada com sucesso! Faça login novamente." },
          }),
        800,
      );
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Erro ao alterar senha");
      setPasswordLoading(false);
    }
  };

  // ── Notifications ─────────────────────────────────────────────────────────
  const [notifLoading, setNotifLoading] = useState(false);

  const handleToggleNotifications = async () => {
    if (!user) return;
    try {
      setNotifLoading(true);
      await updatePaymentReminders(!user.receivePaymentReminders);
    } catch (err) {
      console.error("Notification update failed:", err);
    } finally {
      setNotifLoading(false);
    }
  };

  // ── Input class helper ────────────────────────────────────────────────────
  const inputCls =
    "w-full px-3 py-2.5 rounded-xl border border-[rgba(20,18,15,0.13)] bg-[#F4EFE6] text-sm text-[#0E3B2E] placeholder:text-[#0E3B2E]/40 focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/20 focus:border-[#0E3B2E] transition-colors";
  const labelCls =
    "block text-[10px] font-bold text-[#0E3B2E]/50 uppercase tracking-widest mb-1.5";

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais e configurações da conta"
      />

      {/* ── 1. PROFILE HEADER CARD ─────────────────────────────────────────── */}
      <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-[#0E3B2E] flex items-center justify-center overflow-hidden ring-4 ring-[#0E3B2E]/10">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-20 h-20 object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-bold">{initials}</span>
              )}
              {avatarLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {/* Camera button */}
            <button
              onClick={handleAvatarClick}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0E3B2E] rounded-full flex items-center justify-center border-2 border-white hover:bg-[#002a50] transition-colors shadow-md"
              title="Alterar foto"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name / subtitle / badge */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[#0E3B2E] truncate">
              {user?.name ?? "—"}
            </h2>
            <p className="text-sm text-[#0E3B2E]/60 mt-0.5">
              Microempreendedor Individual
            </p>
            <span
              className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${
                user?.plan === "pro"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                  : "bg-gray-100 text-gray-500 border-gray-200"
              }`}
            >
              {user?.plan === "pro" ? (
                <>
                  <Crown className="w-3 h-3" />
                  Plano PRO
                </>
              ) : (
                "Plano Gratuito"
              )}
            </span>
          </div>

          {/* Change photo link */}
          <button
            onClick={handleAvatarClick}
            className="text-sm font-medium text-[#0E3B2E] hover:underline flex-shrink-0 hidden sm:block"
          >
            Alterar foto
          </button>
        </div>
      </div>

      {/* ── 2. PERSONAL INFORMATION CARD ─────────────────────────────────────── */}
      <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#0E3B2E]/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#0E3B2E]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0E3B2E]">
              Informações Pessoais
            </h2>
            <p className="text-xs text-[#0E3B2E]/50">Atualize seus dados cadastrais</p>
          </div>
        </div>

        <form onSubmit={handlePersonalSave} className="space-y-4">
          {/* Row 1: Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nome Completo *</label>
              <input
                type="text"
                value={personalForm.name}
                onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                placeholder="Seu nome completo"
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(20,18,15,0.13)] bg-[#F0F0F0] text-sm text-[#0E3B2E]/50 cursor-not-allowed"
              />
              <p className="text-[10px] text-[#0E3B2E]/40 mt-1">
                Email não pode ser alterado
              </p>
            </div>
          </div>

          {/* Row 2: Phone + CNPJ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Telefone</label>
              <input
                type="tel"
                value={personalForm.phone}
                onChange={(e) =>
                  setPersonalForm({ ...personalForm, phone: e.target.value })
                }
                placeholder="(11) 99999-9999"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>CNPJ / CPF</label>
              <input
                type="text"
                value={personalForm.cnpj}
                onChange={(e) =>
                  setPersonalForm({ ...personalForm, cnpj: e.target.value })
                }
                placeholder="00.000.000/0001-00"
                className={inputCls}
              />
            </div>
          </div>

          {/* Address — full width */}
          <div>
            <label className={labelCls}>Endereço</label>
            <input
              type="text"
              value={personalForm.address}
              onChange={(e) =>
                setPersonalForm({ ...personalForm, address: e.target.value })
              }
              placeholder="Rua, número, bairro, cidade — UF"
              className={inputCls}
            />
          </div>

          {/* Activity — full width */}
          <div>
            <label className={labelCls}>Atividade Principal</label>
            <input
              type="text"
              value={personalForm.activityType}
              onChange={(e) =>
                setPersonalForm({ ...personalForm, activityType: e.target.value })
              }
              placeholder="Ex: Desenvolvimento de software, Consultoria, Vendas..."
              className={inputCls}
            />
          </div>

          {/* Feedback */}
          {personalError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{personalError}</p>
            </div>
          )}
          {personalSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-700">
                Informações salvas com sucesso!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#F0F0F0]">
            <button
              type="button"
              onClick={handlePersonalCancel}
              className="px-4 py-2 text-sm font-medium text-[#0E3B2E]/60 hover:text-[#0E3B2E] border border-[rgba(20,18,15,0.13)] rounded-xl hover:bg-[#F4EFE6] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={personalLoading}
              className="px-6 py-2 text-sm font-bold text-white bg-[#0E3B2E] rounded-xl hover:bg-[#002a50] transition-colors disabled:opacity-60"
            >
              {personalLoading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>

      {/* ── 3. MEI INFORMATION CARD ──────────────────────────────────────────── */}
      <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0E3B2E]">
              Informações MEI
            </h2>
            <p className="text-xs text-[#0E3B2E]/50">
              Dados do seu negócio como Microempreendedor
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Opening / member date */}
          <div className="bg-[#F4EFE6] rounded-xl p-4 border border-[rgba(20,18,15,0.13)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-[10px] font-bold text-[#0E3B2E]/50 uppercase tracking-widest">
                Membro desde
              </p>
            </div>
            <p className="text-lg font-bold text-[#0E3B2E]">
              {new Date().getFullYear()}
            </p>
            <p className="text-xs text-[#0E3B2E]/50 mt-0.5">
              Ano de abertura da conta
            </p>
          </div>

          {/* Annual MEI limit */}
          <div className="bg-[#F4EFE6] rounded-xl p-4 border border-[rgba(20,18,15,0.13)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-[10px] font-bold text-[#0E3B2E]/50 uppercase tracking-widest">
                Limite Anual MEI
              </p>
            </div>
            <p className="text-lg font-bold text-[#0E3B2E]">R$ 81.000</p>
            <p className="text-xs text-[#0E3B2E]/50 mt-0.5">
              Faturamento bruto anual permitido
            </p>
          </div>

          {/* Current month revenue */}
          <div className="bg-[#F4EFE6] rounded-xl p-4 border border-[rgba(20,18,15,0.13)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-[10px] font-bold text-[#0E3B2E]/50 uppercase tracking-widest">
                Receita do Mês
              </p>
            </div>
            {metricsLoading ? (
              <div className="h-6 w-24 bg-[rgba(20,18,15,0.13)] rounded animate-pulse" />
            ) : (
              <p className="text-lg font-bold text-emerald-600">
                {fmt(monthReceitas)}
              </p>
            )}
            <p className="text-xs text-[#0E3B2E]/50 mt-0.5">
              Faturamento no mês atual
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. SECURITY SECTION ──────────────────────────────────────────────── */}
      <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0E3B2E]">Segurança</h2>
            <p className="text-xs text-[#0E3B2E]/50">
              Altere sua senha para manter a conta protegida
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Three password fields in a row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Senha Atual *</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                placeholder="••••••••"
                className={inputCls}
                required
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className={labelCls}>Nova Senha *</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                placeholder="••••••••"
                className={inputCls}
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className={labelCls}>Confirmar Senha *</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                className={inputCls}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Password rules */}
          <div className="bg-[#F4EFE6] border border-[rgba(20,18,15,0.13)] rounded-xl p-4">
            <p className="text-[10px] font-bold text-[#0E3B2E]/50 uppercase tracking-widest mb-3">
              Requisitos de senha
            </p>
            <ul className="space-y-1.5">
              {[
                "Mínimo de 8 caracteres",
                "Deve ser diferente da senha atual",
                "Confirmação deve ser igual à nova senha",
              ].map((rule, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-[#0E3B2E]/60">
                  <div className="w-4 h-4 rounded-full bg-[#0E3B2E]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0E3B2E] text-[9px] font-bold">✓</span>
                  </div>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Logout warning */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Atenção:</strong> Você será desconectado automaticamente após
              alterar a senha e precisará fazer login novamente.
            </p>
          </div>

          {/* Error */}
          {passwordError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{passwordError}</p>
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-[#F0F0F0]">
            <button
              type="submit"
              disabled={passwordLoading}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 shadow-sm"
            >
              <Lock className="w-4 h-4" />
              {passwordLoading ? "Alterando..." : "Alterar Senha"}
            </button>
          </div>
        </form>
      </div>

      {/* ── 5. NOTIFICATIONS SECTION ─────────────────────────────────────────── */}
      <div className="border border-[rgba(20,18,15,0.13)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0E3B2E]">Notificações</h2>
            <p className="text-xs text-[#0E3B2E]/50">
              Configure seus alertas e lembretes automáticos
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Toggle row */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-[rgba(20,18,15,0.13)] bg-[#F4EFE6]">
            <div className="flex-1 pr-4">
              <p className="font-semibold text-sm text-[#0E3B2E]">
                Lembretes de Cobrança
              </p>
              <p className="text-xs text-[#0E3B2E]/60 mt-0.5">
                Receba emails automáticos para propostas vencidas e contas a pagar
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleNotifications}
              disabled={notifLoading}
              aria-checked={user?.receivePaymentReminders ?? false}
              role="switch"
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/30 ${
                user?.receivePaymentReminders ? "bg-[#0E3B2E]" : "bg-[#D1D5DB]"
              } ${notifLoading ? "opacity-60" : ""}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  user?.receivePaymentReminders ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Info box — shown when enabled */}
          {user?.receivePaymentReminders && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Você receberá até <strong>3 lembretes</strong> por email para cada
                proposta ou conta vencida. Os lembretes são enviados automaticamente
                nos dias seguintes ao vencimento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
