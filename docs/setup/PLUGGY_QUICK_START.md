# Pluggy - Quick Start Local

## Pré-requisitos

1. ✅ Variáveis de ambiente carregadas (`.env`)
2. ✅ Backend rodando (`npm run dev` ou `npx ts-node server.ts`)
3. ✅ Frontend rodando (`npm run dev`)
4. ✅ PocketBase com coleção `pluggy_connections` criada

---

## 1️⃣ Criar Coleção PocketBase

**Admin:** https://pocketbase-production-d5ae.up.railway.app/_/

1. Ir a **Collections**
2. Criar nova collection: `pluggy_connections`
3. Adicionar os 7 campos conforme `PLUGGY_SETUP.md`
4. Aplicar RLS rules
5. Salvar

---

## 2️⃣ Iniciar o Backend

```bash
# Terminal 1
cd simulador-financeiro-saas
npx ts-node server.ts
```

Esperado:
```
✅ Server running on http://localhost:3001
📍 Pluggy routes at http://localhost:3001/api/pluggy
```

---

## 3️⃣ Iniciar o Frontend

```bash
# Terminal 2
npm run dev
```

Esperado:
```
VITE v... ready in XXX ms
Local: http://localhost:5173
```

---

## 4️⃣ Testar Fluxo Completo

### Opção A: Via Dashboard UI

1. Abrir http://localhost:5173
2. Fazer login (ou cadastro)
3. Ir a **Fluxo de Caixa** → botão "Conectar Banco"
4. Escolher **"✅ Pluggy (Recomendado)"**
5. Clicar **"Conectar Conta Pluggy"**
6. Widget abre
7. Selecionar um banco (ex: Itaú, Nubank, etc.)
8. Usar credenciais **sandbox**:
   - CPF: `12345678900` (ou qualquer válido)
   - Senha: qualquer coisa
9. Aprovar acesso
10. Contas importadas ✅

### Opção B: Via curl (Backend only)

```bash
# 1. Create connect token
curl -X POST http://localhost:3001/api/pluggy/create-connect-token \
  -H "Content-Type: application/json" \
  -d '{"userId": "seu_user_id_aqui"}'

# Retorna:
# {"access_token": "eyJ...", "expires_in": 3600}

# 2. Sync accounts (após auth no widget)
curl -X POST http://localhost:3001/api/pluggy/sync-accounts \
  -H "Content-Type: application/json" \
  -d '{"userId": "seu_user_id_aqui", "institutionId": "itau"}'

# Retorna:
# {"success": true, "message": "Accounts synced successfully"}

# 3. Get accounts
curl "http://localhost:3001/api/pluggy/accounts?userId=seu_user_id_aqui"

# Retorna lista de contas (inicialmente vazio, preenchido após widget)
```

---

## 🧪 Troubleshooting

### "Pluggy Connect widget not loaded"
- Verificar se `https://cdn.pluggy.ai/connect/v2/index.js` está acessível
- Abrir DevTools (F12) → Console para ver erros

### "Failed to create connect token"
- Verificar se `PLUGGY_CLIENT_ID` e `PLUGGY_CLIENT_SECRET` estão em `.env`
- Verificar se backend está rodando na porta 3001
- Ver logs do backend: `[Pluggy] Error creating connect token: ...`

### "User not authenticated"
- Fazer login no app antes de tentar conectar banco
- Verificar se `user.id` está sendo passado corretamente

### PocketBase `pluggy_connections` vazio após sucesso
- Verificar RLS rules na coleção
- Verificar se user_id está correto
- Ver erro_message da coleção (se houver)

---

## ✅ Checklist de Teste

- [ ] Backend inicia sem erros
- [ ] Frontend carrega na porta 5173
- [ ] Login funciona
- [ ] Botão "Conectar Banco" visível no Dashboard
- [ ] Seletor de bancos mostra Pluggy como opção
- [ ] Widget Pluggy abre ao clicar
- [ ] Widget aceita credenciais sandbox
- [ ] Após sucesso, dados salvos em `pluggy_connections`
- [ ] Console sem errors (F12 → Console)

---

## 🚀 Próximo Passo

Após validar que funciona:
1. Integrar sincronismo de transações
2. Testar com dados reais
3. Depois, rotacionar credenciais (CRITICAL SECURITY)
4. Deploy para produção
