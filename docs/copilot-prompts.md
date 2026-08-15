# RiskPulse AI Copilot Prompts by Development Stage

This document records the Copilot-assisted work used across the twelve stages of the RiskPulse AI capstone. It is based on the repository’s actual implementation, README, development notes, and documentation, and it reflects the project’s real incremental workflow. Where the exact historical prompt wording is not preserved in the repo, the prompt is labeled as “reconstructed from the documented development task.”

The project was developed incrementally with repository-level instructions, validation, tests, and human review. Copilot was used as an engineering assistant to accelerate scaffold work, domain logic, API contracts, UI implementation, and documentation, while the project’s constraints were enforced by the repo guidance in [.github/copilot-instructions.md](.github/copilot-instructions.md) and the workflow notes in [docs/copilot-development.md](docs/copilot-development.md).

---

## Stage 1 — Business Problem Definition

### Goal
Define the underwriting and pricing problem, clarify the human-in-the-loop constraint, and frame the project as explainable decision support rather than autonomous underwriting.

### Copilot prompt
Reconstructed from the documented development task: “Create the initial RiskPulse AI project scope around insurance underwriting, pricing pressure, rating leakage, and explainable human review.”

### What Copilot was asked to do
- draft the project problem statement
- define the business challenge around pricing drift and leakage
- frame the solution as underwriting decision support
- keep the project synthetic-data-only and explainable

### Result/output
The repo’s problem statement and product framing in [README.md](README.md) and the architecture narrative in [docs/architecture.md](docs/architecture.md) were established. The project clearly defines underwriting risk, pricing pressure, leakage, and decision support as the product focus.

### Validation performed
- reviewed repository docs and README for consistency with the actual project scope
- confirmed the problem statement stayed focused on explainability and human review instead of production AI claims

---

## Stage 2 — Data & Risk Model

### Goal
Create the synthetic policy data model and the initial risk model used throughout the project.

### Copilot prompt
Reconstructed from the documented development task: “Build the synthetic policy records and risk scoring model for RiskPulse AI, using deterministic factor-based scoring and insurance underwriting logic.”

### What Copilot was asked to do
- create synthetic insurance policy records
- define the data structure for customer, policy, claims, telematics, premium, and economic risk inputs
- implement factor-based risk scoring with explainable contributions
- keep the data synthetic and bounded to the capstone scope

### Result/output
The shared domain data and risk model were implemented in [packages/shared/src/syntheticPolicyData.ts](packages/shared/src/syntheticPolicyData.ts) and [packages/shared/src/riskScoring.ts](packages/shared/src/riskScoring.ts). The model calculates a score and classifies it as LOW, MEDIUM, HIGH, or CRITICAL with visible factor breakdowns.

### Validation performed
- reviewed actual risk-scoring implementation against the documented problem statement
- confirmed synthetic-only data and explainable factors are still present in the codebase

---

## Stage 3 — Architecture

### Goal
Set up the monorepo structure and define the frontend, backend, and shared logic boundaries.

### Copilot prompt
Reconstructed from the documented development task: “Set up the initial RiskPulse AI project structure using the specified stack and create the frontend, backend, and shared project configuration.”

### What Copilot was asked to do
- scaffold the monorepo
- establish frontend and backend packages
- define TypeScript and workspace configuration
- create the architecture boundary between UI, API, and shared logic

### Result/output
The repo structure matches the architecture described in [docs/architecture.md](docs/architecture.md): frontend in [apps/frontend](apps/frontend), backend in [apps/backend](apps/backend), and shared domain services in [packages/shared](packages/shared).

### Validation performed
- confirmed project structure matches the documented architecture
- checked root package configuration in [package.json](package.json)

---

## Stage 4 — GitHub Repository + Copilot Setup

### Goal
Configure the repository and the Copilot guidance used to keep the project aligned with product expectations, UI design, and constraints.

### Copilot prompt
Reconstructed from the documented development task: “Set up the repository guidance and GitHub Copilot instructions for the RiskPulse AI project, including domain constraints, synthetic data, and UI expectations.”

### What Copilot was asked to do
- create repository-level guidance for Copilot
- define the product and engineering constraints
- keep the work aligned to underwriting, synthetic-only data, and explainability
- define frontend design expectations and validation guidance

