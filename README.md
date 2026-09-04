# DashComigo

> Gestão financeira para MEI e microempreendedores — fluxo de caixa, contas a pagar/receber, DAS-MEI, propostas comerciais geradas com IA e Open Finance, num único painel.

[![CI](https://github.com/leonardotteixeira/dashcomigo/actions/workflows/ci.yml/badge.svg)](https://github.com/leonardotteixeira/dashcomigo/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

**Produção:** [dashcomigo.com.br](https://www.dashcomigo.com.br)

---

## O problema

O MEI brasileiro controla o negócio no caderno ou numa planilha que ninguém atualiza. Não sabe se o mês fechou no azul, esquece o DAS, precifica no chute e perde tempo montando proposta no Word. O DashComigo junta isso num app que cabe no celular (PWA) e responde às perguntas que importam: *quanto entrou, quanto saiu, quanto sobrou e o que vence essa semana.*

## Funcionalidades

| Módulo | O que faz |
|---|---|
| **Dashboard** | KPIs do mês (receita, despesa, lucro, margem), gráficos de evolução e *insight diário* gerado por IA sobre a saúde do negócio |
| **Fluxo de caixa** | Lançamentos de entrada/saída com categorias, filtros por período e exportação Excel/CSV/PDF |
| **Contas a pagar / receber** | Vencimentos, status, calendário de obrigações e **lembretes de cobrança automáticos por e-mail** (GitHub Action diário) |
| **Clientes e fornecedores** | Cadastro unificado (CRM leve) usado pelas propostas e contas |
| **Propostas comerciais** | Gerador de propostas em PDF com **texto escrito pela IA** a partir do briefing do usuário |
| **Orçamentos e metas** | Planejamento mensal por categoria e acompanhamento de metas |
| **Estoque** | Itens, movimentações, alerta de estoque mínimo |
| **Simuladores** | MEI vs. ME, precificação, lucro — versões básica (free) e avançada (premium) |
| **DAS-MEI** | Acompanhamento de faturamento anual vs. teto do MEI e link para emissão |
| **Investimentos** | Conexão via **Open Finance** (Pluggy, com Belvo/Plaid como alternativas) e guia de recomendações |
| **Suporte** | Chat interno com priorização por plano e painel admin |
| **Planos** | Free / Pro / Premium com *feature gating* centralizado e checkout via Asaas |

## Arquitetura

```
┌─────────────────────────┐        ┌──────────────────────────┐
│  Frontend (Vercel)      │  REST  │  API Node (Railway)       │
│  React + Vite + TS      │ ─────▶ │  Express                  │
│  PWA (Workbox)          │        │  · checkout / webhook     │
│  react-router 7         │        │  · generate-proposal (IA) │
│  Contexts por domínio   │        │  · daily-insight (IA)     │
└──────────┬──────────────┘        │  · contact / reminders    │
           │ SDK                   └────────────┬─────────────┘
           ▼                                    │
┌─────────────────────────┐                     ▼
│  PocketBase (Railway)   │        ┌──────────────────────────┐
│  auth + 20 coleções     │        │  Serviços externos        │
│  (profiles, transactions│        │  Anthropic · Asaas ·      │
│   proposals, payables…) │        │  Pluggy · Resend · Google │
└─────────────────────────┘        └──────────────────────────┘
```

- **Frontend** — SPA em React 18 + TypeScript, estilizada com Tailwind CSS 4 e componentes Radix/shadcn. Estado por domínio em React Contexts (`CashFlowContext`, `PayablesContext`, `ObligationsContext`…). Empacotada como PWA com precache do shell e *network-first* para dados financeiros. Code-splitting manual dos vendors pesados (recharts, jsPDF, xlsx).
- **Feature gating** — `src/utils/featureAccessService.ts` é a única fonte de verdade dos limites Free/Pro; o componente `<FeatureGate>` aplica blur + CTA de upgrade em qualquer trecho da UI.
- **API** (`api/`) — Express com rate limiting, CORS restrito e webhooks do Asaas. Os endpoints de IA chamam a API da Anthropic (Claude) com prompts versionados no código.
- **Dados** — PocketBase como backend-as-a-service (auth por e-mail e Google OAuth, regras de acesso por coleção). Tipos gerados em `src/lib/database.types.ts`.
- **Automação** — `.github/workflows/send-payment-reminders.yml` dispara diariamente o envio de lembretes de cobrança.

## Rodando localmente

```bash
# pré-requisitos: Node 22+
git clone https://github.com/leonardotteixeira/dashcomigo.git
cd dashcomigo
npm install
cp .env.example .env.local     # preencha as variáveis
npm run dev                    # http://localhost:5173
```

API (opcional, para checkout/IA):

```bash
cd api && npm install && cp .env.example .env && npm run dev
```

Guias detalhados de configuração (PocketBase, Pluggy, Belvo) estão em [`docs/setup/`](docs/setup/).

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build de produção em `dist/` |
| `npm test` | Testes unitários e de componentes (Vitest + Testing Library) |
| `npm run test:watch` | Testes em modo watch |
| `npm run typecheck` | Checagem de tipos sem emitir |

## Testes

Os testes cobrem a lógica de negócio pura (cálculos de relatório, regras de plano, estoque) e componentes de UI críticos (`KPICard`, `FeatureGate`). Rodam em CI a cada push junto com o build.

```
src/app/utils/__tests__/        cálculos financeiros e de estoque
src/utils/__tests__/            regras Free vs Pro
src/app/components/__tests__/   componentes com Testing Library
```

## Estrutura

```
src/
├── app/
│   ├── components/   UI reutilizável (KPICard, FeatureGate, DataTable, FluxoCaixa/…)
│   ├── contexts/     estado por domínio (Auth, CashFlow, Payables, Goals…)
│   ├── pages/        uma página por rota
│   ├── layouts/      shell autenticado e público
│   ├── routes.tsx    árvore de rotas (react-router 7)
│   ├── types/        tipos de domínio
│   └── utils/        funções puras (relatórios, estoque, exportação)
├── lib/              clientes de serviços (pocketbase, pluggy, belvo, plaid)
├── utils/            feature gating, PDF de proposta, métricas financeiras
├── styles/           tokens e CSS global (Tailwind)
└── test/             setup do Vitest
api/                  API Express (checkout, webhooks, IA, contato)
docs/                 guias de setup e histórico de decisões
```

## Roadmap

Ver [`docs/roadmap.md`](docs/roadmap.md) para o estado real de cada funcionalidade (o que está sólido, parcial ou ainda não implementado).

## Status

Projeto pessoal em produção em [dashcomigo.com.br](https://www.dashcomigo.com.br), desenvolvido como parte do meu portfólio e processo de aprendizado. Várias funcionalidades listadas no roadmap ainda estão parciais ou pendentes; o roadmap é a fonte da verdade sobre o que de fato funciona hoje.

## Licença

Código-fonte disponível para fins de portfólio. Todos os direitos reservados © Leonardo Teixeira.
