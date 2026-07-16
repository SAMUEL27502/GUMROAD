# Bot Comparison

Side-by-side EA comparison at `/compare`.

## Features

| Area | Details |
| ---- | ------- |
| Multi-bot select | Compare 2–4 bots; URL sync via `?bots=slug1,slug2` |
| Performance | ROI, max drawdown, win rate, profit factor, rating, subscribers |
| Pricing | Monthly, annual, price per 1% ROI, pricing summary cards |
| Charts | Equity, ROI, drawdown overlays; monthly grouped bars; snapshot bars |
| Winners | Highlight cards + “Best” badges for strongest metrics |

## Files

- `src/app/compare/page.tsx`
- `src/components/compare/bot-comparison.tsx`
- `src/lib/compare/comparison-utils.ts`

## Deep links

```text
/compare?bots=goldscalper-pro,eurotrend-ai,breakouthunter
```
