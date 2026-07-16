# TradeBib — Project Structure

```text
tradebib/
├── .env.example                 # Env template (Postgres, Supabase, Stripe…)
├── .prettierrc.json             # Prettier + Tailwind plugin
├── .prettierignore
├── components.json              # Shadcn UI config
├── eslint.config.mjs            # ESLint (Next + TypeScript + Prettier)
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma/
│   └── schema.prisma            # PostgreSQL models
├── public/
├── src/
│   ├── app/                     # App Router pages + API + SEO
│   │   ├── layout.tsx           # Root layout (Navbar, Footer, Providers)
│   │   ├── page.tsx             # Landing
│   │   ├── globals.css          # Design tokens, dark mode, glass
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── marketplace/
│   │   ├── recommend/           # AI bot recommendation quiz
│   │   ├── compare/             # Multi-bot comparison
│   │   ├── leaderboard/         # Top traders / bots rankings
│   │   ├── notifications/       # Notification Center
│   │   ├── referrals/           # Affiliate Dashboard
│   │   ├── affiliate/           # Redirect → /referrals
│   │   ├── bots/[slug]/
│   │   ├── charts/
│   │   ├── dashboard/
│   │   ├── mt5/
│   │   ├── pricing/
│   │   ├── login|register|forgot-password/
│   │   ├── profile/
│   │   ├── admin/               # Admin layout + pages
│   │   ├── api/bots/            # REST API routes
│   │   ├── api/recommend/       # Recommendation scoring API
│   │   ├── api/notifications/   # Notification list API
│   │   ├── api/affiliate/       # Affiliate summary API
│   │   └── actions/             # Server actions
│   ├── components/
│   │   ├── ui/                  # Shadcn-style primitives
│   │   ├── layout/              # Navbar, Footer, Logo, AdminNav
│   │   ├── bots/                # BotCard, BotDetails
│   │   ├── reviews/             # Ratings, comments, helpful, verified badge
│   │   ├── recommend/           # Recommendation engine UI
│   │   ├── compare/             # Bot comparison UI
│   │   ├── leaderboard/         # Leaderboard boards
│   │   ├── notifications/       # Notification Center UI
│   │   ├── affiliate/           # Affiliate dashboard UI
│   │   └── landing/
│   ├── hooks/
│   ├── lib/
│   │   ├── data/                # Seed/demo domain data
│   │   ├── recommendations/     # Bot scoring engine
│   │   ├── compare/             # Comparison series helpers
│   │   ├── supabase/            # Browser + server clients
│   │   ├── prisma.ts
│   │   ├── validations.ts       # Zod schemas
│   │   └── utils.ts
│   ├── providers/               # Theme + React Query + Toasts
│   ├── stores/                  # Zustand (auth, favorites, recommendations)
│   └── types/
└── tsconfig.json
```

## Config checklist

| Requirement           | Status                                   |
| --------------------- | ---------------------------------------- |
| Next.js 15 App Router | ✅                                       |
| TypeScript            | ✅                                       |
| Tailwind CSS          | ✅                                       |
| Shadcn UI             | ✅ (`components/ui` + `components.json`) |
| React Query           | ✅ (`providers/providers.tsx`)           |
| Zustand               | ✅ (`stores/*`)                          |
| React Hook Form       | ✅                                       |
| Zod                   | ✅ (`lib/validations.ts`)                |
| Prisma + PostgreSQL   | ✅ (`prisma/schema.prisma`)              |
| Supabase              | ✅ (`lib/supabase/*`)                    |
| ESLint                | ✅                                       |
| Prettier              | ✅                                       |
| Dark Mode             | ✅ (`next-themes`, default dark)         |
| Env variables         | ✅ (`.env.example`)                      |
| Layouts               | ✅ (root + admin)                        |
| Reusable components   | ✅                                       |
| Responsive            | ✅                                       |
| SEO                   | ✅ (metadata, sitemap, robots)           |
| Framer Motion         | ✅                                       |
