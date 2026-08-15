import { describe, expect, it } from 'vitest';
import { syntheticPolicyRecords } from './syntheticPolicyData';
import { calculateRiskProfile } from './riskScoring';
import { calculateRecommendedPremium } from './pricingEngine';
import { detectRatingLeakage } from './ratingLeakage';
import { determineUnderwritingDecision } from './underwritingDecision';
import { createUnderwriterBrief } from './aiUnderwriter';

describe('AI underwriter brief', () => {
  it('creates a decision-support brief for a high-risk policy', () => {
    const record = syntheticPolicyRecords[9];
    const riskProfile = calculateRiskProfile(record);
    const pricing = calculateRecommendedPremium(record.premium.currentPremiumAnnual, riskProfile);
    const leakage = detectRatingLeakage(record.premium.currentPremiumAnnual, riskProfile);
    const decision = determineUnderwritingDecision(record.premium.currentPremiumAnnual, riskProfile);

    const brief = createUnderwriterBrief({ record, riskProfile, pricing, leakage, decision });

    expect(brief.decisionSupport).toBe(true);
    expect(brief.riskAssessment.riskLevel).toBe(riskProfile.riskLevel);
    expect(brief.underwritingDecision.decision).toBe('REFER');
    expect(brief.underwritingDecision.reason).toContain('specialist underwriting review');
    expect(brief.underwritingDecision.recommendedAction).toContain('Escalate');
  });

  it('creates a terse decision-support brief for a low-risk policy', () => {
    const record = syntheticPolicyRecords[0];
    const riskProfile = calculateRiskProfile(record);
    const pricing = calculateRecommendedPremium(record.premium.currentPremiumAnnual, riskProfile);
    const leakage = detectRatingLeakage(record.premium.currentPremiumAnnual, riskProfile);
    const decision = determineUnderwritingDecision(record.premium.currentPremiumAnnual, riskProfile);

    const brief = createUnderwriterBrief({ record, riskProfile, pricing, leakage, decision });

    expect(brief.decisionSupport).toBe(true);
    expect(brief.riskAssessment.riskLevel).toBe('LOW');
    expect(brief.underwritingDecision.decision).toBe('APPROVE');
    expect(brief.humanReviewAction).toContain('standard renewal');
  });

  it('surfaces leakage severity in the underwriter brief', () => {
    const record = syntheticPolicyRecords[1];
    const riskProfile = calculateRiskProfile(record);
    const currentPremium = 900;
    const pricing = calculateRecommendedPremium(currentPremium, riskProfile);
    const leakage = detectRatingLeakage(currentPremium, riskProfile);
    const decision = determineUnderwritingDecision(currentPremium, riskProfile);

    const brief = createUnderwriterBrief({ record, riskProfile, pricing, leakage, decision });

    expect(brief.decisionSupport).toBe(true);
    expect(brief.leakageAssessment.severity).toBe(leakage.severity);
    expect(brief.leakageAssessment.estimatedLeakageAmount).toBeGreaterThanOrEqual(0);
    expect(brief.customerSummary.policyholderName).toBe(record.customer.policyholderName);
  });
});
