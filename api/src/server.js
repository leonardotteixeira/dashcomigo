require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { Resend } = require("resend");
const PocketBase = require("pocketbase/cjs");

const checkoutRouter = require("./routes/checkout");
const webhookRouter = require("./routes/webhook");
const verifyPaymentRouter = require("./routes/verifyPayment");
const checkPaymentByUserRouter = require("./routes/checkPaymentByUser");

const app = express();

app.set("trust proxy", 1);

app.get("/health", (req, res) => res.json({ status: "ok" }));

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

app.use(
  helmet({
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
  })
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Tente novamente em alguns minutos." },
});
app.use(globalLimiter);

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: { error: "Limite de tentativas de checkout atingido. Tente novamente em 15 minutos." },
});

const corsOptions = {
  origin: [
    "https://dashcomigo.com.br",
    "https://www.dashcomigo.com.br",
    "https://bubuya.com.br",
    "https://www.bubuya.com.br",
    "https://simulador-financeiro-saas.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// ── POST /api/contact ─────────────────────────────────────────────────────────
app.post("/api/contact", async (req, res) => {
  const { nome, email, assunto, mensagem } = req.body || {};

  if (!nome || !email || !assunto || !mensagem) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  console.log(`[Contact] ${nome} <${email}> — ${assunto}`);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "DashComigo <contato@dashcomigo.com.br>",
      to: process.env.CONTACT_EMAIL || "contato@dashcomigo.com.br",
      replyTo: email,
      subject: `[DashComigo] ${assunto} de ${nome}`,
      html: `<p><b>Nome:</b> ${nome}</p><p><b>Email:</b> ${email}</p><p><b>Assunto:</b> ${assunto}</p><p><b>Mensagem:</b><br>${mensagem}</p>`,
    });
    console.log(`[Contact] Email enviado para ${process.env.CONTACT_EMAIL}`);
  } catch (emailErr) {
    console.error("[Contact] Falha ao enviar email:", emailErr.message);
  }

  return res.json({ success: true, message: "Mensagem recebida com sucesso. Entraremos em contato em breve." });
});

// ── Outras rotas da API ───────────────────────────────────────────────────────
app.use("/checkout", checkoutLimiter, checkoutRouter);
app.use("/webhook", webhookRouter);
app.use("/verify-payment", verifyPaymentRouter);
app.use("/check-payment-by-user", checkPaymentByUserRouter);

// ── Frontend estático e SPA fallback ─────────────────────────────────────────
const frontendPath = path.join(__dirname, "../../dist");
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) res.status(500).json({ error: "Could not load frontend" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`API rodando na porta ${PORT}`));
