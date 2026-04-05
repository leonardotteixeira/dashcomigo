import { pb } from "../../lib/pocketbase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface User {
  id: string;
  email: string;
  name: string;
  receive_payment_reminders: boolean;
}

interface Proposal {
  id: string;
  nome_servico: string;
  valor: number;
  nome_cliente: string;
  email_cliente?: string;
  status: string;
  validade: string;
}

interface Payable {
  id: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  status: string;
  categoria: string;
}

// Template: Proposta vencida
function getProposalEmailTemplate(proposal: Proposal, user: User) {
  return {
    to: proposal.email_cliente || user.email,
    subject: `⚠️ Proposta Vencida: ${proposal.nome_servico}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Olá,</h2>

        <p style="color: #666; font-size: 16px;">
          Sua proposta para <strong>${proposal.nome_servico}</strong> está <strong style="color: #d32f2f;">vencida</strong>.
        </p>

        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Serviço:</strong> ${proposal.nome_servico}</p>
          <p style="margin: 5px 0;"><strong>Valor:</strong> R$ ${proposal.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          <p style="margin: 5px 0;"><strong>Cliente:</strong> ${proposal.nome_cliente}</p>
        </div>

        <p style="color: #666; font-size: 16px;">
          Poderia confirmar se o pagamento foi realizado?
        </p>

        <p style="color: #999; font-size: 14px; margin-top: 30px;">
          Obrigado,<br>
          <strong>${user.name}</strong>
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Este é um lembrete automático do Meu Fluxo
          </p>
          <p style="color: #999; font-size: 12px; margin: 8px 0 0 0;">
            Dúvidas? Entre em contato: <a href="mailto:contato@bubuya.com.br" style="color: #28A263; text-decoration: none;">contato@bubuya.com.br</a>
          </p>
        </div>
      </div>
    `,
  };
}

