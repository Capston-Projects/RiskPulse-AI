# RiskPulse AI Copilot Prompt Log

This document is a reusable stage-by-stage playbook for developing and validating the RiskPulse AI Capstone with GitHub Copilot. It is based on the repository’s actual implementation, README, developer notes, and supporting documentation. It does not claim that the prompts below are verbatim historical messages unless the repository already preserved them; when exact wording is unavailable, the prompt is labeled as “reconstructed from the documented development task.”

## How to use this prompt log

- Start with Stage 1 and complete each stage before moving to the next.
- Use the same repository and branch throughout the work so each stage builds on the actual outputs created before it.
- Before accepting Copilot output, review the changed files against the repository instructions in [.github/copilot-instructions.md](.github/copilot-instructions.md) and the project notes in [docs/copilot-development.md](docs/copilot-development.md).
- Run the stated validation after each stage and do not move past a stage until the repository still passes its required build/test checks.
- Keep the project aligned to the synthetic-data-only requirement, the human-in-the-loop underwriting model, and the deterministic Risk → Pricing → Leakage → Decision pipeline.

---

## Stage 1 — Business Problem Definition

### 1. Goal
Define the underwriting and pricing challenge, establish the human-in-the-loop framing, and keep the project grounded in explainable insurance decision support rather than autonomous underwriting.

### 2. Prerequisites
- Review the project overview in [README.md](README.md).
- Read the repository-level guidance in [.github/copilot-instructions.md](.github/copilot-instructions.md).
- Confirm the project remains synthetic-data-only and focused on underwriting decision support.

### 3. Copilot Prompt
Reconstructed from the documented development task: “Review the repository and create the initial RiskPulse AI business problem definition around insurance underwriting, rating leakage, risk-based pricing pressure, and explainable human review. Keep the scope synthetic-data-only, human-in-the-loop, and clearly bounded to underwriting decision support. Before making changes, inspect the existing repository and relevant docs; do not invent production metrics, customer data, or AI capabilities. Do not modify unrelated files.”

### 4. Expected Outcome
- A concise problem statement describing the underwriting challenge and the need for explainable review.
- A clear distinction between the project’s decision-support role and autonomous underwriting.
- Alignment with the repository’s existing purpose and terminology.

### 5. Validation
- Confirm the result matches [README.md](README.md) and the project framing in [docs/architecture.md](docs/architecture.md).
- Verify the summary still emphasizes human review and synthetic-only data.
- Run: `npm run build && npm test`

---

## Stage 2 — Data & Risk Model

### 1. Goal
Create the synthetic policy model and the deterministic risk-scoring foundation used throughout the project.

### 2. Prerequisites
- Stage 1 must be complete and accepted.
- Repository instructions and domain constraints must still be in place.
- The model should be shared and not duplicated in the frontend or backend.

### 3. Copilot Prompt
Reconstructed from the documented development task: “Inspect the existing RiskPulse AI repository and build the synthetic policy records and risk scoring model using the actual project structure. Use synthetic insurance policy data only. Implement deterministic factor-based risk scoring with explainable output for age, mileage, claims, telematics, vehicle profile, economic conditions, and policy history. Keep this logic in the shared domain package, not in the app UI. Before changing files, review the existing repository, docs, and shared package structure. Do not invent new domains, features, or production data. Do not modify unrelated files.”

### 4. Expected Outcome
- Synthetic policy records created in the shared package.
- Risk scoring logic calculates a score and a risk band with factor-level explanations.
- Output remains explainable and human-auditable.

### 5. Validation
- Confirm the logic matches [packages/shared/src/riskScoring.ts](packages/shared/src/riskScoring.ts) and [packages/shared/src/syntheticPolicyData.ts](packages/shared/src/syntheticPolicyData.ts).
- Check that calculations remain deterministic and synthetic-only.
- Run: `npm run build && npm test`

---

## Stage 3 — Architecture

### 1. Goal
Set up the monorepo architecture and define the separation between frontend, backend, and shared domain services.

### 2. Prerequisites
- Stage 2 must be complete and validated.
- The repository structure and package boundaries must be consistent with the project’s intended architecture.

### 3. Copilot Prompt
Reconstructed from the documented development task: “Inspect the repository and establish the RiskPulse AI monorepo structure using the existing project requirements. Create or align the frontend package, backend package, shared package, and root configuration. Keep the architecture modular: frontend handles dashboard and detail views, backend exposes typed API routes, shared package contains deterministic business logic. Before editing files, inspect the current repo and keep the architecture consistent with the docs. Do not change unrelated logic or add unnecessary dependencies.”

