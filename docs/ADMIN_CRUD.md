# Admin CRUD

Shared helpers: `src/components/admin/crud-shared.tsx`  
Store: `src/stores/admin-crud-store.ts`  
Seed data: `src/lib/data/admin-crud.ts`

## Pages

| Entity        | Route                     | CRUD |
| ------------- | ------------------------- | ---- |
| Bots          | `/admin/bots`             | ✅ Create · Read · Update · Delete |
| Users         | `/admin/users`            | ✅ |
| Categories    | `/admin/categories`       | ✅ |
| Reviews       | `/admin/reviews`          | ✅ |
| Pricing       | `/admin/pricing`          | ✅ |
| Coupons       | `/admin/coupons`          | ✅ |
| Announcements | `/admin/announcements`    | ✅ |

Prisma models added for `Coupon` and `Announcement` (run `db:migrate` when applying schema changes).
