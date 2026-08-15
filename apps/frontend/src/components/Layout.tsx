import type { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

const navItems = [
  { label: 'Overview', href: '#overview' },
  { label: 'Risk', href: '#risk' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Leakage', href: '#leakage' },
  { label: 'Trends', href: '#trends' },
];

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 xl:px-8">
        <aside className="hidden w-[270px] shrink-0 flex-col rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.45)] lg:flex">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 text-sm font-bold tracking-[0.18em] text-slate-950">
              RP
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-cyan-300">RiskPulse AI</p>
              <p className="mt-1 text-sm font-medium text-slate-200">Underwriting</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={[
                  'group flex items-center justify-between rounded-2xl border px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  index === 0
                    ? 'border-cyan-500/35 bg-cyan-500/10 text-cyan-100 shadow-[inset_0_1px_0_rgba(103,232,249,0.25)]'
                    : 'border-transparent bg-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/60 hover:text-white',
                ].join(' ')}
              >
                <span>{item.label}</span>
                <span className="h-2 w-2 rounded-full bg-slate-600 transition-colors group-hover:bg-cyan-300" />
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-400">
              <span>Portfolio</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-200">
                Stable
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Renewal confidence</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-2xl font-semibold text-white">84%</span>
                  <span className="text-xs text-emerald-300">+5.1%</span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500" />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <header className="rounded-[28px] border border-slate-800 bg-slate-900/80 px-4 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.45)] backdrop-blur sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-slate-400">Portfolio status</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Underwriting Command Center</h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Portfolio stable
                </div>
                <button className="rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:ring-offset-2 focus:ring-offset-slate-950">
                  Share briefing
                </button>
                <button className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-400 hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:ring-offset-2 focus:ring-offset-slate-950">
                  Export briefing
                </button>
              </div>
            </div>
          </header>

          <main className="mt-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
