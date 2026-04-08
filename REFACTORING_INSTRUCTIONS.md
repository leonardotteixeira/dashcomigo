# Premium Design System Refactoring - Complete Instructions

## Current Status: 3 of 25+ Pages Complete

- ✅ **Metas.tsx** (Goals) - COMPLETE
- ✅ **DASMei.tsx** (Tax Calculator) - COMPLETE
- ✅ **ContasAPagar.tsx** (Bills to Pay) - COMPLETE
- ⏳ **21+ Remaining Pages** - Ready for refactoring

---

## Step-by-Step Refactoring Pattern

### Phase 1: Imports (Add to top of file)

```tsx
import { colors, spacing } from "../../utils/designTokens";
import { PremiumPageLayout } from "../components/PremiumPageLayout";
```

### Phase 2: Page Wrapper

**OLD:**
```tsx
export function PageName() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#001529]">Title</h1>
        <p className="text-[rgba(0,21,41,0.6)]">Description</p>
      </div>
      {/* content */}
    </div>
  );
}
```

**NEW:**
```tsx
export function PageName() {
  return (
    <PremiumPageLayout
      title="Title"
      description="Description"
      actions={<button>Action</button>}  // Optional
    >
      <div className={spacing.sectionGap}>
        {/* content */}
      </div>
    </PremiumPageLayout>
  );
}
```

### Phase 3: Color Replacements

Use Find & Replace with these mappings:

| OLD | NEW | TYPE |
|-----|-----|------|
| `text-[#001529]` | `style={{ color: colors.textPrimary }}` | text |
| `text-[rgba(0,21,41,0.6)]` | `style={{ color: colors.textSecondary }}` | text |
| `bg-white` | `style={{ backgroundColor: colors.bgLight }}` | background |
| `bg-[#F8F9FA]` or `bg-[#F5F7FA]` | `style={{ backgroundColor: colors.bgLighter }}` | background |
| `border-[rgba(0,0,0,0.1)]` | `style={{ borderColor: colors.borderDefault }}` | border |
| `bg-[#28A263]` or `text-[#28A263]` | `colors.primary` | primary |
| `bg-[#10b981]` or `text-[#10b981]` | `colors.success` | success |
| `bg-[#ef4444]` or `text-[#ef4444]` | `colors.danger` | danger |
| `bg-[#f59e0b]` or `text-[#f59e0b]` | `colors.warning` | warning |
| `bg-[#0066FF]` | `colors.secondary` | secondary |

### Phase 4: Spacing Replacements

| OLD | NEW |
|-----|-----|
| `space-y-4` | `space-y-6` or `spacing.elementGap` |
| `space-y-6` | `spacing.elementGap` |
| `space-y-8` | `spacing.sectionGap` |
| `gap-4` | `gap-6` |
| `gap-3` | `gap-4` or keep if inside card |
| `p-4` | `p-6` |
| `p-5` | `p-6` |
| `rounded-xl` | `rounded-2xl` (if card), `rounded-lg` (if button/input) |

### Phase 5: Card Styling

**Pattern for all cards:**
```tsx
className="rounded-2xl p-6 shadow-sm border"
style={{
  backgroundColor: colors.bgLight,
  borderColor: colors.borderDefault
}}
```

### Phase 6: Button Styling

**Primary Button (Green - Main CTA):**
```tsx
style={{ backgroundColor: colors.primary }}
className="text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all"
```

**Secondary Button (Blue):**
```tsx
style={{ backgroundColor: colors.secondary }}
className="text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all"
```

**Outline Button:**
```tsx
style={{
  backgroundColor: colors.bgLighter,
  color: colors.textSecondary,
  borderColor: colors.borderDefault
}}
className="px-4 py-2.5 rounded-lg border transition-colors hover:opacity-80"
```

### Phase 7: Form Inputs

