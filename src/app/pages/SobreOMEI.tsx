import { Link } from "react-router";
import { ArrowLeft, Building2, FileText, TrendingUp, AlertTriangle, CheckCircle, DollarSign } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function SobreOMEI() {
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
              O que é o <span className="text-[#28A263]">MEI</span>?
            </h1>
            <p className="text-lg text-[rgba(0,21,41,0.6)] max-w-2xl">
              Tudo o que você precisa saber sobre o Microempreendedor Individual e como ele pode beneficiar o seu negócio.
            </p>
          </div>

          <div className="space-y-8">
            {/* O que é */}
            <section className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-8 hover:border-[rgba(0,0,0,0.15)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#28A263]/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#28A263]" />
                </div>
                <h2 className="text-2xl font-bold text-[#001529]">O que é o MEI?</h2>
              </div>
              <div className="text-[rgba(0,21,41,0.6)] space-y-4 leading-relaxed">
                <p>
                  O <strong className="text-[#001529]">Microempreendedor Individual (MEI)</strong> é um regime simplificado criado pelo governo brasileiro em 2008 para formalizar trabalhadores autônomos e pequenos empreendedores.
                </p>
                <p>
                  Com o MEI, o empreendedor obtém um CNPJ, pode emitir notas fiscais, tem acesso a benefícios previdenciários (aposentadoria, auxílio-doença, salário-maternidade) e paga impostos reduzidos através de uma guia mensal fixa chamada DAS.
                </p>
                <p>
                  O MEI foi criado pela Lei Complementar nº 128/2008 e é regulamentado pelo Comitê Gestor do Simples Nacional.
                </p>
              </div>
            </section>

            {/* Requisitos */}
            <section className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-8 hover:border-[rgba(0,0,0,0.15)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#28A263]/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#28A263]" />
                </div>
                <h2 className="text-2xl font-bold text-[#001529]">Quem pode ser MEI?</h2>
              </div>
              <div className="text-[rgba(0,21,41,0.6)] space-y-3 leading-relaxed">
                <p>Para se enquadrar como MEI, você precisa atender aos seguintes requisitos:</p>
                <ul className="space-y-3">
                  {[
                    "Faturamento anual de até R$ 81.000,00 (ou proporcional se aberto no meio do ano)",
                    "Não ser sócio, administrador ou titular de outra empresa",
                    "Ter no máximo 1 funcionário contratado (que receba salário mínimo ou piso da categoria)",
                    "Exercer uma das atividades permitidas conforme a tabela CNAE do MEI",
                    "Não ter ou abrir filial"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#28A263] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Quanto custa */}
            <section className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-8 hover:border-[rgba(0,0,0,0.15)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#28A263]/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#28A263]" />
                </div>
                <h2 className="text-2xl font-bold text-[#001529]">Quanto custa ser MEI?</h2>
              </div>
              <div className="text-[rgba(0,21,41,0.6)] space-y-4 leading-relaxed">
                <p>O MEI paga uma contribuição mensal fixa através do DAS (Documento de Arrecadação do Simples Nacional):</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { tipo: "Comércio e Indústria", valor: "R$ 71,60", desc: "INSS + ICMS" },
                    { tipo: "Serviços", valor: "R$ 75,60", desc: "INSS + ISS" },
                    { tipo: "Comércio e Serviços", valor: "R$ 76,60", desc: "INSS + ICMS + ISS" },
                  ].map((item) => (
                    <div key={item.tipo} className="bg-[#F8F9FA] rounded-xl p-5 border border-[rgba(0,0,0,0.05)] text-center">
                      <p className="text-xs text-[rgba(0,21,41,0.5)] mb-2">{item.tipo}</p>
                      <p className="text-2xl font-bold text-[#28A263]">{item.valor}</p>
                      <p className="text-xs text-[rgba(0,21,41,0.5)] mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[rgba(0,21,41,0.5)]">
                  * Valores referentes a 2024. Esses valores são reajustados anualmente com base no salário mínimo.
                </p>
              </div>
            </section>

            {/* Vantagens */}
            <section className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-8 hover:border-[rgba(0,0,0,0.15)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#28A263]/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#28A263]" />
                </div>
                <h2 className="text-2xl font-bold text-[#001529]">Vantagens do MEI</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "CNPJ gratuito", desc: "Abertura e manutenção sem custos de contador obrigatório" },
                  { title: "Impostos simplificados", desc: "Valor fixo mensal independente do faturamento" },
                  { title: "Emissão de nota fiscal", desc: "Pode emitir NF-e para vender para empresas e governo" },
                  { title: "Benefícios do INSS", desc: "Aposentadoria, auxílio-doença, salário-maternidade" },
                  { title: "Acesso a crédito", desc: "Linhas de crédito especiais com juros menores" },
                  { title: "Simplicidade", desc: "Declaração anual simples (DASN-SIMEI) sem contador" },
                ].map((item) => (
                  <div key={item.title} className="bg-[#F8F9FA] rounded-xl p-5 border border-[rgba(0,0,0,0.05)] hover:border-[rgba(0,0,0,0.1)] transition-all">
                    <h3 className="text-[#001529] font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-[rgba(0,21,41,0.6)]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Quando sair */}
            <section className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] p-8 hover:border-[rgba(0,0,0,0.15)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#001529]">Quando sair do MEI?</h2>
              </div>
              <div className="text-[rgba(0,21,41,0.6)] space-y-4 leading-relaxed">
                <p>Você precisa considerar a migração do MEI para ME (Microempresa) quando:</p>
                <ul className="space-y-3">
                  {[
                    "Seu faturamento ultrapassar R$ 81.000/ano (ou R$ 6.750/mês em média)",
                    "Precisar contratar mais de 1 funcionário",
                    "Quiser incluir sócios na empresa",
                    "Sua atividade não for mais permitida como MEI",
                    "Precisar abrir filiais",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-[#28A263]/20 border border-[#28A263]/30 rounded-xl p-5 mt-4">
                  <p className="text-[#28A263] font-medium">
                    Use nosso <Link to="/app/mei-me" className="underline font-bold">Simulador MEI → ME</Link> para descobrir se vale a pena migrar e quanto você pode economizar!
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
