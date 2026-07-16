"use client";

import { motion } from "framer-motion";
import { Newspaper, Tag } from "lucide-react";
import { forexNews } from "@/lib/data/platform";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 text-sky-400">
          <Newspaper className="h-6 w-6" />
          <span className="text-sm font-semibold tracking-wider uppercase">Market News</span>
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          <span className="gradient-text">Forex &amp; Metals Wire</span>
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Curated headlines for currency, metals, and crypto traders on the platform.
        </p>
      </motion.div>

      <div className="grid gap-4">
        {forexNews.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="glass border-border/60 transition-colors hover:border-sky-500/30">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    <Tag className="mr-1 h-3 w-3" />
                    {article.tag}
                  </Badge>
                  <span className="text-muted-foreground text-xs">{article.time}</span>
                </div>
                <CardTitle className="text-lg leading-snug">{article.title}</CardTitle>
                <CardDescription>{article.source}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Stay informed on market-moving developments. Connect your MT5 account to see how
                  your subscribed bots react to {article.tag} volatility.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
