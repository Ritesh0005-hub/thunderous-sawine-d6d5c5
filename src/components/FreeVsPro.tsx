import { Link } from '@tanstack/react-router'
import { Check, Clock, Sparkles } from 'lucide-react'

export const FREE_FEATURES = [
  'Access to basic calculators',
  'Jewellery price estimates',
  'Business and finance calculations',
  'No mandatory account creation',
  'Mobile-friendly interface',
]

export const PRO_FEATURES = [
  'Advanced calculators',
  'Saved calculation history',
  'Exportable reports',
  'Custom calculation presets',
  'Additional business tools',
]

export function FreeVsPro({ showCta = true }: { showCta?: boolean }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card flex flex-col p-7">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink dark:text-white">Free</h3>
          <span className="badge border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            Available now
          </span>
        </div>
        <p className="mt-3 text-4xl font-bold tracking-tight text-ink dark:text-white">₹0</p>
        <p className="muted mt-1 text-sm">Every calculator on CalcDock, free to use.</p>
        <ul className="mt-6 flex-1 space-y-3">
          {FREE_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
              <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" /> {f}
            </li>
          ))}
        </ul>
        {showCta && (
          <Link to="/calculators" className="btn-secondary mt-8">
            Start calculating
          </Link>
        )}
      </div>

      <div className="card relative flex flex-col overflow-hidden border-blue-200 p-7 ring-1 ring-blue-600/10 dark:border-blue-500/30">
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-ink dark:text-white">
            <Sparkles size={18} className="text-blue-600" /> Pro
          </h3>
          <span className="badge border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            <Clock size={12} /> Coming Soon
          </span>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight text-ink dark:text-white">Planned premium features</p>
        <p className="muted mt-1 text-sm">In development. Pricing has not been announced.</p>
        <ul className="mt-6 flex-1 space-y-3">
          {PRO_FEATURES.map((f) => (
            <li key={f} className="flex items-start justify-between gap-3 text-sm text-slate-700 dark:text-slate-300">
              <span className="flex items-start gap-3">
                <Check size={18} className="mt-0.5 shrink-0 text-blue-600" /> {f}
              </span>
              <span className="shrink-0 text-xs text-slate-400">Coming soon</span>
            </li>
          ))}
        </ul>
        {showCta && (
          <Link to="/pro" className="btn-primary mt-8">
            Join the Pro waitlist
          </Link>
        )}
      </div>
    </div>
  )
}
