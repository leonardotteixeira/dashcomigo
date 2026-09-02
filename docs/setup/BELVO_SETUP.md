# 🏦 PocketBase Setup para Belvo Integration

Este guia mostra como criar as collections necessárias no PocketBase para a integração com Belvo.

---

## 📋 Collections a Criar

### 1. **belvo_connections**

Armazena as conexões bancárias dos usuários via Belvo.

**Campo** | **Tipo** | **Obrigatório** | **Descrição**
---|---|---|---
`id` | ID (auto) | ✅ | ID único
`user_id` | Relation | ✅ | Referência para profiles
`link_id` | Text (único) | ✅ | ID do link no Belvo
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
2. Nome: `belvo_connections`
3. Descrição: "Conexões bancárias via Belvo (Open Finance Brasil)"
4. Salve

### **Passo 3: Adicionar Campos**

#### **1. user_id** (Relation)
- Campo: `user_id`
- Tipo: Relation
- Relacionado com: `profiles`
- Obrigatório: SIM
- Display fields: `email`, `name`

#### **2. link_id** (Text)
- Campo: `link_id`
- Tipo: Text
- Obrigatório: SIM
- Unique: SIM
- Pattern: `.+` (não vazio)

#### **3. connected_at** (DateTime)
- Campo: `connected_at`
- Tipo: DateTime
- Obrigatório: SIM
- Default: `@now`

#### **4. last_sync** (DateTime)
- Campo: `last_sync`
- Tipo: DateTime
- Obrigatório: NÃO

#### **5. status** (Select)
- Campo: `status`
- Tipo: Select
- Opções: `active`, `revoked`, `error`
- Default: `active`
- Obrigatório: SIM

#### **6. error_message** (Text)
- Campo: `error_message`
- Tipo: Text
- Obrigatório: NÃO

---

## 🔒 Adicionar Índices (Optional)

```sql
-- No SQL Editor do PocketBase Admin:
CREATE INDEX idx_belvo_user_id ON belvo_connections(user_id);
CREATE INDEX idx_belvo_status ON belvo_connections(status);
CREATE INDEX idx_belvo_link_id ON belvo_connections(link_id);
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

## 📝 Atualizar transactions collection

Adicione estes campos (se não existir):

Campo | Tipo | Descrição
---|---|---
`belvo_id` | Text | ID único da transação no Belvo

Se `plaid_id` e `belvo_id` existem, você pode ter ambas as integrações.

---

## ✅ Checklist

- [ ] Criar collection `belvo_connections`
- [ ] Adicionar campo `user_id` (Relation)
- [ ] Adicionar campo `link_id` (Text, único)
- [ ] Adicionar campo `connected_at` (DateTime)
- [ ] Adicionar campo `last_sync` (DateTime)
- [ ] Adicionar campo `status` (Select)
- [ ] Adicionar campo `error_message` (Text)
- [ ] Configurar RLS (Row-Level Security)
- [ ] Adicionar campo `belvo_id` em `transactions`
- [ ] Testar conexão

---

## 🚀 Próximo Passo

Depois de criar as collections:

1. Instale as dependências: `npm install axios`
2. Reinicie o backend: `npx ts-node server.ts`
3. Teste o componente BelvoLink no Dashboard
4. Faça login com uma conta
5. Clique em "Conectar Banco"
6. Use credenciais de teste Belvo (fornecidas)
7. Ver transações sincronizadas

---

**Está tudo pronto? Vamos testar!** 🎉
