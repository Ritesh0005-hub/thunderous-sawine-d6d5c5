# CalcDock

**Smart Calculators. Simple Decisions.**

CalcDock is an online calculator platform for Indian students, small business owners, shopkeepers, freelancers, jewellery buyers and everyday users. Every calculator is free, works without an account, validates its inputs, explains its result in plain language and shows the formula it uses.

## What's included

- **16 working calculators** — GST, Profit Margin, Discount, Percentage, Gold Price, Loan EMI, Simple Interest, Compound Interest, Markup, Break-Even, Jewellery Price, Profit & Loss, Revenue, Product Pricing, Savings Goal and Percentage Change. Each has validation, a reset button and copy-to-clipboard results.
- **Jewellery Price Calculator** (flagship) — 24K/22K/18K/14K purity, making charges as %, per gram or fixed, wastage, GST, and a line-by-line breakdown.
- **Category workspaces** — `/business`, `/finance` and `/jewellery`.
- **Search** — the hero search suggests calculators as you type; `/calculators?q=` shows full results.
- **Blog** — five educational articles linked to their calculators.
- **Contact form and Pro waitlist** — handled by Netlify Forms.
- **Light/dark mode**, responsive layout, per-page SEO metadata, Open Graph image and favicon.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19, TanStack Router file-based routing)
- Tailwind CSS 4, Inter font, lucide-react icons
- Netlify (hosting, SSR, Netlify Forms)

## Running locally

```bash
pnpm install
pnpm dev              # http://localhost:3000
# or, with Netlify emulation (needed to test forms):
netlify dev
```

## Before launch

- Replace the placeholder emails in `src/lib/site.ts` (`SUPPORT_EMAIL`, `BUSINESS_EMAIL`) and update `SITE_URL` if you add a custom domain.
- Complete the draft Privacy Policy, Terms and Disclaimer pages in `src/routes/`.
- Turn on email notifications for form submissions in the Netlify UI (Forms → Notifications).

## Roadmap — CalcDock Pro (marked "Coming Soon" in the UI)

Pro is not implemented yet and no payments are taken. Planned features: advanced calculators, saved calculation history, exportable reports, custom calculation presets and additional business tools. These will need user accounts (e.g. Netlify Identity), persistent storage (Netlify Database) and a payment provider with access control.
