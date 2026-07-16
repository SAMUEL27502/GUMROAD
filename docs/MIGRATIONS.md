# Database migrations & seed

## Migration

Initial migration: `prisma/migrations/20260716000736_init_tradebib_schema/migration.sql`

Creates all TradeBib tables (users, bots, subscriptions, reviews, favorites, connected_accounts, trades, payments, notifications, bot_performances, referrals, referral_commissions, referral_payouts, platform_subscriptions, …).

```bash
npm run db:migrate          # create/apply in development
npm run db:migrate:deploy   # apply in CI/production / Docker entrypoint
```

## Production

- Docker entrypoint runs `prisma migrate deploy` when `RUN_MIGRATIONS=true` (default).
- GitHub Action: **Migrate (manual)** (`.github/workflows/migrate.yml`) with `DATABASE_URL` secret.
- Vercel: run `npm run db:migrate:deploy` against Production env after first deploy (or use the Action).
- Do **not** use `db:push` in production.

See [`docs/DEPLOYMENT.md`](DEPLOYMENT.md).

## Seed — 50 sample bots

Script: `prisma/seed.ts`

| Entity              | Count |
| ------------------- | ----- |
| Categories          | 4     |
| Bots                | **50** |
| Bot performance rows| 300 (6 months × 50) |
| Admin user          | 1 (`admin@tradebib.com`) |

```bash
npm run db:seed
# or full reset:
npm run db:reset
```

Bots span Forex, Metals, Crypto, and Indices with LOW/MEDIUM/HIGH risk grades.
