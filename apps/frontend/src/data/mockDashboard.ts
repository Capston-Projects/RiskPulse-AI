import { formatInr } from '../utils/inr';

export type DashboardMetric = {
  label: string;
  value: string;
  delta: string;
  tone: 'positive' | 'warning' | 'critical' | 'neutral';
};

export type RiskDistribution = {
  label: string;
  value: number;
  color: string;
};

export type ReviewPolicy = {
  policyId: string;
  customer: string;
  risk: string;
  premium: string;
  leakage: string;
  action: string;
};

export type LeakageSummary = {
  band: string;
  count: number;
  value: string;
  tone: 'critical' | 'warning' | 'neutral';
};

export type TrendPoint = {
  month: string;
  value: number;
};

export const kpis: DashboardMetric[] = [
  { label: 'Portfolio premium', value: formatInr(4820000), delta: '+6.2%', tone: 'positive' },
  { label: 'High risk policies', value: '18', delta: '+4', tone: 'warning' },
  { label: 'Underwriting review', value: '7', delta: '-2', tone: 'neutral' },
  { label: 'Leakage exposure', value: formatInr(184000), delta: '+9.8%', tone: 'critical' },
];

export const riskDistribution: RiskDistribution[] = [
  { label: 'Low', value: 42, color: 'bg-emerald-400' },
  { label: 'Medium', value: 31, color: 'bg-amber-400' },
  { label: 'High', value: 19, color: 'bg-orange-400' },
  { label: 'Critical', value: 8, color: 'bg-rose-500' },
];

export const reviewPolicies: ReviewPolicy[] = [
  { policyId: 'POL-2007', customer: 'D. Brooks', risk: 'High', premium: formatInr(2340), leakage: '14.8%', action: 'Manual review' },
  { policyId: 'POL-2010', customer: 'L. Chen', risk: 'Critical', premium: formatInr(3120), leakage: '26.3%', action: 'Escalate underwriter' },
  { policyId: 'POL-2003', customer: 'R. Singh', risk: 'High', premium: formatInr(1980), leakage: '17.5%', action: 'Pricing audit' },
  { policyId: 'POL-2008', customer: 'M. Alvarez', risk: 'Medium', premium: formatInr(1760), leakage: '11.1%', action: 'Review renewal' },
];

export const leakageSummary: LeakageSummary[] = [
  { band: 'Critical', count: 3, value: formatInr(92000), tone: 'critical' },
  { band: 'High', count: 6, value: formatInr(68000), tone: 'warning' },
  { band: 'Low', count: 12, value: formatInr(24000), tone: 'neutral' },
];

export const trendData: TrendPoint[] = [
  { month: 'Jan', value: 62 },
  { month: 'Feb', value: 58 },
  { month: 'Mar', value: 66 },
  { month: 'Apr', value: 71 },
  { month: 'May', value: 68 },
  { month: 'Jun', value: 76 },
  { month: 'Jul', value: 74 },
];
