import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, isSupabaseConfigured } from "./config";

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(
    url || "https://placeholder.supabase.co",
    anonKey || "placeholder-anon-key"
  );
}

export function canUseSupabaseAuth() {
  return isSupabaseConfigured();
}

export { createClient as createBrowserClient };
