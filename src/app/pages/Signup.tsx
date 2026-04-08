import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { UserPlus, Mail, Lock, User, ArrowLeft, Check, MailCheck } from "lucide-react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

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

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      // O redirecionamento acontece automaticamente via OAuth
    } catch (error: any) {
      toast.error("Erro ao continuar com Google. Tente novamente.");
      setLoading(false);
    }
  };

  // Tela de confirmação de email
  if (emailSent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#28A263]/20 rounded-2xl shadow-lg mb-6">
            <MailCheck className="w-10 h-10 text-[#28A263]" />
          </div>
          <h1 className="text-3xl font-bold text-[#001529] mb-3">
            Verifique seu email!
          </h1>
          <p className="text-[rgba(0,21,41,0.6)] mb-2 text-lg">
            Enviamos um link de confirmação para:
          </p>
          <p className="font-bold text-[#28A263] text-lg mb-6">{email}</p>
          <p className="text-[rgba(0,21,41,0.5)] mb-8">
            Clique no link do email para ativar sua conta e acessar todas as ferramentas.
          </p>
          <Card className="p-6 border border-[rgba(0,0,0,0.1)] bg-[#F8F9FA] shadow-lg text-left mb-6">
            <p className="text-sm font-bold text-[rgba(0,21,41,0.6)] mb-3">Não recebeu o email?</p>
            <ul className="text-sm text-[rgba(0,21,41,0.5)] space-y-2">
              <li>• Verifique a pasta de <strong>spam/lixo eletrônico</strong></li>
              <li>• Aguarde alguns minutos</li>
              <li>• Certifique-se de que o email está correto</li>
            </ul>
          </Card>
          <Button
            className="w-full h-12 border border-[rgba(0,0,0,0.1)] bg-white text-[#001529] hover:bg-[#F8F9FA]"
            onClick={() => navigate("/login")}
          >
            Já confirmei meu email — Fazer login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Value proposition */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-[#001529] mb-4">
                Comece a tomar decisões mais inteligentes
              </h2>
              <p className="text-lg text-[rgba(0,21,41,0.6)]">
                Junte-se a milhares de empreendedores que já usam o Meu Fluxo
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Simule impostos e descubra quando migrar de MEI para ME",
                "Calcule o preço ideal para seus produtos",
                "Projete lucros e encontre o ponto de equilíbrio",
                "Gere propostas profissionais em minutos"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#28A263] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-[rgba(0,21,41,0.6)]">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#28A263]/10 rounded-2xl p-6 border border-[#28A263]/20">
              <p className="text-sm font-bold text-[#28A263] mb-2">Plano Gratuito Inclui:</p>
              <ul className="text-sm text-[rgba(0,21,41,0.6)] space-y-1">
                <li>✓ Simulador MEI → ME ilimitado</li>
                <li>✓ 2 propostas comerciais por dia</li>
                <li>✓ Acesso ao dashboard</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side - Signup form */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center text-[rgba(0,21,41,0.5)] hover:text-[rgba(0,21,41,0.7)] mb-6 transition-colors lg:hidden"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o início
          </Link>

          <div className="text-center mb-6 lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/20 rounded-2xl shadow-lg mb-4">
              <UserPlus className="w-8 h-8 text-[#28A263]" />
            </div>
            <h1 className="text-3xl font-bold text-[#001529] mb-2">
              Crie sua conta grátis
            </h1>
            <p className="text-[rgba(0,21,41,0.6)]">
              Sem cartão de crédito. Comece agora!
            </p>
          </div>

          <Card className="p-8 border border-[rgba(0,0,0,0.1)] bg-white shadow-xl">
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-[#001529]">
                  <User className="w-4 h-4" />
                  Nome completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João Silva"
                  required
                  className="h-12 bg-white border-[rgba(0,0,0,0.1)] text-[#001529] placeholder:text-[rgba(0,21,41,0.5)]"
                  autoComplete="name"
                />
              </div>

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
                <Label htmlFor="password" className="flex items-center gap-2 mb-2 text-[#001529]">
                  <Lock className="w-4 h-4" />
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                  className="h-12 bg-white border-[rgba(0,0,0,0.1)] text-[#001529] placeholder:text-[rgba(0,21,41,0.5)]"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#28A263] hover:bg-[#1F8C50] text-white h-12 font-semibold"
                disabled={loading}
              >
                {loading ? "Criando conta..." : "Criar conta grátis"}
              </Button>
            </form>


            <div className="mt-6 text-center text-sm text-[rgba(0,21,41,0.6)]">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-[#28A263] hover:text-[#1F8C50] font-semibold transition-colors">
                Fazer login
              </Link>
            </div>
          </Card>

          <p className="text-center text-xs text-[rgba(0,21,41,0.5)] mt-4">
            Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade
          </p>
        </div>
      </div>
    </div>
  );
}