### Result/output
The repository-level instructions are in [.github/copilot-instructions.md](.github/copilot-instructions.md), and the development workflow is documented in [docs/copilot-development.md](docs/copilot-development.md).

### Validation performed
- checked Copilot guidance against the actual codebase and documented constraints
- confirmed it emphasizes synthetic data, human review, deterministic logic, and UI consistency

---

## Stage 5 — Backend

### Goal
Implement the backend API layer that exposes not only data but underwriting outputs for the frontend.

### Copilot prompt
Reconstructed from the documented development task: “Build the backend API layer for RiskPulse AI, exposing health, policy, risk, pricing, leakage, underwriting decision, and AI brief endpoints using the shared deterministic services.”

### What Copilot was asked to do
- build Express routes for policy and analysis endpoints
- reuse shared domain logic instead of duplicating it
- shape typed responses for the frontend
- keep API behavior deterministic and testable

### Result/output
The backend implementation is in [apps/backend/src/app.ts](apps/backend/src/app.ts), with typed contracts in [apps/backend/src/contracts.ts](apps/backend/src/contracts.ts). The documented API list in [docs/backend.md](docs/backend.md) matches the actual routes and response types.

### Validation performed
- reviewed the app route set and response names against the backend docs
- verified backend API tests in [apps/backend/src/app.test.ts](apps/backend/src/app.test.ts)

---

## Stage 6 — Risk/Pricing Engine

### Goal
Implement the core deterministic engine for risk scoring, adaptive pricing, rating leakage detection, and underwriting decision support.

### Copilot prompt
Reconstructed from the documented development task: “Build the Risk Scoring Engine, Adaptive Pricing Engine, Rating Leakage Detection service, and Underwriting Decision Engine for RiskPulse AI.”

### What Copilot was asked to do
- implement risk scoring as additive factor-based logic
- implement adaptive pricing using current premium and risk profile
- detect rating leakage and classify severity
- produce an underwriting decision of APPROVE, REVIEW, or REFER
- keep the logic deterministic and explainable

### Result/output
The risk and pricing logic is implemented in [packages/shared/src/riskScoring.ts](packages/shared/src/riskScoring.ts), [packages/shared/src/pricingEngine.ts](packages/shared/src/pricingEngine.ts), [packages/shared/src/ratingLeakage.ts](packages/shared/src/ratingLeakage.ts), and [packages/shared/src/underwritingDecision.ts](packages/shared/src/underwritingDecision.ts). The detailed description in [docs/risk-pricing-engine.md](docs/risk-pricing-engine.md) matches the code.

### Validation performed
- checked the formulas and thresholds against the implemented functions
- ran the shared test suite and confirmed it remained green

---

## Stage 7 — Frontend Dashboard

### Goal
Build the portfolio dashboard and policy detail experience, using the backend API and the repository’s enterprise dashboard design guidance.

### Copilot prompt
Reconstructed from the documented development task: “Build the initial RiskPulse AI frontend dashboard using the existing React + TypeScript + Vite + Tailwind setup, including portfolio overview, review flow, and policy detail workspace.”

### What Copilot was asked to do
- create the dashboard layout and KPI cards
- implement the risk distribution and review queue views
- render policy detail workspace on selection
- integrate with backend API data and keep the UI consistent with the design system

### Result/output
The dashboard and policy detail workspace are implemented in [apps/frontend/src/App.tsx](apps/frontend/src/App.tsx) and [apps/frontend/src/components/PolicyDetailWorkspace.tsx](apps/frontend/src/components/PolicyDetailWorkspace.tsx). The actual UI flow is documented in [docs/frontend-dashboard.md](docs/frontend-dashboard.md).

### Validation performed
- checked the implemented UI flow against the dashboard doc
- confirmed the detail view fetches data from the backend and renders risk, pricing, leakage, and decision sections

---

## Stage 8 — AI Underwriter

### Goal
Add the AI Underwriter Brief as a decision-support layer that summarizes risk evidence and human review guidance without replacing the deterministic engine.

### Copilot prompt
Reconstructed from the documented development task: “Build the AI Underwriter layer for RiskPulse AI using the existing risk, pricing, leakage, and underwriting decision results.”

### What Copilot was asked to do
- create a brief-generation layer over existing outputs
- summarize the customer, risk, premium, leakage, and decision context
- keep the final authority with the human underwriter
- avoid inventing unsupported facts or replacing the deterministic logic

