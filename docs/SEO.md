# SEO

Site-wide search optimization for TradeBib.

## Coverage

| Area | Implementation |
| ---- | -------------- |
| Metadata | `createMetadata()` in `src/lib/seo.ts` + page/layout exports |
| Structured Data | Organization, WebSite, Article, SoftwareApplication, BreadcrumbList |
| Open Graph | Title, description, URL, siteName, images via `/opengraph-image` |
| Twitter Cards | `summary_large_image` with shared OG image |
| Sitemap | Public routes + all bots + all blog posts (`src/app/sitemap.ts`) |
| Robots.txt | Allows public pages; disallows admin/auth/private/API (`src/app/robots.ts`) |

## Key files

- `src/lib/seo.ts`
- `src/components/seo/json-ld.tsx`
- `src/app/layout.tsx` (`metadataBase`, default OG/Twitter)
- `src/app/opengraph-image.tsx` / `twitter-image.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`

## Private routes

These are `noindex` and excluded from the sitemap:

`/dashboard`, `/billing`, `/profile`, `/notifications`, `/referrals`, `/affiliate`, `/login`, `/register`, `/admin`, `/design-system`, `/animations`, auth flows.
