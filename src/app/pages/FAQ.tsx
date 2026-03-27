import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Plataforma
  {
    category: "Plataforma",
    question: "O Hub do Empreendedor é gratuito?",
    answer: "Sim! Oferecemos um plano gratuito que inclui o Simulador MEI → ME ilimitado, 30 lançamentos por mês no Fluxo de Caixa, 2 propostas comerciais por dia e acesso ao Dashboard. Para recursos ilimitados e simuladores avançados, temos o plano PRO a partir de R$ 9,90/mês.",
  },
  {
    category: "Plataforma",
    question: "Preciso de cadastro para usar o simulador?",
    answer: "O Simulador MEI → ME pode ser usado sem cadastro. Para funcionalidades como Fluxo de Caixa, Gerador de Propostas e Dashboard personalizado, é necessário criar uma conta gratuita.",
  },
  {
    category: "Plataforma",
    question: "Meus dados estão seguros?",
    answer: "Sim. Utilizamos o Supabase como infraestrutura de banco de dados, que oferece criptografia em trânsito e em repouso. Seus dados financeiros são acessíveis apenas por você. Não compartilhamos informações com terceiros.",
  },
  {
    category: "Plataforma",
    question: "Posso cancelar o plano PRO a qualquer momento?",
    answer: "Sim, o cancelamento pode ser feito a qualquer momento. Ao cancelar, você continua com acesso PRO até o final do período pago. Após isso, sua conta volta automaticamente para o plano gratuito sem perda de dados.",
  },
  {
    category: "Plataforma",
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos PIX, boleto bancário e cartão de crédito. O processamento é feito pela Asaas, uma das maiores plataformas de pagamento do Brasil, garantindo segurança e praticidade.",
  },
  // MEI
  {
    category: "MEI",
    question: "O que é o MEI?",
    answer: "O Microempreendedor Individual (MEI) é um regime tributário simplificado para quem fatura até R$ 81.000/ano. Com ele, você tem CNPJ, emite nota fiscal e paga impostos fixos reduzidos (em torno de R$ 70-77/mês).",
  },
  {
    category: "MEI",
    question: "Quando devo migrar de MEI para ME?",
    answer: "Você deve considerar a migração quando: seu faturamento ultrapassar R$ 81.000/ano (ou R$ 6.750/mês), precisar de mais de 1 funcionário, quiser incluir sócios, ou quando sua atividade não for mais permitida como MEI. Use nosso simulador para comparar os custos.",
  },
  {
    category: "MEI",
    question: "Vou pagar mais impostos como ME?",
    answer: "Não necessariamente! Dependendo da sua atividade e faturamento, os impostos como ME no Simples Nacional podem ser até menores que os do MEI. Por isso é tão importante simular antes de decidir. Nosso simulador mostra a comparação exata.",
  },
  {
    category: "MEI",
    question: "Como funciona o Simples Nacional?",
    answer: "O Simples Nacional é um regime tributário unificado que reúne vários impostos em uma única guia (DAS). As alíquotas variam de 4% a 33% dependendo da atividade e do faturamento. Para a maioria dos pequenos negócios, as alíquotas ficam entre 6% e 15,5%.",
  },
  {
    category: "MEI",
    question: "Perco meu CNPJ ao migrar?",
    answer: "Não. Ao migrar de MEI para ME, seu CNPJ permanece o mesmo. O que muda é o enquadramento tributário e a natureza jurídica da empresa.",
  },
  // Ferramentas
  {
    category: "Ferramentas",
    question: "Como funciona o Fluxo de Caixa?",
    answer: "O Fluxo de Caixa permite registrar todas as entradas e saídas do seu negócio. Você categoriza cada lançamento e o sistema calcula automaticamente seu saldo, margem de lucro e gera insights inteligentes como alertas de custos altos ou sugestões de migração.",
  },
  {
    category: "Ferramentas",
    question: "O que faz o Gerador de Propostas?",
    answer: "O Gerador de Propostas cria documentos comerciais profissionais em minutos. Você preenche os dados do cliente, serviço, valor e condições de pagamento. O sistema gera uma proposta formatada que pode ser copiada, enviada por email ou baixada como PDF.",
  },
  {
    category: "Ferramentas",
    question: "Os simuladores são precisos?",
    answer: "Nossos simuladores usam as alíquotas oficiais do Simples Nacional e os valores atualizados do DAS-MEI. No entanto, são ferramentas de simulação e os valores reais podem variar conforme fatores específicos do seu negócio. Recomendamos consultar um contador para decisões definitivas.",
  },
  {
    category: "Ferramentas",
    question: "Posso exportar meus dados?",
    answer: "Sim! Propostas podem ser exportadas como PDF ou copiadas como texto. O Fluxo de Caixa pode ser visualizado por diferentes períodos. Estamos trabalhando em mais opções de exportação em breve.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todas");

  const categories = ["Todas", "Plataforma", "MEI", "Ferramentas"];

  const filtered = activeCategory === "Todas"
    ? faqData
    : faqData.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-black">
      <Header onScrollToSimulator={() => {}} />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[#A1A1A1] hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao início
          </Link>

          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-[#28A263]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-[#2DDB81]" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Perguntas <span className="text-[#2DDB81]">Frequentes</span>
            </h1>
            <p className="text-lg text-[#A1A1A1] max-w-2xl mx-auto">
              Encontre respostas para as dúvidas mais comuns sobre a plataforma, MEI e nossas ferramentas.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 justify-center mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-[#28A263] text-white"
                    : "bg-[#1B1B1B] text-[#A1A1A1] hover:text-white border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filtered.map((item, index) => (
              <div
                key={index}
                className="bg-[#1B1B1B] rounded-2xl border border-white/5 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xs px-2 py-1 rounded-full bg-[#28A263]/10 text-[#2DDB81] border border-[#28A263]/20 font-medium flex-shrink-0">
                      {item.category}
                    </span>
                    <span className="text-white font-medium">{item.question}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#A1A1A1] flex-shrink-0 ml-4 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`} />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-[#C8C9D0] leading-relaxed pl-[calc(theme(spacing.3)+theme(spacing.2)+60px)]">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-[#1B1B1B] rounded-2xl border border-white/5 p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Ainda tem dúvidas?</h2>
            <p className="text-[#A1A1A1] mb-6">
              Entre em contato conosco ou comece a usar a plataforma gratuitamente.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="mailto:suporte@hubempreendedor.com">
                <Button size="lg" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl">
                  Enviar Email
                </Button>
              </a>
              <Link to="/signup">
                <Button size="lg" className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl">
                  Começar Grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
