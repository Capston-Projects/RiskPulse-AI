import type { ReviewPolicy } from '../data/mockDashboard';

type ReviewTableProps = {
  items: ReviewPolicy[];
  onSelectPolicy: (policyId: string) => void;
  selectedPolicyId: string | null;
};

const riskStyles: Record<string, string> = {
  High: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
  Critical: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  Medium: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
};

export function ReviewTable({ items, onSelectPolicy, selectedPolicyId }: ReviewTableProps) {
  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.8)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Policies requiring review</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Escalations</h3>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200">{items.length} active</span>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isSelected = selectedPolicyId === item.policyId;

          return (
            <button
              key={item.policyId}
              type="button"
              onClick={() => onSelectPolicy(item.policyId)}
              className={[
                'flex w-full flex-col gap-4 rounded-2xl border p-4 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:ring-offset-2 focus:ring-offset-slate-950 md:flex-row md:items-center md:justify-between',
                isSelected
                  ? 'border-cyan-500/40 bg-cyan-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950/80',
              ].join(' ')}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{item.policyId}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${riskStyles[item.risk] ?? 'border-slate-600 bg-slate-700 text-slate-200'}`}>
                    {item.risk}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{item.customer}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs text-slate-300 md:min-w-[42%]">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Premium</div>
                  <div className="mt-1 font-semibold text-slate-100">{item.premium}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Leakage</div>
                  <div className="mt-1 font-semibold text-slate-100">{item.leakage}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Action</div>
                  <div className="mt-1 font-semibold text-cyan-200">{item.action}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
