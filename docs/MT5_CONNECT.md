# MT5 Connect

Route: `/mt5` · Page: `src/app/mt5/page.tsx`  
Validation: `mt5ConnectSchema` in `src/lib/validations.ts`  
Store: `useMt5AccountsStore`

## Includes

| Feature              | Status                                                    |
| -------------------- | --------------------------------------------------------- |
| Broker               | ✅ Select from popular brokers (+ Other)                  |
| Server               | ✅ Broker-specific servers or free-text for Other         |
| Login                | ✅ Numeric MT5 login                                      |
| Investor Password    | ✅ Password field (read-only access)                      |
| Nickname             | ✅ Required                                               |
| Validation           | ✅ Zod + react-hook-form                                  |
| Connection cards     | ✅ `Mt5AccountCard` — Broker, Balance, Equity, Margin, Profit, Open Trades, Recent Orders, Disconnect |
| Recent Trades        | ✅ Synced trade table                                     |
| Connection steps     | ✅ 4-step guide                                           |
| Sync / Disconnect    | ✅ Card actions                                           |

Summary strip above the form aggregates connected Balance, Equity, and Free Margin.

See also: `docs/MT5_ACCOUNT_CARDS.md`
