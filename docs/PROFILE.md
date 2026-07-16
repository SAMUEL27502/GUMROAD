# User Profile Management

Route: **`/profile`** (middleware-protected)

## Features

| Capability           | Status | Notes                                                           |
| -------------------- | ------ | --------------------------------------------------------------- |
| Upload avatar        | ✅     | Image picker → data URL / Supabase metadata                     |
| Remove avatar        | ✅     |                                                                 |
| Update profile       | ✅     | Name via `updateProfileAction`                                  |
| Change password      | ✅     | Re-auth + `updateUser` (demo-safe)                              |
| Delete account       | ✅     | Type `DELETE` confirm · service-role hard delete when available |
| Manage notifications | ✅     | 6 preference toggles · persisted locally + server metadata      |
| View subscription    | ✅     | Platform plan + bot subscriptions cancel/reactivate             |
| Manage MT5 accounts  | ✅     | Rename, sync, disconnect, reconnect, remove                     |
| API keys             | ✅     | Generate / revoke (demo)                                        |

## Key files

- `src/app/profile/page.tsx` — UI
- `src/app/actions/profile.ts` — server actions
- `src/stores/notification-prefs-store.ts`
- `src/stores/mt5-accounts-store.ts`
- `src/stores/subscriptions-store.ts`
