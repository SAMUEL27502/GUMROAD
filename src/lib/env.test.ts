import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { getEnvReadiness, assertProductionEnv } from "@/lib/env";

describe("getEnvReadiness", () => {
  const original = { ...process.env };

  beforeEach(() => {
    process.env = { ...original };
  });

  afterEach(() => {
    process.env = { ...original };
  });

  it("reports missing required production vars", () => {
    delete process.env.DATABASE_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;

    const readiness = getEnvReadiness();
    expect(readiness.readyForProduction).toBe(false);
    expect(readiness.missingRequired).toEqual(
      expect.arrayContaining(["DATABASE_URL", "NEXT_PUBLIC_APP_URL"])
    );
  });

  it("is ready when required vars are present", () => {
    process.env.DATABASE_URL = "postgresql://localhost/tradebib";
    process.env.NEXT_PUBLIC_APP_URL = "https://tradebib.com";

    const readiness = getEnvReadiness();
    expect(readiness.readyForProduction).toBe(true);
    expect(readiness.hasDb).toBe(true);
    expect(readiness.hasAppUrl).toBe(true);
  });

  it("assertProductionEnv throws when incomplete", () => {
    delete process.env.DATABASE_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;
    expect(() => assertProductionEnv()).toThrow(/Missing required production env/);
  });
});
