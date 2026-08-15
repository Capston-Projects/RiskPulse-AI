# RiskPulse AI Copilot Instructions

## Domain and product intent

- This project supports P&C insurance underwriting and pricing workflows.
- Focus on adaptive risk-based pricing, underwriting decision support, and explainable risk intelligence.
- Prioritize transparency, human-in-the-loop review, and model explainability over opaque automation.

## Product constraints

- Treat rating leakage detection and loss-ratio pressure as core analysis themes.
- Use synthetic data only. Never introduce production or customer-identifiable data into examples, tests, or seed content.
- Represent all financial values in Indian rupees (INR) to match the Indian P&C insurance context and keep the product presentation consistent.
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

## Frontend design system and UI guidance

- Use a premium enterprise insurance dashboard aesthetic: dark navy surfaces, subtle purple and blue accents, polished panels, and executive-grade readability.
- Base visual language: deep navy backgrounds, slate and blue-gray borders, restrained cyan/indigo accent colors, and soft layered shadows for depth.
- Keep the layout clean and responsive: strong spacing rhythm, consistent cards, clear information hierarchy, readable data density, and mobile-first behavior that expands cleanly to desktop layouts.
- Favor consistent spacing, typography scales, border radii, shadows, and card treatments. Use a single visual rhythm across tables, KPI tiles, trend panels, and detail cards.
- Maintain accessible contrast for text, labels, badges, and data surfaces. Ensure primary information remains legible on dark backgrounds without relying on low-contrast color alone.
- Prefer reusable UI components over ad hoc markup. Reuse existing dashboard components and patterns before creating new ones.
- Use Tailwind CSS as the styling system for all front-end work. Keep global styles centralized in the main CSS entry and avoid scattering styling logic across files.
- Avoid inline styles unless absolutely required. Do not rely on browser-default visible styling for interactive or informational UI elements.
- Design risk severity styles consistently for Low, Medium, High, and Critical states, with clear semantic colors, badges, and emphasis levels for underwriting review.
- Support premium dashboard patterns including KPI cards, data tables, trend or summary charts, and detail panels with clear labels and readable metrics.
- For stateful controls and actions, ensure polished hover, focus, and active treatments with visible affordances and accessible keyboard focus states.
- Keep the system free from unnecessary UI libraries and dependencies. Use only the required Tailwind-based UI primitives and existing project patterns.
- Every new frontend feature must follow this design system. Existing components should be reused before introducing alternative patterns or new UI conventions.

## Quality bar

- Favor readable code, deterministic tests, and maintainable package boundaries.
- Validate changes with focused test and build commands.
- Keep the project ready for future AI-assisted pricing workflows and underwriter review tools.
