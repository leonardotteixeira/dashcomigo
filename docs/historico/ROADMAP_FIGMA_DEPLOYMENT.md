# 🎯 ROADMAP - Deployment Figma Design (100% Exato)

**Status:** Em Progresso | **Data:** Abril 2026 | **Progresso:** 1/15 páginas

---

## 📋 PÁGINAS A REFATORAR (DO FIGMA)

### ✅ COMPLETAS (1)
- [x] **Home.tsx** → LandingPage.tsx (Commit ca2345f)

### 🔄 PENDENTES (14)

#### **TIER 1: AUTH & CORE PAGES (2 páginas)**
Priority: CRÍTICO - Necessário para entrada ao app

- [ ] **Login.tsx**
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/Login.tsx`
  - Mapeamento: `src/app/pages/Login.tsx`
  - Dependências: Nenhuma
  - Estimado: 30 min

- [ ] **NotFound.tsx** (Página 404)
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/NotFound.tsx`
  - Mapeamento: `src/app/pages/NotFound.tsx`
  - Dependências: Nenhuma
  - Estimado: 15 min

---

#### **TIER 2: DASHBOARD & CORE FEATURES (4 páginas)**
Priority: ALTA - Páginas principais do app

- [ ] **Dashboard.tsx**
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/Dashboard.tsx`
  - Mapeamento: `src/app/pages/Dashboard.tsx`
  - Dependências: CashFlow, Investments
  - Estimado: 45 min

- [ ] **CashFlow.tsx** (Fluxo de Caixa)
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/CashFlow.tsx`
  - Mapeamento: `src/app/pages/FluxoCaixa.tsx` → renomear ou atualizar rota
  - Dependências: Nenhuma
  - Estimado: 45 min

- [ ] **AccountsPayable.tsx** (Contas a Pagar)
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/AccountsPayable.tsx`
  - Mapeamento: `src/app/pages/ContasAPagar.tsx` → atualizar
  - Dependências: Nenhuma
  - Estimado: 30 min

- [ ] **AccountsReceivable.tsx** (Contas a Receber)
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/AccountsReceivable.tsx`
  - Mapeamento: `src/app/pages/ContasAReceber.tsx` → atualizar
  - Dependências: Nenhuma
  - Estimado: 30 min

---

#### **TIER 3: FEATURES & MANAGEMENT (5 páginas)**
Priority: MÉDIA - Funcionalidades específicas

- [ ] **Customers.tsx** (Meus Clientes)
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/Customers.tsx`
  - Mapeamento: `src/app/pages/Clientes.tsx` → atualizar
  - Dependências: Nenhuma
  - Estimado: 30 min

- [ ] **Suppliers.tsx** (Fornecedores)
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/Suppliers.tsx`
  - Mapeamento: `src/app/pages/Suppliers.tsx` ✅ (já existe)
  - Dependências: Nenhuma
  - Estimado: 30 min

- [ ] **Reports.tsx** (Relatórios)
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/Reports.tsx`
  - Mapeamento: `src/app/pages/RelatoriosFinanceiros.tsx` → atualizar
  - Dependências: Nenhuma
  - Estimado: 60 min (complexo)

- [ ] **Budgets.tsx** (Orçamentos)
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/Budgets.tsx`
  - Mapeamento: `src/app/pages/Orcamentos.tsx` → atualizar
  - Dependências: Nenhuma
  - Estimado: 30 min

- [ ] **Simulators.tsx** (Simuladores)
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/Simulators.tsx`
  - Mapeamento: `src/app/pages/Simuladores.tsx` → criar/atualizar
  - Dependências: Nenhuma
  - Estimado: 45 min

---

#### **TIER 4: SETTINGS & EXTRAS (3 páginas)**
Priority: BAIXA - Páginas secundárias

- [ ] **Profile.tsx** (Perfil do Usuário)
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/Profile.tsx`
  - Mapeamento: `src/app/pages/Profile.tsx`
  - Dependências: Nenhuma
  - Estimado: 30 min

- [ ] **Investments.tsx** (Investimentos)
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/Investments.tsx`
  - Mapeamento: `src/app/pages/Investimentos.tsx` → atualizar/criar
  - Dependências: Nenhuma
  - Estimado: 45 min

- [ ] **Features.tsx** (Página de Funcionalidades)
  - Status: Pendente
  - Arquivo Figma: `/novo layout/src/app/pages/Features.tsx`
  - Mapeamento: `src/app/pages/Features.tsx` → criar nova
  - Dependências: Nenhuma
  - Estimado: 45 min

---

## 📊 TIMELINE PROPOSTO

### **SEMANA 1: TIER 1 + TIER 2 (Crítico)**
- **Dia 1-2**: Login + NotFound (1h)
- **Dia 3-5**: Dashboard + CashFlow + Accounts (3h)
- **Status**: ~50% do trabalho crítico completo

### **SEMANA 2: TIER 3 (Features)**
- **Dia 1-3**: Customers + Suppliers + Reports (2h 15m)
- **Dia 4-5**: Budgets + Simulators (1h 15m)
- **Status**: ~80% completo

### **SEMANA 3: TIER 4 (Extras)**
- **Dia 1-3**: Profile + Investments + Features (1h 45m)
- **Status**: **100% COMPLETO** 🎉

---

## 🚀 INSTRUÇÕES PARA CADA PÁGINA

### Processo Padrão (REPETIR PARA CADA PÁGINA):

1. **Ler arquivo do Figma**
   ```bash
   cat "novo layout/src/app/pages/[PAGE].tsx"
   ```

2. **Copiar conteúdo para projeto atual**
   ```bash
   cp "novo layout/src/app/pages/[PAGE].tsx" "src/app/pages/[PAGE_MAPPED].tsx"
   ```

3. **Fazer build**
   ```bash
   npm run build
   ```

4. **Commit & Push**
   ```bash
   git add src/app/pages/[PAGE_MAPPED].tsx
   git commit -m "Deploy [PAGE_NAME] from Figma design"
   git push origin main
   ```

5. **Marcar como completa neste roadmap** ✅

---

## ✅ CHECKLIST DE CONCLUSÃO

- [ ] Todas 15 páginas copiadas do Figma
- [ ] Build executado com sucesso para cada página
- [ ] Commits feitos para cada página
- [ ] Railway fez deploy de todas as mudanças
- [ ] QA: Testar todas as páginas no navegador
- [ ] Responsive: Verificar em mobile/tablet/desktop
- [ ] Documente qualquer discrepância do Figma encontrada

---

## 📝 NOTAS

- Copiar é MAIS RÁPIDO que refatorar página por página
- Total estimado: **8-10 horas de trabalho** (30-60 min por página)
- Railway fará deploy automático após cada push
- Não é necessário fazer alterações, apenas copiar exatamente do Figma

---

**Última atualização:** 2026-04-08  
**Próximo passo:** Começar com Tier 1 (Login + NotFound)
