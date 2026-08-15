# Frontend Dashboard

## Overview

The frontend is implemented in React + TypeScript + Vite + Tailwind CSS and follows a multi-section underwriting dashboard pattern. It is built as a single-page dashboard shell with a policy detail workspace that opens when a policy row is selected.

The frontend is intentionally split between:

- executive portfolio overview screens
- policy detail workspace for decision support
- reusable UI cards and table components
- deterministic scenario simulation reusing the shared domain logic

The actual implementation is in `apps/frontend/src` and is aligned with the project’s human-in-the-loop insurance workflow.

## Architecture

### Screen composition

The main application flow in `App.tsx` is:

1. Render the dashboard when no policy is selected.
2. Render `PolicyDetailWorkspace` when a policy is selected from the review queue.
3. Keep the selected policy state at the top-level app level.

This means the app is intentionally simple: the dashboard is a browsing layer, while the policy detail workspace acts as the operational deep-dive view.

### Main screen areas

The dashboard contains the following sections:

- executive portfolio overview header
- KPI cards
- risk distribution chart
- underwriting review queue
- rating leakage summary
- trend card or portfolio momentum panel

The detail workspace contains:

- risk score card
- premium comparison card
- leakage assessment card
- underwriting decision card
- AI Underwriter Brief card
- What-if risk & pricing simulator

## Major components

### Layout and shell

`Layout` provides the dark enterprise dashboard shell and app framing.

### KPI cards

`StatCard` renders the summary metric cards used in the dashboard and uses color-coded tone classes for positive, warning, critical, and neutral states.

### Risk distribution chart

`RiskDistributionChart` renders a horizontal percentage distribution for Low, Medium, High, and Critical policy bands.

### Review queue

`ReviewTable` renders each escalation row as a clickable action card. It supports keyboard focus states and visible selection styling.

Important behavior:

- clicking a row sets the selected policy ID
- selected rows receive a cyan active state
- the table is accessible via button semantics and focus rings

### Leakage summary

`LeakageSummary` presents banded leakage exposure with policy counts and values for the watchlist.

### Policy detail workspace

`PolicyDetailWorkspace` is the main deep-dive screen. It fetches live data from the backend and renders:

- risk profile
- pricing recommendation
- leakage monitoring
- decision support
- AI underwriter brief
- simulator controls

## API integration

The detail view uses the backend API through `apps/frontend/src/services/policyDetailApi.ts`.

The service fetches a complete workspace payload with parallel requests:

- `GET /api/policies/:policyId`
- `GET /api/policies/:policyId/risk-profile`
- `GET /api/policies/:policyId/pricing`
- `GET /api/policies/:policyId/leakage`
- `GET /api/policies/:policyId/underwriting-decision`
- `GET /api/policies/:policyId/ai-brief`

This is the real data path used for the policy detail workspace. It uses `VITE_API_BASE_URL` when provided, otherwise defaults to `http://localhost:4000/api`.

### Real backend data vs. static dashboard data

The detail workspace is real and backend-driven.

The executive dashboard itself currently uses static data from `apps/frontend/src/data/mockDashboard.ts` for:

- KPI values
- risk distribution percentages
- review queue entries
- leakage watchlist totals
- trend data

This is a genuine implementation gap: the portfolio-level executive dashboard is not yet fed from the backend API, even though the detail workspace is operational and live.

## Business logic and duplication audit

The frontend does not duplicate the underwriting business logic.

The actual logic is kept in the shared domain package and reused by:

- backend endpoints
- frontend scenario utility
- policy detail data assembly

The scenario simulator in `apps/frontend/src/utils/scenario.ts` calls the same shared functions from `@riskpulse/shared`:

- `calculateRiskProfile`
- `calculateRecommendedPremium`
- `detectRatingLeakage`
- `determineUnderwritingDecision`

This keeps the risk, pricing, leakage, and decision rules centralized instead of mirroring them in the UI.

## Design system and UI style

The frontend uses a dark navy enterprise theme with clear card boundaries and strong information hierarchy.

Common patterns include:

- dark slate surfaces and subtle shadows
- uppercase small-label metadata for section headings
- rounded card containers with spacing tuned for underwriting dashboards
- risk-badges using semantic color classes
- crisp typography for KPI data and summary panels
- consistent spacing and panel layout across sections

This matches the repo-level UI guidance in `.github/copilot-instructions.md` and is meant to support enterprise reporting rather than consumer app styling.

## INR currency formatting

Currency formatting is centralized in `apps/frontend/src/utils/inr.ts`.

The implementation uses:

```ts
new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  maximumFractionDigits: 2,
})
```

This ensures the application uses Indian Rupee formatting consistently across the dashboard and detail screens.

## What-if simulator

The simulator is implemented in `PolicyDetailWorkspace` and uses `calculateScenarioOutcome` from `apps/frontend/src/utils/scenario.ts`.

### Current simulator behavior

- users can adjust annual mileage, claim count, and driving behaviour risk
- the code builds a derived policy record without mutating the original record
- the scenario runs through the shared deterministic engine
- the UI displays:
  - adjusted risk score
  - risk level
  - recommended premium
  - leakage amount and percentage
  - underwriting decision

This is consistent with the project’s requirement to reuse existing deterministic logic and avoid duplicated business rules.

## Accessibility and interaction states

The current frontend includes visible interactive treatment for key controls:

- button-based policy row selection
- focus ring styling for interactive rows
- hover border and background changes
- semantic status pills for decision and risk labels
- readable contrast in dark mode

This is a solid baseline for accessibility and interactive clarity, even though the project does not currently include a broad a11y audit across every edge case.

## Responsive enterprise UI

The layout uses grid and flex structures that adapt to desktop sizes and stack cleanly on smaller screens.

Examples:

- KPI cards collapse from four columns to fewer columns on smaller screens
- detail cards use stacked layouts under narrower widths
- review table rows transition to a stacked mobile arrangement

This yields an enterprise dashboard feel without introducing extra UI dependencies.

## Testing

The frontend includes tests for:

- INR formatting in `apps/frontend/src/utils/inr.test.ts`
- scenario simulation logic in `apps/frontend/src/utils/scenario.test.ts`

These tests validate:

- currency output for INR values
- risk/pricing/leakage decision outputs from the scenario utility
- non-mutation of the original policy object when simulating a scenario

## Genuine gaps found

The main genuine gap is that the executive portfolio dashboard is not fed by real backend data; it is still a curated mock dashboard. The detail workspace is fully integrated and correctly uses live backend endpoints, but the top-level overview still relies on static data from `mockDashboard.ts`.

This does not invalidate the core product flow, but it means the dashboard is a polished presentation layer rather than a live portfolio ingest layer. The project also does not currently expose a dedicated backend endpoint for portfolio summary analytics, so the overview remains static by design.

## Summary

The current frontend is a working, enterprise-styled underwriting dashboard with a real backend-driven policy detail workspace and a deterministic simulator. The UI architecture is consistent, the shared business logic is not duplicated, and the design system is coherent.

The main remaining gap is the live-data integration of the executive dashboard summary, which still relies on static mock values rather than API-backed portfolio metrics.
