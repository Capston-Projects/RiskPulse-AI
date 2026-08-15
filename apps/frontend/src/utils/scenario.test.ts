import { describe, expect, it } from 'vitest';
import { syntheticPolicyRecords } from '@riskpulse/shared';
import { calculateScenarioOutcome, buildScenarioRecord } from './scenario';

describe('scenario calculation', () => {
  it('recalculates the risk profile and premium using the existing deterministic services', () => {
    const baseRecord = syntheticPolicyRecords[1];
    const scenario = calculateScenarioOutcome(baseRecord, {
      annualMileage: 22000,
      claimCount: 3,
      drivingBehaviourRisk: 78,
    });

    expect(scenario.riskScore).toBeGreaterThanOrEqual(0);
    expect(scenario.riskLevel).toMatch(/LOW|MEDIUM|HIGH|CRITICAL/);
    expect(scenario.recommendedPremium).toBeGreaterThan(0);
    expect(scenario.leakagePercentage).toBeGreaterThanOrEqual(0);
    expect(['APPROVE', 'REVIEW', 'REFER']).toContain(scenario.decision);
  });

  it('does not mutate the original policy record when building a scenario', () => {
    const baseRecord = structuredClone(syntheticPolicyRecords[1]);
    const scenarioRecord = buildScenarioRecord(baseRecord, {
      annualMileage: 18000,
      claimCount: 2,
      drivingBehaviourRisk: 65,
    });

    expect(baseRecord.policy.annualMileage).toBe(12500);
    expect(baseRecord.claimsHistory.claimsInLast3Years).toBe(1);
    expect(scenarioRecord.policy.annualMileage).toBe(18000);
    expect(scenarioRecord.claimsHistory.claimsInLast3Years).toBe(2);
  });
});
