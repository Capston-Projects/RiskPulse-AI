import { calculateRecommendedPremium } from './pricingEngine';
import type { RiskProfile } from './riskScoring';

export type LeakageSeverity = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RatingLeakageAssessment {
  currentPremium: number;
  recommendedPremium: number;
  estimatedLeakageAmount: number;
  leakagePercentage: number;
  severity: LeakageSeverity;
  explanation: string;
  underpriced: boolean;
  riskScore: number;
}

export function classifyLeakageSeverity(leakagePercentage: number): LeakageSeverity {
  if (leakagePercentage <= 0) return 'NONE';
  if (leakagePercentage < 10) return 'LOW';
  if (leakagePercentage < 20) return 'MEDIUM';
  if (leakagePercentage < 35) return 'HIGH';
  return 'CRITICAL';
}

export function detectRatingLeakage(currentPremium: number, riskProfile: RiskProfile): RatingLeakageAssessment {
  const pricing = calculateRecommendedPremium(currentPremium, riskProfile);
  const estimatedLeakageAmount = pricing.isUnderpriced ? pricing.underpricingGap : 0;
  const leakagePercentage = currentPremium === 0 ? 0 : Number(((estimatedLeakageAmount / currentPremium) * 100).toFixed(2));

  const severity = classifyLeakageSeverity(leakagePercentage);
  const explanation =
    severity === 'NONE'
      ? 'No material rating leakage identified; current premium is aligned with the model recommendation.'
      : `Potential rating leakage detected because the current premium is ${leakagePercentage.toFixed(2)}% below the recommended premium for a ${riskProfile.riskLevel.toLowerCase()} risk profile.`;

  return {
    currentPremium,
    recommendedPremium: pricing.recommendedPremium,
    estimatedLeakageAmount,
    leakagePercentage,
    severity,
    explanation,
    underpriced: pricing.isUnderpriced,
    riskScore: riskProfile.score,
  };
}

export function estimateLeakageAmount(currentPremium: number, riskProfile: RiskProfile): number {
  return detectRatingLeakage(currentPremium, riskProfile).estimatedLeakageAmount;
}
