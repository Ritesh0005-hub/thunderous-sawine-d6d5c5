import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, Sparkles, X } from 'lucide-react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/calculators', label: 'All Calculators' },
  { to: '/jewellery', label: 'Jewellery' },
  { to: '/business', label: 'Business' },
  { to: '/finance', label: 'Finance' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

const linkBase = 'rounded-lg px-3 py-2 text-sm font-medium transition-colors'
const linkIdle = 'text-slate-600 hover:bg-slate-100 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
// TanStack merges activeProps classes onto the base classes, so these must win.
const linkActive = '!text-blue-600 dark:!text-blue-400 bg-blue-50/70 dark:bg-blue-500/10'

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/85">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`${linkBase} ${linkIdle}`}
              activeProps={{ className: linkActive }}
              activeOptions={{ exact: item.to === '/' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link to="/pro" className="btn-primary hidden !px-4 !py-2 sm:inline-flex">
            <Sparkles size={15} /> Explore Pro
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-950" aria-label="Mobile">
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`${linkBase} ${linkIdle} !py-2.5 !text-base`}
                activeProps={{ className: linkActive }}
                activeOptions={{ exact: item.to === '/' }}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/pro" onClick={() => setOpen(false)} className="btn-primary mt-2">
              <Sparkles size={15} /> Explore Pro
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
