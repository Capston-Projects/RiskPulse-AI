import { calculateRecommendedPremium } from './pricingEngine';
import { detectRatingLeakage } from './ratingLeakage';
import type { RiskProfile } from './riskScoring';

export type UnderwritingDecisionType = 'APPROVE' | 'REVIEW' | 'REFER';

export interface UnderwritingDecision {
  decision: UnderwritingDecisionType;
  reason: string;
  topRiskDrivers: string[];
  recommendedAction: string;
  riskScore: number;
  recommendedPremium: number;
  leakageSeverity: string;
  currentPremium: number;
}

export function determineUnderwritingDecision(
  currentPremium: number,
  riskProfile: RiskProfile,
): UnderwritingDecision {
  const pricing = calculateRecommendedPremium(currentPremium, riskProfile);
  const leakage = detectRatingLeakage(currentPremium, riskProfile);

  const score = riskProfile.score;
  const severeLeakage = leakage.severity === 'HIGH' || leakage.severity === 'CRITICAL';
  const topRiskDrivers = riskProfile.factors
    .slice()
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3)
    .map((factor) => factor.label);

  const shouldRefer = score >= 80 || leakage.severity === 'CRITICAL' || (pricing.isUnderpriced && severeLeakage);

  if (shouldRefer) {
    return {
      decision: 'REFER',
      reason: 'The profile has high risk exposure, material underpricing risk, and significant leakage indicators requiring specialist underwriting review.',
      topRiskDrivers,
      recommendedAction: 'Escalate to senior underwriter for manual review and pricing correction before renewal approval.',
      riskScore: score,
      recommendedPremium: pricing.recommendedPremium,
      leakageSeverity: leakage.severity,
      currentPremium,
    };
  }

  if (score >= 45 || leakage.severity === 'MEDIUM' || severeLeakage || pricing.premiumChangePercent > 10) {
    return {
      decision: 'REVIEW',
      reason: 'The account needs human review because risk profile, pricing adjustment, or leakage indicators warrant closer underwriting scrutiny.',
      topRiskDrivers,
      recommendedAction: 'Review key risk factors and pricing assumptions before confirming the renewal recommendation.',
      riskScore: score,
      recommendedPremium: pricing.recommendedPremium,
      leakageSeverity: leakage.severity,
      currentPremium,
    };
  }

  return {
    decision: 'APPROVE',
    reason: 'The profile remains within acceptable underwriting and pricing tolerance, with no material leakage concerns.',
    topRiskDrivers,
    recommendedAction: 'Proceed with standard renewal and monitor for changes in claims or driving behaviour.',
    riskScore: score,
    recommendedPremium: pricing.recommendedPremium,
    leakageSeverity: leakage.severity,
    currentPremium,
  };
}

export function getUnderwritingRecommendation(currentPremium: number, riskProfile: RiskProfile): UnderwritingDecision {
  return determineUnderwritingDecision(currentPremium, riskProfile);
}
