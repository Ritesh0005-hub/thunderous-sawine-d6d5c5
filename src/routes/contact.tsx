import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Briefcase, CheckCircle2, LifeBuoy, Mail } from 'lucide-react'
import { PageHero } from '@/components/PageHero'
import { submitNetlifyForm } from '@/lib/forms'
import { BUSINESS_EMAIL, SUPPORT_EMAIL } from '@/lib/site'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  head: () =>
    seo({
      title: 'Contact CalcDock',
      description: 'Get in touch with CalcDock for support, feedback, calculator suggestions or business enquiries.',
      path: '/contact',
    }),
  component: Contact,
})

const TOPICS = ['General question', 'Support', 'Business enquiry', 'Calculator suggestion', 'Feedback']
const EMPTY = { name: '', email: '', topic: TOPICS[0], company: '', message: '', 'bot-field': '' }

function Contact() {
  const [fields, setFields] = useState(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields({ ...fields, [k]: e.target.value })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!fields.name.trim()) errs.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errs.email = 'Please enter a valid email address.'
    if (fields.message.trim().length < 10) errs.message = 'Please write at least 10 characters.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('sending')
    try {
      await submitNetlifyForm('contact', fields)
      setStatus('sent')
      setFields(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <PageHero eyebrow="Contact" title="We'd love to hear from you.">
        Questions, feedback, a calculator you'd like us to build, or a business enquiry — send us a message and we'll get back to you.
      </PageHero>

      <div className="container-page grid gap-8 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6 sm:p-8">
          {status === 'sent' ? (
            <div className="flex flex-col items-center py-12 text-center">
              <CheckCircle2 size={44} className="text-emerald-600" />
              <h2 className="mt-4 text-xl font-semibold text-ink dark:text-white">Message sent</h2>
              <p className="muted mt-2 max-w-sm">Thanks for reaching out. We've received your message and will reply by email.</p>
              <button type="button" className="btn-secondary mt-6" onClick={() => setStatus('idle')}>
                Send another message
              </button>
            </div>
          ) : (
            <form name="contact" onSubmit={onSubmit} noValidate className="space-y-5">
              <h2 className="text-lg font-semibold text-ink dark:text-white">Send a message</h2>
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>
                  Don't fill this out: <input name="bot-field" value={fields['bot-field']} onChange={set('bot-field')} tabIndex={-1} autoComplete="off" />
                </label>
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Your name" error={errors.name}>
                  <input id="name" name="name" className="input" value={fields.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />
                </Field>
                <Field id="email" label="Email address" error={errors.email}>
                  <input id="email" name="email" type="email" className="input" value={fields.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} />
                </Field>
                <Field id="topic" label="Topic">
                  <select id="topic" name="topic" className="input" value={fields.topic} onChange={set('topic')}>
                    {TOPICS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field id="company" label="Company (optional)">
                  <input id="company" name="company" className="input" value={fields.company} onChange={set('company')} autoComplete="organization" />
                </Field>
              </div>
              <Field id="message" label="Message" error={errors.message}>
                <textarea id="message" name="message" rows={6} className="input resize-y" value={fields.message} onChange={set('message')} aria-invalid={!!errors.message} />
              </Field>
              {status === 'error' && (
                <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  Something went wrong sending your message. Please try again, or email us at {SUPPORT_EMAIL}.
                </p>
              )}
              <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-5">
          <InfoCard icon={LifeBuoy} title="Support">
            Need help with a calculator or found something that looks wrong? Email us at{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              {SUPPORT_EMAIL}
            </a>
            .
          </InfoCard>
          <InfoCard icon={Briefcase} title="Business enquiries">
            Interested in partnerships, custom calculators for your business, or embedding CalcDock tools? Choose “Business enquiry” in the form or write
            to{' '}
            <a href={`mailto:${BUSINESS_EMAIL}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              {BUSINESS_EMAIL}
            </a>
            .
          </InfoCard>
          <InfoCard icon={Mail} title="Response times">
            We read every message and aim to reply as soon as we can. Please don't include sensitive personal or financial information.
          </InfoCard>
        </aside>
      </div>
    </>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

function InfoCard({ icon: Icon, title, children }: { icon: typeof Mail; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Icon size={19} />
        </span>
        <h2 className="font-semibold text-ink dark:text-white">{title}</h2>
      </div>
      <p className="muted mt-3 text-sm leading-6">{children}</p>
    </div>
  )
}
