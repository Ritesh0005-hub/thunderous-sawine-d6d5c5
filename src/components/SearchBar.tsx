import { useId, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { searchCalculators } from '@/lib/calculators'

/** Calculator search with live suggestions. Enter opens the best match or the full results list. */
export function SearchBar({ size = 'lg', initial = '' }: { size?: 'lg' | 'md'; initial?: string }) {
  const navigate = useNavigate()
  const listId = useId()
  const [query, setQuery] = useState(initial)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const matches = useMemo(() => (query.trim() ? searchCalculators(query).slice(0, 6) : []), [query])

  const go = (slug: string) => {
    setOpen(false)
    navigate({ to: '/calculators/$slug', params: { slug } })
  }

  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault()
        if (open && matches[active]) go(matches[active].slug)
        else navigate({ to: '/calculators', search: { q: query.trim() || undefined } })
      }}
    >
      <label htmlFor={`${listId}-input`} className="sr-only">
        Search calculators
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={size === 'lg' ? 20 : 18} />
        <input
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActive(0)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((a) => Math.min(a + 1, matches.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((a) => Math.max(a - 1, 0))
            } else if (e.key === 'Escape') setOpen(false)
          }}
          placeholder="What do you want to calculate today?"
          className={`w-full rounded-2xl border border-slate-200 bg-white text-ink shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-600/10 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white ${
            size === 'lg' ? 'py-4 pr-32 pl-12 text-base' : 'py-3 pr-28 pl-11 text-[15px]'
          }`}
        />
        <button type="submit" className={`btn-primary absolute top-1/2 right-2 -translate-y-1/2 ${size === 'lg' ? '' : '!py-2'}`}>
          Search
        </button>
      </div>

      {open && query.trim() && (
        <ul
          id={listId}
          role="listbox"
          className="card absolute inset-x-0 top-full z-30 mt-2 overflow-hidden p-1.5 text-left shadow-xl"
        >
          {matches.length === 0 && <li className="px-3 py-3 text-sm text-slate-500">No calculators match “{query}”. Try “GST”, “EMI” or “gold”.</li>}
          {matches.map((c, i) => {
            const Icon = c.icon
            return (
              <li key={c.slug} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(c.slug)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${i === active ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                >
                  <Icon size={18} className="shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink dark:text-white">{c.name}</span>
                    <span className="block truncate text-xs text-slate-500">{c.description}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </form>
  )
}
