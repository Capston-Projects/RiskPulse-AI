import { useEffect, useMemo, useState } from 'react';
import { formatInr } from '../utils/inr';
import { calculateScenarioOutcome, type ScenarioInputs } from '../utils/scenario';
import { fetchPolicyWorkspace, type PolicyDetailWorkspaceData } from '../services/policyDetailApi';

const riskToneClasses: Record<string, string> = {
  LOW: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  MEDIUM: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  HIGH: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
  CRITICAL: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
};

const riskBarClasses: Record<string, string> = {
  LOW: 'from-emerald-400 to-cyan-400',
  MEDIUM: 'from-amber-400 to-yellow-300',
  HIGH: 'from-orange-400 to-amber-400',
  CRITICAL: 'from-rose-500 to-red-400',
};

const currency = (value: number) => formatInr(value);
const percent = (value: number) => `${value.toFixed(1)}%`;

function RiskScoreCard({ score, level }: { score: number; level: string }) {
  const percentage = Math.min(100, Math.max(0, score));

  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Risk score</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Underwriting risk profile</h3>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${riskToneClasses[level] ?? 'border-slate-700 bg-slate-800 text-slate-200'}`}>
          {level}
        </span>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-4xl font-semibold tracking-tight text-white">{score}</div>
          <div className="mt-2 text-sm text-slate-400">Risk rating</div>
        </div>
        <div className="w-full max-w-[220px]">
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
            <div className={`h-full rounded-full bg-gradient-to-r ${riskBarClasses[level] ?? 'from-cyan-400 to-blue-500'}`} style={{ width: `${percentage}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PremiumComparisonCard({ current, recommended, changePercent }: { current: number; recommended: number; changePercent: number }) {
  const changeAmount = recommended - current;

  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Premium</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Pricing recommendation</h3>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${changePercent >= 0 ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}`}>
          {changePercent >= 0 ? '+' : ''}{percent(changePercent)}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Current premium</div>
          <div className="mt-2 text-2xl font-semibold text-white">{currency(current)}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Recommended premium</div>
          <div className="mt-2 text-2xl font-semibold text-white">{currency(recommended)}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
        <span>Premium change</span>
        <span className="font-semibold text-cyan-200">{changeAmount >= 0 ? '+' : ''}{currency(changeAmount)}</span>
      </div>
    </div>
  );
}

function LeakageCard({ leakage }: { leakage: PolicyDetailWorkspaceData['leakage'] }) {
  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Rating leakage</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Exposure assessment</h3>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${riskToneClasses[leakage.severity] ?? 'border-slate-700 bg-slate-800 text-slate-200'}`}>
          {leakage.severity}
        </span>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-sm text-slate-400">Estimated leakage amount</div>
          <div className="mt-2 text-2xl font-semibold text-white">{currency(leakage.estimatedLeakageAmount)}</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Leakage %</div>
            <div className="mt-2 text-xl font-semibold text-white">{percent(leakage.leakagePercentage)}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Recommended premium</div>
            <div className="mt-2 text-xl font-semibold text-white">{currency(leakage.recommendedPremium)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DecisionCard({ decision }: { decision: PolicyDetailWorkspaceData['decision'] }) {
  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Underwriting decision</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Decision support</h3>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${decision.decision === 'REFER' ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : decision.decision === 'REVIEW' ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}`}>
          {decision.decision}
        </span>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-sm text-slate-400">Reason</div>
          <p className="mt-2 text-sm leading-6 text-slate-200">{decision.reason}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Recommended human action</div>
          <div className="mt-2 text-base font-semibold text-cyan-200">{decision.recommendedAction}</div>
        </div>
      </div>
    </div>
  );
}

function AiBriefCard({ brief }: { brief: PolicyDetailWorkspaceData['aiBrief'] }) {
  const premiumDelta = brief.premiumSummary.premiumChangeAmount;
  const premiumDeltaText = `${premiumDelta >= 0 ? '+' : '-'}${formatInr(Math.abs(premiumDelta))}`;

  const executiveAssessment = [
    `${brief.customerSummary.policyholderName} is currently assessed as ${brief.riskAssessment.riskLevel.toLowerCase()} risk`,
    `with a score of ${brief.riskAssessment.score} and a ${brief.customerSummary.coverageType.toLowerCase()} policy for ${brief.customerSummary.vehicle}.`,
    `The strongest underwriting signals are ${brief.riskAssessment.topRiskDrivers.slice(0, 3).join(', ')}.`,
  ].join(' ');

  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">AI Underwriter Brief</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Executive assessment</h3>
        </div>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-200">Human-reviewed</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Concise assessment</div>
            <p className="mt-2 leading-6 text-slate-200">{executiveAssessment}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Why the policy was flagged</div>
            <p className="mt-2 leading-6 text-slate-200">{brief.underwritingDecision.reason}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Top supporting risk evidence</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {brief.riskAssessment.topRiskDrivers.map((driver) => (
                <li key={driver} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Premium context</div>
            <div className="mt-3 space-y-3 text-sm text-slate-200">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Current premium</span>
                <span className="font-semibold text-white">{formatInr(brief.premiumSummary.currentPremium)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Recommended premium</span>
                <span className="font-semibold text-white">{formatInr(brief.premiumSummary.recommendedPremium)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Delta</span>
                <span className="font-semibold text-cyan-200">{premiumDeltaText}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Change %</span>
                <span className="font-semibold text-cyan-200">{brief.premiumSummary.premiumChangePercent.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Rating leakage concern</div>
            <div className="mt-3 space-y-2 text-sm text-slate-200">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Severity</span>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-200">{brief.leakageAssessment.severity}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Estimated leakage</span>
                <span className="font-semibold text-white">{formatInr(brief.leakageAssessment.estimatedLeakageAmount)}</span>
              </div>
              <p className="leading-6 text-slate-300">{brief.leakageAssessment.explanation}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Underwriting recommendation</div>
            <div className="mt-3 text-base font-semibold text-cyan-200">{brief.underwritingDecision.decision}</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">{brief.underwritingDecision.recommendedAction}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-200">Recommended human action</div>
        <p className="mt-2 text-sm leading-6 text-slate-100">{brief.humanReviewAction}</p>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Disclaimer</div>
        <p className="mt-2 text-sm leading-6 text-slate-200">AI-assisted decision support — final decision remains with human underwriter.</p>
      </div>
    </div>
  );
}

type PolicyDetailWorkspaceProps = {
  policyId: string;
  onBack: () => void;
};

function deriveDrivingBehaviourRisk(harshBraking: number, phoneDistraction: number): number {
  const weightedRisk = (harshBraking / 10) * 45 + (phoneDistraction / 80) * 55;
  return Math.min(100, Math.max(0, Math.round(weightedRisk)));
}

function ScenarioComparisonCard({
  currentRiskScore,
  scenarioRiskScore,
  currentRiskLevel,
  scenarioRiskLevel,
  currentPremium,
  scenarioPremium,
  currentLeakage,
  scenarioLeakage,
  currentDecision,
  scenarioDecision,
}: {
  currentRiskScore: number;
  scenarioRiskScore: number;
  currentRiskLevel: string;
  scenarioRiskLevel: string;
  currentPremium: number;
  scenarioPremium: number;
  currentLeakage: number;
  scenarioLeakage: number;
  currentDecision: string;
  scenarioDecision: string;
}) {
  const rows = [
    { label: 'Risk score', current: `${currentRiskScore}`, scenario: `${scenarioRiskScore}` },
    { label: 'Risk level', current: currentRiskLevel, scenario: scenarioRiskLevel },
    { label: 'Recommended premium', current: formatInr(currentPremium), scenario: formatInr(scenarioPremium) },
    { label: 'Leakage', current: formatInr(currentLeakage), scenario: formatInr(scenarioLeakage) },
    { label: 'Underwriting decision', current: currentDecision, scenario: scenarioDecision },
  ];

  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">What-if simulation</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Risk & pricing impact</h3>
        </div>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-200">Simulation</span>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 md:grid-cols-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{row.label}</div>
              <div className="mt-2 text-sm font-semibold text-slate-200">Current</div>
              <div className="mt-1 text-base font-medium text-white">{row.current}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Scenario</div>
              <div className="mt-2 text-sm font-semibold text-cyan-200">Adjusted</div>
              <div className="mt-1 text-base font-medium text-cyan-100">{row.scenario}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PolicyDetailWorkspace({ policyId, onBack }: PolicyDetailWorkspaceProps) {
  const [data, setData] = useState<PolicyDetailWorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scenarioInputs, setScenarioInputs] = useState<ScenarioInputs | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const next = await fetchPolicyWorkspace(policyId);
        if (isMounted) {
          setData(next);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load policy detail.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [policyId]);

  useEffect(() => {
    if (!data) return;

    setScenarioInputs({
      annualMileage: data.policy.policy.annualMileage,
      claimCount: data.policy.claimsHistory.claimsInLast3Years,
      drivingBehaviourRisk: deriveDrivingBehaviourRisk(
        data.policy.telematics.harshBrakingEventsPer1000Km,
        data.policy.telematics.phoneDistractionScore,
      ),
    });
  }, [data]);

  const { policy, riskProfile, pricing, leakage, decision, aiBrief } = data ?? {
    policy: undefined,
    riskProfile: undefined,
    pricing: undefined,
    leakage: undefined,
    decision: undefined,
    aiBrief: undefined,
  } as Partial<PolicyDetailWorkspaceData> as PolicyDetailWorkspaceData;

  const scenarioOutcome = useMemo(() => {
    if (!data || !scenarioInputs) {
      return null;
    }

    return calculateScenarioOutcome(data.policy, scenarioInputs);
  }, [data, scenarioInputs]);

  const updateScenarioInput = <K extends keyof ScenarioInputs>(key: K, value: ScenarioInputs[K]) => {
    if (!data) return;

    setScenarioInputs((current) => ({
      annualMileage: current?.annualMileage ?? data.policy.policy.annualMileage,
      claimCount: current?.claimCount ?? data.policy.claimsHistory.claimsInLast3Years,
      drivingBehaviourRisk: current?.drivingBehaviourRisk ?? deriveDrivingBehaviourRisk(
        data.policy.telematics.harshBrakingEventsPer1000Km,
        data.policy.telematics.phoneDistractionScore,
      ),
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-8 text-slate-200 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)]">
        Loading policy detail…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-[28px] border border-rose-500/40 bg-slate-900/80 p-8 text-rose-200 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)]">
        <div className="mb-3 text-sm uppercase tracking-[0.22em] text-rose-300">Error</div>
        <div>{error ?? 'Unable to load policy detail.'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-cyan-200">
            Policy detail workspace
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">{policy.policy.policyId}</h2>
          <div className="mt-2 text-sm text-slate-400">{policy.customer.policyholderName} · {policy.customer.postcode}</div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Back to dashboard
          </button>
          <button
            type="button"
            className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-400 hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Export brief
          </button>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Policy summary</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Customer and policy information</h3>
            </div>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${riskToneClasses[riskProfile.riskLevel] ?? 'border-slate-700 bg-slate-800 text-slate-200'}`}>
              {riskProfile.riskLevel}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Customer</div>
              <div className="mt-2 text-lg font-semibold text-white">{policy.customer.policyholderName}</div>
              <div className="mt-2 text-sm text-slate-400">ID: {policy.customer.customerId}</div>
              <div className="mt-1 text-sm text-slate-400">Age: {policy.customer.age}</div>
              <div className="mt-1 text-sm text-slate-400">Status: {policy.customer.employmentStatus}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Policy</div>
              <div className="mt-2 text-lg font-semibold text-white">{policy.policy.coverageType}</div>
              <div className="mt-2 text-sm text-slate-400">Vehicle: {policy.vehicle.make} {policy.vehicle.model}</div>
              <div className="mt-1 text-sm text-slate-400">Effective: {policy.policy.effectiveDate}</div>
              <div className="mt-1 text-sm text-slate-400">Renewal: {policy.policy.policyStatus}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Annual mileage</div>
              <div className="mt-2 text-lg font-semibold text-white">{policy.policy.annualMileage.toLocaleString()} mi</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Years as policyholder</div>
              <div className="mt-2 text-lg font-semibold text-white">{policy.customer.yearsAsPolicyholder}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Premium frequency</div>
              <div className="mt-2 text-lg font-semibold text-white">{policy.premium.paymentFrequency}</div>
            </div>
          </div>
        </div>

        <RiskScoreCard score={riskProfile.score} level={riskProfile.riskLevel} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <PremiumComparisonCard current={policy.premium.currentPremiumAnnual} recommended={pricing.recommendedPremium} changePercent={pricing.premiumChangePercent} />
        <LeakageCard leakage={leakage} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
          <div className="mb-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Top risk drivers</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Key risk factors</h3>
          </div>

          <div className="space-y-4">
            {riskProfile.factors.map((factor) => (
              <div key={factor.label} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="text-base font-semibold text-white">{factor.label}</div>
                  <div className="text-xs text-cyan-200">{factor.contribution} pts</div>
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${Math.min(100, factor.contribution)}%` }} />
                </div>
                <p className="text-sm leading-6 text-slate-300">{factor.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        <DecisionCard decision={decision} />
      </section>

      <AiBriefCard brief={aiBrief} />

      <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Simulation controls</p>
            <h3 className="mt-2 text-xl font-semibold text-white">What-if risk & pricing simulator</h3>
          </div>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-200">Editable</span>
        </div>

        {scenarioInputs && scenarioOutcome && (
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="mileage" className="text-sm font-medium text-slate-200">Annual mileage</label>
                  <span className="text-sm font-semibold text-cyan-200">{scenarioInputs.annualMileage.toLocaleString()} km</span>
                </div>
                <input
                  id="mileage"
                  type="range"
                  min={2000}
                  max={30000}
                  step={250}
                  value={scenarioInputs.annualMileage}
                  onChange={(event) => updateScenarioInput('annualMileage', Number(event.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="claims" className="text-sm font-medium text-slate-200">Claim count</label>
                  <span className="text-sm font-semibold text-cyan-200">{scenarioInputs.claimCount}</span>
                </div>
                <input
                  id="claims"
                  type="range"
                  min={0}
                  max={5}
                  step={1}
                  value={scenarioInputs.claimCount}
                  onChange={(event) => updateScenarioInput('claimCount', Number(event.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="driving-risk" className="text-sm font-medium text-slate-200">Driving behaviour risk</label>
                  <span className="text-sm font-semibold text-cyan-200">{scenarioInputs.drivingBehaviourRisk}/100</span>
                </div>
                <input
                  id="driving-risk"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={scenarioInputs.drivingBehaviourRisk}
                  onChange={(event) => updateScenarioInput('drivingBehaviourRisk', Number(event.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            <ScenarioComparisonCard
              currentRiskScore={riskProfile.score}
              scenarioRiskScore={scenarioOutcome.riskScore}
              currentRiskLevel={riskProfile.riskLevel}
              scenarioRiskLevel={scenarioOutcome.riskLevel}
              currentPremium={policy.premium.currentPremiumAnnual}
              scenarioPremium={scenarioOutcome.recommendedPremium}
              currentLeakage={leakage.estimatedLeakageAmount}
              scenarioLeakage={scenarioOutcome.leakageAmount}
              currentDecision={decision.decision}
              scenarioDecision={scenarioOutcome.decision}
            />
          </div>
        )}
      </div>
    </div>
  );
}
