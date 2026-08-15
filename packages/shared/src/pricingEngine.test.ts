import { describe, expect, it } from 'vitest';
import { syntheticPolicyRecords } from './syntheticPolicyData';
import { calculateRiskProfile } from './riskScoring';
import { calculateRecommendedPremium, isPotentialUnderpricing } from './pricingEngine';

describe('pricing engine', () => {
  it('prices a low-risk policy with a modest premium adjustment', () => {
    const record = syntheticPolicyRecords[0];
    const riskProfile = calculateRiskProfile(record);
    const adjustment = calculateRecommendedPremium(record.premium.currentPremiumAnnual, riskProfile);

    expect(adjustment.recommendedPremium).toBeGreaterThan(0);
    expect(adjustment.premiumChangePercent).toBeGreaterThanOrEqual(-100);
    expect(riskProfile.riskLevel).toBe('LOW');
  });

  it('prices a medium-risk policy with a moderate increase', () => {
    const record = syntheticPolicyRecords[4];
    const riskProfile = calculateRiskProfile(record);
    const adjustment = calculateRecommendedPremium(record.premium.currentPremiumAnnual, riskProfile);

    expect(riskProfile.riskLevel).toBe('MEDIUM');
    expect(adjustment.premiumChangeAmount).toBeGreaterThan(0);
    expect(adjustment.premiumChangePercent).toBeGreaterThan(0);
  });

  it('prices a high-risk policy with a stronger premium uplift', () => {
    const record = syntheticPolicyRecords[6];
    const riskProfile = calculateRiskProfile(record);
    const adjustment = calculateRecommendedPremium(record.premium.currentPremiumAnnual, riskProfile);

    expect(riskProfile.riskLevel).toBe('HIGH');
    expect(adjustment.recommendedPremium).toBeGreaterThan(record.premium.currentPremiumAnnual);
    expect(adjustment.premiumChangePercent).toBeGreaterThan(10);
  });

  it('prices a critical-risk policy with a significant increase', () => {
    const record = syntheticPolicyRecords[9];
    const riskProfile = calculateRiskProfile(record);
    const adjustment = calculateRecommendedPremium(record.premium.currentPremiumAnnual, riskProfile);

    expect(riskProfile.riskLevel).toBe('CRITICAL');
    expect(adjustment.recommendedPremium).toBeGreaterThan(record.premium.currentPremiumAnnual);
    expect(adjustment.premiumChangePercent).toBeGreaterThan(20);
  });

  it('detects underpricing when a current premium is materially below the recommended premium', () => {
    const record = syntheticPolicyRecords[9];
    const riskProfile = calculateRiskProfile(record);
    const currentPremium = 1200;
    const adjustment = calculateRecommendedPremium(currentPremium, riskProfile);

    expect(adjustment.isUnderpriced).toBe(true);
    expect(adjustment.underpricingGap).toBeGreaterThan(0);
    expect(isPotentialUnderpricing(currentPremium, riskProfile)).toBe(true);
  });
});
