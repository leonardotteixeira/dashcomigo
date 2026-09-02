# 🚀 Belvo Integration - Quick Start

## ✅ O que foi feito

- ✅ Credenciais Belvo salvas em `.env.local`
- ✅ Backend routes criadas: `/api/belvo/*`
- ✅ Client library criada: `src/lib/belvo.ts`
- ✅ Componente BelvoLink criado
- ✅ Componente selector (Belvo vs Plaid) integrado ao Dashboard
- ✅ Server.ts atualizado para carregar rotas Belvo

## 📋 Próximos Passos

### 1️⃣ Criar Collection no PocketBase

**Acesse:** https://pocketbase-production-d5ae.up.railway.app/_/

1. Login com suas credenciais
2. Clique em **"New collection"**
3. Nome: `belvo_connections`
4. Descrição: "Conexões bancárias via Belvo"
5. Clique "Save & continue"

### 2️⃣ Adicionar Campos

Siga o checklist em `BELVO_SETUP.md`:

- [ ] `user_id` (Relation → profiles)
- [ ] `link_id` (Text, único)
- [ ] `connected_at` (DateTime, default @now)
- [ ] `last_sync` (DateTime, opcional)
- [ ] `status` (Select: active, revoked, error)
- [ ] `error_message` (Text, opcional)

### 3️⃣ Configurar RLS (Segurança)

Abra a collection `belvo_connections` e vá em "API Rules":

**Create:**
```
@request.auth.id != '' && @request.data.user_id = @request.auth.id
```

**Read:**
```
user_id = @request.auth.id
```

**Update:**
```
user_id = @request.auth.id
```

**Delete:**
```
user_id = @request.auth.id
```

### 4️⃣ Atualizar transactions collection

Adicione campo em `transactions`:
- Campo: `belvo_id`
- Tipo: Text
- Único: SIM
- Opcional: SIM

### 5️⃣ Testar Localmente

```bash
# Terminal 1: Backend
cd C:\Users\Leonardo\Desktop\contabil\simulador-financeiro-saas
npx ts-node server.ts

# Terminal 2: Frontend
npm run dev
```

Acesse: http://localhost:5173/app/dashboard

1. Faça login
2. Procure o card "Conectar seu Banco"
3. Clique em **"Belvo (Recomendado)"**
4. Selecione um banco para teste
5. Use credenciais de teste Belvo
6. Verifique se transações aparecem

---

## 🔑 Credenciais de Teste Belvo (Sandbox)

Para testar, use estas credenciais exemplos:

**Banco:** Nu (Nubank)
- **CPF:** 00000000191 (Pessoa Física)
- **Senha:** any_password
- **2FA:** 000000

**Banco:** ITAU (Itaú)
- **Usuário:** platfo...@hotmail.com
- **Senha:** any_password

[Mais credenciais em: https://docs.belvo.io/reference/list-of-sandbox-credentials]

---

## ❌ Troubleshooting

**Problema:** "Widget do Belvo não carregou"
- Verifique se tem permissão para carregar scripts externos
- Limpe cache: Ctrl+F5

**Problema:** "Falha ao sincronizar dados"
- Verifique logs do backend: `npx ts-node server.ts`
- Confirme credenciais Belvo estão em `.env.local`

**Problema:** "Coleção não encontrada"
- Confirme que `belvo_connections` foi criada no PocketBase
- Verifique se RLS rules estão corretas

---

## 📝 Estrutura de Dados

### Fluxo de Autenticação

```
1. User clica "Conectar Banco" 
   ↓
2. Frontend chama POST /api/belvo/create-link-token
   ↓
3. Backend cria token via Belvo API
   ↓
4. Frontend abre Widget Belvo com token
   ↓
5. User autentica na instituição bancária
   ↓
6. Widget retorna link_id ao frontend
   ↓
7. Frontend chama POST /api/belvo/sync-accounts (salva conexão)
   ↓
8. Frontend chama POST /api/belvo/sync-transactions (importa transações)
   ↓
9. Transações aparecem no Dashboard com PF/PJ
```

---

## 🎯 Verificação Final

- [ ] Collection `belvo_connections` criada no PocketBase
- [ ] Todos os 6 campos adicionados
- [ ] RLS rules configuradas
- [ ] Campo `belvo_id` adicionado em `transactions`
- [ ] Backend rodando: `npx ts-node server.ts`
- [ ] Frontend rodando: `npm run dev`
- [ ] Dashboard mostra selector (Belvo vs Plaid)
- [ ] Consegue conectar um banco via Belvo
- [ ] Transações aparecem automaticamente

---

**Tudo pronto? Manda a mensagem "feito" quando terminar o setup!** 🎉
