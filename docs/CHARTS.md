# TradingView Charts

Route: `/charts`  
Widget: `src/components/charts/tradingview-advanced-chart.tsx`  
Data: `src/lib/data/charts.ts`

## Includes

| Feature                         | Status                                      |
| ------------------------------- | ------------------------------------------- |
| TradingView Advanced Chart      | ✅ embed-widget-advanced-chart.js           |
| Dark theme                      | ✅ `theme: "dark"`, bg `#111827`            |
| Tabs — Forex / Metals / Crypto  | ✅ top tabs + category sidebar              |
| EURUSD GBPUSD USDJPY AUDUSD     | ✅ Forex                                    |
| XAUUSD XAGUSD                   | ✅ Metals                                   |
| BTCUSD ETHUSD                   | ✅ Crypto                                   |
| Timeframes                      | ✅ 1m · 5m · 15m · 1H · 4H · 1D · 1W        |
| Watchlist                       | ✅ persisted via `useWatchlistStore`        |

Switching a category tab auto-selects the first symbol in that market when the current symbol is out of category.
