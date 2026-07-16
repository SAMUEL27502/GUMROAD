# Stripe Subscriptions

UI: `/billing` · APIs: `/api/stripe/*` + unified `/api/billing`  
Config: `src/lib/stripe/config.ts` · Client: `src/lib/stripe/server.ts`  
Adapter: `src/lib/payments/stripe-provider.ts` (implements shared `PaymentProvider`)  
Store (demo): `src/stores/billing-store.ts`

## Includes

| Feature            | Status                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| Checkout           | ✅ `POST /api/stripe/checkout` → Stripe Checkout Session               |
| Customer Portal    | ✅ `POST /api/stripe/portal`                                           |
| Invoices           | ✅ Listed on `/billing` (+ `GET /api/stripe/invoices` when live)       |
| Subscription Status| ✅ Plan · status · interval · period end                               |
| Upgrade            | ✅ `POST /api/stripe/subscription` action `upgrade`                    |
| Downgrade          | ✅ action `downgrade` (Starter = cancel at period end)                 |
| Cancel             | ✅ `cancel_at_period_end` + Resume                                     |
| Webhook handling   | ✅ `POST /api/stripe/webhook` (signature verified when secret set)     |

## Demo vs live

Without `STRIPE_SECRET_KEY`, endpoints run in **demo mode**. With keys + Price IDs, live Stripe Checkout / Portal / Subscription updates are used.

## Env

```
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_YEARLY=
STRIPE_PRICE_ELITE_MONTHLY=
STRIPE_PRICE_ELITE_YEARLY=
```

Webhook URL: `{NEXT_PUBLIC_APP_URL}/api/stripe/webhook`

See also: `docs/PAYPAL.md`, `docs/BILLING.md`
