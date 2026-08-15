import express from 'express';
import cors from 'cors';
import {
  syntheticPolicyRecords,
  calculateRiskProfile,
  calculateRecommendedPremium,
  detectRatingLeakage,
  determineUnderwritingDecision,
  createUnderwriterBrief,
} from '@riskpulse/shared';
import type { Request, Response, NextFunction } from 'express';
import type {
  ApiErrorBody,
  PolicySummaryResponse,
  RiskProfileResponse,
  PricingRecommendationResponse,
  LeakageResponse,
  UnderwritingDecisionResponse,
  AIUnderwriterBriefResponse,
} from './contracts.js';

const app = express();

app.use(cors());
app.use(express.json());

const notFoundError = (message: string) => ({
  error: {
    code: 'NOT_FOUND',
    message,
  },
});

const validationError = (message: string, details?: string[]): ApiErrorBody => ({
  error: {
    code: 'VALIDATION_ERROR',
    message,
    ...(details && details.length > 0 ? { details } : {}),
  },
});

const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    void Promise.resolve(handler(req, res, next)).catch(next);
  };
};

const toPolicySummary = (policyId: string): PolicySummaryResponse | undefined => {
  const record = syntheticPolicyRecords.find(
    (item: (typeof syntheticPolicyRecords)[number]) => item.policy.policyId === policyId,
  );

  if (!record) {
    return undefined;
  }

  return {
    policyId: record.policy.policyId,
    customerId: record.customer.customerId,
    customerName: record.customer.policyholderName,
    coverageType: record.policy.coverageType,
    vehicle: `${record.vehicle.make} ${record.vehicle.model}`,
    currentPremiumAnnual: record.premium.currentPremiumAnnual,
    status: record.policy.policyStatus,
    riskBand: record.riskBand,
  };
};

const requirePolicyId = (value: string | string[] | undefined): string | undefined => {
  const normalized = Array.isArray(value) ? value[0] : value;
  if (!normalized || normalized.trim().length === 0) {
    return undefined;
  }
  return normalized.trim();
};

const findPolicyRecord = (req: Request) => {
  const policyId = requirePolicyId(req.params.policyId);
  if (!policyId) return undefined;

  return syntheticPolicyRecords.find(
    (record: (typeof syntheticPolicyRecords)[number]) => record.policy.policyId === policyId,
  );
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'riskpulse-ai-backend' });
});

app.get('/api/policies', (_req, res) => {
  const payload = syntheticPolicyRecords
    .map((record: (typeof syntheticPolicyRecords)[number]) => toPolicySummary(record.policy.policyId))
    .filter((value: PolicySummaryResponse | undefined): value is PolicySummaryResponse => Boolean(value));

  res.json(payload);
});

app.get(
  '/api/policies/:policyId',
  asyncHandler((req, res) => {
    const policyId = requirePolicyId(req.params.policyId);
    if (!policyId) {
      res.status(400).json(validationError('Policy ID is required.'));
      return;
    }

    const record = findPolicyRecord(req);
    if (!record) {
      res.status(404).json(notFoundError(`No policy found for policy ID '${policyId}'.`));
      return;
    }

    res.json({
      ...record,
      _meta: {
        decisionSupport: true,
      },
    });
  }),
);

app.get(
  '/api/policies/:policyId/risk-profile',
  asyncHandler((req, res) => {
    const policyId = requirePolicyId(req.params.policyId);
    if (!policyId) {
      res.status(400).json(validationError('Policy ID is required.'));
      return;
    }

    const record = findPolicyRecord(req);
    if (!record) {
      res.status(404).json(notFoundError(`No policy found for policy ID '${policyId}'.`));
      return;
    }

    const riskProfile = calculateRiskProfile(record);
    const payload: RiskProfileResponse = {
      score: riskProfile.score,
      riskLevel: riskProfile.riskLevel,
      factors: riskProfile.factors,
    };

    res.json(payload);
  }),
);

