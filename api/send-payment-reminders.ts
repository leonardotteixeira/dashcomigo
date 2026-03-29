import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization as string;
    const webhookSecret = process.env.VITE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(500).json({ error: "Webhook secret não configurado" });
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header ausente" });
    }

    const token = authHeader.substring("Bearer ".length);

    if (token !== webhookSecret) {
      return res.status(403).json({ error: "Token inválido" });
    }

    // Test - just return success for now
    return res.status(200).json({
      success: true,
      message: "✅ Sistema de lembretes de cobrança está operacional!",
      emailsSent: 0,
      timestamp: new Date().toISOString(),
      info: "Emails serão enviados automaticamente todos os dias às 08:00 UTC (13:00 São Paulo)",
    });
  } catch (error) {
    console.error("❌ Erro:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}
