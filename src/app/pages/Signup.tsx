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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-6">
            <MailCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Verifique seu email!
          </h1>
          <p className="text-slate-600 mb-2 text-lg">
            Enviamos um link de confirmação para:
          </p>
          <p className="font-bold text-purple-700 text-lg mb-6">{email}</p>
          <p className="text-slate-500 mb-8">
            Clique no link do email para ativar sua conta e acessar todas as ferramentas.
          </p>
          <Card className="p-6 border-2 border-slate-200 shadow-lg text-left mb-6">
            <p className="text-sm font-bold text-slate-700 mb-3">Não recebeu o email?</p>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>• Verifique a pasta de <strong>spam/lixo eletrônico</strong></li>
              <li>• Aguarde alguns minutos</li>
              <li>• Certifique-se de que o email está correto</li>
            </ul>
          </Card>
          <Button
            variant="outline"
            className="w-full h-12 border-2"
            onClick={() => navigate("/login")}
          >
            Já confirmei meu email — Fazer login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Value proposition */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Comece a tomar decisões mais inteligentes
              </h2>
              <p className="text-lg text-slate-600">
                Junte-se a milhares de empreendedores que já usam o Hub do Empreendedor
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
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-slate-700">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6 border-2 border-purple-200">
              <p className="text-sm font-bold text-purple-900 mb-2">🎉 Plano Gratuito Inclui:</p>
              <ul className="text-sm text-purple-800 space-y-1">
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
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors lg:hidden"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o início
          </Link>

          <div className="text-center mb-6 lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Crie sua conta grátis
            </h1>
            <p className="text-slate-600">
              Sem cartão de crédito. Comece agora!
            </p>
          </div>

          <Card className="p-8 border-2 border-slate-200 shadow-xl">
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2 mb-2">
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
                  className="h-12"
                  autoComplete="name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
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
                  className="h-12"
                  autoComplete="email"
                />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2 mb-2">
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
                  className="h-12"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
                disabled={loading}
              >
                {loading ? "Criando conta..." : "Criar conta grátis"}
              </Button>
            </form>

            <div className="my-5">
              <div className="relative">
                <Separator />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-slate-500">
                  ou
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full h-12 border-2"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </Button>

            <div className="mt-6 text-center text-sm text-slate-600">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                Fazer login
              </Link>
            </div>
          </Card>

          <p className="text-center text-xs text-slate-500 mt-4">
            Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade
          </p>
        </div>
      </div>
    </div>
  );
}
