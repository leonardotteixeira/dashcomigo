const PocketBase = require("pocketbase/cjs");

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!POCKETBASE_URL) {
  console.error("ERRO FATAL: POCKETBASE_URL é obrigatório.");
  process.exit(1);
}

const pb = new PocketBase(POCKETBASE_URL);

// Autenticar como admin para operações de backend
async function ensureAdmin() {
  if (!pb.authStore.isValid) {
    try {
      await pb.collection("_superusers").authWithPassword(
        POCKETBASE_ADMIN_EMAIL || "admin@bubuya.com",
        POCKETBASE_ADMIN_PASSWORD || "Admin123456!"
      );
    } catch (error) {
      console.error("Erro ao autenticar como admin:", error.message);
    }
  }
}

module.exports = { pb, ensureAdmin };
