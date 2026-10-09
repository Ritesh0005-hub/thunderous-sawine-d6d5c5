# AGENTS.md

CalcDock is a calculator platform (brand tagline "Smart Calculators. Simple Decisions.") built with TanStack Start + React 19 + Tailwind CSS 4 and deployed on Netlify. All calculation happens client-side; there is no database or auth yet.

## Key directories

```
src/
  lib/
    calculators.ts   # THE calculator registry: field definitions, formulas, compute functions, search
    blog.ts          # Blog articles as structured blocks (p / h2 / ul / formula)
    format.ts        # en-IN currency/number formatting + tolerant number parsing
    seo.ts           # seo({title, description, path}) → head() meta + canonical
    site.ts          # Brand name, SITE_URL, placeholder contact emails
    forms.ts         # submitNetlifyForm() — posts to /__forms.html
  components/
    Calculator.tsx   # Generic calculator UI (inputs, validation, results, copy, reset) + FormulaPanel
    CategoryWorkspace.tsx  # Tabbed calculator switcher used by /business and /finance
    SiteHeader/SiteFooter/Logo/ThemeToggle/SearchBar/CalculatorCard/FreeVsPro/PageHero/LegalPage
  routes/            # File-based routes: /, /calculators, /calculators/$slug, /jewellery, /business,
                     # /finance, /pro, /about, /contact, /blog, /blog/$slug, /privacy, /terms, /disclaimer
public/
  __forms.html       # Hidden static forms so Netlify registers "contact" and "pro-waitlist"
  favicon.svg, favicon-32.png, apple-touch-icon.png, og-image.png
```

## Adding a calculator

Add a `CalculatorDef` to `src/lib/calculators.ts` and append it to `CALCULATORS`. It automatically gets a page at `/calculators/<slug>`, appears in search, the directory and its category. Set `popular: true` to show it on the homepage, `alsoIn` to list it on another category page. Fields are validated generically (required/optional, min/max, exclusive bounds, integer); cross-field rules go in `compute` by returning `{ ok: false, error }`. `showIf` hides fields conditionally.

## Conventions and decisions

- Brand colours: text `ink` (#111827), accent Tailwind `blue-600` (#2563EB), secondary bg `slate-50` (#F8FAFC), success `emerald`. Shared classes (`card`, `btn-primary`, `input`, `label`, `eyebrow`, `section-title`, `muted`, `container-page`) live in `src/styles.css`.
- Dark mode is class-based (`.dark` on `<html>`), set before paint by `themeInitScript` in `ThemeToggle.tsx`.
- Inputs are `type="text" inputMode="decimal"` so values like `1,00,000` parse correctly.
- Homepage sample results are computed from the real helpers (`computeEmi`, `computeJewellery`) and labelled "Sample values" — never hard-code fake results, stats, reviews or testimonials.
- Pro is "Coming Soon" only. Do not add payment buttons or claim access control until a real payment + auth system exists. Netlify Forms submissions in React must POST to `/__forms.html`, and every field must exist in that skeleton.
- Legal pages are drafts marked with a notice; contact emails are placeholders in `site.ts`.
