import { Link } from "react-router";
import { LandingNav } from "../components/LandingNav";
import { LandingFooter } from "../components/LandingFooter";

export function Sobre() {
  return (
    <div className="min-h-screen" style={{ background: "#F4EFE6" }}>
      <LandingNav />

      {/* Hero */}
      <section className="pt-32 pb-20" style={{ background: "#0E3B2E" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-extrabold text-5xl mb-6" style={{ color: "#F4EFE6" }}>Sobre o DashComigo</h1>
          <p className="text-xl leading-relaxed font-light" style={{ color: "rgba(244,239,230,0.8)" }}>
            Ajudamos MEIs a crescer com inteligência financeira e controle total
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20" style={{ background: "#EBE4D6" }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bold text-3xl mb-6" style={{ color: "#0E3B2E" }}>Nossa história</h2>
          <p className="text-lg leading-relaxed mb-4" style={{ color: "rgba(14,59,46,0.7)" }}>
            Nascemos da necessidade real de empreendedores que lutavam para organizar suas finanças. Vimos de perto os desafios que os microempreendedores individuais enfrentam todos os dias — controle de caixa, prazos do DAS-MEI, fluxo de receitas e despesas — tudo gerenciado em planilhas complicadas ou cadernos.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "rgba(14,59,46,0.7)" }}>
            Decidimos criar uma solução simples, intuitiva e poderosa, pensada especialmente para quem empreende no Brasil. Hoje, o DashComigo ajuda milhares de MEIs a tomarem decisões financeiras mais inteligentes, com dados claros e ferramentas acessíveis.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20" style={{ background: "#F4EFE6" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-bold text-3xl mb-4" style={{ color: "#0E3B2E" }}>Nossa missão</h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "rgba(14,59,46,0.6)" }}>
            Democratizar a inteligência financeira para que todo microempreendedor brasileiro possa crescer com segurança e confiança.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ background: "#EBE4D6" }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-bold text-3xl mb-12 text-center" style={{ color: "#0E3B2E" }}>Nossos valores</h2>
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
              <div key={value.title} className="rounded-2xl p-6 shadow-sm" style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.1)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(14,59,46,0.1)" }}>
                  <div className="w-5 h-5 rounded-full" style={{ background: "#0E3B2E" }} />
                </div>
                <h3 className="font-bold text-xl mb-3" style={{ color: "#0E3B2E" }}>{value.title}</h3>
                <p className="leading-relaxed" style={{ color: "rgba(14,59,46,0.6)" }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20" style={{ background: "#F4EFE6" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-bold text-3xl mb-4" style={{ color: "#0E3B2E" }}>Nossa equipe</h2>
          <p className="text-lg mb-10" style={{ color: "rgba(14,59,46,0.6)" }}>
            Uma equipe apaixonada por tecnologia e empreendedorismo, reunida com o propósito de transformar a gestão financeira dos MEIs brasileiros.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {["Produto", "Engenharia", "Atendimento"].map((area) => (
              <div key={area} className="rounded-2xl p-8 shadow-sm" style={{ background: "#EBE4D6", border: "1px solid rgba(20,18,15,0.1)" }}>
                <div className="w-16 h-16 rounded-full mx-auto mb-4" style={{ background: "rgba(14,59,46,0.1)" }} />
                <p className="font-semibold" style={{ color: "#0E3B2E" }}>{area}</p>
                <p className="text-sm mt-1" style={{ color: "rgba(14,59,46,0.6)" }}>Time dedicado</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "#0E3B2E" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-extrabold text-4xl mb-6" style={{ color: "#F4EFE6" }}>Faça parte dessa história</h2>
          <p className="text-xl mb-10 font-light" style={{ color: "rgba(244,239,230,0.8)" }}>
            Junte-se a milhares de MEIs que já confiam no DashComigo para gerenciar suas finanças.
          </p>
          <Link
            to="/signup"
            className="inline-block px-10 py-5 rounded-lg font-bold shadow-2xl text-lg"
            style={{ background: "#7FD19F", color: "#0E3B2E" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#6bc48e")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#7FD19F")}
          >
            Comece grátis
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
