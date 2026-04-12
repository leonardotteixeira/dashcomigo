# Test Guide: Google OAuth + PF/PJ + Investments

## 🎯 Quick Start Testing

### Prerequisites
- Dev server running on `http://localhost:5175`
- PocketBase instance accessible (check VITE_POCKETBASE_URL in .env)
- Valid Google OAuth credentials configured (Client ID: 567720000578-bmu0tusp9vdd2opqvev7m5l388oit3lh.apps.googleusercontent.com)

---

## 🔐 1. Google OAuth Testing

### Test: Login with Google
1. Navigate to `http://localhost:5175/login`
2. Click "Continuar com Google" button
3. **Expected Result**: 
   - ✅ Google login popup appears
   - ✅ User can select/enter Google account
   - ✅ After login, redirects to `/app` (dashboard) or `/app/onboarding` if new user
   - ✅ User name and email appear in navigation

### Troubleshooting OAuth Issues
If you see error "Invalid token specified: must be a string":
1. Check browser console for specific error messages
2. Verify Google Client ID is correct in `src/app/App.tsx` line 19
3. Verify `@react-oauth/google` is installed (should be in node_modules)
4. Check that `GoogleOAuthProvider` wraps the entire app in `App.tsx`

### What OAuth Does
- Decodes Google JWT token to extract: email, name, picture
- Creates user in PocketBase with email as initial password
- Handles both new user registration and existing user login
- Stores auth token in PocketBase for future requests

---

## 💰 2. PF/PJ (Pessoa Física vs Jurídica) Testing

### Test A: Auto-Classification During Transaction Creation
1. Navigate to `/app` (FluxoCaixa)
2. Click "Nova Transação"
3. Fill in form:
   - **Description**: "Salário referente ao mês" (should auto-classify as PF)
   - **Value**: 5000
   - **Type**: Entrada (Income)
   - **Category**: Select any
   - **Date**: Today

4. **Expected Result**:
   - ✅ Form auto-suggests "👤 PF" (shows purple badge)
   - ✅ If confidence > 70%, no warning appears
   - ✅ After save, transaction shows PF badge in table

### Test B: Test PJ Classification
1. Click "Nova Transação" again
2. Fill in form:
   - **Description**: "Pagamento fornecedor nota fiscal NF-123"
   - **Value**: 2500
   - **Type**: Saída (Expense)
   - **Category**: Fornecedores/Mercadorias
   - **Date**: Today

3. **Expected Result**:
   - ✅ Form auto-suggests "🏢 PJ" (shows blue badge)
   - ✅ Transaction appears with PJ badge

### Test C: Low-Confidence Classification
1. Click "Nova Transação"
2. Fill in form:
   - **Description**: "Xxx" (ambiguous)
   - **Value**: 150
   - **Type**: Saída
   - **Category**: Any
   - **Date**: Today

3. **Expected Result**:
   - ✅ Shows a confidence score (should be ~55%)
   - ✅ Shows ⚠️ AlertTriangle if score < 70%
   - ✅ User can still override by selecting manually

### Test D: Tab Filtering
1. Create at least 2 transactions (1 PF, 1 PJ)
2. Click "🏢 Empresa (PJ)" tab
3. **Expected Result**:
   - ✅ Only PJ transactions visible
   - ✅ KPI cards show "Receitas Empresa", "Despesas Empresa", "Caixa Real da Empresa"
   - ✅ Summary split cards hidden

4. Click "👤 Pessoal (PF)" tab
5. **Expected Result**:
   - ✅ Only PF transactions visible
   - ✅ KPI cards show "Receitas Pessoais", "Despesas Pessoais", "Saldo Pessoal"

6. Click "Todos" tab
7. **Expected Result**:
   - ✅ All transactions visible
   - ✅ Summary split cards show side-by-side:
     - Left: "Empresa (PJ)" with blue icon
     - Right: "Pessoal (PF)" with purple icon

### Test E: Export with PF/PJ
1. Click "Exportar XLSX"
2. Open exported file in Excel/Sheets
3. **Expected Result**:
   - ✅ CSV has columns: Data, Descrição, Categoria, Tipo, PF/PJ, Valor
   - ✅ PF/PJ column shows "PF" or "PJ" for each transaction

