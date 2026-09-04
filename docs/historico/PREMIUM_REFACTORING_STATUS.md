# Premium Design System Refactoring Status

## Completion Summary

**Date:** April 8, 2026
**Status:** In Progress - 2 of 25+ Pages Complete

## Completed Refactorings (2)

### 1. Metas.tsx (Goals Page)
- **Status:** COMPLETE
- **Changes:**
 - Wrapped with PremiumPageLayout
 - Imported colors and spacing tokens
 - Replaced all hardcoded colors with design tokens
 - Applied rounded-2xl p-6 shadow-sm border pattern to all cards
 - Updated button styling with colors.primary (green #28A263)
 - Applied spacing.sectionGap and spacing.elementGap
 - Maintained 100% functionality
- **File:** `/src/app/pages/Metas.tsx`

### 2. DASMei.tsx (Tax Calculator)
- **Status:** COMPLETE
- **Changes:**
 - Wrapped with PremiumPageLayout
 - Imported colors and spacing tokens
 - All hardcoded colors replaced with design tokens (primary, success, danger, warning, bgLight, bgLighter, textPrimary, textSecondary, borderDefault)
 - Applied consistent card styling (rounded-2xl p-6 shadow-sm border)
 - Green button actions with hover:opacity-90
 - Responsive grid patterns with proper spacing
 - All semantic color usage for status indicators
 - Maintained 100% functionality and form validation
- **File:** `/src/app/pages/DASMei.tsx`

## High-Priority Remaining Pages (21)

### High Priority - Financial Pages (8)

#### 1. RelatoriosFinanceiros.tsx (Financial Reports)
**Status:** PENDING
**Complexity:** Very High (600+ lines, multiple tabs, charts, tables)
**Required Changes:**
- Add PremiumPageLayout wrapper
- Import colors, spacing from designTokens
- Replace all inline colors in tab buttons, cards, tables
- Update card styling to rounded-2xl p-6 shadow-sm border
- Apply green (#28A263) to primary CTAs
- Update table styling with colors.bgLighter for headers
- Refactor chart color themes to use design tokens
- Update status badge colors (success, warning, danger, info)
- Apply responsive grid spacing

#### 2. ContasAPagar.tsx (Bills to Pay)
**Status:** PENDING
**Complexity:** High (550+ lines, forms, tables, modals)
**Required Changes:**
- Replace PageHeader with PremiumPageLayout
- Import colors and spacing tokens
- Replace all text-[#001529] and rgba colors with design tokens
- Update all buttons to use colors.primary for primary actions
- Card styling: rounded-2xl p-6 shadow-sm border for all cards
- Form inputs: rounded-lg with colors.bgLighter background
- Table row styling with proper borders
- Modal backdrop and styling with design system colors
- KPI cards with semantic colors (success for paid, danger for pending, warning for upcoming)

#### 3. ContasAReceber.tsx (Invoices to Receive)
**Status:** PENDING
**Complexity:** High (similar to ContasAPagar)
**Required Changes:** Same pattern as ContasAPagar

#### 4. Estoque.tsx (Inventory Management)
**Status:** PENDING
**Complexity:** High (forms, stock tracking, alerts)
**Required Changes:**
- Wrap with PremiumPageLayout
- Apply colors.success for stock ok, colors.warning for low stock, colors.danger for out of stock
- Update form styling to match design system
- Apply card patterns with shadow-sm border
- Status indicator colors for inventory levels

#### 5. GeradorPropostas.tsx (Proposal Generator)
**Status:** PENDING
**Complexity:** High (form generation, templates, preview)
**Required Changes:**
- PremiumPageLayout wrapper
- Colors and spacing tokens
- Form styling with design system
- Button colors with green primary CTA
- Card styling for proposal cards
- Template selection UI with design tokens

#### 6. Investments.tsx / GuiaInvestimentos.tsx (Investment Guide)
**Status:** PENDING
**Complexity:** Medium-High (educational content, cards, risk questionnaire)
**Required Changes:**
- PremiumPageLayout wrapper
- Colors for risk levels (low=green, medium=yellow, high=red)
- Card styling for investment products
- Form styling for questionnaire
- Responsive layout with proper spacing

### Simulators (4)

#### 7. Simulators.tsx (Listing Page)
**Status:** PENDING
**Complexity:** Medium (grid layout, cards)
**Required Changes:**
- PremiumPageLayout wrapper
- Card styling for each simulator option
- Grid spacing with gap-6
- Button styling with colors.primary

#### 8. SimuladorMEI.tsx (MEI Simulator)
**Status:** PENDING
**Complexity:** Medium-High (calculations, charts, forms)
**Required Changes:**
- Colors and spacing tokens
- Card styling for results
- Form styling
- Chart colors from design system

#### 9. SimuladorPreco.tsx (Pricing Simulator)
**Status:** PENDING
**Complexity:** Medium

#### 10. SimuladorLucro.tsx (Profit Simulator)
**Status:** PENDING
**Complexity:** Medium

### Utility Pages (6)

#### 11. Onboarding.tsx
**Status:** PENDING
**Complexity:** Medium (step indicators, progress tracking)

#### 12. ComoMigrar.tsx (Migration Guide)
**Status:** PENDING
**Complexity:** Low-Medium (informational content)

#### 13. SobreOMEI.tsx (About MEI)
**Status:** PENDING
**Complexity:** Low (mostly text content)

#### 14. TermosDeUso.tsx (Terms of Use)
**Status:** PENDING
**Complexity:** Low (legal text)

#### 15. RecomendacoesInvestimento.tsx (Investment Recommendations)
**Status:** PENDING
**Complexity:** Medium (cards, recommendations)

### Auth Pages (5)

#### 16. ForgotPassword.tsx
**Status:** PENDING
**Complexity:** Low

#### 17. ResetPassword.tsx
**Status:** PENDING
**Complexity:** Low

#### 18. PasswordResetConfirm.tsx
**Status:** PENDING
**Complexity:** Low

#### 19. PasswordResetRedirect.tsx
**Status:** PENDING
**Complexity:** Low

#### 20. ConfirmEmail.tsx
**Status:** PENDING
**Complexity:** Low

### Additional Pages (3)

#### 21. AuthCallback.tsx
**Status:** PENDING

#### 22. Checkout.tsx
**Status:** PENDING

#### 23. CheckoutSuccess.tsx
**Status:** PENDING

## Pattern Applied

All refactored pages follow this exact pattern:

```tsx
// 1. Imports
import { colors, spacing } from "../../utils/designTokens";
import { PremiumPageLayout } from "../components/PremiumPageLayout";

// 2. Page Wrapper
<PremiumPageLayout
 title="Page Title"
 description="Page description"
 actions={<button>Action</button>}
>
 <div className={spacing.sectionGap}>
 {/* Content */}
 </div>
</PremiumPageLayout>

// 3. Colors Applied
style={{ color: colors.textPrimary }}
style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}

// 4. Cards
className="rounded-2xl p-6 shadow-sm border"
style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}

// 5. Primary Buttons
style={{ backgroundColor: colors.primary }}
className="... hover:opacity-90 transition-all"

// 6. Spacing
className={spacing.sectionGap} // space-y-8
className={spacing.elementGap} // space-y-6
className="gap-6" // grid gaps
```

## Color Replacements Quick Reference

```
#001529 (dark text) → colors.textPrimary
rgba(0,21,41,0.6) (gray) → colors.textSecondary
#FFFFFF (light bg) → colors.bgLight
#F5F7FA (lighter bg) → colors.bgLighter
#E5E7EB (borders) → colors.borderDefault
#28A263 (green/primary) → colors.primary
#0066FF (blue/secondary) → colors.secondary
#10b981 (success/green) → colors.success
#ef4444 (danger/red) → colors.danger
#f59e0b (warning/yellow) → colors.warning
```

## Next Steps

1. **Immediate** (High Priority Financial Pages):
 - RelatoriosFinanceiros.tsx
 - ContasAPagar.tsx & ContasAReceber.tsx
 - Estoque.tsx
 - GeradorPropostas.tsx
 - Investments.tsx

2. **Then** (Simulators):
 - Simulators.tsx
 - All 3 simulator pages

3. **Finally** (Utility & Auth):
 - Utility pages
 - Auth pages

## Testing Checklist

For each refactored page:
- [ ] Page loads without errors
- [ ] All colors match design system
- [ ] Buttons respond to clicks (all functionality preserved)
- [ ] Form validation works
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Hover states and transitions work
- [ ] Data displays correctly
- [ ] No console errors

## Time Estimate

- High Priority (8 pages): 4-6 hours
- Simulators (4 pages): 2-3 hours
- Utility & Auth (13 pages): 2-3 hours
- **Total Estimated:** 8-12 hours (most are simpler after the complex ones)

---
*Last Updated: April 8, 2026*