### 4. Expected Outcome
- A workable monorepo structure consistent with the repo documents.
- Clear separation between frontend, backend, and deterministic shared logic.
- Root build and workspace scripts aligned to the actual repository.

### 5. Validation
- Confirm the repository structure matches [docs/architecture.md](docs/architecture.md).
- Review [package.json](package.json) and workspace boundaries.
- Run: `npm run build && npm test`

---

## Stage 4 — GitHub Repository + Copilot Setup

### 1. Goal
Establish the repository-level guidance that keeps Copilot aligned with the project’s domain, constraints, and UI system.

### 2. Prerequisites
- Stages 1–3 must be in place.
- The repo should already have a clear architecture and product intent.

### 3. Copilot Prompt
Reconstructed from the documented development task: “Inspect the repository and create GitHub Copilot instructions for RiskPulse AI. Include product intent, synthetic-data-only constraints, human-in-the-loop underwriting, explainability, deterministic design, frontend UI direction, and validation expectations. Keep the instructions repository-aware and ensure they match the actual stack: React + TypeScript + Vite frontend, Node.js + Express + TypeScript backend, and shared deterministic domain logic. Before changing files, read the existing repository guidance and relevant docs. Do not invent production claims, data sources, or external systems.”

### 4. Expected Outcome
- A repo-level instruction file consistent with [.github/copilot-instructions.md](.github/copilot-instructions.md).
- Clear guidance for future Copilot-driven changes and validation.
- Alignment with the UI design system and human-review requirements.

### 5. Validation
- Check the file against the current product intent and actual implementation.
- Review the repository guidance in [docs/copilot-development.md](docs/copilot-development.md).
- Run: `npm run build && npm test`

---

## Stage 5 — Backend

### 1. Goal
Implement a typed Express backend that exposes underwriting outputs using the existing shared domain logic.

### 2. Prerequisites
- Stages 1–4 must be complete.
- The deterministic risk and synthetic data model must already exist.
- The backend must rely on shared services rather than duplicating business logic.

### 3. Copilot Prompt
Reconstructed from the documented development task: “Inspect the existing RiskPulse AI repository before making changes. Build the backend API layer for the underwriting proof-of-concept using the existing shared services. Expose policy summaries and policy-level analysis endpoints for health, risk profile, pricing recommendation, leakage detection, underwriting decision, and AI Underwriter brief. Keep the backend typed, deterministic, and repository-aware. Reuse the shared package rather than duplicating business logic. Before editing files, read the existing backend and shared package structure and follow the repository instructions. Do not invent unrelated features, external systems, or database logic. Do not modify unrelated files.”

### 4. Expected Outcome
- Working Express routes in [apps/backend/src/app.ts](apps/backend/src/app.ts).
- Type-safe contracts in [apps/backend/src/contracts.ts](apps/backend/src/contracts.ts).
- API outputs consistent with the actual risk, pricing, leakage, and decision functions.

### 5. Validation
- Confirm endpoint behavior matches [docs/backend.md](docs/backend.md).
- Review backend tests in [apps/backend/src/app.test.ts](apps/backend/src/app.test.ts).
- Run: `npm run build && npm test`

---

## Stage 6 — Risk/Pricing Engine

### 1. Goal
Build the deterministic pipeline for Risk → Pricing → Leakage → Decision and keep the outputs explainable and auditable.

### 2. Prerequisites
- Stage 5 must be complete and stable.
- The shared synthetic policy model and risk definitions from Stage 2 must already exist.
- The backend should already be using the shared business logic for policy analysis.

### 3. Copilot Prompt
Reconstructed from the documented development task: “Inspect the repository and implement the deterministic Risk/Pricing Engine for RiskPulse AI using the existing shared services. Add adaptive pricing logic, rating leakage detection, and underwriting decision logic. Keep the flow explicit: risk score -> recommended premium -> leakage assessment -> underwriting decision. Preserve the synthetic-data-only requirement, human-in-the-loop review, and explainability. Use the repository’s existing terminology: Risk, Pricing, Leakage, Decision, and Underwriting Decision Support. Before editing files, read the current shared package and docs. Do not invent features, external AI providers, or production logic. Do not modify unrelated files.”

### 4. Expected Outcome
- Deterministic logic for risk, pricing, leakage, and decision in the shared domain package.
- Output consistent with the documented architecture and decisions in [docs/risk-pricing-engine.md](docs/risk-pricing-engine.md).
- Later backend and frontend stages can reuse the results without duplication.

