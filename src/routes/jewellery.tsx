import { createFileRoute, Link } from '@tanstack/react-router'
import { Info } from 'lucide-react'
import { PageHero } from '@/components/PageHero'
import { Calculator, FormulaPanel } from '@/components/Calculator'
import { getCalculator } from '@/lib/calculators'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/jewellery')({
  head: () =>
    seo({
      title: 'Jewellery Price Calculator — Gold, Making Charges, GST',
      description:
        'Estimate gold jewellery prices for 24K, 22K, 18K and 14K with making charges, wastage and GST shown separately. Free, no signup.',
      path: '/jewellery',
    }),
  component: JewelleryPage,
})

const TERMS = [
  ['Purity (karat)', '24K is nearly pure gold. 22K (916), 18K (750) and 14K (585) are alloys used for jewellery.'],
  ['Gold rate', 'The price per gram of gold on the day. Rates are quoted for specific purities, often 24K and 22K.'],
  ['Making charges', 'The cost of design and craftsmanship — a percentage, a per-gram amount or a fixed amount.'],
  ['Wastage', 'An allowance for gold lost while making the piece, charged as a percentage by some jewellers.'],
  ['GST', 'Tax added to the value of the jewellery. Confirm the current applicable rate with your jeweller.'],
]

function JewelleryPage() {
  const jewellery = getCalculator('jewellery-price-calculator')!
  const gold = getCalculator('gold-price-calculator')!

  return (
    <>
      <PageHero eyebrow="Jewellery calculator" title="A transparent estimate for every piece of gold jewellery.">
        Enter the weight, purity and today's gold rate, add the making charges and wastage your jeweller quotes, and see each part of the price on its
        own line.
      </PageHero>

      <div className="bg-slate-50 dark:bg-slate-900/40">
        <div className="container-page py-12">
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <Info size={18} className="mt-0.5 shrink-0" />
            <p>
              CalcDock does not provide live gold rates. The estimate depends entirely on the rates and charges you enter and may differ from a jeweller's
              final invoice.
            </p>
          </div>
          <Calculator def={jewellery} />
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <FormulaPanel def={jewellery} />
            <div className="card p-5 sm:p-7">
              <h2 className="text-base font-semibold text-ink dark:text-white">Key terms</h2>
              <dl className="mt-4 space-y-3">
                {TERMS.map(([t, d]) => (
                  <div key={t}>
                    <dt className="text-sm font-semibold text-ink dark:text-white">{t}</dt>
                    <dd className="muted text-sm leading-6">{d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <section className="container-page py-16">
        <p className="eyebrow">Just need the metal value?</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink dark:text-white">Gold Price Calculator</h2>
        <p className="muted mt-2 max-w-2xl">Convert a 24K rate into the value of 22K, 18K or 14K gold for any weight — without making charges or tax.</p>
        <div className="mt-8">
          <Calculator def={gold} />
        </div>
        <p className="mt-8 text-sm">
          <Link to="/blog/$slug" params={{ slug: 'how-jewellery-prices-are-calculated' }} className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            Read: How jewellery prices are calculated →
          </Link>
        </p>
      </section>
    </>
  )
}
