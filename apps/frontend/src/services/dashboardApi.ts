export type DashboardKpiMetric = {
  label: string;
  value: string;
  delta: string;
  tone: 'positive' | 'warning' | 'critical' | 'neutral';
};

export type DashboardRiskDistribution = {
  label: 'Low' | 'Medium' | 'High' | 'Critical';
  value: number;
  color: string;
};

export type DashboardReviewPolicy = {
  policyId: string;
  customer: string;
  risk: string;
  premium: string;
  leakage: string;
  action: string;
};

export type DashboardLeakageSummary = {
  band: string;
  count: number;
  value: string;
  tone: 'critical' | 'warning' | 'neutral';
};

export type DashboardTrendPoint = {
  month: string;
  value: number;
};

export type DashboardSummaryResponse = {
  kpis: DashboardKpiMetric[];
  riskDistribution: DashboardRiskDistribution[];
  reviewPolicies: DashboardReviewPolicy[];
  leakageSummary: DashboardLeakageSummary[];
  trendData: DashboardTrendPoint[];
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

export async function fetchDashboardSummary(): Promise<DashboardSummaryResponse> {
  return fetchJson<DashboardSummaryResponse>('/dashboard-summary');
}
