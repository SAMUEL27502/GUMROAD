import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Trading Journal",
  description: "Log trades, notes, and performance insights alongside your automated MT5 bots.",
  path: "/journal",
});

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
