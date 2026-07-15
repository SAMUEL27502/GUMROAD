"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "@/lib/data/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">TradeBib Blog</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Guides, market insights, and platform updates for automated traders.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="glass group border-border/60 flex h-full flex-col transition-colors hover:border-sky-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <CardTitle className="mt-3 text-lg leading-snug transition-colors group-hover:text-sky-400">
                  {post.title}
                </CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-between pt-0">
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
