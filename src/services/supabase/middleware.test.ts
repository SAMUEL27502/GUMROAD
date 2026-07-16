import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/services/supabase/config";
import { updateSession } from "@/services/supabase/middleware";

function req(path: string, cookie?: string) {
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(new URL(path, "http://localhost:3000"), { headers });
}

describe("updateSession (demo mode with placeholder Supabase env)", () => {
  it("redirects unauthenticated users away from /dashboard", async () => {
    const res = await updateSession(req("/dashboard"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("allows /dashboard when demo session cookie is present", async () => {
    const demo = encodeURIComponent(
      JSON.stringify({ id: "demo-1", email: "trader@example.com" })
    );
    const res = await updateSession(req("/dashboard", `${DEMO_SESSION_COOKIE}=${demo}`));
    expect(res.status).toBe(200);
  });

  it("redirects authenticated demo users away from /login to /dashboard", async () => {
    const demo = encodeURIComponent(
      JSON.stringify({ id: "demo-1", email: "trader@example.com" })
    );
    const res = await updateSession(req("/login", `${DEMO_SESSION_COOKIE}=${demo}`));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/dashboard");
  });
});
