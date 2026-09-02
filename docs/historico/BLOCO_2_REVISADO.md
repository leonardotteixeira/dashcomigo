# Bloco 2 Revisado - Email + Relatórios + Estoque + Orçamentos

## 🎯 Visão Geral

Implementar as funcionalidades que os concorrentes (Conta Azul, Nibo, Bling) têm, focando em **valor imediato** para o MEI/Freelancer.

| Funcionalidade | Timeline | Impacto |
|----------------|----------|---------|
| **Email de Cobrança** | 2 sem | 🔴 Alto - automatiza cobranças |
| **Relatórios Financeiros** | 2 sem | 🔴 Alto - insights de negócio |
| **Gestão de Estoque** | 2 sem | 🟡 Médio - para quem vende produtos |
| **Orçamentos & Metas** | 2 sem | 🟡 Médio - planejamento |

**Total: 8 semanas (2 meses)**

---

# FASE 1: Email de Cobrança (Semanas 1-2)

## 1.1 Sistema de Notificações por Email

### Backend
- [ ] Criar tabela `payment_reminders` no PocketBase
  - Fields: `id, user_id, proposal_id, payable_id, sent_date, reminder_count, status`

- [ ] Edge Function `send-payment-reminders`
  - Verificar propostas com status="aprovada" e `validade < hoje`
  - Verificar contas com `status="pendente"` e `data_vencimento <= hoje + 3 dias`
  - Enviar email via Resend
  - Limitar a 3 lembretes por conta

- [ ] Cron job (executar 1x/dia às 08:00)
  - Usar PocketBase job scheduler ou Edge Function schedule

### Frontend
- [ ] Toggle "Receber lembretes por email" em Profile
- [ ] Histórico de emails enviados (admin view)
- [ ] Desabilitar lembretes por conta (lista de contas)

**Arquivos:**
- `supabase/functions/send-payment-reminders.ts`
- `src/app/utils/emailService.ts`
- Migrations para `payment_reminders`

**Emails (Templates Resend):**
1. "Sua proposta está vencida - confirme o pagamento"
2. "Conta vencendo em 3 dias - ação necessária"
3. "Lembrança: conta vencia hoje"

---

# FASE 2: Relatórios Financeiros Básicos (Semanas 3-4)

## 2.1 Página de Relatórios

### Relatório 1: Fluxo de Caixa
```
Período: [Mês] [Ano]

ENTRADAS
├─ Propostas Pagas: R$ X.XXX
├─ Outras Receitas: R$ X.XXX
└─ Total: R$ X.XXX

SAÍDAS
├─ Contas a Pagar: R$ X.XXX
├─ Outras Despesas: R$ X.XXX
└─ Total: R$ X.XXX

RESULTADO
├─ Fluxo Líquido: R$ X.XXX
├─ Margem: XX%
└─ Tendência: ↑ ↓ →
```

### Relatório 2: Receitas por Categoria
- Gráfico pizza: distribuição de receitas
- Tabela: categoria, valor, % do total
- Comparar com período anterior

### Relatório 3: Despesas por Categoria
- Gráfico pizza: categorias de despesas
- Tabela: categoria, valor, % do total
- Identificar onde gasta mais

### Relatório 4: Propostas
- Total emitidas, aprovadas, pagas, vencidas
- Taxa de conversão (aprovadas / emitidas)
- Valor médio de proposta
- Tempo médio de aprovação

### Relatório 5: Contas a Pagar
- Total pendente, pago
- Médias de prazo de pagamento
- Contas em atraso
- Categoria com maior custo

## 2.2 Implementação

### Backend
- [ ] Context `ReportsContext.tsx`
  - Functions: `getFluxoCaixa()`, `getReceitas()`, `getDespesas()`, `getPropostas()`, `getPayables()`
  - Caching por período

- [ ] Utils `reportCalculations.ts`
  - Funções de cálculo
  - Formatação de datas/períodos

