const express = require("express");
const router = express.Router();
const PocketBase = require("pocketbase/cjs");

function isValidCPF(digits) {
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10 || d1 === 11) d1 = 0;
  if (d1 !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10 || d2 === 11) d2 = 0;
  return d2 === parseInt(digits[10]);
}

function isValidCNPJ(digits) {
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = weights1.reduce((acc, w, i) => acc + parseInt(digits[i]) * w, 0);
  let d1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (d1 !== parseInt(digits[12])) return false;
  sum = weights2.reduce((acc, w, i) => acc + parseInt(digits[i]) * w, 0);
  let d2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return d2 === parseInt(digits[13]);
}
const asaas = require("../lib/asaas");
const { pb, ensureAdmin } = require("../lib/pocketbase");

// Verifica se o token pertence ao userId informado
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

// POST /checkout
// Body: { userId, name, email, cpfCnpj }
// Header: Authorization: Bearer <pocketbase_token>
router.post("/", async (req, res) => {
  // Verificar autenticação
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Autenticação necessária" });
  }
  const userToken = authHeader.substring("Bearer ".length);

  const { userId, name, email, cpfCnpj } = req.body;

  if (!userId || !name || !email || !cpfCnpj) {
    return res.status(400).json({ error: "userId, name, email e cpfCnpj são obrigatórios" });
  }

  // PocketBase usa IDs de 15 chars alfanuméricos
  const pbIdRegex = /^[a-z0-9]{15}$/;
  if (!pbIdRegex.test(userId)) {
    return res.status(400).json({ error: "userId inválido" });
  }

  // Confirmar que o token pertence ao userId declarado
  const tokenValid = await verifyUserToken(userToken, userId);
  if (!tokenValid) {
    return res.status(403).json({ error: "Acesso negado: token não corresponde ao usuário" });
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
  if (digits.length === 11 && !isValidCPF(digits)) {
    return res.status(400).json({ error: "CPF inválido" });
  }
  if (digits.length === 14 && !isValidCNPJ(digits)) {
    return res.status(400).json({ error: "CNPJ inválido" });
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
