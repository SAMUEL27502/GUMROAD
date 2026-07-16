/**
 * Shared app-wide TypeScript types.
 * Domain models also live in @/lib/data/* and Prisma schema.
 */

export type PlanTier = "STARTER" | "PRO" | "ELITE";
export type UserRole = "USER" | "ADMIN" | "AFFILIATE";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
