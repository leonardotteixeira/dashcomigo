require("dotenv").config();
const express = require("express");
const cors = require("cors");

const checkoutRouter = require("./routes/checkout");
const webhookRouter = require("./routes/webhook");

const app = express();

const corsOptions = {
  origin: [
    "https://bubuya.com.br",
    "https://www.bubuya.com.br",
    "https://simulador-financeiro-saas.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // habilita preflight para todas as rotas

app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/checkout", checkoutRouter);
app.use("/webhook", webhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
