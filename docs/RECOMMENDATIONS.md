# AI Bot Recommendation Engine

Personalized EA matching at `/recommend`.

## Inputs

| Input | Options | Weight |
| ----- | ------- | ------ |
| Risk tolerance | LOW / MEDIUM / HIGH | 30% |
| Capital | Under $500 · $500–$2k · $2k–$10k · $10k+ | 15% |
| Experience | Beginner · Intermediate · Advanced | 20% |
| Trading style | Scalping, Trend, Grid, Mean Reversion, Swing, Breakout, Hedging, Range, Hybrid | 20% |
| Favorite pairs | Majors, metals, crypto, indices | 15% |

## Scoring

Logic lives in `src/lib/recommendations/bot-recommender.ts`:

- Exact risk match scores highest; adjacent risk gets partial credit; drawdown modulates conservative profiles.
- Capital bands prefer affordable subscription prices and safer profiles for small accounts.
- Experience biases beginners toward LOW risk / stable strategies and advanced traders toward higher ROI systems.
- Styles resolve through aliases (e.g. Swing ↔ Trend Following / Range).
- Pairs match `tradingPair`, tags, and soft category signals (Metals / Crypto / Forex basket).

Results include match %, per-factor breakdown bars, and human-readable reasons.

## UI

- Multi-step quiz with progress bar
- Persisted preferences via Zustand (`tradebib-recommendations`)
- Top matches rendered with `BotCard` + score breakdown
- Linked from navbar, footer, marketplace, and dashboard quick actions

## Files

- `src/lib/recommendations/bot-recommender.ts`
- `src/stores/recommendation-store.ts`
- `src/components/recommend/recommendation-engine.tsx`
- `src/app/recommend/page.tsx`
