# RiskPulse AI Architecture

## Overview

RiskPulse AI is a modular insurance underwriting proof-of-concept built as a monorepo with three main layers:

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Express + TypeScript API layer
- Shared domain package: deterministic underwriting, pricing, leakage, and brief-generation logic

The system is designed to process synthetic policy records through a deterministic analysis pipeline and present the outputs to underwriters in a clear, explainable interface.

## Repository structure

```text
RiskPulse-AI/
├─ apps/
│  ├─ backend/
│  │  └─ src/
│  │     ├─ app.ts
│  │     ├─ contracts.ts
│  │     ├─ server.ts
│  │     └─ ...
│  └─ frontend/
│     └─ src/
│        ├─ App.tsx
│        ├─ components/
│        ├─ services/
│        ├─ utils/
│        └─ data/
├─ packages/
│  └─ shared/
│     └─ src/
│        ├─ syntheticPolicyData.ts
│        ├─ riskScoring.ts
│        ├─ pricingEngine.ts
│        ├─ ratingLeakage.ts
│        ├─ underwritingDecision.ts
│        ├─ aiUnderwriter.ts
│        └─ index.ts
├─ docs/
│  ├─ architecture.md
│  └─ architecture.svg
├─ package.json
├─ tsconfig.base.json
├─ README.md
└─ package-lock.json
```

## Architectural layers

### 1. Frontend layer

Location: `apps/frontend/src`

Responsibilities:

- Dashboard overview with underwriting KPI cards and portfolio summaries
- Policy review table and selection flow
- Policy detail workspace
- AI Underwriter Brief display
- What-If Simulator for scenario analysis
- Presentation of deterministic outputs using INR formatting and enterprise dashboard styling

Key implementation files:

- `apps/frontend/src/App.tsx`
- `apps/frontend/src/components/PolicyDetailWorkspace.tsx`
- `apps/frontend/src/services/policyDetailApi.ts`
- `apps/frontend/src/utils/scenario.ts`

### 2. Backend API layer

Location: `apps/backend/src`

Responsibilities:

- Exposes health and policy analysis endpoints
- Reads synthetic policy records from the shared package
- Calls shared deterministic services for risk, pricing, leakage, and underwriting evaluation
- Returns typed payloads for the frontend

Key implementation files:

- `apps/backend/src/app.ts`
- `apps/backend/src/server.ts`

### 3. Shared domain and decision layer

Location: `packages/shared/src`

Responsibilities:

- Define synthetic insurance policy schema and sample records
- Compute risk score and risk factors
- Recommend premium adjustments
- Detect rating leakage and severity
- Determine underwriting decision
- Compose AI Underwriter Brief and recommended human action

Key files:

- `syntheticPolicyData.ts`
- `riskScoring.ts`
- `pricingEngine.ts`
- `ratingLeakage.ts`
- `underwritingDecision.ts`
- `aiUnderwriter.ts`

## Data flow and decision pipeline

The actual flow implemented in the repository is:

Synthetic policy data
  -> risk scoring
  -> pricing recommendation
  -> rating leakage detection
  -> underwriting decision
  -> AI Underwriter Brief
  -> frontend dashboard and Policy Detail Workspace

### Synthetic policy data

The system uses `syntheticPolicyRecords` from `packages/shared/src/syntheticPolicyData.ts`.

Each synthetic record contains:

- customer profile
- policy metadata
- vehicle attributes
- claims history
- telematics signals
- premium and payment data
- economic indicators
- risk metadata

This synthetic data is used for all calculations and UI examples and is not connected to a database or external system.

### Risk scoring

`calculateRiskProfile(record)` in `riskScoring.ts` computes:

