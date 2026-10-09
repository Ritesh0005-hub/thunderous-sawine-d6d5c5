import { useId, useMemo, useState } from 'react'
import { AlertCircle, Check, Copy, Info, RotateCcw } from 'lucide-react'
import type { CalcOutput, CalculatorDef, FieldDef, ResultTone, Values } from '@/lib/calculators'
import { parseNumber } from '@/lib/format'

type Raw = Record<string, string>

const SPLIT_COLORS = ['bg-blue-600', 'bg-sky-400', 'bg-amber-400', 'bg-emerald-500']

const toneText: Record<ResultTone, string> = {
  positive: 'text-emerald-600 dark:text-emerald-400',
  negative: 'text-red-600 dark:text-red-400',
  neutral: 'text-ink dark:text-white',
  primary: 'text-blue-600 dark:text-blue-400',
}

function initialValues(def: CalculatorDef): Raw {
  return Object.fromEntries(def.fields.map((f) => [f.name, f.defaultValue ?? (f.type === 'select' ? f.options?.[0]?.value ?? '' : '')]))
}

function visible(f: FieldDef, raw: Raw) {
  return !f.showIf || f.showIf(raw)
}

function validate(def: CalculatorDef, raw: Raw) {
  const errors: Record<string, string> = {}
  const parsed: Values = {}
  for (const f of def.fields) {
    if (!visible(f, raw)) continue
    if (f.type === 'select') {
      parsed[f.name] = raw[f.name]
      continue
    }
    const text = raw[f.name]?.trim() ?? ''
    if (text === '') {
      if (f.optional) parsed[f.name] = null
      else errors[f.name] = 'Please enter a value.'
      continue
    }
    const value = parseNumber(text)
    if (value === null) errors[f.name] = 'Please enter a valid number.'
    else if (f.integer && !Number.isInteger(value)) errors[f.name] = 'Please enter a whole number.'
    else if (f.min !== undefined && (f.exclusiveMin ? value <= f.min : value < f.min))
      errors[f.name] = f.exclusiveMin ? `Must be greater than ${f.min}.` : `Must be at least ${f.min}.`
    else if (f.max !== undefined && (f.exclusiveMax ? value >= f.max : value > f.max))
      errors[f.name] = f.exclusiveMax ? `Must be less than ${f.max}.` : `Must be ${f.max} or less.`
    else parsed[f.name] = value
  }
  return { errors, parsed }
}

/** Making-charge input prefix/suffix depends on the chosen charge type. */
function adornments(f: FieldDef, raw: Raw) {
  if (f.name === 'makingValue' && raw.makingType) {
    if (raw.makingType === 'percent') return { prefix: undefined, suffix: '%' }
    if (raw.makingType === 'perGram') return { prefix: '₹', suffix: '/ g' }
    return { prefix: '₹', suffix: undefined }
  }
  return { prefix: f.prefix, suffix: f.suffix }
}

