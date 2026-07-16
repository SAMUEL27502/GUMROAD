"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Search, X } from "lucide-react";
import {
  blogCategories,
  getReadingTime,
  searchBlogPosts,
  type BlogCategory,
  type BlogPost,
} from "@/lib/data/blog";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
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
    <Container padY="md">
      <PageHeader
        badge="Blog"
        title={<span className="gradient-text">TradeBib Blog</span>}
        description="Guides, risk, markets, infrastructure, analytics, and product updates — with Markdown articles, categories, search, and reading time."
      />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" aria-hidden />
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
            <X className="h-4 w-4" aria-hidden />
            Clear filters
          </Button>
        )}
      </div>

      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Blog categories">
        <button
          type="button"
          onClick={() => setCategory("All")}
          aria-pressed={category === "All"}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
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
            aria-pressed={category === cat.name}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              category === cat.name
                ? "border-sky-500/50 bg-sky-500/15 text-sky-300"
                : "border-border/70 text-muted-foreground hover:border-sky-500/30"
            )}
          >
            {cat.name} ({categoryCounts[cat.name] ?? 0})
          </button>
        ))}
      </div>

      <p className="text-muted-foreground mb-6 text-sm" aria-live="polite">
        {filtered.length} article{filtered.length === 1 ? "" : "s"}
      </p>

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
          {filtered.map((post) => {
            const reading = getReadingTime(post.content);
            return (
              <Card
                key={post.id}
                className="border-border/70 bg-card/80 group flex h-full flex-col transition-colors hover:border-sky-500/40"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" aria-hidden />
                      {reading.text}
                    </span>
                  </div>
                  <CardTitle className="mt-3 text-lg leading-snug">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="focus-visible:ring-ring rounded-sm hover:text-sky-400 focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {post.title}
                    </Link>
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
                      className="inline-flex items-center gap-1 text-sm font-medium text-sky-400 hover:text-sky-300 focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                      aria-label={`Read ${post.title}`}
                    >
                      Read <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}
