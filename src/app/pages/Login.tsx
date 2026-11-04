import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, ArrowRight, Shield, Zap, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Logo } from "../components/ui/Logo";

function mapLoginError(error: unknown): string {
  if (!navigator.onLine) return "Sem conexão com a internet. Verifique sua rede.";

  // PocketBase ClientResponseError has a `status` property
  const status = (error as { status?: number })?.status;
  if (status === 400 || status === 401) return "Email ou senha incorretos. Verifique e tente novamente.";
  if (status === 404) return "Nenhuma conta encontrada com este email.";
  if (status === 429) return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  if (status && status >= 500) return "Erro no servidor. Tente novamente em instantes.";

  // Fallback: match on message string
  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();
  if (lower.includes("failed to authenticate") || lower.includes("invalid") || lower.includes("400")) {
    return "Email ou senha incorretos. Verifique e tente novamente.";
  }
  if (lower.includes("not found") || lower.includes("404")) {
    return "Nenhuma conta encontrada com este email.";
  }
  if (lower.includes("email not confirmed")) {
    return "Confirme seu email antes de entrar. Verifique sua caixa de entrada.";
  }
  if (lower.includes("too many") || lower.includes("rate limit")) {
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }
  return "Não foi possível entrar. Tente novamente em instantes.";
}

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      navigate("/app");
    } catch (error: unknown) {
      console.error("[Login] erro capturado:", error);
      const msg = mapLoginError(error);
      console.error("[Login] mensagem mapeada:", msg);
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      {/* Left side - Branding & Benefits */}
      <div className="hidden lg:flex flex-col justify-between bg-[#0E3B2E] p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center mb-16">
            <Logo variant="knockout" />
          </Link>

          <h1 className="font-extrabold text-white mb-6 leading-tight" style={{ fontSize: "3.5rem" }}>
            Gestão financeira simplificada
          </h1>
          <p className="text-xl text-white/80 leading-relaxed mb-12 font-light">
            Controle total das suas finanças em uma plataforma pensada para MEIs
          </p>

          <div className="space-y-6">
            {[
              {
                icon: Zap,
                title: "Rápido e intuitivo",
                description: "Configure em minutos e comece a organizar suas finanças imediatamente"
              },
              {
                icon: Shield,
                title: "100% seguro",
                description: "Seus dados protegidos com criptografia de ponta a ponta"
              }
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1 text-lg">{benefit.title}</h3>
                    <p className="text-white/80">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-white/80">
          <div>
            <p className="font-extrabold text-3xl text-white mb-1">+5.000</p>
            <p className="text-sm">MEIs ativos</p>
          </div>
          <div>
            <p className="font-extrabold text-3xl text-white mb-1">4.9/5</p>
            <p className="text-sm">Avaliação</p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center mb-12 justify-center">
            <Logo />
          </Link>

          <div className="mb-10">
            <h2 className="font-extrabold text-[#0E3B2E] mb-3 text-4xl">Bem-vindo de volta</h2>
            <p className="text-[#0E3B2E]/60 text-lg">
              Entre na sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[#0E3B2E] mb-2 font-semibold">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0E3B2E]/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFormError(null); }}
                  placeholder="seu@email.com"
                  required
                  className="w-full border border-[rgba(20,18,15,0.13)] rounded-lg pl-12 pr-4 py-4 text-[#0E3B2E] placeholder:text-[#0E3B2E]/40 focus:outline-none focus:ring-2 focus:ring-[#0E3B2E] focus:border-transparent transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[#0E3B2E] mb-2 font-semibold">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0E3B2E]/40" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFormError(null); }}
                  placeholder="••••••••"
                  required
                  className="w-full border border-[rgba(20,18,15,0.13)] rounded-lg pl-12 pr-12 py-4 text-[#0E3B2E] placeholder:text-[#0E3B2E]/40 focus:outline-none focus:ring-2 focus:ring-[#0E3B2E] focus:border-transparent transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0E3B2E]/40 hover:text-[#0E3B2E] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {formError && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{formError}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[rgba(20,18,15,0.13)] text-[#0E3B2E] focus:ring-[#0E3B2E] focus:ring-offset-0"
                />
                <span className="text-sm text-[#0E3B2E]/60">Lembrar de mim</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#1F5A3A] hover:text-[#0E3B2E] transition-colors font-semibold"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full bg-[#0E3B2E] text-white px-6 py-4 rounded-lg font-bold hover:bg-[#082219] transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </form>

          <p className="mt-8 text-center text-[#0E3B2E]/60">
            Não tem uma conta?{" "}
            <Link
              to="/signup"
              className="text-[#1F5A3A] hover:text-[#0E3B2E] transition-colors font-semibold"
            >
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
