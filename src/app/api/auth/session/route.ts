import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/services/supabase/server";
import { DEMO_SESSION_COOKIE, isSupabaseConfigured } from "@/services/supabase/config";
import { mapDemoUser, mapSupabaseUser } from "@/services/auth/user";

export async function GET() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return NextResponse.json({
      user: user ? mapSupabaseUser(user) : null,
      mode: "supabase",
      notifications: user?.user_metadata?.notification_prefs ?? null,
    });
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  if (!raw) {
    return NextResponse.json({ user: null, mode: "demo" });
  }

  try {
    const parsed = JSON.parse(raw) as {
      email: string;
      name?: string;
      avatarUrl?: string;
      notifications?: Record<string, boolean>;
    };
    return NextResponse.json({
      user: mapDemoUser(parsed.email, parsed.name, { avatarUrl: parsed.avatarUrl }),
      mode: "demo",
      notifications: parsed.notifications ?? null,
    });
  } catch {
    return NextResponse.json({ user: null, mode: "demo" });
  }
}
