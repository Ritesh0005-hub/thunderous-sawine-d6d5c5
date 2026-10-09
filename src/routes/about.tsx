import { createFileRoute, Link } from '@tanstack/react-router'
import { Eye, HeartHandshake, Lightbulb, Lock } from 'lucide-react'
import { PageHero } from '@/components/PageHero'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/about')({
  head: () =>
    seo({
      title: 'About CalcDock',
      description:
        'CalcDock makes everyday, financial, jewellery and business calculations easier and more accessible with free, transparent online calculators.',
      path: '/about',
    }),
  component: About,
})

const VALUES = [
  { icon: Eye, title: 'Transparent by default', text: 'Every result shows its breakdown and the formula behind it, so you can check the working yourself.' },
  { icon: Lightbulb, title: 'Simple, not simplistic', text: 'Clean interfaces with clear labels — but the same correct formulas professionals use.' },
  { icon: Lock, title: 'Your numbers stay with you', text: 'Calculations run in your browser. You do not need an account, and we do not store what you calculate.' },
  { icon: HeartHandshake, title: 'Built for real decisions', text: 'Designed around the questions Indian shopkeepers, students, freelancers and families actually ask.' },
]

function About() {
  return (
    <>
      <PageHero eyebrow="About CalcDock" title="Making everyday calculations easier for everyone.">
        CalcDock is a growing collection of free online calculators for everyday, financial, jewellery and business decisions.
      </PageHero>

      <section className="container-page grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5 text-lg leading-8 text-slate-700 dark:text-slate-300">
          <h2 className="text-2xl font-bold tracking-tight text-ink dark:text-white">Why we built CalcDock</h2>
          <p>
            Many important decisions come down to a calculation: how much GST to add to an invoice, what margin a new product will earn, what a gold
            necklace should cost, or whether a loan EMI fits your budget. The maths is not difficult, but it is easy to get wrong — and most online tools
            either hide the working or bury it under ads and pop-ups.
          </p>
          <p>
            CalcDock brings these calculations together in one clean, dependable place. Each calculator asks only for what it needs, checks your inputs,
            and explains the result in plain language alongside a full breakdown.
          </p>
          <p>
            Our free calculators will always be available without signup. We are also working on{' '}
            <Link to="/pro" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
              CalcDock Pro
            </Link>{' '}
            for people who need saved history, reports and advanced tools.
          </p>
        </div>
        <div className="grid gap-4 self-start sm:grid-cols-2 lg:grid-cols-1">
          {VALUES.map((v) => (
            <div key={v.title} className="card flex gap-4 p-5">
              <v.icon size={22} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-ink dark:text-white">{v.title}</h3>
                <p className="muted mt-1 text-sm leading-6">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-ink dark:text-white">Have an idea for a calculator?</h2>
            <p className="muted mt-1">We would love to hear which tools would help you most.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/contact" className="btn-primary">
              Contact us
            </Link>
            <Link to="/calculators" className="btn-secondary">
              Browse calculators
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
