import type { LucideIcon } from 'lucide-react'
import {
  ArrowUpDown,
  BadgeIndianRupee,
  BadgePercent,
  Calculator as CalculatorIcon,
  Coins,
  Gem,
  Landmark,
  LineChart,
  PiggyBank,
  Receipt,
  Scale,
  Tag,
  Target,
  TrendingUp,
  Wallet,
  Percent,
} from 'lucide-react'
import { formatINR, formatNumber, formatPercent } from './format'

export type CategoryId = 'jewellery' | 'business' | 'finance' | 'everyday'

export const CATEGORIES: Record<
  CategoryId,
  { id: CategoryId; name: string; path: '/jewellery' | '/business' | '/finance' | '/calculators'; description: string }
> = {
  jewellery: {
    id: 'jewellery',
    name: 'Jewellery',
    path: '/jewellery',
    description: 'Gold value and jewellery price estimates with making charges, wastage and GST.',
  },
  business: {
    id: 'business',
    name: 'Business',
    path: '/business',
    description: 'Pricing, margins, GST, break-even and profit tools for shops and small businesses.',
  },
  finance: {
    id: 'finance',
    name: 'Finance',
    path: '/finance',
    description: 'Loans, interest, savings goals and percentage change for personal finance.',
  },
  everyday: {
    id: 'everyday',
    name: 'Everyday',
    path: '/calculators',
    description: 'Quick percentage and discount maths for daily decisions.',
  },
}

export type FieldOption = { value: string; label: string }

export type FieldDef = {
  name: string
  label: string
  type: 'number' | 'select'
  prefix?: string
  suffix?: string
  placeholder?: string
  help?: string
  min?: number
  max?: number
  /** Require the value to be strictly greater than `min`. */
  exclusiveMin?: boolean
  /** Require the value to be strictly less than `max`. */
  exclusiveMax?: boolean
  integer?: boolean
  optional?: boolean
  options?: FieldOption[]
  defaultValue?: string
  /** Quick-pick chips that fill in the value. */
  presets?: number[]
  showIf?: (values: Record<string, string>) => boolean
}

export type ResultTone = 'positive' | 'negative' | 'neutral' | 'primary'

export type ResultItem = {
  label: string
  value: string
  tone?: ResultTone
  hint?: string
}

export type CalcOutput =
  | {
      ok: true
      /** Main headline result. */
      headline: ResultItem
      results: ResultItem[]
      /** Plain-language explanation of the result. */
      summary: string
      /** Optional proportional bar, e.g. principal vs interest. */
      split?: { label: string; value: number }[]
    }
  | { ok: false; error: string }

export type Values = Record<string, number | string | null>

export type CalculatorDef = {
  slug: string
  name: string
  category: CategoryId
  /** Extra category pages this calculator is listed on. */
  alsoIn?: CategoryId[]
  description: string
  keywords: string[]
  icon: LucideIcon
  popular?: boolean
  fields: FieldDef[]
  formula: string[]
  note?: string
  compute: (v: Values) => CalcOutput
}

const n = (v: Values, k: string) => (typeof v[k] === 'number' ? (v[k] as number) : 0)
const s = (v: Values, k: string) => String(v[k] ?? '')

const fail = (error: string): CalcOutput => ({ ok: false, error })

const PURITY_OPTIONS: FieldOption[] = [
  { value: '24', label: '24K (999)' },
  { value: '22', label: '22K (916)' },
  { value: '18', label: '18K (750)' },
  { value: '14', label: '14K (585)' },
]

/** Standard hallmark fineness relative to 24K. */
export const PURITY_FACTOR: Record<string, number> = {
  '24': 1,
  '22': 0.916,
  '18': 0.75,
  '14': 0.585,
}

/* ------------------------------------------------------------------ */
/* Shared compute helpers (also used for the homepage sample results) */
/* ------------------------------------------------------------------ */

export function computeEmi(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12 / 100
  const emi = r === 0 ? principal / months : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1)
  const total = emi * months
  return { emi, total, interest: total - principal }
}

export function computeJewellery(input: {
  weight: number
  rate: number
  purity: string
  rateBasis: string
  makingType: string
  makingValue: number
  wastage: number
  gst: number
}) {
  const factor = PURITY_FACTOR[input.purity] ?? 1
  const effectiveRate = input.rateBasis === '24k' ? input.rate * factor : input.rate
  const base = input.weight * effectiveRate
  const wastage = (base * input.wastage) / 100
  const making =
    input.makingType === 'percent'
      ? (base * input.makingValue) / 100
      : input.makingType === 'perGram'
        ? input.weight * input.makingValue
        : input.makingValue
  const taxable = base + wastage + making
  const gst = (taxable * input.gst) / 100
  return { effectiveRate, base, wastage, making, taxable, gst, total: taxable + gst }
}

/* ------------------------------------------------------------------ */
/* Calculator definitions                                             */
/* ------------------------------------------------------------------ */

