import { useEffect, useMemo, useState } from 'react';
import { formatInr } from './utils/inr';
import { Layout } from './components/Layout';
import { StatCard } from './components/StatCard';
import { RiskDistributionChart } from './components/RiskDistributionChart';
import { ReviewTable } from './components/ReviewTable';
import { LeakageSummary } from './components/LeakageSummary';
import { TrendChart } from './components/TrendChart';
import { PolicyDetailWorkspace } from './components/PolicyDetailWorkspace';
import type { DashboardSummaryResponse } from './services/dashboardApi';
import { fetchDashboardSummary } from './services/dashboardApi';

function App() {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardSummaryResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchDashboardSummary()
      .then((summary) => {
        if (isMounted) {
          setDashboardData(summary);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDashboardData(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const dashboard = useMemo(() => {
    const kpis = dashboardData?.kpis ?? [];
    const riskDistribution = dashboardData?.riskDistribution ?? [];
    const reviewPolicies = dashboardData?.reviewPolicies ?? [];
    const leakageSummary = dashboardData?.leakageSummary ?? [];
    const trendData = dashboardData?.trendData ?? [];

    return (
      <>
        <section id="overview" className="mb-8 flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-cyan-200">
            Portfolio overview
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Underwriting performance snapshot</h2>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} delta={item.delta} tone={item.tone} />
          ))}
        </section>

        <section id="risk" className="mb-8 grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
          <RiskDistributionChart data={riskDistribution} />

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Executive summary</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Portfolio health</h3>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-200">Stable</span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Renewal confidence</span>
                  <span className="font-semibold text-emerald-300">84%</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-sm text-slate-400">Largest risk driver</div>
                  <div className="mt-2 text-lg font-semibold text-white">Claims severity</div>
                  <div className="mt-1 text-sm text-slate-300">9.4% of portfolio exposure</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-sm text-slate-400">Pricing action</div>
                  <div className="mt-2 text-lg font-semibold text-white">{formatInr(318000)} uplift</div>
                  <div className="mt-1 text-sm text-slate-300">Recommended for renewal cohort</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="mb-8 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
          <ReviewTable items={reviewPolicies} onSelectPolicy={setSelectedPolicyId} selectedPolicyId={selectedPolicyId} />
          <LeakageSummary items={leakageSummary} />
        </section>

        <section id="trends" className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <TrendChart data={trendData} />

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Risk posture</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Action priority</h3>

            <div className="mt-5 space-y-4">
              {[
                { label: 'Critical referrals', value: '3', tone: 'text-rose-300' },
                { label: 'Manual review queue', value: '7', tone: 'text-amber-300' },
                { label: 'Leakage reduction plan', value: '82%', tone: 'text-cyan-300' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5">
                  <span className="text-sm text-slate-300">{item.label}</span>
                  <span className={`text-lg font-semibold ${item.tone}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }, [dashboardData, selectedPolicyId]);

  if (!dashboardData) {
    return (
      <Layout>
        <section className="flex min-h-[40vh] items-center justify-center">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 px-6 py-4 text-sm text-slate-200">
            Loading portfolio dashboard...
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {selectedPolicyId ? <PolicyDetailWorkspace policyId={selectedPolicyId} onBack={() => setSelectedPolicyId(null)} /> : dashboard}
    </Layout>
  );
}

export default App;
