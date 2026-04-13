const express = require("express");
const router = express.Router();
const asaas = require("../lib/asaas");
const { pb, ensureAdmin } = require("../lib/pocketbase");

const PAID_STATUSES = ["CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH"];
const SANDBOX_ACCEPT_STATUSES = [
  "CONFIRMED",
  "RECEIVED",
  "RECEIVED_IN_CASH",
  "PENDING",
  "AWAITING_RISK_ANALYSIS",
];
const isSandbox = process.env.ASAAS_SANDBOX === "true";

// POST /check-payment-by-user
// Body: { userId }
// Fallback: busca o ultimo pagamento CONFIRMED do customer Asaas associado ao userId
// e ativa PRO. Util quando o frontend perde o sessionStorage (fechou aba, voltou direto /app).
router.post("/", async (req, res) => {
  const { userId } = req.body;

  console.log("[check-payment-by-user] === Nova verificacao ===");
  console.log("[check-payment-by-user] userId:", userId);

  if (!userId || !/^[a-z0-9]{15}$/.test(userId)) {
    return res.status(400).json({ error: "userId invalido", paid: false });
  }

  try {
    await ensureAdmin();
    const profile = await pb.collection("profiles").getOne(userId);

    if (profile.plan === "pro") {
      return res.json({ paid: true, alreadyPro: true });
    }

    if (!profile.asaas_customer_id) {
      return res.json({ paid: false, reason: "no_customer" });
    }

    // Busca todos os pagamentos desse customer
    const { data } = await asaas.get(`/payments`, {
      params: { customer: profile.asaas_customer_id, limit: 20 },
    });

    const expectedRef = `first_month_${userId}`;
    const acceptedStatuses = isSandbox ? SANDBOX_ACCEPT_STATUSES : PAID_STATUSES;

    const paid = (data.data || []).find(
      (p) => p.externalReference === expectedRef && acceptedStatuses.includes(p.status)
    );

    if (!paid) {
      console.log("[check-payment-by-user] Nenhum pagamento confirmado encontrado");
      return res.json({ paid: false, reason: "no_confirmed_payment" });
    }

    console.log("[check-payment-by-user] Pagamento encontrado:", paid.id, paid.status);

    await pb.collection("profiles").update(userId, { plan: "pro" });
    console.log("[check-payment-by-user] PRO ativado para", userId);

    // Cria assinatura se nao existir
    if (!profile.asaas_subscription_id) {
      try {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthStr = nextMonth.toISOString().split("T")[0];

        const { data: subscription } = await asaas.post("/subscriptions", {
          customer: profile.asaas_customer_id,
          billingType: "UNDEFINED",
          value: 29.9,
          nextDueDate: nextMonthStr,
          cycle: "MONTHLY",
          description: "Meu Fluxo PRO - Assinatura mensal",
          externalReference: `subscription_${userId}`,
        });

        await pb.collection("profiles").update(userId, {
          asaas_subscription_id: subscription.id,
        });
        console.log("[check-payment-by-user] Assinatura criada:", subscription.id);
      } catch (subErr) {
        console.error(
          "[check-payment-by-user] Erro ao criar assinatura:",
          subErr?.response?.data || subErr.message
        );
      }
    }

    return res.json({ paid: true, paymentId: paid.id, status: paid.status, plan: "pro" });
  } catch (error) {
    const detail = error?.response?.data || error.message;
    console.error("[check-payment-by-user] ERRO:", JSON.stringify(detail));
    return res.status(500).json({ error: "Erro ao verificar pagamento", paid: false });
  }
});

module.exports = router;
