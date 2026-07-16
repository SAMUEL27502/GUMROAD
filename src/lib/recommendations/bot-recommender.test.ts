import { describe, expect, it } from "vitest";
import {
  defaultRecommendationInput,
  recommendBots,
  scoreBot,
} from "@/lib/recommendations/bot-recommender";
import { bots } from "@/lib/data/bots";

describe("defaultRecommendationInput", () => {
  it("returns a balanced starter profile", () => {
    expect(defaultRecommendationInput()).toMatchObject({
      riskTolerance: "MEDIUM",
      capital: "500to2000",
      experience: "INTERMEDIATE",
      tradingStyles: [],
      favoritePairs: [],
    });
  });
});

describe("scoreBot", () => {
  it("scores between 0 and 100", () => {
    const match = scoreBot(bots[0], {
      riskTolerance: "HIGH",
      capital: "2000to10000",
      experience: "ADVANCED",
      tradingStyles: ["Scalping"],
      favoritePairs: ["XAUUSD"],
    });
    expect(match.score).toBeGreaterThanOrEqual(0);
    expect(match.score).toBeLessThanOrEqual(100);
    expect(match.matchPercent).toBe(Math.round(match.score));
    expect(match.breakdown).toHaveProperty("risk");
  });

  it("favors matching risk and pair preferences", () => {
    const goldBot = bots.find((b) => b.tradingPair === "XAUUSD") ?? bots[0];
    const strong = scoreBot(goldBot, {
      riskTolerance: goldBot.riskLevel,
      capital: "10000plus",
      experience: "ADVANCED",
      tradingStyles: [goldBot.strategy],
      favoritePairs: ["XAUUSD"],
    });
    const weak = scoreBot(goldBot, {
      riskTolerance: goldBot.riskLevel === "LOW" ? "HIGH" : "LOW",
      capital: "under500",
      experience: "BEGINNER",
      tradingStyles: ["Hedging"],
      favoritePairs: ["BTCUSD"],
    });
    expect(strong.score).toBeGreaterThan(weak.score);
  });
});

describe("recommendBots", () => {
  it("returns limited sorted matches", () => {
    const results = recommendBots(
      {
        riskTolerance: "MEDIUM",
        capital: "500to2000",
        experience: "INTERMEDIATE",
        tradingStyles: ["Trend Following"],
        favoritePairs: ["EURUSD"],
      },
      { limit: 3 }
    );
    expect(results).toHaveLength(3);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("respects minScore filter", () => {
    const results = recommendBots(defaultRecommendationInput(), {
      catalog: bots.slice(0, 4),
      minScore: 101,
    });
    expect(results).toHaveLength(0);
  });
});
