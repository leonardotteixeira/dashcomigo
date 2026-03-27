import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.currentPassword) {
      setError("Digite sua senha atual");
      return;
    }
    if (!form.newPassword) {
      setError("Digite uma nova senha");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("Senha deve ter no mínimo 8 caracteres");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    if (form.currentPassword === form.newPassword) {
      setError("A nova senha deve ser diferente da atual");
      return;
    }

    setLoading(true);

    try {
      await changePassword(form.currentPassword, form.newPassword);
      // changePassword automatically logs out and user is redirected
      // Optionally redirect to login
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Senha alterada com sucesso! Faça login novamente." },
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao alterar senha");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current Password */}
      <div>
        <Label className="text-sm text-[#C8C9D0] mb-2 block">
          Senha Atual *
        </Label>
        <Input
          type="password"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          placeholder="Digite sua senha atual"
          className="bg-[#141414] border border-white/10 text-white placeholder:text-[#686F6F] text-sm rounded-xl"
          required
        />
      </div>

      {/* New Password */}
      <div>
        <Label className="text-sm text-[#C8C9D0] mb-2 block">Nova Senha *</Label>
        <Input
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          placeholder="Mínimo 8 caracteres"
          className="bg-[#141414] border border-white/10 text-white placeholder:text-[#686F6F] text-sm rounded-xl"
          required
        />
      </div>

      {/* Confirm Password */}
      <div>
        <Label className="text-sm text-[#C8C9D0] mb-2 block">
          Confirmar Senha *
        </Label>
        <Input
          type="password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          placeholder="Confirme sua nova senha"
          className="bg-[#141414] border border-white/10 text-white placeholder:text-[#686F6F] text-sm rounded-xl"
          required
        />
      </div>

      {/* Password Requirements */}
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
        <p className="text-xs text-[#A1A1A1] font-medium mb-2">Requisitos:</p>
        <ul className="text-xs text-[#686F6F] space-y-1">
          <li>✓ Mínimo 8 caracteres</li>
          <li>✓ Diferente da senha atual</li>
          <li>✓ Confirmação deve ser igual</li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Info Message */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-400">
          Você será desconectado após alterar a senha e precisará fazer login novamente.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#28A263] hover:bg-[#2DDB81] text-white"
      >
        {loading ? "Alterando..." : "Alterar Senha"}
      </Button>
    </form>
  );
}
