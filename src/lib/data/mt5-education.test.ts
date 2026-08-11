import { describe, expect, it } from "vitest";
import {
  filterMt5Samples,
  getMt5SampleBySlug,
  mt5CodeSamples,
  mt5SampleKinds,
} from "@/lib/data/mt5-education";

describe("mt5 education samples", () => {
  it("exposes a non-empty curated library", () => {
    expect(mt5CodeSamples.length).toBeGreaterThanOrEqual(4);
    expect(mt5SampleKinds.some((k) => k.id === "ALL")).toBe(true);
  });

  it("keeps required metadata on every sample", () => {
    for (const sample of mt5CodeSamples) {
      expect(sample.slug).toMatch(/^[a-z0-9-]+$/);
      expect(sample.filename).toMatch(/\.mq5$/);
      expect(sample.code.length).toBeGreaterThan(200);
      expect(sample.learningGoals.length).toBeGreaterThan(0);
      expect(sample.analysisNotes.length).toBeGreaterThan(0);
      expect(sample.code).toMatch(/TradeBib Education|educational|Edu /i);
    }
  });

  it("filters by kind and resolves slugs", () => {
    const eas = filterMt5Samples("EA");
    expect(eas.every((s) => s.kind === "EA")).toBe(true);
    expect(filterMt5Samples("ALL")).toHaveLength(mt5CodeSamples.length);
    expect(getMt5SampleBySlug("ma-crossover-lab")?.kind).toBe("EA");
    expect(getMt5SampleBySlug("missing")).toBeUndefined();
  });

  it("defaults the lab EA to analysis-safe trading off", () => {
    const ea = getMt5SampleBySlug("ma-crossover-lab");
    expect(ea?.code).toMatch(/EnableTrading\s*=\s*false/);
  });
});
