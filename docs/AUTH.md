# TradeBib Authentication

## Features

| Feature               | Status                                    |
| --------------------- | ----------------------------------------- |
| Login                 | ✅ `/login` → `/dashboard`                |
| Register              | ✅ `/register`                            |
| Forgot Password       | ✅ `/forgot-password`                     |
| Reset Password        | ✅ `/reset-password`                      |
| Email Verification    | ✅ `/auth/verify-email`, `/auth/verified` |
| OAuth Google / GitHub | ✅ via Supabase                           |
| Remember Me           | ✅ 30-day cookie preference               |
| JWT Sessions          | ✅ Supabase Auth cookies                  |
| User Profiles         | ✅ `/profile` + `updateProfileAction`     |
| Protected Routes      | ✅ middleware + client guards             |
| Auth Callback         | ✅ `/auth/callback`                       |

## Protected paths (middleware)

- `/dashboard`, `/profile`, `/mt5`, `/admin/*`
- `/journal`, `/referrals`, `/billing`, `/affiliate`, `/notifications`, `/kyc`

Unauthenticated users are redirected to `/login?next=…`.
Authenticated users on `/login` / `/register` are redirected to `/dashboard`.
Logout redirects to `/login`.

## Setup (production)

1. Create a Supabase project.
2. Copy **real** URL + anon key into `.env.local` (not `your-project` placeholders).
3. Enable **Email**, **Google**, and **GitHub** providers.
4. Add redirect URL: `https://your-domain/auth/callback`
5. Decide on email confirmation:
   - **Enabled** → signup sends users to `/auth/verify-email`; they must confirm before login.
   - **Disabled** (Auth → Providers → Email → Confirm email OFF) → signup creates a session and goes to `/dashboard` immediately.

## Demo mode

If Supabase keys are missing **or placeholders**, TradeBib uses a secure **httpOnly demo session cookie** (`tb_demo_session`).

Middleware uses the **same** `isSupabaseConfigured()` check as server actions so demo sessions are accepted on protected routes.

```bash
# Any email works. Include "admin" for admin role:
# admin@tradebib.com / Password1
```

## Key files

- `src/middleware.ts` — delegates to session helper
- `src/services/supabase/{client,server,middleware,config}.ts` — clients + guards
- `src/app/actions/auth.ts` — login / register / logout server actions
- `src/services/auth/sync-client.ts` — refresh client store after login
- `src/services/auth/errors.ts` — user-facing auth error mapping
- `src/providers/auth-provider.tsx` — client session sync
- `src/store/auth-store.ts` — UI auth state
