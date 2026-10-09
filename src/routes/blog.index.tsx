import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/PageHero'
import { BLOG_POSTS } from '@/lib/blog'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/blog/')({
  head: () =>
    seo({
      title: 'Blog — Guides to GST, Margins, Jewellery Prices and EMI',
      description: 'Plain-language guides on calculating GST in India, profit margin, jewellery prices, loan EMI and markup vs margin.',
      path: '/blog',
    }),
  component: BlogIndex,
})

function BlogIndex() {
  const [featured, ...rest] = BLOG_POSTS
  return (
    <>
      <PageHero eyebrow="CalcDock blog" title="Understand the numbers behind your decisions.">
        Short, practical guides that explain the formulas our calculators use — with worked examples.
      </PageHero>
      <div className="container-page py-14">
        <Link to="/blog/$slug" params={{ slug: featured.slug }} className="card card-hover group grid overflow-hidden md:grid-cols-[1fr_1.2fr]">
          <div className="flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 p-10 text-white">
            <p className="text-center text-5xl font-extrabold tracking-tight">₹ + 18%</p>
          </div>
          <div className="p-7 sm:p-9">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Featured · {featured.category}</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink group-hover:text-blue-600 dark:text-white">{featured.title}</h2>
            <p className="muted mt-3 leading-7">{featured.description}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
              Read article <ArrowRight size={15} />
            </span>
          </div>
        </Link>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {rest.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="card card-hover group flex flex-col p-6">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{p.category}</span>
              <h2 className="mt-2 text-lg font-semibold text-ink group-hover:text-blue-600 dark:text-white">{p.title}</h2>
              <p className="muted mt-2 flex-1 text-sm leading-6">{p.description}</p>
              <span className="mt-4 text-xs text-slate-500">{p.readMinutes} min read</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
