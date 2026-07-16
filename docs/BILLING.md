# Billing (multi-provider)

UI: `/billing`  
Unified API: `POST/GET /api/billing`  
Providers: Stripe · PayPal (same `PaymentProvider` interface)

## Architecture

| Layer        | Path                                      |
| ------------ | ----------------------------------------- |
| Types        | `src/lib/payments/types.ts`               |
| Registry     | `src/lib/payments/index.ts`               |
| Stripe adapter | `src/lib/payments/stripe-provider.ts`   |
| PayPal adapter | `src/lib/payments/paypal-provider.ts`   |
| Client store | `src/stores/billing-store.ts`             |

## Capabilities (both providers)

Checkout · Portal/Manage · Invoices · Status · Upgrade · Downgrade · Cancel · Webhooks

Provider-specific routes remain available:

- `/api/stripe/*`
- `/api/paypal/*`

Docs: `docs/STRIPE.md` · `docs/PAYPAL.md`
