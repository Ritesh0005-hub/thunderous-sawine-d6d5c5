import type { ReactNode } from 'react'
import { FilePenLine } from 'lucide-react'
import { PageHero } from './PageHero'

/** Shared layout for policy pages. `draft` shows a notice that the text must be finalised before launch. */
export function LegalPage({ title, intro, draft = true, children }: { title: string; intro: string; draft?: boolean; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title}>
        {intro}
      </PageHero>
      <div className="container-page max-w-3xl py-14">
        {draft && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <FilePenLine size={18} className="mt-0.5 shrink-0" />
            <p>
              <strong>Draft placeholder.</strong> This page outlines the expected structure and must be reviewed and completed (ideally with legal advice)
              before launch.
            </p>
          </div>
        )}
        <div className="prose-article">{children}</div>
      </div>
    </>
  )
}
