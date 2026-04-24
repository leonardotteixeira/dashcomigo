const express = require("express");
const router = express.Router();

const SYSTEM_PROMPT = `Você é um consultor financeiro especialista em MEI e pequenas empresas brasileiras.

Analise os dados financeiros fornecidos e gere um insight diário personalizado.

## REGRAS

Retorne EXCLUSIVAMENTE um JSON válido com esta estrutura:
{
  "titulo": "string — título curto e direto (máx 8 palavras)",
  "resumo": "string — análise principal em 2-3 frases diretas e acionáveis",
  "alerta": "string ou null — alerta específico se houver algo preocupante",
  "sugestoes": ["string", "string", "string"] — exatamente 3 sugestões concretas e práticas,
  "humor": "positivo" | "neutro" | "alerta"
}

## TOM E ESTILO

- Direto ao ponto, sem enrolação
- Use dados reais para personalizar (cite os valores)
- Sugestões devem ser ações que o usuário pode fazer HOJE
- Português do Brasil, linguagem acessível
- Nunca genérico demais — sempre referir os números recebidos

## EXEMPLOS DE QUALIDADE

Ruim: "Continue monitorando suas finanças"
Bom: "Suas despesas cresceram R$430 vs mês passado — revise fornecedores recorrentes"

Ruim: "Tente economizar mais"
Bom: "Com saldo de R$2.340, você tem 23 dias de reserva — meta ideal é 60 dias"`;

function fmtBRL(v) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(Number(v) || 0);
}

// POST /daily-insight
router.post("/", async (req, res) => {
  const {
    saldoAtual = 0,
    monthReceitas = 0,
    monthDespesas = 0,
    monthLucro = 0,
    receitasGrowthPct = 0,
    despesasGrowthPct = 0,
    totalTransacoes = 0,
    userName = "usuário",
  } = req.body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "Serviço de IA não configurado." });
  }

  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const userMessage = `
Dados financeiros de ${userName} — ${hoje}:

- Saldo atual: ${fmtBRL(saldoAtual)}
- Receitas do mês: ${fmtBRL(monthReceitas)} (${receitasGrowthPct >= 0 ? "+" : ""}${Number(receitasGrowthPct).toFixed(1)}% vs mês anterior)
- Despesas do mês: ${fmtBRL(monthDespesas)} (${despesasGrowthPct >= 0 ? "+" : ""}${Number(despesasGrowthPct).toFixed(1)}% vs mês anterior)
- Lucro líquido do mês: ${fmtBRL(monthLucro)}
- Total de transações registradas: ${totalTransacoes}

Gere o insight diário personalizado.
`.trim();

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("[dailyInsight] Anthropic error:", err);
      return res.status(502).json({ error: "Erro na API de IA." });
    }

    const data = await response.json();
    const raw = data?.content?.[0]?.text || "";
    const jsonStr = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("[dailyInsight] JSON parse error. Raw:", raw);
      return res.status(500).json({ error: "Resposta da IA inválida." });
    }

    return res.json({
      titulo: parsed.titulo || "Análise do Dia",
      resumo: parsed.resumo || "",
      alerta: parsed.alerta || null,
      sugestoes: Array.isArray(parsed.sugestoes) ? parsed.sugestoes.slice(0, 3) : [],
      humor: parsed.humor || "neutro",
      geradoEm: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[dailyInsight] Erro:", err.message);
    return res.status(500).json({ error: "Erro interno." });
  }
});

module.exports = router;
