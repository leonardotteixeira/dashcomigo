import { LandingNav } from "../components/LandingNav";
import { LandingFooter } from "../components/LandingFooter";

const posts = [
  {
    category: "Finanças",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "Como organizar as finanças do seu MEI em 5 passos",
    excerpt:
      "Organizar as finanças do seu MEI não precisa ser complicado. Neste guia prático, mostramos como separar contas, categorizar despesas e criar uma rotina financeira que funciona.",
    author: "Equipe FinMEI",
    date: "15 Jan 2026",
  },
  {
    category: "Tributário",
    categoryColor: "bg-orange-100 text-orange-700",
    title: "DAS-MEI: Tudo que você precisa saber para não perder o prazo",
    excerpt:
      "O DAS-MEI é a guia mensal obrigatória de todo microempreendedor individual. Entenda como calcular, quando pagar e as consequências de atrasar o pagamento.",
    author: "Equipe FinMEI",
    date: "22 Jan 2026",
  },
  {
    category: "Crescimento",
    categoryColor: "bg-green-100 text-green-700",
    title: "MEI ou ME: Quando é a hora de migrar?",
    excerpt:
      "Chegou um momento em que seu faturamento está próximo do limite do MEI? Descubra os sinais de que é hora de migrar para Microempresa e como fazer essa transição.",
    author: "Equipe FinMEI",
    date: "5 Fev 2026",
  },
  {
    category: "Gestão",
    categoryColor: "bg-purple-100 text-purple-700",
    title: "Fluxo de caixa: o segredo do MEI bem-sucedido",
    excerpt:
      "Controlar o fluxo de caixa é a diferença entre um MEI que cresce e um que fecha as portas. Aprenda como monitorar entradas e saídas de forma simples e eficiente.",
    author: "Equipe FinMEI",
    date: "14 Fev 2026",
  },
];

export function Blog() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <LandingNav />

      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#001529] via-[#002140] to-[#003a6d]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-extrabold text-white text-5xl mb-4">Blog FinMEI</h1>
          <p className="text-xl text-white/80 font-light">
            Dicas, guias e novidades para MEIs prosperarem
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.title}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <span
                  className={`inline-block self-start text-xs font-semibold px-3 py-1 rounded-full mb-4 ${post.categoryColor}`}
                >
                  {post.category}
                </span>
                <h2 className="font-bold text-[#001529] text-xl mb-3 leading-snug">{post.title}</h2>
                <p className="text-[#001529]/60 text-sm leading-relaxed mb-6 flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#003a6d]/10" />
                    <div>
                      <p className="text-xs font-semibold text-[#001529]">{post.author}</p>
                      <p className="text-xs text-[#001529]/50">{post.date}</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-semibold text-[#003a6d] hover:text-[#002a50] transition-colors"
                  >
                    Ler mais &rarr;
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
