import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  seedReviews,
  type BotReview,
  type CreateReviewInput,
  type ReviewRating,
} from "@/lib/data/reviews";

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function clampRating(rating: number): ReviewRating {
  const n = Math.round(rating);
  if (n <= 1) return 1;
  if (n >= 5) return 5;
  return n as ReviewRating;
}

interface ReviewsState {
  reviews: BotReview[];
  getBotReviews: (botId: string, opts?: { includePending?: boolean }) => BotReview[];
  getUserReview: (botId: string, userId: string) => BotReview | undefined;
  createReview: (input: CreateReviewInput) => BotReview | { error: string };
  updateReview: (
    id: string,
    data: Partial<Pick<BotReview, "title" | "content" | "approved" | "verifiedOwner">> & {
      rating?: number;
    }
  ) => void;
  deleteReview: (id: string) => void;
  toggleHelpful: (reviewId: string, userId: string) => void;
  hasVotedHelpful: (reviewId: string, userId: string) => boolean;
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: seedReviews,
      getBotReviews: (botId, opts) => {
        const includePending = opts?.includePending ?? false;
        return get()
          .reviews.filter((r) => r.botId === botId && (includePending || r.approved))
          .sort((a, b) => {
            if (b.helpfulCount !== a.helpfulCount) return b.helpfulCount - a.helpfulCount;
            return b.createdAt.localeCompare(a.createdAt);
          });
      },
      getUserReview: (botId, userId) =>
        get().reviews.find((r) => r.botId === botId && r.userId === userId),
      createReview: (input) => {
        const existing = get().reviews.find(
          (r) => r.botId === input.botId && r.userId === input.userId
        );
        if (existing) {
          return { error: "You already reviewed this bot. Edit your existing review instead." };
        }
        const title = input.title.trim();
        const content = input.content.trim();
        if (title.length < 3) return { error: "Title must be at least 3 characters." };
        if (content.length < 10) return { error: "Comment must be at least 10 characters." };

        const today = new Date().toISOString().slice(0, 10);
        const review: BotReview = {
          id: uid("rev"),
          botId: input.botId,
          botSlug: input.botSlug,
          botName: input.botName,
          userId: input.userId,
          author: input.author,
          rating: clampRating(input.rating),
          title,
          content,
          helpfulCount: 0,
          helpfulVotedBy: [],
          verifiedOwner: input.verifiedOwner,
          approved: true,
          createdAt: today,
          updatedAt: today,
        };
        set((state) => ({ reviews: [review, ...state.reviews] }));
        return review;
      },
      updateReview: (id, data) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id
              ? {
                  ...r,
                  ...data,
                  rating: data.rating !== undefined ? clampRating(data.rating) : r.rating,
                  updatedAt: new Date().toISOString().slice(0, 10),
                }
              : r
          ),
        })),
      deleteReview: (id) =>
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        })),
      toggleHelpful: (reviewId, userId) =>
        set((state) => ({
          reviews: state.reviews.map((r) => {
            if (r.id !== reviewId) return r;
            const voted = r.helpfulVotedBy.includes(userId);
            const helpfulVotedBy = voted
              ? r.helpfulVotedBy.filter((id) => id !== userId)
              : [...r.helpfulVotedBy, userId];
            return {
              ...r,
              helpfulVotedBy,
              helpfulCount: Math.max(0, r.helpfulCount + (voted ? -1 : 1)),
            };
          }),
        })),
      hasVotedHelpful: (reviewId, userId) => {
        const review = get().reviews.find((r) => r.id === reviewId);
        return Boolean(review?.helpfulVotedBy.includes(userId));
      },
    }),
    { name: "tradebib-reviews" }
  )
);
