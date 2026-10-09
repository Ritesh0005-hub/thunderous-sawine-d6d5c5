import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { themeInitScript } from '@/components/ThemeToggle'
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site'

import '../styles.css'

const siteTitle = `${SITE_NAME} — ${SITE_TAGLINE}`
const siteDescription =
  'Free online calculators for GST, profit margin, jewellery and gold prices, loan EMI, interest and more. Built for Indian businesses, students and everyday users. No signup needed.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: siteTitle },
      { name: 'description', content: siteDescription },
      { name: 'theme-color', content: '#2563EB' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: siteTitle },
      { property: 'og:description', content: siteDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'en_IN' },
      { property: 'og:image', content: `${SITE_URL}/og-image.png` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: `${SITE_URL}/og-image.png` },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink dark:text-white">Page not found</h1>
      <p className="muted mt-3 max-w-md">The page you are looking for does not exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="btn-primary">
          Go home
        </Link>
        <Link to="/calculators" className="btn-secondary">
          Browse calculators
        </Link>
      </div>
    </div>
  )
}
