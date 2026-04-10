# Financial SaaS — Complete Product Roadmap

> Generated: 2026-04-09
> Stack: React + Vite + TypeScript · PocketBase · Railway
> Target: MEI / Small Business owners in Brazil

---

## 1. CURRENT STATE ANALYSIS

### ✅ What Is Solid

| Area | Status |
|------|--------|
| Auth system | Login, signup, Google OAuth, session persistence via PocketBase |
| CashFlowContext | Fully synced — FluxoCaixa writes through context, Dashboard reads same state |
| Feature gating architecture | `featureAccessService.ts` is clean, centralized, and extensible |
| Deployment pipeline | Push → Railway auto-deploys in ~30s. Zero manual steps |
| Dashboard KPIs | Real data via `useFinancialMetrics` (single source of truth) |
| Profile page | Complete: personal info, MEI data, security, notifications |
| Cross-posting | Paid payables/received receivables now create transactions |

### ⚠️ What Is Fragile

| Area | Risk |
|------|------|
| **Plan limits are client-side only** | Free users can call `pb.collection().create()` directly from DevTools and bypass all limits. `getVerifiedPlan()` exists but isn't used everywhere consistently |
| **Reports page** | Was built with mock/static data. Real data wiring is incomplete |
| **Transaction status/origin fields** | Cross-posted transactions write `origin: "payable"` but the PocketBase schema may not have that field — silent failures |
| **Payables/Receivables sync is one-way** | When a payable is marked paid, a transaction is created. But if that transaction is deleted from FluxoCaixa, the payable still shows "pago" |
| **No real-time updates** | PocketBase supports WebSocket subscriptions but they're not implemented. Two tabs open = data diverges |
| **Login streak reward** | 7-day streak grants PRO permanently with no expiry. This can be gamed |

### ❌ What Is Missing

