# Estratégia Open Finance — Dashcomigo

---

## O que é Open Finance?

Open Finance é o marco regulatório brasileiro — determinado pelo Banco Central do Brasil — que obriga as instituições financeiras a compartilhar dados de clientes com terceiros autorizados, por meio de APIs padronizadas e mediante consentimento explícito do usuário.

Desde 2023, o Open Finance brasileiro possibilitou:

- **Compartilhamento de dados de conta** (saldos, transações e histórico de crédito)
- **Compartilhamento de carteira de investimentos** (posições, rentabilidade e alocação)
- **Iniciação de pagamento** (pagamentos diretos, sem intermediação das redes de cartão)
- **Mais de 40 milhões de consentimentos ativos** em todo o ecossistema

Para o Dashcomigo, o Open Finance não é uma funcionalidade — é a **fundação de todo o produto**.

---

## Por que o Open Finance é Central para o Dashcomigo

### O Problema dos Aplicativos Financeiros Manuais

Aplicativos financeiros tradicionais exigem que o usuário registre manualmente cada transação. O resultado é previsível:

- Os dados estão sempre incompletos
- O engajamento cai nas primeiras semanas de uso
- Os insights são construídos sobre informações parciais — e, portanto, imprecisos

### A Diferença do Open Finance

Com o Open Finance, o Dashcomigo se torna **automático**:

- As transações aparecem sem nenhuma ação do usuário
- A carteira de investimentos é importada diretamente dos bancos
- O fluxo de caixa reflete o saldo bancário real, não o que o usuário se lembrou de registrar
- A plataforma torna-se a verdadeira **fonte única de verdade financeira** do empreendedor

---

## Nossa Integração: Pluggy

O Dashcomigo utiliza a **Pluggy** como provedor de infraestrutura Open Finance.

A Pluggy é uma fintech brasileira que oferece:

- Um único SDK integrado a **mais de 200 instituições financeiras brasileiras**
- Modelos de dados padronizados para contas, transações e investimentos
- Webhooks em tempo real para atualização de dados
- Conformidade total com as regulamentações Open Finance do Banco Central do Brasil

### Integração Atual

| Funcionalidade | Status |
|----------------|--------|
| Widget de conexão (fluxo de consentimento do usuário) | Ativo |
| Importação e classificação de transações | Ativo |
| Importação de carteira de investimentos | Ativo |
| Sincronização em segundo plano (a cada 6 horas) | Ativo |
| Agregação de múltiplas contas bancárias | Em desenvolvimento |
| Atualizações em tempo real via webhook | Planejado |

### Classes de Ativos Suportadas

- Renda Fixa (CDB, LCI, LCA, Tesouro Direto)
- Ações
- ETFs
- Fundos de Investimento
- Previdência Privada (PGBL e VGBL)
- FIIs (Fundos de Investimento Imobiliário)
- COEs (Certificados de Operações Estruturadas)
- Criptomoedas

---

## Pipeline de Dados

Quando um usuário conecta sua conta bancária, o Dashcomigo executa o seguinte fluxo:

```
Widget Pluggy (consentimento do usuário)
        |
Backend recebe itemId + institutionId
        |
+------------------------------------------+
|         PIPELINE DE INGESTÃO             |
|                                          |
|  1. Busca transações na Pluggy           |
|  2. Normaliza para o formato interno     |
|  3. Classifica: PF versus PJ             |
|  4. Persistência idempotente             |
|     (sem registros duplicados)           |
+------------------------------------------+
        |
+------------------------------------------+
|      PIPELINE DE INVESTIMENTOS           |
|                                          |
|  1. Busca todos os tipos de ativo        |
|  2. Mapeia para categorias padrão        |
|  3. Deduplica por nome + tipo            |
|  4. Armazena com valor atualizado        |
+------------------------------------------+
        |
PocketBase (banco de dados em nuvem)
        |
Frontend React (atualização da interface em tempo real)
```

---

## Como o Open Finance Transforma a Plataforma

### Sem Open Finance

| Ação do Usuário | Esforço |
|-----------------|---------|
| Registrar uma transação | Lançamento manual a cada operação |
| Consultar o saldo atual | Acessar o aplicativo do banco separadamente |
| Acompanhar investimentos | Verificar manualmente cada corretora ou banco |
| Gerar um relatório | Baseado em dados incompletos e desatualizados |

### Com Open Finance

| Ação do Usuário | Esforço |
|-----------------|---------|
| Transações registradas | Zero — importação automática |
| Saldo atual | Sempre real e sincronizado |
| Carteira de investimentos | Importada automaticamente |
| Gerar um relatório | Completo, preciso e instantâneo |

---

## Capacidades Futuras do Open Finance

### Fase 2 — Camada de Inteligência

- **Reconhecimento de padrões**: identificação de despesas recorrentes, picos atípicos e sazonalidades
- **Separação automática PF/PJ**: classificação assistida por IA de transações pessoais versus empresariais
- **Previsão de fluxo de caixa**: "Com base nos últimos 6 meses, você terá R$ X disponíveis em 30 dias"
- **Alertas de vencimento de investimentos**: "Seu CDB vence em 15 dias — confira opções de reaplicação"

### Fase 3 — Camada de Assessoria Financeira

- **Recomendações personalizadas de investimento** com base na posição real de caixa e no perfil de risco do usuário
- **Inteligência de crédito**: "Com base no seu histórico de faturamento, você pode acessar até R$ X em crédito"
- **Otimização tributária**: "Você economizou R$ X em comparação com outros regimes tributários neste trimestre"
- **Visão consolidada multi-empresa**: empreendedores com mais de um CNPJ visualizam a situação financeira completa em um único painel

### Fase 4 — Marketplace de Produtos Financeiros

- **Produtos financeiros contextualizados**: crédito, seguros e investimentos apresentados no momento certo e para o perfil correto
- **Modelo de receita compartilhada**: comissão sobre a contratação de produtos financeiros via plataforma
- **Serviços de dados B2B**: insights anônimos e agregados para instituições financeiras, em plena conformidade com a LGPD

---

## Aspectos Regulatórios e de Segurança

- Todo dado compartilhado via Open Finance exige **consentimento explícito do usuário**
- O consentimento pode ser revogado a qualquer momento diretamente pela plataforma
- Os dados são processados e armazenados em conformidade com a **LGPD** (Lei Geral de Proteção de Dados Pessoais)
- A Pluggy é **participante registrada do Open Finance** junto ao Banco Central do Brasil
- Nenhuma credencial bancária é armazenada — apenas tokens OAuth com escopo restrito e limitado
- Todos os dados são criptografados em trânsito e em repouso
