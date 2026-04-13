const express = require("express");
const router = express.Router();
const asaas = require("../lib/asaas");
const { pb, ensureAdmin } = require("../lib/pocketbase");

// Statuses da Asaas que confirmam pagamento
const PAID_STATUSES = ["CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH"];
// Em sandbox, pagamentos podem ficar em PENDING/AWAITING após redirect
const SANDBOX_ACCEPT_STATUSES = ["CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH", "PENDING", "AWAITING_RISK_ANALYSIS"];

const isSandbox = process.env.ASAAS_SANDBOX === "true";

// POST /verify-payment
// Body: { paymentId, userId }
// Verifica diretamente na API Asaas se o pagamento foi confirmado
// Funciona como fallback quando o webhook não dispara (sandbox)
router.post("/", async (req, res) => {
  const { paymentId, userId } = req.body;

  console.log("[verify-payment] === Nova verificacao ===");
  console.log("[verify-payment] paymentId:", paymentId);
  console.log("[verify-payment] userId:", userId);
  console.log("[verify-payment] sandbox:", isSandbox);

  if (!paymentId || !userId) {
    return res.status(400).json({ error: "paymentId e userId sao obrigatorios", paid: false });
  }

  // Validacao basica do userId (PocketBase ID = 15 chars alfanumericos)
  if (!/^[a-z0-9]{15}$/.test(userId)) {
    return res.status(400).json({ error: "userId invalido", paid: false });
  }

  try {
    // 1. Consulta status do pagamento na Asaas
    console.log("[verify-payment] Consultando Asaas...");
    const { data: payment } = await asaas.get(`/payments/${paymentId}`);

    console.log("[verify-payment] Status Asaas:", payment.status);
    console.log("[verify-payment] ExternalRef:", payment.externalReference);
    console.log("[verify-payment] Valor:", payment.value);

    // 2. Verificar que o externalReference bate com o userId
    const expectedRef = `first_month_${userId}`;
    if (payment.externalReference !== expectedRef) {
      console.warn("[verify-payment] ExternalRef nao bate:", payment.externalReference, "!=", expectedRef);
      return res.status(403).json({ error: "Pagamento nao pertence a este usuario", paid: false });
    }

    // 3. Verificar status
    const acceptedStatuses = isSandbox ? SANDBOX_ACCEPT_STATUSES : PAID_STATUSES;

    if (!acceptedStatuses.includes(payment.status)) {
      console.log("[verify-payment] Status nao aceito:", payment.status);
      return res.json({
        paid: false,
        status: payment.status,
        message: "Pagamento ainda nao confirmado",
      });
    }

    // 4. Pagamento confirmado -> ativa PRO
    console.log("[verify-payment] Pagamento aceito! Ativando PRO...");
    await ensureAdmin();

    const profile = await pb.collection("profiles").getOne(userId);

    if (profile.plan === "pro") {
      console.log("[verify-payment] Usuario ja e PRO");
      return res.json({ paid: true, status: payment.status, alreadyPro: true });
    }

    await pb.collection("profiles").update(userId, { plan: "pro" });
    console.log("[verify-payment] Plano atualizado para PRO");

    // 5. Criar assinatura recorrente se nao existir
    if (profile.asaas_customer_id && !profile.asaas_subscription_id) {
      try {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthStr = nextMonth.toISOString().split("T")[0];

        const { data: subscription } = await asaas.post("/subscriptions", {
          customer: profile.asaas_customer_id,
          billingType: "UNDEFINED",
          value: 29.90,
          nextDueDate: nextMonthStr,
          cycle: "MONTHLY",
          description: "Meu Fluxo PRO - Assinatura mensal",
          externalReference: `subscription_${userId}`,
        });

        await pb.collection("profiles").update(userId, {
          asaas_subscription_id: subscription.id,
        });

        console.log("[verify-payment] Assinatura criada:", subscription.id);
      } catch (subErr) {
        console.error("[verify-payment] Erro ao criar assinatura:", subErr?.response?.data || subErr.message);
      }
    }

    console.log("[verify-payment] PRO ativado com sucesso para userId:", userId);

    return res.json({
      paid: true,
      status: payment.status,
      plan: "pro",
    });
  } catch (error) {
    const detail = error?.response?.data || error.message;
    console.error("[verify-payment] ERRO:", JSON.stringify(detail));
    return res.status(500).json({ error: "Erro ao verificar pagamento", paid: false });
  }
});

module.exports = router;
