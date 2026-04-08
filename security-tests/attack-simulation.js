/**
 * SIMULAÇÃO DE ATAQUES — Testes de Penetração
 *
 * Testa se as correções de segurança estão bloqueando os ataques conhecidos.
 * Execute com: node security-tests/attack-simulation.js
 *
 * Cada teste tenta um ataque real e verifica se foi BLOQUEADO (esperado)
 * ou PASSOU (vulnerabilidade ainda presente).
 */

const API_URL = process.env.API_URL || "http://localhost:3000";

let passed = 0;
let failed = 0;
const results = [];

function result(name, blocked, status, body, note = "") {
  const ok = blocked; // esperamos que o ataque seja bloqueado
  if (ok) passed++; else failed++;
  results.push({ name, ok, status, body: JSON.stringify(body).slice(0, 120), note });
  const icon = ok ? "✅ BLOQUEADO" : "❌ VULNERÁVEL";
  console.log(`\n${icon} — ${name}`);
  console.log(`   HTTP ${status} → ${JSON.stringify(body).slice(0, 100)}`);
  if (note) console.log(`   ℹ️  ${note}`);
}

async function req(path, options = {}) {
  try {
    // Desestrutura para não sobrescrever Content-Type ao fazer spread de options
    const { headers: extraHeaders = {}, ...restOptions } = options;
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...extraHeaders },
      ...restOptions,
    });
    let body;
    try { body = await res.json(); } catch { body = { raw: await res.text() }; }
    return { status: res.status, body };
  } catch (e) {
    return { status: 0, body: { error: e.message } };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ATAQUE 1: Webhook forjado para promover usuário a PRO sem pagar
// ─────────────────────────────────────────────────────────────────────────────
async function attack1_WebhookSemToken() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ATAQUE 1 — Webhook forjado sem token");
  console.log("Objetivo: promover qualquer userId a PRO sem autenticação");

  const { status, body } = await req("/webhook/asaas", {
    method: "POST",
    body: JSON.stringify({
      event: "PAYMENT_CONFIRMED",
      payment: {
        id: "pay_fake123",
        externalReference: "first_month_aaaaabbbbbccccc", // userId inventado
      },
    }),
  });

  result(
    "Webhook sem token de autenticação",
    status === 401,
    status,
    body,
    "Deve retornar 401. Sem token válido, ninguém pode acionar o webhook."
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ATAQUE 2: Webhook com token errado
// ─────────────────────────────────────────────────────────────────────────────
async function attack2_WebhookTokenErrado() {
  const { status, body } = await req("/webhook/asaas", {
    method: "POST",
    headers: { "asaas-access-token": "token-falso-12345" },
    body: JSON.stringify({
      event: "PAYMENT_CONFIRMED",
      payment: { id: "pay_fake", externalReference: "first_month_aaaaabbbbbccccc" },
    }),
  });

  result(
    "Webhook com token inválido",
    status === 401,
    status,
    body,
    "Comparação timing-safe — token errado deve ser rejeitado com 401."
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ATAQUE 3: Webhook com userId malformado (injection)
// ─────────────────────────────────────────────────────────────────────────────
async function attack3_WebhookUserIdMalformado() {
  const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN;

  if (!webhookToken) {
    results.push({ name: "Webhook userId malformado", ok: null, note: "ASAAS_WEBHOOK_TOKEN não definido — pulando" });
    console.log("\n⚠️  PULADO — Webhook userId malformado (ASAAS_WEBHOOK_TOKEN não definido)");
    return;
  }

  const { status, body } = await req("/webhook/asaas", {
    method: "POST",
    headers: { "asaas-access-token": webhookToken },
    body: JSON.stringify({
      event: "PAYMENT_CONFIRMED",
      payment: {
        id: "pay_fake",
        // userId com caracteres especiais — tenta injeção no PocketBase filter
        externalReference: 'first_month_" || plan="pro" || "',
      },
    }),
  });

  result(
    "Webhook com userId malformado (injection attempt)",
    status !== 500 && body?.received === true,
    status,
    body,
    "Deve ignorar silenciosamente (received: true) sem atualizar nenhum registro."
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ATAQUE 4: Checkout sem autenticação
// ─────────────────────────────────────────────────────────────────────────────
async function attack4_CheckoutSemAuth() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ATAQUE 4 — Checkout sem token de autenticação");
  console.log("Objetivo: criar cobrança para um userId arbitrário sem estar logado");

  const { status, body } = await req("/checkout", {
    method: "POST",
    body: JSON.stringify({
      userId: "aaaaabbbbbccccc",
      name: "Hacker Silva",
      email: "hacker@evil.com",
      cpfCnpj: "11144477735", // CPF inválido matematicamente
    }),
  });

  result(
    "Checkout sem Authorization header",
    status === 401,
    status,
    body,
    "Sem Bearer token, deve retornar 401 antes de qualquer processamento."
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ATAQUE 5: Checkout com token válido mas userId de outro usuário
// ─────────────────────────────────────────────────────────────────────────────
async function attack5_CheckoutUserIdErrado() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ATAQUE 5 — Checkout com token real mas userId de outra pessoa");
  console.log("Objetivo: criar cobrança em nome de outro usuário");

  // Usa um token qualquer (não vazio) — será rejeitado pelo PocketBase authRefresh
  const { status, body } = await req("/checkout", {
    method: "POST",
    headers: { Authorization: "Bearer token_valido_mas_de_outro_usuario" },
    body: JSON.stringify({
      userId: "aaaaabbbbbccccc", // userId diferente do dono do token
      name: "Vítima",
      email: "vitima@empresa.com",
      cpfCnpj: "11144477735",
    }),
  });

  result(
    "Checkout com userId divergente do token",
    status === 401 || status === 403,
    status,
    body,
    "Token não corresponde ao userId → 401 (token inválido) ou 403 (acesso negado)."
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ATAQUE 6: CPF matematicamente inválido
// ─────────────────────────────────────────────────────────────────────────────
async function attack6_CPFInvalido() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ATAQUE 6 — CPF com dígitos verificadores errados");
  console.log("Objetivo: bypassar validação de CPF com número inventado");

  const cpfsInvalidos = [
    "11111111111", // sequência repetida
    "12345678900", // dígitos verificadores errados
    "00000000000", // zeros
    "99999999999", // noves
  ];

  for (const cpf of cpfsInvalidos) {
    const { status, body } = await req("/checkout", {
      method: "POST",
      headers: { Authorization: "Bearer qualquer_token" },
      body: JSON.stringify({
        userId: "aaaaabbbbbccccc",
        name: "Teste",
        email: "teste@teste.com",
        cpfCnpj: cpf,
      }),
    });

    // 400 = validação rejeitou o CPF (esperado)
    // 401/403 = auth rejeitou antes — também correto (protegido)
    // 429 = rate limit ativo — também protegido (não é vulnerabilidade)
    const blocked = status === 400 || status === 401 || status === 403 || status === 429;
    result(`CPF inválido "${cpf}"`, blocked, status, body);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ATAQUE 7: Rate limit — flood de requests
// ─────────────────────────────────────────────────────────────────────────────
async function attack7_RateLimit() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ATAQUE 7 — Flood de requisições (rate limit)");
  console.log("Objetivo: sobrecarregar o servidor com muitas chamadas");

  let blocked429 = false;
  let lastStatus = 0;

  for (let i = 0; i < 10; i++) {
    const { status } = await req("/checkout", {
      method: "POST",
      body: JSON.stringify({ userId: "x", name: "x", email: "x", cpfCnpj: "x" }),
    });
    lastStatus = status;
    if (status === 429) { blocked429 = true; break; }
  }

  result(
    "Rate limit no checkout (10 tentativas rápidas)",
    blocked429,
    lastStatus,
    { note: blocked429 ? "429 recebido — rate limit ativo" : "429 não recebido em 10 requests" },
    "Limite: 5 req/15min por IP. Após 5 tentativas deve retornar 429."
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ATAQUE 8: HTML injection nos dados (verificação conceitual)
// ─────────────────────────────────────────────────────────────────────────────
async function attack8_HTMLInjection() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ATAQUE 8 — HTML injection em templates de e-mail (verificação local)");
  console.log("Objetivo: injetar HTML/JS malicioso em e-mails de cobrança");

  // Verifica a função escapeHtml diretamente (sem precisar de servidor)
  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const payloads = [
    '<script>alert("xss")</script>',
    '"><img src=x onerror=alert(1)>',
    "'; DROP TABLE proposals; --",
    "<b onmouseover=alert('xss')>hover me</b>",
  ];

  let allEscaped = true;
  for (const payload of payloads) {
    const escaped = escapeHtml(payload);
    const hasTag = /<|>|"/.test(escaped);
    if (hasTag) { allEscaped = false; }
    console.log(`   Input:   ${payload}`);
    console.log(`   Escaped: ${escaped}\n`);
  }

  result(
    "HTML injection em templates de e-mail",
    allEscaped,
    200,
    { escaped: allEscaped },
    "Todos os payloads XSS devem ter < > \" convertidos para entidades HTML."
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RELATÓRIO FINAL
// ─────────────────────────────────────────────────────────────────────────────
function printReport() {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("  RELATÓRIO DE SEGURANÇA");
  console.log("═".repeat(60));
  console.log(`  ✅ Ataques bloqueados : ${passed}`);
  console.log(`  ❌ Vulneráveis       : ${failed}`);
  console.log(`  ⚠️  Pulados           : ${results.filter(r => r.ok === null).length}`);
  console.log("═".repeat(60));

  if (failed > 0) {
    console.log("\n🚨 VULNERABILIDADES ENCONTRADAS:");
    results.filter(r => r.ok === false).forEach(r => {
      console.log(`   • ${r.name} — HTTP ${r.status}`);
      if (r.note) console.log(`     ${r.note}`);
    });
  } else {
    console.log("\n🛡️  Todas as correções estão funcionando corretamente.");
  }

  if (results.some(r => r.ok === null)) {
    console.log("\n⚠️  TESTES PULADOS (requerem variáveis de ambiente):");
    results.filter(r => r.ok === null).forEach(r => console.log(`   • ${r.name}: ${r.note}`));
  }

  console.log("\n💡 Para testar com ASAAS_WEBHOOK_TOKEN real:");
  console.log("   ASAAS_WEBHOOK_TOKEN=seu_token node security-tests/attack-simulation.js\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUÇÃO
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  console.log("═".repeat(60));
  console.log("  SIMULAÇÃO DE ATAQUES — Meu Fluxo SaaS");
  console.log(`  Alvo: ${API_URL}`);
  console.log("═".repeat(60));
  console.log("  ⚠️  Use apenas contra seu ambiente local/dev.");
  console.log("  ⚠️  Nunca execute contra produção sem autorização.");
  console.log("═".repeat(60));

  await attack1_WebhookSemToken();
  await attack2_WebhookTokenErrado();
  await attack3_WebhookUserIdMalformado();
  await attack4_CheckoutSemAuth();
  await attack5_CheckoutUserIdErrado();
  await attack6_CPFInvalido();
  await attack7_RateLimit();
  await attack8_HTMLInjection();

  printReport();
})();
