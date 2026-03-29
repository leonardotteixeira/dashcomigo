import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Lock, KeyRound } from "lucide-react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { pb } from "../../lib/pocketbase";
import { toast } from "sonner";

export function PasswordResetConfirm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Token inválido ou expirado");
      return;
    }
    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      await pb.collection("profiles").confirmPasswordReset(token, password, password);
      toast.success("Senha redefinida com sucesso!");
      navigate("/login");
    } catch (error: any) {
      toast.error("Erro ao redefinir senha. O link pode ter expirado.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/20 rounded-2xl shadow-lg mb-4">
            <KeyRound className="w-8 h-8 text-[#2DDB81]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Nova senha</h1>
          <p className="text-[#A1A1A1]">Digite sua nova senha abaixo.</p>
        </div>

        <Card className="p-8 border border-white/10 bg-[#1B1B1B] shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="password" className="flex items-center gap-2 mb-2 text-white">
                <Lock className="w-4 h-4" />
                Nova senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                className="h-12 bg-[#141414] border-white/10 text-white placeholder:text-[#686F6F]"
                autoComplete="new-password"
              />
            </div>

            <div>
              <Label htmlFor="confirm" className="flex items-center gap-2 mb-2 text-white">
                <Lock className="w-4 h-4" />
                Confirmar senha
              </Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirme sua nova senha"
                required
                minLength={8}
                className="h-12 bg-[#141414] border-white/10 text-white placeholder:text-[#686F6F]"
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#28A263] hover:bg-[#2DDB81] text-black font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Alterando senha..." : "Redefinir senha"}
            </Button>
          </form>

          <p className="text-center text-sm text-[#686F6F] mt-6">
            Lembrou da senha?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#2DDB81] hover:underline font-medium"
            >
              Voltar ao login
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
