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
      <div className="min-h-screen bg-[#141414] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#28A263]/20 rounded-2xl shadow-lg mb-6">
            <MailCheck className="w-10 h-10 text-[#2DDB81]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Email enviado!</h1>
          <p className="text-[#A1A1A1] mb-2 text-lg">Enviamos as instruções para:</p>
          <p className="font-bold text-[#2DDB81] text-lg mb-6">{email}</p>
          <p className="text-[#686F6F] mb-8">
            Clique no link do email para redefinir sua senha. Verifique também a pasta de spam.
          </p>
          <Link to="/login">
            <Button className="w-full h-12 border border-white/10 bg-[#1B1B1B] text-white hover:bg-white/5">
              Voltar para o login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center text-[#686F6F] hover:text-[#A1A1A1] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o login
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#28A263]/20 rounded-2xl shadow-lg mb-4">
            <Mail className="w-8 h-8 text-[#2DDB81]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Esqueceu a senha?</h1>
          <p className="text-[#A1A1A1]">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <Card className="p-8 border border-white/10 bg-[#1B1B1B] shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#28A263] hover:bg-[#2DDB81] text-white h-12 font-semibold"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar link de redefinição"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#A1A1A1]">
            Lembrou a senha?{" "}
            <Link to="/login" className="text-[#2DDB81] hover:text-[#28A263] font-semibold transition-colors">
              Fazer login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
