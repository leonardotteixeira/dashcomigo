const axios = require("axios");

const isSandbox = process.env.ASAAS_SANDBOX === "true";
const baseURL = isSandbox
  ? "https://sandbox.asaas.com/api/v3"
  : "https://www.asaas.com/api/v3";

const asaas = axios.create({
  baseURL,
  headers: {
    "access_token": process.env.ASAAS_API_KEY,
    "Content-Type": "application/json"
  }
});

module.exports = asaas;
