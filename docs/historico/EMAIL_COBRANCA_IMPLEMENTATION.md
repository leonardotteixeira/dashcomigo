# Email de Cobrança - Plano de Implementação

## Overview

Sistema automático que envia emails lembrando usuários para:
- Cobrar propostas aprovadas mas não pagas
- Pagar contas vencendo
- Confirmar pagamentos em atraso

---

## PASSO 1: Criar Collections no PocketBase (30 min)

### Collection: `payment_reminders`

Cria uma tabela para rastrear quais lembretes já foram enviados:

```sql
CREATE TABLE payment_reminders (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 type TEXT NOT NULL, -- 'proposal' ou 'payable'
 proposal_id TEXT,
 payable_id TEXT,
 last_sent_date DATE,
 reminder_count INT DEFAULT 0, -- máximo 3
 disabled BOOL DEFAULT FALSE,
 created DATE
)
```

**No PocketBase Admin:**
1. Vá em Collections
2. Clique + Add Collection
3. Nome: `payment_reminders`
4. Adicione campos:
 - `user_id` (Relation → profiles) - Nonempty
 - `type` (Text) - Nonempty
 - `proposal_id` (Text)
 - `payable_id` (Text)
 - `last_sent_date` (Date)
 - `reminder_count` (Number) - Default: 0
 - `disabled` (Bool) - Default: false

API Rules:
```
List: user_id = @request.auth.id
View: user_id = @request.auth.id
Create: @request.auth.id != null
Update: user_id = @request.auth.id
Delete: user_id = @request.auth.id
```

---

## PASSO 2: Criar Edge Function (1-2 horas)

### Arquivo: `supabase/functions/send-payment-reminders/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const resendApiKey = Deno.env.get("RESEND_API_KEY");

const supabase = createClient(supabaseUrl, supabaseKey);

interface PaymentReminder {
 id: string;
 user_id: string;
 type: 'proposal' | 'payable';
 proposal_id?: string;
 payable_id?: string;
 last_sent_date: string;
 reminder_count: number;
 disabled: boolean;
}

interface User {
 id: string;
 email: string;
 name: string;
}

interface Proposal {
 id: string;
 nome_servico: string;
 valor: number;
 nome_cliente: string;
 status: string;
 data_pagamento?: string;
}

interface Payable {
 id: string;
 descricao: string;
 valor: number;
 data_vencimento: string;
 status: string;
}

// Template 1: Proposta vencida
function getProposalTemplate(proposal: Proposal, user: User) {
 return {
 to: proposal.nome_cliente || user.email,
 subject: `Proposta ${proposal.nome_servico} - Ação Necessária`,
 html: `
 <h2>Olá,</h2>
 <p>Sua proposta <strong>${proposal.nome_servico}</strong> está vencida.</p>
 <p><strong>Valor:</strong> R$ ${proposal.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
 <p>Poderia confirmar se o pagamento foi realizado?</p>
 <p>Obrigado,<br>${user.name}</p>
 `,
 };
}

// Template 2: Conta vencendo em 3 dias
function getPayableTemplate(payable: Payable, user: User) {
 return {
 to: user.email,
 subject: `Conta a Pagar Próxima - ${payable.descricao}`,
 html: `
 <h2>Olá ${user.name},</h2>
 <p>Você tem uma conta vencendo em breve:</p>
 <p><strong>${payable.descricao}</strong></p>
 <p><strong>Valor:</strong> R$ ${payable.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
 <p><strong>Vencimento:</strong> ${new Date(payable.data_vencimento).toLocaleDateString('pt-BR')}</p>
 <p>Acesse sua conta para gerenciar pagamentos.</p>
 `,
 };
}

