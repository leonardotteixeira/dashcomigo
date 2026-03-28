const express = require("express");
const router = express.Router();
const asaas = require("../lib/asaas");
const { pb, ensureAdmin } = require("../lib/pocketbase");

// POST /checkout
// Body: { userId, name, email, cpfCnpj }
router.post("/", async (req, res) => {
  const { userId, name, email, cpfCnpj } = req.body;

  if (!userId || !name || !email || !cpfCnpj) {
    return res.status(400).json({ error: "userId, name, email e cpfCnpj são obrigatórios" });
  }

  // PocketBase usa IDs de 15 chars alfanuméricos
  const pbIdRegex = /^[a-z0-9]{15}$/;
  if (!pbIdRegex.test(userId)) {
    return res.status(400).json({ error: "userId inválido" });
  }

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 200) {
    return res.status(400).json({ error: "Nome deve ter entre 2 e 200 caracteres" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Formato de email inválido" });
  }

  const digits = cpfCnpj.replace(/\D/g, "");
  if (digits.length !== 11 && digits.length !== 14) {
    return res.status(400).json({ error: "CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos" });
  }

  try {
    await ensureAdmin();

    // 1. Verificar se já tem customer_id salvo no perfil
    const profile = await pb.collection("profiles").getOne(userId);
    let customerId = profile?.asaas_customer_id;

    // 2. Criar ou atualizar cliente no Asaas
    if (!customerId) {
      const { data: customer } = await asaas.post("/customers", {
        name,
        email,
        cpfCnpj,
        notificationDisabled: false,
      });
      customerId = customer.id;

      await pb.collection("profiles").update(userId, {
        asaas_customer_id: customerId,
      });
    } else {
      // Atualizar CPF/CNPJ do cliente existente
      await asaas.put(`/customers/${customerId}`, { cpfCnpj });
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
      description: "Meu Fluxo PRO - 1º mês",
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
    const detail = error?.response?.data || error.message;
    console.error("Erro no checkout:", JSON.stringify(detail, null, 2));
    return res.status(500).json({
      error: "Erro ao criar cobrança",
      detail: typeof detail === "object" ? detail : { message: detail }
    });
  }
});

module.exports = router;
