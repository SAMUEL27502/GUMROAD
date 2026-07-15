"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star, Users } from "lucide-react";
import { toast } from "sonner";
import type { Bot } from "@/lib/data/bots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";

const riskVariant = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
};

export function BotCard({ bot, index = 0 }: { bot: Bot; index?: number }) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favored = isFavorite(bot.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className="group overflow-hidden border-border/70 bg-card/80 transition-colors hover:border-sky-500/40">
        <div className={`relative h-36 bg-gradient-to-br ${bot.imageGradient}`}>
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute left-4 top-4 flex gap-2">
            {bot.verified && <Badge variant="success">Verified</Badge>}
            <Badge variant={riskVariant[bot.riskLevel]}>{bot.riskLevel}</Badge>
          </div>
          <button
            type="button"
            onClick={() => {
              toggleFavorite(bot.id);
              toast.success(favored ? "Removed from favorites" : "Added to favorites");
            }}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 text-white backdrop-blur transition hover:bg-black/60 cursor-pointer"
            aria-label="Favorite"
          >
            <Heart className={`h-4 w-4 ${favored ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
          <div className="absolute bottom-4 left-4">
            <p className="text-xs font-medium uppercase tracking-wider text-white/70">{bot.strategy}</p>
            <h3 className="text-xl font-bold text-white">{bot.name}</h3>
          </div>
        </div>

        <CardContent className="space-y-4 pt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{bot.tradingPair}</span>
            <span className="inline-flex items-center gap-1 text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              {bot.rating.toFixed(1)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-muted/40 p-2.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">ROI</p>
              <p className="text-sm font-bold text-emerald-400">{formatPercent(bot.roi)}</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-2.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">DD</p>
              <p className="text-sm font-bold text-amber-400">{bot.drawdown.toFixed(1)}%</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-2.5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Win</p>
              <p className="text-sm font-bold">{bot.winRate.toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {bot.subscribers.toLocaleString()}
            </span>
            <span className="font-bold text-foreground">{formatCurrency(bot.price)}/mo</span>
          </div>
        </CardContent>

        <CardFooter className="gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/bots/${bot.slug}`}>View Details</Link>
          </Button>
          <Button
            className="flex-1"
            onClick={() => toast.success(`Subscribed to ${bot.name}`)}
          >
            Subscribe
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
