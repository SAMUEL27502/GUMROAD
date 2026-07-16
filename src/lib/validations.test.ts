import { describe, expect, it } from "vitest";
import {
  changePasswordSchema,
  loginSchema,
  mt5ConnectSchema,
  registerSchema,
  reviewSchema,
} from "@/lib/validations";

describe("loginSchema", () => {
  it("accepts a valid login payload", () => {
    const result = loginSchema.safeParse({
      email: "trader@tradebib.com",
      password: "Password1",
      remember: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short passwords", () => {
    const result = loginSchema.safeParse({
      email: "trader@tradebib.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts a strong matching password pair", () => {
    const result = registerSchema.safeParse({
      name: "Sam Trader",
      email: "sam@tradebib.com",
      password: "Password1",
      confirmPassword: "Password1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "Sam Trader",
      email: "sam@tradebib.com",
      password: "Password1",
      confirmPassword: "Password2",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("confirmPassword"))).toBe(true);
    }
  });

  it("requires uppercase and number in password", () => {
    const result = registerSchema.safeParse({
      name: "Sam",
      email: "sam@tradebib.com",
      password: "password",
      confirmPassword: "password",
    });
    expect(result.success).toBe(false);
  });
});

describe("mt5ConnectSchema", () => {
  it("accepts a valid MT5 connection form", () => {
    const result = mt5ConnectSchema.safeParse({
      broker: "IC Markets",
      server: "ICMarkets-Demo",
      login: "12345678",
      investorPassword: "invPass1",
      nickname: "Demo Gold",
    });
    expect(result.success).toBe(true);
  });

  it("requires numeric login", () => {
    const result = mt5ConnectSchema.safeParse({
      broker: "IC Markets",
      server: "ICMarkets-Demo",
      login: "abc",
      investorPassword: "invPass1",
      nickname: "Demo",
    });
    expect(result.success).toBe(false);
  });
});

describe("reviewSchema", () => {
  it("accepts a valid review", () => {
    const result = reviewSchema.safeParse({
      botId: "1",
      botName: "GoldScalper Pro",
      rating: 5,
      title: "Solid scalper",
      content: "Consistent sessions with controlled drawdown.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects out-of-range ratings", () => {
    const result = reviewSchema.safeParse({
      botId: "1",
      botName: "GoldScalper Pro",
      rating: 6,
      title: "Too high",
      content: "This rating should fail validation.",
    });
    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("rejects when new password equals current", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "Password1",
      newPassword: "Password1",
      confirmPassword: "Password1",
    });
    expect(result.success).toBe(false);
  });
});
