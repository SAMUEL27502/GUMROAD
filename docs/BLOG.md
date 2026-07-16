# Blog

Content hub at `/blog` with post pages at `/blog/[slug]`.

## Features

| Feature | Details |
| ------- | ------- |
| Categories | Guides, Risk, Markets, Infrastructure, Analytics, Product |
| Search | Title, excerpt, author, tags, and Markdown body |
| SEO | Page metadata, canonical, Open Graph, Article JSON-LD, sitemap posts |
| Markdown | `react-markdown` + `remark-gfm` (tables, lists, code, links) |
| Reading time | Calculated from content via `reading-time` |

## Files

- `src/lib/data/blog.ts`
- `src/components/blog/blog-index.tsx`
- `src/components/blog/markdown-content.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/sitemap.ts` (includes post URLs)
