# Stripe Subscriptions

UI: `/billing` · APIs: `/api/stripe/*`  
Config: `src/lib/stripe/config.ts` · Client: `src/lib/stripe/server.ts`  
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

Without `STRIPE_SECRET_KEY`, endpoints run in **demo mode** (Checkout redirects to `/billing?checkout=success`, portal opens demo toast). With keys + Price IDs, live Stripe Checkout / Portal / Subscription updates are used.

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
Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.paid`, `invoice.payment_failed`
