# Premium Design System Implementation Guide

## OVERVIEW

This guide explains the premium design system implemented across the application. It provides complete specifications, reusable patterns, and clear instructions for consistency.

## CORE PHILOSOPHY

**Refined Minimalism**: Clean layouts, generous whitespace, semantic color usage, and professional typography create an elegant, trustworthy financial application.

## DESIGN FILES

1. **src/utils/designTokens.ts** - All design values (import and use these)
2. **src/app/components/PremiumPageLayout.tsx** - Page wrapper (use for all pages)
3. **src/app/components/PageHeader.tsx** - Header component (used by PremiumPageLayout)
4. **src/app/components/KPICard.tsx** - KPI display (for metric cards)
5. **src/app/pages/Dashboard.tsx** - Reference implementation (perfect example)

## COLOR SYSTEM

### Primary Actions (Green)
```
Default:  #28A263
Hover:    #20915a
Usage:    Main CTAs, successful states, checkmarks, completion indicators
```

### Secondary Actions (Blue)
```
Color:    #0066FF
Usage:    Secondary buttons, tags, secondary info, links
```

### Text Colors
```
Primary:   #001529 (dark navy - main content)
Secondary: rgba(0,21,41,0.6) (muted gray - help text, descriptions)
```

### Backgrounds
```
Light:    #FFFFFF (cards, content areas)
Lighter:  #F5F7FA (inputs, hover states, subtle sections)
```

### Borders & Dividers
```
Color: #E5E7EB (all borders, dividers, table lines)
```

### Semantic Colors
```
Success:  #10b981 (positive, gains, income)
Danger:   #ef4444 (errors, losses, warnings)
Warning:  #f59e0b (caution, attention needed)
Info:     #0066FF (secondary information)
```

## COMPONENT PATTERNS

### Card Pattern
```jsx
<div
  className="rounded-2xl p-6 shadow-sm border"
  style={{
    backgroundColor: colors.bgLight,
    borderColor: colors.borderDefault
  }}
>
  {/* content */}
</div>
```

### Button - Primary
```jsx
<button
  style={{ backgroundColor: colors.primary }}
  className="text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all"
>
  Action
</button>
```

### Button - Secondary
```jsx
<button
  style={{ backgroundColor: colors.secondary }}
  className="text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all"
>
  Secondary
</button>
```

### Icon Container
```jsx
<div
  className="w-11 h-11 rounded-xl flex items-center justify-center"
  style={{
    backgroundColor: `${colors.success}/10`,
    color: colors.success
  }}
>
  <CheckIcon className="w-5 h-5" />
</div>
```

### Text - Primary
```jsx
<p style={{ color: colors.textPrimary }}>Main content text</p>
```

### Text - Secondary
```jsx
<p style={{ color: colors.textSecondary }}>Helper text</p>
```

### Page Layout
```jsx
import { PremiumPageLayout } from "../components/PremiumPageLayout";

export function MyPage() {
  return (
    <PremiumPageLayout
      title="Page Title"
      description="Brief description"
      actions={<button>Action</button>}
    >
      <div className="space-y-8">
        {/* Major sections with space-y-8 */}
        <div className="space-y-6">
          {/* Elements with space-y-6 */}
        </div>
      </div>
    </PremiumPageLayout>
  );
}
```

## SPACING SYSTEM

```
Major Sections:  space-y-8
Elements:        space-y-6
Grid Gaps:       gap-6
Card Padding:    p-6 (normal) or p-7 (emphasized)
Corners:         rounded-2xl (all cards), rounded-lg (inputs/buttons)
```

## TYPOGRAPHY

```
Headings:        font-bold, text-3xl (titles), text-2xl (sections), text-lg (subsections)
Body Text:       Regular weight, colors.textPrimary
Helper Text:     text-sm, colors.textSecondary
Labels:          text-xs, UPPERCASE, tracking-wider, colors.textSecondary
```

## SHADOW SYSTEM

```
Cards:    shadow-sm
Hovering: shadow-md
Emphasis: shadow-lg
```

## RESPONSIVE DESIGN

