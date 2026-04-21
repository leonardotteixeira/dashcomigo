# Product Roadmap — Dashcomigo

> Last updated: Q2 2026

---

## Overview

```
NOW ──────────── Q3 2026 ──────────── Q1 2027 ──────────── 2028+
│                    │                    │                    │
│  Foundation        │  Intelligence      │  Platform          │  Ecosystem
│  (Live)            │  (In Progress)     │  (Planned)         │  (Vision)
│                    │                    │                    │
│  Core modules   ✅  │  Open Finance   🔄  │  AI insights    📋  │  Marketplace 🔮
│  Open Finance   ✅  │  Smart reports  🔄  │  B2B API        📋  │  Credit layer🔮
│  Investments    ✅  │  Multi-bank     🔄  │  Mobile app     📋  │  Advisor AI  🔮
```

---

## Phase 1 — Foundation (Completed)

**Goal:** A working product covering the core needs of a Brazilian MEI.

### Core Platform ✅
- User authentication (email + Google OAuth)
- Subscription plans (Free / PRO) with feature gating
- Dashboard with real-time financial overview
- Cash flow management (income and expenses)
- Accounts payable and receivable modules
- Client and supplier management
- Proposals module
- MEI DAS tax tracking and simulators

### Open Finance ✅
- Bank connection via Pluggy widget
- Transaction ingestion pipeline (normalize → classify → persist)
- PF/PJ automatic transaction classification
- Investment portfolio import (8 asset types)
- Background periodic sync every 6 hours
- Idempotent sync — no duplicate records

### Reporting ✅
- Advanced financial reports (PRO plan)
- Revenue vs. expense analysis (3/6/12 months)
- Category breakdown, cash flow forecast
- Investment analysis with CDI benchmark comparison
- Portfolio evolution chart
- Excel and PDF export

---

## Phase 2 — Intelligence (Q3 2026, In Progress)

**Goal:** Make the platform smarter, more automatic, and more actionable.

### Open Finance Improvements 🔄
- Reliable multi-connection management (no duplicates across reconnects)
- Multi-bank aggregation (connect more than one institution)
- Webhook support for real-time transaction updates
- Improved PF/PJ classification with learning rules

### Smart Alerts 📋
- Cash flow warning alerts ("Balance may go negative in 12 days")
- Overdue payment notifications (push + email)
- DAS due date reminders with available balance check
- Investment expiry alerts (CDB, LCI maturity)

### Reporting Enhancements 📋
- Full P&L statement (DRE) by month
- Accounts receivable aging report
- Custom date range for all reports
- Comparison: current period vs. previous period
- Scheduled monthly report delivery via email

### Investment Module 📋
- Historical performance tracking over time
- Asset-level return calculation
- Rebalancing suggestions based on target allocation
- Multi-benchmark comparison (CDI, IPCA, Ibovespa)

---

## Phase 3 — Platform (Q1 2027)

**Goal:** Scale into a comprehensive financial operating system.

### AI Insights Layer
- Natural language financial summaries
- Predictive cash flow (30/60/90 day projections)
- Anomaly detection on unusual expenses
- Personalized financial tips
- AI-assisted tax optimization suggestions

### Mobile Application
- iOS and Android native apps
- Push notifications for all alerts
- Biometric authentication

### B2B Features
- White-label version for accountants and financial advisors
- API for third-party integrations
- Multi-client management dashboard

### Platform Integrations
- NF-e (nota fiscal eletrônica) import
- Direct integration with MEI portal (gov.br)
- Accounting software connectors (Contabilizei, Omie)
- Marketplace integrations (Mercado Livre, Shopify)

---

## Phase 4 — Ecosystem (2028+)

**Goal:** Build the financial ecosystem around the Brazilian entrepreneur.

### Financial Product Marketplace
- Embedded credit offers based on revenue history
- Business insurance marketplace
- Investment product recommendations with execution

### AI Financial Advisor
- Conversational financial advisor (chat interface)
- Goal-based financial planning
- Retirement simulation for MEIs
- Business succession planning tools

---

## Success Metrics

| Phase | Key Metric | Target |
|-------|------------|--------|
| Phase 1 | Monthly Active Users | 500 |
| Phase 2 | Open Finance adoption rate | >60% of paid users |
| Phase 3 | Monthly Recurring Revenue | R$50K |
| Phase 4 | Platform GMV | R$10M+ |
