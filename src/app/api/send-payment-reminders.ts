/**
 * Endpoint: POST /api/send-payment-reminders
 * Descrição: Verifica e envia lembretes de cobrança automáticos
 *
 * Headers obrigatórios:
 * - Authorization: Bearer WEBHOOK_SECRET (definir em variável de ambiente)
 *
 * Resposta:
 * {
 *   success: boolean,
 *   emailsSent: number,
 *   errors?: string[]
 * }
 */

import { sendPaymentReminders } from "../utils/sendPaymentReminders";

export async function POST(request: Request) {
  try {
    // 1. Validar webhook secret
    const authHeader = request.headers.get("authorization");
    const webhookSecret = process.env.VITE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("❌ VITE_WEBHOOK_SECRET não está configurado");
      return new Response(
        JSON.stringify({ error: "Webhook secret não configurado" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authorization header ausente" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.substring("Bearer ".length);

    if (token !== webhookSecret) {
      console.warn("❌ Token webhook inválido");
      return new Response(
        JSON.stringify({ error: "Token inválido" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Executar função
    console.log("✅ Token validado. Executando sendPaymentReminders...");
    const result = await sendPaymentReminders();

    // 3. Retornar resultado
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erro no endpoint:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
