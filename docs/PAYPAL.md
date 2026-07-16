# PayPal Subscriptions

UI: `/billing` (provider toggle) · APIs: `/api/paypal/*` + unified `/api/billing`  
Config: `src/lib/paypal/config.ts` · Client: `src/lib/paypal/server.ts`  
Adapter: `src/lib/payments/paypal-provider.ts`

## Reusable architecture

```
PaymentProvider (interface)
├── stripe-provider.ts
└── paypal-provider.ts
         ▲
   getPaymentProvider(id)
         ▲
   /api/billing  ·  /api/stripe/*  ·  /api/paypal/*
```

Shared types live in `src/lib/payments/types.ts` (`CheckoutInput`, `PortalResult`, `SubscriptionUpdateInput`, etc.).

## Includes

| Feature             | Status                                                      |
| ------------------- | ----------------------------------------------------------- |
| Checkout            | ✅ Create PayPal Billing Subscription + approve URL         |
| Customer Portal     | ✅ Manage panel (PayPal has no Stripe-style portal)         |
| Invoices            | ✅ Tracked in billing store (live search optional)          |
| Subscription Status | ✅ On `/billing`                                            |
| Upgrade / Downgrade | ✅ `revise` / cancel-to-Starter                             |
| Cancel / Resume     | ✅ cancel + activate                                        |
| Webhook handling    | ✅ `/api/paypal/webhook` (`BILLING.SUBSCRIPTION.*`)         |

## Env

```
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox
PAYPAL_PLAN_PRO_MONTHLY=
PAYPAL_PLAN_PRO_YEARLY=
PAYPAL_PLAN_ELITE_MONTHLY=
PAYPAL_PLAN_ELITE_YEARLY=
PAYPAL_WEBHOOK_ID=
```

Webhook URL: `{NEXT_PUBLIC_APP_URL}/api/paypal/webhook`

See also: `docs/STRIPE.md`, `docs/BILLING.md`
