"use client";

import type { AuthUser } from "@/services/auth/user";
import { useAuthStore } from "@/store/auth-store";

/**
 * Re-read the server session into the client auth store.
 * Required after login/register server actions set cookies — AuthProvider
 * only hydrates once on mount and will otherwise leave the user logged out
 * on the client even when the session cookie is valid.
 */
export async function syncClientAuth(): Promise<AuthUser | null> {
  try {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    if (!res.ok) {
      useAuthStore.getState().setUser(null);
      return null;
    }
    const data = (await res.json()) as { user: AuthUser | null };
    useAuthStore.getState().setUser(data.user ?? null);
    return data.user ?? null;
  } catch {
    useAuthStore.getState().setUser(null);
    return null;
  }
}
