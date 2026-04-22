import { useState } from "react";
import { LandingNav } from "../components/LandingNav";
import { LandingFooter } from "../components/LandingFooter";
import { Mail, MessageCircle, Clock } from "lucide-react";

interface FormState {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

export function Contato() {
  const [form, setForm] = useState<FormState>({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!form.nome.trim()) {
      setError("Por favor, insira seu nome.");
      setLoading(false);
      return;
    }

    if (!form.email.trim() || !form.email.includes("@")) {
      setError("Por favor, insira um email válido.");
      setLoading(false);
      return;
    }

    if (!form.assunto) {
      setError("Por favor, selecione um assunto.");
      setLoading(false);
      return;
    }

    if (form.mensagem.trim().length < 10) {
      setError("A mensagem deve ter pelo menos 10 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        setError(data.error || "Erro ao enviar mensagem. Tente novamente em alguns minutos.");
        setLoading(false);
        return;
      }

      if (data.success) {
        setSubmitted(true);
        setSuccessMessage(data.message || "Entraremos em contato em breve.");
        setForm({ nome: "", email: "", assunto: "", mensagem: "" });

        setTimeout(() => {
          setSuccessMessage(null);
          setSubmitted(false);
        }, 5000);
      } else {
        setError(data.error || "Erro ao enviar mensagem. Tente novamente.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setError(
        "Erro de conexão. Verifique sua internet e tente novamente. Se o problema persistir, entre em contato via WhatsApp."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#F4EFE6" }}>
      <LandingNav />

      {/* Header */}
      <section className="pt-32 pb-16" style={{ background: "#0E3B2E" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-extrabold text-white text-5xl mb-4">Entre em Contato</h1>
          <p className="text-xl text-white/80 font-light">Estamos aqui para ajudar você</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20" style={{ background: "#F4EFE6" }}>
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
          {/* Contact info */}
          <div className="space-y-8">
            <h2 className="font-bold text-2xl" style={{ color: "#0E3B2E" }}>Fale conosco</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(14,59,46,0.1)" }}>
                  <Mail className="w-6 h-6" style={{ color: "#0E3B2E" }} />
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: "#0E3B2E" }}>Email</p>
                  <a
                    href="mailto:contato@dashcomigo.com.br"
                    className="hover:underline"
                    style={{ color: "#0E3B2E" }}
                  >
                    contato@dashcomigo.com.br
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(14,59,46,0.1)" }}>
                  <MessageCircle className="w-6 h-6" style={{ color: "#0E3B2E" }} />
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: "#0E3B2E" }}>WhatsApp</p>
                  <a
                    href="https://wa.me/5519996738694"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: "#0E3B2E" }}
                  >
                    (19) 99673-8694
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(14,59,46,0.1)" }}>
                  <Clock className="w-6 h-6" style={{ color: "#0E3B2E" }} />
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ color: "#0E3B2E" }}>Horário de atendimento</p>
                  <p style={{ color: "rgba(14,59,46,0.6)" }}>Seg-Sex, 9h às 18h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="border rounded-2xl p-8 shadow-sm" style={{ background: "#EBE4D6", borderColor: "rgba(20,18,15,0.13)" }}>
            {submitted && successMessage ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(127,209,159,0.2)" }}>
                  <svg className="w-8 h-8" style={{ color: "#1F5A3A" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: "#0E3B2E" }}>Mensagem enviada!</h3>
                <p style={{ color: "rgba(14,59,46,0.6)" }}>{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div
                    className="p-4 rounded-lg text-sm font-medium"
                    style={{ background: "rgba(220, 38, 38, 0.1)", color: "#991B1B", border: "1px solid rgba(220, 38, 38, 0.3)" }}
                  >
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="nome" className="block text-sm font-semibold mb-1" style={{ color: "#0E3B2E" }}>
                    Nome completo
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    value={form.nome}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/30 focus:border-[#0E3B2E]"
                    style={{ background: "#F4EFE6", color: "#0E3B2E", borderColor: "rgba(20,18,15,0.13)" }}
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-1" style={{ color: "#0E3B2E" }}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/30 focus:border-[#0E3B2E]"
                    style={{ background: "#F4EFE6", color: "#0E3B2E", borderColor: "rgba(20,18,15,0.13)" }}
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="assunto" className="block text-sm font-semibold mb-1" style={{ color: "#0E3B2E" }}>
                    Assunto
                  </label>
                  <select
                    id="assunto"
                    name="assunto"
                    required
                    value={form.assunto}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/30 focus:border-[#0E3B2E]"
                    style={{ background: "#F4EFE6", color: "#0E3B2E", borderColor: "rgba(20,18,15,0.13)" }}
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvidas">Dúvidas</option>
                    <option value="suporte">Suporte técnico</option>
                    <option value="comercial">Comercial</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensagem" className="block text-sm font-semibold mb-1" style={{ color: "#0E3B2E" }}>
                    Mensagem
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    required
                    rows={5}
                    value={form.mensagem}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/30 focus:border-[#0E3B2E] resize-none"
                    style={{ background: "#F4EFE6", color: "#0E3B2E", borderColor: "rgba(20,18,15,0.13)" }}
                    placeholder="Escreva sua mensagem..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: loading ? "rgba(14,59,46,0.5)" : submitHover ? "#1F5A3A" : "#0E3B2E",
                    color: "#F4EFE6",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={() => !loading && setSubmitHover(true)}
                  onMouseLeave={() => !loading && setSubmitHover(false)}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        style={{ color: "#F4EFE6" }}
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    "Enviar mensagem"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
