import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  Mail, Lock, User, Eye, EyeOff,
  MailCheck, Zap, Shield,
} from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

// ─── CNPJ mask ──────────────────────────────────────────────────────────────

function applyCnpjMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function isValidCnpj(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, "");
  return digits.length === 14;
}

// ─── Google SVG icon ────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

// ─── Email verification screen ───────────────────────────────────────────────

function EmailSentScreen({ email, onBack }: { email: string; onBack: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left */}
      <LeftPanel />

      {/* Right */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-8">
            <MailCheck className="w-10 h-10 text-[#0B2A4A]" />
          </div>
          <h1 className="text-3xl font-bold text-[#0B2A4A] mb-4">Confirme seu email</h1>
          <p className="text-[#0B2A4A]/60 mb-2">Enviamos um link de confirmação para:</p>
          <p className="font-semibold text-[#0B2A4A] text-lg mb-6">{email}</p>
          <p className="text-[#0B2A4A]/60 mb-8">
            Clique no link do email para ativar sua conta e acessar todas as ferramentas gratuitamente.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
            <p className="font-semibold text-[#0B2A4A] mb-3">Não recebeu o email?</p>
            {["Verifique a pasta de spam/lixo eletrônico", "Aguarde alguns minutos para receber", "Verifique se o email está correto"].map((tip) => (
              <div key={tip} className="flex items-start gap-2 text-sm text-[#0B2A4A]/70">
                <span className="text-[#0B2A4A] mt-0.5">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full h-12 bg-[#0B2A4A] text-white font-semibold rounded-lg hover:bg-[#0A2540] transition-colors mb-4"
          >
            Já confirmei meu email
          </button>
          <button onClick={onBack} className="text-sm text-[#0B2A4A]/60 hover:text-[#0B2A4A] transition-colors">
            Voltar para o formulário
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Left value panel ─────────────────────────────────────────────────────────

function LeftPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-12 text-white"
      style={{ background: "#0E3B2E" }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Logo variant="knockout" />
      </div>

      {/* Center */}
      <div className="space-y-10">
        <div>
          <h2 className="text-5xl font-bold leading-tight mb-4">
            Comece grátis<br />hoje mesmo
          </h2>
          <p className="text-lg text-white/75 leading-relaxed">
            Junte-se a milhares de MEIs que já transformaram sua gestão financeira
          </p>
        </div>

        <div className="space-y-5">
          {/* Feature 1 */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-base">Configuração em minutos</p>
              <p className="text-sm text-white/65 mt-1 leading-relaxed">
                Crie sua conta e comece a usar todos os recursos imediatamente
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-base">Comece grátis</p>
              <p className="text-sm text-white/65 mt-1 leading-relaxed">
                Plano gratuito completo, sem cartão de crédito, sem pegadinhas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social proof */}
      <div className="flex items-center gap-8">
        <div>
          <p className="text-2xl font-bold">+5.000</p>
          <p className="text-sm text-white/60 mt-0.5">MEIs ativos</p>
        </div>
        <div className="w-px h-10 bg-white/20" />
        <div>
          <p className="text-2xl font-bold">4.9/5</p>
          <p className="text-sm text-white/60 mt-0.5">Avaliação</p>
        </div>
      </div>
    </div>
  );
}

// ─── Input with left icon ─────────────────────────────────────────────────────

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  required,
  autoComplete,
  disabled,
  rightElement,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ElementType;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  rightElement?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a2e]/35 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full h-12 pl-10 pr-4 rounded-lg border border-[rgba(20,18,15,0.13)] bg-white text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/35 outline-none focus:border-[#0B2A4A] focus:ring-2 focus:ring-[#0B2A4A]/10 transition-all disabled:opacity-50"
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function Signup() {
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Derived validation
  const cnpjDigits = cnpj.replace(/\D/g, "");
  const cnpjValid = cnpjDigits.length === 0 || cnpjDigits.length === 14;
  const passwordMatch = confirmPassword === "" || password === confirmPassword;
  const canSubmit =
    name.trim().length >= 2 &&
    email.includes("@") &&
    password.length >= 8 &&
    password === confirmPassword &&
    acceptedTerms &&
    cnpjValid &&
    !loading;

  const handleCnpjChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length <= 14) setCnpj(applyCnpjMask(raw));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (!acceptedTerms) {
      toast.error("Aceite os termos para continuar.");
      return;
    }

    setLoading(true);
    try {
      const loggedIn = await signup(name.trim(), email.trim(), password);
      if (loggedIn) {
        navigate("/app");
      } else {
        setEmailSent(true);
      }
    } catch (error: any) {
      const msg = (error?.message ?? "").toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists")) {
        toast.error("Este email já está cadastrado. Faça login ou use outro email.");
      } else if (msg.includes("invalid email")) {
        toast.error("Email inválido. Verifique o endereço digitado.");
      } else if (msg.includes("password")) {
        toast.error("Senha muito fraca. Use pelo menos 8 caracteres.");
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const { onboardingCompleted } = await loginWithGoogle();
      navigate(onboardingCompleted ? "/app/dashboard" : "/app/onboarding");
    } catch (error: any) {
      const msg = error?.message ?? "";
      toast.error(msg || "Erro ao continuar com Google. Tente novamente.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (emailSent) {
    return <EmailSentScreen email={email} onBack={() => setEmailSent(false)} />;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
      <LeftPanel />

      {/* ── RIGHT PANEL (FORM) ──────────────────────────────────────────── */}
      <div className="flex items-center justify-center min-h-screen bg-white p-8 overflow-y-auto">
        <div className="w-full max-w-[440px]">

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0B2A4A] mb-2">Crie sua conta</h1>
            <p className="text-sm text-[#0B2A4A]/55">Preencha os dados abaixo para começar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">

            {/* Nome completo */}
            <InputField
              id="name"
              label="Nome completo"
              value={name}
              onChange={setName}
              placeholder="João da Silva"
              icon={User}
              required
              autoComplete="name"
            />

            {/* CNPJ MEI */}
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-[#1a1a2e] mb-1.5">
                CNPJ MEI
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a2e]/35 pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <input
                  id="cnpj"
                  type="text"
                  inputMode="numeric"
                  value={cnpj}
                  onChange={(e) => handleCnpjChange(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className={`w-full h-12 pl-10 pr-4 rounded-lg border bg-white text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/35 outline-none focus:ring-2 transition-all ${
                    cnpjDigits.length > 0 && !cnpjValid
                      ? "border-red-400 focus:ring-red-200"
                      : "border-[rgba(20,18,15,0.13)] focus:border-[#0B2A4A] focus:ring-[#0B2A4A]/10"
                  }`}
                />
              </div>
              {cnpjDigits.length > 0 && !cnpjValid && (
                <p className="text-xs text-red-500 mt-1">CNPJ deve ter 14 dígitos</p>
              )}
            </div>

            {/* Email */}
            <InputField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="seu@email.com"
              icon={Mail}
              required
              autoComplete="email"
            />

            {/* Senha */}
            <InputField
              id="password"
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Mínimo 8 caracteres"
              icon={Lock}
              required
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#1a1a2e]/40 hover:text-[#1a1a2e] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Confirmar senha */}
            <div>
              <div className="relative">
                <div className="absolute left-3 top-[38px] -translate-y-0 text-[#1a1a2e]/35 pointer-events-none" style={{ top: "calc(1.5rem + 18px)" }}>
                  <Lock className="w-4 h-4" />
                </div>
                <InputField
                  id="confirmPassword"
                  label="Confirmar senha"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repita a senha"
                  icon={Lock}
                  autoComplete="new-password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-[#1a1a2e]/40 hover:text-[#1a1a2e] transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>
              {confirmPassword.length > 0 && !passwordMatch && (
                <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
              )}
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group mt-1">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    acceptedTerms
                      ? "bg-[#0B2A4A] border-[#0B2A4A]"
                      : "bg-white border-[#D1D5DB] group-hover:border-[#0B2A4A]"
                  }`}
                >
                  {acceptedTerms && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-[#1a1a2e]/60 leading-relaxed">
                Aceito os{" "}
                <Link to="/termos-de-uso" className="text-[#0B2A4A] font-medium hover:underline" onClick={(e) => e.stopPropagation()}>
                  Termos de Uso
                </Link>
                {" "}e a{" "}
                <Link to="/privacidade" className="text-[#0B2A4A] font-medium hover:underline" onClick={(e) => e.stopPropagation()}>
                  Política de Privacidade
                </Link>
              </span>
            </label>

            {/* CTA button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-12 bg-[#0B2A4A] text-white font-semibold rounded-lg hover:bg-[#0A2540] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta grátis →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-[rgba(20,18,15,0.13)]" />
            <span className="text-xs text-[#1a1a2e]/40 whitespace-nowrap">ou continue com</span>
            <div className="flex-1 h-px bg-[rgba(20,18,15,0.13)]" />
          </div>

          {/* Google button — full width, only relevant social option for MEIs */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
            className="w-full h-12 flex items-center justify-center gap-3 border border-[rgba(20,18,15,0.13)] rounded-lg text-sm font-medium text-[#1a1a2e] hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-[#1a1a2e]/30 border-t-[#1a1a2e] rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? "Conectando com Google..." : "Continuar com Google"}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-[#1a1a2e]/55 mt-6">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-[#0B2A4A] font-semibold hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