const jewellery: CalculatorDef = {
  slug: 'jewellery-price-calculator',
  name: 'Jewellery Price Calculator',
  category: 'jewellery',
  description:
    'Estimate the final price of gold jewellery with purity, making charges, wastage and GST shown line by line.',
  keywords: ['jewellery', 'jewelry', 'gold', 'making charges', 'wastage', 'necklace', 'ring', 'bangle', 'hallmark'],
  icon: Gem,
  fields: [
    { name: 'purity', label: 'Gold purity', type: 'select', options: PURITY_OPTIONS, defaultValue: '22' },
    { name: 'weight', label: 'Weight', type: 'number', suffix: 'g', placeholder: 'e.g. 10', min: 0, exclusiveMin: true },
    {
      name: 'rate',
      label: 'Gold rate per gram',
      type: 'number',
      prefix: '₹',
      placeholder: "Enter today's rate",
      min: 0,
      exclusiveMin: true,
      help: 'Use the rate quoted by your jeweller or a trusted source for today.',
    },
    {
      name: 'rateBasis',
      label: 'This rate is for',
      type: 'select',
      defaultValue: 'purity',
      options: [
        { value: 'purity', label: 'The selected purity' },
        { value: '24k', label: '24K gold (adjust for purity)' },
      ],
    },
    {
      name: 'makingType',
      label: 'Making charges type',
      type: 'select',
      defaultValue: 'percent',
      options: [
        { value: 'percent', label: 'Percentage of gold value' },
        { value: 'perGram', label: 'Fixed amount per gram' },
        { value: 'fixed', label: 'Fixed total amount' },
      ],
    },
    {
      name: 'makingValue',
      label: 'Making charges',
      type: 'number',
      placeholder: 'e.g. 12',
      min: 0,
      defaultValue: '',
    },
    {
      name: 'wastage',
      label: 'Wastage',
      type: 'number',
      suffix: '%',
      placeholder: 'e.g. 2',
      min: 0,
      max: 100,
      optional: true,
      help: 'Leave empty if your jeweller does not charge wastage.',
    },
    { name: 'gst', label: 'GST', type: 'number', suffix: '%', min: 0, max: 100, defaultValue: '3', presets: [3] },
  ],
  formula: [
    'Gold rate used = rate (or 24K rate × purity fineness, e.g. 0.916 for 22K)',
    'Base gold value = weight × gold rate used',
    'Wastage = base gold value × wastage %',
    'Making charges = % of base value, per-gram amount × weight, or a fixed amount',
    'GST = (base value + wastage + making charges) × GST %',
    'Final price = base value + wastage + making charges + GST',
  ],
  note:
    "This is an estimate based on the rates and charges you enter. A jeweller's final invoice may differ — for example, some jewellers apply different GST rates to gold and to making charges, or add stone and hallmarking charges.",
  compute: (v) => {
    const weight = n(v, 'weight')
    const r = computeJewellery({
      weight,
      rate: n(v, 'rate'),
      purity: s(v, 'purity'),
      rateBasis: s(v, 'rateBasis'),
      makingType: s(v, 'makingType'),
      makingValue: n(v, 'makingValue'),
      wastage: n(v, 'wastage'),
      gst: n(v, 'gst'),
    })
    return {
      ok: true,
      headline: { label: 'Final estimated price', value: formatINR(r.total), tone: 'primary' },
      results: [
        { label: 'Gold rate used', value: `${formatINR(r.effectiveRate)} / g`, hint: `${s(v, 'purity')}K purity` },
        { label: 'Base gold value', value: formatINR(r.base) },
        { label: 'Making charges', value: formatINR(r.making) },
        { label: 'Wastage amount', value: formatINR(r.wastage) },
        { label: 'Value before GST', value: formatINR(r.taxable) },
        { label: 'GST amount', value: formatINR(r.gst) },
        { label: 'Final estimated price', value: formatINR(r.total), tone: 'primary' },
      ],
      summary: `For ${formatNumber(weight, 3)} g of ${s(v, 'purity')}K gold, the gold itself is worth ${formatINR(r.base)}. Making charges, wastage and GST add ${formatINR(r.total - r.base)}, bringing the estimated price to ${formatINR(r.total)}.`,
      split: [
        { label: 'Gold value', value: r.base },
        { label: 'Making', value: r.making },
        { label: 'Wastage', value: r.wastage },
        { label: 'GST', value: r.gst },
      ],
    }
  },
}

const goldPrice: CalculatorDef = {
  slug: 'gold-price-calculator',
  name: 'Gold Price Calculator',
  category: 'jewellery',
  description: 'Convert a 24K gold rate into the value of 22K, 18K or 14K gold for any weight.',
  keywords: ['gold', 'gold rate', '22k', '24k', '18k', 'karat', 'carat', 'purity', 'bullion'],
  icon: Coins,
  popular: true,
  fields: [
    {
      name: 'rate24',
      label: '24K gold rate per gram',
      type: 'number',
      prefix: '₹',
      placeholder: "Enter today's 24K rate",
      min: 0,
      exclusiveMin: true,
    },
    { name: 'purity', label: 'Gold purity', type: 'select', options: PURITY_OPTIONS, defaultValue: '22' },
    { name: 'weight', label: 'Weight', type: 'number', suffix: 'g', placeholder: 'e.g. 10', min: 0, exclusiveMin: true },
  ],
  formula: [
    'Purity-adjusted rate = 24K rate × fineness (24K = 1, 22K = 0.916, 18K = 0.750, 14K = 0.585)',
    'Gold value = weight × purity-adjusted rate',
    'Pure gold content = weight × fineness',
  ],
  note: 'Shows the metal value only. Making charges, wastage and GST are covered by the Jewellery Price Calculator.',
  compute: (v) => {
    const factor = PURITY_FACTOR[s(v, 'purity')] ?? 1
    const rate = n(v, 'rate24') * factor
    const weight = n(v, 'weight')
    const value = rate * weight
    return {
      ok: true,
      headline: { label: 'Gold value', value: formatINR(value), tone: 'primary' },
      results: [
        { label: 'Purity-adjusted rate', value: `${formatINR(rate)} / g` },
        { label: 'Fineness', value: formatPercent(factor * 100, 1) },
        { label: 'Pure gold content', value: `${formatNumber(weight * factor, 3)} g` },
        { label: 'Gold value', value: formatINR(value), tone: 'primary' },
      ],
      summary: `${formatNumber(weight, 3)} g of ${s(v, 'purity')}K gold contains about ${formatNumber(weight * factor, 3)} g of pure gold, worth ${formatINR(value)} at the rate you entered.`,
    }
  },
}

