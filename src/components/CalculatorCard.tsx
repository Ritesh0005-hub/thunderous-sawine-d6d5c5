import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES, type CalculatorDef } from '@/lib/calculators'

export function CalculatorCard({ def }: { def: CalculatorDef }) {
  const Icon = def.icon
  return (
    <Link
      to="/calculators/$slug"
      params={{ slug: def.slug }}
      className="card card-hover group flex h-full flex-col p-5"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-400">
          <Icon size={21} />
        </span>
        <span className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">{CATEGORIES[def.category].name}</span>
      </div>
      <h3 className="mt-4 font-semibold text-ink dark:text-white">{def.name}</h3>
      <p className="muted mt-1.5 flex-1 text-sm leading-6">{def.description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
        Open calculator <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
