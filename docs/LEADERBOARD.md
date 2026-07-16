# Leaderboard

Public standings at `/leaderboard`.

## Boards

| Tab | Ranking |
| --- | ------- |
| Top traders | Traders by verified ROI (podium + table) |
| Top bots | Composite score: ROI, rating, win rate, subscribers |
| Most profitable | Bots by ROI + traders by realized profit |
| Most followed | Bots by subscribers + traders by followers |

## Files

- `src/app/leaderboard/page.tsx`
- `src/components/leaderboard/leaderboard-board.tsx`
- `src/lib/data/leaderboard.ts`

`platform.ts` re-exports `leaderboard` / `topTraders` for compatibility.
