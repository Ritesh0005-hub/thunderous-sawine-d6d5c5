import type { ReactNode } from 'react'

export function PageHero({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="container-page py-14 sm:py-16">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl dark:text-white">{title}</h1>
        {children && <div className="muted mt-4 max-w-2xl text-lg leading-8">{children}</div>}
      </div>
    </section>
  )
}
