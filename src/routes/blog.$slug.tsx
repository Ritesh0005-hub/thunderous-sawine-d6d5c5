import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { BLOG_POSTS, getPost } from '@/lib/blog'
import { getCalculator } from '@/lib/calculators'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    if (!getPost(params.slug)) throw notFound()
    return { slug: params.slug }
  },
  head: ({ params }) => {
    const post = getPost(params.slug)
    return post ? seo({ title: post.title, description: post.description, path: `/blog/${post.slug}` }) : {}
  },
  component: BlogPostPage,
})

function BlogPostPage() {
  const { slug } = Route.useLoaderData()
  const post = getPost(slug)!
  const calc = getCalculator(post.calculator)
  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <article className="container-page max-w-3xl py-14">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600">
        <ArrowLeft size={15} /> All articles
      </Link>
      <p className="eyebrow mt-8">{post.category}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl dark:text-white">{post.title}</h1>
      <p className="muted mt-4 text-lg leading-8">{post.description}</p>
      <p className="mt-4 text-sm text-slate-500">{post.readMinutes} min read</p>

      <div className="prose-article mt-8 border-t border-slate-200 pt-4 dark:border-slate-800">
        {post.body.map((b, i) => {
          if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>
          if (b.type === 'ul')
            return (
              <ul key={i}>
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            )
          if (b.type === 'formula')
            return (
              <p key={i} className="!my-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 font-mono !text-sm !text-ink dark:border-slate-800 dark:bg-slate-900 dark:!text-slate-100">
                {b.text}
              </p>
            )
          return <p key={i}>{b.text}</p>
        })}
      </div>

      {calc && (
        <div className="card mt-12 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-ink dark:text-white">Try it yourself</p>
            <p className="muted text-sm">Run your own numbers with the {calc.name}.</p>
          </div>
          <Link to="/calculators/$slug" params={{ slug: calc.slug }} className="btn-primary">
            Open calculator <ArrowRight size={15} />
          </Link>
        </div>
      )}

      <section className="mt-14">
        <h2 className="text-lg font-semibold text-ink dark:text-white">Keep reading</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {more.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="card card-hover p-5">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{p.category}</span>
              <p className="mt-1.5 font-semibold text-ink dark:text-white">{p.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  )
}
