# RiskPulse AI

Adaptive risk intelligence and underwriting decision support for modern property & casualty insurance operations.

RiskPulse AI is a proof-of-concept platform that helps insurers evaluate risk exposure, recommend pricing adjustments, detect potential rating leakage, and support underwriters with explainable, human-reviewed recommendations grounded in deterministic underwriting logic.

## Problem statement

Insurance pricing and underwriting decisions often depend on fragmented signals, delayed reviews, and reactive risk adjustments. In practice, that can lead to inconsistent premium outcomes, pricing drift, underpricing in riskier segments, and slower human review cycles.

RiskPulse AI addresses this by combining risk scoring, pricing recommendations, leakage analysis, and decision-support outputs into a single, transparent underwriting workspace.

## Proposed solution

RiskPulse AI provides a modular monorepo that blends a React + TypeScript frontend, an Express API, and a shared deterministic domain layer. The system evaluates policy-level risk characteristics, models premium uplift or reduction needs, identifies leakage risk, and surfaces a concise AI Underwriter Brief for human review.

The solution is intentionally explainable and human-in-the-loop: it does not claim autonomous underwriting, but instead presents evidence-backed recommendations that underwriters can review, interpret, and act on.

## Key capabilities

- Risk scoring: quantifies portfolio and policy risk using deterministic factor-based scoring
- Adaptive pricing: estimates recommended premium adjustments based on risk profile and current premium
- Rating leakage detection: highlights where current pricing may be materially below the recommended level
- Underwriting decision support: recommends whether a policy should be accepted, reviewed, or escalated
- AI Underwriter Brief: generates a concise risk and premium narrative with evidence and action guidance
- What-If Simulator: allows users to adjust mileage, claims count, and driving behaviour risk to model impact on risk and pricing

## Key business value

- Makes underwriting risk and pricing logic more visible and auditable
- Supports faster risk review and premium calibration discussions
- Helps surface leakage and underpricing signals before renewal decisions are finalized
- Provides a structured evidence trail for human underwriters
- Creates a safe foundation for future AI-assisted underwriting workflows and portfolio monitoring

## High-level architecture and data flow

The repository follows a clear three-layer architecture:

1. Frontend dashboard and policy detail workspace
   - Built with React, TypeScript, Vite, and Tailwind CSS
   - Renders underwriting KPIs, review queues, policy detail views, and the What-If simulator
2. Backend API layer
   - Built with Node.js and Express
   - Exposes policy summaries and underwriting analysis endpoints
3. Shared domain package
   - Contains deterministic logic for synthetic policy data, risk scoring, pricing, leakage, underwriting decisions, and AI brief generation

Data flow:

Policy data -> shared risk/pricing/leakage/decision algorithms -> backend API -> frontend dashboard/detail views -> human underwriter review

For the repository-accurate architecture breakdown and policy-to-decision flow, see [docs/architecture.md](docs/architecture.md).

## Technology stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Shared logic: TypeScript package for underwriting and pricing models
- Tooling: npm workspaces, Vitest, TypeScript compiler

## Backend

The backend is implemented as a typed Express API layer over deterministic shared underwriting services. See [docs/backend.md](docs/backend.md) for the actual endpoint contract, request/response behavior, validation, and testing coverage.

## Frontend Dashboard

The actual frontend architecture, dashboard sections, live backend integration points, simulator behavior, and testing status are documented in [docs/frontend-dashboard.md](docs/frontend-dashboard.md).

## AI Underwriter

The AI Underwriter layer is documented in [docs/ai-underwriter.md](docs/ai-underwriter.md). It explains the provider-agnostic decision-support architecture, the deterministic inputs it consumes, and the human-in-the-loop guardrails used by the project.

## Testing & Quality

The repository’s testing and quality strategy is documented in [docs/testing-quality.md](docs/testing-quality.md). It covers deterministic domain validation, backend API checks, frontend scenario verification, and the final build validation process.

## Risk & Pricing Engine