### 5. Validation
- Confirm the formulas and thresholds match the actual code in the shared package.
- Run the shared test suite and the root build/test validation.
- Run: `npm run build && npm test`

---

## Stage 7 — Frontend Dashboard

### 1. Goal
Build the portfolio dashboard and policy detail experience using the repository’s actual backend data and enterprise UI guidance.

### 2. Prerequisites
- Stage 6 must be complete and stable.
- The backend API from Stage 5 must be available for policy-specific data.
- The repo should already have layout and styling guidance from [.github/copilot-instructions.md](.github/copilot-instructions.md).

### 3. Copilot Prompt
Reconstructed from the documented development task: “Inspect the existing RiskPulse AI repository before making changes. Build the frontend dashboard and policy detail workspace using the current React + TypeScript + Vite + Tailwind setup. Reuse the actual backend API contracts and shared domain logic. Include executive portfolio KPIs, risk distribution, review queue, leakage summary, and policy drill-down. Keep the UI enterprise-grade and aligned with the repository design instructions. Before editing files, review current frontend structure and existing components. Do not invent business logic or duplicate pricing rules in the UI. Do not modify unrelated files.”

### 4. Expected Outcome
- A working dashboard and a policy detail workspace consistent with [docs/frontend-dashboard.md](docs/frontend-dashboard.md).
- Policy selection opens a detail view that presents risk, premium, leakage, and decision information.
- The UI remains aligned with the human-in-the-loop underwriting workflow.

### 5. Validation
- Verify the dashboard and detail workspace match the repository docs and app screens.
- Validate the frontend tests and the full build/test run.
- Run: `npm run build && npm test`

---

## Stage 8 — AI Underwriter

### 1. Goal
Add the AI Underwriter Brief as a decision-support layer that summarizes the deterministic outputs without replacing the underwriting logic or final human authority.

### 2. Prerequisites
- Stages 5–7 must be complete.
- The risk profile, pricing, leakage, and underwriting decision outputs must already exist in the shared logic and backend API.

### 3. Copilot Prompt
Reconstructed from the documented development task: “Inspect the repository and implement the AI Underwriter layer for RiskPulse AI using the existing risk, pricing, leakage, and underwriting decision outputs. Build a concise decision-support brief that summarizes customer context, risk assessment, premium recommendation, leakage concern, and recommended human action. Keep the human-in-the-loop requirement explicit. Do not create a standalone model, do not invent underwriting facts, and do not claim autonomous decisions. Before making changes, review the existing AI Underwriter docs and backend API contracts. Do not modify unrelated files.”

### 4. Expected Outcome
- A structured AI Underwriter Brief generated from real deterministic outputs rather than separate invented logic.
- UI and backend integration consistent with [docs/ai-underwriter.md](docs/ai-underwriter.md).
- Final decision remains with the human underwriter.

### 5. Validation
- Confirm the AI Underwriter layer consumes upstream outputs from the shared package and backend.
- Check the UI and API disclaimers remain human-review oriented.
- Run: `npm run build && npm test`

---

## Stage 9 — Testing & Quality

### 1. Goal
Establish the repository’s actual quality gate with deterministic tests, backend API checks, and frontend simulation validation.

### 2. Prerequisites
- Stages 5–8 must be built and working.
- The actual application logic, API contract, and frontend behavior must already exist.

### 3. Copilot Prompt
Reconstructed from the documented development task: “Inspect the repository and implement the testing and quality strategy for RiskPulse AI. Add domain tests for risk, pricing, leakage, decision support, and AI brief generation. Add backend API validation for policy and underwriting endpoints. Add frontend tests for INR formatting and scenario simulation. Keep tests deterministic and repository-aware. Before editing files, review the current test setup and the repository instructions. Do not invent production dependencies or mock-only assertions. Do not modify unrelated files.”

### 4. Expected Outcome
- Shared package tests pass for the deterministic underwriting logic.
- Backend tests cover the API flow and error handling.
- Frontend tests validate the scenario logic and INR formatting.
- The repository continues to pass the required build/test commands.

### 5. Validation
- Check the actual test files in the shared, backend, and frontend workspaces.
- Run the root validation command: `npm run build && npm test`

---

## Stage 10 — Demo

### 1. Goal
Prepare a concise, repo-accurate demonstration that tells the underwriting story without inventing unsupported outcomes or claims.

### 2. Prerequisites
- Stages 1–9 must be complete and validated.
- The dashboard, policy detail workspace, AI Underwriter Brief, and What-If Simulator must already exist.
- The demo should use the project’s actual synthetic data outputs and examples.