### Result/output
The AI layer is implemented in [packages/shared/src/aiUnderwriter.ts](packages/shared/src/aiUnderwriter.ts) and rendered in the UI in [apps/frontend/src/components/PolicyDetailWorkspace.tsx](apps/frontend/src/components/PolicyDetailWorkspace.tsx). The design and constraints are documented in [docs/ai-underwriter.md](docs/ai-underwriter.md).

### Validation performed
- confirmed the AI brief consumes the deterministic outputs, not an independent model
- verified the UI disclaimer and human review wording
- validated the AI brief API route and tests

---

## Stage 9 — Testing & Quality

### Goal
Validate the implementation with project-appropriate test coverage and keep quality checks aligned to the actual repository requirements.

### Copilot prompt
Reconstructed from the documented development task: “Build the testing and quality strategy for RiskPulse AI, including deterministic domain tests, API validation, frontend scenario checks, and build verification.”

### What Copilot was asked to do
- add shared tests for risk, pricing, leakage, decision, and AI brief behavior
- add backend API tests
- add frontend tests for INR and scenario logic
- document the testing strategy and validation flow

### Result/output
The testing strategy is documented in [docs/testing-quality.md](docs/testing-quality.md), with actual tests in the shared package, frontend, and backend. The validation commands are represented in the repo root scripts in [package.json](package.json).

### Validation performed
- executed the repo build and test commands
- confirmed the suite passes across all workspaces

---

## Stage 10 — Demo

### Goal
Create a realistic and repo-accurate demonstration flow for the capstone presentation.

### Copilot prompt
Reconstructed from the documented development task: “Create the final demo guide for RiskPulse AI, aligned with the actual UI and deterministic logic, and suitable for a concise business/technical presentation.”

### What Copilot was asked to do
- define a clear demo story from business problem to scenario analysis
- match the sequence to the actual screens and data in the app
- explain the dashboard, drill-down, AI brief, and simulator behavior
- include backup flow for runtime issues

### Result/output
The demo guide is in [docs/demo-guide.md](docs/demo-guide.md). It matches the actual app flow and uses the real synthetic-record patterns and logic.

### Validation performed
- checked the demo flow against actual implemented screens and service outputs
- ensured it did not invent unsupported metrics or production claims

---

## Stage 11 — 5 Slides

### Goal
Prepare a concise 5-slide presentation based only on the implemented repo and actual project docs.

### Copilot prompt
Reconstructed from the documented development task: “Prepare exactly five slides for the RiskPulse AI capstone, using only actual repository content and enterprise presentation language.”

### What Copilot was asked to do
- summarize the business problem
- define the architecture and solution
- explain risk, pricing, leakage, and decision logic
- explain the AI Underwriter and simulator
- address business value, Copilot usage, limitations, and future improvement areas

### Result/output
The slide content is in [docs/presentation-5-slides.md](docs/presentation-5-slides.md). It is aligned to the real repository and stays within the project’s deterministic, synthetic, human-led design.

### Validation performed
- checked slide bullets against actual docs and implementation
- removed speculative or marketing-heavy claims

---

## Stage 12 — Final Submission

### Goal
Complete the final readiness review and ensure the repository is consistent, validated, and presentation-ready.

### Copilot prompt
Reconstructed from the documented development task: “Audit the repository against all 12 capstone stages, check consistency across docs and implementation, and ensure the submission is valid and ready.”

### What Copilot was asked to do
- review README completeness and doc consistency
- validate architecture, backend, frontend, risk engine, AI underwriter, tests, and demo materials
- check synthetic-data-only constraints and absence of secrets
- confirm the repo is ready for final submission without speculating on additional features

### Result/output
The repository was reviewed against all 12 stages, and the final submission readiness report is consistent with the actual implementation. The docs and project structure align with the real repo state.

### Validation performed
- reviewed docs, configuration files, and app behavior together
- checked build and test status using the repo’s actual commands

---

## Summary

The project was developed with an incremental prompting pattern: first scaffold, then data and risk logic, then backend, then frontend, then AI brief and simulation, then tests and documentation, and finally the demo and presentation assets. Copilot was used as a focused engineering assistant under repository-level instructions and human review, not as an autonomous decision-maker or source of unsupported claims.
