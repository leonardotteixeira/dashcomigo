import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { TrendingUp, Mail, Lock, ArrowRight, Shield, Zap, Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

function GoogleLoginButton({ googleLoading, loading, loginWithGoogle, navigate, setGoogleLoading }: any) {
  const login = useGoogleLogin({
    onSuccess: async (codeResponse: any) => {
      setGoogleLoading(true);
      try {
        console.log("[GoogleLoginButton] Got code response:", codeResponse);
        // O useGoogleLogin retorna um 'code' que precisa ser trocado por um token
        // Mas para nosso caso, vamos usar o access_token diretamente
        if (!codeResponse.access_token) {
          throw new Error("Nenhum token de acesso recebido do Google");
        }
        const { onboardingCompleted } = await loginWithGoogle(codeResponse.access_token);
        toast.success("Login com Google realizado com sucesso!");
        navigate(onboardingCompleted ? "/app/dashboard" : "/app/onboarding");
      } catch (error: any) {
        console.error("[GoogleLoginButton] Google auth error:", error);
        toast.error(error?.message || "Erro ao entrar com Google. Tente novamente.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Erro ao entrar com Google. Verifique sua conexão e tente novamente.");
    },
    flow: "implicit",
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={googleLoading || loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#E5E7EB] rounded-lg hover:bg-[#F5F7FA] transition-all font-semibold text-[#001529] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {googleLoading ? (
        <span className="w-5 h-5 border-2 border-[#001529]/20 border-t-[#001529] rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      )}
      {googleLoading ? "Conectando com Google..." : "Continuar com Google"}
    </button>
  );
}

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login, loginWithGoogle } = useAuth();

  useEffect(() => {
    if (user) {
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
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      {/* Left side - Branding & Benefits */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#001529] to-[#003a6d] p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <span className="font-extrabold text-3xl text-white">FinMEI</span>
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
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-12 justify-center">
            <div className="w-10 h-10 rounded-xl bg-[#003a6d] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl text-[#001529]">FinMEI</span>
          </Link>

          <div className="mb-10">
            <h2 className="font-extrabold text-[#001529] mb-3 text-4xl">Bem-vindo de volta</h2>
            <p className="text-[#001529]/60 text-lg">
              Entre na sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[#001529] mb-2 font-semibold">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#001529]/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-12 pr-4 py-4 text-[#001529] placeholder:text-[#001529]/40 focus:outline-none focus:ring-2 focus:ring-[#003a6d] focus:border-transparent transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[#001529] mb-2 font-semibold">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#001529]/40" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg pl-12 pr-12 py-4 text-[#001529] placeholder:text-[#001529]/40 focus:outline-none focus:ring-2 focus:ring-[#003a6d] focus:border-transparent transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#001529]/40 hover:text-[#001529] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#003a6d] focus:ring-[#003a6d] focus:ring-offset-0"
                />
                <span className="text-sm text-[#001529]/60">Lembrar de mim</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#003a6d] hover:text-[#002a50] transition-colors font-semibold"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full bg-[#003a6d] text-white px-6 py-4 rounded-lg font-bold hover:bg-[#002a50] transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
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

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-[#001529]/60">ou continue com</span>
              </div>
            </div>

            {/* Google — full-width, only social option relevant for MEIs */}
            <GoogleLoginButton googleLoading={googleLoading} loading={loading} loginWithGoogle={loginWithGoogle} navigate={navigate} setGoogleLoading={setGoogleLoading} />
          </form>

          <p className="mt-8 text-center text-[#001529]/60">
            Não tem uma conta?{" "}
            <Link
              to="/signup"
              className="text-[#003a6d] hover:text-[#002a50] transition-colors font-semibold"
            >
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
