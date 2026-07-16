# Prisma Schema

File: `prisma/schema.prisma` · Client: `src/lib/prisma.ts`  
Database: PostgreSQL  
Migration: `prisma/migrations/20260716000736_init_tradebib_schema/`  
Seed: `prisma/seed.ts` (**50 sample bots**)

## Required tables

| Table / model            | Status | Notes                                              |
| ------------------------ | ------ | -------------------------------------------------- |
| Users (`users`)          | ✅     | Plan, Stripe/PayPal IDs, referral code + self-ref  |
| Bots (`bots`)            | ✅     | Marketplace EAs — **50 seeded**                    |
| Subscriptions            | ✅     | Bot marketplace subscriptions                      |
| Reviews                  | ✅     | Unique per user/bot                                |
| Favorites                | ✅     | Wishlist                                           |
| Connected Accounts       | ✅     | MT5 investor links                                 |
| Trades                   | ✅     | `TradeSide` / `TradeStatus` enums                  |
| Payments                 | ✅     | Stripe / PayPal / Manual                           |
| Notifications            | ✅     | Includes REFERRAL + PAYMENT types                  |
| Bot Performance          | ✅     | Daily equity / ROI / drawdown — **300 seeded**     |
| Referral Program         | ✅     | `Referral` · `ReferralCommission` · `ReferralPayout` |

## Also included

- `PlatformSubscription` — SaaS Starter/Pro/Elite billing
- `JournalEntry`, `WatchlistItem`, `ApiKey`, `Category` (4 seeded)

## Commands

```bash
npm run db:migrate          # dev
npm run db:migrate:deploy   # prod
npm run db:seed             # 50 bots + categories + admin + performance
npm run db:reset            # migrate reset + seed
npm run db:generate
npm run db:studio
```

See also: `docs/MIGRATIONS.md`
