import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { LogIn, Mail, Lock, ArrowLeft } from "lucide-react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login, loginWithGoogle } = useAuth();

  // Quando user ficar disponível (via onAuthStateChange), redireciona
  useEffect(() => {
    if (user) {
      toast.success("Login realizado com sucesso!");
      navigate("/app");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      // Login já buscou o profile, redireciona imediatamente
      toast.success("Login realizado com sucesso!");
      navigate("/app");
      return;
    } catch (error: any) {
      const msg = error?.message || "";
      if (msg.includes("Invalid login credentials") || msg.includes("invalid_credentials")) {
        toast.error("Email ou senha incorretos. Tente novamente.");
      } else if (msg.includes("Email not confirmed")) {
        toast.error("Confirme seu email antes de entrar. Verifique sua caixa de entrada.");
      } else if (msg.includes("Too many requests")) {
        toast.error("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
      } else {
        toast.error("Erro ao entrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      // O redirecionamento acontece automaticamente via OAuth
    } catch (error: any) {
      toast.error("Erro ao entrar com Google. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center text-[rgba(0,21,41,0.5)] hover:text-[rgba(0,21,41,0.7)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o início
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/20 rounded-2xl shadow-lg mb-4">
            <LogIn className="w-8 h-8 text-[#28A263]" />
          </div>
          <h1 className="text-3xl font-bold text-[#001529] mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-[rgba(0,21,41,0.6)]">
            Entre para acessar suas ferramentas
          </p>
        </div>

        <Card className="p-8 border border-[rgba(0,0,0,0.1)] bg-white shadow-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-[#001529]">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="h-12 bg-white border-[rgba(0,0,0,0.1)] text-[#001529] placeholder:text-[rgba(0,21,41,0.5)]"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-[#001529]">
                  <Lock className="w-4 h-4" />
                  Senha
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#28A263] hover:text-[#1F8C50] transition-colors"
                >
                  Esqueceu?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12 bg-white border-[rgba(0,0,0,0.1)] text-[#001529] placeholder:text-[rgba(0,21,41,0.5)]"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#28A263] hover:bg-[#1F8C50] text-white h-12 font-semibold"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>


          <div className="mt-6 text-center text-sm text-[rgba(0,21,41,0.6)]">
            Não tem uma conta?{" "}
            <Link to="/signup" className="text-[#28A263] hover:text-[#1F8C50] font-semibold transition-colors">
              Cadastre-se grátis
            </Link>
          </div>
        </Card>

        <p className="text-center text-sm text-[rgba(0,21,41,0.5)] mt-6">
          Ao entrar, você concorda com nossos Termos de Uso
        </p>
      </div>
    </div>
  );
}
