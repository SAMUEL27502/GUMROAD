import { NextResponse } from "next/server";
import { getEnvReadiness } from "@/lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type HealthStatus = "ok" | "degraded" | "error";

async function checkDatabase(): Promise<{ status: "up" | "down" | "skipped"; error?: string }> {
  if (!process.env.DATABASE_URL) {
    return { status: "skipped" };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    return { status: "up" };
  } catch (error) {
    return {
      status: "down",
      error: error instanceof Error ? error.message : "database unreachable",
    };
  }
}

export async function GET() {
  const started = Date.now();
  const readiness = getEnvReadiness();
  const db = await checkDatabase();

  let status: HealthStatus = "ok";
  if (db.status === "down") status = "error";
  else if (
    process.env.NODE_ENV === "production" &&
    (!readiness.hasAppUrl || db.status === "skipped")
  ) {
    status = "degraded";
  }

  const body = {
    status,
    service: "tradebib",
    version:
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
      process.env.npm_package_version ||
      "0.1.0",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    latencyMs: Date.now() - started,
    checks: {
      database: db.status,
      sentry: readiness.hasSentry,
      appUrl: readiness.hasAppUrl,
      supabase: readiness.hasSupabase,
      stripe: readiness.hasStripe,
      paypal: readiness.hasPaypal,
    },
    ...(db.error ? { error: db.error } : {}),
  };

  return NextResponse.json(body, {
    status: status === "error" ? 503 : 200,
    headers: { "Cache-Control": "no-store" },
  });
}
