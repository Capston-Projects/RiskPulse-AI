import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from './app.js';

describe('RiskPulse backend API', () => {
  const policyId = 'POL-2001';

  it('returns health status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.service).toBe('riskpulse-ai-backend');
  });

  it('lists synthetic policies', async () => {
    const response = await request(app).get('/api/policies');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].policyId).toMatch(/^POL-/);
  });

  it('returns a risk profile for an existing policy', async () => {
    const response = await request(app).get(`/api/policies/${policyId}/risk-profile`);

    expect(response.status).toBe(200);
    expect(response.body.riskLevel).toBeDefined();
    expect(response.body.score).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(response.body.factors)).toBe(true);
  });

  it('returns a pricing recommendation for an existing policy', async () => {
    const response = await request(app).get(`/api/policies/${policyId}/pricing`);

    expect(response.status).toBe(200);
    expect(response.body.recommendedPremium).toBeGreaterThan(0);
    expect(response.body.explanation).toContain('Current premium');
  });

  it('returns leakage detection for an existing policy', async () => {
    const response = await request(app).get(`/api/policies/${policyId}/leakage`);

    expect(response.status).toBe(200);
    expect(response.body.severity).toBeDefined();
    expect(response.body.estimatedLeakageAmount).toBeGreaterThanOrEqual(0);
  });

  it('returns underwriting decision for an existing policy', async () => {
    const response = await request(app).get(`/api/policies/${policyId}/underwriting-decision`);

    expect(response.status).toBe(200);
    expect(['APPROVE', 'REVIEW', 'REFER']).toContain(response.body.decision);
    expect(response.body.recommendedAction).toBeDefined();
  });

  it('returns a complete AI underwriter brief for an existing policy', async () => {
    const response = await request(app).get(`/api/policies/${policyId}/ai-brief`);

    expect(response.status).toBe(200);
    expect(response.body.decisionSupport).toBe(true);
    expect(response.body.customerSummary.policyholderName).toBeDefined();
    expect(response.body.riskAssessment.topRiskDrivers).toBeInstanceOf(Array);
  });

  it('returns consistent 404 errors for missing policies', async () => {
    const response = await request(app).get('/api/policies/INVALID-ID');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
