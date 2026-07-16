# TradeBib

Modern Forex & MT5 automation platform where traders discover verified Expert Advisors, connect MetaTrader 5 accounts, monitor performance, and subscribe to trading bots.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4** · **Shadcn UI** (Radix) · **Framer Motion**
- **Prisma** · **PostgreSQL** · **Supabase Auth** (ready)
- **React Query** · **Zustand** · **React Hook Form** · **Zod**
- **Recharts** · **TradingView Advanced Chart**
- **Vitest** · **Playwright** · **Sentry** · **Vercel Analytics**
- **ESLint** · **Prettier** · **Dark mode by default** · **SEO**

See [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) for the folder map
(`app/(marketing|dashboard|admin)`, `components/{charts,bots,dashboard,layout,forms,ui}`,
`lib`, `hooks`, `store`, `services`, `types`, `styles`).  
Production: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) · Testing: [`docs/TESTING.md`](docs/TESTING.md)

## Getting started

```bash
npm install
cp .env.example .env.local
# Set DATABASE_URL and Supabase keys in .env.local
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo auth

- Without Supabase keys the app runs in **demo mode** (httpOnly session cookie).
- With real keys: full Supabase JWT auth, email verification, Google/GitHub OAuth.
- Use an email containing `admin` (e.g. `admin@tradebib.com`) for `/admin`.
- See [`docs/AUTH.md`](docs/AUTH.md).

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Development server |
| `npm run build` / `start` | Production build & serve |
| `npm test` / `test:e2e` | Vitest / Playwright |
| `npm run lint` / `typecheck` | Quality gates |
| `npm run db:migrate:deploy` | Apply Prisma migrations |
| `npm run env:check` | Env readiness |
| `npm run docker:up` | App + Postgres via Compose |

## Deploy

- **Vercel** — connect repo, set env from `.env.example`, run migrations
- **Docker** — `docker compose up --build` (migrate on start)
- **CI** — `.github/workflows/ci.yml` (lint, test, build, e2e, Docker)

Full checklist: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). Health: `/api/health`.

## Environment

See `.env.example` for `DATABASE_URL`, Supabase, Stripe/PayPal, and Sentry.

## Risk notice

Trading involves risk. Past performance does not guarantee future results.