### 3. Copilot Prompt
Reconstructed from the documented development task: “Inspect the existing repository and create a demo guide for RiskPulse AI based on the actual implemented behavior. Use the repository’s real screens, risk engine output, pricing and leakage logic, and synthetic policy set as the source of truth. Tell a clear business story: underwriting challenge, risk and pricing pressure, review flow, AI Underwriter Brief, and What-If scenario change. Emphasize that the final decision remains with the human underwriter. Before editing files, review the current docs and app flow. Do not invent metrics, customer outcomes, AI capabilities, or production deployment claims. Do not modify unrelated files.”

### 4. Expected Outcome
- A demo guide in [docs/demo-guide.md](docs/demo-guide.md) that matches the actual app flow and existing synthetic outputs.
- Clear business storytelling with actual screen-to-screen flow and evidence-backed examples.
- A realistic 5–7 minute demo narrative grounded in the repo.

### 5. Validation
- Check the demo guide against the implemented UI and backend outputs.
- Validate that it references actual examples and does not invent unsupported numbers or claims.
- Run: `npm run build && npm test`

---

## Stage 11 — 5 Slides

### 1. Goal
Prepare a concise five-slide presentation based only on the repo’s actual architecture, outputs, and accepted project constraints.

### 2. Prerequisites
- Stage 10 demo material must be complete and aligned with the repo.
- The project must already have documented architecture, backend, AI Underwriter, and testing content.

### 3. Copilot Prompt
Reconstructed from the documented development task: “Inspect the repository and write exactly five presentation slides for RiskPulse AI based only on the actual implementation and documentation. Keep the slide content concise and professional for a 5–7 minute technical/business capstone presentation. Cover: business problem, architecture and solution, risk/pricing/leakage intelligence, AI Underwriter and simulator, and business value plus Copilot and future limitations. Use only repository-supported facts. Before editing files, read the existing docs and implementation. Do not invent customers, ROI, accuracy figures, production deployment claims, or unsupported future claims. Do not modify unrelated files.”

### 4. Expected Outcome
- A 5-slide deck in [docs/presentation-5-slides.md](docs/presentation-5-slides.md) grounded in the repo’s implemented architecture and constraints.
- Business, technical, and process framing remain consistent with the actual decision-support product.

### 5. Validation
- Check every bullet against the repository’s actual implementation and docs.
- Ensure the final deck does not include speculative or unsupported claims.
- Run: `npm run build && npm test`

---

## Stage 12 — Final Submission Audit

### 1. Goal
Perform a final audit of the repository as a capstone submission, verify consistency across docs and implementation, and confirm the repo is ready without adding new features.

### 2. Prerequisites
- All prior stages 1–11 must be complete and validated.
- The repo should be internally consistent across documentation, architecture, backend, UI, and tests.

### 3. Copilot Prompt
Reconstructed from the documented development task: “Inspect the repository and perform a final submission audit for the RiskPulse AI Capstone. Review the README, architecture docs, backend docs, risk/pricing doc, frontend docs, AI Underwriter doc, testing doc, demo guide, slide deck, Copilot docs, repo setup, project structure, build scripts, test scripts, and synthetic-data requirements. Confirm that the repository is consistent with the implemented code and that no new feature work is required. Do not add feature work or speculative improvements. Before changing any files, inspect the current repo and compare it with the actual implementation. Do not modify unrelated files.”

### 4. Expected Outcome
- A final repository review confirming the project is submission-ready.
- Evidence that the docs match the implementation and that the repo remains synthetic-data-only.
- No new feature changes required for final submission.

### 5. Validation
- Review the repo for documentation consistency and implementation alignment.
- Confirm there are no secrets or external production integrations.
- Check build and test run remains green.
- Run: `npm run build && npm test`

---

## Final reminder for all stages

Across all stages, Copilot should be used incrementally and repository-aware:

- inspect the existing repository before making changes
- rely on the rules in [.github/copilot-instructions.md](.github/copilot-instructions.md)
- preserve the synthetic-data-only requirement
- preserve the human-in-the-loop underwriting model
- preserve the deterministic Risk → Pricing → Leakage → Decision architecture
- use the same repository and validation commands across the workflow
- do not invent functionality, metrics, customers, or production systems
- review each generated change before accepting it
- validate with build/test commands at the end of each stage

This prompt log is meant to be reusable and reproducible for future project work, but it is not a claim that the exact historical prompts were preserved verbatim unless the repository contains that wording.
