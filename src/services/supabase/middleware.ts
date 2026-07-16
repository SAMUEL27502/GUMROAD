import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  DEMO_SESSION_COOKIE,
  getSupabaseEnv,
  isAuthPath,
  isProtectedPath,
  isSupabaseConfigured,
} from "@/services/supabase/config";

/**
 * Session refresh + route guards.
 *
 * Critical: auth actions use `isSupabaseConfigured()` (rejects placeholders) and
 * fall back to the demo cookie. Middleware MUST use the same check — otherwise
 * placeholder env vars make middleware call fake Supabase, get no user, and
 * bounce every post-login /dashboard visit back to /login.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
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
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
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
    const demo = request.cookies.get(DEMO_SESSION_COOKIE)?.value;
    if (demo) {
      try {
        const parsed = JSON.parse(demo) as { id: string; email: string };
        if (parsed?.id && parsed?.email) {
          user = parsed;
        }
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

  return response;
}
