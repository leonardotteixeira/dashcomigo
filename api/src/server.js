require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const checkoutRouter = require("./routes/checkout");
const webhookRouter = require("./routes/webhook");
const verifyPaymentRouter = require("./routes/verifyPayment");
const checkPaymentByUserRouter = require("./routes/checkPaymentByUser");
const contactRouter = require("./routes/contact");

const app = express();

// Railway usa proxy reverso — necessário para rate-limit e X-Forwarded-For funcionarem corretamente
app.set("trust proxy", 1);

// Healthcheck ANTES de qualquer middleware — Railway usa HTTP interno e não segue redirects
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Força HTTPS em produção (Railway/Vercel encaminham X-Forwarded-Proto)
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Security headers com HSTS e CSP
app.use(
  helmet({
    hsts: {
      maxAge: 31536000,       // 1 ano
      includeSubDomains: true,
      preload: true,
    },
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

// Rate limiting global: 30 requests por 15 min por IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Tente novamente em alguns minutos." },
});
app.use(globalLimiter);

// Rate limiting restrito para checkout: 5 requests por 15 min por IP
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: { error: "Limite de tentativas de checkout atingido. Tente novamente em 15 minutos." },
});

// Rate limiting para formulário de contato: 5 requests por hora por IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Limite de mensagens de contato atingido. Máximo 5 mensagens por hora." },
});

const corsOptions = {
  origin: [
    "https://dashcomigo.com.br",
    "https://www.dashcomigo.com.br",
    "https://bubuya.com.br",
    "https://www.bubuya.com.br",
    "https://dashcomigo.com.br",
    "https://www.dashcomigo.com.br",
    "https://simulador-financeiro-saas.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// Serve frontend static files
const path = require("path");
const frontendPath = path.join(__dirname, "../../dist");
app.use(express.static(frontendPath));

app.post("/api/contact", (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;
  if (!nome || !email || !assunto || !mensagem) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes" });
  }
  console.log("[Contact]", { nome, email, assunto });
  res.json({ ok: true });
});

app.use("/checkout", checkoutLimiter, checkoutRouter);
app.use("/webhook", webhookRouter);
app.use("/verify-payment", verifyPaymentRouter);
app.use("/check-payment-by-user", checkPaymentByUserRouter);
app.use("/api/contact", contactLimiter, contactRouter);

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req, res) => {
  const indexPath = path.join(frontendPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).json({ error: "Could not load frontend" });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`API rodando na porta ${PORT}`));
