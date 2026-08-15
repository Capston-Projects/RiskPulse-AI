import type { SyntheticPolicyRecord } from '@riskpulse/shared';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type PolicyDetailRecord = SyntheticPolicyRecord;

export type RiskProfile = {
  score: number;
  riskLevel: RiskLevel;
  factors: Array<{
    label: string;
    weight: number;
    contribution: number;
    explanation: string;
  }>;
};

export type PricingRecommendation = {
  recommendedPremium: number;
  premiumChangeAmount: number;
  premiumChangePercent: number;
  isUnderpriced: boolean;
  underpricingGap: number;
  explanation: string;
};

export type LeakageAssessment = {
  currentPremium: number;
  recommendedPremium: number;
  estimatedLeakageAmount: number;
  leakagePercentage: number;
  severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
  underpriced: boolean;
  riskScore: number;
};

export type UnderwritingDecision = {
  decision: 'APPROVE' | 'REVIEW' | 'REFER';
  reason: string;
  topRiskDrivers: string[];
  recommendedAction: string;
  riskScore: number;
  recommendedPremium: number;
  leakageSeverity: string;
  currentPremium: number;
};

export type AiBrief = {
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
};

export type PolicyDetailWorkspaceData = {
  policy: PolicyDetailRecord;
  riskProfile: RiskProfile;
  pricing: PricingRecommendation;
  leakage: LeakageAssessment;
  decision: UnderwritingDecision;
  aiBrief: AiBrief;
};

const defaultBaseUrl = 'http://localhost:4000/api';
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? defaultBaseUrl;

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchPolicyWorkspace(policyId: string): Promise<PolicyDetailWorkspaceData> {
  const [policy, riskProfile, pricing, leakage, decision, aiBrief] = await Promise.all([
    fetchJson<PolicyDetailRecord>(`/policies/${policyId}`),
    fetchJson<RiskProfile>(`/policies/${policyId}/risk-profile`),
    fetchJson<PricingRecommendation>(`/policies/${policyId}/pricing`),
    fetchJson<LeakageAssessment>(`/policies/${policyId}/leakage`),
    fetchJson<UnderwritingDecision>(`/policies/${policyId}/underwriting-decision`),
    fetchJson<AiBrief>(`/policies/${policyId}/ai-brief`),
  ]);

  return { policy, riskProfile, pricing, leakage, decision, aiBrief };
}
