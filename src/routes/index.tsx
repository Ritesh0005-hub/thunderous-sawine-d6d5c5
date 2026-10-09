import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Gauge,
  Gem,
  Layers,
  ListChecks,
  MousePointerClick,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  UserX,
  Zap,
  Keyboard,
  BadgeCheck,
} from 'lucide-react'
import { SearchBar } from '@/components/SearchBar'
import { CalculatorCard } from '@/components/CalculatorCard'
import { FreeVsPro } from '@/components/FreeVsPro'
import { LogoMark } from '@/components/Logo'
import { CALCULATORS, POPULAR, computeEmi, computeJewellery } from '@/lib/calculators'
import { BLOG_POSTS } from '@/lib/blog'
import { formatINR } from '@/lib/format'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: 'CalcDock — Smart Calculators. Simple Decisions.',
      description:
        'Calculate smarter with free tools for business, finance, jewellery and everyday decisions — GST, profit margin, gold & jewellery price, loan EMI and more.',
      path: '/',
    }),
  component: Home,
})

function Home() {
  return (
    <>
      <Hero />
      <Popular />
      <JewelleryFeature />
      <HowItWorks />
      <WhyChoose />
      <section className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24 dark:border-slate-800 dark:bg-slate-900/40" id="pricing">
        <div className="container-page">
          <SectionHeading eyebrow="Plans" title="Free today. Pro when it's ready.">
            Every calculator is free and works without an account. Pro features are planned and clearly marked as coming soon.
          </SectionHeading>
          <div className="mx-auto mt-12 max-w-4xl">
            <FreeVsPro />
          </div>
        </div>
      </section>
      <BlogPreview />
      <FinalCta />
    </>
  )
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-3">{title}</h2>
      {children && <p className="muted mt-4 text-lg leading-8">{children}</p>}
    </div>
  )
}