// Template: Conta vencendo
function getPayableEmailTemplate(payable: Payable, user: User) {
  const vencimento = new Date(payable.data_vencimento);
  const hoje = new Date();
  const diasRestantes = Math.ceil(
    (vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    to: user.email,
    subject: `📌 Conta a Pagar: ${payable.descricao}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Olá ${user.name},</h2>

        <p style="color: #666; font-size: 16px;">
          Você tem uma conta a pagar <strong style="color: #ff9800;">vencendo em ${diasRestantes} dia(s)</strong>.
        </p>

        <div style="background: #fff3cd; border-left: 4px solid #ff9800; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Descrição:</strong> ${payable.descricao}</p>
          <p style="margin: 5px 0;"><strong>Categoria:</strong> ${payable.categoria}</p>
          <p style="margin: 5px 0;"><strong>Valor:</strong> R$ ${payable.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          <p style="margin: 5px 0;"><strong>Vencimento:</strong> ${vencimento.toLocaleDateString("pt-BR")}</p>
        </div>

        <p style="color: #666; font-size: 16px;">
          Acesse sua conta para registrar o pagamento quando realizado.
        </p>

        <p style="color: #999; font-size: 14px; margin-top: 30px;">
          Obrigado,<br>
          <strong>Meu Fluxo</strong>
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Este é um lembrete automático do Meu Fluxo
          </p>
          <p style="color: #999; font-size: 12px; margin: 8px 0 0 0;">
            Dúvidas? Entre em contato: <a href="mailto:contato@bubuya.com.br" style="color: #28A263; text-decoration: none;">contato@bubuya.com.br</a>
          </p>
        </div>
      </div>
    `,
  };
}

// Função principal
export async function sendPaymentReminders() {
  console.log("🚀 Iniciando verificação de lembretes de cobrança...");

  let emailsSent = 0;
  const errors: string[] = [];

  try {
    // 1. Buscar todos os usuários com notificações ativadas
    const { records: users } = await pb.collection("profiles").getList(1, 500, {
      filter: `receive_payment_reminders = true`,
      requestKey: null,
    });

    console.log(`📋 ${users.length} usuários para verificar`);

    for (const user of users as User[]) {
      try {
        // 2. Verificar PROPOSTAS VENCIDAS
        const hoje = new Date().toISOString().split("T")[0];

        const { records: proposals } = await pb
          .collection("proposals")
          .getList(1, 500, {
            filter: `user_id = "${user.id}" && status = "aprovada" && validade < "${hoje}"`,
            requestKey: null,
          });

        console.log(`  - Usuário ${user.name}: ${proposals.length} propostas vencidas`);

        for (const proposal of proposals as Proposal[]) {
          try {
            // Verificar se já enviou lembretes
            const { records: reminders } = await pb
              .collection("payment_reminders")
              .getList(1, 1, {
                filter: `proposal_id = "${proposal.id}"`,
                requestKey: null,
              });

            const reminder = reminders[0];
            const reminderCount = reminder?.reminder_count || 0;

            if (reminderCount < 3 && !reminder?.disabled) {
              // Enviar email
              const emailData = getProposalEmailTemplate(proposal, user);

              const response = await resend.emails.send({
                from: "cobrancas@bubuya.com.br",
                ...emailData,
              });

              if (response.error) {
                throw new Error(response.error.message);
              }

              // Atualizar ou criar reminder
              const today = new Date().toISOString().split("T")[0];

              if (reminder) {
                await pb
                  .collection("payment_reminders")
                  .update(reminder.id, {
                    last_sent_date: today,
                    reminder_count: reminderCount + 1,
                  });
              } else {
                await pb.collection("payment_reminders").create({
                  userid: user.id,
                  type: "proposal",
                  proposal_id: proposal.id,
                  reminder_count: 1,
                  last_sent_date: today,
                });
              }

              emailsSent++;
              console.log(`    ✅ Email enviado para ${user.email} - Proposta ${proposal.id}`);
            }
          } catch (err) {
            const msg = `Erro ao processar proposta ${proposal.id}: ${err}`;
            console.error(`    ❌ ${msg}`);
            errors.push(msg);
          }
        }

        // 3. Verificar CONTAS VENCENDO EM 3 DIAS
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

        const { records: payables } = await pb
          .collection("payables")
          .getList(1, 500, {
            filter: `userid = "${user.id}" && status = "pendente" && data_vencimento >= "${hoje}" && data_vencimento <= "${threeDaysFromNow.toISOString().split("T")[0]}"`,
            requestKey: null,
          });

        console.log(`  - Usuário ${user.name}: ${payables.length} contas vencendo`);

        for (const payable of payables as Payable[]) {
          try {
            const { records: reminders } = await pb
              .collection("payment_reminders")
              .getList(1, 1, {
                filter: `payable_id = "${payable.id}"`,
                requestKey: null,
              });

            const reminder = reminders[0];
            const reminderCount = reminder?.reminder_count || 0;

            if (reminderCount < 3 && !reminder?.disabled) {
              const emailData = getPayableEmailTemplate(payable, user);

              const response = await resend.emails.send({
                from: "cobrancas@bubuya.com.br",
                ...emailData,
              });

              if (response.error) {
                throw new Error(response.error.message);
              }

              const today = new Date().toISOString().split("T")[0];

              if (reminder) {
                await pb
                  .collection("payment_reminders")
                  .update(reminder.id, {
                    last_sent_date: today,
                    reminder_count: reminderCount + 1,
                  });
              } else {
                await pb.collection("payment_reminders").create({
                  userid: user.id,
                  type: "payable",
                  payable_id: payable.id,
                  reminder_count: 1,
                  last_sent_date: today,
                });
              }

              emailsSent++;
              console.log(`    ✅ Email enviado para ${user.email} - Conta ${payable.id}`);
            }
          } catch (err) {
            const msg = `Erro ao processar conta ${payable.id}: ${err}`;
            console.error(`    ❌ ${msg}`);
            errors.push(msg);
          }
        }
      } catch (err) {
        const msg = `Erro ao processar usuário ${user.id}: ${err}`;
        console.error(`  ❌ ${msg}`);
        errors.push(msg);
      }
    }

    console.log(`✨ Processo concluído! ${emailsSent} emails enviados`);

    return {
      success: true,
      emailsSent,
      errors: errors.length > 0 ? errors : null,
    };
  } catch (error) {
    const msg = `Erro crítico: ${error}`;
    console.error(`❌ ${msg}`);
    return {
      success: false,
      emailsSent: 0,
      error: msg,
    };
  }
}
