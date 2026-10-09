import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, Clock, FileDown, History, SlidersHorizontal, Sparkles, Wrench, Zap } from 'lucide-react'
import { PageHero } from '@/components/PageHero'
import { FreeVsPro, PRO_FEATURES } from '@/components/FreeVsPro'
import { submitNetlifyForm } from '@/lib/forms'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/pro')({
  head: () =>
    seo({
      title: 'CalcDock Pro — Coming Soon',
      description:
        'CalcDock Pro is in development: advanced calculators, saved history, exportable reports, custom presets and extra business tools. Join the waitlist.',
      path: '/pro',
    }),
  component: Pro,
})

const PLANNED = [
  { icon: Zap, title: 'Advanced calculators', text: 'Deeper tools such as amortisation schedules, multi-item invoices and inventory costing.' },
  { icon: History, title: 'Saved calculation history', text: 'Keep a record of past calculations and revisit them any time.' },
  { icon: FileDown, title: 'Exportable reports', text: 'Download clean summaries to share with customers, partners or your accountant.' },
  { icon: SlidersHorizontal, title: 'Custom calculation presets', text: 'Save your usual GST rate, making charges or margin targets as one-click presets.' },
  { icon: Wrench, title: 'Additional business tools', text: 'More tools for pricing, cash flow and day-to-day shop management.' },
]

function Pro() {
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState(PRO_FEATURES[1])
  const [bot, setBot] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setStatus('sending')
    try {
      await submitNetlifyForm('pro-waitlist', { email: email.trim(), interest, 'bot-field': bot })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <PageHero eyebrow="CalcDock Pro" title="More power for people who calculate every day.">
        <span className="badge mb-4 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <Clock size={12} /> Coming Soon — not yet available for purchase
        </span>
        <br />
        Pro is being built for shop owners, jewellers, accountants and freelancers who need more than one-off answers. All current calculators stay
        free.
      </PageHero>

      <section className="container-page py-16">
        <h2 className="section-title">What we're planning</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLANNED.map((p) => (
            <div key={p.title} className="card p-6">
              <div className="flex items-center justify-between">
                <p.icon size={22} className="text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Coming soon</span>
              </div>
              <h3 className="mt-4 font-semibold text-ink dark:text-white">{p.title}</h3>
              <p className="muted mt-1.5 text-sm leading-6">{p.text}</p>
            </div>
          ))}

          <div className="card border-blue-200 p-6 dark:border-blue-500/30" id="waitlist">
            {status === 'sent' ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <CheckCircle2 size={36} className="text-emerald-600" />
                <p className="mt-3 font-semibold text-ink dark:text-white">You're on the list</p>
                <p className="muted mt-1 text-sm">We'll email you when Pro is ready. No spam.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <Sparkles size={22} className="text-blue-600" />
                <h3 className="mt-4 font-semibold text-ink dark:text-white">Join the waitlist</h3>
                <p className="muted mt-1.5 text-sm">Optional — be the first to hear when Pro launches.</p>
                <input type="hidden" name="form-name" value="pro-waitlist" />
                <input className="hidden" name="bot-field" value={bot} onChange={(e) => setBot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <label htmlFor="wl-email" className="label mt-4">
                  Email address
                </label>
                <input id="wl-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={!!error} />
                {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
                <label htmlFor="wl-interest" className="label mt-3">
                  Most wanted feature
                </label>
                <select id="wl-interest" className="input" value={interest} onChange={(e) => setInterest(e.target.value)}>
                  {PRO_FEATURES.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
                {status === 'error' && <p className="mt-2 text-xs text-red-600">Something went wrong. Please try again.</p>}
                <button type="submit" className="btn-primary mt-4 w-full" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Joining…' : 'Notify me'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container-page">
          <h2 className="section-title text-center">Free vs Pro</h2>
          <div className="mx-auto mt-10 max-w-4xl">
            <FreeVsPro showCta={false} />
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-slate-500">
            CalcDock does not currently sell subscriptions or process payments. Pricing will be published before Pro launches.
          </p>
        </div>
      </section>
    </>
  )
}
