import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import type { CalculatorDef } from '@/lib/calculators'
import { Calculator } from './Calculator'

/** A tabbed workspace: pick a calculator from the list and use it in place. */
export function CategoryWorkspace({ calculators, label }: { calculators: CalculatorDef[]; label: string }) {
  const [activeSlug, setActiveSlug] = useState(calculators[0]?.slug)
  const active = calculators.find((c) => c.slug === activeSlug) ?? calculators[0]

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div role="tablist" aria-label={label} aria-orientation="vertical" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
        {calculators.map((c) => {
          const Icon = c.icon
          const selected = c.slug === active.slug
          return (
            <button
              key={c.slug}
              type="button"
              role="tab"
              id={`tab-${c.slug}`}
              aria-selected={selected}
              aria-controls={`panel-${c.slug}`}
              onClick={() => setActiveSlug(c.slug)}
              className={`flex shrink-0 items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium whitespace-nowrap transition lg:whitespace-normal ${
                selected
                  ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300'
                  : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              {c.name}
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id={`panel-${active.slug}`} aria-labelledby={`tab-${active.slug}`}>
        <Calculator key={active.slug} def={active} />
        <div className="mt-4 flex justify-end">
          <Link to="/calculators/$slug" params={{ slug: active.slug }} className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            Open full page with formula <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
