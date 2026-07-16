# Testing

TradeBib uses **Vitest** + **React Testing Library** for unit/component tests and **Playwright** for end-to-end browser tests.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm test` | Run Vitest unit tests once |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Vitest with coverage |
| `npm run test:e2e` | Playwright e2e (starts dev server) |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:all` | Unit tests then Playwright |

## Vitest + React Testing Library

- Config: `vitest.config.ts`
- Setup (jest-dom, Next/Image/Link mocks, framer-motion stub): `vitest.setup.tsx`
- Tests live next to source as `*.test.ts` / `*.test.tsx`

Covered areas include:

- `src/lib/utils`, validations, SEO, blog/bot helpers
- Recommendation scoring + compare utilities
- Favorites Zustand store
- UI: Button, Badge, EmptyState, Logo, BotCard

```bash
npm test
```

## Playwright

- Config: `playwright.config.ts`
- Specs: `e2e/*.spec.ts`
- Default project: Chromium
- `webServer` starts `next dev` locally (or `next start` when `CI=1`)

```bash
npx playwright install chromium   # first time / CI
npm run test:e2e
```

Smoke coverage: homepage, marketplace → bot detail, pricing, blog, compare, login, robots/sitemap.

## Notes

- Unit tests mock `next/image`, `next/link`, `next/navigation`, `framer-motion`, and `sonner`.
- E2e expects env vars used by the app (see `.env.example`); public pages should render without live Stripe/Supabase.
