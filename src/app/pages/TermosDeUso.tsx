import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export function TermosDeUso() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Header */}
      <header className="sticky top-0 bg-[#141414] border-b border-white/5 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#2DDB81] hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-white">Termos de Uso</h1>
          <p className="text-[#A1A1A1] mt-2">Última atualização: 26 de março de 2026</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12 text-[#A1A1A1]">
          {/* 1. Aceitação dos Termos */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
            <p className="mb-4">
              Ao acessar e utilizar a plataforma Meu Fluxo ("Plataforma"), você concorda em estar vinculado por estes Termos de Uso.
              Se você não concorda com qualquer parte destes termos, não deve utilizar a Plataforma.
            </p>
            <p>
              O Meu Fluxo reserva-se o direito de modificar estes Termos de Uso a qualquer momento. Alterações significativas
              serão notificadas por email. O uso continuado da Plataforma após modificações constitui aceitação dos novos termos.
            </p>
          </section>

          {/* 2. Descrição do Serviço */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Descrição do Serviço</h2>
            <p className="mb-4">
              O Meu Fluxo é uma plataforma digital que oferece ferramentas para gestão financeira e planejamento tributário, incluindo:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Simulador de impostos MEI vs ME</li>
              <li>Calculadora de preço ideal de produtos e serviços</li>
              <li>Simulador de lucro e projeções financeiras</li>
              <li>Gestor de fluxo de caixa</li>
              <li>Gerador de propostas comerciais</li>
              <li>Dashboard de análise financeira</li>
            </ul>
          </section>

          {/* 3. Uso Adequado da Plataforma */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Uso Adequado da Plataforma</h2>
            <p className="mb-4">Você concorda em usar a Plataforma apenas para fins legítimos e não irá:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violar qualquer lei ou regulação aplicável</li>
              <li>Usar a Plataforma de forma que prejudique sua operação</li>
              <li>Tentar obter acesso não autorizado a qualquer parte da Plataforma</li>
              <li>Usar a Plataforma para atividades ilegais ou fraudulentas</li>
              <li>Compartilhar sua senha ou credenciais com terceiros</li>
              <li>Coletar dados de forma automatizada sem autorização</li>
              <li>Usar a Plataforma para transmitir malware ou código malicioso</li>
            </ul>
          </section>

          {/* 4. Criação de Conta */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Criação e Responsabilidade da Conta</h2>
            <p className="mb-4">
              Para acessar determinadas funcionalidades, você deve criar uma conta fornecendo informações precisas e atualizadas.
              Você é responsável por:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Manter a confidencialidade de suas credenciais de login</li>
              <li>Todas as atividades realizadas em sua conta</li>
              <li>Notificar imediatamente sobre acesso não autorizado</li>
              <li>Atualizar informações de perfil quando necessário</li>
            </ul>
            <p className="mt-4">
              O Meu Fluxo não é responsável por perdas resultantes do uso não autorizado de sua conta.
            </p>
          </section>

          {/* 5. Isenção de Responsabilidade */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Isenção de Responsabilidade</h2>
            <p className="mb-4">
              <strong className="text-white">AVISO IMPORTANTE:</strong> A Plataforma fornece simulações aproximadas e educacionais com base
              em dados gerais do Simples Nacional, MEI e legislação tributária atual. Os valores gerados são estimativas e
              <strong className="text-white"> podem não refletir sua situação específica.</strong>
            </p>
            <p className="mb-4">
              O Meu Fluxo NÃO fornece consultoria contábil ou fiscal profissional. As informações não devem ser consideradas
              como aconselhamento legal ou tributário. Para decisões financeiras importantes, recomendamos:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Consultar um contador ou contador público registrado</li>
              <li>Buscar orientação de um consultor fiscal certificado</li>
              <li>Verificar informações com a Receita Federal quando necessário</li>
              <li>Validar simulações com dados reais do seu negócio</li>
            </ul>
            <p>
              O Meu Fluxo não se responsabiliza por decisões tomadas com base nas informações da Plataforma ou por
              mudanças na legislação após a utilização das ferramentas.
            </p>
          </section>

          {/* 6. Propriedade Intelectual */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Propriedade Intelectual</h2>
            <p className="mb-4">
              Todo o conteúdo da Plataforma, incluindo textos, gráficos, logos, ícones, imagens e software, é propriedade do
              Meu Fluxo ou de seus licenciadores e está protegido por leis de propriedade intelectual.
            </p>
            <p>
              Você concede ao Meu Fluxo uma licença limitada para usar a Plataforma para seus fins pessoais ou
              comerciais legítimos. Você não pode reproduzir, distribuir, modificar ou transmitir qualquer conteúdo sem
              autorização prévia por escrito.
            </p>
          </section>

          {/* 7. Planos e Assinatura */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Planos e Assinatura</h2>
            <p className="mb-4">
              A Plataforma oferece um plano gratuito com funcionalidades básicas e um plano PRO com recursos avançados:
            </p>
            <div className="bg-[#1B1B1B] border border-white/10 rounded-2xl p-6 mb-4">
              <h3 className="font-bold text-white mb-2">Plano Gratuito:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Simulador MEI → ME ilimitado</li>
                <li>2 propostas comerciais por dia</li>
                <li>Dashboard básico</li>
                <li>30 lançamentos de fluxo de caixa por mês</li>
              </ul>
            </div>
            <div className="bg-[#1B1B1B] border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-2">Plano PRO:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Todas as ferramentas sem restrições</li>
                <li>Propostas comerciais ilimitadas</li>
                <li>Fluxo de caixa ilimitado</li>
                <li>Simulador de preço ideal</li>
                <li>Simulador de lucro avançado</li>
                <li>Exportação em PDF e Excel</li>
              </ul>
            </div>
          </section>

          {/* 8. Cancelamento e Reembolso */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Cancelamento e Reembolso</h2>
            <p className="mb-4">
              Você pode cancelar sua assinatura PRO a qualquer momento através de suas configurações de conta.
              O cancelamento entra em vigor no final do período de cobrança atual.
            </p>
            <p className="mb-4">
              <strong className="text-white">Política de Reembolso:</strong> Não oferecemos reembolsos por pagamentos já processados.
              No entanto, você pode cancelar antes do próximo ciclo de cobrança para evitar cobranças futuras.
            </p>
            <p>
              Para solicitações especiais de reembolso, entre em contato através de suporte@hubempreendedor.com.
            </p>
          </section>

          {/* 9. Limitação de Responsabilidade */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitação de Responsabilidade</h2>
            <p className="mb-4">
              EM NENHUMA CIRCUNSTÂNCIA O HUB DO EMPREENDEDOR SERÁ RESPONSÁVEL POR DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS,
              CONSEQUENTES OU PUNITIVOS, INCLUINDO PERDA DE LUCROS, DADOS OU USO, MESMO QUE INFORMADO DA POSSIBILIDADE DE TAIS DANOS.
            </p>
            <p>
              A responsabilidade total do Meu Fluxo não excederá o valor pago por você nos últimos 12 meses.
            </p>
          </section>

          {/* 10. Privacidade e Dados */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Privacidade e Proteção de Dados</h2>
            <p className="mb-4">
              Sua privacidade é importante para nós. Consulte nossa Política de Privacidade para entender como coletamos,
              usamos e protegemos seus dados pessoais.
            </p>
            <p>
              A Plataforma criptografa dados sensíveis em trânsito e em repouso. No entanto, nenhum sistema é 100% seguro.
              Use a Plataforma por sua conta e risco.
            </p>
          </section>

          {/* 11. Links Externos */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Links Externos</h2>
            <p>
              A Plataforma pode conter links para sites de terceiros. O Meu Fluxo não é responsável pelo conteúdo,
              precisão ou práticas de privacidade desses sites. Sua utilização deles está sujeita aos respectivos termos de uso.
            </p>
          </section>

          {/* 12. Suspensão e Encerramento */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Suspensão e Encerramento</h2>
            <p className="mb-4">
              O Meu Fluxo reserva-se o direito de suspender ou encerrar sua conta se:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Você violar estes Termos de Uso</li>
              <li>Você usar a Plataforma de forma abusiva ou prejudicial</li>
              <li>Sua conta estiver inativa por 24 meses consecutivos</li>
              <li>Você não pagar as taxas de assinatura conforme devido</li>
            </ul>
            <p>
              Você pode encerrar sua conta a qualquer momento. Os dados podem ser deletados após 30 dias do encerramento.
            </p>
          </section>

          {/* 13. Conformidade Legal */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Conformidade Legal</h2>
            <p className="mb-4">
              A Plataforma é operada em conformidade com as leis brasileiras, incluindo:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Lei Geral de Proteção de Dados (LGPD)</li>
              <li>Código de Defesa do Consumidor</li>
              <li>Lei de Prevenção à Lavagem de Dinheiro (Lei 9.613/98)</li>
              <li>Regulamentações da Receita Federal do Brasil</li>
            </ul>
          </section>

          {/* 14. Contato */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Contato</h2>
            <p className="mb-4">
              Para dúvidas sobre estes Termos de Uso, entre em contato:
            </p>
            <div className="bg-[#1B1B1B] border border-white/10 rounded-2xl p-6">
              <p className="mb-2">
                <strong className="text-white">Email:</strong>{" "}
                <a href="mailto:suporte@hubempreendedor.com" className="text-[#2DDB81] hover:text-white transition-colors">
                  suporte@hubempreendedor.com
                </a>
              </p>
              <p>
                <strong className="text-white">Horário de atendimento:</strong> Segunda a sexta, 9h às 18h (horário de Brasília)
              </p>
            </div>
          </section>

          {/* Footer */}
          <section className="border-t border-white/10 pt-8">
            <p className="text-sm text-[#686F6F]">
              © 2026 Meu Fluxo. Todos os direitos reservados.
              Estes Termos de Uso foram atualizados pela última vez em 26 de março de 2026.
            </p>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-12 flex justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="bg-[#28A263] hover:bg-[#2DDB81] text-white rounded-xl px-8"
          >
            Voltar à Página Anterior
          </Button>
        </div>
      </main>
    </div>
  );
}