const gst: CalculatorDef = {
  slug: 'gst-calculator',
  name: 'GST Calculator',
  category: 'business',
  description: 'Add GST to a price or extract GST from an inclusive amount, with CGST and SGST split.',
  keywords: ['gst', 'tax', 'sales tax', 'cgst', 'sgst', 'igst', 'invoice', 'inclusive', 'exclusive'],
  icon: Receipt,
  popular: true,
  fields: [
    {
      name: 'mode',
      label: 'Calculation type',
      type: 'select',
      defaultValue: 'add',
      options: [
        { value: 'add', label: 'Add GST (price excludes GST)' },
        { value: 'remove', label: 'Remove GST (price includes GST)' },
      ],
    },
    { name: 'amount', label: 'Amount', type: 'number', prefix: '₹', placeholder: 'e.g. 10,000', min: 0, exclusiveMin: true },
    {
      name: 'rate',
      label: 'GST rate',
      type: 'number',
      suffix: '%',
      min: 0,
      max: 100,
      defaultValue: '18',
      presets: [3, 5, 18, 40],
      help: 'GST rates change from time to time — confirm the rate that applies to your item.',
    },
  ],
  formula: [
    'Add GST: GST = amount × rate ÷ 100; total = amount + GST',
    'Remove GST: net amount = amount × 100 ÷ (100 + rate); GST = amount − net amount',
    'For intra-state supply, GST is split equally into CGST and SGST',
  ],
  compute: (v) => {
    const amount = n(v, 'amount')
    const rate = n(v, 'rate')
    const add = s(v, 'mode') === 'add'
    const net = add ? amount : (amount * 100) / (100 + rate)
    const tax = add ? (amount * rate) / 100 : amount - net
    const total = net + tax
    return {
      ok: true,
      headline: { label: add ? 'Total incl. GST' : 'Net amount (excl. GST)', value: formatINR(add ? total : net), tone: 'primary' },
      results: [
        { label: 'Net amount', value: formatINR(net) },
        { label: `GST @ ${formatPercent(rate)}`, value: formatINR(tax) },
        { label: 'CGST', value: formatINR(tax / 2), hint: `${formatPercent(rate / 2)}` },
        { label: 'SGST', value: formatINR(tax / 2), hint: `${formatPercent(rate / 2)}` },
        { label: 'Total amount', value: formatINR(total), tone: 'primary' },
      ],
      summary: add
        ? `Adding ${formatPercent(rate)} GST to ${formatINR(amount)} adds ${formatINR(tax)}, so the customer pays ${formatINR(total)}.`
        : `${formatINR(amount)} includes ${formatINR(tax)} of GST at ${formatPercent(rate)}. The price before tax is ${formatINR(net)}.`,
      split: [
        { label: 'Net amount', value: net },
        { label: 'GST', value: tax },
      ],
    }
  },
}

const profitMargin: CalculatorDef = {
  slug: 'profit-margin-calculator',
  name: 'Profit Margin Calculator',
  category: 'business',
  description: 'Find your profit, profit margin and markup from cost price and selling price.',
  keywords: ['profit', 'margin', 'gross margin', 'selling price', 'cost price', 'markup'],
  icon: TrendingUp,
  popular: true,
  fields: [
    { name: 'cost', label: 'Cost price', type: 'number', prefix: '₹', placeholder: 'e.g. 800', min: 0 },
    { name: 'price', label: 'Selling price', type: 'number', prefix: '₹', placeholder: 'e.g. 1,000', min: 0, exclusiveMin: true },
  ],
  formula: ['Profit = selling price − cost price', 'Profit margin = profit ÷ selling price × 100', 'Markup = profit ÷ cost price × 100'],
  compute: (v) => {
    const cost = n(v, 'cost')
    const price = n(v, 'price')
    const profit = price - cost
    const margin = (profit / price) * 100
    const markup = cost > 0 ? (profit / cost) * 100 : NaN
    const loss = profit < 0
    return {
      ok: true,
      headline: { label: 'Profit margin', value: formatPercent(margin), tone: loss ? 'negative' : 'positive' },
      results: [
        { label: loss ? 'Loss per unit' : 'Profit per unit', value: formatINR(Math.abs(profit)), tone: loss ? 'negative' : 'positive' },
        { label: 'Profit margin', value: formatPercent(margin), tone: loss ? 'negative' : 'positive' },
        { label: 'Markup on cost', value: cost > 0 ? formatPercent(markup) : 'Not defined (cost is 0)' },
      ],
      summary: loss
        ? `You are selling below cost and lose ${formatINR(-profit)} on each unit.`
        : `You keep ${formatINR(profit)} from every ${formatINR(price)} sale — that is ${formatPercent(margin)} of the selling price.`,
    }
  },
}

const discount: CalculatorDef = {
  slug: 'discount-calculator',
  name: 'Discount Calculator',
  category: 'everyday',
  alsoIn: ['business'],
  description: 'See the final price and how much you save, including an optional second discount.',
  keywords: ['discount', 'sale', 'offer', 'off', 'price after discount', 'savings'],
  icon: Tag,
  popular: true,
  fields: [
    { name: 'price', label: 'Original price', type: 'number', prefix: '₹', placeholder: 'e.g. 2,499', min: 0, exclusiveMin: true },
    { name: 'disc', label: 'Discount', type: 'number', suffix: '%', placeholder: 'e.g. 20', min: 0, max: 100, presets: [10, 20, 25, 50] },
    {
      name: 'extra',
      label: 'Additional discount (optional)',
      type: 'number',
      suffix: '%',
      placeholder: 'e.g. 10',
      min: 0,
      max: 100,
      optional: true,
      help: 'Applied on the already-discounted price, like "extra 10% off".',
    },
  ],
  formula: [
    'Price after discount = original price × (1 − discount ÷ 100)',
    'Additional discounts are applied one after another, not added together',
    'You save = original price − final price',
  ],
  compute: (v) => {
    const price = n(v, 'price')
    const final = price * (1 - n(v, 'disc') / 100) * (1 - n(v, 'extra') / 100)
    const saved = price - final
    const effective = (saved / price) * 100
    return {
      ok: true,
      headline: { label: 'Final price', value: formatINR(final), tone: 'primary' },
      results: [
        { label: 'Original price', value: formatINR(price) },
        { label: 'You save', value: formatINR(saved), tone: 'positive' },
        { label: 'Effective discount', value: formatPercent(effective) },
        { label: 'Final price', value: formatINR(final), tone: 'primary' },
      ],
      summary: `You pay ${formatINR(final)} instead of ${formatINR(price)}, saving ${formatINR(saved)} (${formatPercent(effective)} overall).`,
    }
  },
}

