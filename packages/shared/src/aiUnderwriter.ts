import type { SyntheticPolicyRecord } from './types';
import type { RiskProfile } from './riskScoring';
import type { PricingAdjustment } from './pricingEngine';
import type { RatingLeakageAssessment } from './ratingLeakage';
import type { UnderwritingDecision } from './underwritingDecision';

export interface AIUnderwriterInput {
  record: SyntheticPolicyRecord;
  riskProfile: RiskProfile;
  pricing: PricingAdjustment;
  leakage: RatingLeakageAssessment;
  decision: UnderwritingDecision;
}

export interface CustomerSummary {
  customerId: string;
  policyholderName: string;
  age: number;
  postcode: string;
  policyId: string;
  coverageType: string;
  vehicle: string;
  renewalStatus: string;
}

export interface RiskAssessmentSummary {
  riskLevel: string;
  score: number;
  topRiskDrivers: string[];
}

export interface PremiumAssessmentSummary {
  currentPremium: number;
  recommendedPremium: number;
  premiumChangeAmount: number;
  premiumChangePercent: number;
  isUnderpriced: boolean;
}

export interface LeakageAssessmentSummary {
  severity: string;
  estimatedLeakageAmount: number;
  leakagePercentage: number;
  explanation: string;
}

export interface UnderwritingDecisionSummary {
  decision: string;
  reason: string;
  recommendedAction: string;
}

export interface AIUnderwriterBrief {
  decisionSupport: true;
  customerSummary: CustomerSummary;
  riskAssessment: RiskAssessmentSummary;
  premiumSummary: PremiumAssessmentSummary;
  leakageAssessment: LeakageAssessmentSummary;
  underwritingDecision: UnderwritingDecisionSummary;
  humanReviewAction: string;
  generatedFrom: string[];
}

export function createUnderwriterBrief(input: AIUnderwriterInput): AIUnderwriterBrief {
  const { record, riskProfile, pricing, leakage, decision } = input;

  const brief: AIUnderwriterBrief = {
    decisionSupport: true,
    customerSummary: {
      customerId: record.customer.customerId,
      policyholderName: record.customer.policyholderName,
      age: record.customer.age,
      postcode: record.customer.postcode,
      policyId: record.policy.policyId,
      coverageType: record.policy.coverageType,
      vehicle: `${record.vehicle.make} ${record.vehicle.model} (${record.vehicle.year})`,
      renewalStatus: record.policy.policyStatus,
    },
    riskAssessment: {
      riskLevel: riskProfile.riskLevel,
      score: riskProfile.score,
      topRiskDrivers: riskProfile.factors
        .slice()
        .sort((a, b) => b.contribution - a.contribution)
        .slice(0, 3)
        .map((factor) => factor.label),
    },
    premiumSummary: {
      currentPremium: record.premium.currentPremiumAnnual,
      recommendedPremium: pricing.recommendedPremium,
      premiumChangeAmount: pricing.premiumChangeAmount,
      premiumChangePercent: pricing.premiumChangePercent,
      isUnderpriced: pricing.isUnderpriced,
    },
    leakageAssessment: {
      severity: leakage.severity,
      estimatedLeakageAmount: leakage.estimatedLeakageAmount,
      leakagePercentage: leakage.leakagePercentage,
      explanation: leakage.explanation,
    },
    underwritingDecision: {
      decision: decision.decision,
      reason: decision.reason,
      recommendedAction: decision.recommendedAction,
    },
    humanReviewAction: decision.recommendedAction,
    generatedFrom: [
      'Deterministic risk score engine',
      'Deterministic pricing engine',
      'Deterministic leakage detection service',
      'Deterministic underwriting decision engine',
    ],
  };

  return brief;
}

export function createAIUnderwriterBrief(input: AIUnderwriterInput): AIUnderwriterBrief {
  return createUnderwriterBrief(input);
}
