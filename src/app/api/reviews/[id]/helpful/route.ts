import { NextResponse } from "next/server";
import { z } from "zod";
import { seedReviews, type BotReview } from "@/lib/data/reviews";

const runtimeReviews: BotReview[] = [...seedReviews];

const bodySchema = z.object({
  userId: z.string().min(1),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const review = runtimeReviews.find((r) => r.id === id);
    if (!review) {
      // Fall back to seed lookup for known IDs when runtime list was reset
      const seeded = seedReviews.find((r) => r.id === id);
      if (!seeded) {
        return NextResponse.json({ error: "Review not found" }, { status: 404 });
      }
      runtimeReviews.push({ ...seeded });
    }

    const target = runtimeReviews.find((r) => r.id === id);
    if (!target) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const { userId } = parsed.data;
    const voted = target.helpfulVotedBy.includes(userId);
    target.helpfulVotedBy = voted
      ? target.helpfulVotedBy.filter((uid) => uid !== userId)
      : [...target.helpfulVotedBy, userId];
    target.helpfulCount = Math.max(0, target.helpfulCount + (voted ? -1 : 1));

    return NextResponse.json({
      reviewId: target.id,
      helpfulCount: target.helpfulCount,
      voted: !voted,
    });
  } catch {
    return NextResponse.json({ error: "Failed to toggle helpful vote" }, { status: 500 });
  }
}
