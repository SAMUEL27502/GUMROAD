import { describe, expect, it } from "vitest";
import { cn, formatCurrency, formatNumber, formatPercent, slugify } from "@/lib/utils";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2", "px-4", "text-sm")).toBe("px-4 text-sm");
  });

  it("ignores falsy values", () => {
    expect(cn("base", false && "hidden", null, undefined, "ok")).toBe("base ok");
  });
});

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    expect(formatCurrency(79)).toBe("$79.00");
  });

  it("formats larger amounts", () => {
    expect(formatCurrency(12830.5)).toBe("$12,830.50");
  });
});

describe("formatPercent", () => {
  it("adds a plus sign for positive values", () => {
    expect(formatPercent(18.4)).toBe("+18.4%");
  });

  it("keeps the minus sign for negatives", () => {
    expect(formatPercent(-4.5)).toBe("-4.5%");
  });

  it("respects digit precision", () => {
    expect(formatPercent(12.345, 2)).toBe("+12.35%");
  });
});

describe("formatNumber", () => {
  it("uses compact notation for thousands+", () => {
    expect(formatNumber(2840)).toMatch(/2\.8K|2,840/);
  });

  it("keeps small numbers standard", () => {
    expect(formatNumber(42)).toBe("42");
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates text", () => {
    expect(slugify("Gold Scalper Pro!")).toBe("gold-scalper-pro");
  });

  it("collapses repeated separators", () => {
    expect(slugify("Hello   World---Bot")).toBe("hello-world-bot");
  });
});
