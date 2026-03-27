import { MessageSquareQuote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Marina Silva",
      role: "Designer Freelancer",
      content: "Descobri que estava pagando mais impostos do que precisava! A simulação me ajudou a entender que migrar para ME seria mais vantajoso.",
      highlight: true,
    },
    {
      name: "Carlos Mendes",
      role: "Desenvolvedor de Software",
      content: "Ferramenta simples e direta. Em 2 minutos consegui entender exatamente quando faria sentido sair do MEI. Recomendo!",
      highlight: false,
    },
    {
      name: "Juliana Costa",
      role: "Consultora de Marketing",
      content: "Estava com medo de ultrapassar o limite do MEI. O simulador me deu a segurança que eu precisava para planejar minha transição.",
      highlight: false,
    },
    {
      name: "Pedro Almeida",
      role: "Dono de E-commerce",
      content: "O fluxo de caixa inteligente mudou a forma como gerencio minhas finanças. Agora tenho visibilidade total do meu negócio.",
      highlight: true,
    },
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#F4F4F6] mb-2 leading-tight">
              O que nossos <span className="text-[#2DDB81]">clientes</span>
              <br />dizem
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <MessageSquareQuote className="w-8 h-8 text-[#28A263]" />
            <p className="text-sm text-[#C8C9D0] max-w-[300px]">
              Milhares de empreendedores já usaram nosso simulador para tomar decisões mais inteligentes.
            </p>
          </div>
        </div>

        <div className="flex items-center mb-8">
          <button className="px-6 py-3 rounded-full border-2 border-white text-[#3AFF99] text-sm font-medium hover:bg-white/5 transition-colors">
            Ver depoimentos
          </button>
        </div>

        {/* Grid 2x2 */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`rounded-[32px] p-8 h-[250px] flex flex-col justify-between ${
                testimonial.highlight ? "bg-[#22242F]" : "bg-[#131317]"
              }`}
            >
              <div className="space-y-4">
                <h3 className="text-[#F4F4F6] text-xl font-light leading-snug">
                  {testimonial.content.length > 60
                    ? testimonial.content.substring(0, 60) + "..."
                    : testimonial.content}
                </h3>
                <p className="text-[#C8C9D0] text-sm font-medium leading-relaxed">
                  {testimonial.content}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="w-12 h-12 rounded-full bg-[#DEDFE3] border-2 border-[#45485F] flex items-center justify-center text-[#22242F] font-bold text-sm">
                  {testimonial.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="text-[#DEDFE3] font-light">{testimonial.name}</div>
                  <div className="text-[#9C9EAB] text-sm font-medium">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
