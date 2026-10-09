import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '@/components/PageHero'
import { CategoryWorkspace } from '@/components/CategoryWorkspace'
import { calculatorsIn } from '@/lib/calculators'
import { seo } from '@/lib/seo'

const BUSINESS = calculatorsIn('business', [
  'profit-loss-calculator',
  'profit-margin-calculator',
  'markup-calculator',
  'revenue-calculator',
  'break-even-calculator',
  'product-pricing-calculator',
  'gst-calculator',
  'discount-calculator',
])

export const Route = createFileRoute('/business')({
  head: () =>
    seo({
      title: 'Business Calculators — GST, Margin, Markup, Break-Even',
      description:
        'Free business calculators for Indian shops and small businesses: profit and loss, profit margin, markup, revenue, break-even, product pricing, GST and discount.',
      path: '/business',
    }),
  component: BusinessPage,
})

function BusinessPage() {
  return (
    <>
      <PageHero eyebrow="Business calculators" title="Price with confidence. Know your numbers.">
        Tools for shopkeepers, freelancers and small businesses — from pricing a new product to working out how many sales you need to break even.
        Every result is explained in plain language.
      </PageHero>
      <div className="container-page py-12">
        <CategoryWorkspace calculators={BUSINESS} label="Business calculators" />
      </div>
    </>
  )
}
