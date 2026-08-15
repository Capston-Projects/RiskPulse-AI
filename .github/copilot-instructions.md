# RiskPulse AI Copilot Instructions

## Domain and product intent

- This project supports P&C insurance underwriting and pricing workflows.
- Focus on adaptive risk-based pricing, underwriting decision support, and explainable risk intelligence.
- Prioritize transparency, human-in-the-loop review, and model explainability over opaque automation.

## Product constraints

- Treat rating leakage detection and loss-ratio pressure as core analysis themes.
- Use synthetic data only. Never introduce production or customer-identifiable data into examples, tests, or seed content.
- Design for incremental delivery: small, composable modules and clear interfaces.

## Architecture expectations

- Frontend: React + TypeScript + Vite + Tailwind CSS.
- Backend: Node.js + Express + TypeScript.
- Testing: Vitest for unit and API-level validation.
- Keep the codebase modular, typed, and production-quality.
- Prefer straightforward patterns over abstraction for early-stage development.

## Implementation guidance

- Build features for underwriting decision support, risk explanations, and scenario analysis with clear traceability.
- Keep the API contract explicit and typed.
- Add synthetic datasets under the data area and reference them in docs and tests.
- Do not add unnecessary dependencies or broad frameworks before a clear need exists.
- Do not implement business logic before the foundational app structure and contracts are in place.

## Quality bar

- Favor readable code, deterministic tests, and maintainable package boundaries.
- Validate changes with focused test and build commands.
- Keep the project ready for future AI-assisted pricing workflows and underwriter review tools.
