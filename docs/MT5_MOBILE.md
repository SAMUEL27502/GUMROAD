# MT5 Mobile Terminal

Route: `/mt5/mobile`  
Components: `src/components/mt5/mt5-mobile-terminal.tsx`, `mt5-mobile-chart.tsx`  
Data: `src/lib/data/mt5-mobile.ts`

## Overview

Phone-framed MetaTrader 5 mobile UI inside TradeBib — Quotes, Chart, Trade, History, and More — inspired by the official [MetaTrader 5](https://www.metatrader5.com) mobile apps.

## Includes

| Feature | Status |
| ------- | ------ |
| Quotes board (Bid/Ask, spread, tick clock) | ✅ Demo live ticks |
| Candlestick chart + timeframe chips | ✅ SVG preview |
| One-click Buy/Sell panel → Trade tab | ✅ UI only |
| Trade account summary + positions | ✅ Uses connected MT5 account when present |
| History (closed deals) | ✅ Seed deals |
| More → Accounts / Settings / official site | ✅ |
| Link from MT5 Connect | ✅ |

## Notes

- Demo preview — not a live broker WebTerminal.
- Investor-synced balance/equity come from `useMt5AccountsStore` when an account is connected.
- Official apps remain on [metatrader5.com](https://www.metatrader5.com).
