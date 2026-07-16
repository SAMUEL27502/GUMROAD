# Bot Details

Page: `/bots/[slug]` · Component: `src/components/bots/bot-details.tsx`

## Includes

| Section            | Status                                                              |
| ------------------ | ------------------------------------------------------------------- |
| Large hero         | ✅ Gradient artwork, badges, rating, subscribers, price             |
| Performance charts | ✅ Equity, ROI, drawdown, monthly returns (Recharts tabs)           |
| Monthly returns    | ✅ Bar chart tab                                                    |
| Drawdown           | ✅ Area chart tab + key metric                                      |
| Trade history      | ✅ Deterministic sample table via `getBotTradeHistory`              |
| Reviews            | ✅ Star ratings + comments                                          |
| FAQ                | ✅ Accordion                                                        |
| Deploy button      | ✅ Queues toast → `/mt5`                                            |
| Subscribe button   | ✅ Persists via `useSubscriptionsStore.subscribe`                   |
| Wishlist           | ✅ Favorites store                                                  |
| Bottom CTA         | ✅ Subscribe + Deploy + cancel when active                          |

## Data

- Bot payload: `src/lib/data/bots.ts` (`getBotBySlug`)
- Trade history: `getBotTradeHistory(bot)` → `BotTrade[]`
