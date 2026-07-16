# TradeBib — Project Structure

```text
tradebib/
├── prisma/                      # Schema + migrations + seed
├── public/                      # Static assets
├── e2e/                         # Playwright specs
├── scripts/                     # Docker entrypoint, env check, standalone start
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root shell (Navbar, Footer, Providers)
│   │   ├── (marketing)/         # Public: home, marketplace, blog, auth entry, legal
│   │   ├── (dashboard)/         # App: dashboard, profile, MT5, billing, referrals…
│   │   ├── (admin)/admin/       # Admin panel (URL /admin)
│   │   ├── api/                 # REST + webhooks
│   │   ├── auth/                # OAuth callback + verify routes
│   │   ├── actions/             # Server actions
│   │   ├── sitemap.ts · robots.ts · opengraph-image.tsx
│   │   └── error.tsx · global-error.tsx · not-found.tsx
│   ├── components/
│   │   ├── charts/              # TradingView widget
│   │   ├── bots/                # BotCard, BotDetails
│   │   ├── dashboard/           # Dashboard charts
│   │   ├── layout/              # Navbar, Footer, Container, PageHeader, AdminShell
│   │   ├── forms/               # FormField, AuthShell, OAuthButtons
│   │   ├── ui/                  # Shadcn primitives
│   │   ├── landing/ · blog/ · compare/ · recommend/ · …
│   │   └── motion/ · seo/ · performance/
│   ├── lib/                     # Utils, SEO, validations, Prisma client, domain data
│   ├── hooks/
│   ├── store/                   # Zustand stores
│   ├── services/                # Supabase, Stripe, PayPal, payments, auth helpers
│   ├── types/
│   ├── providers/
│   └── styles/globals.css       # Design tokens + global styles
├── Dockerfile · docker-compose.yml · vercel.json
├── vitest.config.ts · playwright.config.ts
└── docs/                        # Feature + deployment docs
```

## Route groups

| Group | URL examples | Contents |
| ----- | ------------ | -------- |
| `(marketing)` | `/`, `/marketplace`, `/blog`, `/login` | Public marketing + auth entry |
| `(dashboard)` | `/dashboard`, `/mt5`, `/billing`, `/profile` | Logged-in product surfaces |
| `(admin)` | `/admin`, `/admin/users` | Admin shell + CRUD |
| `api` | `/api/bots`, `/api/health` | HTTP APIs (not grouped) |

Parentheses are App Router **route groups** — they organize code without changing URLs.

## Config checklist

| Requirement           | Status                                   |
| --------------------- | ---------------------------------------- |
| Next.js 15 App Router | ✅                                       |
| TypeScript            | ✅                                       |
| Tailwind CSS          | ✅                                       |
| Shadcn UI             | ✅ (`components/ui` + `components.json`) |
| React Query           | ✅ (`providers/providers.tsx`)           |
| Zustand               | ✅ (`store/*`)                           |
| React Hook Form       | ✅                                       |
| Zod                   | ✅ (`lib/validations.ts`)                |
| Prisma + PostgreSQL   | ✅ (`prisma/schema.prisma`)              |
| Supabase              | ✅ (`services/supabase/*`)               |
| Payments              | ✅ (`services/stripe` · `paypal` · `payments`) |
| ESLint                | ✅                                       |
| Prettier              | ✅                                       |
| Dark Mode             | ✅ (`next-themes`, default dark)         |
| Env variables         | ✅ (`.env.example`)                      |
| Layouts               | ✅ (root + route groups + admin)         |
| Reusable components   | ✅                                       |
| Responsive            | ✅                                       |
| SEO                   | ✅ (metadata, sitemap, robots)           |
| Performance           | ✅ (lazy charts, image, cache, prefetch) |
| Testing               | ✅ (Vitest, RTL, Playwright)             |
| Deployment            | ✅ (Docker, Vercel, CI, Sentry, health)  |
| UI audit              | ✅ (Container, PageHeader, a11y pass)    |
| Extended features     | ✅ (signals, VPS, copy, PWA, i18n, …)    |
| Framer Motion         | ✅                                       |
