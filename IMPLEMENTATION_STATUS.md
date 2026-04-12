# Implementation Status: Bloco 4 (PF/PJ) + Bloco 5 (Investimentos)

## 📋 Executive Summary

Both Bloco 4 (PF/PJ Separation) and Bloco 5 (Investment Recommendations) have been **substantially implemented** with comprehensive business logic, UI components, and integrations.

---

## ✅ Bloco 4: Separação PF/PJ (Pessoa Física vs Jurídica)

### Architecture

#### **1. Backend/Context Layer**
- ✅ **PFPJContext.tsx** - Complete implementation with:
  - Transaction fetching and caching
  - Heuristic-based classification (keywords + value-based)
  - Confidence scoring system (0-100%)
  - Custom rules engine for user-defined categorization
  - Summary calculations (balance, profit, margins)
  - Transaction type updates and persistence

#### **2. Data Models**
- ✅ **types/pfpj.ts** - Full type definitions:
  - `TransactionWithPFPJ` - Extended transaction with PF/PJ metadata
  - `PFPJSummary` - Aggregated financial summaries
  - `PFPJPrediction` - Classification with confidence
  - `PFPJRule` - Custom categorization rules
  - `HEURISTICS` - Pre-defined classification keywords
  - `PFPJ_CONFIG` - Threshold and configuration constants

#### **3. UI Components**
Located in `src/app/components/FluxoCaixa/`:
- ✅ **PFPJToggle.tsx** - Toggle between Integrated vs Separated view
- ✅ **PFPJSummaryCards.tsx** - Side-by-side PF vs PJ summary cards
- ✅ **TransactionTypeIcon.tsx** - Visual badges (👤 PF, 🏢 PJ)
- ✅ **TransactionFormWithPFPJ.tsx** - Form with PF/PJ classification selector

#### **4. Integration Points**
- ✅ **FluxoCaixa.tsx** (main page):
  - PF/PJ tabs for filtering (Todos, Empresa PJ, Pessoal PF)
  - KPI cards that adapt labels based on selected tab
  - PF vs PJ summary split (visible in "Todos" tab)
  - Auto-classification suggestion during transaction creation
  - Confidence score indicator (⚠️ if < 70%)
  - PF/PJ badges in transaction table
  - Export to XLSX with PF/PJ column

#### **5. Business Logic Features**
- ✅ **Automatic Classification**:
  - Keyword matching (salário, fornecedor, etc)
  - Value-based heuristics (< R$100 = PF likely, > R$2000 = PJ likely)
  - Confidence scoring
  - Review alert for low-confidence (< 70%)

- ✅ **Custom Rules**:
  - Create rules like "Internet = PJ"
  - Rules can match on: description, category, amount
  - Operators: contains, equals, startsWith, gt, lt
  - Enable/disable individual rules

- ✅ **Summary Calculations**:
  - Separate total incoming/outgoing by type
  - Calculate profit margin per type
  - Category breakdown within each type
  - Period-based filtering

### Current Status
**READY FOR TESTING** ✅
- All components implemented
- Context fully functional
- Integration complete in FluxoCaixa page
- Ready for database schema verification

### Testing Checklist
- [ ] Verify PocketBase has `pf_pj_type` field in transactions collection
- [ ] Add a transaction and verify auto-classification works
- [ ] Test PF/PJ tabs filter correctly
- [ ] Test confidence score < 70% shows warning
- [ ] Create custom rule and verify it applies to new transactions
- [ ] Test export includes PF/PJ column
- [ ] Verify summary cards show correct split in "Todos" view

---

## ✅ Bloco 5: Recomendações de Investimento

### Architecture

#### **1. Backend/Context Layer**
- ✅ **InvestmentsContext.tsx** - Complete implementation with:
  - Available funds calculation (emergency fund - working capital - obligations)
  - Risk profile detection algorithm
  - Investment allocation by time horizon
  - Projected annual return calculations
  - Integration with CashFlow context for real data

#### **2. Data Models**
- ✅ **types/investments.ts** - Full type definitions:
  - `InvestmentProfile` - User's investment profile
  - `InvestmentRecommendation` - Investment products with details
  - `InvestmentAllocation` - Bucket-based allocation (curto/medio/longo prazo)
  - `AvailableCalculation` - Detailed breakdown of available funds
  - `ALLOCATION_CONFIG` - Risk-profile-based allocation percentages
  - `DEFAULT_RECOMMENDATIONS` - Pre-defined investment options
  - `INVESTMENT_DISCLAIMER` - Legal disclaimer text

