require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const checkoutRouter = require("./routes/checkout");
const webhookRouter = require("./routes/webhook");
const verifyPaymentRouter = require("./routes/verifyPayment");
const checkPaymentByUserRouter = require("./routes/checkPaymentByUser");
const contactRouter = require("./routes/contact");

const app = express();

app.set("trust proxy", 1);

// Healthcheck antes de qualquer middleware
app.get("/health", (req, res) => res.json({ status: "ok" }));

// HTTPS redirect em produção
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
  max: 30,
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
    "https://simulador-financeiro-saas.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// ── API routes ANTES do express.static ───────────────────────────────────────
app.use("/api/contact", contactLimiter, contactRouter);
app.use("/checkout", checkoutLimiter, checkoutRouter);
app.use("/webhook", webhookRouter);
app.use("/verify-payment", verifyPaymentRouter);
app.use("/check-payment-by-user", checkPaymentByUserRouter);

// ── Frontend estático e SPA fallback ─────────────────────────────────────────
const frontendPath = path.join(__dirname, "../../dist");
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) res.status(500).json({ error: "Could not load frontend" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`API rodando na porta ${PORT}`));
