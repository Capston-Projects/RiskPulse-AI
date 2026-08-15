export * from './types.js';
export * from './syntheticPolicyData.js';
export * from './riskScoring.js';
export * from './pricingEngine.js';
export * from './ratingLeakage.js';
export * from './underwritingDecision.js';
export * from './aiUnderwriter.js';

export type RiskFactor = {
  name: string;
  value: number;
  weight: number;
};

export type SyntheticRiskScore = {
  applicantId: string;
  riskScore: number;
  factors: RiskFactor[];
};

export const DEFAULT_RISK_WEIGHT = 1;

export function createSyntheticRiskScore(applicantId: string, factors: RiskFactor[]): SyntheticRiskScore {
  const riskScore = factors.reduce((total, factor) => total + factor.value * factor.weight, 0);

  return {
    applicantId,
    riskScore,
    factors,
  };
}
