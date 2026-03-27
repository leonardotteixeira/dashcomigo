import { AvatarUpload } from "../components/AvatarUpload";
import { ProfileForm } from "../components/ProfileForm";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <div className="border-b border-white/10 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/app/dashboard")}
            className="flex items-center gap-2 text-[#A1A1A1] hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Meu Perfil</h1>
          <p className="text-sm text-[#686F6F] mt-2">Gerencie suas informações pessoais e segurança</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid gap-6">
          {/* Avatar Section */}
          <div className="bg-[#1B1B1B] rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-6">Foto de Perfil</h2>
            <AvatarUpload />
          </div>

          {/* Personal Info Section */}
          <div className="bg-[#1B1B1B] rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-6">Informações Pessoais</h2>
            <ProfileForm />
          </div>

          {/* Security Section */}
          <div className="bg-[#1B1B1B] rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-2">Segurança</h2>
            <p className="text-sm text-[#686F6F] mb-6">
              Altere sua senha para manter sua conta segura
            </p>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
