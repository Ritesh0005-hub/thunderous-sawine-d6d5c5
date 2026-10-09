import { Link } from '@tanstack/react-router'
import { SITE_NAME } from '@/lib/site'

/** The CalcDock mark: a "C" arc docking a plus/equals keypad. */
export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#2563EB" />
      <path d="M21.5 9.2A9 9 0 1 0 21.5 22.8" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M16.5 13.2h6M16.5 18.8h6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
      <LogoMark />
      {withText && (
        <span className="text-lg font-bold tracking-tight text-ink dark:text-white">
          Calc<span className="text-blue-600 dark:text-blue-400">Dock</span>
        </span>
      )}
    </Link>
  )
}
