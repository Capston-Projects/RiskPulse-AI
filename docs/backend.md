# RiskPulse AI Backend

## Overview

The backend is a lightweight Express + TypeScript API that exposes deterministic underwriting and pricing analysis for synthetic insurance data. It is intentionally separated from the business logic layer: the actual calculations live in the shared package and are reused by the API layer.

The backend does not implement a database, authentication, persistence layer, external AI provider integration, or production-grade policy system integration. It is a proof-of-concept API that serves policy records and underwriting support outputs for the frontend application.

## Architecture

The backend sits between the shared domain services and the frontend:

```text
Synthetic policy records
        |
        v
@riskpulse/shared services
  - calculateRiskProfile
  - calculateRecommendedPremium
  - detectRatingLeakage
  - determineUnderwritingDecision
  - createUnderwriterBrief
        |
        v
Express API routes in apps/backend/src/app.ts
        |
        v
Frontend (React + Vite)
```

## Responsibility boundaries

### API responsibilities

- return service health information
- expose synthetic policy summaries
- return full policy detail payloads
- return underwriting analysis for a policy
- normalize errors and validation issues
- present explicit, typed responses

### Business logic responsibilities

Business logic is not duplicated in the backend. Instead, the backend calls the shared package functions that calculate:

- risk profile
- premium recommendation
- rating leakage assessment
- underwriting decision
- AI Underwriter Brief

This keeps the backend focused on request handling and response shaping.

## Key files

- `apps/backend/src/app.ts` — main Express application and route definitions
- `apps/backend/src/contracts.ts` — TypeScript response contract interfaces
- `apps/backend/src/server.ts` — server bootstrap and port configuration
- `apps/backend/src/app.test.ts` — API-level verification tests

## Endpoints

All routes are under `/api`.

### Health

```http
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "service": "riskpulse-ai-backend"
}
```

### Policy listing

```http
GET /api/policies
```

Returns an array of summary records for the synthetic policy dataset.

Each item includes:

- `policyId`
- `customerId`
- `customerName`
- `coverageType`
- `vehicle`
- `currentPremiumAnnual`
- `status`
- `riskBand`

### Policy detail

```http
GET /api/policies/:policyId
```

Returns the full synthetic policy record for a valid policy, with a metadata flag:

```json
{
  "_meta": {
    "decisionSupport": true
  }
}
```

### Risk profile

```http
GET /api/policies/:policyId/risk-profile
```

Response shape:

```json
{
  "score": 62.1,
  "riskLevel": "HIGH",
  "factors": [
    {
      "label": "Age profile",
      "weight": 12,
      "contribution": 12,
      "explanation": "Age of 25 adds 12 risk points based on age-band sensitivity."
    }
  ]
}
```

### Pricing recommendation

```http
GET /api/policies/:policyId/pricing
```

Response shape:

```json
{
  "recommendedPremium": 2112.5,
  "premiumChangeAmount": 487.5,
  "premiumChangePercent": 30,
  "isUnderpriced": true,
  "underpricingGap": 487.5,
  "explanation": "Risk profile is high with a score of 62.1. Current premium is 1625 and recommended premium is 2112.5. This represents a premium change of 30%."
}
```

### Rating leakage

```http
GET /api/policies/:policyId/leakage
```

Response shape:

```json
{
  "currentPremium": 1625,
  "recommendedPremium": 2112.5,
  "estimatedLeakageAmount": 487.5,
  "leakagePercentage": 30,
  "severity": "HIGH",
  "explanation": "Potential rating leakage detected because the current premium is 30.00% below the recommended premium for a high risk profile.",
  "underpriced": true,
  "riskScore": 62.1
}
```

### Underwriting decision

```http
GET /api/policies/:policyId/underwriting-decision
```

Response shape:

