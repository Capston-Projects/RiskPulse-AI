import { describe, expect, it } from 'vitest';
import { fetchDashboardSummary } from './dashboardApi';

describe('dashboard API client', () => {
  it('returns a payload with the expected dashboard sections', async () => {
    const originalFetch = globalThis.fetch;

    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          kpis: [{ label: 'Portfolio premium', value: '₹1,200,000', delta: '+3.2%', tone: 'positive' }],
          riskDistribution: [{ label: 'Low', value: 50, color: 'bg-emerald-400' }],
          reviewPolicies: [{ policyId: 'POL-2001', customer: 'A. Morgan', risk: 'LOW', premium: '₹1,280', leakage: '0.0%', action: 'Manual review' }],
          leakageSummary: [{ band: 'Critical', count: 2, value: '₹80,000', tone: 'critical' }],
          trendData: [{ month: 'Jan', value: 50 }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );

    try {
      const payload = await fetchDashboardSummary();
      expect(payload.kpis).toHaveLength(1);
      expect(payload.reviewPolicies[0].policyId).toBe('POL-2001');
      expect(payload.riskDistribution[0].label).toBe('Low');
      expect(payload.leakageSummary[0].tone).toBe('critical');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
