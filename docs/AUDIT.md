# TradeBib UI & production audit

Audit date: 2026-07-16. Findings addressed in the same PR pass.

## Goals

UI consistency · spacing · responsiveness · accessibility · dedupe · component optimization · production readiness

## Shared primitives added

| Component | Path | Purpose |
| --------- | ---- | ------- |
| `Container` | `src/components/layout/container.tsx` | Shared max-width + gutters + vertical pad tokens |
| `PageHeader` | `src/components/layout/page-header.tsx` | Badge/eyebrow + h1 + description + actions |
| `Section` | `src/components/layout/section.tsx` | One-job marketing section chrome |
| `MetricCard` / `StatGrid` | `src/components/ui/metric-card.tsx` | Dashboard/stat grids |
| `AuthShell` / `OAuthButtons` | `src/components/forms/auth-shell.tsx` | Auth page shell + social buttons |

Adopted on marketplace, pricing, blog index, navbar/footer, login, register, landing hero.

## Accessibility fixes

- Skip link → `#main-content`
- Navbar: `aria-expanded` / `aria-controls`, Escape close, body scroll lock, `aria-current`, icon button labels, synced active matching
- Badge → `<span>` (valid nesting)
- EmptyState title defaults to `<p>` (no false `h4` in cards)
- Loader `role="status"` + sr-only label
- Pagination `<nav aria-label>` + page labels
- FormField `role="alert"` on errors
- Marketplace filters: labelled selects, `aria-pressed` categories, chip dismiss labels, live region for counts
- Blog categories: `aria-pressed`
- Auth pages: real `<h1>`
- Footer column titles → `<p>` (no skipped heading levels)
- `prefers-reduced-motion` in CSS; PageHeader/AuthShell respect `useReducedMotion`
- Button / Select focus-visible + ring-offset

## Spacing & responsiveness

- Consistent `Container` padY tokens (`sm`/`md`/`lg`/`xl`)
- PageHeader vertical rhythm (`mb-8 sm:mb-10`)
- EmptyState compact padding option
- Logo mark scales with size prop
- Mobile nav CTAs remain in disclosure panel

## Deduped / optimized

- Removed duplicate Recommend footer link; trimmed design-system/animations from footer Tools
- Login/register share AuthShell + OAuthButtons + FormField
- Marketplace/pricing/blog drop one-off header/motion boilerplate
- Landing hero: brand-first TradeBib display + single CTA pair (marketplace + recommend)

## Production readiness (already + this pass)

- Docker / Vercel / CI / Sentry / `/api/health` / security headers — see `docs/DEPLOYMENT.md`
- Middleware safe without Supabase keys
- CSP + HSTS in `next.config.ts`
- Unit + Playwright suites green after changes

## Follow-ups (not blocking)

- Roll `Container`/`PageHeader` through remaining marketing/admin pages
- Adopt `FormField` on profile/MT5/contact
- Optional light-theme polish (root still defaults `className="dark"`)
- Demote framer-motion on static legal/about pages to RSC shells
