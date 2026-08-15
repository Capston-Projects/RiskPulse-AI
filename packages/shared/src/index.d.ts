export * from './types';
export * from './syntheticPolicyData';
export * from './riskScoring';
export * from './pricingEngine';
export * from './ratingLeakage';
export * from './underwritingDecision';
export * from './aiUnderwriter';
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
export declare const DEFAULT_RISK_WEIGHT = 1;
export declare function createSyntheticRiskScore(applicantId: string, factors: RiskFactor[]): SyntheticRiskScore;