const percentage: CalculatorDef = {
  slug: 'percentage-calculator',
  name: 'Percentage Calculator',
  category: 'everyday',
  description: 'Work out X% of a number, what percent one number is of another, or increase/decrease by a percent.',
  keywords: ['percent', 'percentage', 'marks', 'ratio', 'increase', 'decrease', 'of'],
  icon: Percent,
  popular: true,
  fields: [
    {
      name: 'mode',
      label: 'What do you want to find?',
      type: 'select',
      defaultValue: 'of',
      options: [
        { value: 'of', label: 'What is X% of Y?' },
        { value: 'what', label: 'X is what % of Y?' },
        { value: 'adjust', label: 'Increase or decrease Y by X%' },
      ],
    },
    { name: 'p1', label: 'Percentage (X)', type: 'number', suffix: '%', placeholder: 'e.g. 15', showIf: (x) => x.mode === 'of' },
    { name: 'b1', label: 'Number (Y)', type: 'number', placeholder: 'e.g. 2,400', showIf: (x) => x.mode === 'of' },
    { name: 'part', label: 'Value (X)', type: 'number', placeholder: 'e.g. 432', showIf: (x) => x.mode === 'what' },
    { name: 'whole', label: 'Total (Y)', type: 'number', placeholder: 'e.g. 500', showIf: (x) => x.mode === 'what' },
    { name: 'b3', label: 'Starting number (Y)', type: 'number', placeholder: 'e.g. 1,200', showIf: (x) => x.mode === 'adjust' },
    { name: 'p3', label: 'Percentage (X)', type: 'number', suffix: '%', placeholder: 'e.g. 8', min: 0, showIf: (x) => x.mode === 'adjust' },
    {
      name: 'dir',
      label: 'Direction',
      type: 'select',
      defaultValue: 'up',
      options: [
        { value: 'up', label: 'Increase' },
        { value: 'down', label: 'Decrease' },
      ],
      showIf: (x) => x.mode === 'adjust',
    },
  ],
  formula: ['X% of Y = X ÷ 100 × Y', 'X as a % of Y = X ÷ Y × 100', 'Y increased by X% = Y × (1 + X ÷ 100); decreased = Y × (1 − X ÷ 100)'],
  compute: (v) => {
    const mode = s(v, 'mode')
    if (mode === 'of') {
      const r = (n(v, 'p1') / 100) * n(v, 'b1')
      return {
        ok: true,
        headline: { label: 'Result', value: formatNumber(r, 4), tone: 'primary' },
        results: [{ label: `${formatPercent(n(v, 'p1'))} of ${formatNumber(n(v, 'b1'), 4)}`, value: formatNumber(r, 4), tone: 'primary' }],
        summary: `${formatPercent(n(v, 'p1'))} of ${formatNumber(n(v, 'b1'), 4)} is ${formatNumber(r, 4)}.`,
      }
    }
    if (mode === 'what') {
      const whole = n(v, 'whole')
      if (whole === 0) return fail('The total (Y) cannot be zero.')
      const r = (n(v, 'part') / whole) * 100
      return {
        ok: true,
        headline: { label: 'Percentage', value: formatPercent(r, 4), tone: 'primary' },
        results: [{ label: `${formatNumber(n(v, 'part'), 4)} out of ${formatNumber(whole, 4)}`, value: formatPercent(r, 4), tone: 'primary' }],
        summary: `${formatNumber(n(v, 'part'), 4)} is ${formatPercent(r, 4)} of ${formatNumber(whole, 4)}.`,
      }
    }
    const base = n(v, 'b3')
    const p = n(v, 'p3')
    const up = s(v, 'dir') === 'up'
    const change = (base * p) / 100
    const r = up ? base + change : base - change
    return {
      ok: true,
      headline: { label: 'New value', value: formatNumber(r, 4), tone: 'primary' },
      results: [
        { label: up ? 'Increase' : 'Decrease', value: formatNumber(change, 4) },
        { label: 'New value', value: formatNumber(r, 4), tone: 'primary' },
      ],
      summary: `${formatNumber(base, 4)} ${up ? 'increased' : 'decreased'} by ${formatPercent(p)} is ${formatNumber(r, 4)}.`,
    }
  },
}

