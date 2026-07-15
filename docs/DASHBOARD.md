# Dashboard

Route: `/dashboard` · Page: `src/app/dashboard/page.tsx`  
Protected by auth middleware + client auth store redirect.

## Sections

| Section                | Status                                                              |
| ---------------------- | ------------------------------------------------------------------- |
| Overview cards         | ✅ Balance, Monthly ROI, Total Profit, Active Bots                  |
| Portfolio performance  | ✅ Tabbed Recharts (see `docs/DASHBOARD_CHARTS.md`)                 |
| Risk allocation        | ✅ Donut in charts + bot allocation bars                            |
| Recent trades          | ✅ Table from `recentTrades`                                        |
| Active bots            | ✅ From subscriptions store (fallback seeded slugs)                 |
| Notifications          | ✅ Unread badges + links                                            |
| Quick actions          | ✅ Marketplace, MT5, Charts, Billing                                |
| Watchlist              | ✅ Persisted via `useWatchlistStore`                                |
| Market overview        | ✅ Movers from `watchlistSymbols` with star toggle                  |
| Recent activity        | ✅ Timeline                                                         |
| Monthly profits        | ✅ Recharts bar + list                                              |
| ROI / Balance / DD     | ✅ Dedicated chart tabs                                             |

## Data

- Metrics / charts / trades / notifications: `src/lib/data/platform.ts`
- Active bots: `useSubscriptionsStore` + `bots`
- Watchlist: `useWatchlistStore` + `watchlistSymbols`