/* ---------------------------------- Hero --------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.35) 1px, transparent 0)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
        }}
      />
      <div className="container-page grid items-center gap-14 pt-16 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-24 lg:pb-28">
        <div>
          <span className="badge border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
            <BadgeCheck size={13} /> Free calculators · No signup required
          </span>
          <h1 className="mt-6 text-5xl leading-[1.05] font-extrabold tracking-tight text-ink sm:text-6xl dark:text-white">
            Every Calculation.
            <br />
            <span className="text-blue-600 dark:text-blue-400">One Smart Dock.</span>
          </h1>
          <p className="muted mt-6 max-w-xl text-lg leading-8">
            Calculate smarter with free tools for business, finance, jewellery, and everyday decisions.
          </p>
          <div className="mt-8 max-w-xl">
            <SearchBar />
            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
              Popular:
              {[
                ['gst-calculator', 'GST'],
                ['loan-emi-calculator', 'EMI'],
                ['jewellery-price-calculator', 'Jewellery price'],
                ['profit-margin-calculator', 'Profit margin'],
              ].map(([slug, label]) => (
                <Link key={slug} to="/calculators/$slug" params={{ slug }} className="font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300">
                  {label}
                </Link>
              ))}
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/calculators" className="btn-primary !px-6 !py-3">
              Explore Calculators <ArrowRight size={16} />
            </Link>
            <Link to="/pro" className="btn-secondary !px-6 !py-3">
              <Sparkles size={16} className="text-blue-600" /> Discover CalcDock Pro
            </Link>
          </div>
        </div>
        <DashboardVisual />
      </div>
    </section>
  )
}

function DashboardVisual() {
  const emi = computeEmi(500000, 9, 60)
  const jw = computeJewellery({ weight: 10, rate: 9000, purity: '22', rateBasis: 'purity', makingType: 'percent', makingValue: 12, wastage: 2, gst: 3 })
  const principalShare = (500000 / emi.total) * 100

  return (
    <div className="relative" aria-label="Example CalcDock results using sample values">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-blue-600/5 blur-2xl dark:bg-blue-500/10" />
      <div className="card overflow-hidden shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <LogoMark className="h-5 w-5" />
            <span className="text-xs font-semibold text-ink dark:text-white">CalcDock workspace</span>
          </div>
          <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700 uppercase dark:bg-amber-500/10 dark:text-amber-300">
            Sample values
          </span>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2">
          {/* GST */}
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500">GST @ 18% on ₹10,000</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-ink tabular-nums dark:text-white">{formatINR(11800)}</p>
            <div className="mt-3 space-y-1 text-xs">
              <Row label="CGST 9%" value={formatINR(900)} />
              <Row label="SGST 9%" value={formatINR(900)} />
            </div>
          </div>

          {/* EMI */}
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500">EMI · ₹5,00,000 · 9% · 5 yrs</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-blue-600 tabular-nums dark:text-blue-400">{formatINR(emi.emi)}</p>
            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="bg-blue-600" style={{ width: `${principalShare}%` }} />
              <div className="bg-sky-400" style={{ width: `${100 - principalShare}%` }} />
            </div>
            <div className="mt-2 text-xs">
              <Row label="Total interest" value={formatINR(emi.interest)} />
            </div>
          </div>

          {/* Jewellery */}
          <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Gem size={13} className="text-amber-500" /> Jewellery · 10 g · 22K · sample rate ₹9,000/g
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-4">
              <Stat label="Gold value" value={formatINR(jw.base)} />
              <Stat label="Making 12%" value={formatINR(jw.making)} />
              <Stat label="Wastage 2%" value={formatINR(jw.wastage)} />
              <Stat label="GST 3%" value={formatINR(jw.gst)} />
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Estimated total</span>
              <span className="text-base font-bold text-ink tabular-nums dark:text-white">{formatINR(jw.total)}</span>
            </div>
          </div>

          {/* Margin */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 sm:col-span-2 dark:border-slate-800">
            <div>
              <p className="text-xs font-medium text-slate-500">Profit margin · cost ₹800 · price ₹1,000</p>
              <p className="mt-1 text-lg font-bold text-emerald-600 tabular-nums dark:text-emerald-400">20% margin · 25% markup</p>
            </div>
            <span className="hidden rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:block dark:bg-emerald-500/10 dark:text-emerald-300">
              +{formatINR(200)} profit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-slate-500 dark:text-slate-400">
      <span>{label}</span>
      <span className="font-medium text-slate-700 tabular-nums dark:text-slate-200">{value}</span>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="font-semibold text-slate-800 tabular-nums dark:text-slate-200">{value}</p>
    </div>
  )
}

/* -------------------------------- Sections ------------------------------- */

function Popular() {
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Popular calculators</p>
            <h2 className="section-title mt-3">The tools people reach for most</h2>
          </div>
          <Link to="/calculators" className="btn-secondary self-start sm:self-auto">
            View all calculators <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {POPULAR.map((c) => (
            <CalculatorCard key={c.slug} def={c} />
          ))}
        </div>
      </div>
    </section>
  )
}

