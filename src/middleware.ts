import { type NextRequest } from "next/server";
import { updateSession } from "@/services/supabase/middleware";

/**
 * Auth middleware only on routes that need session cookies.
 * Public marketing/blog/marketplace pages skip Supabase work for faster TTFB.
 *
 * Uses the same `isSupabaseConfigured()` gate as server actions so demo-mode
 * sessions (placeholder Supabase env) are honored.
 */
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/affiliate/:path*",
    "/mt5/:path*",
    "/admin/:path*",
    "/notifications/:path*",
    "/journal/:path*",
    "/referrals/:path*",
    "/billing/:path*",
    "/kyc/:path*",
    "/login",
    "/signup",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