```json
{
  "decision": "REFER",
  "reason": "The profile has high risk exposure, material underpricing risk, and significant leakage indicators requiring specialist underwriting review.",
  "topRiskDrivers": ["Economic conditions", "Age profile", "Policy history"],
  "recommendedAction": "Escalate to senior underwriter for manual review and pricing correction before renewal approval.",
  "riskScore": 62.1,
  "recommendedPremium": 2112.5,
  "leakageSeverity": "HIGH",
  "currentPremium": 1625
}
```

### AI Underwriter Brief

```http
GET /api/policies/:policyId/ai-brief
```

Response shape:

```json
{
  "decisionSupport": true,
  "customerSummary": {
    "customerId": "CUST-1007",
    "policyholderName": "Chloe Turner",
    "age": 25,
    "postcode": "B90 3CD",
    "policyId": "POL-2007",
    "coverageType": "Comprehensive",
    "vehicle": "Kia Rio (2021)",
    "renewalStatus": "Active"
  },
  "riskAssessment": {
    "riskLevel": "HIGH",
    "score": 62.1,
    "topRiskDrivers": ["Economic conditions", "Age profile", "Policy history"]
  },
  "premiumSummary": {
    "currentPremium": 1625,
    "recommendedPremium": 2112.5,
    "premiumChangeAmount": 487.5,
    "premiumChangePercent": 30,
    "isUnderpriced": true
  },
  "leakageAssessment": {
    "severity": "HIGH",
    "estimatedLeakageAmount": 487.5,
    "leakagePercentage": 30,
    "explanation": "Potential rating leakage detected because the current premium is 30.00% below the recommended premium for a high risk profile."
  },
  "underwritingDecision": {
    "decision": "REFER",
    "reason": "The profile has high risk exposure, material underpricing risk, and significant leakage indicators requiring specialist underwriting review.",
    "recommendedAction": "Escalate to senior underwriter for manual review and pricing correction before renewal approval."
  },
  "humanReviewAction": "Escalate to senior underwriter for manual review and pricing correction before renewal approval.",
  "generatedFrom": [
    "Deterministic risk score engine",
    "Deterministic pricing engine",
    "Deterministic leakage detection service",
    "Deterministic underwriting decision engine"
  ]
}
```

## Validation and request handling

The backend validates the `policyId` path parameter through `requirePolicyId()` before attempting a lookup. If the ID is missing or blank, it returns a `VALIDATION_ERROR` response.

Example validation response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Policy ID is required."
  }
}
```

For unknown policy IDs, the API returns a structured `NOT_FOUND` error.

Example 404 response:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "No policy found for policy ID 'INVALID-ID'."
  }
}
```

Unknown routes also return a 404 payload with a route-aware message.

## Error handling

The application includes:

- a route-not-found middleware
- a generic server error middleware
- typed error payloads using `ApiErrorBody`

This keeps the API responses consistent and helps the frontend present meaningful failures without exposing internal stack traces.

## TypeScript quality and contracts

The backend uses TypeScript interfaces in `apps/backend/src/contracts.ts` to define the request/response contract for:

- policy summaries
- risk profile payloads
- pricing payloads
- leakage payloads
- underwriting decision payloads
- AI Underwriter Brief payloads
- shared error body format

This keeps the API explicit, typed, and aligned with the frontend consumption model.

## Test coverage

API verification is implemented in `apps/backend/src/app.test.ts` using `supertest` and `vitest`.

Covered scenarios:

- health check
- policy listing
- existing policy detail and risk profile response
- pricing recommendation
- leakage detection
- underwriting decision
- AI Underwriter Brief generation
- 404 handling for missing policy IDs

These tests validate the backend contract and the actual service output against the synthetic dataset.

## Summary

The backend is a clean, explicit API layer for the current RiskPulse AI project. It validates policy input, applies shared deterministic underwriting logic, returns structured responses, and keeps business rules in the shared package rather than duplicating them in the Express app. This architecture is appropriate for the project’s current scope and aligns with the repository’s human-in-the-loop underwriting model.