```
Mobile:  Single column, full width
Tablet:  lg: breakpoint (1024px) = 2 columns
Desktop: 2-3 column grids, expanded layouts
```

## COMMON REPLACEMENTS

When refactoring pages:

```
OLD → NEW

text-foreground → style={{ color: colors.textPrimary }}
text-muted-foreground → style={{ color: colors.textSecondary }}
text-card-foreground → style={{ color: colors.textPrimary }}

bg-card → style={{ backgroundColor: colors.bgLight }}
bg-secondary → style={{ backgroundColor: colors.bgLighter }}
bg-muted → style={{ backgroundColor: colors.bgLighter }}

border-border → style={{ borderColor: colors.borderDefault }}
border-input → style={{ borderColor: colors.borderDefault }}

rounded-xl → rounded-2xl
p-4 → p-6
p-5 → p-6
space-y-4 → space-y-6
gap-4 → gap-6

text-success → style={{ color: colors.success }}
text-destructive → style={{ color: colors.danger }}
text-warning → style={{ color: colors.warning }}

hover:bg-primary/90 → hover:opacity-90
hover:text-primary → style with hover class
```

## FORM ELEMENTS

```
Input:
  style={{
    backgroundColor: colors.bgLighter,
    borderColor: colors.borderDefault,
    color: colors.textPrimary,
    border: `1px solid ${colors.borderDefault}`
  }}

Select:
  Same as input + rounded-lg

Label:
  style={{ color: colors.textSecondary }}
  className="text-sm font-medium"
```

## LISTS & TABLES

```
Header Row:     backgroundColor: colors.bgLighter
Body Rows:      backgroundColor: colors.bgLight
Borders:        borderColor: colors.borderDefault
Text:           colors.textPrimary
Secondary:      colors.textSecondary
Hover:          opacity-75 transition
```

## ALERTS & MESSAGES

```
Success Alert:
  backgroundColor: `${colors.success}/10`
  borderColor: colors.success
  text: colors.success

Error Alert:
  backgroundColor: `${colors.danger}/10`
  borderColor: colors.danger
  text: colors.danger

Warning Alert:
  backgroundColor: `${colors.warning}/10`
  borderColor: colors.warning
  text: colors.warning
```

## ICONS

All icons should:
- Use lucide-react library
- Be placed in colored containers
- Use semantic colors (green for income, red for expenses, etc.)
- Size: w-5 h-5 (standard), w-4 h-4 (small), w-6 h-6 (large)

## ACCESSIBILITY

- Ensure sufficient color contrast (WCAG AA standard)
- Use semantic HTML (buttons, links, labels)
- Include aria-labels where needed
- Maintain keyboard navigation
- Use focus-visible for keyboard users

## ANIMATION & TRANSITIONS

```
Hover effects:      transition-all duration-300
Button hover:       hover:opacity-90
Color transitions:  transition-colors
All transitions:    transition-all (default to 300ms)
```

## BEST PRACTICES

1. **Always import colors** - `import { colors } from "../../utils/designTokens";`
2. **Use PremiumPageLayout** - Wrap all internal pages in it
3. **Consistent spacing** - Never use space-y-4, always space-y-6 or space-y-8
4. **Card style** - All cards use: `rounded-2xl p-6 shadow-sm border`
5. **Test responsiveness** - Check mobile, tablet, desktop
6. **Preserve functionality** - Refactoring is styling only
7. **Reference Dashboard** - When unsure, check Dashboard.tsx

## COMMON MISTAKES TO AVOID

- Using arbitrary colors instead of design tokens
- Mixing rounded-xl with rounded-2xl
- Using space-y-4 instead of space-y-6
- Forgetting to import colors
- Not wrapping pages in PremiumPageLayout
- Adding excessive custom styling instead of using tokens
- Forgetting to apply colors.borderDefault to borders

## SUPPORT REFERENCE

All refactored pages are in src/app/pages/:
- CashFlow.tsx
- Orcamentos.tsx
- Customers.tsx
- Suppliers.tsx
- Profile.tsx
- Privacidade.tsx

These serve as complete examples for refactoring remaining pages.
