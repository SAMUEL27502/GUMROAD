import { describe, expect, it } from "vitest";
import {
  SITE_NAME,
  absoluteUrl,
  createMetadata,
  organizationJsonLd,
  serializeJsonLd,
} from "@/lib/seo";

describe("seo helpers", () => {
  it("builds absolute URLs", () => {
    expect(absoluteUrl("/marketplace")).toMatch(/\/marketplace$/);
    expect(absoluteUrl()).toMatch(/^https?:\/\//);
  });

  it("creates page metadata with title template fields", () => {
    const meta = createMetadata({
      title: "Marketplace",
      description: "Browse MT5 bots",
      path: "/marketplace",
    });
    expect(meta.title).toContain("Marketplace");
    expect(meta.description).toBe("Browse MT5 bots");
    expect(meta.alternates?.canonical).toMatch(/\/marketplace$/);
  });

  it("serializes organization JSON-LD", () => {
    const json = serializeJsonLd(organizationJsonLd());
    expect(json).toContain(SITE_NAME);
    expect(json).toContain('"@type":"Organization"');
  });
});
