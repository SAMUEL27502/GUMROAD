import { describe, expect, it } from "vitest";
import {
  annualPrice,
  bestIndex,
  buildComparePath,
  buildEquitySeries,
  buildRoiSeries,
  compareWithDefault,
  MAX_COMPARE_BOTS,
  normalizeBarPercent,
  parseCompareSlugs,
  pricePerRoiPoint,
} from "@/lib/compare/comparison-utils";
import { bots } from "@/lib/data/bots";

describe("bestIndex", () => {
  it("picks the highest value when direction is higher", () => {
    expect(bestIndex([10, 40, 25], "higher")).toBe(1);
  });

  it("picks the lowest value when direction is lower", () => {
    expect(bestIndex([12.2, 4.1, 8], "lower")).toBe(1);
  });

  it("returns -1 for empty arrays", () => {
    expect(bestIndex([], "higher")).toBe(-1);
  });
});

describe("parseCompareSlugs", () => {
  it("returns fallback when param is null", () => {
    expect(parseCompareSlugs(null, ["a", "b"])).toEqual(["a", "b"]);
  });

  it("parses unique slugs and caps at MAX_COMPARE_BOTS", () => {
    const slugs = parseCompareSlugs(
      "goldscalper-pro,eurotrend-ai,goldscalper-pro,nightowl-grid,x,y",
      ["fallback-a", "fallback-b"]
    );
    expect(slugs).toHaveLength(MAX_COMPARE_BOTS);
    expect(slugs[0]).toBe("goldscalper-pro");
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("falls back when fewer than MIN_COMPARE_BOTS", () => {
    expect(parseCompareSlugs("only-one", ["a", "b"])).toEqual(["a", "b"]);
  });
});

describe("series builders", () => {
  it("builds equity and ROI series for selected bots", () => {
    const selected = bots.slice(0, 2);
    const equity = buildEquitySeries(selected);
    const roi = buildRoiSeries(selected);

    expect(equity.length).toBe(selected[0].equityCurve.length);
    expect(equity[0]).toHaveProperty("date");
    expect(roi[0]).toHaveProperty("date");
    expect(typeof Object.values(roi.at(-1)!)[1]).toBe("number");
  });
});

describe("pricing helpers", () => {
  it("computes annual price", () => {
    expect(annualPrice(79)).toBe(948);
  });

  it("computes price per ROI point", () => {
    const bot = bots[0];
    expect(pricePerRoiPoint(bot)).toBeCloseTo(bot.price / bot.roi);
  });
});

describe("compare links", () => {
  it("builds a compare path from slugs", () => {
    expect(buildComparePath(["goldscalper-pro", "eurotrend-ai"])).toBe(
      "/compare?bots=goldscalper-pro,eurotrend-ai"
    );
  });

  it("returns bare /compare when too few slugs", () => {
    expect(buildComparePath(["only-one"])).toBe("/compare");
  });

  it("pairs a bot with another catalog slug", () => {
    const path = compareWithDefault(bots[0].slug, bots);
    expect(path).toContain("/compare?bots=");
    expect(path).toContain(bots[0].slug);
    expect(path).not.toBe(`/compare?bots=${bots[0].slug},${bots[0].slug}`);
  });
});

describe("normalizeBarPercent", () => {
  it("gives the highest value the longest bar when higher is better", () => {
    expect(normalizeBarPercent(40, [10, 40, 25], "higher")).toBe(100);
    expect(normalizeBarPercent(10, [10, 40, 25], "higher")).toBeLessThan(100);
  });

  it("gives the lowest value the longest bar when lower is better", () => {
    expect(normalizeBarPercent(4, [12, 4, 8], "lower")).toBe(100);
    expect(normalizeBarPercent(12, [12, 4, 8], "lower")).toBe(4);
  });
});
