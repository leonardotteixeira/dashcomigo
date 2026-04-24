const express = require("express");
const router = express.Router();

// ── Prompt de produção ────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Você é um especialista em propostas comerciais e contratos para prestadores de serviços brasileiros.

Seu objetivo é transformar dados simples em um documento completo, utilizável imediatamente, sem necessidade de edição.

## REGRAS DE SAÍDA

Você deve retornar EXCLUSIVAMENTE um JSON válido com a seguinte estrutura:

{
  "descricaoMelhorada": "string — descrição do serviço reescrita de forma profissional (2-4 frases)",
  "escopoItens": ["string", "string", ...],
  "documentoTexto": "string — documento completo formatado"
}

Nada além do JSON. Sem texto extra, sem markdown, sem explicações.

## REGRAS DE CATALOGAÇÃO

Antes de gerar, analise mentalmente:
- Categoria do serviço (desenvolvimento, marketing, design, consultoria, construção, etc.)
- Entregáveis concretos a partir da descrição
- Tipo de cobrança (projeto fixo, recorrente, por etapa)

Se a descrição estiver vaga, reorganize com base no nome do serviço e contexto inferido.
Nunca use texto genérico como "serviços profissionais" sem detalhar o que são.

## LINGUAGEM

- Português do Brasil formal mas acessível
- Sem juridiquês excessivo
- Tom: profissional, direto, confiante
- Sempre nomear o cliente pelo nome fornecido
- Sempre nomear o serviço pelo nome fornecido

## GERAÇÃO DO DOCUMENTO

### SE TIPO = "orcamento":

Gere um orçamento comercial com esta estrutura exata no campo "documentoTexto":

PROPOSTA COMERCIAL
Data: {data_atual}
Validade: {data_validade}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARA
{nome_cliente}
{email_cliente}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOBRE O PROJETO
{nome_servico}

{descricaoMelhorada — redija de forma profissional e específica}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESCOPO DE ENTREGA

