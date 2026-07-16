import { NextResponse } from "next/server";
import { z } from "zod";
import {
  recommendBots,
  type RecommendationInput,
} from "@/lib/recommendations/bot-recommender";

const bodySchema = z.object({
  riskTolerance: z.enum(["LOW", "MEDIUM", "HIGH"]),
  capital: z.enum(["under500", "500to2000", "2000to10000", "10000plus"]),
  experience: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  tradingStyles: z.array(z.string()).min(1),
  favoritePairs: z.array(z.string()).min(1),
  limit: z.number().int().min(1).max(20).optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid recommendation input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { limit, ...input } = parsed.data;
    const matches = recommendBots(input as RecommendationInput, { limit: limit ?? 6 });

    return NextResponse.json({
      count: matches.length,
      recommendations: matches.map((m) => ({
        botId: m.bot.id,
        slug: m.bot.slug,
        name: m.bot.name,
        strategy: m.bot.strategy,
        tradingPair: m.bot.tradingPair,
        riskLevel: m.bot.riskLevel,
        price: m.bot.price,
        score: m.score,
        matchPercent: m.matchPercent,
        reasons: m.reasons,
        breakdown: m.breakdown,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to score bots" }, { status: 500 });
  }
}
