import { z } from "zod";

/**
 * Server-side environment validation for production readiness checks.
 * Call `assertServerEnv()` from scripts or during boot when required.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse(process.env);
}

/** Soft check used by /api/health and deploy docs — does not throw. */
export function getEnvReadiness() {
  const hasDb = Boolean(process.env.DATABASE_URL);
  const hasAppUrl = Boolean(process.env.NEXT_PUBLIC_APP_URL);
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const hasStripe = Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
  const hasPaypal = Boolean(
    process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET
  );
  const hasSentry = Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);

  const productionRequired = ["DATABASE_URL", "NEXT_PUBLIC_APP_URL"] as const;
  const missingRequired = productionRequired.filter((key) => !process.env[key]);

  return {
    hasDb,
    hasAppUrl,
    hasSupabase,
    hasStripe,
    hasPaypal,
    hasSentry,
    missingRequired,
    readyForProduction: missingRequired.length === 0,
  };
}

export function assertProductionEnv() {
  const readiness = getEnvReadiness();
  if (!readiness.readyForProduction) {
    throw new Error(
      `Missing required production env: ${readiness.missingRequired.join(", ")}`
    );
  }
  return readiness;
}
