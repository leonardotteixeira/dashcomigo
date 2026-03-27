require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const checkoutRouter = require("./routes/checkout");
const webhookRouter = require("./routes/webhook");

const app = express();

// Security headers
app.use(helmet());

// Rate limiting global: 100 requests por 15 min por IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Tente novamente em alguns minutos." },
});
app.use(globalLimiter);

// Rate limiting restrito para checkout: 10 requests por 15 min por IP
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Limite de tentativas de checkout atingido. Tente novamente em 15 minutos." },
});

const corsOptions = {
  origin: [
    "https://bubuya.com.br",
    "https://www.bubuya.com.br",
    "https://simulador-financeiro-saas.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/checkout", checkoutLimiter, checkoutRouter);
app.use("/webhook", webhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`API rodando na porta ${PORT}`));
