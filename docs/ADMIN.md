# Admin Dashboard

Route: `/admin` · Page: `src/app/admin/page.tsx`  
Nav: Overview · Users · Bots · Subscriptions · Analytics  
Data: `src/lib/data/admin.ts`

## Includes

| Section         | Status                                              |
| --------------- | --------------------------------------------------- |
| Metrics         | ✅ Users · Revenue · Subscriptions · Bot approvals  |
| Revenue         | ✅ Metric + area chart                              |
| Users           | ✅ Metric + recent table + `/admin/users`           |
| Subscriptions   | ✅ Metric + `/admin/subscriptions`                  |
| Bot approvals   | ✅ Pending queue with Approve / Reject              |
| Charts          | ✅ Revenue area + Users bar on overview             |
| Analytics       | ✅ Overview charts + full `/admin/analytics`        |
| Recent activity | ✅ Event feed                                       |

Protected path — demo admin emails containing `admin`.

See also: `docs/ADMIN_CRUD.md` for Bots · Users · Categories · Reviews · Pricing · Coupons · Announcements.
