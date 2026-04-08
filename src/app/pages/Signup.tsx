import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { UserPlus, Mail, Lock, User, ArrowLeft, Check, MailCheck, Eye, EyeOff } from "lucide-react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const loggedIn = await signup(name, email, password);
      if (loggedIn) {
        navigate("/app");
      } else {
        setEmailSent(true);
      }
    } catch (error: any) {
      const msg = error?.message || "";
      if (msg.includes("already registered") || msg.includes("User already registered")) {
        toast.error("Este email já está cadastrado. Faça login ou use outro email.");
      } else if (msg.includes("invalid email") || msg.includes("Invalid email")) {
        toast.error("Email inválido. Verifique o endereço digitado.");
      } else if (msg.includes("password")) {
        toast.error("Senha muito fraca. Use pelo menos 8 caracteres com letras e números.");
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Email Verification Screen
  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F8F9FA] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#28A263]/12 rounded-2xl mb-8">
            <MailCheck className="w-10 h-10 text-[#28A263]" />
          </div>
          <h1 className="text-4xl font-bold text-[#001529] mb-4">
            Confirme seu email
          </h1>
          <p className="text-lg text-[rgba(0,21,41,0.65)] mb-2">
            Enviamos um link de confirmação para:
          </p>
          <p className="font-semibold text-[#28A263] text-lg mb-8">{email}</p>
          <p className="text-[rgba(0,21,41,0.65)] mb-10">
            Clique no link do email para ativar sua conta e acessar todas as ferramentas gratuitamente.
          </p>

          <Card className="p-8 border border-[rgba(0,0,0,0.08)] bg-white shadow-sm mb-8 text-left">
            <p className="text-sm font-semibold text-[#001529] mb-4">Não recebeu o email?</p>
            <ul className="text-sm text-[rgba(0,21,41,0.65)] space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#28A263] font-bold flex-shrink-0">•</span>
                <span>Verifique a pasta de <strong>spam/lixo eletrônico</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#28A263] font-bold flex-shrink-0">•</span>
                <span>Aguarde alguns minutos para receber</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#28A263] font-bold flex-shrink-0">•</span>
                <span>Verifique se o email está correto</span>
              </li>
            </ul>
          </Card>

          <Button
            className="w-full h-12 bg-[#28A263] hover:bg-[#1F8C50] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg mb-4"
            onClick={() => navigate("/login")}
          >
            Já confirmei meu email
          </Button>

          <Link
            to="/signup"
            className="text-sm text-[#28A263] hover:text-[#1F8C50] transition-colors font-medium"
            onClick={() => setEmailSent(false)}
          >
            Voltar para o formulário
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F8F9FA] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side - Value Proposition */}
        <div className="hidden lg:block order-last">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#001529] mb-4 leading-tight">
                Crie sua conta grátis e comece agora
              </h2>
              <p className="text-xl text-[rgba(0,21,41,0.65)]">
                Junte-se a milhares de empreendedores que já controlam suas finanças inteligentemente
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Simule impostos e descubra quando migrar de MEI para ME",
                "Calcule o preço ideal para seus produtos e serviços",
                "Projete lucros e encontre seu ponto de equilíbrio",
                "Gere propostas profissionais em segundos"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-[#28A263] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-white font-bold" />
                  </div>
                  <p className="text-[rgba(0,21,41,0.65)] leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#28A263]/10 to-[#28A263]/5 rounded-2xl p-8 border border-[#28A263]/15">
              <p className="text-sm font-bold text-[#28A263] uppercase tracking-wide mb-4">Plano Gratuito Inclui:</p>
              <ul className="space-y-3 text-sm text-[rgba(0,21,41,0.65)]">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                  <span>Simulador MEI → ME ilimitado</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                  <span>2 propostas comerciais por dia</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#28A263] flex-shrink-0" />
                  <span>Dashboard personalizado</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[rgba(0,21,41,0.6)] hover:text-[#001529] mb-8 transition-colors font-medium lg:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>

          <div className="text-center mb-10 lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/12 rounded-2xl mb-6">
              <UserPlus className="w-8 h-8 text-[#28A263]" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#001529] mb-3">
              Crie sua conta
            </h1>
            <p className="text-lg text-[rgba(0,21,41,0.65)]">
              Sem cartão de crédito. Acesso imediato.
            </p>
          </div>

          {/* Sign Up Form */}
          <Card className="p-8 border border-[rgba(0,0,0,0.08)] bg-white shadow-sm mb-6">
            <form onSubmit={handleSignup} className="space-y-5">
              {/* Full Name */}
              <div>
                <Label htmlFor="name" className="block text-sm font-semibold text-[#001529] mb-3">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João Silva"
                  required
                  className="h-12 bg-white border border-[rgba(0,0,0,0.08)] text-[#001529] placeholder:text-[rgba(0,21,41,0.5)] rounded-lg focus:border-[#28A263]/30 focus:ring-1 focus:ring-[#28A263]/20 transition-all"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
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

              {/* Password */}
              <div>
                <Label htmlFor="password" className="block text-sm font-semibold text-[#001529] mb-3">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                    className="h-12 bg-white border border-[rgba(0,0,0,0.08)] text-[#001529] placeholder:text-[rgba(0,21,41,0.5)] rounded-lg focus:border-[#28A263]/30 focus:ring-1 focus:ring-[#28A263]/20 transition-all pr-12"
                    autoComplete="new-password"
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
                    Criando conta...
                  </span>
                ) : (
                  "Criar conta grátis"
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm text-[rgba(0,21,41,0.65)]">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-[#28A263] hover:text-[#1F8C50] font-semibold transition-colors">
                Fazer login
              </Link>
            </div>
          </Card>

          {/* Footer Links */}
          <p className="text-center text-xs text-[rgba(0,21,41,0.55)]">
            Ao criar uma conta, você concorda com nossos{" "}
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
    </div>
  );
}
