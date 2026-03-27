import { Link } from "react-router";
import { ArrowLeft, ArrowRight, FileText, Building2, Calculator, ClipboardCheck, AlertCircle, CheckCircle } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";

export function ComoMigrar() {
  const steps = [
    {
      number: "01",
      icon: Calculator,
      title: "Simule os custos",
      desc: "Use nosso simulador gratuito para comparar quanto você paga como MEI e quanto pagaria como ME no Simples Nacional. Muitos empreendedores descobrem que podem pagar menos impostos ao migrar.",
    },
    {
      number: "02",
      icon: FileText,
      title: "Solicite o desenquadramento",
      desc: "Acesse o Portal do Simples Nacional (www8.receita.fazenda.gov.br) e solicite o desenquadramento do SIMEI. Escolha o motivo adequado (faturamento, atividade, etc). O processo é online e gratuito.",
    },
    {
      number: "03",
      icon: Building2,
      title: "Atualize na Junta Comercial",
      desc: "Após o desenquadramento, você precisará registrar as alterações na Junta Comercial do seu estado. Isso inclui atualizar o contrato social e o enquadramento como Microempresa (ME).",
    },
    {
      number: "04",
      icon: ClipboardCheck,
      title: "Escolha o regime tributário",
      desc: "Com a ajuda de um contador, escolha entre Simples Nacional, Lucro Presumido ou Lucro Real. Para a maioria dos pequenos negócios, o Simples Nacional continua sendo a melhor opção.",
    },
    {
      number: "05",
      icon: FileText,
      title: "Atualize alvará e inscrições",
      desc: "Atualize seu alvará de funcionamento na prefeitura, a inscrição estadual (se necessário) e os cadastros nos órgãos competentes da sua atividade.",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header onScrollToSimulator={() => {}} />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[#A1A1A1] hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao início
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Como migrar de <span className="text-[#2DDB81]">MEI para ME</span>
          </h1>
          <p className="text-lg text-[#A1A1A1] mb-12 max-w-2xl">
            Guia completo passo a passo para fazer a transição do Microempreendedor Individual para Microempresa.
          </p>

          {/* Quando migrar */}
          <div className="bg-[#1B1B1B] rounded-2xl border border-white/5 p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Quando é hora de migrar?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {[
                "Faturamento acima de R$ 81.000/ano",
                "Necessidade de mais de 1 funcionário",
                "Atividade não permitida como MEI",
                "Desejo de incluir sócios no negócio",
                "Necessidade de abrir filiais",
                "Crescimento exige maior estrutura fiscal",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#141414] rounded-xl p-4 border border-white/5">
                  <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-[#C8C9D0]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-bold text-white">Passo a passo da migração</h2>
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="bg-[#1B1B1B] rounded-2xl border border-white/5 p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-[#28A263]/20 rounded-2xl flex items-center justify-center">
                        <span className="text-[#2DDB81] font-bold text-lg">{step.number}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-[#C8C9D0] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custos */}
          <div className="bg-[#1B1B1B] rounded-2xl border border-white/5 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Custos da migração</h2>
            <div className="text-[#C8C9D0] space-y-3 leading-relaxed">
              <p>Os custos podem variar conforme o estado e a complexidade do negócio:</p>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {[
                  { item: "Desenquadramento SIMEI", valor: "Gratuito", desc: "Feito online no Portal do Simples" },
                  { item: "Junta Comercial", valor: "R$ 100 a R$ 300", desc: "Varia por estado" },
                  { item: "Contador", valor: "R$ 200 a R$ 800/mês", desc: "Obrigatório para ME" },
                ].map((c) => (
                  <div key={c.item} className="bg-[#141414] rounded-xl p-5 border border-white/5">
                    <p className="text-xs text-[#A1A1A1] mb-1">{c.item}</p>
                    <p className="text-xl font-bold text-[#2DDB81] mb-1">{c.valor}</p>
                    <p className="text-xs text-[#686F6F]">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-[#1B1B1B] rounded-2xl border border-white/5 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Dicas importantes</h2>
            <ul className="space-y-3">
              {[
                "Faça a simulação antes de migrar para garantir que será vantajoso financeiramente",
                "Contrate um contador de confiança — ele será obrigatório como ME",
                "Planeje a transição para o início do ano fiscal, quando possível",
                "Mantenha todas as notas fiscais e comprovantes organizados",
                "O desenquadramento pode ser retroativo se o faturamento já ultrapassou o limite",
                "Você não perde o CNPJ — ele apenas muda de categoria",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-[#C8C9D0]">
                  <CheckCircle className="w-5 h-5 text-[#2DDB81] flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#28A263]/20 to-[#2DDB81]/10 rounded-2xl border border-[#28A263]/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Descubra se vale a pena migrar</h2>
            <p className="text-[#C8C9D0] mb-6">
              Use nosso simulador gratuito e compare os impostos do MEI vs ME em segundos.
            </p>
            <Link to="/app/mei-me">
              <Button size="lg" className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl px-8">
                Simular Agora — Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
