import { describe, expect, it } from "vitest";
import {
  buildMt5MobileCandles,
  formatMt5Price,
  mt5MobileHistory,
  mt5MobilePositions,
  mt5MobileQuotes,
  mt5MobileTimeframes,
} from "@/lib/data/mt5-mobile";

describe("mt5-mobile data", () => {
  it("provides quotes with bid below ask", () => {
    expect(mt5MobileQuotes.length).toBeGreaterThanOrEqual(8);
    for (const q of mt5MobileQuotes) {
      expect(q.ask).toBeGreaterThanOrEqual(q.bid);
      expect(q.high).toBeGreaterThanOrEqual(q.low);
      expect(formatMt5Price(q.bid, q.digits)).toMatch(/^\d/);
    }
  });

  it("lists classic MT5 timeframes", () => {
    expect(mt5MobileTimeframes.map((t) => t.value)).toEqual(
      expect.arrayContaining(["M1", "H1", "D1", "MN"])
    );
  });

  it("has open positions and closed history with profits", () => {
    expect(mt5MobilePositions.some((p) => p.type === "BUY")).toBe(true);
    expect(mt5MobileHistory.every((d) => typeof d.profit === "number")).toBe(true);
  });

  it("builds deterministic candle series", () => {
    const a = buildMt5MobileCandles(42, 20);
    const b = buildMt5MobileCandles(42, 20);
    expect(a).toEqual(b);
    expect(a).toHaveLength(20);
    expect(a[0].h).toBeGreaterThanOrEqual(a[0].l);
  });
});