```tsx
className="w-full rounded-lg px-4 py-2.5 focus:outline-none transition-colors"
style={{
  backgroundColor: colors.bgLighter,
  borderColor: colors.borderDefault,
  color: colors.textPrimary,
  border: `1px solid ${colors.borderDefault}`
}}
```

### Phase 8: Tables & Lists

**Header Row:**
```tsx
style={{
  backgroundColor: colors.bgLighter,
  borderColor: colors.borderDefault
}}
```

**Body Rows:**
```tsx
className="border-b transition-colors hover:opacity-80"
style={{
  borderColor: colors.borderDefault,
  backgroundColor: colors.bgLight,
  color: colors.textPrimary
}}
```

### Phase 9: Semantic Colors for Status

```tsx
// Success - Green (payments, completed, income)
style={{ color: colors.success }}

// Danger - Red (errors, losses, late payments)
style={{ color: colors.danger }}

// Warning - Orange (warnings, upcoming payments, caution)
style={{ color: colors.warning }}

// Info - Blue (informational, secondary)
style={{ color: colors.secondary }}
```

---

## Quick Reference: File-Specific Instructions

### Pages Requiring Only Minor Changes (4-6 hours each)

**ContasAReceber.tsx** (Invoices to Receive)
- Same pattern as ContasAPagar
- Replace "Pagar" with "Receber"
- Replace "pendente" with "recebido"
- Use same colors and spacing

**Estoque.tsx** (Inventory)
- Wrap with PremiumPageLayout
- Form styling: colors.bgLighter inputs with colors.borderDefault borders
- Status colors: success (in stock), warning (low), danger (out)
- Card grid with gap-6

**GeradorPropostas.tsx** (Proposals)
- PremiumPageLayout wrapper
- Colors and spacing tokens
- Form and preview styling
- Green CTA buttons

**Investments.tsx** (Investment Guide)
- Colors for risk levels
- Card styling for products
- Form styling for risk questionnaire
- Responsive grid

### Simulator Pages (2-3 hours each)

**Simulators.tsx** (Listing)
- Grid of simulator cards
- Each card: rounded-2xl p-6 shadow-sm border

**SimuladorMEI.tsx, SimuladorPreco.tsx, SimuladorLucro.tsx**
- Form styling with design tokens
- Results card styling
- Chart color customization
- Button consistency

### Utility Pages (1-2 hours each)

**Onboarding.tsx, ComoMigrar.tsx, SobreOMEI.tsx, TermosDeUso.tsx, RecomendacoesInvestimento.tsx**
- Basic color replacements
- Heading and text colors
- Card styling for content blocks
- Button styling

### Auth Pages (30 minutes - 1 hour each)

**ForgotPassword.tsx, ResetPassword.tsx, PasswordResetConfirm.tsx, PasswordResetRedirect.tsx, ConfirmEmail.tsx**
- Simple form styling
- Colors for text and backgrounds
- Button styling with green primary CTA

**AuthCallback.tsx, Checkout.tsx, CheckoutSuccess.tsx**
- Minimal styling
- Color replacements only

---

## Critical Checklist for Each Page

After refactoring, verify:

- [ ] Imports added: `colors` and `spacing` from `designTokens`
- [ ] Imports added: `PremiumPageLayout` (if page-level wrapper)
- [ ] Page wrapped in `PremiumPageLayout` (with title, description)
- [ ] All hardcoded colors replaced with `colors.*` tokens
- [ ] All cards use: `rounded-2xl p-6 shadow-sm border` with proper style props
- [ ] Primary buttons use: `colors.primary` with `hover:opacity-90`
- [ ] Spacing updated: `space-y-6` and `gap-6` for consistency
- [ ] No `text-[#...]` classes remain (all moved to `style={{color:...}}`)
- [ ] No `bg-[#...]` classes remain (all moved to `style={{backgroundColor:...}}`)
- [ ] Form inputs styled with `colors.bgLighter` + `colors.borderDefault`
- [ ] Tables/lists use `colors.bgLighter` for headers
- [ ] Status/semantic colors applied (success/danger/warning/info)
- [ ] Hover states use `hover:opacity-90` or similar
- [ ] Transitions use `transition-all` or `transition-colors`
- [ ] All functionality preserved (100% no broken features)
- [ ] No console errors on load
- [ ] Responsive design intact
- [ ] Colors contrast adequately (WCAG AA standard)

