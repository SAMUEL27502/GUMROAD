export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return { url, anonKey };
}

/** True when real Supabase project credentials are present (not placeholders). */
export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) return false;
  if (url.includes("your-project") || url.includes("placeholder")) return false;
  if (anonKey.includes("your-anon") || anonKey.includes("placeholder")) return false;
  return true;
}

export const DEMO_SESSION_COOKIE = "tb_demo_session";
export const REMEMBER_ME_COOKIE = "tb_remember_me";

export const PROTECTED_PATHS = [
  "/dashboard",
  "/profile",
  "/mt5",
  "/admin",
  "/journal",
  "/referrals",
  "/billing",
  "/affiliate",
  "/notifications",
  "/kyc",
] as const;

export const AUTH_PATHS = [
  "/login",
  "/register",
  "/signup",
  "/forgot-password",
  "/reset-password",
] as const;

export function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}
