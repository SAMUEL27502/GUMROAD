# Production deployment

Guide for shipping TradeBib with **Docker**, **Vercel**, **CI/CD**, **Prisma migrations**, **security headers**, **monitoring**, and **Sentry**.

## Quick paths

| Target | Command / action |
| ------ | ---------------- |
| Vercel | Connect repo → set env → deploy (see below) |
| Docker Compose | `docker compose up --build` |
| Migrations only | `npm run db:migrate:deploy` or GitHub Action **Migrate** |
| Health | `GET /api/health` |

## Environment variables

Copy `.env.example` → `.env.local` (local) or project settings (Vercel / Docker).

| Variable | Required in prod | Purpose |
| -------- | ---------------- | ------- |
| `DATABASE_URL` | Yes | Postgres connection string |
| `NEXT_PUBLIC_APP_URL` | Yes | Canonical site URL (HTTPS) |
| `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` | Recommended | Auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended | Server admin auth tasks |
| Stripe / PayPal keys | For billing | Payments |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | Recommended | Error tracking |
| `SENTRY_AUTH_TOKEN` / `ORG` / `PROJECT` | Optional | Source map upload |

Validate locally:

```bash
npm run env:check
npm run env:check -- --strict   # fails if DATABASE_URL / APP_URL missing
```

## Vercel deployment

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. Framework preset: **Next.js** (`vercel.json` included).
3. Add all production env vars (Production + Preview as needed).
4. Build command: `prisma generate && next build` (or default `npm run build` after `postinstall`).
5. Set **Install Command** to `npm ci` (default is fine).
6. After first deploy with a live `DATABASE_URL`, run migrations:
   - Vercel CLI: `vercel env pull` then `npm run db:migrate:deploy`
   - Or GitHub Action **Migrate (manual)** with `DATABASE_URL` secret
7. Configure webhooks:
   - Stripe → `{APP_URL}/api/stripe/webhook`
   - PayPal → `{APP_URL}/api/paypal/webhook`
8. Supabase Auth redirect: `{APP_URL}/auth/callback`

`@vercel/analytics` and `@vercel/speed-insights` are wired in the root layout (no extra config on Vercel).

## Docker

Multi-stage image uses Next.js **`output: "standalone"`**.

```bash
# App + Postgres
cp .env.example .env.local
# Edit DATABASE_URL to use host "db":
# DATABASE_URL=postgresql://postgres:postgres@db:5432/tradebib?schema=public

docker compose up --build
```

- Entrypoint runs `prisma migrate deploy` when `RUN_MIGRATIONS=true` (default) and `DATABASE_URL` is set.
- Healthcheck hits `/api/health`.
- Image only: `docker build -t tradebib . && docker run --env-file .env.local -p 3000:3000 tradebib`
- Local production serve after build: `npm start` (standalone runner; use `npm run start:next` only without `output: "standalone"`).

## Database migrations

```bash
npm run db:migrate          # create/apply in development
npm run db:migrate:deploy   # apply pending migrations (CI / prod / Docker)
npm run db:seed             # optional demo data
```

CI: `.github/workflows/migrate.yml` (workflow_dispatch) uses `secrets.DATABASE_URL`.

Never use `db:push` against production — always migrate.

## CI/CD

`.github/workflows/ci.yml` on push/PR:

1. Lint · typecheck · Vitest  
2. Production build  
3. Playwright smoke (after build)  
4. Docker image build (push only)

Required GitHub secret for migrate workflow: `DATABASE_URL`.

## Security headers

Configured in `next.config.ts` (and mirrored lightly in `vercel.json`):

- `Content-Security-Policy` (Supabase, Stripe, PayPal, TradingView, Sentry, Vercel)
- `Strict-Transport-Security` (production)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `poweredByHeader: false`

## Monitoring

| Signal | Endpoint / tool |
| ------ | --------------- |
| Liveness / readiness | `GET /api/health` — DB ping, env readiness, latency |
| Web vitals | Vercel Speed Insights |
| Traffic | Vercel Analytics |
| Docker | `HEALTHCHECK` → `/api/health` |

Example healthy payload:

```json
{
  "status": "ok",
  "checks": { "database": "up", "sentry": true, "appUrl": true }
}
```

`status: error` → HTTP 503 (DB down). `degraded` → 200 with warnings.

## Error tracking (Sentry)

1. Create a Sentry project (Next.js).
2. Set `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN`.
3. Optional source maps: `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`.
4. Client/server/edge init via `instrumentation.ts`, `instrumentation-client.ts`, and `sentry.*.config.ts`.
5. `app/error.tsx` + `app/global-error.tsx` call `Sentry.captureException`.

Without a DSN, Sentry stays disabled and `withSentryConfig` is not applied (faster local builds).

## Production checklist

- [ ] `DATABASE_URL` points at managed Postgres (SSL)
- [ ] `NEXT_PUBLIC_APP_URL` is HTTPS canonical URL
- [ ] Migrations applied (`db:migrate:deploy`)
- [ ] Supabase redirects + providers enabled
- [ ] Stripe/PayPal webhooks live
- [ ] Sentry DSN set; verify a test error
- [ ] `/api/health` returns `ok` with `database: up`
- [ ] CI green on `main`