app.get(
  '/api/policies/:policyId/pricing',
  asyncHandler((req, res) => {
    const policyId = requirePolicyId(req.params.policyId);
    if (!policyId) {
      res.status(400).json(validationError('Policy ID is required.'));
      return;
    }

    const record = findPolicyRecord(req);
    if (!record) {
      res.status(404).json(notFoundError(`No policy found for policy ID '${policyId}'.`));
      return;
    }

    const riskProfile = calculateRiskProfile(record);
    const pricing = calculateRecommendedPremium(record.premium.currentPremiumAnnual, riskProfile);
    const payload: PricingRecommendationResponse = {
      recommendedPremium: pricing.recommendedPremium,
      premiumChangeAmount: pricing.premiumChangeAmount,
      premiumChangePercent: pricing.premiumChangePercent,
      isUnderpriced: pricing.isUnderpriced,
      underpricingGap: pricing.underpricingGap,
      explanation: pricing.explanation,
    };

    res.json(payload);
  }),
);

app.get(
  '/api/policies/:policyId/leakage',
  asyncHandler((req, res) => {
    const policyId = requirePolicyId(req.params.policyId);
    if (!policyId) {
      res.status(400).json(validationError('Policy ID is required.'));
      return;
    }

    const record = findPolicyRecord(req);
    if (!record) {
      res.status(404).json(notFoundError(`No policy found for policy ID '${policyId}'.`));
      return;
    }

    const riskProfile = calculateRiskProfile(record);
    const leakage = detectRatingLeakage(record.premium.currentPremiumAnnual, riskProfile);
    const payload: LeakageResponse = {
      currentPremium: leakage.currentPremium,
      recommendedPremium: leakage.recommendedPremium,
      estimatedLeakageAmount: leakage.estimatedLeakageAmount,
      leakagePercentage: leakage.leakagePercentage,
      severity: leakage.severity,
      explanation: leakage.explanation,
      underpriced: leakage.underpriced,
      riskScore: leakage.riskScore,
    };

    res.json(payload);
  }),
);

app.get(
  '/api/policies/:policyId/underwriting-decision',
  asyncHandler((req, res) => {
    const policyId = requirePolicyId(req.params.policyId);
    if (!policyId) {
      res.status(400).json(validationError('Policy ID is required.'));
      return;
    }

    const record = findPolicyRecord(req);
    if (!record) {
      res.status(404).json(notFoundError(`No policy found for policy ID '${policyId}'.`));
      return;
    }

    const riskProfile = calculateRiskProfile(record);
    const decision = determineUnderwritingDecision(record.premium.currentPremiumAnnual, riskProfile);
    const payload: UnderwritingDecisionResponse = {
      decision: decision.decision,
      reason: decision.reason,
      topRiskDrivers: decision.topRiskDrivers,
      recommendedAction: decision.recommendedAction,
      riskScore: decision.riskScore,
      recommendedPremium: decision.recommendedPremium,
      leakageSeverity: decision.leakageSeverity,
      currentPremium: decision.currentPremium,
    };

    res.json(payload);
  }),
);

app.get(
  '/api/policies/:policyId/ai-brief',
  asyncHandler((req, res) => {
    const policyId = requirePolicyId(req.params.policyId);
    if (!policyId) {
      res.status(400).json(validationError('Policy ID is required.'));
      return;
    }

    const record = findPolicyRecord(req);
    if (!record) {
      res.status(404).json(notFoundError(`No policy found for policy ID '${policyId}'.`));
      return;
    }

    const riskProfile = calculateRiskProfile(record);
    const pricing = calculateRecommendedPremium(record.premium.currentPremiumAnnual, riskProfile);
    const leakage = detectRatingLeakage(record.premium.currentPremiumAnnual, riskProfile);
    const decision = determineUnderwritingDecision(record.premium.currentPremiumAnnual, riskProfile);
    const brief = createUnderwriterBrief({ record, riskProfile, pricing, leakage, decision });

    const payload: AIUnderwriterBriefResponse = {
      decisionSupport: brief.decisionSupport,
      customerSummary: brief.customerSummary,
      riskAssessment: brief.riskAssessment,
      premiumSummary: brief.premiumSummary,
      leakageAssessment: brief.leakageAssessment,
      underwritingDecision: brief.underwritingDecision,
      humanReviewAction: brief.humanReviewAction,
      generatedFrom: brief.generatedFrom,
    };

    res.json(payload);
  }),
);

app.use((req, res) => {
  res.status(404).json(notFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected server error occurred.',
      details: [error.message],
    },
  });
});

export default app;
