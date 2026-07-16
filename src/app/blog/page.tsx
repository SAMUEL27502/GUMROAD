import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/blog-index";
import { blogPosts } from "@/lib/data/blog";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description:
    "TradeBib blog — guides, risk management, markets, infrastructure, analytics, and product updates for automated MT5 traders.",
  path: "/blog",
  keywords: ["TradeBib blog", "MT5 guides", "forex bots", "EA risk management"],
});

export default function BlogPage() {
  return <BlogIndex posts={blogPosts} />;
}
