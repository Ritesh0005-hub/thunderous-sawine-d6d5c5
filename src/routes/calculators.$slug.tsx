import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { Calculator, FormulaPanel } from '@/components/Calculator'
import { CalculatorCard } from '@/components/CalculatorCard'
import { CALCULATORS, CATEGORIES, getCalculator } from '@/lib/calculators'
import { BLOG_POSTS } from '@/lib/blog'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/calculators/$slug')({
  loader: ({ params }) => {
    const def = getCalculator(params.slug)
    if (!def) throw notFound()
    return { slug: def.slug }
  },
  head: ({ params }) => {
    const def = getCalculator(params.slug)
    if (!def) return {}
    return seo({ title: `${def.name} — Free Online`, description: def.description, path: `/calculators/${def.slug}` })
  },
  component: CalculatorPage,
})

function CalculatorPage() {
  const { slug } = Route.useLoaderData()
  const def = getCalculator(slug)!
  const cat = CATEGORIES[def.category]
  const related = CALCULATORS.filter((c) => c.slug !== def.slug && (c.category === def.category || c.alsoIn?.includes(def.category))).slice(0, 4)
  const article = BLOG_POSTS.find((p) => p.calculator === def.slug)

  return (
    <div className="bg-slate-50 dark:bg-slate-900/40">
      <div className="container-page py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/calculators" className="hover:text-blue-600">
            Calculators
          </Link>
          <ChevronRight size={14} />
          <Link to={cat.path} className="hover:text-blue-600">
            {cat.name}
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-700 dark:text-slate-300" aria-current="page">
            {def.name}
          </span>
        </nav>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl dark:text-white">{def.name}</h1>
        <p className="muted mt-2 max-w-2xl">{def.description}</p>

        <div className="mt-8">
          <Calculator key={def.slug} def={def} headingLevel={2} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <FormulaPanel def={def} />
          {article && (
            <Link to="/blog/$slug" params={{ slug: article.slug }} className="card card-hover p-5 sm:p-7">
              <p className="eyebrow">Read the guide</p>
              <p className="mt-2 text-lg font-semibold text-ink dark:text-white">{article.title}</p>
              <p className="muted mt-1.5 text-sm leading-6">{article.description}</p>
            </Link>
          )}
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-semibold text-ink dark:text-white">Related calculators</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((c) => (
                <CalculatorCard key={c.slug} def={c} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
