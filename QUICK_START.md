# Quick Start Verification

## ✅ Pre-Flight Checklist

### Step 1: Verify Server is Running
```bash
# Dev server should be running on port 5175
curl http://localhost:5175
```
Expected: Page loads (or check browser at http://localhost:5175)

### Step 2: Verify Dependencies Installed
```bash
# Check if @react-oauth/google is installed
npm list @react-oauth/google
```
Expected: Shows version 0.13.5 or higher

```bash
# Check if jwt-decode is installed
npm list jwt-decode
```
Expected: Shows version 4.0.0 or higher

### Step 3: Verify Google OAuth Setup
Edit `src/app/App.tsx` and confirm:
- Line 19: Has valid Google Client ID
- Line 23: GoogleOAuthProvider wraps the app
- Current Client ID: `567720000578-bmu0tusp9vdd2opqvev7m5l388oit3lh.apps.googleusercontent.com`

### Step 4: Verify PF/PJ Setup
Check these files exist:
- ✅ `src/app/contexts/PFPJContext.tsx`
- ✅ `src/app/types/pfpj.ts`
- ✅ `src/app/pages/FluxoCaixa.tsx` (has PF/PJ functionality)

### Step 5: Verify Investments Setup
Check these files exist:
- ✅ `src/app/contexts/InvestmentsContext.tsx`
- ✅ `src/app/types/investments.ts`
- ✅ `src/app/pages/RecomendacoesInvestimento.tsx`
- ✅ `src/app/components/Investments/` (has all 5 component files)

---

## 🎮 Quick Feature Test (5 minutes)

### Test 1: Google OAuth (1 min)
```
1. Open: http://localhost:5175/login
2. Look for: "Continuar com Google" button
3. Expected: Button visible and clickable
✅ PASS if button appears
```

### Test 2: PF/PJ Classification (2 min)
```
1. Open: http://localhost:5175/app
2. Click: "Nova Transação"
3. Type Description: "salário do mês"
4. Type Value: 5000
5. Select Type: Entrada
6. Expected: Form shows "👤 PF" badge auto-selected
✅ PASS if PF badge appears automatically
```

### Test 3: Investment Recommendations (2 min)
```
1. Open: http://localhost:5175/app/recomendacoes-investimento
2. Expected: Page loads with questionnaire visible
3. Select answers and click "Gerar Recomendações"
4. Expected: Shows allocation with 3 buckets and investment cards
✅ PASS if recommendations page loads and shows data
```

---

## 🔧 Troubleshooting Quick Fixes

### Issue: "localhost:5175 connection refused"
```bash
# Check if dev server is running
npm run dev
# Should see "ready in XXX ms" message
```

### Issue: "Google button not appearing"
```
1. Check browser console (F12 → Console)
2. Look for error messages containing "OAuth" or "Google"
3. Verify VITE_POCKETBASE_URL is set in .env
4. Restart dev server: npm run dev
```

### Issue: "PF/PJ classification not working"
```
1. Check if you're logged in (should see name in top right)
2. Create transaction with clear keywords: "salário" or "fornecedor"
3. Check browser console for [PFPJ] debug messages
4. Verify transaction saves (check if it appears in table)
```

### Issue: "Investment page is blank"
```
1. Check browser console for errors
2. Verify you have some transactions in FluxoCaixa
3. Try refreshing the page
4. Check that CashFlow context has loaded data
```

---

## 📋 What's Working

| Feature | Status | Evidence |
|---------|--------|----------|
| **Google OAuth Button** | ✅ Ready | Visible at /login |
| **Google Login Flow** | ✅ Ready | Opens popup, redirects |
| **PF/PJ Auto-Classification** | ✅ Ready | Auto-selects in form |
| **PF/PJ Filtering** | ✅ Ready | Tabs appear in FluxoCaixa |
| **PF/PJ KPI Labels** | ✅ Ready | Change based on selected tab |
| **PF/PJ Badges** | ✅ Ready | Show 👤 or 🏢 in table |
| **Investment Questionnaire** | ✅ Ready | Form loads and submits |
| **Investment Allocation** | ✅ Ready | Shows 3 buckets with % |
| **Investment Cards** | ✅ Ready | Lists Tesouro, CDB, FII |
| **Dashboard Integration** | ⏳ Phase 2 | Cards not yet added |

---

## 📞 Three Documentation Files to Read

1. **TEST_GUIDE.md** (if you want detailed testing steps)
   - Read this for step-by-step tests of each feature
   - Includes expected results and troubleshooting

2. **IMPLEMENTATION_STATUS.md** (if you want technical details)
   - Read this for architecture overview
   - Lists all files, components, and their purpose
   - Shows database schema requirements

3. **README_FEATURES.md** (if you want feature overview)
   - Read this for user-friendly explanation
   - Shows how end users will use features
   - Includes sample user flows

---

## 🎯 What To Do Now

### Option A: Just Verify Everything Works (10 min)
1. Run Quick Feature Test above
2. Check ✅ marks for all three tests
3. Done! Everything is working

### Option B: Test Thoroughly (30 min)
1. Open TEST_GUIDE.md
2. Follow each test section
3. Verify all expected results
4. Note any issues found

### Option C: Understand the Code (1 hour)
1. Read IMPLEMENTATION_STATUS.md for architecture
2. Open relevant source files mentioned
3. Read through context and component code
4. Understand how features integrate

### Option D: Deploy & Launch (varies)
1. Verify database schema matches IMPLEMENTATION_STATUS.md
2. Run full TEST_GUIDE.md test suite
3. Fix any issues found
4. Deploy to production
5. Monitor error logs

---

## 💾 Key Files Reference

**Quick Lookup for Common Questions:**

**Q: How do I add more investment products?**
A: Edit `src/app/types/investments.ts`, array `DEFAULT_RECOMMENDATIONS` (around line 205)

**Q: How do I improve PF/PJ classification?**
A: Edit `src/app/pages/FluxoCaixa.tsx`, arrays `PF_KEYWORDS` and `PJ_KEYWORDS` (lines 24-36)

**Q: How do I change Google Client ID?**
A: Edit `src/app/App.tsx` line 19, variable `googleClientId`

**Q: How do I add new risk profiles?**
A: Edit `src/app/types/investments.ts`, object `ALLOCATION_CONFIG` (around line 184)

**Q: How does PF/PJ classification work?**
A: Read function `classifyPfPj()` in `src/app/pages/FluxoCaixa.tsx` (lines 38-63)

**Q: How does investment recommendation work?**
A: Read function `getRecommendations()` in `src/app/contexts/InvestmentsContext.tsx` (lines 131-205)

---

## ✨ Summary

You now have a modern SaaS with:
✅ Google OAuth (no password hassle)
✅ Smart PF/PJ Separation (clear business finances)
✅ Investment Recommendations (safe growth opportunities)

All implemented, tested, and ready to use!

---

## 🚀 Next: The Choice is Yours

**Option 1: Start Testing Now**
→ Go to http://localhost:5175/login and test the features

**Option 2: Read Documentation First**
→ Open TEST_GUIDE.md for detailed step-by-step instructions

**Option 3: Deploy to Production**
→ Follow IMPLEMENTATION_STATUS.md deployment checklist

**What will it be?** 🎯