#### **3. UI Components**
Located in `src/app/components/Investments/`:
- ✅ **QuestionarioRisco.tsx** - 5-question risk profile quiz
  - Questions on experience, tolerance, time horizon
  - Produces risk score for profile detection

- ✅ **CalculadoraDisponivel.tsx** - Visual breakdown of available funds
  - Shows: Current balance → - Emergency Fund → - Working Capital → = Available
  - Step-by-step calculation display
  - Projected annual returns

- ✅ **AlocacaoVisual.tsx** - 3-bucket visualization
  - Curto prazo (short-term)
  - Médio prazo (medium-term)
  - Longo prazo (long-term)
  - Shows amounts and percentages

- ✅ **InvestmentCard.tsx** - Individual investment product card
  - Name, description, expected return, risk level
  - How it works explanation
  - Pros/cons list
  - Link to external provider

- ✅ **DisclaimerAviso.tsx** - Legal warning about educational nature

#### **4. Integration Points**
- ✅ **RecomendacoesInvestimento.tsx** (main page):
  - Multi-step flow: Questionnaire → Recommendations
  - Risk profile detection
  - Investment allocation generation
  - Recommended actions (next steps)
  - Refill/return to dashboard options

- ✅ **Routes Configuration**:
  - `/app/investimentos` → GuiaInvestimentos (guide page)
  - `/app/recomendacoes-investimento` → RecomendacoesInvestimento (main feature)

- ✅ **App.tsx**:
  - InvestmentsProvider wrapper around entire app
  - Context available to all components

#### **5. Business Logic Features**
- ✅ **Available Funds Calculation**:
  ```
  Available = Current Balance
             - Emergency Fund (3 months of avg expenses)
             - Minimum Working Capital (30 days of avg expenses)
             - Upcoming Obligations (next 30 days)
  ```

- ✅ **Risk Profile Detection**:
  - Scores based on experience (1-3 points)
  - Scores based on risk tolerance (1-3 points)
  - Scores based on time horizon (1-3 points)
  - Total 3-9: maps to Conservador/Moderado/Agressivo

- ✅ **Allocation Strategy**:
  - **Conservador**: 50% curto, 35% médio, 15% longo
  - **Moderado**: 30% curto, 40% médio, 30% longo
  - **Agressivo**: 20% curto, 30% médio, 50% longo
  - Forced to Conservador if available < R$ 5,000

- ✅ **Investment Recommendations**:
  - **Curto Prazo**: Tesouro SELIC, Poupança
  - **Médio Prazo**: CDB, Tesouro Prefixado
  - **Longo Prazo**: FII, Tesouro Prefixado
  - Each with expected return, risk level, pros/cons, external links

### Current Status
**READY FOR TESTING** ✅
- All components implemented
- Context fully functional
- Pages and routes configured
- Recommendations engine complete
- No database collection required (calculations are real-time)

### Testing Checklist
- [ ] Navigate to `/app/recomendacoes-investimento`
- [ ] Answer questionnaire and verify profile detection
- [ ] Check available funds calculation is accurate
- [ ] Verify allocation percentages match selected risk profile
- [ ] Click on investment cards and verify external links work
- [ ] Test disclaimer is displayed
- [ ] Verify "next steps" are shown after recommendations
- [ ] Test "refill questionnaire" button works

---

## 🔄 Integration Status

### Cross-Feature Integration
- ✅ **CashFlowContext + InvestmentsContext**: Real transaction data flows to investment calculation
- ✅ **PFPJContext + CashFlowContext**: PF/PJ classification available in cash flow
- ✅ **App.tsx Providers**: All providers configured in correct order

### Dashboard Integration (TODO)
- ⏳ PF/PJ summary card on Dashboard
- ⏳ "Available to Invest" card that links to RecomendacoesInvestimento
- ⏳ Investment profile quick-access widget

---

## 🗄️ Database Schema Requirements

### Required PocketBase Collections

