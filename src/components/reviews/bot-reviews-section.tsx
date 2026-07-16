"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import type { Bot } from "@/lib/data/bots";
import type { BotReview } from "@/lib/data/reviews";
import { ReviewCard } from "@/components/reviews/review-card";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewSummary } from "@/components/reviews/review-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/auth-store";
import { useReviewsStore } from "@/stores/reviews-store";
import { useSubscriptionsStore } from "@/stores/subscriptions-store";

type SortMode = "helpful" | "newest" | "highest" | "lowest";

interface BotReviewsSectionProps {
  bot: Bot;
}

export function BotReviewsSection({ bot }: BotReviewsSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { subscriptions } = useSubscriptionsStore();
  const { reviews, getUserReview } = useReviewsStore();
  const [sort, setSort] = useState<SortMode>("helpful");
  const [editing, setEditing] = useState<BotReview | null>(null);
  const [showForm, setShowForm] = useState(false);

  const isSubscriber = subscriptions.some(
    (s) => s.botId === bot.id && s.status === "ACTIVE"
  );
  const myReview = user ? getUserReview(bot.id, user.id) : undefined;

  const botReviews = useMemo(() => {
    const list = reviews.filter(
      (r) =>
        r.botId === bot.id &&
        (r.approved || (user && r.userId === user.id))
    );
    const sorted = [...list];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "highest":
        sorted.sort((a, b) => b.rating - a.rating || b.helpfulCount - a.helpfulCount);
        break;
      case "lowest":
        sorted.sort((a, b) => a.rating - b.rating || b.helpfulCount - a.helpfulCount);
        break;
      default:
        sorted.sort(
          (a, b) =>
            b.helpfulCount - a.helpfulCount || b.createdAt.localeCompare(a.createdAt)
        );
    }
    return sorted;
  }, [reviews, bot.id, sort, user]);

  const approved = botReviews.filter((r) => r.approved);

  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Reviews
            <Badge variant="secondary">{approved.length}</Badge>
          </CardTitle>
          <CardDescription>
            Ratings, comments, helpful votes, and verified owner badges for {bot.name}
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="helpful">Most helpful</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="highest">Highest rating</SelectItem>
              <SelectItem value="lowest">Lowest rating</SelectItem>
            </SelectContent>
          </Select>
          {isAuthenticated && isSubscriber && !myReview && !showForm ? (
            <Button onClick={() => setShowForm(true)}>
              <MessageSquarePlus className="h-4 w-4" />
              Write review
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {approved.length > 0 ? <ReviewSummary reviews={approved} /> : null}

        {!isAuthenticated ? (
          <div className="rounded-xl border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
            <Link href="/login" className="text-sky-400 hover:underline">
              Sign in
            </Link>{" "}
            to leave a review and vote helpful. Subscribers get a{" "}
            <span className="text-foreground font-medium">Verified owner</span> badge.
          </div>
        ) : !isSubscriber && !myReview ? (
          <div className="rounded-xl border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
            Subscribe to {bot.name} to post a review with a Verified owner badge. You can still
            mark existing reviews as helpful.
          </div>
        ) : null}

        {(showForm || editing) && isAuthenticated && isSubscriber ? (
          <ReviewForm
            bot={bot}
            verifiedOwner={isSubscriber}
            existing={editing}
            onDone={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        ) : null}

        {myReview && !editing ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Your review</p>
            <ReviewCard review={myReview} onEdit={(r) => setEditing(r)} />
          </div>
        ) : null}

        {botReviews.filter((r) => !myReview || r.id !== myReview.id).length > 0 ? (
          <div className="space-y-3">
            {botReviews
              .filter((r) => !myReview || r.id !== myReview.id)
              .map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit={
                    user && review.userId === user.id ? (r) => setEditing(r) : undefined
                  }
                />
              ))}
          </div>
        ) : !myReview ? (
          <EmptyState
            title="No reviews yet"
            description="Be the first subscriber to rate this bot and share feedback."
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