### Test F: PF/PJ Confidence Indicator
1. Create a transaction with ambiguous description (e.g., "Xyz")
2. If confidence < 70%, check:
   - ✅ ⚠️ AlertTriangle icon appears in transaction table
   - ✅ Hovering shows "Confiança: X%"
   - ✅ You can click to edit and manually select correct type

### What PF/PJ Does
- **PF (Pessoa Física)**: Personal money, withdrawals, salaries, personal expenses
- **PJ (Jurídica)**: Business money, revenues, business expenses
- **Classification happens via**:
  1. Keywords in description (see `HEURISTICS` in `src/app/pages/FluxoCaixa.tsx`)
  2. Transaction value (< R$100 = likely PF, > R$2000 = likely PJ)
  3. Transaction type (entrada/saida)
  4. Custom user rules (future feature, UI ready)

---

## 📈 3. Investment Recommendations Testing

### Test A: Navigate to Recommendations Page
1. From dashboard, navigate to `/app/recomendacoes-investimento`
2. **Expected Result**:
   - ✅ Page loads with heading "Recomendações de Investimento"
   - ✅ Disclaimer warning is visible
   - ✅ Two-column layout: questionnaire on left, info on right

### Test B: Fill Questionnaire
1. Answer the questions:
   - **Experience**: Select "Intermediário"
   - **Risk Tolerance**: Select "Moderado"
   - **Time Horizon**: Enter "10" years
   - **Investment Goal**: Select any

2. Click "Gerar Recomendações"

3. **Expected Result**:
   - ✅ Calculates available amount (from cash flow)
   - ✅ Determines risk profile: "Moderado" (should match tolerance)
   - ✅ Shows allocation breakdown with 3 buckets

### Test C: Review Available Funds Calculation
In the right column, verify the breakdown shows:
```
Saldo Atual:           R$ XXXX
Fundo Emergência (-):  R$ XXXX (3 months of avg expenses)
Capital Giro (-):      R$ XXXX (30 days of avg expenses)
Obrigações 30d (-):    R$ 0 (no upcoming obligations yet)
─────────────────────────────
Disponível para Investir: R$ XXXX
```

### Test D: Review Allocation Visual
After submitting questionnaire, you should see:
- **3 colored boxes** showing percentage split
- **For Moderado profile**: 30% Curto Prazo, 40% Médio Prazo, 30% Longo Prazo
- Each box shows: percentage + amount in R$

### Test E: Review Investment Cards
Scroll down to see three sections:

#### ⏱️ Curto Prazo (up to 1 year)
Expected cards:
- ✅ Tesouro SELIC
  - Return: ~4.4% p.a.
  - Risk: Mínimo (minimum)
  - Can invest from R$ 30

#### 📈 Médio Prazo (1-5 years)
Expected cards:
- ✅ CDB
  - Return: ~6.5% p.a.
  - Risk: Baixo (low)

#### 🚀 Longo Prazo (5+ years)
Expected cards:
- ✅ Fundo Imobiliário (FII)
  - Return: ~8.2% p.a.
  - Risk: Médio (medium)

### Test F: Click Investment Card
1. Click on "Tesouro SELIC" card
2. **Expected Result**:
   - ✅ Shows full description
   - ✅ Shows "How it works" explanation
   - ✅ Lists pros and cons
   - ✅ Has "Saiba mais" link to external provider

### Test G: Test Disclaimer
1. Scroll to top of page
2. **Expected Result**:
   - ✅ Warning icon and "AVISO IMPORTANTE" text
   - ✅ Shows: "não é aconselhamento profissional"
   - ✅ Lists what's NOT recommended (derivativos, forex, cripto, etc)

### Test H: Test Low-Funds Scenario
1. If available funds < R$ 5,000:
   - ✅ Risk profile should force to "Conservador" (safe)
   - ✅ Shows warning: "Com pouco disponível, recomendamos investimentos conservadores"

### What Investments Does
- **Calculates** how much you can safely invest without touching emergency funds
- **Detects** your risk tolerance based on experience and time horizon
- **Allocates** across 3 time horizons (short/medium/long)
- **Recommends** investment products appropriate for each bucket
- **Shows** expected returns (educational only, not guaranteed)

---

## 📊 4. Dashboard Integration Testing (TODO)

> Currently, Dashboard doesn't have PF/PJ and Investment cards yet.
> This is planned for Phase 2.

