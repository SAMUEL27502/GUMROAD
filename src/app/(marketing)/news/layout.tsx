import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Forex News",
  description: "Latest forex and crypto market headlines curated for automated traders.",
  path: "/news",
});

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
