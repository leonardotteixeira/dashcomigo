# DashComigo — Roadmap Atualizado

> Última atualização: 2026-04-22
> Stack: React + Vite + TypeScript · PocketBase · Railway · Vercel · Asaas
> Produto: Gestão financeira para MEI e pequenas empresas no Brasil

---

## Estado Real do Produto (auditado em 2026-04-22)

### ✅ Sólido e em Produção

| Área | Detalhe |
|------|---------|
| Auth | Login, signup, Google OAuth, password reset, sessão persistente via PocketBase |
| Pagamentos | Asaas integrado com webhook, sandbox, planos R$9,90 (1º mês) / R$29,90 (recorrente) |
| FluxoCaixa | CRUD completo, filtros, PF/PJ classification, export XLSX |
| Contas a Pagar | CRUD + status (pendente/pago/vencido) + export XLSX |
| Contas a Receber | CRUD + status + export XLSX |
| Propostas | CRUD completo, limite FREE/PRO, 5 status de ciclo de vida |
| Estoque | CRUD + movimentações + alertas de estoque mínimo |
| Metas | CRUD completo (PRO only), progress tracking, histórico 6 meses |
| Relatórios | Dados reais de transações/payables/receivables, charts com Recharts |
| DAS-MEI | Cálculo com alíquotas por atividade, registra como transação |
| Simuladores | MEI/ME, Preço, Lucro — todos funcionais (Preço e Lucro são PRO) |
| Clientes/Fornecedores | CRUD completo, filtros, status ativo/inativo |
| Investimentos | Guia estático + motor de recomendação com questionário de risco |
| Onboarding | Fluxo multi-step real (skippable) |
| Perfil | Nome, telefone, CNPJ, avatar, senha — tudo salva no PocketBase |
| Feature gating | `featureAccessService.ts` centralizado, limites corretos por plano |
| Error boundary | Implementado em todas as rotas |
| PF/PJ separation | Classificação heurística com scoring de confiança |
| Design system | Tema warm green (#0E3B2E / #F4EFE6 / #EBE4D6) aplicado no Dashboard e Landing |

### ⚠️ Parcialmente Implementado

| Área | O que existe | O que falta |
|------|--------------|-------------|
| Email de cobrança | Toggle `receive_payment_reminders` no perfil; campos no schema | Scheduler, cron job, templates, lógica de disparo |
| Transações recorrentes | Campos `ehRecorrente` + `frequenciaRecorrencia` no schema | Auto-geração de próximas ocorrências |
| Bank sync (Open Finance) | Funções Pluggy + Belvo implementadas; BankConnectionSelector pronto | Feature desativada intencionalmente — backend routes precisam ser validados antes do re-enable |
| Export PDF | Botões existem na UI (Propostas, Relatórios) | Nenhuma biblioteca de geração PDF conectada |
| `pro_expires_at` | Campo existe para streak reward (30 dias trial) | Checkout Asaas não grava expiração local — depende da assinatura recorrente Asaas |

### ❌ Não Implementado

- NFS-e (botão existe na UI de propostas, sem backend)
- CSV/OFX bank statement import
- Cash Flow Forecast (projeção baseada em histórico)
- MEI annual revenue limit tracker (barra de progresso R$X / R$81.000)
- Category budget alerts (orçamento por categoria com alerta em 80%)
- Financial health score (0–100)
- PocketBase real-time subscriptions (sync entre abas)
- Paginação real nas listas (atual: `getList(1, 500)` em todos os contextos)
- Onboarding obrigatório (atualmente skippable)
- In-app changelog
- Referral program
- NPS / feedback widget

### ❗ Débito Técnico Confirmado

| Item | Risco | Ação |
|------|-------|------|
| `transactionsUsageToday` → deveria ser `transactionsUsageThisMonth` | Bug latente de contagem dupla | Renomear em AuthContext + PocketBase schema |
| `getList(1, 500)` em todos os contextos | App trava com 500+ registros | Implementar paginação cursor-based |
| Limites de plano são client-side only | Usuário pode bypassar via DevTools | Adicionar regras server-side no PocketBase |
| Railway auto-deploy via GitHub quebrado | Deploys manuais insustentáveis | Investigar watchPatterns no railway.json |
| Bloco 2 planeja "supabase/functions/" | Stack real é PocketBase — referências erradas | Reescrever planos usando PocketBase job scheduler |
| `payables`/`receivables` são coleções separadas de `transactions` | Sync one-way cria inconsistências | Avaliar migração para coleção unificada |

---

## Roadmap por Prioridade

---

### 🔴 Fase 1 — Crítico (Fazer Agora)
**Meta:** Fechar gaps que afetam usuários pagantes e sustentabilidade do produto.

#### 1.1 Email de Cobrança
**Por quê:** Feature mais pedida; concorrentes (Conta Azul, Nibo, Bling) têm. Reduz churn por esquecimento.

**Implementação:**
- Scheduled service no Railway (cron diário 08:00)
- Verificar payables com `status=pendente` e `data_vencimento <= hoje + 3 dias`
- Verificar receivables com `data_vencimento < hoje` e `status=pendente`
- Enviar via Resend (já configurado) — máximo 3 lembretes por conta
- Registrar envios em coleção `email_logs` no PocketBase

**Arquivos a criar:**
- `api/src/jobs/paymentReminders.js`
- `api/src/routes/jobs.js` (endpoint de trigger manual para testes)

**Esforço:** 3 dias

---

#### 1.2 PDF Export de Propostas
**Por quê:** Feature PRO anunciada que não funciona. Destrói confiança no momento do upgrade.

**Implementação:**
- Instalar `@react-pdf/renderer`
- Template de proposta em PDF (logo, itens, total, dados do cliente)
- Botão "Exportar PDF" em GeradorPropostas já existe — conectar à geração real

**Arquivos a modificar:**
- `src/app/pages/GeradorPropostas.tsx`
- `src/app/components/ProposalPDF.tsx` (novo)

**Esforço:** 1 dia

---

#### 1.3 MEI Annual Revenue Tracker no Dashboard
**Por quê:** Maior ansiedade do MEI. Diferencial competitivo claro.

**Implementação:**
- Somar todas as entradas do ano corrente a partir de `transactions`
- Exibir progress bar: `R$ X.XXX / R$ 81.000` com % e meses restantes
- Alertas visuais em 75% (amarelo) e 90% (vermelho)
- Card no Dashboard acima dos KPIs principais

**Arquivos a modificar:**
- `src/app/pages/Dashboard.tsx`
- `src/utils/useFinancialMetrics.ts` (adicionar `anoReceitas`)

**Esforço:** 1 dia

---

#### 1.4 Paginação nos Contextos
**Por quê:** `getList(1, 500)` é uma time bomb. Usuários com 6+ meses de uso já sofrem.

**Implementação:**
- Substituir por `getList(page, 50, ...)` com infinite scroll ou load more
- Priorizar: CashFlowContext, PayablesContext, ReceivablesContext
- Manter filtros e ordenação funcionando com paginação

**Arquivos a modificar:**
- `src/app/contexts/CashFlowContext.tsx`
- `src/app/contexts/PayablesContext.tsx`
- `src/app/contexts/ReceivablesContext.tsx`

**Esforço:** 2 dias

---

#### 1.5 Consertar Railway Auto-Deploy
**Por quê:** Deploy manual via `railway up` é insustentável. Cada update exige intervenção manual.

**Investigação:**
- Verificar `railway.json` — `watchPatterns` pode estar filtrando os arquivos errados
- Verificar webhook do GitHub no Railway dashboard
- Alternativa: configurar GitHub Actions para rodar `railway up` no push para `main`

**Esforço:** 2–4 horas

---

#### 1.6 Server-Side Plan Enforcement no PocketBase
**Por quê:** Hoje qualquer usuário FREE pode abrir DevTools e criar registros ilimitados.

**Implementação:**
- Regras de coleção no PocketBase admin para `transactions`, `payables`, `receivables`, `contacts`, `proposals`
- Contar registros existentes do usuário antes de permitir `create`
- Retornar 403 se limite excedido

**Esforço:** 2 horas (requer acesso ao PocketBase admin)

---

### 🟡 Fase 2 — Alta Prioridade (Próximas 2–3 semanas)

#### 2.1 Cash Flow Forecast (PRO)
Usar os últimos 3 meses de transações para projetar receitas e despesas do próximo mês. Exibir como gráfico de linha com banda de confiança. Feature sticky que traz usuários de volta semanalmente.

**Arquivos:** `src/utils/cashFlowForecast.ts` (novo) + `src/app/pages/RelatoriosFinanceiros.tsx`

#### 2.2 Transações Recorrentes
Scheduler diário que verifica `payables`/`receivables` com `ehRecorrente=true` e cria a próxima ocorrência na data correta. Campos no schema já existem.

**Arquivos:** `api/src/jobs/recurringTransactions.js` (novo)

#### 2.3 NFS-e via Nuvemfiscal
Integrar API Nuvemfiscal (~R$30-50/mês, suporta 5.000 municípios). Botão "Emitir NFS-e" em propostas com status "aprovada" ou "paga". Salvar XML/PDF na coleção `nfs_emissions`.

**Arquivos:**
- `api/src/routes/nfse.js` (novo)
- `src/app/components/EmitirNfsModal.tsx` (novo)
- `src/app/contexts/NfsContext.tsx` (novo)

#### 2.4 Corrigir `transactionsUsageToday`
Renomear para `transactionsUsageThisMonth` em AuthContext, PocketBase schema (`profiles` collection) e qualquer referência no codebase. Evitar bug de contagem dupla.

**Esforço:** 3 horas

#### 2.5 Onboarding Obrigatório
Gate o dashboard até o onboarding ser concluído. Personalizar experiência inicial baseada em tipo de negócio (serviços vs comércio → ocultar Estoque para serviços).

---

### 🟢 Fase 3 — Médio Prazo (Próximo mês)

| # | Feature | Impacto |
|---|---------|---------|
| 3.1 | **CSV/OFX import** de extrato bancário | Feature mais pedida na categoria; reduz atrito de entrada |
| 3.2 | **Financial health score** (0–100) no Dashboard | Gamificação e engajamento |
| 3.3 | **Category budget alerts** — orçamento por categoria + alerta em 80% | Engagement ativo, não só relatório passivo |
| 3.4 | **PocketBase real-time subscriptions** — sync entre abas sem reload | Eliminar "por que não atualizou?" |
| 3.5 | **In-app changelog** — badge na sidebar para features novas | Usuários descobrem o que pagaram |
| 3.6 | **Re-enable Open Finance** (Pluggy/Belvo) — validar backend routes e reativar UI | Diferencial competitivo de longo prazo |

---

### ⏩ Defer / Cortar

| Feature | Decisão | Motivo |
|---------|---------|--------|
| Referral program | Defer pós 100 usuários pagantes | Overhead alto, ROI incerto agora |
| NPS widget | Defer | Coletar feedback 1:1 primeiro |
| Admin panel | Defer | PocketBase admin já cobre a necessidade |
| Bio field no perfil | **Remover** | Campo inútil em ferramenta financeira |
| Mercado Pago / Stripe | Cancelado | Asaas está em produção e funciona |
| Supabase edge functions | Cancelado | Stack é PocketBase — não usar |
| Annual plan pricing | Avaliar após primeiros 50 pagantes | Bom para retenção mas premature agora |

---

## Top 5 Ações Imediatas

| # | Ação | Impacto | Esforço |
|---|------|---------|---------|
| **1** | Email de cobrança (scheduler + Resend) | Alto — automatiza cobranças, reduz churn | 3 dias |
| **2** | PDF export de propostas | Alto — feature PRO que não funciona hoje | 1 dia |
| **3** | MEI annual revenue tracker no Dashboard | Alto — resolve ansiedade principal do MEI | 1 dia |
| **4** | Paginação nos contextos | Médio/Alto — performance para usuários maduros | 2 dias |
| **5** | Consertar Railway auto-deploy | Operacional — sustentabilidade de deploy | 2–4 horas |

---

## O Que Aumenta Retenção

**Alertas proativos** são o driver de retenção mais alto para ferramentas financeiras de MEI. Usuários não abrem o app por prazer — abrem quando estão preocupados. Construir os gatilhos de preocupação:

- "Você tem 3 contas vencendo esta semana — R$1.200"
- "Suas despesas estão 18% acima do mês passado"
- "Você usou 78% do seu limite anual MEI"
- "Proposta #12 está vencida há 5 dias sem confirmação"

Usuários que recebem esses alertas têm 3× mais retenção em 30 dias.

**Reduzir atrito de entrada de dados:**
- CSV/OFX import de extrato (maior pedido da categoria)
- Transações recorrentes (reduz entrada manual)
- NFS-e integrada (elimina troca de ferramenta)

---

## Decisão Arquitetural Pendente

**`payables` e `receivables` como coleções separadas vs unificar em `transactions`:**

A arquitetura atual cria sync one-way: marcar payable como pago cria uma transação, mas deletar a transação não desfaz o payable. Isso gera bugs de inconsistência indefinidamente.

**Recomendação: migrar para unificado** — mas somente após implementar testes end-to-end que garantam zero regressão. Fazer isso no início da Fase 3 como pré-requisito para cash flow forecast e budget alerts.

---

*Auditado e atualizado em 2026-04-22 com base na análise do codebase real.*