The actual underwriting logic is implemented in the shared package and is documented in [docs/risk-pricing-engine.md](docs/risk-pricing-engine.md). It covers the deterministic flow from synthetic policy inputs to risk score, pricing recommendation, leakage detection, and underwriter decision support.

## Explainable and human-in-the-loop approach

RiskPulse AI is designed for transparency rather than opaque automation. Each output includes factors, explanations, severity indicators, and recommended actions.

The application makes the underwriting rationale visible in the interface and API responses, including:

- risk-factor contribution summaries
- premium change explanations
- leakage severity and estimated amount
- recommended human action for review or escalation

This keeps the decision support process human-centered and auditable.

## Synthetic data and privacy statement

This project uses synthetic insurance policy data only. The data is created for demonstration and engineering validation purposes and does not represent any real customer, production policy, or identifiable personal information.

No external data sources, customer records, or production-grade systems are integrated in this repository.

## Project structure

```text
RiskPulse-AI/
├─ .github/
│  └─ copilot-instructions.md
├─ apps/
│  ├─ backend/
│  │  ├─ src/
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ frontend/
│     ├─ src/
│     ├─ package.json
│     └─ vite.config.ts
├─ packages/
│  └─ shared/
│     └─ src/
├─ package.json
├─ tsconfig.base.json
├─ README.md
└─ package-lock.json
```

## Local setup and run commands

From the repository root:

```bash
npm install
```

Start the frontend:

```bash
npm run dev --workspace @riskpulse/frontend -- --host 0.0.0.0
```

Start the backend:

```bash
npm run dev --workspace @riskpulse/backend
```

The backend serves the underwriting API locally on port 4000 by default, and the frontend runs through Vite on a local development port such as 5173 or 5174 depending on availability.

## Build and test commands

```bash
npm run build
npm run test
npm run check
```

The root scripts build the shared package, frontend, and backend, then run the relevant Vitest suites for both applications.

## API endpoint summary

The backend exposes the following endpoints:

```text
GET /api/health
GET /api/policies
GET /api/policies/:policyId
GET /api/policies/:policyId/risk-profile
GET /api/policies/:policyId/pricing
GET /api/policies/:policyId/leakage
GET /api/policies/:policyId/underwriting-decision
GET /api/policies/:policyId/ai-brief
```

Missing or invalid policy IDs return structured 404 or validation responses.

## Demo walkthrough

1. Open the dashboard to review the underwriting portfolio overview and KPI cards.
2. Select a policy from the review table to open the Policy Detail Workspace.
3. Review the policy summary, risk score, premium recommendation, leakage assessment, and underwriting decision.
4. Inspect the AI Underwriter Brief for clear underwriting rationale and recommended next actions.
5. Use the What-If Simulator to adjust mileage, claim count, and driving behaviour risk to evaluate scenario impact on score, premium, and decision.
6. Use the back navigation to return to the dashboard and compare policy-level decision support in context.

## GitHub Copilot Development

GitHub Copilot was used as a supporting development tool throughout the project lifecycle to help with repo setup, deterministic underwriting logic, API contracts, tests, UI refinement, and documentation. The repository-level guidance in [.github/copilot-instructions.md](.github/copilot-instructions.md) kept work aligned with the project’s domain, synthetic-data constraints, testing expectations, and frontend design system.

For the repository-accurate development workflow and review notes, see [docs/copilot-development.md](docs/copilot-development.md).

## Limitations and future enhancements

Current limitations:

- Uses synthetic policy data only; no live policy system integration
- Deterministic rule-based decision logic rather than a production ML model
- No user authentication, persistence, or backend database layer yet
- Limited to a single domain workflow focused on underwriting support and pricing review

Future enhancement opportunities:

- integration with real policy and claims systems
- richer scenario modeling and portfolio analytics
- persistence and audit history for underwriter decisions
- expanded policy segmentation and automation workflows
- stronger integration with enterprise review and approval tools

## Summary

RiskPulse AI is a focused capstone project demonstrating how explainable underwriting intelligence can support better pricing, leakage review, and human decision-making in a modern insurance workflow. The project is intentionally transparent, deterministic, and designed for extension rather than claiming production deployment or real-world customer operations.
