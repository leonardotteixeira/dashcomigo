const express = require("express");
const router = express.Router();
const PocketBase = require("pocketbase/cjs");
const asaas = require("../lib/asaas");
const { pb, ensureAdmin } = require("../lib/pocketbase");

// Statuses da Asaas que confirmam pagamento
const PAID_STATUSES = ["CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH"];

async function verifyUserToken(token, userId) {
  const userPb = new PocketBase(process.env.POCKETBASE_URL);
  userPb.authStore.save(token, null);
  try {
    const { record } = await userPb.collection("profiles").authRefresh();
    return record.id === userId;
  } catch {
    return false;
  }
}

// POST /verify-payment
// Body: { paymentId, userId }
// Header: Authorization: Bearer <token>
router.post("/", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Autenticação necessária" });
  }
  const userToken = authHeader.substring("Bearer ".length);

  const { paymentId, userId } = req.body;
  if (!paymentId || !userId) {
    return res.status(400).json({ error: "paymentId e userId são obrigatórios" });
  }

  // Verifica que o token pertence ao userId
  const tokenValid = await verifyUserToken(userToken, userId);
  if (!tokenValid) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  try {
    // Consulta status do pagamento na Asaas
    const { data: payment } = await asaas.get(`/payments/${paymentId}`);

    console.log(`verify-payment: ${paymentId} → status=${payment.status} user=${userId}`);

    if (!PAID_STATUSES.includes(payment.status)) {
      return res.json({
        paid: false,
        status: payment.status,
        message: "Pagamento ainda não confirmado"
      });
    }

    // Pagamento confirmado → ativa PRO
    await ensureAdmin();
    await pb.collection("profiles").update(userId, { plan: "pro" });

    // Cria assinatura recorrente se ainda não existir
    const profile = await pb.collection("profiles").getOne(userId);
    if (profile?.asaas_customer_id && !profile?.asaas_subscription_id) {
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
          externalReference: `subscription_${userId}`
        });

        await pb.collection("profiles").update(userId, {
          asaas_subscription_id: subscription.id
        });
      } catch (subErr) {
        // Não bloqueia o fluxo se assinatura falhar
        console.error("Erro ao criar assinatura:", subErr.message);
      }
    }

    console.log(`Plano PRO ativado via verify-payment para userId=${userId}`);

    return res.json({
      paid: true,
      status: payment.status,
      plan: "pro"
    });

  } catch (error) {
    const detail = error?.response?.data || error.message;
    console.error("Erro no verify-payment:", JSON.stringify(detail));
    return res.status(500).json({ error: "Erro ao verificar pagamento", detail });
  }
});

module.exports = router;
