import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  DEMO_SESSION_COOKIE,
  getSupabaseEnv,
  isAuthPath,
  isProtectedPath,
  isSupabaseConfigured,
} from "./config";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  let user: { id: string; email?: string } | null = null;

  if (isSupabaseConfigured()) {
    const { url, anonKey } = getSupabaseEnv();
    const supabase = createServerClient(url, anonKey, {
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
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (supabaseUser) {
      user = { id: supabaseUser.id, email: supabaseUser.email };
    }
  } else {
    // Demo JWT-like session cookie when Supabase is not configured
    const demo = request.cookies.get(DEMO_SESSION_COOKIE)?.value;
    if (demo) {
      try {
        const parsed = JSON.parse(demo) as { id: string; email: string };
        user = parsed;
      } catch {
        user = null;
      }
    }
  }

  if (isProtectedPath(pathname) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith("/admin") && user?.email && !user.email.includes("admin")) {
    // Soft admin check for demo; production should use app_metadata.role
    if (!isSupabaseConfigured()) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
