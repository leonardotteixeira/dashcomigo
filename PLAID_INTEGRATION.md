# 🏦 Plaid Integration - Open Finance Setup

Este documento explica como usar a integração do Plaid para importar transações bancárias automaticamente no Dashcomigo.

---

## 📋 O Que Você Ganhar

✅ **Importar transações automaticamente** do banco do usuário
✅ **PF/PJ classificação automática** das transações importadas
✅ **Saldo em tempo real** do banco
✅ **Suporte para múltiplos bancos** (Itaú, Bradesco, Nubank, etc)
✅ **Zero custo no Sandbox** (testes gratuitos)

---

## 🔧 Arquivos Criados

```
├── src/lib/plaid.ts              # Funções de integração Plaid
├── src/app/components/PlaidLink.tsx  # Componente React com botão
├── api/plaid.ts                  # Backend routes
└── PLAID_INTEGRATION.md           # Este arquivo
```

---

## 🚀 Como Usar

### **1. Instalar Dependências**

```bash
npm install react-plaid-link plaid
```

### **2. Variáveis de Ambiente** (Já feito!)

```env
VITE_PLAID_CLIENT_ID=69e632d2200265000d4ed33a
PLAID_SECRET=0343fd8aedea807b0b74b4e0f31098
```

### **3. Usar o Componente no React**

Coloque o botão em um local da sua escolha (ex: Dashboard):

```tsx
import { PlaidLink } from './components/PlaidLink';

export function Dashboard() {
  return (
    <div>
      <h1>Meu Dashboard</h1>
      
      {/* Botão para conectar banco */}
      <PlaidLink 
        onSuccess={() => {
          console.log('Banco conectado!');
          // Recarregar transações
        }}
        onError={(error) => {
          console.error('Erro:', error);
        }}
      />
    </div>
  );
}
```

### **4. Setup Backend** (Para Node.js/Express)

Se está usando Express, adicione as rotas:

```typescript
import express from 'express';
import * as plaid from '../api/plaid';

const app = express();

// Rotas Plaid
app.post('/api/plaid/create-link-token', plaid.createLinkToken);
app.post('/api/plaid/exchange-token', plaid.exchangeToken);
app.post('/api/plaid/sync-transactions', plaid.syncTransactions);
app.get('/api/plaid/accounts', plaid.getAccounts);
app.post('/api/plaid/disconnect', plaid.disconnect);
```

---

## 📊 Fluxo Completo

```
Usuário abre Dashboard
    ↓
Clica "Conectar Banco (Open Finance)"
    ↓
Plaid abre modal para selecionar banco
    ↓
Usuário escolhe seu banco e faz login
    ↓
Plaid retorna public_token
    ↓
Backend troca por access_token
    ↓
Backend sincroniza 6 meses de transações
    ↓
Transações aparecem no Fluxo de Caixa
    ↓
PF/PJ classifica automaticamente
    ↓
Dashboard atualiza em tempo real
```

---

## 🧪 Testar no Sandbox

No Plaid Sandbox, use estas credenciais de teste:

```
Banco: "Plaid Checking"
Usuário: user_good
Senha: pass_good
```

Isso cria contas fake com transações de exemplo.

---

## 📁 Estrutura do Banco de Dados

### **Collection: plaid_connections**

```
- id (primary)
- user_id (foreign key to profiles)
- item_id (Plaid item ID)
- access_token (encrypted! ⚠️)
- connected_at (timestamp)
- last_sync (timestamp)
- status (active, revoked, error)
```

### **Fields no transactions (já existem)**

```
- plaid_id (unique identifier da Plaid)
- pf_pj_type (auto-classificado: PF ou PJ)
- pf_pj_confidence (75 = medium, auto-imported)
- pf_pj_suggested_by (mostra que veio de Plaid)
```

---

## 🔐 Segurança

### **NÃO FAZER ❌**
- ❌ Guardar access_token em localStorage
- ❌ Enviar access_token ao cliente
- ❌ Compartilhar credenciais Plaid publicamente
- ❌ Usar production com sandbox keys

### **SIM FAZER ✅**
- ✅ Guardar access_token no servidor (encrypted)
- ✅ Use `PLAID_SECRET` só no backend
- ✅ Rotacione secrets regularmente
- ✅ Use HTTPS em produção
- ✅ Implemente rate limiting

