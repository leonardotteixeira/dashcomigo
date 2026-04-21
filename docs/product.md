# Product — Dashcomigo

---

## What Is Dashcomigo?

Dashcomigo is a **web-based financial management platform** for Brazilian MEIs and small business owners. It centralizes all financial activity — transactions, cash flow, receivables, payables, investments — into a single, intelligent dashboard.

The platform connects directly to Brazilian bank accounts via **Open Finance (Pluggy)**, transforming raw bank data into actionable financial intelligence.

---

## What It Does Today

### 1. Dashboard
The central command center. Shows at a glance:
- Current cash balance (real-time)
- Total receivables and payables
- Monthly income vs. expenses
- Open Finance connection status
- Alerts and smart notifications

### 2. Cash Flow Management
- Automatic import of bank transactions via Open Finance
- Manual transaction entry
- Automatic classification: income vs. expense, PF vs. PJ (personal vs. business)
- Monthly evolution chart
- Category breakdown

### 3. Accounts Payable
- Track bills, invoices, and obligations
- Status management: pending, paid, overdue
- Due date alerts
- Supplier tagging

### 4. Accounts Receivable
- Track client payments and expected income
- Overdue alerts
- Client-level receivables view

### 5. Investment Tracking (Open Finance)
- Real portfolio imported directly from banks via Open Finance
- Supports: Renda Fixa, Ações, ETFs, Fundos de Investimento, Previdência, FIIs, COEs, Criptomoedas
- Portfolio summary: total invested, current value, absolute and % return
- Distribution by asset type
- CDI benchmark comparison
- For users without Open Finance: curated investment suggestions (Tesouro Direto, CDB, LCI/LCA, Fundos)

### 6. Financial Reports (PRO)
- Advanced financial reporting with:
  - Revenue vs. expense analysis over 3, 6, or 12 months
  - Monthly P&L table
  - Category breakdown charts
  - Expense trend analysis
  - Cash flow forecast (next 30 days)
  - **Investment analysis section** (portfolio vs CDI, asset allocation chart)
- Export to Excel (XLSX) and PDF

### 7. Client Management
- Client database
- Revenue attribution per client
- Client profitability view

### 8. Supplier Management
- Supplier registry
- Expense tracking by supplier

### 9. Proposals
- Create and send financial proposals
- Track proposal status

### 10. MEI Tax (DAS)
- DAS tax simulation and reminders
- Faturamento tracking vs. MEI limits

### 11. Simulators
- Financial scenario simulators for planning

---

## What It Will Do — The Open Finance Vision

Open Finance is the infrastructure layer that transforms Dashcomigo from a manual tracking tool into an **automatic financial intelligence engine**.

### Near Term (Active Development)
- ✅ Bank connection via Pluggy widget
- ✅ Automatic transaction import and classification
- ✅ Investment portfolio import (real data from banks)
- ✅ Periodic background sync (every 6 hours)
- 🔄 Multi-account aggregation (multiple banks, one view)
- 🔄 Smart deduplication across connections

### Mid Term
- 📋 Real-time alerts ("Your DAS is due in 5 days, and your cash position is R$X")
- 📋 Cash flow prediction based on recurring transaction patterns
- 📋 Automatic PF/PJ expense separation
- 📋 Investment recommendations based on available cash
- 📋 Comparison: "Your portfolio vs. peers in similar revenue bracket"

### Long Term
- 🔮 AI-powered financial advisor layer
- 🔮 Credit score simulation and loan eligibility
- 🔮 Integration with financial product marketplace (insurance, credit, investments)
- 🔮 Automated DAS filing assistance
- 🔮 Multi-entity management (for entrepreneurs with multiple businesses)

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PocketBase (cloud-hosted) |
| Open Finance | Pluggy SDK (Brazil Open Finance) |
| Charts | Recharts |
| Auth | PocketBase Auth + Google OAuth |
| Payments | Stripe / Asaas |
| Hosting | Railway (backend + database) |

---

## Target User

**Primary:** Brazilian MEI (Microempreendedor Individual)
- Sole proprietors earning up to R$81,000/year
- 15+ million registered in Brazil
- Typically manages finances via WhatsApp, spreadsheets, or not at all

**Secondary:** Small business owners (ME, EPP)
- 1–20 employees
- Need basic financial management without enterprise complexity

**Tertiary:** Freelancers and autonomous professionals
- Variable income, multiple clients
- Need to separate personal from professional finances
