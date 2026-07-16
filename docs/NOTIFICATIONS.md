# Notification Center

In-app alerts at `/notifications`.

## Categories

| Category | Examples |
| -------- | -------- |
| Bot alerts | EA performance, drawdown watch, MT5 sync |
| Trade alerts | Open/close fills, stop losses |
| Subscription alerts | Renewals, payments, bot activations |
| Security alerts | Logins, password changes, email verification |

## Features

- Category cards + tabs
- Read / unread filter
- Mark read / unread / mark all read
- Remove notification
- Navbar bell preview (latest 5) + unread badge
- Dashboard preview card with “View all”
- Profile preference for security alerts

## Files

- `src/app/notifications/page.tsx`
- `src/components/notifications/notification-center.tsx`
- `src/lib/data/notifications.ts`
- `src/stores/notifications-store.ts`
- Prisma: `TRADE_ALERT`, `SECURITY` on `NotificationType`
