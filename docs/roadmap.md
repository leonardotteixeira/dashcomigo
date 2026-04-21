# Roadmap de Produto — Dashcomigo

> Atualizado em: Q2 2026

---

## Visão Geral

```
AGORA ──────────── Q3 2026 ──────────── Q1 2027 ──────────── 2028+
│                      │                     │                    │
│  Fundação            │  Inteligência        │  Plataforma        │  Ecossistema
│  (Concluído)         │  (Em andamento)      │  (Planejado)       │  (Visão)
│                      │                     │                    │
│  Módulos core        │  Open Finance        │  IA e insights     │  Marketplace
│  Open Finance        │  Relatórios          │  API B2B           │  Camada crédito
│  Investimentos       │  Multi-banco         │  App mobile        │  Assessor IA
```

---

## Fase 1 — Fundação (Concluída)

**Objetivo:** Entregar um produto funcional que atenda às necessidades centrais do MEI brasileiro.

### Plataforma Central

- Autenticação de usuários (e-mail + Google OAuth)
- Planos de assinatura (Gratuito e PRO) com controle de acesso por funcionalidade
- Dashboard com visão financeira em tempo real
- Gestão de fluxo de caixa (receitas e despesas)
- Módulos de contas a pagar e a receber
- Gestão de clientes e fornecedores
- Módulo de propostas comerciais
- Controle do DAS e simuladores fiscais para MEI

### Open Finance

- Conexão bancária via widget Pluggy
- Pipeline de ingestão de transações (normalização, classificação e persistência)
- Classificação automática PF/PJ de transações
- Importação de carteira de investimentos (8 classes de ativos)
- Sincronização periódica em segundo plano a cada 6 horas
- Sincronização idempotente — sem registros duplicados

### Relatórios

- Relatórios financeiros avançados (plano PRO)
- Análise de receitas versus despesas para períodos de 3, 6 e 12 meses
- Composição por categoria e previsão de fluxo de caixa
- Análise de investimentos com comparação ao benchmark CDI
- Gráfico de evolução da carteira ao longo do tempo
- Exportação para Excel e PDF

---

## Fase 2 — Inteligência (Q3 2026, Em Andamento)

**Objetivo:** Tornar a plataforma mais inteligente, automática e acionável.

### Melhorias no Open Finance

- Gerenciamento robusto de múltiplas conexões bancárias sem duplicação de dados
- Agregação multi-banco: conectar mais de uma instituição e visualizar tudo em um único painel
- Suporte a webhooks para atualização de transações em tempo real
- Classificação PF/PJ aprimorada com regras de aprendizado baseadas no comportamento do usuário

### Alertas Inteligentes

- Alertas preventivos de fluxo de caixa ("Seu saldo pode ficar negativo em 12 dias")
- Notificações de pagamentos vencidos por push e e-mail
- Lembretes de vencimento do DAS com verificação automática do saldo disponível
- Alertas de vencimento de investimentos (resgate de CDB, LCI e outros títulos)

### Melhorias nos Relatórios

- DRE completa (Demonstração do Resultado do Exercício) por período
- Relatório de aging de contas a receber
- Seleção de período personalizado em todos os relatórios
- Comparativo entre período atual e período anterior
- Entrega mensal agendada de relatórios por e-mail

### Módulo de Investimentos

- Histórico de desempenho da carteira ao longo do tempo
- Cálculo de rentabilidade individualizado por ativo
- Sugestões de rebalanceamento com base na alocação-alvo do usuário
- Comparação com múltiplos benchmarks: CDI, IPCA e Ibovespa

---

## Fase 3 — Plataforma (Q1 2027)

**Objetivo:** Consolidar o Dashcomigo como sistema operacional financeiro completo para empreendedores.

### Camada de Insights com Inteligência Artificial

- Resumos financeiros em linguagem natural e acessível
- Previsão de fluxo de caixa para os próximos 30, 60 e 90 dias
- Detecção de anomalias em despesas atípicas
- Dicas financeiras personalizadas com base no perfil do usuário
- Sugestões de otimização tributária assistidas por inteligência artificial

### Aplicativo Mobile

- Aplicativos nativos para iOS e Android
- Notificações push para todos os alertas e eventos financeiros
- Autenticação biométrica

### Funcionalidades B2B

- Versão white-label para contadores e assessores financeiros
- API de acesso para integrações com sistemas de terceiros
- Painel de gestão centralizada de múltiplos clientes

### Integrações com a Plataforma

- Importação de NF-e (Nota Fiscal Eletrônica)
- Integração direta com o Portal do Empreendedor (gov.br)
- Conectores com softwares de contabilidade (Contabilizei, Omie)
- Integrações com marketplaces (Mercado Livre, Shopify)

---

## Fase 4 — Ecossistema (2028+)

**Objetivo:** Construir o ecossistema financeiro completo em torno do empreendedor brasileiro.

### Marketplace de Produtos Financeiros

- Ofertas de crédito personalizadas com base no histórico de faturamento
- Marketplace de seguros empresariais
- Recomendação e execução de produtos de investimento com parceiros financeiros

### Assessor Financeiro com Inteligência Artificial

- Assessor financeiro conversacional via interface de chat
- Planejamento financeiro orientado a metas de curto, médio e longo prazo
- Simulação de aposentadoria para MEIs
- Ferramentas de planejamento de sucessão empresarial

---

## Métricas de Sucesso

| Fase | Métrica Principal | Meta |
|------|-------------------|------|
| Fase 1 | Usuários ativos mensais | 500 |
| Fase 2 | Taxa de adoção do Open Finance | Acima de 60% dos usuários pagantes |
| Fase 3 | Receita Recorrente Mensal (MRR) | R$ 50.000 |
| Fase 4 | GMV da plataforma | Acima de R$ 10 milhões |
