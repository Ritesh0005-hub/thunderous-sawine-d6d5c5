import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/components/LegalPage'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/terms')({
  head: () => seo({ title: 'Terms and Conditions', description: 'Terms for using CalcDock.', path: '/terms' }),
  component: () => (
    <LegalPage title="Terms and Conditions" intro="The terms that apply when you use CalcDock.">
      <h2>Use of the service</h2>
      <p>CalcDock provides free online calculators for general informational purposes. You may use them for personal and business purposes.</p>
      <h2>No professional advice</h2>
      <p>
        Results are estimates based on the information you enter. They are not financial, tax, legal or investment advice. Please verify important
        figures with a qualified professional.
      </p>
      <h2>Accounts and paid features</h2>
      <p>No account is required for the free calculators. CalcDock Pro is not yet available, and no payments are currently accepted.</p>
      <h2>Limitation of liability</h2>
      <p>[To be completed: limitation of liability, governing law and jurisdiction.]</p>
      <h2>Changes</h2>
      <p>[To be completed: how changes to these terms will be communicated.]</p>
    </LegalPage>
  ),
})
