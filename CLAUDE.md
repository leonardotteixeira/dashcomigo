# CLAUDE.md — guia para agentes de IA neste repositório

Este arquivo é lido pelo Claude Code (e serve para qualquer assistente de código) antes de mexer no projeto.

## O que é

DashComigo: SaaS de gestão financeira para MEI. Frontend React 18 + TypeScript + Vite + Tailwind 4 (PWA), API Express em `api/`, dados no PocketBase. Interface e textos em **português do Brasil**.

## Comandos

```bash
npm run dev          # frontend em http://localhost:5173
npm test             # Vitest + Testing Library (obrigatório passar antes de commitar)
npm run typecheck    # tsc --noEmit
npm run build        # build de produção (é o que a Vercel roda)
cd api && npm run dev  # API local na porta 3000
```

## Arquitetura em 30 segundos

- `src/app/pages/*` → uma página por rota; rotas em `src/app/routes.tsx`.
- `src/app/contexts/*` → estado por domínio (CashFlow, Payables, Receivables, Goals, Inventory…). Cada contexto fala com o PocketBase via `src/lib/pocketbase.ts`.
- `src/app/components/*` → UI reutilizável. Componentes de domínio ficam em subpastas (`FluxoCaixa/`, `Investments/`).
- `src/app/utils/*` e `src/utils/*` → **funções puras**, sem side effects. É onde vive a lógica testável.
- `src/utils/featureAccessService.ts` → **única** fonte de verdade dos limites Free vs Pro. Nunca crie constantes de limite em componentes; importe daqui e use `<FeatureGate>`.
- `api/src/routes/*` → endpoints Express. Os que usam IA (`generateProposal.js`, `dailyInsight.js`) chamam a API da Anthropic; os prompts ficam no próprio arquivo.
- `vercel.json` faz rewrite de `/api/*`, `/checkout`, `/webhook/*` etc. para a API no Railway.

## Convenções

- **Commits:** Conventional Commits em inglês (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`). Mensagem curta no título, contexto no corpo se precisar.
- **Componentes:** função nomeada + `export function`, props tipadas com `interface XProps`. Sem `default export` em componentes.
- **Estilo:** Tailwind utilitário. Cores da marca: `#0E3B2E` (verde escuro), `#7FD19F` (verde claro), `#0066FF` (azul de ação). Tokens em `src/utils/designTokens.ts`.
- **Formatação de dinheiro:** sempre `formatCurrency` de `src/app/utils/reportCalculations.ts` (pt-BR, BRL). Não use `toFixed(2)` direto na UI.
- **Datas:** ISO string no PocketBase; `date-fns` para manipular. Timezone do usuário é America/Sao_Paulo.
- **Tipos:** `strict` está desligado no tsconfig por herança do bootstrap do Figma Make; ainda assim, não use `any` em código novo.
- **Idioma:** UI, comentários voltados ao usuário e docs em pt-BR; nomes de variáveis/funções em inglês.

## Testes

- Vitest com `jsdom`; setup em `src/test/setup.ts`; config em `vitest.config.ts` (separada do `vite.config.ts` para não carregar o plugin PWA).
- Teste lógica pura em `__tests__/` ao lado do arquivo. Teste componentes com `@testing-library/react`; componentes que usam `useNavigate` precisam de `<MemoryRouter>`.
- Ao criar ou alterar uma função em `utils/`, adicione ou atualize o teste correspondente.

## O que NÃO fazer

- Não commitar `.env*` (exceto `.env.example`). Chaves de Asaas, Anthropic, Pluggy e PocketBase admin só em variáveis de ambiente.
- Não editar `dist/` — é artefato de build.
- Não remover os plugins `react()` e `tailwindcss()` do `vite.config.ts`.
- Não criar novos arquivos `.md` na raiz; documentação vai em `docs/`.
- Não mudar limites de plano sem atualizar `featureAccessService.ts` **e** os testes em `src/utils/__tests__/`.

## Fluxo de trabalho esperado do agente

1. Ler o contexto do módulo antes de alterar (página → contexto → utils).
2. Fazer a mudança menor possível que resolve o pedido.
3. Rodar `npm test` e `npm run build`. Se quebrar tipo ou teste, corrigir antes de entregar.
4. Descrever no commit o *porquê*, não só o *o quê*.
