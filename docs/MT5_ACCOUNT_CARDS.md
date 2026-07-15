# MT5 Account Cards

Component: `src/components/mt5/mt5-account-card.tsx`  
Used on: `/mt5`

## Displays

| Field          | Status                                      |
| -------------- | ------------------------------------------- |
| Broker         | ✅ Primary label under nickname             |
| Balance        | ✅                                          |
| Equity         | ✅                                          |
| Margin         | ✅ Free margin                              |
| Profit         | ✅ Floating P/L (`equity − balance`)        |
| Open Trades    | ✅ Count                                    |
| Recent Orders  | ✅ Per-account order list                  |
| Disconnect     | ✅ (+ Sync / Reconnect / Remove)            |

Data: `connectedAccounts` in `src/lib/data/platform.ts` (`openTrades`, `recentOrders`).
