import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/components/LegalPage'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/disclaimer')({
  head: () => seo({ title: 'Disclaimer', description: 'Important information about CalcDock calculator results.', path: '/disclaimer' }),
  component: () => (
    <LegalPage title="Disclaimer" intro="Important information about how to use CalcDock results.">
      <h2>Estimates only</h2>
      <p>
        CalcDock calculators use standard formulas and the values you provide. Results are estimates for informational purposes and may differ from
        figures produced by banks, lenders, jewellers, tax authorities or accountants.
      </p>
      <h2>Rates and charges</h2>
      <p>
        CalcDock does not supply live gold rates, interest rates or tax rates. GST rates and rules change from time to time. Always confirm current
        rates with an official or trusted source.
      </p>
      <h2>Jewellery estimates</h2>
      <p>
        Jewellery price estimates depend on the gold rate, making charges, wastage and GST you enter. A jeweller's final invoice may include other
        charges such as stones, hallmarking or certification, or may calculate tax differently.
      </p>
      <h2>Not advice</h2>
      <p>Nothing on CalcDock is financial, investment, tax or legal advice. Make important decisions with the help of a qualified professional.</p>
    </LegalPage>
  ),
})
