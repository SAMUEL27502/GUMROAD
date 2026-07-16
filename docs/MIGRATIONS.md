# Database migrations & seed

## Migration

Initial migration: `prisma/migrations/20260716000736_init_tradebib_schema/migration.sql`

Creates all TradeBib tables (users, bots, subscriptions, reviews, favorites, connected_accounts, trades, payments, notifications, bot_performances, referrals, referral_commissions, referral_payouts, platform_subscriptions, …).

```bash
npm run db:migrate          # create/apply in development
npm run db:migrate:deploy   # apply in CI/production
```

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