---

## 📊 Exemplo: Importação de Transações

Ao importar, o sistema cria transações assim:

```javascript
{
  user_id: 'abc123',
  plaid_id: 'txn_xyz789',          // ID único da Plaid
  valor: 150.50,
  tipo: 'saida',
  categoria: 'Alimentação',
  data: '2024-01-15',
  descricao: 'MERCADO XYZ',
  pf_pj_type: 'PF',                // Auto-classificado
  pf_pj_confidence: 75,            // Medium confidence
  pf_pj_suggested_by: 'plaid',    // Marca origem
}
```

---

## 🚨 Troubleshooting

### **Erro: "Failed to create link token"**
- ❌ CLIENT_ID ou SECRET incorretos
- ✅ Verifica `.env.local`
- ✅ Reinicia o servidor

### **Erro: "No Plaid connection found"**
- ❌ Usuário não conectou banco ainda
- ✅ Clica no botão "Conectar Banco"
- ✅ Completa o fluxo do Plaid

### **Transações não sincronizam**
- ❌ Access token expirou
- ✅ Desconecta e conecta de novo
- ✅ Verifica logs do backend

### **Erro 429 (Rate Limit)**
- ❌ Muitas requisições
- ✅ Aguarde antes de tentar novamente
- ✅ Implemente backoff exponencial

---

## 💰 Custo

| Cenário | Custo |
|---------|-------|
| **Sandbox (testes)** | **R$ 0** ✅ |
| **Production (1 conexão)** | ~R$ 1-2/mês |
| **Production (100 conexões)** | ~R$ 200/mês |

---

## 🔄 Sincronização Automática

Para sincronizar automaticamente a cada dia:

```typescript
// Cron job (use node-cron ou similar)
import cron from 'node-cron';

// Toda noite às 02:00
cron.schedule('0 2 * * *', async () => {
  const users = await pb.collection('users').getFullList();
  
  for (const user of users) {
    try {
      await syncTransactions({ body: { userId: user.id } }, {});
    } catch (error) {
      console.error('Sync failed for user:', user.id, error);
    }
  }
});
```

---

## 📚 Documentação

- [Plaid Docs](https://plaid.com/docs)
- [Plaid Link Guide](https://plaid.com/docs/link)
- [Transactions API](https://plaid.com/docs/transactions)
- [Brazil Open Banking](https://plaid.com/docs/transactions/open-banking-brazil)

---

## 🎯 Próximas Fases

### **Fase 1: Prototipagem** (VOCÊ ESTÁ AQUI)
- ✅ Integração Plaid
- ✅ Sandbox testes
- ⏳ Sincronização manual

### **Fase 2: Automação**
- [ ] Sincronização automática (daily/hourly)
- [ ] Melhorar classificação PF/PJ
- [ ] Detectar duplicatas
- [ ] Histórico de sincronização

### **Fase 3: Expansão**
- [ ] Integrar investimentos (B3)
- [ ] Integrar cartão de crédito
- [ ] Integrar empréstimos
- [ ] Dashboard com múltiplas contas

### **Fase 4: Inteligência**
- [ ] Machine Learning para PF/PJ
- [ ] Detecção de anomalias
- [ ] Previsões de fluxo
- [ ] Recomendações automáticas

---

## 🆘 Precisa de Ajuda?

1. **Teste no Sandbox**: Use credenciais fake
2. **Check logs**: Veja erros no console/backend
3. **Leia documentação**: Plaid tem guias muito bons
4. **Abra issue**: Se encontrar bug

---

## ✅ Checklist de Implementação

- [x] Criar `src/lib/plaid.ts`
- [x] Criar `src/app/components/PlaidLink.tsx`
- [x] Criar `api/plaid.ts` (referência)
- [x] Adicionar variáveis ao `.env.local`
- [ ] Instalar dependências (`npm install react-plaid-link`)
- [ ] Implementar backend routes (Node.js/Express)
- [ ] Criar collection `plaid_connections` no PocketBase
- [ ] Integrar botão no Dashboard
- [ ] Testar no Sandbox
- [ ] Deploy em production

---

**Pronto para conectar o primeiro banco? 🚀**
