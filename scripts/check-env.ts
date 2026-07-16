#!/usr/bin/env node
/**
 * Soft production env readiness check.
 * Usage: npm run env:check [-- --strict]
 * Exit 1 only when --strict and required vars are missing.
 */
import { config } from "dotenv";
import { getEnvReadiness } from "../src/lib/env";

config({ path: ".env.local" });
config({ path: ".env" });

const strict = process.argv.includes("--strict");
const readiness = getEnvReadiness();

console.log(JSON.stringify(readiness, null, 2));

if (strict && !readiness.readyForProduction) {
  console.error(
    `\nMissing required production env: ${readiness.missingRequired.join(", ")}`
  );
  process.exit(1);
}
