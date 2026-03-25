const express = require("express");
const router = express.Router();
const asaas = require("../lib/asaas");
const supabase = require("../lib/supabase");

// POST /webhook/asaas
// Recebe notificações do Asaas sobre pagamentos
router.post("/asaas", async (req, res) => {
  const { event, payment } = req.body;

  console.log("Webhook Asaas:", event, payment?.id);

  // Só processa eventos de pagamento confirmado
  if (event !== "PAYMENT_CONFIRMED" && event !== "PAYMENT_RECEIVED") {
    return res.json({ received: true });
  }

  try {
    const externalRef = payment?.externalReference || "";

    // --- PRIMEIRO MÊS (R$ 9,90) ---
    if (externalRef.startsWith("first_month_")) {
      const userId = externalRef.replace("first_month_", "");

      // Ativar plano PRO
      await supabase
        .from("profiles")
        .update({ plan: "pro" })
        .eq("id", userId);

      // Criar assinatura recorrente de R$ 29,90 a partir do mês seguinte
      const { data: profile } = await supabase
        .from("profiles")
        .select("asaas_customer_id")
        .eq("id", userId)
        .single();

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
          description: "Hub do Empreendedor PRO - Assinatura mensal",
          externalReference: `subscription_${userId}`
        });
      }

      console.log(`Usuário ${userId} ativado como PRO`);
    }

    // --- RENOVAÇÃO MENSAL (R$ 29,90) ---
    if (externalRef.startsWith("subscription_")) {
      const userId = externalRef.replace("subscription_", "");

      // Garantir que plano continua PRO
      await supabase
        .from("profiles")
        .update({ plan: "pro" })
        .eq("id", userId);

      console.log(`Assinatura renovada para usuário ${userId}`);
    }

    return res.json({ received: true });

  } catch (error) {
    console.error("Erro no webhook:", error.message);
    return res.status(500).json({ error: "Erro ao processar webhook" });
  }
});

// POST /webhook/asaas/cancel
// Chamado quando assinatura é cancelada ou pagamento falha
router.post("/asaas/cancel", async (req, res) => {
  const { event, payment, subscription } = req.body;

  const cancelEvents = [
    "PAYMENT_OVERDUE",
    "SUBSCRIPTION_INACTIVATED"
  ];

  if (!cancelEvents.includes(event)) {
    return res.json({ received: true });
  }

  try {
    const externalRef = payment?.externalReference || subscription?.externalReference || "";

    if (externalRef.startsWith("subscription_")) {
      const userId = externalRef.replace("subscription_", "");

      await supabase
        .from("profiles")
        .update({ plan: "free" })
        .eq("id", userId);

      console.log(`Usuário ${userId} revertido para free`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook de cancelamento:", error.message);
    return res.status(500).json({ error: "Erro ao processar cancelamento" });
  }
});

module.exports = router;
