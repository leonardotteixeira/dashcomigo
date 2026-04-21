# Roadmap de Produto — Dashcomigo

> Atualizado em: Q2 2026

---

## Visão Geral

```
AGORA ─────────── Q3 2026 ─────────── Q1 2027 ─────────── 2028+
│                     │                    │                   │
│  Fundacao           │  Inteligencia      │  Plataforma       │  Ecossistema
│  (Concluido)        │  (Em andamento)    │  (Planejado)      │  (Visao)
│                     │                    │                   │
│  Modulos core       │  Open Finance      │  IA e insights    │  Marketplace
│  Open Finance       │  Relatorios        │  API B2B          │  Camada credito
│  Investimentos      │  Multi-banco       │  App mobile       │  Assessor IA
```

---

## Fase 1 — Fundacao (Concluida)

**Objetivo:** Um produto funcional que atende as necessidades centrais do MEI brasileiro.

### Plataforma Central

- Autenticacao de usuarios (e-mail + Google OAuth)
- Planos de assinatura (Gratis / PRO) com controle de acesso por funcionalidade
- Dashboard com visao financeira em tempo real
- Gestao de fluxo de caixa (receitas e despesas)
- Modulos de contas a pagar e a receber
- Gestao de clientes e fornecedores
- Modulo de propostas
- Controle do DAS e simuladores para MEI

### Open Finance

- Conexao bancaria via widget Pluggy
- Pipeline de ingestao de transacoes (normalizar, classificar, persistir)
- Classificacao automatica PF/PJ de transacoes
- Importacao de carteira de investimentos (8 tipos de ativos)
- Sincronizacao periodica em segundo plano a cada 6 horas
- Sincronizacao idempotente — sem registros duplicados

### Relatorios

- Relatorios financeiros avancados (plano PRO)
- Analise de receitas versus despesas (3, 6 e 12 meses)
- Composicao por categoria, previsao de fluxo de caixa
- Analise de investimentos com comparacao ao benchmark CDI
- Grafico de evolucao da carteira
- Exportacao para Excel e PDF

---

## Fase 2 — Inteligencia (Q3 2026, Em Andamento)

**Objetivo:** Tornar a plataforma mais inteligente, automatica e acionavel.

### Melhorias no Open Finance

- Gerenciamento confiavel de multiplas conexoes (sem duplicatas entre reconexoes)
- Agregacao multi-banco (conectar mais de uma instituicao)
- Suporte a webhooks para atualizacoes de transacoes em tempo real
- Classificacao PF/PJ aprimorada com regras de aprendizado

### Alertas Inteligentes

- Alertas de risco no fluxo de caixa ("Saldo pode ficar negativo em 12 dias")
- Notificacoes de pagamentos vencidos (push + e-mail)
- Lembretes de vencimento do DAS com verificacao de saldo disponivel
- Alertas de vencimento de investimentos (CDB, LCI na data de resgate)

### Melhorias nos Relatorios

- DRE completa (Demonstracao do Resultado do Exercicio) por mes
- Relatorio de aging de contas a receber
- Periodo personalizado para todos os relatorios
- Comparativo: periodo atual versus periodo anterior
- Entrega mensal agendada de relatorios por e-mail

### Modulo de Investimentos

- Acompanhamento historico de performance ao longo do tempo
- Calculo de rentabilidade por ativo
- Sugestoes de rebalanceamento com base na alocacao-alvo
- Comparacao com multiplos benchmarks (CDI, IPCA, Ibovespa)

---

## Fase 3 — Plataforma (Q1 2027)

**Objetivo:** Evoluir para um sistema operacional financeiro completo.

### Camada de Insights com Inteligencia Artificial

- Resumos financeiros em linguagem natural
- Previsao de fluxo de caixa para 30, 60 e 90 dias
- Deteccao de anomalias em despesas incomuns
- Dicas financeiras personalizadas
- Sugestoes de otimizacao tributaria assistidas por IA

### Aplicativo Mobile

- Aplicativos nativos para iOS e Android
- Notificacoes push para todos os alertas
- Autenticacao biometrica

### Funcionalidades B2B

- Versao white-label para contadores e assessores financeiros
- API para integracoes com terceiros
- Painel de gestao de multiplos clientes

### Integracoes com a Plataforma

- Importacao de NF-e (nota fiscal eletronica)
- Integracao direta com o portal MEI (gov.br)
- Conectores com softwares de contabilidade (Contabilizei, Omie)
- Integracoes com marketplaces (Mercado Livre, Shopify)

---

## Fase 4 — Ecossistema (2028+)

**Objetivo:** Construir o ecossistema financeiro em torno do empreendedor brasileiro.

### Marketplace de Produtos Financeiros

- Ofertas de credito baseadas no historico de faturamento
- Marketplace de seguros empresariais
- Recomendacao e execucao de produtos de investimento

### Assessor Financeiro com Inteligencia Artificial

- Assessor financeiro conversacional (interface de chat)
- Planejamento financeiro orientado a metas
- Simulacao de aposentadoria para MEIs
- Ferramentas de planejamento de sucessao empresarial

---

## Metricas de Sucesso

| Fase | Metrica Principal | Meta |
|------|-------------------|------|
| Fase 1 | Usuarios ativos mensais | 500 |
| Fase 2 | Adocao do Open Finance | Mais de 60% dos usuarios pagantes |
| Fase 3 | Receita recorrente mensal | R$ 50.000 |
| Fase 4 | GMV da plataforma | Mais de R$ 10 milhoes |
