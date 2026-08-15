import { describe, expect, it } from 'vitest';
import { formatInr } from './inr';

describe('formatInr', () => {
  it('formats Indian rupees using Indian number grouping and cents when needed', () => {
    expect(formatInr(1625)).toBe('₹1,625');
    expect(formatInr(2112.5)).toBe('₹2,112.50');
    expect(formatInr(487.5)).toBe('₹487.50');
  });
});