const loanEmi: CalculatorDef = {
  slug: 'loan-emi-calculator',
  name: 'Loan EMI Calculator',
  category: 'finance',
  description: 'Calculate the monthly EMI, total interest and total repayment for home, car or personal loans.',
  keywords: ['emi', 'loan', 'home loan', 'car loan', 'personal loan', 'interest', 'installment', 'instalment'],
  icon: Landmark,
  popular: true,
  fields: [
    { name: 'principal', label: 'Loan amount', type: 'number', prefix: '₹', placeholder: 'e.g. 5,00,000', min: 0, exclusiveMin: true },
    { name: 'rate', label: 'Annual interest rate', type: 'number', suffix: '%', placeholder: 'e.g. 9', min: 0, max: 100 },
    { name: 'tenure', label: 'Loan tenure', type: 'number', placeholder: 'e.g. 5', min: 0, exclusiveMin: true },
    {
      name: 'unit',
      label: 'Tenure in',
      type: 'select',
      defaultValue: 'years',
      options: [
        { value: 'years', label: 'Years' },
        { value: 'months', label: 'Months' },
      ],
    },
  ],
  formula: [
    'EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)',
    'P = loan amount, r = annual rate ÷ 12 ÷ 100, n = number of monthly instalments',
    'Total repayment = EMI × n; total interest = total repayment − P',
  ],
  note: 'Uses the standard reducing-balance EMI formula. Lenders may add processing fees, insurance or round EMIs differently.',
  compute: (v) => {
    const months = s(v, 'unit') === 'years' ? n(v, 'tenure') * 12 : n(v, 'tenure')
    if (!Number.isInteger(Math.round(months * 1000) / 1000) || months < 1)
      return fail('Tenure must work out to a whole number of months (at least 1).')
    const principal = n(v, 'principal')
    const r = computeEmi(principal, n(v, 'rate'), months)
    return {
      ok: true,
      headline: { label: 'Monthly EMI', value: formatINR(r.emi), tone: 'primary' },
      results: [
        { label: 'Monthly EMI', value: formatINR(r.emi), tone: 'primary' },
        { label: 'Number of EMIs', value: formatNumber(months, 0) },
        { label: 'Principal amount', value: formatINR(principal) },
        { label: 'Total interest', value: formatINR(r.interest) },
        { label: 'Total repayment', value: formatINR(r.total) },
      ],
      summary: `You pay ${formatINR(r.emi)} every month for ${formatNumber(months, 0)} months. Over the loan, interest adds ${formatINR(r.interest)}, so you repay ${formatINR(r.total)} in total.`,
      split: [
        { label: 'Principal', value: principal },
        { label: 'Interest', value: r.interest },
      ],
    }
  },
}

const simpleInterest: CalculatorDef = {
  slug: 'simple-interest-calculator',
  name: 'Simple Interest Calculator',
  category: 'finance',
  description: 'Calculate simple interest and the total amount for any principal, rate and time period.',
  keywords: ['simple interest', 'si', 'interest', 'principal', 'rate', 'time'],
  icon: Wallet,
  popular: true,
  fields: [
    { name: 'principal', label: 'Principal amount', type: 'number', prefix: '₹', placeholder: 'e.g. 50,000', min: 0, exclusiveMin: true },
    { name: 'rate', label: 'Annual interest rate', type: 'number', suffix: '%', placeholder: 'e.g. 7.5', min: 0, max: 100 },
    { name: 'time', label: 'Time period', type: 'number', placeholder: 'e.g. 3', min: 0, exclusiveMin: true },
    {
      name: 'unit',
      label: 'Time in',
      type: 'select',
      defaultValue: 'years',
      options: [
        { value: 'years', label: 'Years' },
        { value: 'months', label: 'Months' },
      ],
    },
  ],
  formula: ['Simple interest = P × R × T ÷ 100 (T in years)', 'Total amount = P + simple interest'],
  compute: (v) => {
    const p = n(v, 'principal')
    const years = s(v, 'unit') === 'years' ? n(v, 'time') : n(v, 'time') / 12
    const si = (p * n(v, 'rate') * years) / 100
    return {
      ok: true,
      headline: { label: 'Total amount', value: formatINR(p + si), tone: 'primary' },
      results: [
        { label: 'Principal', value: formatINR(p) },
        { label: 'Simple interest', value: formatINR(si), tone: 'positive' },
        { label: 'Total amount', value: formatINR(p + si), tone: 'primary' },
      ],
      summary: `At ${formatPercent(n(v, 'rate'))} a year for ${formatNumber(years, 2)} years, ${formatINR(p)} earns ${formatINR(si)} in simple interest.`,
      split: [
        { label: 'Principal', value: p },
        { label: 'Interest', value: si },
      ],
    }
  },
}

const compoundInterest: CalculatorDef = {
  slug: 'compound-interest-calculator',
  name: 'Compound Interest Calculator',
  category: 'finance',
  description: 'See how money grows with compounding — yearly, half-yearly, quarterly or monthly.',
  keywords: ['compound interest', 'ci', 'fd', 'fixed deposit', 'growth', 'compounding', 'investment'],
  icon: LineChart,
  popular: true,
  fields: [
    { name: 'principal', label: 'Principal amount', type: 'number', prefix: '₹', placeholder: 'e.g. 1,00,000', min: 0, exclusiveMin: true },
    { name: 'rate', label: 'Annual interest rate', type: 'number', suffix: '%', placeholder: 'e.g. 7', min: 0, max: 100 },
    { name: 'years', label: 'Time period', type: 'number', suffix: 'years', placeholder: 'e.g. 5', min: 0, exclusiveMin: true, max: 100 },
    {
      name: 'freq',
      label: 'Compounding frequency',
      type: 'select',
      defaultValue: '4',
      options: [
        { value: '1', label: 'Yearly' },
        { value: '2', label: 'Half-yearly' },
        { value: '4', label: 'Quarterly' },
        { value: '12', label: 'Monthly' },
      ],
    },
  ],
  formula: ['Maturity amount A = P × (1 + r ÷ n)^(n × t)', 'r = annual rate ÷ 100, n = compounding periods per year, t = years', 'Compound interest = A − P'],
  note: 'Assumes a constant rate and no withdrawals or taxes.',
  compute: (v) => {
    const p = n(v, 'principal')
    const r = n(v, 'rate') / 100
    const f = Number(s(v, 'freq')) || 1
    const t = n(v, 'years')
    const a = p * (1 + r / f) ** (f * t)
    const effective = ((1 + r / f) ** f - 1) * 100
    return {
      ok: true,
      headline: { label: 'Maturity amount', value: formatINR(a), tone: 'primary' },
      results: [
        { label: 'Principal', value: formatINR(p) },
        { label: 'Compound interest', value: formatINR(a - p), tone: 'positive' },
        { label: 'Effective annual rate', value: formatPercent(effective, 3) },
        { label: 'Maturity amount', value: formatINR(a), tone: 'primary' },
      ],
      summary: `${formatINR(p)} grows to ${formatINR(a)} in ${formatNumber(t)} years, earning ${formatINR(a - p)} in interest.`,
      split: [
        { label: 'Principal', value: p },
        { label: 'Interest', value: a - p },
      ],
    }
  },
}

