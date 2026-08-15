import type { SyntheticPolicyRecord } from './types';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskFactorBreakdown {
  label: string;
  weight: number;
  contribution: number;
  explanation: string;
}

export interface RiskProfile {
  score: number;
  riskLevel: RiskLevel;
  factors: RiskFactorBreakdown[];
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export function classifyRiskScore(score: number): RiskLevel {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
}

function normalizeRatio(value: number): number {
  return clamp(value, 0, 1);
}

export function calculateRiskProfile(record: SyntheticPolicyRecord): RiskProfile {
  const riskFactors: RiskFactorBreakdown[] = [];
  let totalScore = 0;

  const addFactor = (label: string, weight: number, contribution: number, explanation: string): void => {
    totalScore += contribution;
    riskFactors.push({ label, weight, contribution, explanation });
  };

  const agePenalty = record.customer.age >= 60 ? 10 : record.customer.age <= 25 ? 12 : 0;
  addFactor(
    'Age profile',
    12,
    agePenalty,
    `Age of ${record.customer.age} adds ${agePenalty} risk points based on age-band sensitivity.`,
  );

  const mileageRisk = clamp((record.policy.annualMileage / 20000) * 18, 0, 18);
  addFactor(
    'Annual mileage',
    18,
    mileageRisk,
    `Annual mileage of ${record.policy.annualMileage} km contributes ${mileageRisk.toFixed(1)} points.`,
  );

  const claimPenalty = record.claimsHistory.claimsInLast3Years * 12 + record.claimsHistory.atFaultClaims * 18;
  addFactor(
    'Claims history',
    30,
    claimPenalty,
    `${record.claimsHistory.claimsInLast3Years} claims and ${record.claimsHistory.atFaultClaims} at-fault claims contribute ${claimPenalty} points.`,
  );

  const claimAmountPenalty = clamp(record.claimsHistory.totalClaimAmount / 8000, 0, 12) * 10;
  addFactor(
    'Claim severity',
    12,
    claimAmountPenalty,
    `Total claim amount of ${record.claimsHistory.totalClaimAmount} adds ${claimAmountPenalty.toFixed(1)} points.`,
  );

  const telematicsPenalty =
    (record.telematics.telematicsEnabled ? 0 : 8) +
    clamp(record.telematics.harshBrakingEventsPer1000Km / 10, 0, 12) +
    clamp(record.telematics.phoneDistractionScore / 25, 0, 10);

  addFactor(
    'Telematics behaviour',
    22,
    telematicsPenalty,
    `Driving behaviour indicators contribute ${telematicsPenalty.toFixed(1)} points based on harsh braking, distractions, and data coverage.`,
  );

  const nightDrivingPenalty = clamp(record.telematics.nightDrivingRatio * 35, 0, 18);
  addFactor(
    'Night driving ratio',
    18,
    nightDrivingPenalty,
    `Night driving ratio of ${record.telematics.nightDrivingRatio.toFixed(2)} adds ${nightDrivingPenalty.toFixed(1)} points.`,
  );

  const vehicleRisk =
    (record.vehicle.isModified ? 8 : 0) +
    (record.vehicle.year < 2016 ? 10 : 0) +
    clamp((record.vehicle.vehicleValue / 50000) * 10, 0, 10);

  addFactor(
    'Vehicle profile',
    14,
    vehicleRisk,
    `Vehicle age, value, and modifications contribute ${vehicleRisk.toFixed(1)} points.`,
  );

  const economicRisk =
    (record.economicIndicators.inflationIndex - 1) * 20 +
    (record.economicIndicators.repairCostIndex - 1) * 25 +
    clamp(record.economicIndicators.regionalRiskIndex * 12, 0, 15);

  addFactor(
    'Economic conditions',
    16,
    economicRisk,
    `Regional and market conditions add ${economicRisk.toFixed(1)} points.`,
  );

  const priorInsurancePenalty = clamp((record.policy.priorInsuranceYears <= 3 ? 10 : 0) + (record.policy.renewalCount >= 6 ? 8 : 0), 0, 18);
  addFactor(
    'Policy history',
    10,
    priorInsurancePenalty,
    `Policy tenure and renewal history contribute ${priorInsurancePenalty.toFixed(1)} points.`,
  );

  const normalizedScore = clamp(totalScore, 0, 100);

  return {
    score: Number(normalizedScore.toFixed(1)),
    riskLevel: classifyRiskScore(normalizedScore),
    factors: riskFactors.map((factor) => ({
      ...factor,
      contribution: Number(factor.contribution.toFixed(1)),
    })),
  };
}

export function calculateRiskScore(record: SyntheticPolicyRecord): number {
  return calculateRiskProfile(record).score;
}
