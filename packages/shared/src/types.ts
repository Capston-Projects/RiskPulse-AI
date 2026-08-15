export type CoverageType = 'Comprehensive' | 'ThirdPartyFireTheft' | 'ThirdPartyOnly';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type TransmissionType = 'Manual' | 'Automatic';
export type VehicleUseType = 'Private' | 'Business' | 'Commute' | 'Rideshare';
export type RiskBand = 'Low' | 'Moderate' | 'High';

export interface CustomerProfile {
  customerId: string;
  policyholderName: string;
  age: number;
  gender: 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';
  postcode: string;
  tenureYears: number;
  employmentStatus: 'Employed' | 'Self-employed' | 'Retired' | 'Student' | 'Unemployed';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  yearsAsPolicyholder: number;
}

export interface PolicyDetails {
  policyId: string;
  policyStatus: 'Active' | 'Renewal' | 'Lapsed';
  effectiveDate: string;
  expiryDate: string;
  coverageType: CoverageType;
  vehicleUse: VehicleUseType;
  annualMileage: number;
  priorInsuranceYears: number;
  renewalCount: number;
}

export interface VehicleProfile {
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  engineSizeCc: number;
  vehicleValue: number;
  garagingPostcode: string;
  isModified: boolean;
}

export interface ClaimsHistory {
  claimsInLast3Years: number;
  atFaultClaims: number;
  totalClaimAmount: number;
  lastClaimMonthsAgo: number | null;
  claimSeverity: 'None' | 'Minor' | 'Moderate' | 'Severe';
  nearMissCount: number;
}

export interface TelematicsProfile {
  telematicsEnabled: boolean;
  averageSpeedKph: number;
  harshBrakingEventsPer1000Km: number;
  nightDrivingRatio: number;
  phoneDistractionScore: number;
  monthlyDistanceKm: number;
}

export interface PremiumSummary {
  currentPremiumAnnual: number;
  basePremiumAnnual: number;
  discountsApplied: number;
  excessAmount: number;
  paymentFrequency: 'Monthly' | 'Quarterly' | 'Annually';
  renewalNoticeDays: number;
}

export interface EconomicIndicators {
  inflationIndex: number;
  fuelPriceIndex: number;
  repairCostIndex: number;
  regionalRiskIndex: number;
  claimsTrendIndex: number;
}

export interface SyntheticPolicyRecord {
  customer: CustomerProfile;
  policy: PolicyDetails;
  vehicle: VehicleProfile;
  claimsHistory: ClaimsHistory;
  telematics: TelematicsProfile;
  premium: PremiumSummary;
  economicIndicators: EconomicIndicators;
  riskBand: RiskBand;
  notes?: string;
}
