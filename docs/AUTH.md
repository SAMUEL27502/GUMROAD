# TradeBib Authentication

## Features

| Feature               | Status                                    |
| --------------------- | ----------------------------------------- |
| Login                 | ✅ `/login`                               |
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

- `/dashboard`
- `/profile`
- `/mt5`
- `/admin/*`
- `/journal`
- `/referrals`

Unauthenticated users are redirected to `/login?next=…`.

## Setup (production)

1. Create a Supabase project.
2. Copy URL + anon key into `.env.local`.
3. Enable **Email**, **Google**, and **GitHub** providers.
4. Add redirect URL: `https://your-domain/auth/callback`
5. (Optional) Confirm email template links to `/auth/callback?next=/auth/verified`

## Demo mode

If Supabase keys are placeholders, TradeBib uses a secure **httpOnly demo session cookie**.

```bash
# Any email works. Include "admin" for admin role:
# admin@tradebib.com / Password1
```

## Key files

- `src/middleware.ts` — route protection + session refresh
- `src/lib/supabase/*` — browser/server/middleware clients
- `src/app/actions/auth.ts` — server actions
- `src/providers/auth-provider.tsx` — client session sync
- `src/stores/auth-store.ts` — UI auth state
