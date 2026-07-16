import { describe, expect, it } from "vitest";
import {
  getBlogPostBySlug,
  getBlogPostsByCategory,
  getReadingTime,
  searchBlogPosts,
} from "@/lib/data/blog";
import { getBotBySlug, getFeaturedBots, bots } from "@/lib/data/bots";

describe("blog helpers", () => {
  it("computes reading time of at least one minute", () => {
    const rt = getReadingTime("Short.");
    expect(rt.minutes).toBeGreaterThanOrEqual(1);
    expect(rt.text).toMatch(/min read/);
  });

  it("finds posts by slug", () => {
    const post = getBlogPostBySlug("how-to-evaluate-mt5-bots");
    expect(post?.title).toBeTruthy();
  });

  it("filters by category and searches content", () => {
    const guides = getBlogPostsByCategory("Guides");
    expect(guides.every((p) => p.category === "Guides")).toBe(true);

    const hits = searchBlogPosts("risk", "All");
    expect(hits.length).toBeGreaterThan(0);
    expect(searchBlogPosts("zzzz-no-match")).toHaveLength(0);
  });
});

describe("bot helpers", () => {
  it("looks up bots by slug", () => {
    expect(getBotBySlug("goldscalper-pro")?.name).toBe("GoldScalper Pro");
    expect(getBotBySlug("missing-bot")).toBeUndefined();
  });

  it("returns featured bots only", () => {
    const featured = getFeaturedBots();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((b) => b.featured)).toBe(true);
    expect(featured.length).toBeLessThanOrEqual(bots.length);
  });
});
