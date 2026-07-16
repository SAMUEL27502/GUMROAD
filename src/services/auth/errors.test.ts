import { describe, expect, it } from "vitest";
import { mapAuthError } from "@/services/auth/errors";
import {
  isAuthPath,
  isProtectedPath,
  isSupabaseConfigured,
} from "@/services/supabase/config";

describe("mapAuthError", () => {
  it("maps email not confirmed", () => {
    expect(mapAuthError("Email not confirmed")).toMatch(/email not confirmed/i);
  });

  it("maps invalid login credentials", () => {
    expect(mapAuthError("Invalid login credentials")).toBe("Wrong email or password.");
  });

  it("maps network failures", () => {
    expect(mapAuthError("fetch failed")).toMatch(/network error/i);
  });

  it("maps already registered", () => {
    expect(mapAuthError("User already registered")).toMatch(/already exists/i);
  });

  it("falls back to original message", () => {
    expect(mapAuthError("Something niche happened")).toBe("Something niche happened");
  });
});

describe("supabase config path helpers", () => {
  it("recognizes protected and auth paths", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
    expect(isProtectedPath("/dashboard/settings")).toBe(true);
    expect(isProtectedPath("/marketplace")).toBe(false);
    expect(isAuthPath("/login")).toBe(true);
    expect(isAuthPath("/register")).toBe(true);
    expect(isAuthPath("/signup")).toBe(true);
  });
});

describe("isSupabaseConfigured", () => {
  it("rejects placeholder credentials (current env)", () => {
    // Workspace .env.local uses your-project / your-anon placeholders.
    // Configured check must return false so demo auth + middleware stay aligned.
    expect(isSupabaseConfigured()).toBe(false);
  });
});
