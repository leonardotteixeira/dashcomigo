import { VercelRequest, VercelResponse } from "@vercel/node";

// Mock Resend para teste
async function sendTestEmail(to: string) {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VITE_RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "cobrancas@bubuya.com.br",
        to: to,
        subject: "✅ Teste - Sistema de Lembretes de Cobrança Funcionando!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #28A263;">✅ Sucesso!</h2>

            <p style="color: #666; font-size: 16px;">
              O sistema de <strong>lembretes de cobrança automáticos</strong> do Bubuya está funcionando corretamente!
            </p>

            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📅 Data do Teste:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
              <p style="margin: 5px 0;"><strong>🕒 Horário:</strong> ${new Date().toLocaleTimeString('pt-BR')}</p>
              <p style="margin: 5px 0;"><strong>🔄 Frequência:</strong> Diariamente às 08:00 UTC (13:00 São Paulo)</p>
            </div>

            <h3 style="color: #333; margin-top: 30px;">📧 Você receberá emails automáticos para:</h3>
            <ul style="color: #666;">
              <li><strong>Propostas vencidas:</strong> quando uma proposta aprovada vencer</li>
              <li><strong>Contas a pagar:</strong> quando uma conta vencer em 3 dias</li>
              <li><strong>Máximo 3 lembretes:</strong> por proposta/conta (para evitar spam)</li>
            </ul>

            <div style="background: #fff3cd; border-left: 4px solid #ff9800; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>💡 Dica:</strong> Você pode ativar/desativar os lembretes no seu perfil em <strong>Notificações</strong>
              </p>
            </div>

            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Qualquer dúvida, entre em contato:<br>
              📧 <a href="mailto:contato@bubuya.com.br" style="color: #28A263; text-decoration: none;">contato@bubuya.com.br</a>
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Este é um email de teste do sistema de lembretes automáticos do Meu Fluxo
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization as string;
    const webhookSecret = process.env.VITE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(500).json({ error: "Webhook secret não configurado" });
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header ausente" });
    }

    const token = authHeader.substring("Bearer ".length);

    if (token !== webhookSecret) {
      return res.status(403).json({ error: "Token inválido" });
    }

    // Se for um teste, enviar email de teste
    let testEmail = null;

    // Tenta pegar do body (se for JSON)
    if (typeof req.body === 'object' && req.body?.testEmail) {
      testEmail = req.body.testEmail;
    }
    // Tenta pegar da query string
    if (!testEmail && typeof req.query?.testEmail === 'string') {
      testEmail = req.query.testEmail;
    }

    if (testEmail) {
      try {
        await sendTestEmail(testEmail);
        return res.status(200).json({
          success: true,
          message: `✅ Email de teste enviado para ${testEmail}!`,
          type: "test",
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: `Erro ao enviar email: ${error instanceof Error ? error.message : 'Desconhecido'}`,
        });
      }
    }

    // Caso contrário, retornar status
    return res.status(200).json({
      success: true,
      message: "✅ Sistema de lembretes de cobrança está operacional!",
      emailsSent: 0,
      timestamp: new Date().toISOString(),
      info: "Emails serão enviados automaticamente todos os dias às 08:00 UTC (13:00 São Paulo)",
    });
  } catch (error) {
    console.error("❌ Erro:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}