const markup: CalculatorDef = {
  slug: 'markup-calculator',
  name: 'Markup Calculator',
  category: 'business',
  description: 'Add a markup to your cost to get the selling price, profit and the resulting margin.',
  keywords: ['markup', 'mark up', 'selling price', 'cost plus', 'pricing', 'margin'],
  icon: BadgePercent,
  popular: true,
  fields: [
    { name: 'cost', label: 'Cost price', type: 'number', prefix: '₹', placeholder: 'e.g. 500', min: 0, exclusiveMin: true },
    { name: 'markup', label: 'Markup', type: 'number', suffix: '%', placeholder: 'e.g. 40', min: 0, presets: [20, 30, 50, 100] },
  ],
  formula: ['Selling price = cost × (1 + markup ÷ 100)', 'Profit = selling price − cost', 'Profit margin = profit ÷ selling price × 100'],
  compute: (v) => {
    const cost = n(v, 'cost')
    const price = cost * (1 + n(v, 'markup') / 100)
    const profit = price - cost
    const margin = (profit / price) * 100
    return {
      ok: true,
      headline: { label: 'Selling price', value: formatINR(price), tone: 'primary' },
      results: [
        { label: 'Selling price', value: formatINR(price), tone: 'primary' },
        { label: 'Profit per unit', value: formatINR(profit), tone: 'positive' },
        { label: 'Profit margin', value: formatPercent(margin) },
      ],
      summary: `A ${formatPercent(n(v, 'markup'))} markup on ${formatINR(cost)} gives a selling price of ${formatINR(price)}. Your margin is ${formatPercent(margin)} — lower than the markup because margin is measured on the selling price.`,
    }
  },
}

const breakEven: CalculatorDef = {
  slug: 'break-even-calculator',
  name: 'Break-Even Calculator',
  category: 'business',
  description: 'Find how many units you need to sell to cover your fixed and variable costs.',
  keywords: ['break even', 'break-even', 'bep', 'fixed cost', 'variable cost', 'contribution'],
  icon: Scale,
  popular: true,
  fields: [
    {
      name: 'fixed',
      label: 'Fixed costs',
      type: 'number',
      prefix: '₹',
      placeholder: 'e.g. 60,000',
      min: 0,
      help: 'Costs that stay the same regardless of sales — rent, salaries, subscriptions.',
    },
    { name: 'price', label: 'Selling price per unit', type: 'number', prefix: '₹', placeholder: 'e.g. 250', min: 0, exclusiveMin: true },
    {
      name: 'variable',
      label: 'Variable cost per unit',
      type: 'number',
      prefix: '₹',
      placeholder: 'e.g. 150',
      min: 0,
      help: 'Costs for each unit sold — materials, packaging, delivery.',
    },
  ],
  formula: [
    'Contribution per unit = selling price − variable cost',
    'Break-even units = fixed costs ÷ contribution per unit',
    'Break-even revenue = break-even units × selling price',
  ],
  compute: (v) => {
    const price = n(v, 'price')
    const cm = price - n(v, 'variable')
    if (cm <= 0) return fail('Selling price must be higher than the variable cost per unit, otherwise each sale adds to your loss.')
    const units = n(v, 'fixed') / cm
    const whole = Math.ceil(units - 1e-9)
    return {
      ok: true,
      headline: { label: 'Break-even units', value: formatNumber(whole, 0), tone: 'primary' },
      results: [
        { label: 'Units to break even', value: formatNumber(whole, 0), tone: 'primary', hint: `exact: ${formatNumber(units)}` },
        { label: 'Break-even revenue', value: formatINR(units * price) },
        { label: 'Contribution per unit', value: formatINR(cm) },
        { label: 'Contribution margin', value: formatPercent((cm / price) * 100) },
      ],
      summary: `Each unit contributes ${formatINR(cm)} towards fixed costs. You need to sell ${formatNumber(whole, 0)} units (about ${formatINR(units * price)} in sales) before you start making a profit.`,
    }
  },
}

const profitLoss: CalculatorDef = {
  slug: 'profit-loss-calculator',
  name: 'Profit and Loss Calculator',
  category: 'business',
  description: 'Calculate total profit or loss and the percentage on cost for one or many units.',
  keywords: ['profit', 'loss', 'p&l', 'cost price', 'selling price', 'gain'],
  icon: ArrowUpDown,
  fields: [
    { name: 'cost', label: 'Cost price per unit', type: 'number', prefix: '₹', placeholder: 'e.g. 120', min: 0, exclusiveMin: true },
    { name: 'price', label: 'Selling price per unit', type: 'number', prefix: '₹', placeholder: 'e.g. 150', min: 0 },
    { name: 'qty', label: 'Quantity', type: 'number', placeholder: 'e.g. 100', min: 1, integer: true, defaultValue: '1' },
  ],
  formula: ['Total cost = cost price × quantity', 'Total sales = selling price × quantity', 'Profit/loss = total sales − total cost', 'Profit/loss % = profit/loss ÷ total cost × 100'],
  compute: (v) => {
    const qty = n(v, 'qty')
    const tc = n(v, 'cost') * qty
    const ts = n(v, 'price') * qty
    const pl = ts - tc
    const pct = (pl / tc) * 100
    const kind = pl > 0 ? 'Profit' : pl < 0 ? 'Loss' : 'No profit, no loss'
    const tone: ResultTone = pl > 0 ? 'positive' : pl < 0 ? 'negative' : 'neutral'
    return {
      ok: true,
      headline: { label: pl === 0 ? 'Result' : `Total ${kind.toLowerCase()}`, value: pl === 0 ? 'Break-even' : formatINR(Math.abs(pl)), tone },
      results: [
        { label: 'Total cost', value: formatINR(tc) },
        { label: 'Total sales', value: formatINR(ts) },
        { label: pl < 0 ? 'Total loss' : 'Total profit', value: formatINR(Math.abs(pl)), tone },
        { label: pl < 0 ? 'Loss %' : 'Profit %', value: formatPercent(Math.abs(pct)), tone },
      ],
      summary:
        pl === 0
          ? 'Your sales exactly cover your costs — no profit and no loss.'
          : `Selling ${formatNumber(qty, 0)} unit${qty === 1 ? '' : 's'} gives a ${kind.toLowerCase()} of ${formatINR(Math.abs(pl))}, which is ${formatPercent(Math.abs(pct))} of your cost.`,
    }
  },
}

