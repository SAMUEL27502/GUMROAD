# TradeBib — Performance

Optimizations applied across lazy loading, images, code splitting, caching, prefetching, and bundles.

## Lazy loading

- Chart-heavy UI loads via `next/dynamic` (`ssr: false`) in `src/components/performance/lazy-charts.tsx`:
  - `DashboardChartsLazy` (Recharts)
  - `TradingViewChartLazy` (TradingView widget)
  - `BotComparisonLazy` (compare charts)
- Sonner `Toaster` is dynamically imported in `providers/providers.tsx` so toast UI is not in the critical path.

## Image optimization

- `next/image` on marketplace `BotCard` with `fill`, responsive `sizes`, and `loading="lazy"`.
- `next.config.ts` enables AVIF/WebP, tuned `deviceSizes` / `imageSizes`, and `remotePatterns` for Unsplash / CDN / Google avatars.

## Code splitting

- Heavy chart modules are split into separate client chunks (dynamic imports above).
- `experimental.optimizePackageImports` for `lucide-react`, `date-fns`, and `recharts`.
- Blog `MarkdownContent` is a **server component** so `react-markdown` / `remark-gfm` stay off the client bundle.

## Caching

| Layer | Behavior |
| ----- | -------- |
| Next headers | Cache-Control for OG/Twitter images, `/api/bots`, `/api/affiliate`, `/_next/static` |
| Route `revalidate` | Blog posts, bot details, marketplace (3600s); affiliate API (300s) |
| API responses | Explicit `Cache-Control` on bots + affiliate JSON |
| React Query | `staleTime: 60s`, `gcTime: 5m`, no refetch on window focus |
| Middleware | Auth session work only on protected/auth routes — public pages skip Supabase |

## Prefetching

- Navbar/footer: light routes (`/marketplace`, `/pricing`, `/leaderboard`, …) keep default Link prefetch.
- Heavy client routes (`/charts`, `/dashboard`, `/compare`, `/mt5`, `/recommend`, …) use `prefetch={false}`.
- Global `X-DNS-Prefetch-Control: on` header.

## Bundle optimization

- Package import optimization (icons/charts/dates).
- Deferred chart + toast chunks.
- Server-only Markdown rendering for blog posts.

## Verify locally

```bash
npm run build
# Inspect route sizes / First Load JS in the build output
```
