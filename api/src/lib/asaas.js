const axios = require("axios");

const asaas = axios.create({
  baseURL: "https://www.asaas.com/api/v3",
  headers: {
    "access_token": process.env.ASAAS_API_KEY,
    "Content-Type": "application/json"
  }
});

module.exports = asaas;
