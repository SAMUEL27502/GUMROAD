# Reviews System

User-facing bot reviews with ratings, comments, helpful votes, and verified owner badges.

## Features

| Feature | Details |
| ------- | ------- |
| Ratings | 1–5 star input + distribution summary |
| Comments | Title + body with validation |
| Helpful votes | Toggle per signed-in user; sort by most helpful |
| Verified owner | Badge when reviewer has an active bot subscription |
| Moderation | Admin approve/edit at `/admin/reviews` |

## User flow

1. Open a bot detail page (`/bots/[slug]`).
2. Sign in and subscribe to unlock **Write review** with Verified owner badge.
3. Post rating + comment (one review per user/bot).
4. Anyone signed in can mark reviews **Helpful**.

## Files

- `src/lib/data/reviews.ts` — types + seed reviews
- `src/stores/reviews-store.ts` — Zustand persist (create/edit/delete/helpful)
- `src/components/reviews/*` — StarRating, ReviewCard, ReviewForm, ReviewSummary, HelpfulButton, VerifiedOwnerBadge, BotReviewsSection
- `src/app/api/bots/[slug]/reviews/route.ts` — GET/POST
- `src/app/api/reviews/[id]/helpful/route.ts` — helpful toggle
- Prisma: `Review.helpfulCount`, `Review.verifiedOwner`, `ReviewHelpfulVote`

## Schema

```prisma
model Review {
  rating          Int
  title           String
  content         String
  helpfulCount    Int      @default(0)
  verifiedOwner   Boolean  @default(false)
  verifiedOwnerAt DateTime?
  helpfulVotes    ReviewHelpfulVote[]
}

model ReviewHelpfulVote {
  reviewId String
  userId   String
  @@unique([reviewId, userId])
}
```
