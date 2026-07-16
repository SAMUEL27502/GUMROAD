# Prisma Schema

File: `prisma/schema.prisma` · Client: `src/lib/prisma.ts`  
Database: PostgreSQL

## Required tables

| Table / model            | Status | Notes                                              |
| ------------------------ | ------ | -------------------------------------------------- |
| Users (`users`)          | ✅     | Plan, Stripe/PayPal IDs, referral code + self-ref  |
| Bots (`bots`)            | ✅     | Marketplace EAs                                    |
| Subscriptions            | ✅     | Bot marketplace subscriptions                      |
| Reviews                  | ✅     | Unique per user/bot                                |
| Favorites                | ✅     | Wishlist                                           |
| Connected Accounts       | ✅     | MT5 investor links                                 |
| Trades                   | ✅     | `TradeSide` / `TradeStatus` enums                  |
| Payments                 | ✅     | Stripe / PayPal / Manual                           |
| Notifications            | ✅     | Includes REFERRAL + PAYMENT types                  |
| Bot Performance          | ✅     | Daily equity / ROI / drawdown                      |
| Referral Program         | ✅     | `Referral` · `ReferralCommission` · `ReferralPayout` |

## Also included

- `PlatformSubscription` — SaaS Starter/Pro/Elite billing
- `JournalEntry`, `WatchlistItem`, `ApiKey`, `Category`

## Referral Program models

```
User (referrer)
  └── Referral → User (referred)
        └── ReferralCommission → Payment?
User
  └── ReferralPayout
```

Tiers: `STARTER` (15%) · `PARTNER` · `ELITE` via `ReferralTier` + `commissionRate` on User.

## Commands

```bash
npm run db:generate
npm run db:push
# or
npm run db:migrate
```