---

## Common Pitfalls to Avoid

1. **Forgetting imports** - Always add colors and spacing at the top
2. **Mixing old and new** - Don't mix hardcoded colors with design tokens
3. **Wrong spacing** - Use space-y-6 or space-y-8, never space-y-4
4. **Card inconsistency** - All cards must be `rounded-2xl p-6 shadow-sm border`
5. **Button colors** - Primary actions should always use `colors.primary` (green)
6. **Form styling** - Inputs must have `colors.bgLighter` + `colors.borderDefault`
7. **Border styling** - All borders should use `colors.borderDefault`
8. **Text colors** - Main text is `colors.textPrimary`, secondary text is `colors.textSecondary`
9. **Breaking functionality** - Focus on styling only, preserve all logic
10. **Not testing** - Test each page after refactoring

---

## Example: Full Page Refactoring

**BEFORE:**
```tsx
export function SamplePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-[#001529]">Title</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[rgba(0,0,0,0.1)]">
          <p className="text-[rgba(0,21,41,0.6)] text-sm">Label</p>
          <p className="text-[#001529] text-2xl font-bold">Value</p>
        </div>
      </div>
      <button className="bg-[#28A263] hover:bg-[#1f7a4a] text-white px-4 py-2 rounded-xl">
        Click
      </button>
    </div>
  );
}
```

**AFTER:**
```tsx
import { colors, spacing } from "../../utils/designTokens";
import { PremiumPageLayout } from "../components/PremiumPageLayout";

export function SamplePage() {
  return (
    <PremiumPageLayout
      title="Title"
      description="Brief description"
    >
      <div className={spacing.sectionGap}>
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 shadow-sm border" style={{ backgroundColor: colors.bgLight, borderColor: colors.borderDefault }}>
            <p className="text-sm" style={{ color: colors.textSecondary }}>Label</p>
            <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Value</p>
          </div>
        </div>
        <button className="text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-all" style={{ backgroundColor: colors.primary }}>
          Click
        </button>
      </div>
    </PremiumPageLayout>
  );
}
```

---

## Remaining Pages to Refactor (By Priority)

### URGENT - Next Session
1. RelatoriosFinanceiros.tsx (High complexity)
2. ContasAReceber.tsx
3. Estoque.tsx
4. GeradorPropostas.tsx
5. Investments.tsx / GuiaInvestimentos.tsx

### HIGH - Soon After
6. Simulators.tsx
7. SimuladorMEI.tsx
8. SimuladorPreco.tsx
9. SimuladorLucro.tsx

### MEDIUM - After Simulators
10. Onboarding.tsx
11. ComoMigrar.tsx
12. SobreOMEI.tsx
13. TermosDeUso.tsx
14. RecomendacoesInvestimento.tsx

### LOW - Final Pass
15. ForgotPassword.tsx
16. ResetPassword.tsx
17. PasswordResetConfirm.tsx
18. PasswordResetRedirect.tsx
19. ConfirmEmail.tsx
20. AuthCallback.tsx
21. Checkout.tsx
22. CheckoutSuccess.tsx

---

## How to Apply These Instructions

1. **Select a page** from the list
2. **Read the file completely** to understand its structure
3. **Apply Phase 1-9** in order
4. **Run through the checklist** for that page
5. **Test in browser** to ensure no errors
6. **Commit changes** with descriptive message

---

*Generated: April 8, 2026*
*Total Pages: 45 | Completed: 3 | Remaining: 21+ | Estimated Time: 10-14 hours*
