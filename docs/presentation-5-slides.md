# RiskPulse AI — 5 Slide Presentation

## Slide 1 — Business Problem & Market Need

### Key bullets
- Insurance underwriting decisions are affected by fragmented signals, pricing drift, and manual review delays.
- Rating leakage happens when a policy’s current premium is materially below the risk-based premium recommendation.
- Risk-based pricing pressure increases when claims, mileage, telematics behaviour, and policy exposure worsen faster than premium settings reflect.
- Underwriters need explainable decision support to understand why a renewal is approved, reviewed, or escalated.
- RiskPulse AI focuses on a transparent, human-in-the-loop workflow grounded in deterministic underwriting logic.

### Suggested visual / diagram
- Simple three-part flow: fragmented risk signals -> pricing drift -> manual review burden.
- Optional callout box: “Risk → Pricing → Leakage → Decision” with red flags for leakage and premium pressure.

### Speaker notes
“RiskPulse AI addresses a real underwriting problem: underwriters are reviewing fragmented risk signals and pricing pressure without a single explainable view. Rating leakage is the gap between current premium and the risk-based recommendation. The project is designed to make that risk visible and reviewable, while keeping the final decision with the human underwriter.”

---

## Slide 2 — Solution & Architecture

### Key bullets
- RiskPulse AI is a modular monorepo with frontend, backend, and shared services.
- Frontend: React + TypeScript + Vite + Tailwind CSS dashboard and policy detail workspace.
- Backend: Express + TypeScript API exposes underwriting data and structured responses.
- Shared domain package contains synthetic policy data and deterministic logic for risk, pricing, leakage, and decisions.
- The actual flow is: Risk → Pricing → Leakage → Decision → AI Brief → Human Underwriter.
- The project uses synthetic policy records only and does not connect to production customer data or external systems.

### Suggested visual / diagram
- Layered architecture diagram: Frontend -> Backend API -> Shared Services -> Synthetic Data.
- Pipeline arrow: Synthetic policy data -> risk scoring -> pricing -> leakage -> decision -> AI Underwriter Brief -> human review.

### Speaker notes
“The architecture is intentionally simple and auditable. The frontend presents the underwriting workflow, the backend exposes the data contracts, and the shared package holds the deterministic business logic. This keeps the project explainable and makes it easy to trace every output back to an actual rule or calculation.”

---

## Slide 3 — Risk, Pricing & Leakage Intelligence

### Key bullets
- Risk scoring is deterministic and factor-based; the shared engine calculates a score from 0–100 and classifies it as LOW, MEDIUM, HIGH, or CRITICAL.
- The score incorporates age, mileage, claims history, telematics behaviour, night driving, vehicle profile, economic conditions, and policy history.
- Adaptive pricing applies a risk-based multiplier to the current premium and returns a recommended premium, change amount, and change percentage.
- Rating leakage is detected by comparing the current premium against the recommended premium and classifying severity.
- Underwriting decision logic recommends APPROVE, REVIEW, or REFER based on risk score and leakage severity.
- The repository includes real examples such as POL-2001 as an APPROVE low-risk policy and POL-2002 as a CRITICAL/REFER scenario.

### Suggested visual / diagram
- Decision pipeline diagram with boxes for Risk Score, Premium Recommendation, Leakage Severity, and Decision.
- Optional side-by-side example: current premium vs recommended premium with a leakage gap callout.

### Speaker notes
“The heart of the system is the shared deterministic engine. It does not guess. It evaluates explicit risk factors and converts them into a score, a pricing recommendation, a leakage assessment, and an underwriting decision. That makes the output inspectable and far easier for underwriters to trust and review.”

---

## Slide 4 — AI Underwriter & What-If Simulator

### Key bullets
- The AI Underwriter Brief is generated from deterministic upstream outputs and presented as decision support, not final authority.
- It consumes the same risk, pricing, leakage, and decision results already validated by the shared package and backend API.
- The UI clearly labels the output as “AI-assisted decision support” and keeps the final decision with the human underwriter.
- The What-If Simulator lets the user change annual mileage, claim count, and driving behaviour risk.
- Scenario adjustments update the same chain: Risk → Premium → Leakage → Decision.
- This allows operators to test how underwriting posture changes without mutating the original synthetic record.

### Suggested visual / diagram
- Two-column panel: “Current state” vs “What-if scenario” with arrows across Risk, Premium, Leakage, Decision.
- Small callout: “AI Brief summarizes evidence; Human underwriter remains accountable.”

### Speaker notes
“The AI Underwriter Brief is not a standalone risk model. It summarizes the same deterministic evidence already computed upstream. The What-If Simulator then shows how a change in mileage, claims, or driving behaviour moves the entire decision path. That is useful because it makes the cause-and-effect visible, not hidden.”

---

## Slide 5 — Business Value, Copilot & Future

### Key bullets
- The project helps underwriters identify risk and potential leakage faster, while keeping decisions explainable and human-led.
- The output remains auditable because each score, premium, and recommendation is tied to a clear risk or price factor.
- GitHub Copilot was used as a supporting engineering assistant in setup, logic implementation, API contracts, UI work, tests, and documentation.
- Repository validation includes build and test checks for shared, frontend, and backend layers.
- Current limitations are clear: synthetic data only, deterministic rule-based logic, and no production or external system integration.
- Realistic future enhancements include richer workflow integration, stronger audit metadata, and broader underwriting workflow support.

### Suggested visual / diagram
- Value stack diagram: Explainability -> faster review -> human oversight -> future workflow extension.
- Small footer row: “Current state: synthetic, deterministic, explainable” and “Future state: richer workflow integration.”

### Speaker notes
“This project demonstrates a practical, explainable decision-support workflow rather than a production claim. It is valuable because it makes the risk story visible, keeps the human responsible for the final decision, and gives a clean foundation for future workflow integration. The repository is intentionally honest about its current constraints: synthetic data, deterministic logic, and a proof-of-concept scope.”