- No password reset / forgot password flow
- No email verification enforcement (signup sends verification but doesn't gate access)
- No actual payment processing for PRO upgrade (checkout page has no real Stripe/PIX integration)
- No proper onboarding completion gate (users can skip onboarding)
- No 404 / error boundary pages
- No admin panel to manage users, view metrics, manually grant PRO
- Proposals and Budgets modules may be stubs
- No data export working end-to-end (Excel/PDF buttons exist but error handling is missing)

### 🔴 What Is Risky

| Risk | Impact |
|------|--------|
| PocketBase on Railway free tier | Cold starts, sleep after inactivity, data loss if volume not persisted |
| No database migration system | Any schema change requires manual intervention |
| No backup strategy | Single PocketBase instance = single point of failure |
| Stripe/payment not integrated | PRO upgrade button exists but revenue capture is manual or broken |
| `transactionsUsageToday` counter | Named "today" but used as monthly counter — naming mismatch creates potential double-counting bugs |

---

## 2. STRUCTURED ROADMAP

---

### Phase 1 — Core Stability
**Goal:** Every piece of data saves correctly, every limit is enforced server-side, nothing crashes silently.
**Timeline:** 1–2 weeks

#### Tasks

**1.1 — Verify PocketBase schema matches code**
- Add `origin` (`cashflow | payable | receivable`) and `status` (`pending | paid | received`) fields to the `transactions` collection
- Add `address` and `cpf_cnpj` fields to `profiles` if not already there
- *Dependency:* None
- *Outcome:* No more silent field-write failures

**1.2 — Move plan enforcement to PocketBase rules**
- In PocketBase collection rules for `transactions`, `payables`, `receivables`: add a server-side rule that counts existing records and rejects creates beyond the free plan limit
- This makes limits **impossible to bypass** from client
- *Dependency:* PocketBase admin access
- *Outcome:* Free plan limits are cryptographically enforced

**1.3 — Fix `transactionsUsageToday` naming and logic**
- Rename to `transactionsUsageThisMonth` across AuthContext, PocketBase schema, and FluxoCaixa
- Ensure the counter resets on the 1st of each month, not daily
- *Dependency:* 1.1
- *Outcome:* Accurate usage tracking, no counting drift

**1.4 — Add error boundaries and fallback UI**
- Wrap each route in a React `ErrorBoundary` that shows a recovery screen instead of white-screen-of-death
- Add a global `toast.error()` catch in every async context function that currently swallows errors silently
- *Dependency:* None
- *Outcome:* App never fully crashes; errors are surfaced to users

**1.5 — Validate all PocketBase collection permissions**
- Each collection should only allow operations where `@request.auth.id = userid`
- Verify no collection is publicly readable/writable
- *Dependency:* PocketBase admin access
- *Outcome:* Zero data leakage between users

**1.6 — Fix password reset flow**
- PocketBase has `requestPasswordReset()` built in. Add a "Forgot password" link on the login page
- *Dependency:* None
- *Outcome:* Users can recover accounts without manual intervention

---

### Phase 2 — UX & UI Refinement
**Goal:** Every screen feels intentional, consistent, and fast.
**Timeline:** 1–2 weeks

#### Tasks

**2.1 — Audit every page for loading states**
- Every data-fetching operation should show a skeleton loader, not a blank space
- Currently inconsistent: some pages have skeletons, others flash empty states
- *Dependency:* Phase 1 complete
- *Outcome:* Perceived performance improves significantly

**2.2 — Empty states for every list**
- FluxoCaixa, ContasAPagar, ContasAReceber, Clientes, Fornecedores all need meaningful empty states with CTAs
- *Dependency:* None
- *Outcome:* New users understand what to do next

**2.3 — Mobile responsiveness audit**
- Test all pages at 375px width. Fix tables that overflow (FluxoCaixa, RelatoriosFinanceiros)
- Modal forms need to be full-screen on mobile
- *Dependency:* None
- *Outcome:* Usable on any device

**2.4 — Complete Proposals and Budgets modules**
- Build the full CRUD: list view, form modal, PDF preview/export
- *Dependency:* Phase 1 complete
- *Outcome:* PRO users have access to all advertised features

**2.5 — Reports page — wire to real data**
- Replace every hardcoded/mock value in `RelatoriosFinanceiros.tsx` with data from `useFinancialMetrics`
- Verify category donut charts use real category breakdowns
- Verify trend charts use actual transaction data filtered by month
- *Dependency:* Phase 1 complete
- *Outcome:* Reports are trustworthy

**2.6 — Consistent form validation UX**
- All forms need: inline field-level validation, disabled submit while saving, success/error feedback
- *Dependency:* None
- *Outcome:* Users never wonder if something worked

---

### Phase 3 — Monetization System
**Goal:** PRO upgrades actually generate revenue. Free plan feels genuinely limited, not broken.
**Timeline:** 1 week

#### Tasks

**3.1 — Integrate Stripe or Mercado Pago**
- For Brazilian MEIs, Mercado Pago (PIX + credit card) is the highest-conversion option
- On payment success: call `upgradeToPro()` and set a `pro_expires_at` timestamp in PocketBase
- *Dependency:* Payment processor account
- *Outcome:* Revenue capture works end-to-end

**3.2 — Add `pro_expires_at` expiry logic**
- Currently PRO is permanent once granted. Add expiry: check on every auth load, downgrade to free if expired
- Build a "Your PRO expires in X days" banner for users within 7 days of expiry
- *Dependency:* 3.1
- *Outcome:* Subscription model is sustainable

**3.3 — Fix login streak PRO reward**
- Cap the 7-day streak reward at 30 days trial PRO (use `pro_expires_at`)
- *Dependency:* 3.2
- *Outcome:* Streak reward becomes a conversion funnel, not a permanent bypass

**3.4 — Upgrade flow optimization**
- Every `LimitReachedModal` CTA should deep-link to checkout with `?feature=clients` parameter
- Show a confirmation screen after upgrade listing all features now unlocked
- *Dependency:* 3.1
- *Outcome:* Conversion rate from limit-hit to paid improves

**3.5 — Usage dashboard for free users**
- Add a "Your plan" card on Dashboard for free users showing resource usage
- Example: "Transactions: 18/30 this month | Clients: 7/10"
- *Dependency:* Phase 1 complete
- *Outcome:* Creates urgency without being annoying

---

### Phase 4 — Advanced Financial Features
**Goal:** The product becomes genuinely valuable for financial decisions, not just data entry.
**Timeline:** 2–3 weeks

#### Tasks

**4.1 — Cash Flow Forecast (PRO)**
- Use the last 3 months of transactions to project next month's expected revenue and expenses
- Show as a line chart: "Based on your history, you'll likely earn R$X next month"
- *Dependency:* 2+ months of real transaction data
- *Outcome:* Sticky PRO feature users return to weekly

**4.2 — Category budget alerts**
- Let users set a monthly budget per expense category
- Alert when 80% spent in a category
- *Dependency:* Phase 2 complete
- *Outcome:* Active engagement, not just passive reporting

**4.3 — MEI annual revenue limit tracker**
- Progress bar on Dashboard: "R$42.000 of R$81.000 annual MEI limit used (52%)"
- Warn at 75% and 90%
- *Dependency:* Correct transaction data from Phase 1
- *Outcome:* Addresses one of the biggest anxieties MEIs have

**4.4 — Recurring transactions**
- Allow transactions and payables to be marked as recurring monthly/weekly
- Auto-create the next instance on the recurrence date
- *Dependency:* Phase 1 complete
- *Outcome:* Reduces manual data entry, increases retention

**4.5 — Financial health score**
- A single 0–100 score computed from: margin %, expense ratio, cash buffer, payment punctuality
- Show on Dashboard with a simple explanation
- *Dependency:* 3 months of data
- *Outcome:* Gamification that drives engagement

---

### Phase 5 — Backend & Scalability
**Goal:** The system can handle 1,000+ users without degrading.
**Timeline:** 1 week (can run parallel to Phase 4)

#### Tasks

**5.1 — Migrate PocketBase to persistent storage on Railway**
- Ensure PocketBase data volume is mounted to a Railway volume, not ephemeral container storage
- Set up automated daily backups to S3 or Railway volumes
- *Dependency:* Railway paid plan
- *Outcome:* Zero data loss on deploy or restart

**5.2 — Add pagination to all list fetches**
- Every `getList(1, 500, ...)` call is a ticking time bomb. Cap at 50 per page with cursor-based pagination
- *Dependency:* Phase 2 complete
- *Outcome:* App stays fast with 500+ transactions

**5.3 — Add PocketBase real-time subscriptions**
- Subscribe to `transactions`, `payables`, `receivables` collections for instant cross-tab updates
- PocketBase has `pb.collection().subscribe()` built in
- *Dependency:* Phase 1 complete
- *Outcome:* No more "why isn't this updating?" support tickets

**5.4 — Implement optimistic updates**
- Show new items immediately with a loading indicator, then confirm or rollback on API response
- *Dependency:* Phase 1 complete
- *Outcome:* App feels instantaneous

**5.5 — Add request deduplication and caching**
- In-memory cache with TTL for expensive reads (category summaries, annual totals)
- *Dependency:* None
- *Outcome:* Reduces PocketBase load, faster page loads

---

### Phase 6 — Growth & Retention
**Goal:** Users activate quickly, come back daily, and refer others.
**Timeline:** Ongoing

#### Tasks

**6.1 — Complete the onboarding flow**
- After completion, show a personalized Dashboard based on their business type
- Block dashboard access until onboarding is done (currently skippable)
- *Dependency:* Phase 2 complete
- *Outcome:* Activation rate increases (first-week retention)

**6.2 — Email notification system**
- Set up: weekly financial summary, due payment reminders (3 days before / day of / 1 day after), MEI limit alerts
- *Dependency:* Email provider (SendGrid, Resend) configured in PocketBase
- *Outcome:* Passive retention — users re-engage without opening the app

**6.3 — Referral program**
- Give 1 month PRO for each paying referral
- Unique referral link in Profile page, tracked via `referred_by` field in profiles
- *Dependency:* Phase 3 complete
- *Outcome:* Organic growth channel

**6.4 — In-app changelog / "What's New"**
- Sidebar badge for new features
- One-time modal on first login after deploy
- *Dependency:* None
- *Outcome:* Users discover features they paid for

**6.5 — NPS / feedback widget**
- After 14 days of usage, show a 1-question survey: "How likely are you to recommend this to another MEI?"
- *Dependency:* Phase 6.1 complete
- *Outcome:* Identifies unhappy users before churn, collects testimonials

---

## 3. TOP 5 IMMEDIATE ACTIONS

Do these in order, this week:

| # | Action | Why | Effort |
|---|--------|-----|--------|
| **1** | **Add `origin` + `status` fields to PocketBase `transactions` collection** | Cross-posting silently fails without these fields. All data sync work is fragile without this | 30 min |
| **2** | **Enforce plan limits in PocketBase collection rules (server-side)** | Right now any user can open DevTools and create unlimited records. P0 security issue for a paid product | 2 hours |
| **3** | **Wire Reports page to real `useFinancialMetrics` data** | Reports is the #1 PRO-only feature. If it shows fake data, it destroys trust the moment a user upgrades | 4 hours |
| **4** | **Add password reset flow** | Without this, every forgotten password = permanent account loss or manual support intervention | 2 hours |
| **5** | **Integrate Mercado Pago / Stripe** | The entire monetization system is a facade until a real payment is processed | 1 day |

---

## 4. PRODUCT THINKING

### What Could Increase Retention

The single highest-impact retention driver for a MEI financial tool is **proactive alerts**. Users don't open a finance app because they want to — they open it when they're worried. Build the worry triggers:

- "You have 3 bills due this week totaling R$1.200"
- "Your expenses are 18% higher than last month"
- "You've used 78% of your annual MEI limit"

These should appear as push notifications (PWA supports this), emails, and Dashboard banners. Users who receive these alerts have 3× the 30-day retention of users who don't.

**Make data entry feel effortless.** The biggest churn reason for financial tools is "too much work to keep updated." Consider:
- Bank statement import via CSV/OFX (single most-requested feature in this category)
- Receipt photo → transaction (OCR via Google Vision API)
- Recurring transactions (Phase 4 — do this early)

### What Could Increase PRO Conversion

The current upgrade flow is triggered by hitting a limit (reactive). The highest-converting SaaS products also use **proactive value demonstrations**:

1. **Show PRO features in a "preview" state** — don't hide them entirely. Show the Cash Flow Forecast chart with blurred data and a "Unlock with PRO" button. Users need to see the value before they'll pay for it.

2. **The 30-day trial is your best conversion tool** — the login streak reward already grants a trial. Maximize this: show a trial countdown banner, send a "3 days left" email, and make the PRO features genuinely sticky during the trial.

3. **Price anchor the annual plan** — show monthly price vs annual price ("R$29/mês ou R$197/ano — economize R$151"). Brazilian SaaS typically converts 60% of buyers to annual when the discount is 40%+.

4. **Target the MEI annual limit anxiety** — "You've earned R$51.000 of your R$81.000 MEI limit. At this pace, you'll hit the limit in November. Upgrade PRO to get automatic alerts and transition planning tools." This converts at significantly higher rates than generic PRO pitches.

### What Features Are Unnecessary (Cut or Defer)

| Feature | Recommendation | Reason |
|---------|----------------|--------|
| **Bio field in Profile** | Remove | No one reads another user's bio in a financial tool |
| **Login streak gamification** | Simplify | Being gamed (permanent PRO). Replace with a simple 30-day trial CTA |
| **PF/PJ classification in Cash Flow** | Defer to Phase 4 | Adds significant complexity for a feature most MEIs won't use |
| **`bio` and `company` fields** | Merge with `activityType` | Same concept, one field is enough |
| **Investments Guide** | Keep as static content | Don't spend engineering time on it — it's a static page with external links |

---

## 5. EXECUTION GUIDANCE FOR AI-ASSISTED DEVELOPMENT

When working with Claude on this roadmap, give tasks in this format for maximum precision:

```
Task: [Phase X.Y title]
File(s): [exact file paths]
Current behavior: [what it does now]
Expected behavior: [what it should do]
Constraint: [don't break X, must use Y pattern]
```

**The single most important technical decision still pending:** whether to keep `payables` and `receivables` as separate PocketBase collections or fully migrate them into the unified `transactions` collection. This decision affects every future feature.

**Recommendation: migrate to unified.** The current split architecture will create bugs indefinitely. Do it once, cleanly, in Phase 1.

---

*Last updated: 2026-04-09*
