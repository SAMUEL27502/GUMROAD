"use client";

import { averageRating, ratingDistribution, type BotReview } from "@/lib/data/reviews";
import { StarRating } from "@/components/reviews/star-rating";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ReviewSummaryProps {
  reviews: BotReview[];
  className?: string;
}

export function ReviewSummary({ reviews, className }: ReviewSummaryProps) {
  const avg = averageRating(reviews);
  const dist = ratingDistribution(reviews);
  const total = reviews.length || 1;

  return (
    <div className={cn("grid gap-4 sm:grid-cols-[140px_1fr]", className)}>
      <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-card/40 p-4 text-center">
        <p className="text-3xl font-bold tracking-tight">{avg.toFixed(1)}</p>
        <StarRating value={Math.round(avg)} readOnly className="mt-1" />
        <p className="text-muted-foreground mt-2 text-xs">
          {reviews.length} review{reviews.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="space-y-2">
        {([5, 4, 3, 2, 1] as const).map((stars) => (
          <div key={stars} className="flex items-center gap-3">
            <span className="text-muted-foreground w-8 text-xs">{stars}★</span>
            <Progress value={(dist[stars] / total) * 100} className="h-2 flex-1" />
            <span className="text-muted-foreground w-6 text-right text-xs">{dist[stars]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
