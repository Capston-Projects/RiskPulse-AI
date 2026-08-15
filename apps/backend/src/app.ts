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
  DashboardSummaryResponse,
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

const formatInr = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatDelta = (value: number): string => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

const buildDashboardSummary = (): DashboardSummaryResponse => {
  const analyses = syntheticPolicyRecords.map((record) => {
    const riskProfile = calculateRiskProfile(record);
    const pricing = calculateRecommendedPremium(record.premium.currentPremiumAnnual, riskProfile);
    const leakage = detectRatingLeakage(record.premium.currentPremiumAnnual, riskProfile);
    const decision = determineUnderwritingDecision(record.premium.currentPremiumAnnual, riskProfile);

    return { record, riskProfile, pricing, leakage, decision };
  });

  const totalPremium = analyses.reduce((sum, item) => sum + item.record.premium.currentPremiumAnnual, 0);
  const totalLeakage = analyses.reduce((sum, item) => sum + item.leakage.estimatedLeakageAmount, 0);
  const highRiskPolicies = analyses.filter((item) => item.riskProfile.riskLevel === 'HIGH' || item.riskProfile.riskLevel === 'CRITICAL').length;
  const reviewPolicies = analyses.filter((item) => item.decision.decision === 'REVIEW' || item.decision.decision === 'REFER').length;
  const premiumGap = analyses.reduce(
    (sum, item) => sum + (item.pricing.recommendedPremium - item.record.premium.currentPremiumAnnual),
    0,
  );
  const premiumGapPercent = totalPremium === 0 ? 0 : (premiumGap / totalPremium) * 100;
  const leakageGapPercent = totalPremium === 0 ? 0 : (totalLeakage / totalPremium) * 100;

  const riskCounts = {
    Low: analyses.filter((item) => item.riskProfile.riskLevel === 'LOW').length,
    Medium: analyses.filter((item) => item.riskProfile.riskLevel === 'MEDIUM').length,
    High: analyses.filter((item) => item.riskProfile.riskLevel === 'HIGH').length,
    Critical: analyses.filter((item) => item.riskProfile.riskLevel === 'CRITICAL').length,
  } as const;

  const totalPolicies = analyses.length || 1;
  const riskDistribution = [
    { label: 'Low', value: Number(((riskCounts.Low / totalPolicies) * 100).toFixed(1)), color: 'bg-emerald-400' },
    { label: 'Medium', value: Number(((riskCounts.Medium / totalPolicies) * 100).toFixed(1)), color: 'bg-amber-400' },
    { label: 'High', value: Number(((riskCounts.High / totalPolicies) * 100).toFixed(1)), color: 'bg-orange-400' },
    { label: 'Critical', value: Number(((riskCounts.Critical / totalPolicies) * 100).toFixed(1)), color: 'bg-rose-500' },
  ] as const;

  const reviewQueue = analyses
    .filter((item) => item.decision.decision !== 'APPROVE')
    .sort((a, b) => {
      const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, NONE: 0 };
      return (
        severityOrder[b.leakage.severity as keyof typeof severityOrder] -
          severityOrder[a.leakage.severity as keyof typeof severityOrder]
      );
    })
    .slice(0, 4)
    .map((item) => ({
      policyId: item.record.policy.policyId,
      customer: item.record.customer.policyholderName,
      risk: item.riskProfile.riskLevel,
      premium: formatInr(item.record.premium.currentPremiumAnnual),
      leakage: `${item.leakage.leakagePercentage.toFixed(1)}%`,
      action:
        item.decision.decision === 'REFER'
          ? 'Escalate underwriter'
          : item.decision.decision === 'REVIEW'
            ? 'Manual review'
            : 'Pricing audit',
    }));

  const leakageSummary = [
    {
      band: 'Critical',
      count: analyses.filter((item) => item.leakage.severity === 'CRITICAL').length,
      value: formatInr(
        analyses
          .filter((item) => item.leakage.severity === 'CRITICAL')
          .reduce((sum, item) => sum + item.leakage.estimatedLeakageAmount, 0),
      ),
      tone: 'critical' as const,
    },
    {
      band: 'High',
      count: analyses.filter((item) => item.leakage.severity === 'HIGH').length,
      value: formatInr(
        analyses
          .filter((item) => item.leakage.severity === 'HIGH')
          .reduce((sum, item) => sum + item.leakage.estimatedLeakageAmount, 0),
      ),
      tone: 'warning' as const,
    },
    {
      band: 'Low',
      count: analyses.filter((item) => ['LOW', 'NONE'].includes(item.leakage.severity)).length,
      value: formatInr(
        analyses
          .filter((item) => ['LOW', 'NONE'].includes(item.leakage.severity))
          .reduce((sum, item) => sum + item.leakage.estimatedLeakageAmount, 0),
      ),
      tone: 'neutral' as const,
    },
  ];

  const riskAverage = analyses.reduce((sum, item) => sum + item.riskProfile.score, 0) / analyses.length;
  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, index) => ({
    month,
    value: Math.max(28, Math.min(92, Math.round(riskAverage + (index - 3) * 5 + (index % 2 === 0 ? 3 : -2)))),
  }));

  const kpis = [
    {
      label: 'Portfolio premium',
      value: formatInr(totalPremium),
      delta: formatDelta(premiumGapPercent),
      tone: 'positive' as const,
    },
    {
      label: 'High risk policies',
      value: String(highRiskPolicies),
      delta: formatDelta(((highRiskPolicies / totalPolicies) * 100) - 20),
      tone: 'warning' as const,
    },
    {
      label: 'Underwriting review',
      value: String(reviewPolicies),
      delta: formatDelta(((reviewPolicies / totalPolicies) * 100) - 15),
      tone: 'neutral' as const,
    },
    {
      label: 'Leakage exposure',
      value: formatInr(totalLeakage),
      delta: formatDelta(leakageGapPercent),
      tone: 'critical' as const,
    },
  ];

  return {
    kpis,
    riskDistribution: [...riskDistribution],
    reviewPolicies: reviewQueue,
    leakageSummary,
    trendData,
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

app.get('/api/dashboard-summary', (_req, res) => {
  res.json(buildDashboardSummary());
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
