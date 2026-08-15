type StatCardProps = {
  label: string;
  value: string;
  delta: string;
  tone: 'positive' | 'warning' | 'critical' | 'neutral';
};

const toneClasses = {
  positive: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  critical: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  neutral: 'border-slate-700 bg-slate-800/80 text-slate-200',
};

export function StatCard({ label, value, delta, tone }: StatCardProps) {
  return (
    <div className="group rounded-[24px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900">
      <div className="mb-5 flex items-center justify-between gap-3 text-sm text-slate-400">
        <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{label}</span>
        <span className={`rounded-full border px-2 py-1 text-[10px] font-medium ${toneClasses[tone]}`}>{delta}</span>
      </div>
      <div className="text-3xl font-semibold tracking-tight text-white sm:text-[2rem]">{value}</div>
    </div>
  );
}
