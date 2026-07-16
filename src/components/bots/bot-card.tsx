"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Star, Users } from "lucide-react";
import { toast } from "sonner";
import type { Bot } from "@/lib/data/bots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";

const riskVariant = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
} as const;

export interface BotCardProps {
  bot: Bot;
  index?: number;
  className?: string;
  /** Compact layout for sidebars / compare strips */
  compact?: boolean;
  onSubscribe?: (bot: Bot) => void;
  onViewDetails?: (bot: Bot) => void;
}

export function BotCard({
  bot,
  index = 0,
  className,
  compact = false,
  onSubscribe,
  onViewDetails,
}: BotCardProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favored = isFavorite(bot.id);

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(bot.id);
    toast.success(favored ? "Removed from wishlist" : "Added to wishlist");
  }

  function handleSubscribe() {
    if (onSubscribe) {
      onSubscribe(bot);
      return;
    }
    toast.success(`Subscribed to ${bot.name}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.015 }}
      className={cn("h-full", className)}
    >
      <Card
        className={cn(
          "group border-border/70 bg-card/80 h-full overflow-hidden transition-all duration-300",
          "hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10"
        )}
      >
        {/* Image / visual header */}
        <div
          className={cn(
            "relative overflow-hidden bg-gradient-to-br",
            bot.imageGradient,
            compact ? "h-28" : "h-40"
          )}
        >
          {bot.imageUrl ? (
            <Image
              src={bot.imageUrl}
              alt={bot.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <>
              <div className="grid-bg absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <motion.div
                className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/10 blur-2xl"
                animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.15, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {bot.verified && <Badge variant="success">Verified</Badge>}
            <Badge variant={riskVariant[bot.riskLevel]}>{bot.riskLevel} Risk</Badge>
          </div>

          <button
            type="button"
            onClick={handleFavorite}
            className={cn(
              "absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl",
              "bg-black/40 text-white backdrop-blur transition hover:scale-110 hover:bg-black/60"
            )}
            aria-label={favored ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                favored ? "fill-rose-500 text-rose-500" : "group-hover:text-rose-300"
              )}
            />
          </button>

          <div className="absolute right-4 bottom-4 left-4">
            <p className="text-xs font-medium tracking-wider text-white/70 uppercase">
              {bot.strategy} · {bot.tradingPair}
            </p>
            <h3 className={cn("font-bold text-white", compact ? "text-lg" : "text-xl")}>
              {bot.name}
            </h3>
          </div>
        </div>

        <CardContent className={cn("space-y-4", compact ? "pt-4" : "pt-5")}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{bot.category}</span>
            <span className="inline-flex items-center gap-1 text-amber-400" title="Rating">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span className="font-semibold">{bot.rating.toFixed(1)}</span>
            </span>
          </div>

          {/* Metrics: ROI, Drawdown, Win Rate */}
          <div className="grid grid-cols-3 gap-2 text-center sm:gap-3">
            <div className="bg-muted/40 rounded-xl p-2.5 transition-colors group-hover:bg-emerald-500/10">
              <p className="text-muted-foreground text-[10px] tracking-wide uppercase">ROI</p>
              <p className="text-sm font-bold text-emerald-400">{formatPercent(bot.roi)}</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-2.5 transition-colors group-hover:bg-amber-500/10">
              <p className="text-muted-foreground text-[10px] tracking-wide uppercase">Drawdown</p>
              <p className="text-sm font-bold text-amber-400">{bot.drawdown.toFixed(1)}%</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-2.5 transition-colors group-hover:bg-sky-500/10">
              <p className="text-muted-foreground text-[10px] tracking-wide uppercase">Win Rate</p>
              <p className="text-sm font-bold">{bot.winRate.toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span
              className="text-muted-foreground inline-flex items-center gap-1.5"
              title="Subscribers"
            >
              <Users className="h-3.5 w-3.5" />
              {bot.subscribers.toLocaleString()} subscribers
            </span>
            <span className="text-foreground font-bold">
              {formatCurrency(bot.price)}
              <span className="text-muted-foreground text-xs font-medium">/mo</span>
            </span>
          </div>
        </CardContent>

        <CardFooter className="gap-2">
          <Button
            variant="outline"
            className="flex-1 transition-colors group-hover:border-sky-500/40"
            asChild={!onViewDetails}
            onClick={onViewDetails ? () => onViewDetails(bot) : undefined}
          >
            {onViewDetails ? "View Details" : <Link href={`/bots/${bot.slug}`}>View Details</Link>}
          </Button>
          <Button
            className="flex-1 shadow-sky-500/0 transition-shadow group-hover:shadow-md group-hover:shadow-sky-500/20"
            onClick={handleSubscribe}
          >
            Subscribe
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function BotCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("border-border/70 overflow-hidden", className)}>
      <Skeleton className="h-40 w-full rounded-none" />
      <CardContent className="space-y-4 pt-5">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-11 flex-1" />
        <Skeleton className="h-11 flex-1" />
      </CardFooter>
    </Card>
  );
}