#### **transactions** collection
Must have fields:
```
- id (primary)
- user_id (foreign key to profiles)
- valor (number)
- tipo (select: "entrada", "saida")
- categoria (text)
- data (date)
- descricao (text, optional)
- pf_pj_type (select: "pf", "pj", "misto") ⚠️ NEW FIELD
- pf_pj_confidence (number, 0-100) ⚠️ NEW FIELD (optional)
- pf_pj_suggested_by (select: "user", "ai", "rule") ⚠️ NEW FIELD (optional)
- attachments (files) ✅ Already exists
- created (timestamp) ✅ Already exists
```

#### **pfpj_rules** collection (NEW)
```
- id (primary)
- userid (foreign key to profiles)
- name (text): "Internet = PJ"
- criteria (json): [{ field, operator, value }, ...]
- classification (select: "pf", "pj", "misto")
- confidence (number, 0-100): boost to apply
- enabled (bool): whether rule is active
- created (timestamp)
- appliedCount (number): tracking
```

### Database Verification Steps
1. ✅ Check if `pf_pj_type` field exists in transactions
   - If not, add it with default value "pj" for backward compatibility
2. ✅ Check if `pf_pj_confidence` field exists
3. ✅ Check if `pfpj_rules` collection exists
   - If not, create it with the schema above

---

## 🚀 Deployment Checklist

### Pre-Launch
- [ ] Verify PocketBase database schema matches requirements above
- [ ] Test Google OAuth flow in browser
- [ ] Test PF/PJ classification with real transactions
- [ ] Test investment questionnaire and recommendations
- [ ] Verify all links in investment cards work
- [ ] Test export XLSX includes PF/PJ data
- [ ] Run lighthouse performance check
- [ ] Test on mobile (tablet + phone)

### Launch
- [ ] Update database with new fields if needed
- [ ] Deploy frontend code
- [ ] Monitor error logs for 24 hours
- [ ] Gather user feedback on PF/PJ classification accuracy
- [ ] Plan for educational content (blog posts, tutorials)

### Post-Launch
- [ ] Monitor PF/PJ classification accuracy in production
- [ ] Refine heuristics based on user behavior
- [ ] Add dashboard cards for quick access to features
- [ ] Collect investment recommendation feedback
- [ ] Plan Phase 2: tracking actual user investments

---

## 📝 Known Limitations & Future Work

### Current Limitations
1. **PF/PJ Classification**: Heuristics-based, may need manual review for edge cases
2. **Investment Recommendations**: Educational only, not integrated with actual brokers yet
3. **Dashboard**: Doesn't yet have PF/PJ and Investment cards (placeholder only)
4. **Mobile**: Full testing needed on smaller screens

### Phase 2 Opportunities
1. **User Investment Tracking**: Store which recommendations user has invested in
2. **Portfolio Rebalancing**: Alert when allocation drifts from recommended
3. **Performance Dashboard**: Track returns of recommended investments over time
4. **AI-Powered Rules**: Machine learning to improve PF/PJ classification
5. **Broker Integration**: Direct links to open accounts or execute trades
6. **Tax Planning**: Integration with DAS MEI and tax calculations

---

## 🔗 Relevant Files Summary

### Context Files
- `src/app/contexts/PFPJContext.tsx` - PF/PJ business logic
- `src/app/contexts/InvestmentsContext.tsx` - Investment business logic
- `src/app/contexts/CashFlowContext.tsx` - Cash flow data

### Type Definitions
- `src/app/types/pfpj.ts` - PF/PJ types and constants
- `src/app/types/investments.ts` - Investment types and constants

### Components
- `src/app/components/FluxoCaixa/*.tsx` - PF/PJ UI components
- `src/app/components/Investments/*.tsx` - Investment UI components

### Pages
- `src/app/pages/FluxoCaixa.tsx` - Main cash flow page (integrates PF/PJ)
- `src/app/pages/RecomendacoesInvestimento.tsx` - Investment recommendations page
- `src/app/pages/GuiaInvestimentos.tsx` - Investment education guide

### Routes
- `src/app/routes.tsx` - Path `/app/investimentos` and `/app/recomendacoes-investimento`

---

## ✉️ Questions?

For implementation details, refer to:
1. The type definitions in `types/pfpj.ts` and `types/investments.ts`
2. Business logic in respective Context files
3. UI implementation in components directories
4. Integration examples in main pages (FluxoCaixa.tsx, RecomendacoesInvestimento.tsx)
