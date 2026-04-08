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
    <div className="min-h-screen bg-white">
      <Header onScrollToSimulator={() => {}} />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-[rgba(0,21,41,0.6)] hover:text-[#001529] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao início
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#001529] mb-4">
              Como migrar de <span className="text-[#28A263]">MEI para ME</span>
            </h1>
            <p className="text-lg text-[rgba(0,21,41,0.6)] max-w-2xl">
              Guia completo passo a passo para fazer a transição do Microempreendedor Individual para Microempresa.
            </p>
          </div>

          {/* Quando migrar */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#001529]">Quando é hora de migrar?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Faturamento acima de R$ 81.000/ano",
                "Necessidade de mais de 1 funcionário",
                "Atividade não permitida como MEI",
                "Desejo de incluir sócios no negócio",
                "Necessidade de abrir filiais",
                "Crescimento exige maior estrutura fiscal",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#F8F9FA] rounded-xl p-4 border border-[rgba(0,0,0,0.05)]">
                  <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <span className="text-[rgba(0,21,41,0.6)]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-bold text-[#001529]">Passo a passo da migração</h2>
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-8 hover:border-[rgba(0,0,0,0.15)] transition-all">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-[#28A263]/20 rounded-2xl flex items-center justify-center">
                        <span className="text-[#28A263] font-bold text-lg">{step.number}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#001529] mb-2">{step.title}</h3>
                      <p className="text-[rgba(0,21,41,0.6)] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custos */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#001529] mb-4">Custos da migração</h2>
            <div className="text-[rgba(0,21,41,0.6)] space-y-3 leading-relaxed">
              <p>Os custos podem variar conforme o estado e a complexidade do negócio:</p>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {[
                  { item: "Desenquadramento SIMEI", valor: "Gratuito", desc: "Feito online no Portal do Simples" },
                  { item: "Junta Comercial", valor: "R$ 100 a R$ 300", desc: "Varia por estado" },
                  { item: "Contador", valor: "R$ 200 a R$ 800/mês", desc: "Obrigatório para ME" },
                ].map((c) => (
                  <div key={c.item} className="bg-[#F8F9FA] rounded-xl p-5 border border-[rgba(0,0,0,0.05)]">
                    <p className="text-xs text-[rgba(0,21,41,0.5)] mb-1">{c.item}</p>
                    <p className="text-xl font-bold text-[#28A263] mb-1">{c.valor}</p>
                    <p className="text-xs text-[rgba(0,21,41,0.5)]">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-8 mb-8">
            <h2 className="text-2xl font-bold text-[#001529] mb-4">Dicas importantes</h2>
            <ul className="space-y-3">
              {[
                "Faça a simulação antes de migrar para garantir que será vantajoso financeiramente",
                "Contrate um contador de confiança — ele será obrigatório como ME",
                "Planeje a transição para o início do ano fiscal, quando possível",
                "Mantenha todas as notas fiscais e comprovantes organizados",
                "O desenquadramento pode ser retroativo se o faturamento já ultrapassou o limite",
                "Você não perde o CNPJ — ele apenas muda de categoria",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-[rgba(0,21,41,0.6)]">
                  <CheckCircle className="w-5 h-5 text-[#28A263] flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-[#28A263]/10 rounded-2xl border border-[#28A263]/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-[#001529] mb-3">Descubra se vale a pena migrar</h2>
            <p className="text-[rgba(0,21,41,0.6)] mb-6">
              Use nosso simulador gratuito e compare os impostos do MEI vs ME em segundos.
            </p>
            <Link to="/app/mei-me">
              <Button size="lg" className="bg-[#28A263] hover:bg-[#1F8C50] text-white rounded-xl px-8">
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