export function Calculator({ def, headingLevel = 2 }: { def: CalculatorDef; headingLevel?: 2 | 3 }) {
  const uid = useId()
  const initial = useMemo(() => initialValues(def), [def])
  const [raw, setRaw] = useState<Raw>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [output, setOutput] = useState<CalcOutput | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  const run = (next: Raw) => {
    const { errors: errs, parsed } = validate(def, next)
    setErrors(errs)
    setOutput(Object.keys(errs).length ? null : def.compute(parsed))
  }

  const update = (name: string, value: string) => {
    const next = { ...raw, [name]: value }
    setRaw(next)
    setCopied(false)
    // After the first calculation, keep results in sync as the user edits.
    if (submitted) run(next)
  }

  const reset = () => {
    setRaw(initial)
    setErrors({})
    setOutput(null)
    setSubmitted(false)
    setCopied(false)
  }

  const copy = async () => {
    if (!output?.ok) return
    const inputs = def.fields
      .filter((f) => visible(f, raw) && raw[f.name] !== '')
      .map((f) => {
        const val = f.type === 'select' ? f.options?.find((o) => o.value === raw[f.name])?.label : raw[f.name]
        const { prefix, suffix } = adornments(f, raw)
        return `${f.label}: ${prefix ?? ''}${val}${suffix ? ` ${suffix}` : ''}`
      })
    const text = [
      `${def.name} — CalcDock`,
      '',
      'Inputs',
      ...inputs,
      '',
      'Results',
      ...output.results.map((r) => `${r.label}: ${r.value}`),
      '',
      output.summary,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const H = headingLevel === 2 ? 'h2' : 'h3'
  const Icon = def.icon
  const splitTotal = output?.ok && output.split ? output.split.reduce((a, b) => a + Math.max(0, b.value), 0) : 0

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      {/* Inputs */}
      <form
        className="card p-5 sm:p-7"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
          run(raw)
        }}
        aria-labelledby={`${uid}-title`}
      >
        <div className="mb-6 flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <Icon size={22} />
          </span>
          <div>
            <H id={`${uid}-title`} className="text-lg font-semibold text-ink dark:text-white">
              {def.name}
            </H>
            <p className="muted mt-0.5 text-sm">{def.description}</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {def.fields
            .filter((f) => visible(f, raw))
            .map((f) => {
              const id = `${uid}-${f.name}`
              const err = errors[f.name]
              const { prefix, suffix } = adornments(f, raw)
              const describedBy = [f.help ? `${id}-help` : '', err ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined
              const wide = f.type === 'select' && (f.options?.some((o) => o.label.length > 22) ?? false)
              return (
                <div key={f.name} className={wide ? 'sm:col-span-2' : ''}>
                  <label htmlFor={id} className="label">
                    {f.label}
                  </label>
                  {f.type === 'select' ? (
                    <select id={id} className="input appearance-auto" value={raw[f.name]} onChange={(e) => update(f.name, e.target.value)}>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="relative">
                      {prefix && (
                        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-slate-400">{prefix}</span>
                      )}
                      <input
                        id={id}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        className={`input ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-12' : ''} ${err ? '!border-red-400 focus:!ring-red-500/10' : ''}`}
                        placeholder={f.placeholder}
                        value={raw[f.name]}
                        onChange={(e) => update(f.name, e.target.value)}
                        aria-invalid={!!err}
                        aria-describedby={describedBy}
                        aria-required={!f.optional}
                      />
                      {suffix && (
                        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-slate-400">{suffix}</span>
                      )}
                    </div>
                  )}
                  {f.presets && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {f.presets.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => update(f.name, String(p))}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                            raw[f.name] === String(p)
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {p}
                          {f.suffix === '%' ? '%' : ''}
                        </button>
                      ))}
                    </div>
                  )}
                  {err ? (
                    <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                      {err}
                    </p>
                  ) : (
                    f.help && (
                      <p id={`${id}-help`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                        {f.help}
                      </p>
                    )
                  )}
                </div>
              )
            })}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button type="submit" className="btn-primary flex-1 sm:flex-none">
            Calculate
          </button>
          <button type="button" onClick={reset} className="btn-secondary">
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </form>

      {/* Results */}
      <section className="card flex flex-col p-5 sm:p-7 lg:sticky lg:top-24 lg:self-start" aria-live="polite" aria-label={`${def.name} results`}>
        {!output && (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Icon size={22} />
            </span>
            <p className="mt-4 font-medium text-ink dark:text-white">Your results appear here</p>
            <p className="muted mt-1 max-w-xs text-sm">
              {Object.keys(errors).length ? 'Fix the highlighted fields to see your result.' : 'Enter your values and press Calculate.'}
            </p>
          </div>
        )}

        {output && !output.ok && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{output.error}</p>
          </div>
        )}

        {output?.ok && (
          <>
            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/60">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{output.headline.label}</p>
              <p className={`mt-1 text-3xl font-bold tracking-tight tabular-nums sm:text-4xl ${toneText[output.headline.tone ?? 'neutral']}`}>
                {output.headline.value}
              </p>
            </div>

            {output.split && splitTotal > 0 && (
              <div className="mt-5">
                <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  {output.split.map((p, i) => (
                    <div key={p.label} className={SPLIT_COLORS[i % SPLIT_COLORS.length]} style={{ width: `${(Math.max(0, p.value) / splitTotal) * 100}%` }} />
                  ))}
                </div>
                <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  {output.split.map((p, i) => (
                    <li key={p.label} className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${SPLIT_COLORS[i % SPLIT_COLORS.length]}`} />
                      {p.label} {((Math.max(0, p.value) / splitTotal) * 100).toFixed(1)}%
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <dl className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
              {output.results.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-slate-600 dark:text-slate-400">
                    {r.label}
                    {r.hint && <span className="ml-1.5 text-xs text-slate-400">({r.hint})</span>}
                  </dt>
                  <dd className={`text-right font-semibold tabular-nums ${toneText[r.tone ?? 'neutral']}`}>{r.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm leading-6 text-slate-700 dark:border-blue-500/20 dark:bg-blue-500/5 dark:text-slate-300">
              {output.summary}
            </p>

            <button type="button" onClick={copy} className="btn-secondary mt-5 w-full">
              {copied ? (
                <>
                  <Check size={15} className="text-emerald-600" /> Copied to clipboard
                </>
              ) : (
                <>
                  <Copy size={15} /> Copy results
                </>
              )}
            </button>
          </>
        )}

        {def.note && (
          <p className="mt-5 flex gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            <Info size={14} className="mt-0.5 shrink-0" />
            {def.note}
          </p>
        )}
      </section>
    </div>
  )
}

export function FormulaPanel({ def }: { def: CalculatorDef }) {
  return (
    <div className="card p-5 sm:p-7">
      <h2 className="text-base font-semibold text-ink dark:text-white">How this is calculated</h2>
      <ul className="mt-4 space-y-2.5">
        {def.formula.map((line) => (
          <li key={line} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
