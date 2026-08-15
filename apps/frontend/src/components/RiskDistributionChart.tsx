import type { RiskDistribution } from '../data/mockDashboard';

type RiskDistributionChartProps = {
  data: RiskDistribution[];
};

const bandStyles: Record<string, string> = {
  Low: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  High: 'bg-orange-400',
  Critical: 'bg-rose-500',
};

export function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Risk distribution</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Policy mix</h3>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200">{total}%</span>
      </div>

      <div className="space-y-5">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span className="font-medium text-slate-200">{item.label}</span>
              <span className="text-slate-400">{item.value}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full ${bandStyles[item.label] ?? 'bg-cyan-400'}`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
