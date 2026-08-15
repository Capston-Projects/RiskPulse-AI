export * from './types';
export * from './syntheticPolicyData';
export * from './riskScoring';
export * from './pricingEngine';
export * from './ratingLeakage';
export * from './underwritingDecision';
export * from './aiUnderwriter';
export const DEFAULT_RISK_WEIGHT = 1;
export function createSyntheticRiskScore(applicantId, factors) {
    const riskScore = factors.reduce((total, factor) => total + factor.value * factor.weight, 0);
    return {
        applicantId,
        riskScore,
        factors,
    };
}
//# sourceMappingURL=index.js.map