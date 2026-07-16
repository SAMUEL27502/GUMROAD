# Affiliate Dashboard

Affiliate program UI at `/referrals` (alias `/affiliate`).

## Features

| Area | Details |
| ---- | ------- |
| Referral link | Unique code + copyable `/register?ref=` URL |
| Clicks | Source, landing path, country timeline |
| Conversions | Referred users, plan, status, commission earned |
| Commission | Ledger with pending / approved / paid |
| Withdrawals | Request payout + history |

## Files

- `src/app/referrals/page.tsx`
- `src/app/affiliate/page.tsx` → redirects to `/referrals`
- `src/components/affiliate/affiliate-dashboard.tsx`
- `src/lib/data/affiliate.ts`
- `src/stores/affiliate-store.ts`
- `src/app/api/affiliate/route.ts`
- Prisma: `ReferralClick` (+ existing `Referral`, `ReferralCommission`, `ReferralPayout`)
