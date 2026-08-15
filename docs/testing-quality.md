# Testing & Quality

## Overview

RiskPulse AI uses a layered testing strategy built around deterministic underwriting logic and API/UI validation. The project intentionally emphasizes repeatable tests that validate real business behavior without depending on external systems, remote AI providers, or database state.

The test suite covers:

- shared domain model and synthetic dataset integrity
- risk scoring thresholds and classifications
- pricing adjustments and underpricing detection
- leakage severity scenarios
- underwriting decision outcomes
- AI Underwriter brief generation
- backend API success and failure cases
- frontend scenario simulation and INR formatting
- build validation across the monorepo

## Test strategy

The repository follows a small but meaningful test pyramid:

1. Shared deterministic logic tests
2. API contract tests
3. Frontend utility and simulation tests
4. Build verification with TypeScript/Vite compilation

This keeps tests focused on business scenarios rather than superficial UI snapshots or mock-only assertions.

## Test layers

### 1. Shared domain model tests

Location: `packages/shared/src/*.test.ts`

Covered modules:

- `index.test.ts` verifies the synthetic policy dataset size and structural validity
- `riskScoring.test.ts` validates low, medium, high, and critical thresholds
- `pricingEngine.test.ts` validates pricing uplift and underpricing detection
- `ratingLeakage.test.ts` validates NONE, LOW, MEDIUM, HIGH, and CRITICAL leakage thresholds
- `underwritingDecision.test.ts` validates APPROVE, REVIEW, and REFER outcomes
- `aiUnderwriter.test.ts` validates the decision-support brief and human review action

These tests assert real behavior of the underwriting engine and are deterministic because they depend only on the synthetic record set and explicit formulas.

### 2. Backend API tests

Location: `apps/backend/src/app.test.ts`

Covered behaviors:

- service health endpoint
- policy listing
- risk profile lookup
- pricing recommendation lookup
- leakage lookup
- underwriting decision lookup
- AI brief lookup
- 404 not-found behavior
- dashboard summary endpoint

The backend tests confirm that the API layer returns consistent payloads and error handling without introducing logic drift from the deterministic services.

### 3. Frontend tests

Locations:

- `apps/frontend/src/utils/inr.test.ts`
- `apps/frontend/src/utils/scenario.test.ts`
- `apps/frontend/src/services/dashboardApi.test.ts`

Covered behaviors:

- correct INR formatting using `en-IN`
- scenario calculation using the real shared deterministic services
- non-mutation of the base policy record when simulating a scenario
- dashboard API client shapes and expected payload sections

These tests verify the frontend integrates with the backend and shared engine logic without duplicating underwriting rules in the UI.

## Important scenarios covered

### Risk scenarios

The tests cover:

- low-risk profile classification
- medium-risk profile classification
- high-risk profile classification
- critical-risk profile classification
- explicit threshold boundaries such as 10, 45, 65, and 88

### Pricing scenarios

The tests cover:

- low-risk premium adjustments
- medium-risk premium uplift
- high-risk pricing increase
- critical-risk pricing escalation
- underpricing detection when the current premium falls below the recommended premium materially

### Leakage scenarios

The tests cover:

- no leakage when pricing is aligned
- LOW leakage
- MEDIUM leakage
- HIGH leakage
- CRITICAL leakage

### Underwriting decision outcomes

The tests cover:

- APPROVE result for low-risk policies
- REVIEW route for medium-risk or moderate leakage scenarios
- REFER result for critical conditions and material leakage risk

### AI Underwriter scenarios

The tests cover:

- high-risk policy brief generation
- low-risk concise brief generation
- leakage severity surfaced in the summary
- human review recommendation preserved from underlying deterministic decision logic

### Data immutability

The frontend simulator test verifies that building a scenario does not mutate the original synthetic policy record, which is important for deterministic scenario analysis.

## Build validation

The repository uses TypeScript compilation and Vite bundling to validate production build health.

The root build script performs:

- shared package TypeScript build
- frontend build
- backend build

This ensures the monorepo compiles together and that TypeScript contracts remain valid across packages.

## API validation

The backend validation confirms the API layer is stable for both happy-path and error-path use cases. This includes:

- successful responses for all major underwriting endpoints
- consistent 404 handling for missing policy IDs
- correct structured payloads and types

## Frontend validation

The frontend validation confirms:

- INR formatting is consistent and correct
- scenario calculations remain deterministic
- dashboard API contract uses the expected sections and types
- simulator logic does not mutate source data

## Limitations and remaining test gaps

The current test suite is strong for the repo’s deterministic underwriting and API scope, but there are still some realistic gaps:

- no browser-driven UI integration test layer for the mounted dashboard or detail workspace
- no end-to-end visual regression coverage for the enterprise dashboard styling
- no exhaustive fuzzing or boundary-value analysis across every synthetic record in the dataset
- no direct contract snapshot test for every backend response payload beyond key route checks

These are not defects in the current implementation; they are remaining quality gaps that would require broader tooling or a larger test harness.

## Quality conclusion

The repository has meaningful coverage for the actual underwriting business logic, API layer, and frontend simulation requirements. The tests are deterministic, repeatable, and rooted in real domain scenarios rather than mock-only behavior.

The biggest remaining improvement is broader UI-level integration testing, but the current suite is appropriate for the project’s synthetic, deterministic scope and is already green in the repository build/test workflow.
