import { Link } from '@tanstack/react-router'
import { LogoMark } from './Logo'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site'

const COLUMNS = [
  {
    title: 'Calculators',
    links: [
      { to: '/calculators', label: 'All Calculators' },
      { to: '/jewellery', label: 'Jewellery' },
      { to: '/business', label: 'Business' },
      { to: '/finance', label: 'Finance' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/blog', label: 'Blog' },
      { to: '/pro', label: 'CalcDock Pro' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms and Conditions' },
      { to: '/disclaimer', label: 'Disclaimer' },
    ],
  },
] as const

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-lg font-bold tracking-tight text-ink dark:text-white">
              Calc<span className="text-blue-600 dark:text-blue-400">Dock</span>
            </span>
          </Link>
          <p className="mt-3 text-sm font-medium text-ink dark:text-slate-200">{SITE_TAGLINE}</p>
          <p className="muted mt-2 text-sm leading-6">
            Free calculators for business, finance, jewellery and everyday decisions. No signup required.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-semibold text-ink dark:text-white">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-500">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <p>Results are estimates for informational purposes only and are not financial advice.</p>
        </div>
      </div>
    </footer>
  )
}
