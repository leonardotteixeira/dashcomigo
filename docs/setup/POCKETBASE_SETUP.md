# 🏦 PocketBase Setup for Plaid Integration

Este guia mostra como criar as collections necessárias no PocketBase para a integração com Plaid.

---

## 📋 Collections a Criar

### 1. **plaid_connections**

Armazena as conexões bancárias dos usuários.

**Campo** | **Tipo** | **Obrigatório** | **Descrição**
---|---|---|---
`id` | ID (auto) | ✅ | ID único
`user_id` | Relation | ✅ | Referência para profiles
`item_id` | Text (único) | ✅ | ID do item no Plaid
`access_token` | Text (encriptado) | ✅ | Token de acesso Plaid
`institution_name` | Text | ❌ | Nome do banco (ex: "Nubank")
`institution_id` | Text | ❌ | ID da instituição no Plaid
`connected_at` | DateTime | ✅ | Data de conexão
`last_sync` | DateTime | ❌ | Última sincronização
`status` | Select | ✅ | Estado: active, revoked, error
`error_message` | Text | ❌ | Mensagem de erro (se houver)

---

## 🖱️ Como Criar via Admin PocketBase

### **Passo 1: Acessar Admin**

1. Abra: `https://seu-pocketbase.com/_/`
2. Faça login com credenciais

### **Passo 2: Criar Collection**

1. Clique em **"New collection"**
2. Nome: `plaid_connections`
3. Descrição: "Conexões bancárias via Plaid"
4. Salve

### **Passo 3: Adicionar Campos**

Clique em cada campo abaixo e configure:

#### **1. user_id** (Relation)
- Campo: `user_id`
- Tipo: Relation
- Relacionado com: `profiles`
- Obrigatório: SIM
- Display fields: `email`, `name`

#### **2. item_id** (Text)
- Campo: `item_id`
- Tipo: Text
- Obrigatório: SIM
- Unique: SIM
- Pattern: `.+` (não vazio)

#### **3. access_token** (Text)
- Campo: `access_token`
- Tipo: Text
- Obrigatório: SIM
- Encrypt: SIM ⚠️ (importante!)

#### **4. institution_name** (Text)
- Campo: `institution_name`
- Tipo: Text
- Obrigatório: NÃO
- Example: "Nubank"

#### **5. institution_id** (Text)
- Campo: `institution_id`
- Tipo: Text
- Obrigatório: NÃO

#### **6. connected_at** (DateTime)
- Campo: `connected_at`
- Tipo: DateTime
- Obrigatório: SIM
- Default: `@now`

#### **7. last_sync** (DateTime)
- Campo: `last_sync`
- Tipo: DateTime
- Obrigatório: NÃO

#### **8. status** (Select)
- Campo: `status`
- Tipo: Select
- Opções: `active`, `revoked`, `error`
- Default: `active`
- Obrigatório: SIM

#### **9. error_message** (Text)
- Campo: `error_message`
- Tipo: Text
- Obrigatório: NÃO
- Validação: Opcional

---

## 🔒 Adicionar Índices (Optional)

No PocketBase, você pode criar índices para melhor performance:

```sql
-- No SQL Editor do PocketBase Admin:
CREATE INDEX idx_plaid_user_id ON plaid_connections(user_id);
CREATE INDEX idx_plaid_status ON plaid_connections(status);
CREATE INDEX idx_plaid_item_id ON plaid_connections(item_id);
```

---

## 🔐 Rules de Acesso (RLS)

### **Create Rule:**
```
@request.auth.id != '' && @request.data.user_id = @request.auth.id
```
(Usuário só pode criar conexões para si mesmo)

### **Read Rule:**
```
user_id = @request.auth.id
```
(Usuário só vê suas próprias conexões)

### **Update Rule:**
```
user_id = @request.auth.id
```
(Usuário só edita suas próprias conexões)

### **Delete Rule:**
```
user_id = @request.auth.id
```
(Usuário só deleta suas próprias conexões)

---

## 📝 Também Precisa Atualizar

### **transactions collection**

Adicione estes campos (se não existir):

Campo | Tipo | Descrição
---|---|---
`plaid_id` | Text | ID único da transação no Plaid
`pf_pj_type` | Select | Classificação: PF, PJ, misto
`pf_pj_confidence` | Number | 0-100, confiança da classificação
`pf_pj_suggested_by` | Select | Quem sugeriu: user, ai, plaid, rule

---

## ✅ Checklist

- [ ] Criar collection `plaid_connections`
- [ ] Adicionar campo `user_id` (Relation)
- [ ] Adicionar campo `item_id` (Text, único)
- [ ] Adicionar campo `access_token` (Text, encriptado)
- [ ] Adicionar campo `institution_name` (Text)
- [ ] Adicionar campo `institution_id` (Text)
- [ ] Adicionar campo `connected_at` (DateTime)
- [ ] Adicionar campo `last_sync` (DateTime)
- [ ] Adicionar campo `status` (Select)
- [ ] Adicionar campo `error_message` (Text)
- [ ] Configurar RLS (Row-Level Security)
- [ ] Atualizar campos em `transactions` (se não existir)
- [ ] Testar conexão

---

## 🧪 Teste

Após criar, teste assim:

```bash
# Via cURL
curl -X POST http://localhost:8090/api/collections/plaid_connections/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "user_id": "user123",
    "item_id": "item_xyz",
    "access_token": "access_xyz",
    "institution_name": "Nubank",
    "status": "active"
  }'
```

---

## 🚀 Próximo Passo

Depois de criar as collections, você pode:

1. Testar o componente PlaidLink no Dashboard
2. Fazer login com uma conta
3. Clicar em "Conectar Banco"
4. Usar credenciais de teste Plaid
5. Ver transações sincronizadas

---

**Está tudo pronto? Vamos testar!** 🎉
