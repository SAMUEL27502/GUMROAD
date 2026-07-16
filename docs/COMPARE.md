# Bot Comparison

Side-by-side EA comparison at `/compare`.

## Features

| Area | Details |
| ---- | ------- |
| Multi-bot select | Compare 2–4 bots; sticky picker; URL sync via `?bots=slug1,slug2` |
| Performance | Head-to-head bars + table: ROI, max drawdown, win rate, profit factor, rating, subscribers |
| ROI / Drawdown / Win Rate | Winner scorecards + normalized bars (lower drawdown = longer bar) |
| Charts | Equity, ROI, drawdown overlays; monthly grouped bars; snapshot bars |
| Pricing | Monthly, annual, price per 1% ROI, pricing cards with subscribe CTAs |
| Share | Copy comparison deep link; marketplace cards link into compare |

## Files

- `src/app/(marketing)/compare/page.tsx`
- `src/components/compare/bot-comparison.tsx`
- `src/components/compare/metric-bars.tsx`
- `src/lib/compare/comparison-utils.ts`

## Deep links

```text
/compare?bots=goldscalper-pro,eurotrend-ai,breakouthunter
```
