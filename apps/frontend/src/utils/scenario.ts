import {
  calculateRecommendedPremium,
  calculateRiskProfile,
  detectRatingLeakage,
  determineUnderwritingDecision,
  type SyntheticPolicyRecord,
} from '@riskpulse/shared';

export type ScenarioInputs = {
  annualMileage: number;
  claimCount: number;
  drivingBehaviourRisk: number;
};

export type ScenarioOutcome = {
  riskScore: number;
  riskLevel: string;
  recommendedPremium: number;
  leakageAmount: number;
  leakagePercentage: number;
  decision: string;
};

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export function buildScenarioRecord(baseRecord: SyntheticPolicyRecord, inputs: ScenarioInputs): SyntheticPolicyRecord {
  const drivingBehaviour = clamp(inputs.drivingBehaviourRisk, 0, 100);

  return {
    ...baseRecord,
    policy: {
      ...baseRecord.policy,
      annualMileage: Math.round(inputs.annualMileage),
    },
    claimsHistory: {
      ...baseRecord.claimsHistory,
      claimsInLast3Years: Math.max(0, Math.round(inputs.claimCount)),
    },
    telematics: {
      ...baseRecord.telematics,
      harshBrakingEventsPer1000Km: Number(((drivingBehaviour / 100) * 10).toFixed(1)),
      phoneDistractionScore: Number(((drivingBehaviour / 100) * 80).toFixed(1)),
    },
  };
}

export function calculateScenarioOutcome(baseRecord: SyntheticPolicyRecord, inputs: ScenarioInputs): ScenarioOutcome {
  const scenarioRecord = buildScenarioRecord(baseRecord, inputs);
  const riskProfile = calculateRiskProfile(scenarioRecord);
  const pricing = calculateRecommendedPremium(baseRecord.premium.currentPremiumAnnual, riskProfile);
  const leakage = detectRatingLeakage(baseRecord.premium.currentPremiumAnnual, riskProfile);
  const decision = determineUnderwritingDecision(baseRecord.premium.currentPremiumAnnual, riskProfile);

  return {
    riskScore: riskProfile.score,
    riskLevel: riskProfile.riskLevel,
    recommendedPremium: pricing.recommendedPremium,
    leakageAmount: leakage.estimatedLeakageAmount,
    leakagePercentage: leakage.leakagePercentage,
    decision: decision.decision,
  };
}
