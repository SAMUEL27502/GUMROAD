import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Animations",
  description: "TradeBib animation playground.",
  path: "/animations",
  noIndex: true,
});

export default function AnimationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
