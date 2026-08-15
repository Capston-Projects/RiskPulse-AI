export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: string[];
  };
}

export interface PolicySummaryResponse {
  policyId: string;
  customerId: string;
  customerName: string;
  coverageType: string;
  vehicle: string;
  currentPremiumAnnual: number;
  status: string;
  riskBand: string;
}

export interface RiskProfileResponse {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: Array<{
    label: string;
    weight: number;
    contribution: number;
    explanation: string;
  }>;
}

export interface PricingRecommendationResponse {
  recommendedPremium: number;
  premiumChangeAmount: number;
  premiumChangePercent: number;
  isUnderpriced: boolean;
  underpricingGap: number;
  explanation: string;
}

export interface LeakageResponse {
  currentPremium: number;
  recommendedPremium: number;
  estimatedLeakageAmount: number;
  leakagePercentage: number;
  severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
  underpriced: boolean;
  riskScore: number;
}

export interface UnderwritingDecisionResponse {
  decision: 'APPROVE' | 'REVIEW' | 'REFER';
  reason: string;
  topRiskDrivers: string[];
  recommendedAction: string;
  riskScore: number;
  recommendedPremium: number;
  leakageSeverity: string;
  currentPremium: number;
}

export interface AIUnderwriterBriefResponse {
  decisionSupport: true;
  customerSummary: {
    customerId: string;
    policyholderName: string;
    age: number;
    postcode: string;
    policyId: string;
    coverageType: string;
    vehicle: string;
    renewalStatus: string;
  };
  riskAssessment: {
    riskLevel: string;
    score: number;
    topRiskDrivers: string[];
  };
  premiumSummary: {
    currentPremium: number;
    recommendedPremium: number;
    premiumChangeAmount: number;
    premiumChangePercent: number;
    isUnderpriced: boolean;
  };
  leakageAssessment: {
    severity: string;
    estimatedLeakageAmount: number;
    leakagePercentage: number;
    explanation: string;
  };
  underwritingDecision: {
    decision: string;
    reason: string;
    recommendedAction: string;
  };
  humanReviewAction: string;
  generatedFrom: string[];
}
