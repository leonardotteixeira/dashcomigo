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
    <div className="min-h-screen bg-[#F5F7FA]">
      <LandingNav />

      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#001529] via-[#002140] to-[#003a6d]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-extrabold text-white text-5xl mb-4">Entre em Contato</h1>
          <p className="text-xl text-white/80 font-light">Estamos aqui para ajudar você</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
          {/* Contact info */}
          <div className="space-y-8">
            <h2 className="font-bold text-[#001529] text-2xl">Fale conosco</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#003a6d]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#003a6d]" />
                </div>
                <div>
                  <p className="font-semibold text-[#001529] mb-1">Email</p>
                  <a
                    href="mailto:contato@finmei.com.br"
                    className="text-[#003a6d] hover:underline"
                  >
                    contato@finmei.com.br
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#003a6d]/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-[#003a6d]" />
                </div>
                <div>
                  <p className="font-semibold text-[#001529] mb-1">WhatsApp</p>
                  <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#003a6d] hover:underline"
                  >
                    (11) 99999-9999
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#003a6d]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#003a6d]" />
                </div>
                <div>
                  <p className="font-semibold text-[#001529] mb-1">Horário de atendimento</p>
                  <p className="text-[#001529]/60">Seg-Sex, 9h às 18h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#001529] text-xl mb-2">Mensagem enviada!</h3>
                <p className="text-[#001529]/60">Entraremos em contato em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="nome" className="block text-sm font-semibold text-[#001529] mb-1">
                    Nome completo
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    value={form.nome}
                    onChange={handleChange}
                    className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#001529] placeholder-[#001529]/40 focus:outline-none focus:ring-2 focus:ring-[#003a6d]/30 focus:border-[#003a6d]"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#001529] mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#001529] placeholder-[#001529]/40 focus:outline-none focus:ring-2 focus:ring-[#003a6d]/30 focus:border-[#003a6d]"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="assunto" className="block text-sm font-semibold text-[#001529] mb-1">
                    Assunto
                  </label>
                  <select
                    id="assunto"
                    name="assunto"
                    required
                    value={form.assunto}
                    onChange={handleChange}
                    className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#001529] focus:outline-none focus:ring-2 focus:ring-[#003a6d]/30 focus:border-[#003a6d] bg-white"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvidas">Dúvidas</option>
                    <option value="suporte">Suporte técnico</option>
                    <option value="comercial">Comercial</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensagem" className="block text-sm font-semibold text-[#001529] mb-1">
                    Mensagem
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    required
                    rows={5}
                    value={form.mensagem}
                    onChange={handleChange}
                    className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-[#001529] placeholder-[#001529]/40 focus:outline-none focus:ring-2 focus:ring-[#003a6d]/30 focus:border-[#003a6d] resize-none"
                    placeholder="Escreva sua mensagem..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#003a6d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002a50] transition-all"
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
