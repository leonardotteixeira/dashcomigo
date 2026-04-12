const express = require("express");
const router = express.Router();
const PocketBase = require("pocketbase/cjs");
const asaas = require("../lib/asaas");
const { pb, ensureAdmin } = require("../lib/pocketbase");

// Statuses da Asaas que confirmam pagamento
// Em sandbox, pagamentos podem ficar em PENDING/AWAITING após redirect — incluídos para testes
const PAID_STATUSES = ["CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH"];
const SANDBOX_ACCEPT_STATUSES = ["CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH", "PENDING", "AWAITING_RISK_ANALYSIS"];

const isSandbox = process.env.ASAAS_SANDBOX === "true";

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
    console.log(`[verify-payment] consultando Asaas paymentId=${paymentId} userId=${userId} sandbox=${isSandbox}`);
    const { data: payment } = await asaas.get(`/payments/${paymentId}`);
    console.log(`[verify-payment] status Asaas: ${payment.status}, value: ${payment.value}, customer: ${payment.customer}`);

    const acceptedStatuses = isSandbox ? SANDBOX_ACCEPT_STATUSES : PAID_STATUSES;

    if (!acceptedStatuses.includes(payment.status)) {
      console.log(`[verify-payment] status '${payment.status}' não aceito`);
      return res.json({
        paid: false,
        status: payment.status,
        message: "Pagamento ainda não confirmado"
      });
    }

    console.log(`[verify-payment] pagamento aceito (status=${payment.status}), ativando PRO...`);

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
