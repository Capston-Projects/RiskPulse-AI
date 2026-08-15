import type { RiskProfile } from './riskScoring';

export type PricingAdjustment = {
  recommendedPremium: number;
  premiumChangeAmount: number;
  premiumChangePercent: number;
  isUnderpriced: boolean;
  underpricingGap: number;
  explanation: string;
};

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

function premiumMultiplierFromRiskScore(score: number): number {
  if (score >= 80) return 1.5;
  if (score >= 60) return 1.3;
  if (score >= 45) return 1.18;
  if (score >= 35) return 1.08;
  return 0.96;
}

export function calculateRecommendedPremium(currentPremium: number, riskProfile: RiskProfile): PricingAdjustment {
  const multiplier = premiumMultiplierFromRiskScore(riskProfile.score);
  const recommendedPremium = Number((currentPremium * multiplier).toFixed(2));
  const premiumChangeAmount = Number((recommendedPremium - currentPremium).toFixed(2));
  const premiumChangePercent = currentPremium === 0 ? 0 : Number(((premiumChangeAmount / currentPremium) * 100).toFixed(2));

  const riskAdjustmentLabel = riskProfile.riskLevel.toLowerCase();
  const underpricingThreshold = 0.08;
  const isUnderpriced = currentPremium < recommendedPremium && premiumChangePercent >= underpricingThreshold * 100;
  const underpricingGap = isUnderpriced ? Number((recommendedPremium - currentPremium).toFixed(2)) : 0;

  const explanation = [
    `Risk profile is ${riskAdjustmentLabel} with a score of ${riskProfile.score}.`,
    `Current premium is ${currentPremium.toFixed(2)} and recommended premium is ${recommendedPremium.toFixed(2)}.`,
    `This represents a premium change of ${premiumChangePercent.toFixed(2)}%.`,
    isUnderpriced
      ? `The current premium is materially below the recommended premium by ${underpricingGap.toFixed(2)}, indicating likely underpricing.`
      : 'The current premium is aligned with or above the recommended premium range.',
  ].join(' ');

  return {
    recommendedPremium,
    premiumChangeAmount,
    premiumChangePercent,
    isUnderpriced,
    underpricingGap,
    explanation,
  };
}

export function calculatePremiumDelta(currentPremium: number, riskProfile: RiskProfile): number {
  return calculateRecommendedPremium(currentPremium, riskProfile).premiumChangeAmount;
}

export function isPotentialUnderpricing(currentPremium: number, riskProfile: RiskProfile): boolean {
  return calculateRecommendedPremium(currentPremium, riskProfile).isUnderpriced;
}

export function calculateRecommendedPremiumRatio(currentPremium: number, riskProfile: RiskProfile): number {
  const adjustment = calculateRecommendedPremium(currentPremium, riskProfile);
  return Number(clamp(adjustment.recommendedPremium / Math.max(currentPremium, 1), 0, 5).toFixed(4));
}
