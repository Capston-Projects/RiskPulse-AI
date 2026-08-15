import type { TrendPoint } from '../data/mockDashboard';

type TrendChartProps = {
  data: TrendPoint[];
};

export function TrendChart({ data }: TrendChartProps) {
  const maxValue = Math.max(...data.map((point) => point.value));

  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Recent risk trend</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Risk index</h3>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-200">+12.4% vs last quarter</span>
      </div>

      <div className="flex h-52 items-end gap-3 pt-4">
        {data.map((point) => (
          <div key={point.month} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-40 w-full items-end justify-center rounded-t-2xl border border-slate-800 bg-slate-950/60 p-1.5">
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-cyan-500 via-cyan-400 to-blue-300 shadow-[0_12px_25px_rgba(34,211,238,0.25)]"
                style={{ height: `${(point.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{point.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
