export async function GET(request: Request) {
  try {
    const webhookSecret = process.env.VITE_WEBHOOK_SECRET;

    return new Response(
      JSON.stringify({
        message: "✅ API is working!",
        hasWebhookSecret: !!webhookSecret,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
