"use client";

import { useEffect } from "react";
import { createClient, canUseSupabaseAuth } from "@/lib/supabase/client";
import { mapSupabaseUser, mapDemoUser, type AuthUser } from "@/lib/auth/user";
import { useAuthStore } from "@/stores/auth-store";

async function fetchDemoSession(): Promise<AuthUser | null> {
  try {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { user: AuthUser | null };
    return data.user;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoading(true);

      if (canUseSupabaseAuth()) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!mounted) return;
        setUser(user ? mapSupabaseUser(user) : null);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!mounted) return;
          setUser(session?.user ? mapSupabaseUser(session.user) : null);
        });

        return () => subscription.unsubscribe();
      }

      const demoUser = await fetchDemoSession();
      if (!mounted) return;
      setUser(demoUser);
      return undefined;
    }

    const cleanupPromise = init();

    return () => {
      mounted = false;
      void cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [setUser, setLoading, clear]);

  return <>{children}</>;
}

export { mapDemoUser };
