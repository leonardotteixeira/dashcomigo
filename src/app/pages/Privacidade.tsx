import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export function Privacidade() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-[rgba(0,0,0,0.1)] z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#28A263] hover:text-[#1f7a4a] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-[#001529]">Política de Privacidade</h1>
          <p className="text-[rgba(0,21,41,0.6)] mt-2">Última atualização: 26 de março de 2026</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12 text-[rgba(0,21,41,0.6)]">
          {/* Introdução */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">Introdução</h2>
            <p className="mb-4">
              A privacidade e segurança de seus dados são prioridades máximas para o Meu Fluxo ("nós", "nosso" ou "Plataforma").
              Esta Política de Privacidade descreve como coletamos, usamos, protegemos e compartilhamos suas informações pessoais.
            </p>
            <p>
              Recomendamos que você leia esta política cuidadosamente. Se tiver dúvidas, entre em contato conosco através de
              contato@bubuya.com.br.
            </p>
          </section>

          {/* 1. Informações que Coletamos */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">1. Informações que Coletamos</h2>

            <h3 className="text-lg font-semibold text-[#001529] mt-6 mb-3">1.1 Informações Fornecidas Diretamente</h3>
            <p className="mb-4">Quando você cria uma conta ou usa a Plataforma, podemos coletar:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Nome completo e informações de contato (email, telefone)</li>
              <li>Dados de empresa (razão social, CNPJ/CPF, endereço)</li>
              <li>Informações financeiras para simulações (faturamento, despesas, custos)</li>
              <li>Histórico de transações e fluxo de caixa</li>
              <li>Preferências de conta e configurações</li>
              <li>Documentos enviados (propostas, arquivos)</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#001529] mt-6 mb-3">1.2 Informações Coletadas Automaticamente</h3>
            <p className="mb-4">Quando você acessa a Plataforma, podemos coletar automaticamente:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Endereço de IP e tipo de navegador</li>
              <li>Páginas visitadas e tempo gasto</li>
              <li>Informações de dispositivo (tipo, sistema operacional, versão)</li>
              <li>Cookies e tecnologias de rastreamento similares</li>
              <li>Dados de localização aproximada (país/região)</li>
              <li>Atividade de cliques e interações</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#001529] mt-6 mb-3">1.3 Informações de Terceiros</h3>
            <p>
              Podemos receber informações sobre você de terceiros, como:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provedores de autenticação (Google, redes sociais)</li>
              <li>Processadores de pagamento (Stripe, PagSeguro)</li>
              <li>Plataformas de análise</li>
            </ul>
          </section>

          {/* 2. Como Usamos Suas Informações */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">2. Como Usamos Suas Informações</h2>
            <p className="mb-4">Usamos as informações coletadas para:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong className="text-[#001529]">Prestar serviços:</strong> Processar simulações, gerar relatórios e propostas</li>
              <li><strong className="text-[#001529]">Autenticação:</strong> Verificar identidade e manter conta segura</li>
              <li><strong className="text-[#001529]">Comunicação:</strong> Enviar notificações sobre sua conta ou atualizações de serviço</li>
              <li><strong className="text-[#001529]">Análise:</strong> Entender como você usa a Plataforma para melhorias</li>
              <li><strong className="text-[#001529]">Conformidade legal:</strong> Cumprir obrigações legais e regulatórias</li>
              <li><strong className="text-[#001529]">Marketing:</strong> Enviar promoções (apenas com seu consentimento)</li>
              <li><strong className="text-[#001529]">Segurança:</strong> Detectar e prevenir fraudes ou atividades ilícitas</li>
              <li><strong className="text-[#001529]">Pesquisa:</strong> Melhorar nossos produtos e serviços</li>
            </ul>
          </section>

          {/* 3. Base Legal para Processamento */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">3. Base Legal para Processamento (LGPD)</h2>
            <p className="mb-4">
              Conforme a Lei Geral de Proteção de Dados (LGPD), processamos seus dados com base em:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong className="text-[#001529]">Consentimento:</strong> Quando você concorda explicitamente</li>
              <li><strong className="text-[#001529]">Contrato:</strong> Quando necessário para fornecer serviços</li>
              <li><strong className="text-[#001529]">Obrigação legal:</strong> Quando requerido por lei (impostos, conformidade regulatória)</li>
              <li><strong className="text-[#001529]">Interesse legítimo:</strong> Para melhorar segurança e serviços</li>
              <li><strong className="text-[#001529]">Proteção de direitos:</strong> Para defender nossos direitos legais</li>
            </ul>
          </section>

          {/* 4. Compartilhamento de Dados */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">4. Compartilhamento de Dados</h2>
            <p className="mb-4">
              Não vendemos suas informações pessoais. Podemos compartilhar dados com:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong className="text-[#001529]">Prestadores de serviços:</strong> Empresas que nos ajudam a operar (hospedagem, email, pagamentos)</li>
              <li><strong className="text-[#001529]">Parceiros de negócios:</strong> Com seu consentimento explícito</li>
              <li><strong className="text-[#001529]">Requisições legais:</strong> Autoridades quando exigido por lei</li>
              <li><strong className="text-[#001529]">Fusões/Aquisições:</strong> Se nossa empresa for adquirida</li>
              <li><strong className="text-[#001529]">Consentimento:</strong> Quando você autoriza especificamente</li>
            </ul>
            <p className="mt-4">
              Todos os parceiros são obrigados por contrato a manter seus dados confidenciais e seguros.
            </p>
          </section>

          {/* 5. Segurança de Dados */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">5. Segurança de Dados</h2>
            <p className="mb-4">
              Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado,
              alteração ou destruição:
            </p>
            <div className="bg-[#F8F9FA] border border-[rgba(0,0,0,0.1)] rounded-2xl p-6 space-y-3">
              <div>
                <h4 className="font-semibold text-[#001529] mb-1">🔐 Criptografia</h4>
                <p className="text-sm text-[rgba(0,21,41,0.6)]">SSL/TLS para dados em trânsito; criptografia AES-256 para dados em repouso</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#001529] mb-1">🔑 Autenticação</h4>
                <p className="text-sm text-[rgba(0,21,41,0.6)]">Senhas hash com bcrypt; autenticação de dois fatores disponível</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#001529] mb-1">🛡️ Firewall</h4>
                <p className="text-sm text-[rgba(0,21,41,0.6)]">Proteção contra acessos não autorizados; monitoramento 24/7</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#001529] mb-1">📋 Compliance</h4>
                <p className="text-sm text-[rgba(0,21,41,0.6)]">Conformidade com LGPD, PCI DSS e melhores práticas de segurança</p>
              </div>
            </div>
            <p className="mt-4">
              <strong className="text-[#001529]">Nota importante:</strong> Nenhum sistema é 100% seguro. Você usa a Plataforma por sua conta e risco.
            </p>
          </section>

          {/* 6. Retenção de Dados */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">6. Retenção de Dados</h2>
            <p className="mb-4">
              Mantemos seus dados pelo tempo necessário para fornecer os serviços e cumprir obrigações legais:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong className="text-[#001529]">Dados de conta:</strong> Enquanto sua conta estiver ativa, mais 30 dias após cancelamento</li>
              <li><strong className="text-[#001529]">Dados financeiros:</strong> Retidos conforme requerido por lei (geralmente 5 anos)</li>
              <li><strong className="text-[#001529]">Logs de transação:</strong> Mínimo 1 ano para fins de segurança e auditoria</li>
              <li><strong className="text-[#001529]">Cookies:</strong> Deletados após expiração ou limpeza de navegador</li>
              <li><strong className="text-[#001529]">Backup:</strong> Mantido por até 90 dias após exclusão</li>
            </ul>
          </section>

          {/* 7. Cookies e Rastreamento */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">7. Cookies e Tecnologias de Rastreamento</h2>
            <p className="mb-4">
              Usamos cookies para melhorar sua experiência:
            </p>
            <div className="bg-[#F9FAFB] border border-[#E8EBF1] rounded-2xl p-6 space-y-3">
              <div>
                <h4 className="font-semibold text-[#001529] mb-1">Cookies Essenciais</h4>
                <p className="text-sm">Necessários para funcionamento (autenticação, segurança). Não podem ser desativados.</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#001529] mb-1">Cookies de Análise</h4>
                <p className="text-sm">Coletam dados sobre como você usa a Plataforma. Você pode desativar a qualquer momento.</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#001529] mb-1">Cookies de Marketing</h4>
                <p className="text-sm">Usados apenas com seu consentimento explícito para publicidade direcionada.</p>
              </div>
            </div>
            <p className="mt-4">
              Você pode gerenciar cookies através das configurações do seu navegador.
            </p>
          </section>

          {/* 8. Seus Direitos */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">8. Seus Direitos (LGPD)</h2>
            <p className="mb-4">
              Sob a LGPD, você tem direito a:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong className="text-[#001529]">Acesso:</strong> Saber quais dados possuímos sobre você</li>
              <li><strong className="text-[#001529]">Correção:</strong> Corrigir informações incorretas ou incompletas</li>
              <li><strong className="text-[#001529]">Exclusão:</strong> Solicitar exclusão de dados ("direito ao esquecimento")</li>
              <li><strong className="text-[#001529]">Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong className="text-[#001529]">Revogação:</strong> Retirar consentimento para certos processamentos</li>
              <li><strong className="text-[#001529]">Oposição:</strong> Opor-se ao processamento de seus dados</li>
              <li><strong className="text-[#001529]">Esclarecimento:</strong> Receber mais informações sobre como usamos seus dados</li>
            </ul>
            <p className="mt-4">
              Para exercer qualquer desses direitos, entre em contato em contato@bubuya.com.br com o assunto
              "Solicitação LGPD" e seu CPF/CNPJ.
            </p>
          </section>

          {/* 9. Dados de Menores */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">9. Proteção de Menores</h2>
            <p>
              A Plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente dados de menores.
              Se descobrirmos que coletamos dados de um menor, os deletaremos imediatamente. Pais ou responsáveis
              que acreditam que um menor forneceu dados devem contatar contato@bubuya.com.br.
            </p>
          </section>

          {/* 10. Transferência de Dados */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">10. Transferência Internacional de Dados</h2>
            <p className="mb-4">
              Seus dados podem ser processados em servidores localizados em diferentes países, incluindo:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Brasil (servidor principal)</li>
              <li>Provedores de nuvem internacionais (AWS, Google Cloud)</li>
            </ul>
            <p>
              Garantimos que transferências internacionais atendem aos padrões de proteção de dados da LGPD.
            </p>
          </section>

          {/* 11. Links Externos */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">11. Links Externos</h2>
            <p>
              A Plataforma pode conter links para sites de terceiros. Não somos responsáveis pelas práticas de
              privacidade desses sites. Recomendamos que você leia suas políticas de privacidade antes de
              compartilhar informações pessoais.
            </p>
          </section>

          {/* 12. Alterações nesta Política */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">12. Alterações nesta Política</h2>
            <p className="mb-4">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças
              significativas por email ou através da Plataforma.
            </p>
            <p>
              O uso continuado da Plataforma após notificação de mudanças constitui sua aceitação da política revisada.
            </p>
          </section>

          {/* 13. Encarregado de Proteção de Dados */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">13. Encarregado de Proteção de Dados (DPO)</h2>
            <p className="mb-4">
              Designamos um Encarregado de Proteção de Dados responsável por supervisionar nossa conformidade com a LGPD.
            </p>
            <div className="bg-[#F9FAFB] border border-[#E8EBF1] rounded-2xl p-6">
              <p className="mb-2">
                <strong className="text-[#001529]">Email:</strong>{" "}
                <a href="mailto:contato@bubuya.com.br" className="text-[#2DDB81] hover:text-[#001529] transition-colors">
                  contato@bubuya.com.br
                </a>
              </p>
              <p>
                <strong className="text-[#001529]">Assunto:</strong> Prefira sempre incluir "Proteção de Dados" no assunto do email
              </p>
            </div>
          </section>

          {/* 14. Contato */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">14. Entre em Contato</h2>
            <p className="mb-4">
              Se tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados:
            </p>
            <div className="bg-[#F9FAFB] border border-[#E8EBF1] rounded-2xl p-6 space-y-3">
              <p>
                <strong className="text-[#001529]">Email de Suporte:</strong>{" "}
                <a href="mailto:contato@bubuya.com.br" className="text-[#2DDB81] hover:text-[#001529] transition-colors">
                  contato@bubuya.com.br
                </a>
              </p>
              <p>
                <strong className="text-[#001529]">Email do DPO:</strong>{" "}
                <a href="mailto:contato@bubuya.com.br" className="text-[#2DDB81] hover:text-[#001529] transition-colors">
                  contato@bubuya.com.br
                </a>
              </p>
              <p>
                <strong className="text-[#001529]">Horário de atendimento:</strong> Segunda a sexta, 9h às 18h (horário de Brasília)
              </p>
            </div>
          </section>

          {/* 15. Órgão Regulador */}
          <section>
            <h2 className="text-2xl font-bold text-[#001529] mb-4">15. Apresentação de Reclamação</h2>
            <p className="mb-4">
              Se você acredita que seus direitos de proteção de dados foram violados, você tem o direito de
              apresentar uma reclamação junto à Autoridade Nacional de Proteção de Dados (ANPD):
            </p>
            <div className="bg-[#F9FAFB] border border-[#E8EBF1] rounded-2xl p-6">
              <p className="mb-2">
                <strong className="text-[#001529]">Autoridade Nacional de Proteção de Dados (ANPD)</strong>
              </p>
              <p className="text-sm">
                Site: <a href="https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd" className="text-[#2DDB81] hover:text-[#001529] transition-colors">
                  www.gov.br/cidadania
                </a>
              </p>
            </div>
          </section>

          {/* Footer */}
          <section className="border-t border-[#E8EBF1] pt-8">
            <p className="text-sm text-[#686F6F]">
              © 2026 Meu Fluxo. Todos os direitos reservados.
              Esta Política de Privacidade foi atualizada pela última vez em 26 de março de 2026.
            </p>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-12 flex justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="bg-[#28A263] hover:bg-[#2DDB81] text-[#001529] rounded-xl px-8"
          >
            Voltar à Página Anterior
          </Button>
        </div>
      </main>
    </div>
  );
}
