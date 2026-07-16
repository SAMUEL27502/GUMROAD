# TradeBib — Extended features

Post-core product surfaces shipped on the platform.

| Feature | Route | Status |
| ------- | ----- | ------ |
| Economic Calendar | `/calendar` | Live (seed events) |
| Forex News Feed | `/news` | Live (seed feed) |
| AI Trade Journal | `/journal` | Live + AI coaching insights |
| Portfolio Heatmap | `/heatmap` | Live |
| VPS Hosting Dashboard | `/vps` | Live (instances + catalog) |
| Trading Signals | `/signals` | Live |
| Telegram Alerts | `/alerts` | Demo connect `@TradeBibAlertsBot` |
| Email Alerts | `/alerts` + Profile prefs | Live toggles |
| Mobile PWA | `manifest.webmanifest` + `sw.js` | Installable shell |
| Multi-language | Locale switcher (EN/ES/DE/FR) | Client dictionaries |
| Admin Analytics | `/admin/analytics` | Live |
| Coupon System | `/admin/coupons` + Billing redeem | Admin CRUD + checkout apply |
| KYC Verification | `/kyc` | Guided demo wizard |
| Broker Directory | `/brokers` | Live directory |
| Public Trader Profiles | `/traders/[handle]` | SSG profiles from leaderboard |
| Copy Trading Dashboard | `/copy` | Leaders + allocations |

## Data modules

`src/lib/data/{heatmap,vps,signals,brokers,copy-trading,kyc,alerts}.ts` plus leaderboard trader slugs.

## PWA

- Manifest: `/manifest.webmanifest`
- Icons: `/public/icons/*`
- Service worker: `/public/sw.js` (registered in production via `PwaRegister`)

## i18n

- Dictionaries: `src/lib/i18n/dictionaries.ts`
- Persist locale: `src/store/locale-store.ts`
- UI: `LocaleSwitcher` in navbar
