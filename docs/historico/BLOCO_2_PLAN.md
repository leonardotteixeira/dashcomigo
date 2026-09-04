# Bloco 2 - Notificações, Email & NFS-e

## Status Atual (Bloco 1 - Concluído )
- Collection "payables" com CRUD completo
- Contas a Pagar (interface completa)
- Propostas com status "paga" e "vencida"
- Widget "Próximas a Vencer" no Dashboard

---

## FASE 1: Lembretes de Cobrança por Email (2 semanas)

### 1.1 Sistema de Email de Cobrança
**Objetivo:** Enviar automaticamente emails quando propostas/contas vencem

**Implementação:**
- [ ] Criar edge function `send-payment-reminder` no PocketBase
- [ ] Função para verificar propostas vencidas diariamente
- [ ] Email template: "Proposta vencida - pendente de pagamento"
- [ ] Email template: "Conta vencendo em X dias"
- [ ] Sistema de log de emails enviados
- [ ] Parar de enviar após 3 lembretes

**Arquivos:**
- `supabase/functions/send-payment-reminder.ts`
- `src/app/utils/emailReminders.ts`
- Migrations para tabela `email_logs`

### 1.2 Scheduler Automático
**Objetivo:** Executar verificações 1x por dia

**Implementação:**
- [ ] Cron job (pg-cron no PocketBase ou Edge Function schedule)
- [ ] Verificar propostas com status ≠ "paga" e `validade < hoje`
- [ ] Verificar contas com `data_vencimento <= hoje + 3 dias`
- [ ] Disparar emails via Resend

**Recurso:** Usar Resend API que já está configurado

---

## FASE 2: NFS-e Integrada (3 semanas) NOVO

### 2.1 O que é NFS-e?
- **NFS-e** = Nota Fiscal de Serviço Eletrônica
- Obrigatória para prestar serviços no Brasil
- Cada **município** tem sua própria plataforma RPS
- Diferentes formatos por município

### 2.2 Estratégia: Integração com Multi-Município
Para suportar múltiplos municípios brasileiros, vamos usar:

**Opção A: API Nuvemfiscal** (Recomendado)
- Suporta ~5000 municípios
- API simplificada
- Preço: ~R$30-50/mês
- Tempo implementação: 1 semana

**Opção B: Integração Direta com e-CNPJ**
- Plataforma oficial do governo
- Suporte manual por município
- Gratuito mas complexo
- Tempo implementação: 3 semanas

**Opção C: Integração com BHub**
- Integração com APIs de emissão nacionais
- Suporta múltiplos padrões
- Preço: ~R$80-120/mês
- Tempo implementação: 2 semanas

### 2.3 Implementação (Nuvemfiscal recomendado)

**Backend:**
- [ ] Criar model `NfsEmission` no PocketBase
 - `id, user_id, proposal_id, municipio, cnpj_tomador, valor, descricao, rps_number, nf_number, status, xml, pdf, created`

- [ ] Edge function `emit-nfs`
 - Conectar com API Nuvemfiscal
 - Enviar dados da proposta
 - Salvar NFS gerada

- [ ] Criar migration para tabela `nfs_emissions`

**Frontend:**
- [ ] Componente modal "Emitir NFS-e"
 - Campos: Município, CNPJ cliente, dados obrigatórios
 - Select de municípios brasileiros (~5500)

- [ ] Button "Emitir NFS-e" em GeradorPropostas
 - Aparecer apenas quando status = "aprovada" ou "paga"
 - Validar dados obrigatórios

- [ ] Lista de NFS-e emitidas
 - Status da emissão
 - Download do PDF/XML
 - Link para protocolo

**Arquivos:**
- `src/app/components/EmitirNfsModal.tsx`
- `src/app/contexts/NfsContext.tsx`
- `src/app/pages/MinhasNfs.tsx`
- `supabase/functions/emit-nfs.ts`
- `src/utils/nfseService.ts`

---

## FASE 3: Dashboard Avançado (2 semanas)

### 3.1 Relatório de Emissões NFS-e
- [ ] Widget mostrando NFS-e emitidas este mês
- [ ] Valor total em NFS-e
- [ ] Taxa de emissão (% propostas com NFS)
- [ ] Alertas: "X propostas sem NFS-e"

### 3.2 Indicadores de Saúde Fiscal
- [ ] Score de conformidade fiscal (0-100)
- [ ] Alertas de documentação pendente
- [ ] Checklist: Email enviado? NFS-e emitida? Pagamento confirmado?

---

## FASE 4: Integrações Bancárias (4 semanas) - FUTURO

**Objetivo:** Sincronizar transações bancárias automaticamente

**Plataformas:**
- Asaas
- Stripe Connect
- PagSeguro

---

## Roadmap Resumido

| Fase | Recursos | Timeline | Impacto |
|------|----------|----------|--------|
| **1** | Email + Scheduler | 2 sem | Alto - automatiza cobranças |
| **2** | NFS-e | 3 sem | Crítico - obrigação legal |
| **3** | Dashboard avançado | 2 sem | Médio - insights |
| **4** | Bancos | 4 sem | Médio - reconciliação |

---

## Comparativo com Concorrentes

| Feature | Conta Azul | Nibo | Bling | Asaas | **Bubuya** |
|---------|-----------|------|-------|-------|-----------|
| Propostas | | | | | |
| Contas a Pagar | | | | | |
| Email Cobrança | | | | | Bloco 2 |
| NFS-e | | | | | Bloco 2 |
| MEI → ME | | | | | |
| Fluxo de Caixa | | | | | |
| Preço Ideal | | | | | |
| Mobile nativo | | | | | Futuro |

---

## Próximo Passo Imediato

**Qual você quer fazer primeiro?**

1. **Email de Cobrança** (mais rápido, ~2 sem)
2. **NFS-e** (mais importante legalmente, ~3 sem)
3. **Ambas em paralelo** (recomendado)