### Frontend
- [ ] Nova página `/app/relatorios`
- [ ] Componentes:
  - `RelatorioPrincipal.tsx` (Fluxo de Caixa)
  - `RelatorioReceitas.tsx`
  - `RelatorioDespesas.tsx`
  - `RelatorioPropostas.tsx`
  - `RelatorioPayables.tsx`
  - `PeriodSelector.tsx` (dropdown Mês/Ano)

- [ ] Gráficos (Recharts):
  - BarChart (fluxo mensal)
  - PieChart (categorias)
  - LineChart (tendência)

- [ ] Export (future):
  - Button para exportar PDF/Excel

**Arquivos:**
- `src/app/contexts/ReportsContext.tsx`
- `src/app/pages/Relatorios.tsx`
- `src/app/components/RelatorioCard.tsx`
- `src/app/utils/reportCalculations.ts`

---

# FASE 3: Gestão de Estoque Básica (Semanas 5-6)

## 3.1 Schema PocketBase

```
Collection: products
├─ id (text, PK)
├─ user_id (relation → profiles)
├─ nome (text, required)
├─ descricao (text)
├─ sku (text, unique)
├─ categoria (text)
├─ preco_custo (number)
├─ preco_venda (number)
├─ quantidade_atual (number)
├─ quantidade_minima (number) // alerta se < isso
├─ imagem_url (text)
├─ ativo (bool)
└─ created (date)

Collection: estoque_movimentacoes
├─ id (text, PK)
├─ product_id (relation → products)
├─ user_id (relation → profiles)
├─ tipo (select: entrada, saida, ajuste)
├─ quantidade (number)
├─ motivo (text) // venda, compra, perda, etc
├─ preco_unitario (number)
├─ observacoes (text)
└─ data (date)
```

## 3.2 UI Componentes

### Página: `/app/estoque`

**1. Dashboard Estoque**
- Cards: Total de produtos, Quantidade em estoque, Produtos baixos, Valor total
- Gráfico: Top 5 produtos mais vendidos
- Alertas: Produtos com quantidade < mínima

**2. Lista de Produtos**
- Tabela: SKU, Nome, Categoria, Qtd, Preço, Lucro, Ações
- Search/Filter por categoria
- Button "Novo Produto"
- Button "Registrar Movimentação"

**3. Modal "Novo Produto"**
- Campos: Nome, SKU, Categoria, Preço Custo, Preço Venda, Qtd Inicial, Qtd Mínima
- Upload de imagem
- Button "Salvar"

**4. Modal "Registrar Movimentação"**
- Select: Tipo (Entrada/Saída/Ajuste)
- Input: Quantidade
- Input: Motivo (dropdown: Venda, Compra, Perda, Devolução, etc)
- Input: Preço Unitário (preenchido automaticamente)
- Textarea: Observações

**5. Histórico**
- Log de todas as movimentações
- Filtrar por produto, tipo, data
- Mostrar quem fez a movimentação e quando

## 3.3 Implementação

### Backend
- [ ] Context `EstoqueContext.tsx`
  - CRUD de produtos
  - Registrar movimentações
  - Cálculos de estoque

### Frontend
- [ ] Página `/app/estoque`
- [ ] Componentes:
  - `DashboardEstoque.tsx`
  - `ListaProdutos.tsx`
  - `ModalProduto.tsx`
  - `ModalMovimentacao.tsx`
  - `HistoricoEstoque.tsx`

**Arquivos:**
- `src/app/contexts/EstoqueContext.tsx`
- `src/app/pages/Estoque.tsx`
- `src/app/components/EstoqueCard.tsx`

---

# FASE 4: Orçamentos & Metas (Semanas 7-8)

## 4.1 Schema PocketBase

```
Collection: orcamentos_despesas
├─ id (text, PK)
├─ user_id (relation → profiles)
├─ categoria (text)
├─ mes (date) // início do mês
├─ valor_planejado (number)
├─ valor_realizado (number)
├─ observacoes (text)
└─ created (date)

Collection: metas_receita
├─ id (text, PK)
├─ user_id (relation → profiles)
├─ mes (date)
├─ valor_meta (number)
├─ valor_realizado (number)
├─ categoria_focada (text) // ex: "Consultoria", "Desenvolvimento"
├─ status (select: não_iniciado, em_progresso, atingida, nao_atingida)
└─ created (date)
```

