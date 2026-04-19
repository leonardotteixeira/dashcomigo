import { Link } from "react-router";
import { LandingNav } from "../components/LandingNav";
import { LandingFooter } from "../components/LandingFooter";

export function Sobre() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#001529] via-[#002140] to-[#003a6d]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-extrabold text-white text-5xl mb-6">Sobre o DashComigo</h1>
          <p className="text-xl text-white/80 leading-relaxed font-light">
            Ajudamos MEIs a crescer com inteligência financeira e controle total
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bold text-[#001529] text-3xl mb-6">Nossa história</h2>
          <p className="text-lg text-[#001529]/70 leading-relaxed mb-4">
            Nascemos da necessidade real de empreendedores que lutavam para organizar suas finanças. Vimos de perto os desafios que os microempreendedores individuais enfrentam todos os dias — controle de caixa, prazos do DAS-MEI, fluxo de receitas e despesas — tudo gerenciado em planilhas complicadas ou cadernos.
          </p>
          <p className="text-lg text-[#001529]/70 leading-relaxed">
            Decidimos criar uma solução simples, intuitiva e poderosa, pensada especialmente para quem empreende no Brasil. Hoje, o DashComigo ajuda milhares de MEIs a tomarem decisões financeiras mais inteligentes, com dados claros e ferramentas acessíveis.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-bold text-[#001529] text-3xl mb-4">Nossa missão</h2>
          <p className="text-xl text-[#001529]/60 max-w-2xl mx-auto">
            Democratizar a inteligência financeira para que todo microempreendedor brasileiro possa crescer com segurança e confiança.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-bold text-[#001529] text-3xl mb-12 text-center">Nossos valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Simplicidade",
                description: "Acreditamos que ferramentas poderosas não precisam ser complicadas. Cada funcionalidade do DashComigo foi desenhada para ser intuitiva e fácil de usar.",
              },
              {
                title: "Transparência",
                description: "Sem letras miúdas, sem surpresas. Somos diretos sobre preços, funcionalidades e limitações porque acreditamos em relações honestas com nossos clientes.",
              },
              {
                title: "Crescimento",
                description: "Queremos ver cada MEI prosperar. Nossas ferramentas são pensadas para acompanhar sua jornada — do primeiro cadastro até a expansão do seu negócio.",
              },
            ].map((value) => (
              <div key={value.title} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#003a6d]/10 flex items-center justify-center mb-4">
                  <div className="w-5 h-5 rounded-full bg-[#003a6d]" />
                </div>
                <h3 className="font-bold text-[#001529] text-xl mb-3">{value.title}</h3>
                <p className="text-[#001529]/60 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-bold text-[#001529] text-3xl mb-4">Nossa equipe</h2>
          <p className="text-lg text-[#001529]/60 mb-10">
            Uma equipe apaixonada por tecnologia e empreendedorismo, reunida com o propósito de transformar a gestão financeira dos MEIs brasileiros.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {["Produto", "Engenharia", "Atendimento"].map((area) => (
              <div key={area} className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#003a6d]/10 mx-auto mb-4" />
                <p className="font-semibold text-[#001529]">{area}</p>
                <p className="text-sm text-[#001529]/60 mt-1">Time dedicado</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#001529] to-[#003a6d]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-extrabold text-white text-4xl mb-6">Faça parte dessa história</h2>
          <p className="text-xl text-white/80 mb-10 font-light">
            Junte-se a milhares de MEIs que já confiam no DashComigo para gerenciar suas finanças.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-[#001529] px-10 py-5 rounded-lg font-bold hover:bg-white/90 transition-all shadow-2xl text-lg"
          >
            Comece grátis
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
