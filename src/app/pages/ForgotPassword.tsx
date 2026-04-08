import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { pb } from "../../lib/pocketbase";
import { toast } from "sonner";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pb.collection("profiles").requestPasswordReset(email);
      setEmailSent(true);
    } catch (error: any) {
      toast.error("Erro ao enviar email. Verifique o endereço e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#28A263]/10 rounded-2xl shadow-sm mb-6">
            <MailCheck className="w-10 h-10 text-[#28A263]" />
          </div>
          <h1 className="text-3xl font-bold text-[#001529] mb-3">Email enviado!</h1>
          <p className="text-[rgba(0,21,41,0.6)] mb-2 text-lg">Enviamos as instruções para:</p>
          <p className="font-bold text-[#28A263] text-lg mb-6">{email}</p>
          <p className="text-[rgba(0,21,41,0.5)] mb-8">
            Clique no link do email para redefinir sua senha. Verifique também a pasta de spam.
          </p>
          <Link to="/login">
            <Button className="w-full h-12 border border-[#E8EBF1] bg-white text-[#001529] hover:bg-[#F9FAFB]">
              Voltar para o login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center text-[rgba(0,21,41,0.5)] hover:text-[#001529] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o login
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/10 rounded-2xl shadow-sm mb-4">
            <Mail className="w-8 h-8 text-[#28A263]" />
          </div>
          <h1 className="text-3xl font-bold text-[#001529] mb-2">Esqueceu a senha?</h1>
          <p className="text-[rgba(0,21,41,0.6)]">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <Card className="p-8 border border-[#E8EBF1] bg-white shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="h-12 bg-white border-[#E8EBF1] text-[#001529] placeholder:text-[rgba(0,21,41,0.4)] focus:ring-1 focus:ring-[#28A263]/20"
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#28A263] hover:bg-[#1f7a4a] text-white h-12 font-semibold"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar link de redefinição"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[rgba(0,21,41,0.6)]">
            Lembrou a senha?{" "}
            <Link to="/login" className="text-[#28A263] hover:text-[#1f7a4a] font-semibold transition-colors">
              Fazer login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
