# TradeBib

Modern Forex & MT5 automation platform where traders discover verified Expert Advisors, connect MetaTrader 5 accounts, monitor performance, and subscribe to trading bots.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4** · **Shadcn UI** (Radix) · **Framer Motion**
- **Prisma** · **PostgreSQL** · **Supabase Auth** (ready)
- **React Query** · **Zustand** · **React Hook Form** · **Zod**
- **Recharts** · **TradingView Advanced Chart**
- **ESLint** · **Prettier** · **Dark mode by default** · **SEO**

See [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) for the full folder map and config checklist.

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

| Command               | Description              |
| --------------------- | ------------------------ |
| `npm run dev`         | Start development server |
| `npm run build`       | Production build         |
| `npm run start`       | Start production server  |
| `npm run lint`        | ESLint                   |
| `npm run format`      | Prettier write           |
| `npm run typecheck`   | TypeScript check         |
| `npm run db:generate` | Generate Prisma client   |
| `npm run db:push`     | Push schema to database  |
| `npm run db:studio`   | Open Prisma Studio       |

## Features

- Landing, Marketplace, Bot Details, Charts (TradingView)
- Dashboard, MT5 Connect, Pricing, Auth, Profile
- Admin panel (users, bots, subscriptions, analytics)
- Compare bots, profit calculator, economic calendar, news
- Trading journal, leaderboard, referrals
- Dark mode by default, responsive, SEO (sitemap + robots)

## Environment

See `.env.example` for required variables (`DATABASE_URL`, Supabase, Stripe, etc.).

## Risk notice

Trading involves risk. Past performance does not guarantee future results.