const revenue: CalculatorDef = {
  slug: 'revenue-calculator',
  name: 'Revenue Calculator',
  category: 'business',
  description: 'Estimate gross and net revenue from units sold, price and average discounts or returns.',
  keywords: ['revenue', 'sales', 'turnover', 'income', 'gross revenue', 'net revenue'],
  icon: BadgeIndianRupee,
  fields: [
    { name: 'price', label: 'Price per unit', type: 'number', prefix: '₹', placeholder: 'e.g. 499', min: 0, exclusiveMin: true },
    { name: 'units', label: 'Units sold', type: 'number', placeholder: 'e.g. 1,200', min: 0, integer: true },
    {
      name: 'deduct',
      label: 'Discounts & returns (optional)',
      type: 'number',
      suffix: '%',
      placeholder: 'e.g. 5',
      min: 0,
      max: 100,
      optional: true,
      help: 'Average share of gross sales lost to discounts, returns or refunds.',
    },
  ],
  formula: ['Gross revenue = price per unit × units sold', 'Deductions = gross revenue × discounts & returns %', 'Net revenue = gross revenue − deductions'],
  compute: (v) => {
    const gross = n(v, 'price') * n(v, 'units')
    const ded = (gross * n(v, 'deduct')) / 100
    const net = gross - ded
    return {
      ok: true,
      headline: { label: 'Net revenue', value: formatINR(net), tone: 'primary' },
      results: [
        { label: 'Gross revenue', value: formatINR(gross) },
        { label: 'Discounts & returns', value: formatINR(ded), tone: ded > 0 ? 'negative' : 'neutral' },
        { label: 'Net revenue', value: formatINR(net), tone: 'primary' },
        { label: 'Net revenue per unit', value: n(v, 'units') > 0 ? formatINR(net / n(v, 'units')) : '—' },
      ],
      summary: `Selling ${formatNumber(n(v, 'units'), 0)} units at ${formatINR(n(v, 'price'))} brings in ${formatINR(gross)}; after deductions you keep ${formatINR(net)} in revenue (before expenses).`,
    }
  },
}

const productPricing: CalculatorDef = {
  slug: 'product-pricing-calculator',
  name: 'Product Pricing Calculator',
  category: 'business',
  description: 'Set a selling price that hits your target profit margin, then add GST for the customer price.',
  keywords: ['pricing', 'price', 'mrp', 'product price', 'target margin', 'selling price'],
  icon: Target,
  fields: [
    { name: 'cost', label: 'Product cost per unit', type: 'number', prefix: '₹', placeholder: 'e.g. 300', min: 0, exclusiveMin: true },
    {
      name: 'extra',
      label: 'Other costs per unit (optional)',
      type: 'number',
      prefix: '₹',
      placeholder: 'e.g. 40',
      min: 0,
      optional: true,
      help: 'Packaging, shipping, platform fees and similar costs.',
    },
    { name: 'margin', label: 'Target profit margin', type: 'number', suffix: '%', placeholder: 'e.g. 30', min: 0, max: 100, exclusiveMax: true },
    { name: 'gst', label: 'GST rate', type: 'number', suffix: '%', min: 0, max: 100, defaultValue: '18', presets: [0, 5, 18] },
  ],
  formula: [
    'Total cost = product cost + other costs',
    'Price before GST = total cost ÷ (1 − target margin ÷ 100)',
    'Customer price = price before GST × (1 + GST ÷ 100)',
  ],
  compute: (v) => {
    const total = n(v, 'cost') + n(v, 'extra')
    const pre = total / (1 - n(v, 'margin') / 100)
    const tax = (pre * n(v, 'gst')) / 100
    const profit = pre - total
    return {
      ok: true,
      headline: { label: 'Customer price (incl. GST)', value: formatINR(pre + tax), tone: 'primary' },
      results: [
        { label: 'Total cost per unit', value: formatINR(total) },
        { label: 'Selling price before GST', value: formatINR(pre) },
        { label: 'GST amount', value: formatINR(tax) },
        { label: 'Customer price', value: formatINR(pre + tax), tone: 'primary' },
        { label: 'Profit per unit', value: formatINR(profit), tone: 'positive' },
        { label: 'Equivalent markup', value: formatPercent((profit / total) * 100) },
      ],
      summary: `To keep a ${formatPercent(n(v, 'margin'))} margin on a total cost of ${formatINR(total)}, price the product at ${formatINR(pre)} before GST — ${formatINR(pre + tax)} including GST.`,
      split: [
        { label: 'Cost', value: total },
        { label: 'Profit', value: profit },
        { label: 'GST', value: tax },
      ],
    }
  },
}

