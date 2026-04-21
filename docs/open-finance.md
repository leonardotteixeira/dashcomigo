# Open Finance Strategy — Dashcomigo

---

## What Is Open Finance?

Open Finance is Brazil's regulatory framework (mandated by the Central Bank of Brazil — Banco Central) that requires financial institutions to share customer data with authorized third parties through standardized APIs — with the customer's explicit consent.

Since 2023, Brazilian Open Finance has enabled:
- **Account data sharing** (balances, transactions, credit history)
- **Investment portfolio sharing** (holdings, performance, allocation)
- **Payment initiation** (direct payments without card networks)
- **40M+ active consents** shared across the ecosystem

For Dashcomigo, Open Finance is not a feature — it is the **foundation of the entire product**.

---

## Why Open Finance Is Central to Dashcomigo

### The Problem With Manual Finance Apps
Traditional financial apps require users to manually enter every transaction. The result:
- Data is always incomplete
- Users abandon the app within weeks
- Insights are based on partial information — and therefore wrong

### The Open Finance Difference
With Open Finance, Dashcomigo becomes **automatic**:
- Transactions appear without any user action
- Investment portfolios are imported directly from banks
- Cash flow reflects the real bank balance, not what the user remembered to enter
- The platform becomes a true **single source of financial truth**

---

## Our Integration: Pluggy

Dashcomigo uses **Pluggy** as its Open Finance infrastructure provider.

Pluggy is a Brazilian fintech that provides:
- A single SDK connecting to **200+ Brazilian financial institutions**
- Standardized data models for accounts, transactions, and investments
- Real-time webhooks for data updates
- Full compliance with Banco Central's Open Finance regulations

### Current Integration

| Feature | Status |
|---------|--------|
| Connect widget (user consent flow) | ✅ Live |
| Transaction import + classification | ✅ Live |
| Investment portfolio import | ✅ Live |
| Background sync (every 6 hours) | ✅ Live |
| Multi-account aggregation | 🔄 In Progress |
| Webhook real-time updates | 📋 Planned |

### Supported Investment Types
- Renda Fixa (CDB, LCI, LCA, Tesouro Direto)
- Ações (equities)
- ETFs
- Fundos de Investimento (Mutual Funds)
- Previdência (PGBL, VGBL)
- FIIs (Real Estate Funds)
- COEs
- Criptomoedas

---

## Data Pipeline

When a user connects their bank account, Dashcomigo runs the following pipeline:

```
Pluggy Widget (user consent)
        ↓
Backend receives itemId + institutionId
        ↓
┌─────────────────────────────────────┐
│         INGESTION PIPELINE          │
│                                     │
│  1. Fetch transactions from Pluggy  │
│  2. Normalize to internal format    │
│  3. Classify: PF vs. PJ            │
│  4. Idempotent persistence          │
│     (no duplicates)                 │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│      INVESTMENT PIPELINE           │
│                                     │
│  1. Fetch all investment types      │
│  2. Map to standard categories      │
│  3. Deduplicate by name + type      │
│  4. Store with current value        │
└─────────────────────────────────────┘
        ↓
PocketBase (cloud database)
        ↓
React Frontend (real-time UI update)
```

---

## How Open Finance Transforms the Platform

### Before Open Finance
| User Action | Effort |
|-------------|--------|
| Add a transaction | Manual entry every time |
| Know current balance | Check bank app separately |
| Track investments | Manually check broker app |
| Generate report | Based on incomplete data |

### After Open Finance
| User Action | Effort |
|-------------|--------|
| Transactions appear | Zero — automatic |
| Current balance | Always real, always synced |
| Investment portfolio | Imported automatically |
| Generate report | Complete, accurate, instant |

---

## Future Open Finance Capabilities

### Phase 2: Intelligence Layer
- **Pattern recognition**: Identify recurring expenses, unusual spikes, seasonal patterns
- **Automatic PF/PJ separation**: AI-assisted classification of personal vs. business transactions
- **Predictive cash flow**: "Based on your last 6 months, you'll have R$X available in 30 days"
- **Investment alerts**: "Your CDB expires in 15 days — here are reinvestment options"

### Phase 3: Financial Advisor Layer
- **Personalized investment recommendations** based on actual cash position and risk profile
- **Credit intelligence**: "Based on your revenue history, you qualify for R$X in credit"
- **DAS optimization**: "You saved R$X vs. other tax regimes this quarter"
- **Multi-entity view**: Entrepreneurs with multiple businesses see consolidated picture

### Phase 4: Financial Product Marketplace
- **Embedded financial products**: Credit, insurance, investment products surfaced in context
- **Revenue sharing model**: Commission on financial product placement
- **B2B data services**: Anonymized, aggregated insights for financial institutions (with full LGPD compliance)

---

## Regulatory & Security Considerations

- All data shared via Open Finance requires **explicit user consent**
- Consent can be revoked at any time through the platform
- Data is processed and stored in compliance with **LGPD** (Brazil's data protection law)
- Pluggy is a **registered Open Finance participant** with Banco Central
- No raw credentials are ever stored — only OAuth tokens with limited scope
- Data is encrypted in transit and at rest
