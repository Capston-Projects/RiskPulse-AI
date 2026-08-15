import { describe, expect, it } from 'vitest';
import { syntheticPolicyRecords } from './syntheticPolicyData';

describe('synthetic policy dataset', () => {
  it('contains 10 synthetic policy records', () => {
    expect(syntheticPolicyRecords).toHaveLength(10);
  });

  it('keeps each record structurally valid', () => {
    syntheticPolicyRecords.forEach((record) => {
      expect(record.customer.customerId).toMatch(/^CUST-/);
      expect(record.policy.policyId).toMatch(/^POL-/);
      expect(record.vehicle.vehicleId).toMatch(/^VEH-/);
      expect(record.premium.currentPremiumAnnual).toBeGreaterThan(0);
      expect(record.claimsHistory.claimsInLast3Years).toBeGreaterThanOrEqual(0);
    });
  });
});
