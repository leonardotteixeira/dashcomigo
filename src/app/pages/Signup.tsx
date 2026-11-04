import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  Mail, Lock, User, Eye, EyeOff,
  Zap, Shield,
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

  const { signup } = useAuth();
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
      await signup(name.trim(), email.trim(), password);
      navigate("/app");
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
