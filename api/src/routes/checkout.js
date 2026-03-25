const express = require("express");
const router = express.Router();
const asaas = require("../lib/asaas");
const supabase = require("../lib/supabase");

// POST /checkout
// Body: { userId, name, email, cpfCnpj (opcional) }
router.post("/", async (req, res) => {
  const { userId, name, email, cpfCnpj } = req.body;

  if (!userId || !name || !email) {
    return res.status(400).json({ error: "userId, name e email são obrigatórios" });
  }

  try {
    // 1. Verificar se já tem customer_id salvo no perfil
    const { data: profile } = await supabase
      .from("profiles")
      .select("asaas_customer_id")
      .eq("id", userId)
      .single();

    let customerId = profile?.asaas_customer_id;

    // 2. Criar cliente no Asaas se não existir
    if (!customerId) {
      const customerData = {
        name,
        email,
        notificationDisabled: false,
      };
      if (cpfCnpj) customerData.cpfCnpj = cpfCnpj;

      const { data: customer } = await asaas.post("/customers", customerData);
      customerId = customer.id;

      // Salvar customer_id no perfil
      await supabase
        .from("profiles")
        .update({ asaas_customer_id: customerId })
        .eq("id", userId);
    }

    // 3. Criar cobrança de R$ 9,90 (primeiro mês)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1); // vence amanhã
    const dueDateStr = dueDate.toISOString().split("T")[0];

    const { data: charge } = await asaas.post("/payments", {
      customer: customerId,
      billingType: "UNDEFINED", // usuário escolhe PIX, boleto ou cartão
      value: 9.90,
      dueDate: dueDateStr,
      description: "Hub do Empreendedor PRO - 1º mês",
      externalReference: `first_month_${userId}`,
      callback: {
        successUrl: `${process.env.APP_URL}/checkout/success`,
        autoRedirect: true
      }
    });

    return res.json({
      paymentUrl: charge.invoiceUrl,
      paymentId: charge.id
    });

  } catch (error) {
    console.error("Erro no checkout:", error?.response?.data || error.message);
    return res.status(500).json({ error: "Erro ao criar cobrança" });
  }
});

module.exports = router;
