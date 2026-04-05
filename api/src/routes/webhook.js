const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const asaas = require("../lib/asaas");
const { pb, ensureAdmin } = require("../lib/pocketbase");

// Regex para validar IDs do PocketBase (15 chars alfanuméricos minúsculos)
const PB_ID_REGEX = /^[a-z0-9]{15}$/;

// Comparação em tempo constante para evitar timing attacks
function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // Executa a comparação de qualquer forma para evitar timing leak no length check
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

// Middleware de verificação do token do webhook Asaas
function verifyWebhookToken(req, res, next) {
  const token = req.headers["asaas-access-token"];
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;

  if (!expectedToken) {
    console.error("ASAAS_WEBHOOK_TOKEN não configurado no servidor");
    return res.status(500).json({ error: "Webhook token not configured" });
  }

  if (!token || !timingSafeEqual(token, expectedToken)) {
    console.warn("Webhook rejeitado: token inválido");
    return res.status(401).json({ error: "Token inválido" });
  }

  next();
}

// POST /webhook/asaas
// Recebe notificações do Asaas sobre pagamentos
router.post("/asaas", verifyWebhookToken, async (req, res) => {
  const { event, payment } = req.body;

  console.log("Webhook Asaas:", event, payment?.id);

  // Só processa eventos de pagamento confirmado
  if (event !== "PAYMENT_CONFIRMED" && event !== "PAYMENT_RECEIVED") {
    return res.json({ received: true });
  }

  try {
    await ensureAdmin();
    const externalRef = payment?.externalReference || "";

    // --- PRIMEIRO MÊS (R$ 9,90) ---
    if (externalRef.startsWith("first_month_")) {
      const userId = externalRef.replace("first_month_", "");

      if (!PB_ID_REGEX.test(userId)) {
        console.warn("Webhook: userId inválido em externalReference:", externalRef);
        return res.json({ received: true });
      }

      // Ativar plano PRO
      await pb.collection("profiles").update(userId, { plan: "pro" });

      // Criar assinatura recorrente de R$ 29,90 a partir do mês seguinte
      const profile = await pb.collection("profiles").getOne(userId);

      if (profile?.asaas_customer_id) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthStr = nextMonth.toISOString().split("T")[0];

        await asaas.post("/subscriptions", {
          customer: profile.asaas_customer_id,
          billingType: "UNDEFINED",
          value: 29.90,
          nextDueDate: nextMonthStr,
          cycle: "MONTHLY",
          description: "Meu Fluxo PRO - Assinatura mensal",
          externalReference: `subscription_${userId}`
        });
      }

      console.log("Usuário ativado como PRO");
    }

    // --- RENOVAÇÃO MENSAL (R$ 29,90) ---
    if (externalRef.startsWith("subscription_")) {
      const userId = externalRef.replace("subscription_", "");

      if (!PB_ID_REGEX.test(userId)) {
        console.warn("Webhook: userId inválido em externalReference:", externalRef);
        return res.json({ received: true });
      }

      // Garantir que plano continua PRO
      await pb.collection("profiles").update(userId, { plan: "pro" });

      console.log("Assinatura renovada");
    }

    return res.json({ received: true });

  } catch (error) {
    console.error("Erro no webhook:", error.message);
    return res.status(500).json({ error: "Erro ao processar webhook" });
  }
});

// POST /webhook/asaas/cancel
// Chamado quando assinatura é cancelada ou pagamento falha
router.post("/asaas/cancel", verifyWebhookToken, async (req, res) => {
  const { event, payment, subscription } = req.body;

  const cancelEvents = [
    "PAYMENT_OVERDUE",
    "SUBSCRIPTION_INACTIVATED"
  ];

  if (!cancelEvents.includes(event)) {
    return res.json({ received: true });
  }

  try {
    await ensureAdmin();
    const externalRef = payment?.externalReference || subscription?.externalReference || "";

    if (externalRef.startsWith("subscription_")) {
      const userId = externalRef.replace("subscription_", "");

      if (!PB_ID_REGEX.test(userId)) {
        console.warn("Webhook cancel: userId inválido em externalReference:", externalRef);
        return res.json({ received: true });
      }

      await pb.collection("profiles").update(userId, { plan: "free" });

      console.log("Assinatura cancelada, plano revertido para free");
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook de cancelamento:", error.message);
    return res.status(500).json({ error: "Erro ao processar cancelamento" });
  }
});

module.exports = router;