## 4.2 UI: Orçamentos

### Página: `/app/orcamentos`

**1. Dashboard Orçamentos**
- Card: "Este mês: Orçado R$ X | Gasto R$ X | Restante R$ X"
- Progress bar por categoria
- Aviso: "Você já gastou 80% do orçado"

**2. Tabela de Orçamentos**
- Colunas: Categoria, Orçado, Realizado, %, Status (Ok/Alerta/Excedido)
- Editar orçamento (inline)
- Clicar em categoria mostra detalhes

**3. Modal "Definir Orçamento"**
- Dropdown: Categoria (vem da collection de despesas)
- Input: Valor Planejado
- Selector: Mês
- Button "Salvar"

**4. Gráfico**
- BarChart: categoria vs orçado vs realizado

## 4.3 UI: Metas

### Página: `/app/metas` (ou tab em Orçamentos)

**1. Dashboard Metas**
- Card principal: "Meta de R$ X | Atingido R$ X | Faltam R$ X"
- % de progresso
- Dias restantes do mês

**2. Cards de Metas**
- Mês, Meta, Realizado, %, Status badge
- Green se atingida, Red se não

**3. Modal "Definir Meta"**
- Input: Valor Meta
- Selector: Mês
- Dropdown: Categoria focada (opcional)
- Button "Salvar"

**4. Histórico**
- Últimos 12 meses de metas
- % de metas atingidas (taxa de sucesso)
- Comparar com período anterior

## 4.4 Implementação

### Backend
- [ ] Context `OrcamentosContext.tsx`
- [ ] Context `MetasContext.tsx`
- [ ] Funções de cálculo e comparação

### Frontend
- [ ] Página `/app/orcamentos`
- [ ] Componentes:
  - `DashboardOrcamentos.tsx`
  - `TabelaOrcamentos.tsx`
  - `ModalOrcamento.tsx`
  - `DashboardMetas.tsx`
  - `CardsMetasHistorico.tsx`
  - `ModalMeta.tsx`

**Arquivos:**
- `src/app/contexts/OrcamentosContext.tsx`
- `src/app/contexts/MetasContext.tsx`
- `src/app/pages/Orcamentos.tsx`

---

# 📋 Roadmap Visual

```
Semana 1-2: Email de Cobrança
├─ Edge Function
├─ Cron job
└─ UI Notificações

Semana 3-4: Relatórios
├─ Fluxo de Caixa
├─ Receitas/Despesas
├─ Propostas/Payables
└─ Gráficos

Semana 5-6: Estoque
├─ CRUD Produtos
├─ Movimentações
├─ Dashboard
└─ Alertas

Semana 7-8: Orçamentos & Metas
├─ Definir Orçamentos por Categoria
├─ Metas de Receita
├─ Progresso visual
└─ Histórico

TOTAL: 8 semanas = 2 meses
```

---

# 🎯 Priorizações por Tipo de Usuário

## MEI Serviços (Freelancer/Consultor)
1. ✅ Email de Cobrança (CRÍTICO)
2. ✅ Relatórios (importante)
3. ⏩ Estoque (não relevante)
4. ✅ Metas (importante para crescimento)

## MEI Comércio (Vende produtos)
1. ✅ Email de Cobrança (CRÍTICO)
2. ✅ Relatórios (importante)
3. ✅ Estoque (CRÍTICO)
4. ✅ Metas (importante)

## Recomendação
Implementar **todas as 4** mas com **toggle no onboarding**:
- "Você vende produtos?" → mostra Estoque
- "Quer acompanhar metas?" → mostra Metas

---

# Próximos Passos

**Qual você quer começar?**

1. **Email de Cobrança** (mais rápido, impacto imediato)
2. **Relatórios** (mais valor de insights)
3. **Estoque** (se usuários vendem produtos)
4. **Tudo em paralelo** (ideal com time)

