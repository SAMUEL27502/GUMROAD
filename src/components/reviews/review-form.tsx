"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Bot } from "@/lib/data/bots";
import type { BotReview } from "@/lib/data/reviews";
import { StarRating } from "@/components/reviews/star-rating";
import { VerifiedOwnerBadge } from "@/components/reviews/verified-owner-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth-store";
import { useReviewsStore } from "@/stores/reviews-store";

interface ReviewFormProps {
  bot: Bot;
  verifiedOwner: boolean;
  existing?: BotReview | null;
  onDone?: () => void;
}

export function ReviewForm({ bot, verifiedOwner, existing, onDone }: ReviewFormProps) {
  const { user } = useAuthStore();
  const { createReview, updateReview } = useReviewsStore();
  const [rating, setRating] = useState<number>(existing?.rating ?? 5);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to leave a review");
      return;
    }
    setSubmitting(true);

    if (existing) {
      updateReview(existing.id, {
        rating,
        title: title.trim(),
        content: content.trim(),
        verifiedOwner: verifiedOwner || existing.verifiedOwner,
      });
      toast.success("Review updated");
      onDone?.();
      setSubmitting(false);
      return;
    }

    const result = createReview({
      botId: bot.id,
      botSlug: bot.slug,
      botName: bot.name,
      userId: user.id,
      author: user.name || user.email.split("@")[0],
      rating,
      title,
      content,
      verifiedOwner,
    });

    if ("error" in result) {
      toast.error(result.error);
      setSubmitting(false);
      return;
    }

    toast.success(
      verifiedOwner
        ? "Review published with Verified owner badge"
        : "Review published"
    );
    setTitle("");
    setContent("");
    setRating(5);
    onDone?.();
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border/60 bg-card/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">
            {existing ? "Edit your review" : "Write a review"}
          </p>
          <p className="text-muted-foreground text-xs">
            Ratings and comments help other traders choose the right EA.
          </p>
        </div>
        {verifiedOwner ? <VerifiedOwnerBadge /> : null}
      </div>

      <div className="space-y-2">
        <Label>Rating</Label>
        <StarRating value={rating} onChange={(v) => setRating(v)} size="lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-title">Title</Label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience"
          required
          minLength={3}
          maxLength={80}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-content">Comment</Label>
        <Textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share performance notes, risk, and setup tips…"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={submitting}>
          {existing ? "Save changes" : "Post review"}
        </Button>
        {existing && onDone ? (
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
