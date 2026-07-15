import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

export function createClient() {
  return createSupabaseBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export { createClient as createBrowserClient };
