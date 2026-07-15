"use client";

import { createClient, canUseSupabaseAuth } from "@/lib/supabase/client";

export async function signInWithOAuth(provider: "google" | "github") {
  if (!canUseSupabaseAuth()) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable OAuth."
    );
  }

  const supabase = createClient();
  const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      queryParams:
        provider === "google" ? { access_type: "offline", prompt: "consent" } : undefined,
    },
  });

  if (error) throw error;
}
