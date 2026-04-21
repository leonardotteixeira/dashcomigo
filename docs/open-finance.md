# Estratégia Open Finance — Dashcomigo

---

## O que é Open Finance?

Open Finance é o marco regulatório brasileiro (determinado pelo Banco Central do Brasil) que obriga as instituições financeiras a compartilhar dados de clientes com terceiros autorizados por meio de APIs padronizadas — mediante consentimento explícito do usuário.

Desde 2023, o Open Finance brasileiro possibilitou:

- **Compartilhamento de dados de conta** (saldos, transações, histórico de crédito)
- **Compartilhamento de carteira de investimentos** (posições, rentabilidade, alocação)
- **Iniciação de pagamento** (pagamentos diretos sem as redes de cartão)
- **Mais de 40 milhões de consentimentos ativos** em todo o ecossistema

Para o Dashcomigo, o Open Finance não é uma funcionalidade — é a **fundação de todo o produto**.

---

## Por que o Open Finance é Central para o Dashcomigo

### O Problema dos Aplicativos Financeiros Manuais

Aplicativos financeiros tradicionais exigem que o usuário lance manualmente cada transação. O resultado:

- Os dados estão sempre incompletos
- Os usuários abandonam o aplicativo em semanas
- Os insights são baseados em informações parciais — e, portanto, equivocados

### A Diferença do Open Finance

Com o Open Finance, o Dashcomigo se torna **automático**:

- Transações aparecem sem nenhuma ação do usuário
- Carteiras de investimentos são importadas diretamente dos bancos
- O fluxo de caixa reflete o saldo bancário real, não o que o usuário se lembrou de lançar
- A plataforma se torna a verdadeira **fonte única de verdade financeira**

---

## Nossa Integração: Pluggy

O Dashcomigo utiliza a **Pluggy** como provedor de infraestrutura Open Finance.

A Pluggy é uma fintech brasileira que oferece:

- Um único SDK conectado a **mais de 200 instituições financeiras brasileiras**
- Modelos de dados padronizados para contas, transações e investimentos
- Webhooks em tempo real para atualização de dados
- Conformidade total com as regulamentações Open Finance do Banco Central

### Integração Atual

| Funcionalidade | Status |
|----------------|--------|
| Widget de conexão (fluxo de consentimento) | Ativo |
| Importação e classificação de transações | Ativo |
| Importação de carteira de investimentos | Ativo |
| Sincronização em segundo plano (a cada 6 horas) | Ativo |
| Agregação de múltiplas contas | Em desenvolvimento |
| Atualizações em tempo real via webhook | Planejado |

### Tipos de Investimento Suportados

- Renda Fixa (CDB, LCI, LCA, Tesouro Direto)
- Ações
- ETFs
- Fundos de Investimento
- Previdência (PGBL, VGBL)
- FIIs (Fundos de Investimento Imobiliário)
- COEs
- Criptomoedas

---

## Pipeline de Dados

Quando um usuário conecta sua conta bancária, o Dashcomigo executa o seguinte fluxo:

```
Widget Pluggy (consentimento do usuário)
        |
Backend recebe itemId + institutionId
        |
+---------------------------------------+
|         PIPELINE DE INGESTÃO          |
|                                       |
|  1. Busca transacoes na Pluggy        |
|  2. Normaliza para formato interno    |
|  3. Classifica: PF versus PJ          |
|  4. Persistencia idempotente          |
|     (sem duplicatas)                  |
+---------------------------------------+
        |
+---------------------------------------+
|      PIPELINE DE INVESTIMENTOS        |
|                                       |
|  1. Busca todos os tipos de ativo     |
|  2. Mapeia para categorias padrao     |
|  3. Deduplica por nome + tipo         |
|  4. Armazena com valor atual          |
+---------------------------------------+
        |
PocketBase (banco de dados em nuvem)
        |
Frontend React (atualiza a UI em tempo real)
```

---

## Como o Open Finance Transforma a Plataforma

### Sem Open Finance

| Ação do Usuário | Esforço |
|-----------------|---------|
| Adicionar uma transação | Lançamento manual toda vez |
| Conhecer o saldo atual | Abrir o aplicativo do banco separadamente |
| Acompanhar investimentos | Verificar manualmente o app da corretora |
| Gerar relatório | Baseado em dados incompletos |

### Com Open Finance

| Ação do Usuário | Esforço |
|-----------------|---------|
| Transações aparecem | Zero — automático |
| Saldo atual | Sempre real, sempre sincronizado |
| Carteira de investimentos | Importada automaticamente |
| Gerar relatório | Completo, preciso, instantâneo |

---

## Capacidades Futuras do Open Finance

### Fase 2: Camada de Inteligência

- **Reconhecimento de padrões**: identificar despesas recorrentes, picos incomuns e sazonalidades
- **Separação automática PF/PJ**: classificação assistida por IA de transações pessoais versus empresariais
- **Previsão de fluxo de caixa**: "Com base nos últimos 6 meses, você terá R$ X disponíveis em 30 dias"
- **Alertas de investimento**: "Seu CDB vence em 15 dias — veja opções de reaplicação"

### Fase 3: Camada de Assessoria Financeira

- **Recomendações personalizadas de investimento** com base na posição real de caixa e perfil de risco
- **Inteligência de crédito**: "Com base no seu histórico de faturamento, você pode acessar até R$ X em crédito"
- **Otimização do DAS**: "Você economizou R$ X em comparação com outros regimes tributários este trimestre"
- **Visão multi-empresa**: empreendedores com mais de um negócio veem a foto consolidada

### Fase 4: Marketplace de Produtos Financeiros

- **Produtos financeiros embutidos**: crédito, seguro e investimentos apresentados no contexto certo
- **Modelo de receita compartilhada**: comissão sobre a colocação de produtos financeiros
- **Serviços de dados B2B**: insights anônimos e agregados para instituições financeiras (com total conformidade à LGPD)

---

## Considerações Regulatórias e de Segurança

- Todo dado compartilhado via Open Finance exige **consentimento explícito do usuário**
- O consentimento pode ser revogado a qualquer momento pela plataforma
- Os dados são processados e armazenados em conformidade com a **LGPD** (Lei Geral de Proteção de Dados)
- A Pluggy é um **participante registrado do Open Finance** junto ao Banco Central
- Nenhuma credencial bruta é armazenada — apenas tokens OAuth com escopo limitado
- Dados criptografados em trânsito e em repouso
