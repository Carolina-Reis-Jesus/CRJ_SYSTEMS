# Nimbus Helpdesk — PRD

## Original problem statement
Build a highly professional, enterprise-grade SaaS Helpdesk & Ticket Management System (B2B Multi-page App). Production-feel UX/UI, LGPD compliance, RBAC, audit log simulation, client-side validation. Modules: Dashboard, Ticket Queue, Customer Directory, Security & Audit. Design like Linear / Vercel — slate + indigo, emerald/amber/rose for status.

## User personas
- **Support Specialist (Tier 2)** — primary persona. Reads/writes tickets and notes, cannot delete or export PII.
- **Customer (B2B)** — represented through ticket history and masked profile data.
- **Compliance Officer** — consumes audit trail.

## Architecture (date: 2026-02-09)
- Pure frontend SPA. No backend used.
- React 19 + React Router 7 + Tailwind 3 + Shadcn UI + Recharts + Sonner.
- Mock data in `/app/frontend/src/lib/mockData.js`.
- Auth context in `/app/frontend/src/context/AuthContext.jsx` (localStorage session).
- LGPD masking helpers in `/app/frontend/src/lib/lgpd.js`.

## User choices
- Frontend-only mock data; mocked login; English UI; Satoshi font; Recharts area chart.

## What's been implemented (2026-02-09 — MVP)
- Login screen (mocked: `helena@nimbus.support` / `Tier2!2026`) with toast validation.
- Protected routes & layout shell with collapsible sticky sidebar + top bar.
- Dashboard with 4 KPI cards, ticket-volume area chart by priority, agent workload, recent activity.
- Ticket Queue: search, status + priority filters, sort, RBAC-blocked bulk delete, 12 mock tickets with SLA flags.
- Ticket Detail Sheet: customer profile (LGPD-masked), conversation, audit history timeline, internal notes (add note with validation), blocked delete.
- Customer Directory with LGPD masking, reveal toggle (blocked for Tier 2), blocked export.
- Security & Audit: compliance cards, security toggles (API encryption, MFA, IP allow-list), data-retention selector, active sessions w/ revoke, immutable audit log table.
- Sonner toasts for every validation/RBAC outcome.

## Test status
- testing_agent_v3 iteration_1 → success_rate frontend ~95%, no blocking issues.

## Prioritized backlog
### P1 (next)
- Per-row inline reply quick action in Ticket Queue.
- Saved filter views (e.g. "My open tickets", "Breached SLA").
- Keyboard shortcut palette (⌘K) wiring.

### P2
- CSV import for customers (admin-gated mock).
- Light/dark mode toggle.
- Charts: stacked bar for resolution by category.

### P3
- Real backend (FastAPI + Mongo) replacing mock arrays.
- SSO / SAML mock onboarding flow.
