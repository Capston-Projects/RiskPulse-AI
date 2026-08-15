# AI Underwriter

## Overview

The AI Underwriter layer in RiskPulse AI is not a standalone risk model and does not independently calculate underwriting facts. Instead, it receives deterministic outputs from the existing shared business services and packages them into a concise, human-readable decision-support brief.

This repository intentionally keeps the following clearly separated:

- deterministic underwriting calculations in the shared package
- backend API response shaping and validation
- frontend rendering of policy detail and scenario context
- AI-assisted explanation and recommendation generation

The core implementation is in `packages/shared/src/aiUnderwriter.ts` and is consumed by the backend API endpoint at `/api/policies/:policyId/ai-brief`.

## Architecture

### Data flow

```text
Synthetic policy record
  -> calculateRiskProfile()
  -> calculateRecommendedPremium()
  -> detectRatingLeakage()
  -> determineUnderwritingDecision()
  -> createUnderwriterBrief()
  -> backend JSON payload
  -> frontend AI Underwriter Brief panel
```

The AI layer does not replace any of the above functions. It composes them into an underwriting narrative.

### Architectural boundaries

The AI Underwriter layer is provider-agnostic by design. It accepts already computed data and emits a decision-support structure without binding the project to a specific AI vendor, API key, or remote model.

This means the project currently behaves as an explainable decision-support system rather than a production generative AI underwriting engine.

## Input data consumed

The brief generator accepts a single `AIUnderwriterInput` object containing:

- `record`: the synthetic policy record
- `riskProfile`: output from the risk scoring engine
- `pricing`: output from the pricing engine
- `leakage`: output from the rating leakage detector
- `decision`: output from the underwriting decision engine

The implementation therefore consumes only values that already exist and are validated by the deterministic layer.

## Generated decision-support brief

The function `createUnderwriterBrief(input)` returns a structured brief with these sections:

- `decisionSupport`: boolean marker set to `true`
- `customerSummary`
- `riskAssessment`
- `premiumSummary`
- `leakageAssessment`
- `underwritingDecision`
- `humanReviewAction`
- `generatedFrom`

This is the actual payload returned by the backend and rendered in the policy detail UI.

### Included content

The generated brief includes:

- customer, policy, and vehicle summary
- risk level and score
- top risk drivers
- current and recommended premium
- premium change amount and percentage
- leakage severity and cause
- underwriting decision and recommended human action
- explicit provenance metadata describing which deterministic services generated the advice

## Human-in-the-loop approach

The project clearly treats the AI layer as decision support, not autonomous approval.

The current implementation includes:

- `decisionSupport: true`
- explicit human-review action text
- a disclaimer in the UI: “AI-assisted decision support — final decision remains with human underwriter.”
- a recommendation value copied directly from the deterministic underwriting decision engine

This makes the synthesis layer explainable and auditable without inventing its own underwriting facts.

## Limits and constraints

The current AI layer intentionally does not do any of the following:

- generate a separate risk model or score
- independently estimate premium or leakage
- infer policy facts not present in the synthetic record
- call external AI APIs or require API keys
- claim final underwriting authority

This is a design requirement and a repository constraint, not a missing implementation.

## Provider-agnostic design

There are no repository credentials, remote AI endpoints, or provider SDKs configured in the project.

The current design is provider-agnostic and generic because the layer is a pure function over deterministic underwriting outputs. It can later be connected to a real AI provider or a policy-authoring service without changing the underlying risk and pricing logic.

## Frontend and backend integration

### Backend

The Express backend route in `apps/backend/src/app.ts` calls the shared generator and returns the finalized brief payload for `/api/policies/:policyId/ai-brief`.

### Frontend

The UI in `apps/frontend/src/components/PolicyDetailWorkspace.tsx` renders the AI brief in the “AI Underwriter Brief” section. It displays:

- executive assessment
- risk evidence and key drivers
- pricing context
- leakage context
- underwriting recommendation
- recommended human action
- disclaimer text

The brief is consumed from the same backend contract used by the rest of the policy detail workspace.

## What-if simulator interaction

The What-if simulator uses the shared scenario utility, which calls the same deterministic services used by the AI layer:

- `calculateRiskProfile`
- `calculateRecommendedPremium`
- `detectRatingLeakage`
- `determineUnderwritingDecision`

The simulator output is then shown alongside the current underwriting recommendation, but the update remains based on existing rule-based logic and not on a separate AI model.

## Testing

The repository includes unit tests for the AI Underwriter brief in `packages/shared/src/aiUnderwriter.test.ts`.

These tests validate:

- the brief is generated from deterministic upstream outputs
- the brief is clearly marked as decision support
- the human review action is surfaced correctly
- leakage severity is included in the narrative
- the layer returns a human-readable summary without extra fabricated facts

The backend API also verifies the brief route in `apps/backend/src/app.test.ts`.

## Genuine gaps found

No material defect was found in the current AI Underwriter implementation.

The relevant repository behavior is consistent with the design constraints:

- the AI layer consumes deterministic outputs rather than inventing them
- the project is provider-agnostic and does not require external AI access
- the UI and API clearly separate explanatory support from decision authority

## Optional future enhancements

These are not defects, but they could be added later if the project evolves:

- richer narrative templates for different risk levels
- externally configurable provider adapters
- richer audit metadata and timestamping
- exportable underwriter brief formats such as PDF or structured JSON
- integration with a real policy workbench or approval workflow

## Summary

The AI Underwriter in RiskPulse AI is a structured decision-support layer built on deterministic underwriting logic. It explains the result, surfaces the evidence, and delegates final action to the human underwriter. This matches the project’s safety, explainability, and synthetic-data constraints while avoiding external AI dependencies.
