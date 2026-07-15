"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Search, SlidersHorizontal, X } from "lucide-react";
import { BotCard } from "@/components/bots/bot-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bots } from "@/lib/data/bots";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";

const PAGE_SIZE = 6;

const categories = ["All", "Forex", "Metals", "Crypto"];
const riskLevels = ["All", "LOW", "MEDIUM", "HIGH"];
const strategies = [
  "All",
  "Scalping",
  "Trend Following",
  "Grid",
  "Mean Reversion",
  "Hybrid",
  "Hedging",
  "Range",
  "Breakout",
];
const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under $40", value: "under40" },
  { label: "$40 – $60", value: "mid" },
  { label: "Over $60", value: "over60" },
];
const sortOptions = [
  { label: "Highest ROI", value: "roi-desc" },
  { label: "Lowest ROI", value: "roi-asc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Popular", value: "subscribers-desc" },
  { label: "Top Rated", value: "rating-desc" },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [risk, setRisk] = useState("All");
  const [strategy, setStrategy] = useState("All");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("roi-desc");
  const [page, setPage] = useState(1);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites } = useFavoritesStore();

  const filtered = useMemo(() => {
    let result = [...bots];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tradingPair.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category !== "All") result = result.filter((b) => b.category === category);
    if (risk !== "All") result = result.filter((b) => b.riskLevel === risk);
    if (strategy !== "All") result = result.filter((b) => b.strategy === strategy);

    if (priceRange === "under40") result = result.filter((b) => b.price < 40);
    else if (priceRange === "mid") result = result.filter((b) => b.price >= 40 && b.price <= 60);
    else if (priceRange === "over60") result = result.filter((b) => b.price > 60);

    if (showFavoritesOnly) result = result.filter((b) => favorites.includes(b.id));

    result.sort((a, b) => {
      switch (sort) {
        case "roi-desc":
          return b.roi - a.roi;
        case "roi-asc":
          return a.roi - b.roi;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "subscribers-desc":
          return b.subscribers - a.subscribers;
        case "rating-desc":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return result;
  }, [search, category, risk, strategy, priceRange, sort, showFavoritesOnly, favorites]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeFilters =
    (category !== "All" ? 1 : 0) +
    (risk !== "All" ? 1 : 0) +
    (strategy !== "All" ? 1 : 0) +
    (priceRange !== "all" ? 1 : 0) +
    (showFavoritesOnly ? 1 : 0);

  function clearFilters() {
    setCategory("All");
    setRisk("All");
    setStrategy("All");
    setPriceRange("all");
    setShowFavoritesOnly(false);
    setSearch("");
    setPage(1);
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Badge variant="secondary" className="mb-4">
            Marketplace
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse <span className="gradient-text">Verified MT5 Bots</span>
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Filter by strategy, risk, and performance. Subscribe to verified Expert Advisors with
            transparent equity curves and live stats.
          </p>
        </motion.div>

        {/* Search & toolbar */}
        <div className="glass mb-6 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search bots, pairs, tags..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setShowFavoritesOnly(!showFavoritesOnly);
                  setPage(1);
                }}
              >
                <Heart className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
                Wishlist ({favorites.length})
              </Button>
              <Select value={sort} onValueChange={(v) => setSort(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border/50 pt-4">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </span>

            <Select
              value={category}
              onValueChange={(v) => {
                setCategory(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={risk}
              onValueChange={(v) => {
                setRisk(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                {riskLevels.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r === "All" ? "All Risk" : r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={strategy}
              onValueChange={(v) => {
                setStrategy(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Strategy" />
              </SelectTrigger>
              <SelectContent>
                {strategies.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={priceRange}
              onValueChange={(v) => {
                setPriceRange(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-3.5 w-3.5" />
                Clear ({activeFilters})
              </Button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {paginated.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{filtered.length}</span> bots
          </p>
        </div>

        {/* Grid */}
        {paginated.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((bot, i) => (
              <BotCard key={bot.id} bot={bot} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass flex flex-col items-center justify-center rounded-2xl py-20 text-center"
          >
            <Heart className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold">No bots found</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Try adjusting your filters or search query to find matching Expert Advisors.
            </p>
            <Button variant="outline" className="mt-6" onClick={clearFilters}>
              Reset filters
            </Button>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === currentPage ? "default" : "outline"}
                size="sm"
                className="min-w-9"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