const savingsGoal: CalculatorDef = {
  slug: 'savings-goal-calculator',
  name: 'Savings Goal Calculator',
  category: 'finance',
  description: 'Find out how much to save each month to reach a target amount by a chosen date.',
  keywords: ['savings', 'goal', 'target', 'monthly saving', 'sip', 'plan', 'future value'],
  icon: PiggyBank,
  fields: [
    { name: 'target', label: 'Savings goal', type: 'number', prefix: '₹', placeholder: 'e.g. 5,00,000', min: 0, exclusiveMin: true },
    { name: 'current', label: 'Current savings (optional)', type: 'number', prefix: '₹', placeholder: 'e.g. 50,000', min: 0, optional: true },
    { name: 'years', label: 'Time to goal', type: 'number', suffix: 'years', placeholder: 'e.g. 3', min: 0, exclusiveMin: true, max: 100 },
    {
      name: 'rate',
      label: 'Expected annual return (optional)',
      type: 'number',
      suffix: '%',
      placeholder: 'e.g. 6',
      min: 0,
      max: 50,
      optional: true,
      help: 'An assumption, not a promise — returns are not guaranteed.',
    },
  ],
  formula: [
    'Monthly rate r = annual return ÷ 12 ÷ 100, months n = years × 12',
    'Future value of current savings = current × (1 + r)ⁿ',
    'Monthly saving = (goal − future value of current savings) × r ÷ ((1 + r)ⁿ − 1); with 0% return it is simply the shortfall ÷ n',
  ],
  note: 'Assumes deposits at the end of each month and a constant return. Real returns vary.',
  compute: (v) => {
    const target = n(v, 'target')
    const months = Math.round(n(v, 'years') * 12)
    if (months < 1) return fail('Time to goal must be at least one month.')
    const r = n(v, 'rate') / 12 / 100
    const growth = (1 + r) ** months
    const fvCurrent = n(v, 'current') * growth
    const gap = target - fvCurrent
    if (gap <= 0)
      return {
        ok: true,
        headline: { label: 'Monthly saving needed', value: formatINR(0), tone: 'positive' },
        results: [
          { label: 'Current savings will grow to', value: formatINR(fvCurrent), tone: 'positive' },
          { label: 'Savings goal', value: formatINR(target) },
        ],
        summary: `At the return you entered, your current savings could reach ${formatINR(fvCurrent)} — already enough for this goal.`,
      }
    const monthly = r === 0 ? gap / months : (gap * r) / (growth - 1)
    const contributed = monthly * months + n(v, 'current')
    return {
      ok: true,
      headline: { label: 'Monthly saving needed', value: formatINR(monthly), tone: 'primary' },
      results: [
        { label: 'Monthly saving needed', value: formatINR(monthly), tone: 'primary' },
        { label: 'Number of months', value: formatNumber(months, 0) },
        { label: 'Total you put in', value: formatINR(contributed) },
        { label: 'Estimated growth', value: formatINR(target - contributed), tone: 'positive' },
      ],
      summary: `Save about ${formatINR(monthly)} every month for ${formatNumber(months, 0)} months to reach ${formatINR(target)}.`,
      split: [
        { label: 'Your contributions', value: contributed },
        { label: 'Estimated growth', value: Math.max(0, target - contributed) },
      ],
    }
  },
}

const percentageChange: CalculatorDef = {
  slug: 'percentage-change-calculator',
  name: 'Percentage Change Calculator',
  category: 'finance',
  alsoIn: ['business'],
  description: 'Measure the percentage increase or decrease between an old and a new value.',
  keywords: ['percentage change', 'growth', 'increase', 'decrease', 'yoy', 'difference', 'return'],
  icon: CalculatorIcon,
  fields: [
    { name: 'from', label: 'Old value', type: 'number', placeholder: 'e.g. 40,000' },
    { name: 'to', label: 'New value', type: 'number', placeholder: 'e.g. 46,000' },
  ],
  formula: ['Change = new value − old value', 'Percentage change = change ÷ |old value| × 100'],
  compute: (v) => {
    const from = n(v, 'from')
    if (from === 0) return fail('The old value cannot be zero — percentage change from zero is undefined.')
    const diff = n(v, 'to') - from
    const pct = (diff / Math.abs(from)) * 100
    const tone: ResultTone = diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral'
    const word = diff > 0 ? 'increase' : diff < 0 ? 'decrease' : 'no change'
    return {
      ok: true,
      headline: { label: `Percentage ${diff < 0 ? 'decrease' : 'increase'}`, value: formatPercent(Math.abs(pct)), tone },
      results: [
        { label: 'Difference', value: `${diff > 0 ? '+' : ''}${formatNumber(diff, 4)}`, tone },
        { label: 'Percentage change', value: `${diff > 0 ? '+' : ''}${formatPercent(pct)}`, tone },
      ],
      summary:
        diff === 0
          ? 'The value has not changed.'
          : `Going from ${formatNumber(from, 4)} to ${formatNumber(n(v, 'to'), 4)} is a ${formatPercent(Math.abs(pct))} ${word}.`,
    }
  },
}

export const CALCULATORS: CalculatorDef[] = [
  gst,
  profitMargin,
  discount,
  percentage,
  goldPrice,
  loanEmi,
  simpleInterest,
  compoundInterest,
  markup,
  breakEven,
  jewellery,
  profitLoss,
  revenue,
  productPricing,
  savingsGoal,
  percentageChange,
]

export const POPULAR = CALCULATORS.filter((c) => c.popular)

export function getCalculator(slug: string) {
  return CALCULATORS.find((c) => c.slug === slug)
}

export function calculatorsIn(category: CategoryId, order?: string[]) {
  const list = CALCULATORS.filter((c) => c.category === category || c.alsoIn?.includes(category))
  if (!order) return list
  return order.map((slug) => list.find((c) => c.slug === slug)).filter((c): c is CalculatorDef => !!c)
}

export function searchCalculators(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return CALCULATORS
  const terms = q.split(/\s+/)
  return CALCULATORS.map((c) => {
    const hay = [c.name, c.description, ...c.keywords].join(' ').toLowerCase()
    const score = terms.reduce((acc, t) => acc + (c.name.toLowerCase().includes(t) ? 3 : hay.includes(t) ? 1 : -100), 0)
    return { c, score }
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.c)
}
