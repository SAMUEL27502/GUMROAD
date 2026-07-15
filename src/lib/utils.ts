import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
