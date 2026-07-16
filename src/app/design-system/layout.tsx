import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Design System",
  description: "TradeBib internal design system reference.",
  path: "/design-system",
  noIndex: true,
});

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
