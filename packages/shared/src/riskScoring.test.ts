import { describe, expect, it } from 'vitest';
import { syntheticPolicyRecords } from './syntheticPolicyData';
import { calculateRiskProfile, classifyRiskScore } from './riskScoring';

describe('risk scoring engine', () => {
  it('classifies a low-risk policy as LOW', () => {
    const record = syntheticPolicyRecords[0];
    const profile = calculateRiskProfile(record);

    expect(profile.riskLevel).toBe('LOW');
    expect(profile.score).toBeGreaterThanOrEqual(0);
    expect(profile.score).toBeLessThan(35);
    expect(profile.factors.length).toBeGreaterThan(0);
  });

  it('classifies a medium-risk policy as MEDIUM', () => {
    const record = syntheticPolicyRecords[4];
    const profile = calculateRiskProfile(record);

    expect(profile.riskLevel).toBe('MEDIUM');
    expect(profile.score).toBeGreaterThanOrEqual(35);
    expect(profile.score).toBeLessThan(60);
  });

  it('classifies a high-risk policy as HIGH', () => {
    const record = syntheticPolicyRecords[6];
    const profile = calculateRiskProfile(record);

    expect(profile.riskLevel).toBe('HIGH');
    expect(profile.score).toBeGreaterThanOrEqual(60);
    expect(profile.score).toBeLessThan(80);
  });

  it('classifies a critical-risk policy as CRITICAL', () => {
    const record = syntheticPolicyRecords[9];
    const profile = calculateRiskProfile(record);

    expect(profile.riskLevel).toBe('CRITICAL');
    expect(profile.score).toBeGreaterThanOrEqual(80);
  });

  it('supports explicit score classification thresholds', () => {
    expect(classifyRiskScore(10)).toBe('LOW');
    expect(classifyRiskScore(45)).toBe('MEDIUM');
    expect(classifyRiskScore(65)).toBe('HIGH');
    expect(classifyRiskScore(88)).toBe('CRITICAL');
  });
});
