# MT5 Code Lab (Education & Analysis)

Public education surface at **`/learn`** with shareable MetaTrader 5 (MQL5) samples for study, Strategy Tester experiments, and performance analysis.

## Features

| Feature | Details |
| ------- | ------- |
| Sample library | Expert Advisors, indicators, scripts, analyzers |
| Code viewer | Syntax-ready monospace block with copy |
| Downloads | `.mq5` files under `/public/mt5-education/` |
| Filters | Kind tabs (All / EA / Indicator / Script / Analyzer) |
| Risk framing | Demo-first disclaimer; trading disabled by default in the lab EA |

## Files

- `src/lib/data/mt5-education.ts` — sample metadata + source
- `src/components/mt5/mt5-code-lab.tsx` — interactive lab UI
- `src/app/(marketing)/learn/` — route + SEO metadata
- `public/mt5-education/*.mq5` — downloadable sources

## Samples

1. **MA Crossover Lab EA** — new-bar signals, fixed fractional risk, `EnableTrading=false` by default  
2. **RSI Structure Marker** — RSI + pivot markers for structure study  
3. **Position Risk Sizer** — lot sizing from equity / stop / risk %  
4. **Deal History Analyzer** — win rate, profit factor, streaks from account history  
5. **MTF Trend Bias** — D1/H4/H1 EMA alignment score for top-down analysis  

## How to use in MetaTrader 5

1. Open `/learn`, copy or download a `.mq5` file  
2. In MT5: **File → Open Data Folder → MQL5 → Experts / Indicators / Scripts**  
3. Paste the file, compile in MetaEditor  
4. Attach on a **demo** chart or run in the Strategy Tester  

## Disclaimer

Educational material only. Not investment advice. Trading involves risk of loss.
