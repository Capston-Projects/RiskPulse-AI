import { describe, expect, it } from 'vitest';
import { detectRatingLeakage } from './ratingLeakage';
import type { RiskProfile } from './riskScoring';

describe('rating leakage detection', () => {
  const makeRiskProfile = (score: number, riskLevel: RiskProfile['riskLevel']): RiskProfile => ({
    score,
    riskLevel,
    factors: [
      {
        label: 'Scenario risk',
        weight: 100,
        contribution: score,
        explanation: 'Synthetic scenario used to validate leakage severity thresholds.',
      },
    ],
  });

  it('returns no leakage when premium is aligned', () => {
    const riskProfile = makeRiskProfile(30, 'LOW');
    const assessment = detectRatingLeakage(1000, riskProfile);

    expect(assessment.severity).toBe('NONE');
    expect(assessment.estimatedLeakageAmount).toBe(0);
    expect(assessment.underpriced).toBe(false);
  });

  it('detects low leakage', () => {
    const riskProfile = makeRiskProfile(40, 'MEDIUM');
    const assessment = detectRatingLeakage(1000, riskProfile);

    expect(assessment.severity).toBe('LOW');
    expect(assessment.estimatedLeakageAmount).toBeGreaterThan(0);
    expect(assessment.leakagePercentage).toBeLessThan(10);
  });

  it('detects medium leakage', () => {
    const riskProfile = makeRiskProfile(52, 'MEDIUM');
    const assessment = detectRatingLeakage(1000, riskProfile);

    expect(assessment.severity).toBe('MEDIUM');
    expect(assessment.estimatedLeakageAmount).toBeGreaterThan(0);
    expect(assessment.leakagePercentage).toBeGreaterThanOrEqual(10);
    expect(assessment.leakagePercentage).toBeLessThan(20);
  });

  it('detects high leakage', () => {
    const riskProfile = makeRiskProfile(65, 'HIGH');
    const assessment = detectRatingLeakage(1000, riskProfile);

    expect(assessment.severity).toBe('HIGH');
    expect(assessment.leakagePercentage).toBeGreaterThanOrEqual(20);
    expect(assessment.leakagePercentage).toBeLessThan(35);
  });

  it('detects critical leakage', () => {
    const riskProfile = makeRiskProfile(90, 'CRITICAL');
    const assessment = detectRatingLeakage(500, riskProfile);

    expect(assessment.severity).toBe('CRITICAL');
    expect(assessment.estimatedLeakageAmount).toBeGreaterThan(0);
    expect(assessment.explanation).toContain('Potential rating leakage');
  });
});
