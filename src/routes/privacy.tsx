import { createFileRoute } from '@tanstack/react-router'
import { LegalPage } from '@/components/LegalPage'
import { SUPPORT_EMAIL } from '@/lib/site'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/privacy')({
  head: () => seo({ title: 'Privacy Policy', description: 'How CalcDock handles your information.', path: '/privacy' }),
  component: () => (
    <LegalPage title="Privacy Policy" intro="How CalcDock collects, uses and protects information.">
      <h2>Calculations</h2>
      <p>
        CalcDock calculators run in your browser. The values you type into a calculator are not sent to or stored on our servers. Your light/dark theme
        choice is saved in your browser's local storage.
      </p>
      <h2>Information you send us</h2>
      <p>
        If you use the contact form or join the Pro waitlist, we receive the details you submit (such as your name, email address and message) and use
        them only to respond to you or notify you about Pro.
      </p>
      <h2>Service providers</h2>
      <p>[To be completed: hosting, form handling and any analytics providers, and what data they process.]</p>
      <h2>Your rights</h2>
      <p>[To be completed: how users can request access to or deletion of their data, and applicable laws.]</p>
      <h2>Contact</h2>
      <p>Questions about privacy can be sent to {SUPPORT_EMAIL}.</p>
    </LegalPage>
  ),
})
