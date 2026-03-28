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
      <div className="min-h-screen bg-[#141414] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#28A263]/20 rounded-2xl shadow-lg mb-6">
            <MailCheck className="w-10 h-10 text-[#2DDB81]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Verifique seu email!
          </h1>
          <p className="text-[#A1A1A1] mb-2 text-lg">
            Enviamos um link de confirmação para:
          </p>
          <p className="font-bold text-[#2DDB81] text-lg mb-6">{email}</p>
          <p className="text-[#686F6F] mb-8">
            Clique no link do email para ativar sua conta e acessar todas as ferramentas.
          </p>
          <Card className="p-6 border border-white/10 bg-[#1B1B1B] shadow-lg text-left mb-6">
            <p className="text-sm font-bold text-[#A1A1A1] mb-3">Não recebeu o email?</p>
            <ul className="text-sm text-[#686F6F] space-y-2">
              <li>• Verifique a pasta de <strong>spam/lixo eletrônico</strong></li>
              <li>• Aguarde alguns minutos</li>
              <li>• Certifique-se de que o email está correto</li>
            </ul>
          </Card>
          <Button
            className="w-full h-12 border border-white/10 bg-[#1B1B1B] text-white hover:bg-white/5"
            onClick={() => navigate("/login")}
          >
            Já confirmei meu email — Fazer login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Value proposition */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Comece a tomar decisões mais inteligentes
              </h2>
              <p className="text-lg text-[#A1A1A1]">
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
                  <p className="text-[#A1A1A1]">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#28A263]/10 rounded-2xl p-6 border border-[#28A263]/20">
              <p className="text-sm font-bold text-[#2DDB81] mb-2">Plano Gratuito Inclui:</p>
              <ul className="text-sm text-[#A1A1A1] space-y-1">
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
            className="inline-flex items-center text-[#686F6F] hover:text-[#A1A1A1] mb-6 transition-colors lg:hidden"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o início
          </Link>

          <div className="text-center mb-6 lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/20 rounded-2xl shadow-lg mb-4">
              <UserPlus className="w-8 h-8 text-[#2DDB81]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Crie sua conta grátis
            </h1>
            <p className="text-[#A1A1A1]">
              Sem cartão de crédito. Comece agora!
            </p>
          </div>

          <Card className="p-8 border border-white/10 bg-[#1B1B1B] shadow-xl">
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-white">
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
                  className="h-12 bg-[#141414] border-white/10 text-white placeholder:text-[#686F6F]"
                  autoComplete="name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-white">
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
                  className="h-12 bg-[#141414] border-white/10 text-white placeholder:text-[#686F6F]"
                  autoComplete="email"
                />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2 mb-2 text-white">
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
                  className="h-12 bg-[#141414] border-white/10 text-white placeholder:text-[#686F6F]"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#28A263] hover:bg-[#2DDB81] text-white h-12 font-semibold"
                disabled={loading}
              >
                {loading ? "Criando conta..." : "Criar conta grátis"}
              </Button>
            </form>


            <div className="mt-6 text-center text-sm text-[#A1A1A1]">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-[#2DDB81] hover:text-[#28A263] font-semibold transition-colors">
                Fazer login
              </Link>
            </div>
          </Card>

          <p className="text-center text-xs text-[#686F6F] mt-4">
            Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade
          </p>
        </div>
      </div>
    </div>
  );
}
