# TradeBib Design System

Live gallery: **`/design-system`**

Barrel import: `@/components/design-system`

## Principles

- **Font:** Inter
- **Theme:** Dark by default (`#020617` background, `#111827` cards)
- **Accents:** Sky `#0EA5E9` · Blue `#2563EB` · Success `#22C55E` · Danger `#EF4444`
- **Style:** Glassmorphism, soft shadows, rounded-xl controls — Stripe/Vercel SaaS feel

## Checklist

| Component                                                    | Location                        | Status |
| ------------------------------------------------------------ | ------------------------------- | ------ |
| Typography                                                   | `ui/typography.tsx` + CSS scale | ✅     |
| Buttons                                                      | `ui/button.tsx`                 | ✅     |
| Cards (default/glass/outline)                                | `ui/card.tsx`                   | ✅     |
| Forms (input, textarea, select, checkbox, switch, FormField) | `ui/*`                          | ✅     |
| Badges                                                       | `ui/badge.tsx`                  | ✅     |
| Tables                                                       | `ui/table.tsx`                  | ✅     |
| Dropdowns                                                    | `ui/dropdown-menu.tsx`          | ✅     |
| Navbar                                                       | `layout/navbar.tsx`             | ✅     |
| Footer                                                       | `layout/footer.tsx`             | ✅     |
| Sidebar                                                      | `layout/sidebar.tsx`            | ✅     |
| Loading Skeletons                                            | `ui/skeleton.tsx`               | ✅     |
| Empty States                                                 | `ui/empty-state.tsx`            | ✅     |
| Charts                                                       | `ui/charts.tsx`                 | ✅     |
| Dialogs                                                      | `ui/dialog.tsx`                 | ✅     |
| Modals / Sheets                                              | `ui/sheet.tsx`                  | ✅     |
| Toasts                                                       | `ui/toast.tsx` + Sonner         | ✅     |

Also: Tabs, Progress, Accordion, Avatar, Separator, Loader.