// Enviar email via Resend
async function sendEmail(emailData: any) {
 const response = await fetch("https://api.resend.com/emails", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${resendApiKey}`,
 },
 body: JSON.stringify({
 from: "cobrancas@bubuya.com.br",
 ...emailData,
 }),
 });

 return response.json();
}

// Main handler
serve(async (req) => {
 if (req.method !== "POST") {
 return new Response("Method not allowed", { status: 405 });
 }

 console.log(" Iniciando verificação de lembretes de cobrança...");

 try {
 // 1. Buscar todos os usuários
 const { data: users, error: usersError } = await supabase
 .from("profiles")
 .select("id, email, name")
 .eq("receive_payment_reminders", true); // Campo que vamos adicionar

 if (usersError) throw usersError;

 let emailsSent = 0;

 for (const user of users || []) {
 // 2. Verificar propostas vencidas
 const { data: proposals } = await supabase
 .from("proposals")
 .select("*")
 .eq("user_id", user.id)
 .eq("status", "aprovada")
 .lt("validade", new Date().toISOString().split("T")[0]); // validade < hoje

 for (const proposal of proposals || []) {
 // 3. Verificar se já enviou lembretes
 const { data: reminder } = await supabase
 .from("payment_reminders")
 .select("*")
 .eq("proposal_id", proposal.id)
 .single();

 const reminderCount = reminder?.reminder_count || 0;

 if (reminderCount < 3 && !reminder?.disabled) {
 // 4. Enviar email
 const emailData = getProposalTemplate(proposal, user);
 await sendEmail(emailData);

 // 5. Atualizar/criar reminder
 if (reminder) {
 await supabase
 .from("payment_reminders")
 .update({
 last_sent_date: new Date().toISOString().split("T")[0],
 reminder_count: reminderCount + 1,
 })
 .eq("id", reminder.id);
 } else {
 await supabase
 .from("payment_reminders")
 .insert([{
 user_id: user.id,
 type: "proposal",
 proposal_id: proposal.id,
 reminder_count: 1,
 last_sent_date: new Date().toISOString().split("T")[0],
 }]);
 }

 emailsSent++;
 console.log(` Email enviado para ${user.email} - Proposta ${proposal.id}`);
 }
 }

 // 6. Verificar contas a pagar vencendo em 3 dias
 const threeDaysFromNow = new Date();
 threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

 const { data: payables } = await supabase
 .from("payables")
 .select("*")
 .eq("user_id", user.id)
 .eq("status", "pendente")
 .lte("data_vencimento", threeDaysFromNow.toISOString().split("T")[0])
 .gte("data_vencimento", new Date().toISOString().split("T")[0]);

 for (const payable of payables || []) {
 const { data: reminder } = await supabase
 .from("payment_reminders")
 .select("*")
 .eq("payable_id", payable.id)
 .single();

 const reminderCount = reminder?.reminder_count || 0;

 if (reminderCount < 3 && !reminder?.disabled) {
 const emailData = getPayableTemplate(payable, user);
 await sendEmail(emailData);

 if (reminder) {
 await supabase
 .from("payment_reminders")
 .update({
 last_sent_date: new Date().toISOString().split("T")[0],
 reminder_count: reminderCount + 1,
 })
 .eq("id", reminder.id);
 } else {
 await supabase
 .from("payment_reminders")
 .insert([{
 user_id: user.id,
 type: "payable",
 payable_id: payable.id,
 reminder_count: 1,
 last_sent_date: new Date().toISOString().split("T")[0],
 }]);
 }

 emailsSent++;
 console.log(` Email enviado para ${user.email} - Conta ${payable.id}`);
 }
 }
 }

 console.log(` Total de ${emailsSent} emails enviados`);

 return new Response(
 JSON.stringify({ success: true, emailsSent }),
 { status: 200, headers: { "Content-Type": "application/json" } }
 );
 } catch (error) {
 console.error(" Erro:", error);
 return new Response(
 JSON.stringify({ error: error.message }),
 { status: 500, headers: { "Content-Type": "application/json" } }
 );
 }
});
```

### Deploy:
```bash
supabase functions deploy send-payment-reminders
supabase secrets set RESEND_API_KEY=re_xxxxx
```

---

## PASSO 3: Configurar Scheduler (1 hora)

### Opção A: PocketBase Cron (RECOMENDADO)

Se usar PocketBase (não Supabase), adicionar cron job:

```bash
# Executar send-payment-reminders diariamente às 08:00
pb_migrations/add_payment_reminders_cron.js
```

### Opção B: GitHub Actions (Free)

Criar arquivo: `.github/workflows/send-reminders.yml`

```yaml
name: Send Payment Reminders

on:
 schedule:
 - cron: '0 8 * * *' # 08:00 UTC (ajuste para seu timezone)

jobs:
 send-reminders:
 runs-on: ubuntu-latest
 steps:
 - name: Trigger Supabase Function
 run: |
 curl -X POST https://your-supabase.supabase.co/functions/v1/send-payment-reminders \
 -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
 -H "Content-Type: application/json"
```

---

## PASSO 4: Adicionar Campo no Profile (30 min)

### No AuthContext.tsx

Adicionar campo `receive_payment_reminders` ao User interface:

```typescript
interface User {
 // ... campos existentes
 receive_payment_reminders: boolean; // novo
}
```

### Collection `profiles` no PocketBase

Adicionar campo:
- Nome: `receive_payment_reminders`
- Tipo: Bool
- Default: `true`

---

## PASSO 5: UI - Profile Settings (1 hora)

### Arquivo: `src/app/pages/Profile.tsx`

Adicionar na seção de preferências:

```typescript
{/* Notificações */}
<div className="p-4 bg-[#1B1B1B] rounded-xl border border-white/5">
 <h3 className="font-semibold text-white mb-3">Notificações</h3>

 <label className="flex items-center gap-3 mb-4">
 <input
 type="checkbox"
 checked={receiveReminders}
 onChange={(e) => setReceiveReminders(e.target.checked)}
 className="w-4 h-4 accent-[#28A263]"
 />
 <span className="text-[#A1A1A1]">
 Receber lembretes de cobrança por email
 </span>
 </label>

 {receiveReminders && (
 <p className="text-xs text-[#686F6F]">
 Você receberá até 3 lembretes para cada proposta/conta vencida
 </p>
 )}
</div>
```

---

## PASSO 6: Histórico de Emails (Opcional - 1 hora)

### UI para ver emails enviados

Nova página: `/app/lembretes-enviados`

```typescript
// Mostrar lista de emails enviados
// Filtros: Tipo (Proposta/Conta), Data, Status
// Ação: Desabilitar futuros lembretes para um item específico
```

---

## Implementação Timeline

```
Dia 1: PocketBase Collection + campo Profile
Dia 2: Edge Function (Supabase) ou arquivo local
Dia 3: Scheduler (GitHub Actions ou Cron)
Dia 4: UI (Toggle + Histórico)
Dia 5: Testes e refinamento
```

**Total: 5 dias de trabalho**

---

## Testes

### 1. Teste Manual
```bash
# Chamar função manualmente
curl -X POST http://localhost:3000/send-payment-reminders \
 -H "Content-Type: application/json"
```

### 2. Checklist
- [ ] Edge Function envia email corretamente
- [ ] Cron job executa diariamente
- [ ] Toggle em Profile funciona
- [ ] Máximo 3 lembretes por item
- [ ] Email template renderiza corretamente
- [ ] Histórico mostra emails enviados

---

## Emails Templates (Resend)

Você já tem:
- Verificação de email
- Reset de senha
- OTP

Precisa criar 2 novos:
1. **Proposta Vencida**
2. **Conta Vencendo**

---

## Próximos Passos Após Implementar

1. Testar com dados reais
2. Ajustar horário do scheduler (seu timezone)
3. Criar variações de email (com/sem cliente, etc)
4. **DEPOIS:** Adicionar SMS opcional (Twilio)

