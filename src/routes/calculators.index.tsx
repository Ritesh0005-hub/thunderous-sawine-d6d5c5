import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHero } from '@/components/PageHero'
import { SearchBar } from '@/components/SearchBar'
import { CalculatorCard } from '@/components/CalculatorCard'
import { CALCULATORS, CATEGORIES, type CategoryId, searchCalculators } from '@/lib/calculators'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/calculators/')({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === 'string' && search.q.trim() ? search.q : undefined,
  }),
  head: () =>
    seo({
      title: 'All Calculators',
      description: `Browse all ${CALCULATORS.length} free CalcDock calculators for GST, profit, jewellery, gold, loan EMI, interest, savings and percentages.`,
      path: '/calculators',
    }),
  component: AllCalculators,
})

const ORDER: CategoryId[] = ['jewellery', 'business', 'finance', 'everyday']

function AllCalculators() {
  const { q } = Route.useSearch()
  const results = q ? searchCalculators(q) : null

  return (
    <>
      <PageHero eyebrow="All calculators" title="Every CalcDock calculator in one place">
        {CALCULATORS.length} free tools, grouped by category. Search by name or by what you need — try “tax”, “loan” or “22K”.
        <div className="mt-6 max-w-xl">
          <SearchBar key={q ?? ''} size="md" initial={q ?? ''} />
        </div>
      </PageHero>

      <div className="container-page py-14">
        {results ? (
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-ink dark:text-white">
                {results.length} result{results.length === 1 ? '' : 's'} for “{q}”
              </h2>
              <Link to="/calculators" search={{}} className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                Clear search
              </Link>
            </div>
            {results.length === 0 ? (
              <p className="muted mt-6">No calculators match that search yet. Browse the categories below or try a different word.</p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((c) => (
                  <CalculatorCard key={c.slug} def={c} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <div className="space-y-16">
            {ORDER.map((cat) => {
              const list = CALCULATORS.filter((c) => c.category === cat)
              const info = CATEGORIES[cat]
              return (
                <section key={cat} aria-labelledby={`cat-${cat}`}>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2 id={`cat-${cat}`} className="text-2xl font-bold tracking-tight text-ink dark:text-white">
                        {info.name}
                      </h2>
                      <p className="muted mt-1 text-sm">{info.description}</p>
                    </div>
                    {cat !== 'everyday' && (
                      <Link to={info.path} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
                        Open {info.name} workspace →
                      </Link>
                    )}
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {list.map((c) => (
                      <CalculatorCard key={c.slug} def={c} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
