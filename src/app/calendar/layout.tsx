import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Economic Calendar",
  description: "Track high-impact forex events and plan automated trading around market news.",
  path: "/calendar",
});

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