Expected features (when implemented):
- [ ] PF/PJ split summary card on main dashboard
- [ ] "Available to Invest" card (links to recomendacoes-investimento)
- [ ] Quick-access to fluxo-de-caixa from dashboard

---

## 🐛 Debugging Tips

### Enable Console Logging
In browser DevTools (F12):
1. Open Console tab
2. Look for `[OAuth]`, `[GoogleLoginButton]`, `[PFPJ]`, `[Investments]` logs
3. These show what's happening behind the scenes

### Check Network Requests
1. Open DevTools → Network tab
2. Try Google login
3. Look for:
   - ✅ POST to `/api/collections/profiles/auth-with-password` (new user creation)
   - ✅ POST to `/api/collections/profiles/authWithPassword` (login)
4. Response should have `token` and `record` fields

### Verify PocketBase Connection
1. Open DevTools → Console
2. Type: `console.log(pb.authStore.record)`
3. Should show logged-in user object with id, email, name fields

### Check Transaction Creation
1. Create a transaction
2. DevTools → Network tab
3. Should see: `POST /api/collections/transactions/records`
4. Check request body includes `pf_pj_type` field

---

## 📋 Test Checklist

### Google OAuth
- [ ] Login button visible on /login
- [ ] Google popup opens when clicked
- [ ] Redirects correctly after login
- [ ] User is created in PocketBase
- [ ] User name shows in navigation
- [ ] Can logout and log back in

### PF/PJ Classification
- [ ] Auto-suggests PF for "salário" in description
- [ ] Auto-suggests PJ for "fornecedor" in description
- [ ] Shows confidence score in form
- [ ] ⚠️ Alert shows when confidence < 70%
- [ ] Tabs filter transactions correctly
- [ ] KPI labels change based on selected tab
- [ ] Summary split visible in "Todos" view
- [ ] Export includes PF/PJ column
- [ ] Can manually override classification

### Investments
- [ ] Page loads at /app/recomendacoes-investimento
- [ ] Questionnaire is visible
- [ ] All 4 questions are answerable
- [ ] "Gerar Recomendações" button works
- [ ] Available calculation shows breakdown
- [ ] Allocation shows 3 buckets
- [ ] Investment cards show for each bucket
- [ ] Cards have external links
- [ ] Disclaimer is visible
- [ ] Can refill questionnaire
- [ ] Risk profile changes with different answers

---

## 🚀 What to Do Next

1. **Run the dev server** (already running on 5175)
2. **Open browser** at http://localhost:5175
3. **Test Google OAuth** first (login flow)
4. **Create some transactions** with varied descriptions
5. **Test PF/PJ tabs** and filtering
6. **Navigate to investments** and complete questionnaire
7. **Document any issues** found

---

## 📞 Common Issues & Solutions

### Issue: "Port 5173/5174 in use"
**Solution**: Dev server automatically tries next available port (5175, 5176, etc)

### Issue: Google login fails with "Invalid token"
**Solution**: 
- Check Client ID in App.tsx matches Google Console
- Ensure @react-oauth/google is installed
- Clear browser cache and try again

### Issue: PF/PJ classification always PJ
**Solution**:
- Check keywords in HEURISTICS match your descriptions
- Try description with clearer keywords (e.g., "salário", "fornecedor")
- Manually select correct type until rules improve

### Issue: Investment recommendations page blank
**Solution**:
- Ensure you're logged in
- Check browser console for errors
- Verify CashFlow context has loaded transactions

### Issue: Missing PF/PJ in database
**Solution** (if you're admin):
1. Add fields to PocketBase `transactions` collection:
   - pf_pj_type: select field with "pf", "pj", "misto" options
   - pf_pj_confidence: number field (0-100)
   - pf_pj_suggested_by: select field with "user", "ai", "rule" options
2. Set defaults: pf_pj_type = "pj", pf_pj_confidence = 100

---

## 📞 Still Stuck?

Check these files for implementation details:
- Google OAuth: `src/app/pages/Login.tsx`, `src/app/contexts/AuthContext.tsx`
- PF/PJ: `src/app/pages/FluxoCaixa.tsx`, `src/app/contexts/PFPJContext.tsx`
- Investments: `src/app/pages/RecomendacoesInvestimento.tsx`, `src/app/contexts/InvestmentsContext.tsx`
- Types: `src/app/types/pfpj.ts`, `src/app/types/investments.ts`
