import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '@/components/PageHero'
import { CategoryWorkspace } from '@/components/CategoryWorkspace'
import { calculatorsIn } from '@/lib/calculators'
import { seo } from '@/lib/seo'

const FINANCE = calculatorsIn('finance', [
  'loan-emi-calculator',
  'simple-interest-calculator',
  'compound-interest-calculator',
  'savings-goal-calculator',
  'percentage-change-calculator',
])

export const Route = createFileRoute('/finance')({
  head: () =>
    seo({
      title: 'Finance Calculators — Loan EMI, Interest, Savings',
      description:
        'Free finance calculators: loan EMI with total interest, simple interest, compound interest, savings goal and percentage change.',
      path: '/finance',
    }),
  component: FinancePage,
})

function FinancePage() {
  return (
    <>
      <PageHero eyebrow="Finance calculators" title="Plan loans, interest and savings clearly.">
        See your monthly EMI and total interest before you borrow, compare simple and compound interest, and work out how much to save each month for
        a goal.
      </PageHero>
      <div className="container-page py-12">
        <CategoryWorkspace calculators={FINANCE} label="Finance calculators" />
        <p className="mt-10 text-center text-xs text-slate-500">
          Results are estimates based on the values you enter and are not financial advice. Check final figures with your bank or lender.
        </p>
      </div>
    </>
  )
}
