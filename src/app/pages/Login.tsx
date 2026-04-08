import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { LogIn, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

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
      toast.success("Login realizado com sucesso!");
      navigate("/app");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F8F9FA] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Back Navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[rgba(0,21,41,0.6)] hover:text-[#001529] mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/12 rounded-2xl mb-6">
            <LogIn className="w-8 h-8 text-[#28A263]" />
          </div>
          <h1 className="text-4xl font-bold text-[#001529] mb-3">
            Bem-vindo de volta
          </h1>
          <p className="text-lg text-[rgba(0,21,41,0.65)]">
            Entre na sua conta para continuar
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 border border-[rgba(0,0,0,0.08)] bg-white shadow-sm mb-6">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="block text-sm font-semibold text-[#001529] mb-3">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="h-12 bg-white border border-[rgba(0,0,0,0.08)] text-[#001529] placeholder:text-[rgba(0,21,41,0.5)] rounded-lg focus:border-[#28A263]/30 focus:ring-1 focus:ring-[#28A263]/20 transition-all"
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label htmlFor="password" className="block text-sm font-semibold text-[#001529]">
                  Senha
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#28A263] hover:text-[#1F8C50] transition-colors font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 bg-white border border-[rgba(0,0,0,0.08)] text-[#001529] placeholder:text-[rgba(0,21,41,0.5)] rounded-lg focus:border-[#28A263]/30 focus:ring-1 focus:ring-[#28A263]/20 transition-all pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgba(0,21,41,0.5)] hover:text-[#001529] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#28A263] hover:bg-[#1F8C50] text-white h-12 font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center text-sm text-[rgba(0,21,41,0.65)]">
            Não tem uma conta?{" "}
            <Link to="/signup" className="text-[#28A263] hover:text-[#1F8C50] font-semibold transition-colors">
              Cadastre-se grátis
            </Link>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-[rgba(0,21,41,0.55)]">
          Ao entrar, você concorda com nossos{" "}
          <a href="#" className="text-[#28A263] hover:text-[#1F8C50] transition-colors">
            Termos de Uso
          </a>
          {" "}e{" "}
          <a href="#" className="text-[#28A263] hover:text-[#1F8C50] transition-colors">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
}
