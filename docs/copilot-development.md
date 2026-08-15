# GitHub Copilot Development

## Purpose and role in the project

GitHub Copilot was used as a practical development assistant for this repository, not as a replacement for engineering review or product judgment. The project was built in a staged, incremental way so that the generated code remained aligned with the repository’s actual architecture, testing flow, and domain constraints.

The repository-level guidance in `.github/copilot-instructions.md` was the main steering document. It kept Copilot aligned with the project’s intended direction, including:

- insurance underwriting and pricing decision support
- synthetic data only
- explainability and human review
- deterministic engineering patterns
- frontend UI consistency
- testing and validation expectations

## Repository-level instructions and why they matter

The file `.github/copilot-instructions.md` acts as a shared product and engineering brief for all project work. It defines the project’s constraints and standards so changes stay consistent with the implemented architecture.

### Architecture guidance

The instructions explicitly steer the repository toward:

- React + TypeScript + Vite frontend
- Node.js + Express + TypeScript backend
- modular package boundaries
- straightforward, typed interfaces
- deterministic logic before broader abstraction

This prevented drift toward unrealistic architecture or unnecessary dependencies.

### Security and data constraints

The instructions emphasize:

- no production customer data
- no identifiable personal data in examples or tests
- synthetic-only policy records
- explicit human-in-the-loop review patterns

This is important because the project intentionally avoids external identity systems, live integrations, and claims databases.

### Testing and quality guidance

The repo guidance also calls for:

- Vitest-based validation
- clear API contracts
- modular code boundaries
- build validation before completion

That ensures Copilot-generated work is not only functional but also aligned to the repository’s validation pattern.

### UI consistency guidance

The repository instructions define the frontend visual system:

- dark navy dashboard aesthetic
- enterprise insurance presentation
- consistent card layouts and spacing
- readable risk severity styling
- Tailwind-first UI approach
- accessible focus and contrast expectations

This kept the frontend output consistent across dashboard, detail workspace, and simulator panels.

## Copilot-assisted task flow used in practice

The project was not built by asking Copilot to generate the entire application in one prompt. The workflow was incremental, with separate focused requests that matched the repository’s development stages.

### 1. Foundation setup

Copilot was used to help establish:

- monorepo workspace structure
- frontend and backend package layout
- root scripts for build and test
- TypeScript configuration and project conventions

This established the base foundation before domain logic was implemented.

### 2. Synthetic data model

The repository includes deterministic synthetic policy records in the shared package. Copilot-assisted work helped define the record structure and the data needed for underwriting scenarios, risk factors, pricing, and leakage analysis.

The data model remains synthetic and intentionally limited to the project’s demo needs.

### 3. Risk scoring

The shared risk-scoring engine was implemented as a deterministic calculation layer. It evaluates factor contributions and risk levels without depending on external AI or external services.

### 4. Adaptive pricing

The pricing engine calculates recommended premiums based on the risk profile and current premium. This logic is implemented directly in the shared package and reused by both the backend and scenario simulator.

### 5. Rating leakage detection

The leakage module compares current premium exposure to the risk-based recommendation and flags severity and underpricing risk. This is an explicit deterministic check, not an opaque model output.

### 6. Underwriting decision

The underwriting decision engine combines risk profile and leakage assessment to recommend:

- APPROVE
- REVIEW
- REFER

This decision layer remains explainable and tied to the underlying factors.

### 7. AI Underwriter Brief

The AI Underwriter Brief is generated from the same upstream deterministic outputs. It summarizes the customer state, risk factors, premium recommendation, leakage, and recommended human action. The project treats this as decision support rather than autonomous underwriting.

### 8. Backend API layer

Express endpoints were implemented to expose the deterministic outputs for the frontend. These endpoints follow explicit typed contracts and return policy-specific risk, pricing, leakage, decision, and AI brief data.

### 9. Dashboard and policy detail experience

Copilot-assisted work supported creation of the frontend dashboard, policy review flow, detail workspace, and summary panels. These views use the actual backend responses and present a consistent enterprise-style insurance interface.

### 10. What-If simulator

The simulator intentionally reuses the same shared logic used by the backend. It updates mileage, claim count, and driving behaviour inputs and then recalculates risk, pricing, leakage, and recommendation output without mutating original data.

### 11. Testing and documentation

Copilot was also used to help create and validate:

- frontend tests for INR and scenario calculations
- backend API test coverage
- architecture documentation
- README project overview and setup instructions

These docs and tests reflect the actual repository state rather than aspirational product claims.

## Incremental prompting pattern used in development

The project was built incrementally by addressing one layer at a time rather than requesting a full project implementation in a single prompt.

Examples of the approach:

- scaffold the monorepo and workspace structure
- implement shared synthetic data and types
- build the risk scoring module
- add pricing and leakage logic
- add decision engine
- create the AI brief output
- expose API endpoints
- build the dashboard and detail view
- add simulator and UI refinements
- add tests and documentation

This staged workflow reduced the risk of misaligned architecture, prevented broad feature drift, and made it easier to validate each layer before moving to the next.

## Validation approach

The project explicitly validates changes using the repository’s existing commands:

```bash
npm run build
npm run test
```

The build step compiles the shared package, frontend, and backend. The test step validates the frontend and backend behavior using Vitest.

Runtime verification was also used during development for the browser UI. The project was checked in the running frontend to confirm the dashboard and policy detail workspace rendered correctly and that the React hook-order issue was addressed without affecting the simulator or business logic.

## Human review of Copilot-generated changes

All Copilot-assisted output was reviewed against repository constraints and implementation reality. This included:

- verifying the shared logic matched the actual project domain
- ensuring no unsupported production claims were introduced
- keeping synthetic-only data in all examples and tests
- confirming the API contracts and frontend usage matched the implemented backend
- checking UI behavior and risk presentation against the project’s design guidance
- validating with build and test commands before completion

The repository remains a deterministic, explainable insurance decision-support prototype rather than a production system or external AI deployment.

## Summary

GitHub Copilot was used as an iterative engineering assistant throughout the project lifecycle, but the repository’s actual architecture and requirements were kept in control through explicit project instructions, incremental development, and human review. This made the project consistent with the implemented code, the synthetic domain, and the human-in-the-loop underwriting workflow.