function JewelleryFeature() {
  const points = [
    'Supports 24K, 22K, 18K and 14K gold',
    'Making charges as a percentage, per gram or a fixed amount',
    'Wastage and GST shown as separate line items',
    'Copy the full breakdown to share or compare quotes',
  ]
  return (
    <section className="py-20 sm:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Flagship tool</p>
          <h2 className="section-title mt-3">Know what your jewellery should cost — before you buy.</h2>
          <p className="muted mt-4 text-lg leading-8">
            The CalcDock Jewellery Price Calculator turns today's gold rate into a transparent, line-by-line estimate, so you can compare
            quotes from different jewellers with confidence.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                    <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/jewellery" className="btn-primary">
              Open Jewellery Calculator <ArrowRight size={16} />
            </Link>
            <Link to="/calculators/$slug" params={{ slug: 'gold-price-calculator' }} className="btn-secondary">
              Gold Price Calculator
            </Link>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10">
              <Gem size={22} />
            </span>
            <div>
              <p className="font-semibold text-ink dark:text-white">Price breakdown</p>
              <p className="text-xs text-slate-500">What the calculator shows you</p>
            </div>
          </div>
          <ol className="mt-6 space-y-3">
            {[
              ['Base gold value', 'Weight × gold rate for your purity'],
              ['Making charges', 'Labour and design cost, as % or fixed'],
              ['Wastage amount', 'Gold lost during crafting, as %'],
              ['GST amount', 'Tax on the value before GST'],
              ['Final estimated price', 'Everything added together'],
            ].map(([t, d], i) => (
              <li key={t} className="flex items-center gap-4 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {i + 1}
                </span>
                <div>
                  <p className={`text-sm font-semibold ${i === 4 ? 'text-blue-600 dark:text-blue-400' : 'text-ink dark:text-white'}`}>{t}</p>
                  <p className="text-xs text-slate-500">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { icon: MousePointerClick, title: 'Choose a calculator.', text: 'Search or browse by category — business, finance, jewellery or everyday.' },
    { icon: Keyboard, title: 'Enter your values.', text: 'Clear labels and instant validation help you get the inputs right.' },
    { icon: Zap, title: 'Get your result instantly.', text: 'See the answer, a full breakdown and a plain-language explanation.' },
  ]
  return (
    <section className="border-t border-slate-200 py-20 sm:py-24 dark:border-slate-800">
      <div className="container-page">
        <SectionHeading eyebrow="How CalcDock works" title="Three steps. No learning curve." />
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="card relative p-7">
              <span className="absolute top-6 right-6 text-5xl font-extrabold text-slate-100 dark:text-slate-800">{i + 1}</span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <s.icon size={21} />
              </span>
              <h3 className="relative mt-5 text-lg font-semibold text-ink dark:text-white">{s.title}</h3>
              <p className="muted relative mt-2 text-sm leading-6">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function WhyChoose() {
  const items = [
    { icon: Gauge, title: 'Fast calculations', text: 'Results appear as soon as you calculate, right in your browser.' },
    { icon: Layers, title: 'Simple user interface', text: 'One clean layout for every tool, so nothing gets in your way.' },
    { icon: ListChecks, title: 'Transparent breakdowns', text: 'Every result shows its parts and the formula behind it.' },
    { icon: Store, title: 'Built for Indian businesses', text: 'Rupee formatting, GST with CGST/SGST split, and gold purity in karats.' },
    { icon: Smartphone, title: 'Mobile-friendly access', text: 'Works smoothly on phones, tablets and desktops.' },
    { icon: UserX, title: 'Free, no mandatory signup', text: 'Open a calculator and start. No email or account needed.' },
  ]
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="container-page">
        <SectionHeading eyebrow="Why choose CalcDock?" title="Clear answers you can follow">
          CalcDock is designed to show its working, so you understand every number — not just the final one.
        </SectionHeading>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="card p-6">
              <it.icon size={22} className="text-blue-600 dark:text-blue-400" />
              <h3 className="mt-4 font-semibold text-ink dark:text-white">{it.title}</h3>
              <p className="muted mt-1.5 text-sm leading-6">{it.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <ShieldCheck size={14} /> Results depend on the values you enter and are estimates, not financial or tax advice.
        </p>
      </div>
    </section>
  )
}

function BlogPreview() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Learn</p>
            <h2 className="section-title mt-3">Guides from the CalcDock blog</h2>
          </div>
          <Link to="/blog" className="btn-secondary self-start sm:self-auto">
            All articles <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {BLOG_POSTS.slice(0, 3).map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="card card-hover group flex flex-col p-6">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{p.category}</span>
              <h3 className="mt-2 text-lg font-semibold text-ink group-hover:text-blue-600 dark:text-white">{p.title}</h3>
              <p className="muted mt-2 flex-1 text-sm leading-6">{p.description}</p>
              <span className="mt-4 text-xs text-slate-500">{p.readMinutes} min read</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="pb-20 sm:pb-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center sm:px-12 dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-blue-600/30 blur-3xl" />
          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to make your next decision simpler?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-slate-300">{CALCULATORS.length} free calculators, ready when you are. No signup, no clutter.</p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/calculators" className="btn-primary !px-6 !py-3">
              Explore Calculators <ArrowRight size={16} />
            </Link>
            <Link to="/jewellery" className="btn !border !border-white/20 !px-6 !py-3 text-white hover:bg-white/10">
              Try the Jewellery Calculator
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
