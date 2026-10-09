const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const num = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 })

export function formatINR(value: number) {
  if (!Number.isFinite(value)) return '—'
  // Avoid showing "-₹0.00" for tiny negative rounding residue.
  return inr.format(Math.abs(value) < 0.005 ? 0 : value)
}

export function formatNumber(value: number, maxDigits = 2) {
  if (!Number.isFinite(value)) return '—'
  if (maxDigits === 2) return num.format(value)
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: maxDigits }).format(value)
}

export function formatPercent(value: number, digits = 2) {
  if (!Number.isFinite(value)) return '—'
  return `${new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits }).format(value)}%`
}

/** Parse a user-entered number, allowing Indian/Western thousands separators. */
export function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/[,\s₹%]/g, '')
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null
  if (!/^-?\d*\.?\d+$|^-?\d+\.?$/.test(cleaned)) return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}
