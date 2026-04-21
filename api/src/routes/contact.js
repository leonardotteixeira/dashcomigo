const express = require("express");
const { Resend } = require("resend");
const PocketBase = require("pocketbase/cjs");

const router = express.Router();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize PocketBase
const pbURL = process.env.POCKETBASE_URL || "http://localhost:8090";
const pb = new PocketBase(pbURL);

// Contact email destination
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "contato@dashcomigo.com.br";

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize string input to prevent injection
function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .substring(0, 5000) // Limit length
    .replace(/[<>]/g, ""); // Remove potential HTML
}

// Generate HTML email template with DashComigo branding
function generateEmailTemplate(nome, email, assunto, mensagem, messageId) {
  const subjectMap = {
    duvidas: "Dúvidas",
    suporte: "Suporte técnico",
    comercial: "Comercial",
    outros: "Outros",
  };

  const subjectLabel = subjectMap[assunto] || assunto;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #0E3B2E; }
        .container { max-width: 600px; margin: 0 auto; background: #F4EFE6; padding: 40px 20px; }
        .header { border-bottom: 2px solid #7FD19F; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #0E3B2E; margin: 0; font-size: 24px; }
        .header p { color: rgba(14, 59, 46, 0.6); margin: 5px 0 0 0; font-size: 14px; }
        .content { background: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; border: 1px solid rgba(20, 18, 15, 0.1); }
        .info-group { margin-bottom: 25px; }
        .info-label { color: #1F5A3A; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-value { color: #0E3B2E; font-size: 14px; margin-top: 5px; word-break: break-all; }
        .message-section { background: #F4EFE6; padding: 20px; border-left: 4px solid #7FD19F; border-radius: 4px; margin-bottom: 20px; }
        .message-title { color: #1F5A3A; font-weight: 600; font-size: 12px; margin-bottom: 10px; }
        .message-text { color: rgba(14, 59, 46, 0.8); white-space: pre-wrap; word-wrap: break-word; }
        .footer { background: rgba(14, 59, 46, 0.05); padding: 20px; border-radius: 8px; font-size: 12px; color: rgba(14, 59, 46, 0.6); text-align: center; }
        .badge { display: inline-block; background: rgba(127, 209, 159, 0.2); color: #1F5A3A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>DashComigo</h1>
          <p>Nova mensagem de contato recebida</p>
        </div>

        <div class="content">
          <div class="badge">${subjectLabel}</div>

          <div class="info-group">
            <div class="info-label">De</div>
            <div class="info-value">${sanitizeInput(nome)}</div>
          </div>

          <div class="info-group">
            <div class="info-label">Email</div>
            <div class="info-value"><a href="mailto:${email}" style="color: #0E3B2E; text-decoration: none;">${email}</a></div>
          </div>

          <div class="info-group">
            <div class="info-label">Assunto</div>
            <div class="info-value">${subjectLabel}</div>
          </div>

          <div class="message-section">
            <div class="message-title">📝 Mensagem</div>
            <div class="message-text">${sanitizeInput(mensagem)}</div>
          </div>

          <div style="color: rgba(14, 59, 46, 0.5); font-size: 12px;">
            <strong>ID da mensagem:</strong> ${messageId}<br>
            <strong>Recebida em:</strong> ${new Date().toLocaleString("pt-BR")}
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0;">Responda diretamente para o email do remetente para entrar em contato. Mensagens de contato são armazenadas e rastreadas no DashComigo.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// POST /api/contact - Handle contact form submission
router.post("/", async (req, res) => {
  try {
    const { nome, email, assunto, mensagem } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    // Validate required fields
    if (!nome || !email || !assunto || !mensagem) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios.",
        code: "MISSING_FIELDS",
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "Email inválido.",
        code: "INVALID_EMAIL",
      });
    }

    // Validate subject is one of allowed values
    const allowedSubjects = ["duvidas", "suporte", "comercial", "outros"];
    if (!allowedSubjects.includes(assunto)) {
      return res.status(400).json({
        error: "Assunto inválido.",
        code: "INVALID_SUBJECT",
      });
    }

    // Validate message length
    if (mensagem.length < 10 || mensagem.length > 5000) {
      return res.status(400).json({
        error: "A mensagem deve ter entre 10 e 5000 caracteres.",
        code: "INVALID_MESSAGE_LENGTH",
      });
    }

    // Authenticate with PocketBase using admin credentials
    await pb.admins.authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL || "admin@example.com",
      process.env.POCKETBASE_ADMIN_PASSWORD || "admin123"
    );

    // Store message in PocketBase with pending status
    let contactRecord;
    try {
      contactRecord = await pb.collection("contact_messages").create({
        nome: sanitizeInput(nome),
        email: email.toLowerCase(),
        assunto: assunto,
        mensagem: sanitizeInput(mensagem),
        status: "pending",
        ipAddress: ipAddress,
        userAgent: userAgent.substring(0, 500),
      });
    } catch (dbError) {
      console.error("PocketBase storage error:", dbError);
      // Log to stdout for Railway monitoring
      console.log(
        `[ERROR] Contact form submission failed - DB error for email: ${email}`
      );
      return res.status(500).json({
        error: "Erro ao processar sua mensagem. Tente novamente em alguns minutos.",
        code: "DB_ERROR",
      });
    }

    const messageId = contactRecord.id;

    // Generate email HTML template
    const htmlContent = generateEmailTemplate(
      nome,
      email,
      assunto,
      mensagem,
      messageId
    );

    // Send email via Resend
    let emailSent = false;
    let emailError = null;

    try {
      const emailResponse = await resend.emails.send({
        from: "DashComigo <onboarding@resend.dev>", // Use Resend domain or verified sender
        to: CONTACT_EMAIL,
        replyTo: email, // Set reply-to as sender's email
        subject: `[DashComigo] ${
          { duvidas: "Dúvida", suporte: "Suporte", comercial: "Comercial", outros: "Outro" }[assunto] || assunto
        } de ${sanitizeInput(nome)}`,
        html: htmlContent,
      });

      if (emailResponse.id) {
        emailSent = true;
        console.log(`Email sent successfully for contact message ${messageId}`);
      }
    } catch (resendError) {
      emailError = resendError.message || "Unknown Resend error";
      console.error("Resend email error:", emailError);
      console.log(
        `[ERROR] Email delivery failed for contact message ${messageId}: ${emailError}`
      );
    }

    // Update message status based on email result
    try {
      await pb.collection("contact_messages").update(messageId, {
        status: emailSent ? "sent" : "failed",
        sentAt: emailSent ? new Date().toISOString() : null,
        error: emailSent ? null : emailError || "Email delivery failed",
      });
    } catch (updateError) {
      console.error("Failed to update message status:", updateError);
    }

    // Return response to frontend
    // Even if email failed, we store the message (persistence > delivery)
    return res.status(200).json({
      success: true,
      messageId: messageId,
      message: "Sua mensagem foi recebida. Entraremos em contato em breve.",
      status: emailSent ? "sent" : "pending",
      emailStatus: emailSent ? "sent" : "failed",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    console.log(`[ERROR] Unexpected error in contact form: ${error.message}`);

    return res.status(500).json({
      error: "Erro ao processar sua mensagem. Tente novamente em alguns minutos.",
      code: "INTERNAL_ERROR",
    });
  }
});

module.exports = router;
