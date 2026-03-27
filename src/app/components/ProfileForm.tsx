import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    company: user?.company || "",
    bio: user?.bio || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!form.name.trim()) {
        throw new Error("Nome é obrigatório");
      }

      await updateProfile({
        name: form.name,
        phone: form.phone || undefined,
        company: form.company || undefined,
        bio: form.bio || undefined,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <Label className="text-sm text-[#C8C9D0] mb-2 block">Nome *</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Seu nome completo"
          className="bg-[#141414] border border-white/10 text-white placeholder:text-[#686F6F] text-sm rounded-xl"
          required
        />
      </div>

      {/* Email (read-only) */}
      <div>
        <Label className="text-sm text-[#C8C9D0] mb-2 block">Email</Label>
        <Input
          value={user?.email || ""}
          disabled
          className="bg-[#0F0F0F] border border-white/5 text-[#686F6F] text-sm rounded-xl cursor-not-allowed"
        />
        <p className="text-xs text-[#686F6F] mt-1">Email não pode ser alterado</p>
      </div>

      {/* Phone */}
      <div>
        <Label className="text-sm text-[#C8C9D0] mb-2 block">Telefone</Label>
        <Input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="(11) 99999-9999"
          type="tel"
          className="bg-[#141414] border border-white/10 text-white placeholder:text-[#686F6F] text-sm rounded-xl"
        />
      </div>

      {/* Company */}
      <div>
        <Label className="text-sm text-[#C8C9D0] mb-2 block">Empresa</Label>
        <Input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="Nome da sua empresa"
          className="bg-[#141414] border border-white/10 text-white placeholder:text-[#686F6F] text-sm rounded-xl"
        />
      </div>

      {/* Bio */}
      <div>
        <Label className="text-sm text-[#C8C9D0] mb-2 block">Bio</Label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Conte um pouco sobre você..."
          className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-[#686F6F] focus:outline-none focus:border-[#28A263]"
          rows={4}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-[#28A263]/10 border border-[#28A263]/30 rounded-lg">
          <p className="text-sm text-[#28A263]">Perfil atualizado com sucesso!</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#28A263] hover:bg-[#2DDB81] text-white"
      >
        {loading ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
}
