import { describe, expect, it } from 'vitest';
import { syntheticPolicyRecords } from './syntheticPolicyData';
import { calculateRiskProfile, type RiskProfile } from './riskScoring';
import { determineUnderwritingDecision } from './underwritingDecision';

describe('underwriting decision engine', () => {
  const makeRiskProfile = (score: number, riskLevel: RiskProfile['riskLevel']): RiskProfile => ({
    score,
    riskLevel,
    factors: [
      {
        label: 'Scenario risk',
        weight: 100,
        contribution: score,
        explanation: 'Synthetic scenario used to validate underwriting decisions.',
      },
    ],
  });

  it('approves a low-risk policy', () => {
    const record = syntheticPolicyRecords[0];
    const riskProfile = calculateRiskProfile(record);
    const decision = determineUnderwritingDecision(record.premium.currentPremiumAnnual, riskProfile);

    expect(decision.decision).toBe('APPROVE');
    expect(decision.reason).toContain('acceptable underwriting');
    expect(decision.topRiskDrivers.length).toBeGreaterThan(0);
  });

  it('routes a medium-risk policy to review', () => {
    const riskProfile = makeRiskProfile(50, 'MEDIUM');
    const decision = determineUnderwritingDecision(1000, riskProfile);

    expect(decision.decision).toBe('REVIEW');
    expect(decision.recommendedAction).toContain('Review');
  });

  it('refers a critical-risk policy', () => {
    const record = syntheticPolicyRecords[9];
    const riskProfile = calculateRiskProfile(record);
    const decision = determineUnderwritingDecision(record.premium.currentPremiumAnnual, riskProfile);

    expect(decision.decision).toBe('REFER');
    expect(decision.recommendedAction).toContain('Escalate');
    expect(decision.topRiskDrivers.length).toBeGreaterThan(0);
  });
});
