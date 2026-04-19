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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
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
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: "#0E3B2E" }}
                  >
                    (11) 99999-9999
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
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(127,209,159,0.2)" }}>
                  <svg className="w-8 h-8" style={{ color: "#1F5A3A" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: "#0E3B2E" }}>Mensagem enviada!</h3>
                <p style={{ color: "rgba(14,59,46,0.6)" }}>Entraremos em contato em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full px-6 py-3 rounded-lg font-semibold transition-all"
                  style={{ background: submitHover ? "#1F5A3A" : "#0E3B2E", color: "#F4EFE6" }}
                  onMouseEnter={() => setSubmitHover(true)}
                  onMouseLeave={() => setSubmitHover(false)}
                >
                  Enviar mensagem
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
