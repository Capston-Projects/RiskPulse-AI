# Risk & Pricing Engine

## Overview

The Risk & Pricing Engine is implemented in the shared package and is used by both the backend API and the frontend simulation layer. It is deterministic, testable, and built from synthetic policy data only.

The engine is divided into four coordinated modules:

- `riskScoring.ts` — risk score and factor explanation
- `pricingEngine.ts` — premium recommendation and underpricing checks
- `ratingLeakage.ts` — leakage amount, percentage, and severity
- `underwritingDecision.ts` — approval, review, or referral decision

These modules are intentionally separate but connected by a single pipeline:

```text
Synthetic policy record
  -> risk score and factor contributions
  -> recommended premium
  -> leakage assessment
  -> underwriting decision
```

## Scope and design intent

The project does not implement an external AI model or external pricing engine. Instead, the logic is explicit and deterministic, with a clear explanation layer for underwriters.

This satisfies the project’s human-in-the-loop requirement: risk factors, pricing adjustments, leakage severity, and recommended actions are all surfaced in an explainable form.

## Risk scoring engine

File: `packages/shared/src/riskScoring.ts`

### Inputs

The algorithm accepts a full synthetic policy record from `SyntheticPolicyRecord`, including:

- customer age and policy tenure
- policy mileage and renewal history
- claims history and claim severity
- telematics signals
- vehicle profile
- economic indicators

### Factor-based calculation

The score is built from weighted factor contributions:

- Age profile
- Annual mileage
- Claims history
- Claim severity
- Telematics behaviour
- Night driving ratio
- Vehicle profile
- Economic conditions
- Policy history

Each factor is added to a running total and stored with:

- label
- weight
- contribution
- explanation

The score is clamped to a 0–100 range and then classified as:

- `LOW` if score < 35
- `MEDIUM` if score >= 35 and < 60
- `HIGH` if score >= 60 and < 80
- `CRITICAL` if score >= 80

### Explainability

The engine returns a structured factor list with explanation strings such as:

- age of 25 adds 12 risk points based on age-band sensitivity
- annual mileage contributes a weighted score
- driving behaviour indicators contribute based on harsh braking and distraction
- regional and market conditions add economic risk points

This makes the resulting score auditable and reviewable by an underwriter.

### Example logic

The current implementation calculates a score by combining additive penalties from each factor and then normalizes the total score to the 0–100 range.

The key function is:

```ts
calculateRiskProfile(record: SyntheticPolicyRecord): RiskProfile
```

and the classification logic is:

```ts
classifyRiskScore(score: number): RiskLevel
```

## Adaptive pricing engine

File: `packages/shared/src/pricingEngine.ts`

### Inputs

- `currentPremium`: the current annual premium of the policy
- `riskProfile`: the risk score and factor breakdown returned by the risk engine

### Rules

The premium recommendation applies a multiplier based on the risk score:

- score >= 80 -> 1.5x
- score >= 60 -> 1.3x
- score >= 45 -> 1.18x
- score >= 35 -> 1.08x
- otherwise -> 0.96x

This creates a risk-sensitive premium recommendation while keeping the logic deterministic and simple.

### Outputs

The engine returns:

- `recommendedPremium`
- `premiumChangeAmount`
- `premiumChangePercent`
- `isUnderpriced`
- `underpricingGap`
- `explanation`

The underpricing flag is set when:

- the current premium is below the recommended premium, and
- the premium change percent is at least 8%

This produces a clear signal for pricing reviews and renewal analysis.

### Deterministic behavior

The logic does not depend on external APIs or hidden model weights. It is a direct rule-based transformation from score to premium recommendation.

## Rating leakage detection

File: `packages/shared/src/ratingLeakage.ts`

### Inputs

- `currentPremium`
- `riskProfile`

### Calculation

The engine reuses the pricing recommendation and calculates:

```ts
estimatedLeakageAmount = pricing.isUnderpriced ? pricing.underpricingGap : 0
leakagePercentage = (estimatedLeakageAmount / currentPremium) * 100
```

This means leakage is interpreted as the gap between the current premium and the recommended premium when the current premium is materially below the recommended level.

### Severity thresholds

`classifyLeakageSeverity(leakagePercentage)` uses the following thresholds:

- <= 0 -> `NONE`
- < 10 -> `LOW`
- < 20 -> `MEDIUM`
- < 35 -> `HIGH`
- otherwise -> `CRITICAL`

### Explainability

The explanation text is explicit and human-readable:

- whether no material leakage is present
- or that the current premium is X% below the recommended premium for a Y risk profile

This supports underwriting review and pricing discussion without relying on opaque model outputs.

## Underwriting decision engine

File: `packages/shared/src/underwritingDecision.ts`

### Inputs

- `currentPremium`
- `riskProfile`

### Decision thresholds

The logic combines risk score and leakage severity:

- `REFER` when the score is >= 80, leakage is `CRITICAL`, or a materially underpriced policy has severe leakage
- `REVIEW` when the score is >= 45, leakage is `MEDIUM`, severity is high, or premium change exceeds 10%
- otherwise `APPROVE`

### Outputs

Each decision includes:

- `decision`
- `reason`
- `topRiskDrivers`
- `recommendedAction`
- `riskScore`
- `recommendedPremium`
- `leakageSeverity`
- `currentPremium`

### Human review

The logic intentionally recommends human review or escalation rather than claiming autonomous underwriting approval. This matches the project’s explainable and human-in-the-loop design.

## AI Underwriter decision-support layer

File: `packages/shared/src/aiUnderwriter.ts`

This layer does not replace the deterministic engines. Instead, it composes them into a structured underwriting brief using the same underlying outputs.

It produces:

- customer summary
- risk assessment
- premium summary
- leakage assessment
- underwriting decision summary
- human review action
- generation provenance metadata

This is framed as `decisionSupport: true`, which makes the AI-assisted layer distinct from the actual underwriting decision itself.

## Service reuse and modularity

The current implementation is modular and service-oriented:

- the frontend uses the same shared services indirectly through the backend and the scenario utility
- the backend calls the shared functions directly
- the What-If simulator reuses the same shared functions rather than maintaining separate pricing logic

This keeps the system consistent and avoids logic drift between UI, API, and simulator logic.

## Deterministic behavior and synthetic-data safety

The engine is deterministic because:

- inputs are explicit synthetic policy records
- formulas are rule-based and not probabilistic
- no database or external service influences the calculation
- no external AI or remote model is involved

The project stays synthetic-data safe because all records are created in the repository and are not connected to real customer or production policy systems.

## Test coverage

The shared package includes unit tests covering the implemented logic:

- `riskScoring.test.ts`
- `pricingEngine.test.ts`
- `ratingLeakage.test.ts`
- `underwritingDecision.test.ts`
- `aiUnderwriter.test.ts`
- `index.test.ts`

### Coverage areas

- risk classification thresholds
- pricing uplift expectations
- underpricing detection
- leakage severity thresholds
- underwriting review and referral logic
- synthetic dataset integrity

These tests validate the implemented calculations and ensure the deterministic flow remains stable.

## Genuine gaps found

No material business-logic defect was found in the current implementation. The existing deterministic engine is internally consistent and covered by tests.

The only minor observation is that some helper code such as `normalizeRatio` in `riskScoring.ts` is currently unused, but it does not affect runtime behavior or the project’s requirements. No change to business logic was made.

## Summary

RiskPulse AI’s risk and pricing engine is a transparent, deterministic underwriting support layer built from synthetic policy data and explicit rule-based calculations. It supports explainability, leakage detection, pricing review, and human-controlled underwriting decisions without introducing external AI services or production dependencies.
