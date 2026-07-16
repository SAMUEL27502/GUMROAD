import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/blog-index";
import { blogPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Blog | TradeBib",
  description:
    "TradeBib blog — guides, risk management, markets, infrastructure, analytics, and product updates for automated MT5 traders.",
  openGraph: {
    title: "TradeBib Blog",
    description:
      "Guides and insights for evaluating Expert Advisors, managing risk, and deploying MT5 bots.",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogIndex posts={blogPosts} />;
}
