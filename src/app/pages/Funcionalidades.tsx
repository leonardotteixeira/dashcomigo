import { motion } from "motion/react";
import { TrendingUp, PieChart, Clock, DollarSign, FileText, BarChart3, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router";

export function Funcionalidades() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003a6d] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl text-[#001529]">FinMEI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[#001529]/70 hover:text-[#001529] transition-colors font-semibold">
              Home
            </Link>
            <a href="/#beneficios" className="text-[#001529]/70 hover:text-[#001529] transition-colors font-semibold">
              Benefícios
            </a>
            <a href="/#planos" className="text-[#001529]/70 hover:text-[#001529] transition-colors font-semibold">
              Planos
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[#001529] font-semibold hover:text-[#003a6d] transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/login"
              className="bg-[#003a6d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002a50] transition-all"
            >
              Abrir conta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#001529] via-[#002140] to-[#003a6d]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-extrabold text-white mb-6 leading-tight" style={{ fontSize: "4.5rem" }}>
              Ferramentas completas<br />para sua gestão
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
              Todas as funcionalidades que você precisa para controlar receitas, despesas e crescer seu negócio com inteligência
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 px-6 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Feature 1 - Fluxo de Caixa */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-10 shadow-lg border border-transparent hover:border-[#003a6d]/20 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#003a6d]/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-[#003a6d]" />
              </div>
              <h3 className="font-extrabold text-[#001529] mb-4 text-3xl">Fluxo de Caixa</h3>
              <p className="text-[#001529]/60 text-lg leading-relaxed mb-6">
                Visualize entradas e saídas em tempo real. Filtre por período, categoria ou tipo de transação. Nunca perca o controle do que entra e sai.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Lançamentos categorizados automaticamente</span>
                </li>
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Filtros avançados por data, cliente e tipo</span>
                </li>
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Visão consolidada de entradas e saídas</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 2 - Relatórios */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl p-10 shadow-lg border border-transparent hover:border-[#003a6d]/20 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#003a6d]/10 flex items-center justify-center mb-6">
                <PieChart className="w-8 h-8 text-[#003a6d]" />
              </div>
              <h3 className="font-extrabold text-[#001529] mb-4 text-3xl">Relatórios Visuais</h3>
              <p className="text-[#001529]/60 text-lg leading-relaxed mb-6">
                Transforme números em insights com gráficos interativos. Compare períodos, identifique padrões e tome decisões baseadas em dados.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Gráficos de receitas e despesas por categoria</span>
                </li>
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Análise temporal com comparativos mensais</span>
                </li>
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Exportação em PDF e Excel</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 3 - Contas a Pagar/Receber */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-10 shadow-lg border border-transparent hover:border-[#003a6d]/20 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#003a6d]/10 flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-[#003a6d]" />
              </div>
              <h3 className="font-extrabold text-[#001529] mb-4 text-3xl">Contas a Pagar e Receber</h3>
              <p className="text-[#001529]/60 text-lg leading-relaxed mb-6">
                Organize compromissos futuros e nunca perca um vencimento. Acompanhe o que você deve e o que te devem em uma timeline clara.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Timeline visual de vencimentos</span>
                </li>
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Alertas automáticos antes do vencimento</span>
                </li>
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Registro de pagamentos parciais</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 4 - Orçamentos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl p-10 shadow-lg border border-transparent hover:border-[#003a6d]/20 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#003a6d]/10 flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-[#003a6d]" />
              </div>
              <h3 className="font-extrabold text-[#001529] mb-4 text-3xl">Orçamentos</h3>
              <p className="text-[#001529]/60 text-lg leading-relaxed mb-6">
                Crie orçamentos profissionais para seus clientes em minutos. Acompanhe aprovações e converta em receitas automaticamente.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Templates personalizáveis</span>
                </li>
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Envio por email com um clique</span>
                </li>
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Conversão automática em receita</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 5 - Gestão de Clientes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-10 shadow-lg border border-transparent hover:border-[#003a6d]/20 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#003a6d]/10 flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-[#003a6d]" />
              </div>
              <h3 className="font-extrabold text-[#001529] mb-4 text-3xl">Gestão de Clientes</h3>
              <p className="text-[#001529]/60 text-lg leading-relaxed mb-6">
                Centralize informações de clientes e fornecedores. Histórico completo de transações, documentos e contatos organizados.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Cadastro completo com documentos</span>
                </li>
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Histórico de transações por cliente</span>
                </li>
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Separação entre PF e PJ</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 6 - Simuladores */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl p-10 shadow-lg border border-transparent hover:border-[#003a6d]/20 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#003a6d]/10 flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-[#003a6d]" />
              </div>
              <h3 className="font-extrabold text-[#001529] mb-4 text-3xl">Simuladores Financeiros</h3>
              <p className="text-[#001529]/60 text-lg leading-relaxed mb-6">
                Planeje o futuro com simulações de crescimento, investimentos e cenários. Visualize o impacto de suas decisões.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Simulação de crescimento de receita</span>
                </li>
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Cálculo de viabilidade de investimentos</span>
                </li>
                <li className="flex items-start gap-3 text-[#001529]">
                  <div className="w-2 h-2 rounded-full bg-[#003a6d] mt-2" />
                  <span>Projeções de fluxo de caixa futuro</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-extrabold text-[#001529] mb-4 text-5xl">
              Tudo conectado
            </h2>
            <p className="text-xl text-[#001529]/60 max-w-2xl mx-auto">
              Todas as ferramentas trabalham juntas para dar uma visão completa do seu negócio
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-12 border border-[#E5E7EB] shadow-lg"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#003a6d]/10 flex items-center justify-center mx-auto mb-4">
                  <LinkIcon className="w-10 h-10 text-[#003a6d]" />
                </div>
                <h3 className="font-bold text-[#001529] mb-2 text-xl">Dados Sincronizados</h3>
                <p className="text-[#001529]/60">
                  Alterações em qualquer módulo atualizam automaticamente todos os relatórios e dashboards
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#003a6d]/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-10 h-10 text-[#003a6d]" />
                </div>
                <h3 className="font-bold text-[#001529] mb-2 text-xl">Visão Unificada</h3>
                <p className="text-[#001529]/60">
                  Dashboard central consolida informações de todas as áreas em um só lugar
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#003a6d]/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-[#003a6d]" />
                </div>
                <h3 className="font-bold text-[#001529] mb-2 text-xl">Relatórios Integrados</h3>
                <p className="text-[#001529]/60">
                  Gere relatórios que combinam dados de múltiplas fontes com um clique
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#001529] to-[#003a6d]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-extrabold text-white mb-6 text-5xl">
            Experimente todas as ferramentas
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed font-light">
            Sem compromisso, sem cartão de crédito. Comece grátis hoje.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-3 bg-white text-[#001529] px-10 py-5 rounded-lg font-bold hover:bg-white/90 transition-all shadow-2xl text-lg"
          >
            Começar agora
            <TrendingUp className="w-6 h-6" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001529] border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">FinMEI</span>
              </div>
              <p className="text-sm text-white/60">
                Gestão financeira inteligente para microempreendedores individuais.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><a href="/#beneficios" className="hover:text-white transition-colors">Benefícios</a></li>
                <li><a href="/#planos" className="hover:text-white transition-colors">Planos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/60">
            <p>&copy; 2026 FinMEI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
