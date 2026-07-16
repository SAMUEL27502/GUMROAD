import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth middleware only on routes that need session cookies.
 * Public marketing/blog/marketplace pages skip Supabase work for faster TTFB.
 * Without Supabase env, protected routes still redirect to login (demo auth via actions).
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthPage = path === "/login" || path === "/signup" || path === "/register";
  const isProtected =
    path.startsWith("/dashboard") ||
    path.startsWith("/profile") ||
    path.startsWith("/affiliate") ||
    path.startsWith("/mt5") ||
    path.startsWith("/admin") ||
    path.startsWith("/notifications");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnon) {
    // Demo / local without Supabase — do not block; server actions own session cookies.
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/affiliate/:path*",
    "/mt5/:path*",
    "/admin/:path*",
    "/notifications/:path*",
    "/login",
    "/signup",
    "/register",
  ],
};
