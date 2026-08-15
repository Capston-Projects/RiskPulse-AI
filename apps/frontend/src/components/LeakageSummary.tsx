import type { LeakageSummary as LeakageSummaryType } from '../data/mockDashboard';

type LeakageSummaryProps = {
  items: LeakageSummaryType[];
};

const toneClasses = {
  critical: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  warning: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
  neutral: 'border-slate-700 bg-slate-800 text-slate-200',
};

export function LeakageSummary({ items }: LeakageSummaryProps) {
  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Potential rating leakage</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Exposure watchlist</h3>
        </div>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-200">Live</span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.band} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5">
            <div className="flex items-center gap-3">
              <span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${toneClasses[item.tone]}`}>{item.band}</span>
              <span className="text-sm text-slate-400">{item.count} policies</span>
            </div>
            <div className="text-right">
              <div className="text-base font-semibold text-white">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