- overall score from 0 to 100
- risk band (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- factor-level breakdown with labels, contribution, weight, and explanation

The algorithm adds weighted contributions from factors such as:

- age profile
- annual mileage
- claims history
- claim severity
- telematics behaviour
- night-driving ratio
- vehicle profile
- economic conditions
- policy history

### Adaptive pricing

`calculateRecommendedPremium(currentPremium, riskProfile)` in `pricingEngine.ts`:

- applies risk-based multipliers to the current premium
- computes premium change amount and percentage
- determines whether the premium is underpriced
- returns the recommended premium and explanation

This is a deterministic pricing recommendation engine, not an external ML service.

### Rating leakage detection

`detectRatingLeakage(currentPremium, riskProfile)` in `ratingLeakage.ts`:

- compares current premium to the recommended premium
- calculates estimated leakage amount and leakage percentage
- assigns severity (`NONE`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- identifies underpricing risk

### Underwriting decision

`determineUnderwritingDecision(currentPremium, riskProfile)` in `underwritingDecision.ts`:

- combines risk score and leakage assessment
- identifies whether the policy should be `APPROVE`, `REVIEW`, or `REFER`
- returns recommended human action and top risk drivers

This is the underwriting decision layer and is deterministic rule-based logic.

### AI Underwriter decision-support layer

`createUnderwriterBrief(...)` in `aiUnderwriter.ts` composes a structured summary from the upstream outputs:

- customer summary
- risk assessment
- premium summary
- leakage assessment
- underwriting decision
- human review action
- generatedFrom metadata

This layer is explicitly framed as decision support. It aggregates the deterministic outputs into a readable brief but does not represent an autonomous pricing or underwriting decision.

### What-If simulator

`apps/frontend/src/utils/scenario.ts` creates a scenario record from user-adjusted inputs:

- annual mileage
- claim count
- driving behaviour risk

It then reuses the same shared services to compute a simulated outcome:

- updated risk score and risk level
- recommended premium
- leakage amount and percentage
- decision outcome

This keeps the simulator consistent with the same business logic used by the backend and risk engine.

## API layer

The backend in `apps/backend/src/app.ts` exposes the following API surface:

- `GET /api/health`
- `GET /api/policies`
- `GET /api/policies/:policyId`
- `GET /api/policies/:policyId/risk-profile`
- `GET /api/policies/:policyId/pricing`
- `GET /api/policies/:policyId/leakage`
- `GET /api/policies/:policyId/underwriting-decision`
- `GET /api/policies/:policyId/ai-brief`

The front-end calls these endpoints through `apps/frontend/src/services/policyDetailApi.ts`, which fetches policy data and aggregates the result into a single workspace payload.

## Deterministic logic vs AI-assisted support vs human decision

### Deterministic business logic

Implemented in the shared package and used by both backend and frontend scenario logic:

- risk scoring
- pricing recommendation
- leakage detection
- underwriting decision rules

These functions are explicit, testable, and deterministic.

### AI-assisted decision support

The `AI Underwriter Brief` is generated by `createUnderwriterBrief(...)` using the deterministic outputs above. It is presented as human-readable decision support and is clearly labeled as such.

This is not an external AI provider or autonomous underwriting engine. It is a structured synthesis of rules-based outputs.

### Human underwriter decision

The final underwriting decision remains with the human reviewer. The UI and API clearly expose recommended action, rationale, and evidence, but the user/underwriter is the decision maker.

## Runtime interaction

A typical request flow is:

1. Synthetic policy record is loaded from the shared package.
2. Backend requests the policy ID and invokes the shared services.
3. Risk score is calculated.
4. Recommended premium is calculated from risk profile.
5. Leakage is detected by comparing actual premium to recommended premium.
6. Underwriting decision is produced from risk and leakage signals.
7. AI Underwriter Brief is generated from the same upstream outputs.
8. Frontend renders the data across the dashboard and Policy Detail Workspace.
9. Underwriter can review or adjust scenario assumptions via the What-If Simulator.

## Summary

RiskPulse AI is a deterministic, explainable underwriting support system built from synthetic policy data and shared risk logic. It intentionally separates:

- business rules and scoring logic
- AI-assisted brief generation
- human underwriter review and decision-making

The architecture is intentionally simple, transparent, and aligned with the current repository implementation.
