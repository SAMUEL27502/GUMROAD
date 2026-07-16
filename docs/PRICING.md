# Pricing

Route: `/pricing` · Page: `src/app/pricing/page.tsx`  
Data: `pricingPlans`, `pricingComparison` in `src/lib/data/platform.ts`

## Includes

| Feature              | Status                                              |
| -------------------- | --------------------------------------------------- |
| Starter / Pro / Elite| ✅                                                   |
| Feature comparison   | ✅ Comparison table                                 |
| Monthly/yearly switch| ✅ Toggle + ~17% yearly savings                     |
| Animated pricing cards | ✅ Framer Motion enter / hover / price crossfade  |
| CTA buttons          | ✅ Per-card + bottom Start Free / Go Pro / Go Elite |

Yearly prices: Pro `$290/yr`, Elite `$790/yr` (displayed as monthly equivalent).

Paid CTAs route to `/billing?intent=checkout` (Stripe or PayPal via reusable providers — see `docs/BILLING.md`).
