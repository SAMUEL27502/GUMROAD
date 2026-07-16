import { NextResponse } from "next/server";
import { z } from "zod";
import { getBotBySlug } from "@/lib/data/bots";
import { averageRating, seedReviews, type BotReview } from "@/lib/data/reviews";
import { reviewSchema } from "@/lib/validations";

const runtimeReviews: BotReview[] = [...seedReviews];

const createBodySchema = reviewSchema.extend({
  userId: z.string().min(1),
  author: z.string().min(1),
  verifiedOwner: z.boolean().default(false),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const bot = getBotBySlug(slug);
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  const reviews = runtimeReviews
    .filter((r) => r.botSlug === slug && r.approved)
    .sort((a, b) => b.helpfulCount - a.helpfulCount);

  return NextResponse.json({
    botId: bot.id,
    slug: bot.slug,
    averageRating: averageRating(reviews),
    count: reviews.length,
    reviews: reviews.map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      title: r.title,
      content: r.content,
      helpfulCount: r.helpfulCount,
      verifiedOwner: r.verifiedOwner,
      createdAt: r.createdAt,
    })),
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const bot = getBotBySlug(slug);
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  try {
    const json = await request.json();
    const parsed = createBodySchema.safeParse({
      ...json,
      botId: bot.id,
      botName: bot.name,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid review", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    if (runtimeReviews.some((r) => r.botSlug === slug && r.userId === data.userId)) {
      return NextResponse.json(
        { error: "You already reviewed this bot" },
        { status: 409 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const review: BotReview = {
      id: `rev-api-${Date.now()}`,
      botId: bot.id,
      botSlug: slug,
      botName: bot.name,
      userId: data.userId,
      author: data.author,
      rating: data.rating as 1 | 2 | 3 | 4 | 5,
      title: data.title,
      content: data.content,
      helpfulCount: 0,
      helpfulVotedBy: [],
      verifiedOwner: data.verifiedOwner,
      approved: true,
      createdAt: today,
      updatedAt: today,
    };
    runtimeReviews.unshift(review);

    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
