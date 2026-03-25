import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setEmailSent(true);
    } catch (error: any) {
      toast.error("Erro ao enviar email. Verifique o endereço e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-6">
            <MailCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Email enviado!</h1>
          <p className="text-slate-600 mb-2 text-lg">Enviamos as instruções para:</p>
          <p className="font-bold text-purple-700 text-lg mb-6">{email}</p>
          <p className="text-slate-500 mb-8">
            Clique no link do email para redefinir sua senha. Verifique também a pasta de spam.
          </p>
          <Link to="/login">
            <Button variant="outline" className="w-full h-12 border-2">
              Voltar para o login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o login
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Esqueceu a senha?</h1>
          <p className="text-slate-600">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <Card className="p-8 border-2 border-slate-200 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar link de redefinição"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Lembrou a senha?{" "}
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Fazer login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