{lista de entregáveis específicos com bullet points (•), mínimo 4 itens, baseados no serviço}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRAZO
{prazo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INVESTIMENTO
Valor Total: {valor_formatado}
Condições: {condicoes_pagamento_formatadas}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRÓXIMOS PASSOS
Para aprovar esta proposta, responda este e-mail confirmando sua concordância com os termos acima.
Após confirmação, enviaremos as instruções para o início do projeto.

DashComigo — dashcomigo.com.br

---

### SE TIPO = "contrato":

Gere um contrato com cláusulas jurídicas reais no campo "documentoTexto":

CONTRATO DE PRESTAÇÃO DE SERVIÇOS
Data: {data_atual}
Número: {ano}/{hash_curto_do_nome_cliente}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARTES

CONTRATANTE: {nome_cliente}, doravante denominado CONTRATANTE.
Contato: {email_cliente}

CONTRATADO: O prestador de serviços responsável por este contrato, doravante denominado CONTRATADO.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLÁUSULA 1 — OBJETO

O presente contrato tem como objeto a prestação de serviços de {nome_servico}, conforme descrito a seguir:

{descricaoMelhorada}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLÁUSULA 2 — ESCOPO E ENTREGÁVEIS

O CONTRATADO se compromete a entregar:

{lista de entregáveis numerados (1., 2., etc.), mínimo 4 itens, específicos para o serviço}

Alterações fora do escopo acima serão orçadas separadamente, mediante aprovação prévia do CONTRATANTE.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLÁUSULA 3 — PRAZO

O prazo de entrega é de {prazo}, contado a partir da data de recebimento do pagamento inicial ou da assinatura deste contrato, o que ocorrer primeiro.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLÁUSULA 4 — VALOR E FORMA DE PAGAMENTO

O valor total dos serviços é de {valor_formatado}.

Condições: {condicoes_pagamento_formatadas}

O não pagamento nas datas acordadas implicará:
• Multa de 2% sobre o valor em aberto
• Juros de 1% ao mês (pro rata die)
• Suspensão dos serviços até regularização

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLÁUSULA 5 — OBRIGAÇÕES DAS PARTES

DO CONTRATADO:
• Executar os serviços com qualidade e dentro do prazo estabelecido
• Comunicar imediatamente qualquer impedimento ou atraso
• Manter sigilo sobre informações confidenciais do CONTRATANTE

DO CONTRATANTE:
• Fornecer informações, acessos e materiais necessários à execução
• Efetuar os pagamentos nos prazos acordados
• Revisar e aprovar entregas em até 5 dias úteis

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLÁUSULA 6 — PROPRIEDADE INTELECTUAL

Os direitos sobre os materiais produzidos serão transferidos integralmente ao CONTRATANTE após o pagamento integral do valor contratado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLÁUSULA 7 — RESCISÃO

Qualquer parte pode rescindir este contrato mediante aviso prévio de 15 (quinze) dias. Em caso de rescisão por parte do CONTRATANTE após o início dos serviços, será devido o pagamento proporcional ao trabalho realizado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLÁUSULA 8 — FORO

As partes elegem o foro da comarca do CONTRATADO para dirimir quaisquer controvérsias decorrentes deste contrato, com renúncia a qualquer outro, por mais privilegiado que seja.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{nome_cliente}
CONTRATANTE
Data: {data_atual}

___________________________
CONTRATADO
Data: {data_atual}

---

## ESCOPO (escopoItens)

Para o campo escopoItens, retorne uma lista de strings específicas para o serviço.
Exemplos de qualidade:
- "Levantamento de requisitos e briefing inicial (até 3 reuniões)"
- "Desenvolvimento do layout nas telas: Home, Sobre, Serviços e Contato"
- "Integração com WhatsApp Business via botão flutuante"
- "Entrega dos arquivos-fonte em formato editável"
- "Suporte técnico pós-entrega por 15 dias"

NÃO use itens genéricos como "Desenvolvimento e implementação" sem especificar o quê.`;

// ── Helpers de formatação ─────────────────────────────────────────────────────
function fmtBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function fmtCondicoes(cond, valor) {
  const v = Number(valor) || 0;
  if (cond === "integral") return `À vista: ${fmtBRL(v)}`;
  if (cond === "50-50")
    return `50% na assinatura (${fmtBRL(v * 0.5)}) + 50% na entrega (${fmtBRL(v * 0.5)})`;
  if (cond === "30-70")
    return `30% na assinatura (${fmtBRL(v * 0.3)}) + 70% na entrega (${fmtBRL(v * 0.7)})`;
  if (cond === "3x")
    return `3x de ${fmtBRL(v / 3)} sem juros`;
  return cond;
}

function fmtDate(d) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function fmtDataValidade(dias) {
  const d = new Date();
  d.setDate(d.getDate() + Number(dias || 7));
  return fmtDate(d);
}

// ── POST /generate-proposal ───────────────────────────────────────────────────
router.post("/", async (req, res) => {
  const {
    tipo = "orcamento",
    template = "basico",
    nomeCliente,
    emailCliente,
    nomeServico,
    descricao,
    valor,
    prazo,
    condicoesPagamento,
    validade,
  } = req.body;

  if (!nomeCliente || !nomeServico) {
    return res.status(400).json({ error: "nomeCliente e nomeServico são obrigatórios." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "Serviço de IA não configurado." });
  }

  const userMessage = `
Gere um documento de ${tipo === "contrato" ? "CONTRATO" : "ORÇAMENTO"} com os seguintes dados:

- Nome do cliente: ${nomeCliente}
- Email do cliente: ${emailCliente || "não informado"}
- Nome do serviço: ${nomeServico}
- Descrição: ${descricao || "não informada — infira com base no nome do serviço"}
- Valor total: ${fmtBRL(valor)}
- Prazo de entrega: ${prazo || "a combinar"}
- Condições de pagamento: ${fmtCondicoes(condicoesPagamento, valor)}
- Validade da proposta: ${fmtDataValidade(validade)} (${validade || 7} dias)
- Data atual: ${fmtDate(new Date())}
- Template: ${template}

Retorne apenas o JSON no formato especificado.
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
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("[generateProposal] Anthropic error:", err);
      return res.status(502).json({ error: "Erro na API de IA.", detail: err?.error?.message });
    }

    const data = await response.json();
    const raw = data?.content?.[0]?.text || "";

    // Parse JSON robusto — remove eventuais blocos de código
    const jsonStr = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("[generateProposal] JSON parse error:", parseErr.message, "\nRaw:", raw);
      return res.status(500).json({ error: "Resposta da IA inválida. Tente novamente." });
    }

    // Validar campos esperados
    if (!parsed.documentoTexto || !Array.isArray(parsed.escopoItens)) {
      return res.status(500).json({ error: "Estrutura de resposta inesperada da IA." });
    }

    return res.json({
      descricaoMelhorada: parsed.descricaoMelhorada || "",
      escopoItens: parsed.escopoItens || [],
      documentoTexto: parsed.documentoTexto || "",
    });
  } catch (err) {
    console.error("[generateProposal] Erro:", err.message);
    return res.status(500).json({ error: "Erro interno ao gerar proposta." });
  }
});

module.exports = router;
