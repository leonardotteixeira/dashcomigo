# Produto — Dashcomigo

---

## O que é o Dashcomigo?

O Dashcomigo é uma **plataforma web de gestão financeira** para MEIs e pequenos empresários brasileiros. Centraliza toda a atividade financeira — transações, fluxo de caixa, contas a receber, contas a pagar e investimentos — em um único painel inteligente.

A plataforma se conecta diretamente às contas bancárias brasileiras via **Open Finance (Pluggy)**, transformando dados brutos do banco em inteligência financeira acionável.

---

## O que Faz Hoje

### 1. Dashboard

O centro de controle principal. Mostra de forma imediata:

- Saldo atual em caixa (tempo real)
- Total de contas a receber e a pagar
- Receita mensal versus despesas
- Status da conexão Open Finance
- Alertas e notificações inteligentes

### 2. Gestão de Fluxo de Caixa

- Importação automática de transações bancárias via Open Finance
- Lançamento manual de transações
- Classificação automática: receita versus despesa, PF versus PJ (pessoal versus empresarial)
- Gráfico de evolução mensal
- Detalhamento por categoria

### 3. Contas a Pagar

- Controle de boletos, faturas e obrigações
- Gestão de status: pendente, pago, vencido
- Alertas de vencimento
- Categorização por fornecedor

### 4. Contas a Receber

- Controle de pagamentos de clientes e receitas previstas
- Alertas de inadimplência
- Visão de recebíveis por cliente

### 5. Carteira de Investimentos (Open Finance)

- Portfólio real importado diretamente dos bancos via Open Finance
- Suporte a: Renda Fixa, Ações, ETFs, Fundos de Investimento, Previdência, FIIs, COEs, Criptomoedas
- Resumo da carteira: total investido, valor atual, rentabilidade absoluta e percentual
- Distribuição por tipo de ativo
- Comparação com benchmark CDI
- Para usuários sem Open Finance: sugestões curadas de investimentos (Tesouro Direto, CDB, LCI/LCA, Fundos)

### 6. Relatórios Financeiros (PRO)

- Relatórios financeiros avançados com:
  - Análise de receitas versus despesas por 3, 6 ou 12 meses
  - Tabela mensal de resultado
  - Gráficos de composição por categoria
  - Análise de tendência de despesas
  - Previsão de fluxo de caixa (próximos 30 dias)
  - Seção de análise de investimentos (portfólio versus CDI, gráfico de alocação de ativos)
- Exportação para Excel (XLSX) e PDF

### 7. Gestão de Clientes

- Cadastro de clientes
- Atribuição de receita por cliente
- Visão de rentabilidade por cliente

### 8. Gestão de Fornecedores

- Cadastro de fornecedores
- Controle de despesas por fornecedor

### 9. Propostas

- Criação e envio de propostas comerciais
- Acompanhamento de status das propostas

### 10. Imposto MEI (DAS)

- Simulação e lembretes de pagamento do DAS
- Controle de faturamento versus limite anual do MEI

### 11. Simuladores

- Simuladores de cenários financeiros para planejamento

---

## O que Fará — A Visão Open Finance

O Open Finance é a camada de infraestrutura que transforma o Dashcomigo de uma ferramenta de registro manual em um **motor automático de inteligência financeira**.

### Curto Prazo (Em Desenvolvimento Ativo)

- Conexão bancária via widget Pluggy
- Importação e classificação automática de transações
- Importação de carteira de investimentos (dados reais dos bancos)
- Sincronização periódica em segundo plano (a cada 6 horas)
- Agregação de múltiplas contas (vários bancos, uma visão única)
- Deduplicação inteligente entre conexões

### Médio Prazo

- Alertas em tempo real ("Seu DAS vence em 5 dias e seu saldo é R$ X")
- Previsão de fluxo de caixa baseada em padrões de transações recorrentes
- Separação automática de despesas PF/PJ
- Recomendações de investimento baseadas no caixa disponível
- Comparativo: "Sua carteira versus empreendedores com faturamento similar"

### Longo Prazo

- Camada de assessoria financeira com inteligência artificial
- Simulação de score de crédito e elegibilidade a empréstimos
- Integração com marketplace de produtos financeiros (seguro, crédito, investimentos)
- Auxílio ao preenchimento e pagamento automático do DAS
- Gestão multi-empresa (para empreendedores com mais de um negócio)

---

## Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Banco de Dados | PocketBase (hospedado em nuvem) |
| Open Finance | Pluggy SDK (Open Finance Brasil) |
| Gráficos | Recharts |
| Autenticação | PocketBase Auth + Google OAuth |
| Pagamentos | Stripe / Asaas |
| Hospedagem | Railway (backend + banco de dados) |

---

## Perfil do Usuário

**Principal:** MEI brasileiro (Microempreendedor Individual)

- Autônomos com faturamento de até R$ 81.000 por ano
- Mais de 15 milhões de cadastros ativos no Brasil
- Gerenciam as finanças via WhatsApp, planilhas ou simplesmente não gerenciam

**Secundário:** Pequenos empresários (ME, EPP)

- 1 a 20 funcionários
- Precisam de gestão financeira básica sem a complexidade de sistemas corporativos

**Terciário:** Freelancers e profissionais autônomos

- Renda variável, múltiplos clientes
- Necessidade de separar finanças pessoais das profissionais
