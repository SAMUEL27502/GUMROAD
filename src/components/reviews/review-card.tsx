"use client";

import { toast } from "sonner";
import type { BotReview } from "@/lib/data/reviews";
import { HelpfulButton } from "@/components/reviews/helpful-button";
import { StarRating } from "@/components/reviews/star-rating";
import { VerifiedOwnerBadge } from "@/components/reviews/verified-owner-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useReviewsStore } from "@/store/reviews-store";

interface ReviewCardProps {
  review: BotReview;
  className?: string;
  onEdit?: (review: BotReview) => void;
}

export function ReviewCard({ review, className, onEdit }: ReviewCardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { toggleHelpful, hasVotedHelpful, deleteReview } = useReviewsStore();
  const userId = user?.id ?? "";
  const voted = userId ? hasVotedHelpful(review.id, userId) : false;
  const isOwner = Boolean(user && user.id === review.userId);

  function handleHelpful() {
    if (!isAuthenticated || !user) {
      toast.error("Sign in to mark reviews as helpful");
      return;
    }
    toggleHelpful(review.id, user.id);
    toast.success(voted ? "Removed helpful vote" : "Marked as helpful");
  }

  return (
    <div className={cn("rounded-xl border border-border/60 bg-card/40 p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-300">
            {review.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold">{review.author}</p>
              {review.verifiedOwner ? <VerifiedOwnerBadge /> : null}
            </div>
            <p className="text-muted-foreground text-xs">{review.createdAt}</p>
          </div>
        </div>
        <StarRating value={review.rating} readOnly />
      </div>

      <p className="mt-3 text-sm font-medium">{review.title}</p>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{review.content}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <HelpfulButton
          count={review.helpfulCount}
          voted={voted}
          onToggle={handleHelpful}
        />
        {isOwner && onEdit ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(review)}>
            Edit
          </Button>
        ) : null}
        {isOwner ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300"
            onClick={() => {
              deleteReview(review.id);
              toast.message("Review deleted");
            }}
          >
            Delete
          </Button>
        ) : null}
        {!review.approved ? (
          <span className="text-muted-foreground text-xs">Pending approval</span>
        ) : null}
      </div>
    </div>
  );
}
