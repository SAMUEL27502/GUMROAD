"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Search, X } from "lucide-react";
import {
  blogCategories,
  getReadingTime,
  searchBlogPosts,
  type BlogCategory,
  type BlogPost,
} from "@/lib/data/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<BlogCategory | "All">("All");

  const filtered = useMemo(() => searchBlogPosts(query, category), [query, category]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    for (const cat of blogCategories) {
      counts[cat.name] = posts.filter((p) => p.category === cat.name).length;
    }
    return counts;
  }, [posts]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <Badge className="mb-4 border-sky-500/30 bg-sky-500/10 text-sky-300">Blog</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">TradeBib Blog</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Guides, risk, markets, infrastructure, analytics, and product updates — with Markdown
          articles, categories, search, and reading time.
        </p>
      </motion.div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, tags, authors, or content…"
            className="pl-10"
            aria-label="Search blog"
          />
        </div>
        {(query || category !== "All") && (
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("All")}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
            category === "All"
              ? "border-sky-500/50 bg-sky-500/15 text-sky-300"
              : "border-border/70 text-muted-foreground hover:border-sky-500/30"
          )}
        >
          All ({categoryCounts.All})
        </button>
        {blogCategories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setCategory(cat.name)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              category === cat.name
                ? "border-sky-500/50 bg-sky-500/15 text-sky-300"
                : "border-border/70 text-muted-foreground hover:border-sky-500/30"
            )}
          >
            {cat.name} ({categoryCounts[cat.name] ?? 0})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="Try another keyword or category."
          actionLabel="Clear filters"
          onAction={() => {
            setQuery("");
            setCategory("All");
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => {
            const reading = getReadingTime(post.content);
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-border/70 bg-card/80 group flex h-full flex-col transition-colors hover:border-sky-500/40">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {reading.text}
                      </span>
                    </div>
                    <CardTitle className="mt-3 text-lg leading-snug transition-colors group-hover:text-sky-400">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-4 pt-0">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-muted-foreground text-xs">
                        <p>{post.author}</p>
                        <p>{post.date}</p>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-sky-400 hover:text-sky-300"
                      >
                        Read <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
