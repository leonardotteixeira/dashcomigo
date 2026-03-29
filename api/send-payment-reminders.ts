import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1. Validar webhook secret
    const authHeader = req.headers.authorization as string;
    const webhookSecret = process.env.VITE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("❌ VITE_WEBHOOK_SECRET não está configurado");
      return res.status(500).json({ error: "Webhook secret não configurado" });
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header ausente" });
    }

    const token = authHeader.substring("Bearer ".length);

    if (token !== webhookSecret) {
      console.warn("❌ Token webhook inválido");
      return res.status(403).json({ error: "Token inválido" });
    }

    // 2. Para teste, retornar sucesso
    console.log("✅ Token validado!");
    return res.status(200).json({
      success: true,
      message: "✅ Endpoint está funcionando!",
      emailsSent: 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}
