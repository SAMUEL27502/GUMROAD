"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Search, SlidersHorizontal, X } from "lucide-react";
import { BotCard } from "@/components/bots/bot-card";
import { AnimatedGradient } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { bots } from "@/lib/data/bots";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";

const PAGE_SIZE = 6;

const categories = ["All", "Forex", "Metals", "Crypto"] as const;
const riskLevels = ["All", "LOW", "MEDIUM", "HIGH"] as const;
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
] as const;

const priceRanges = [
  { label: "All prices", value: "all" },
  { label: "Under $40", value: "under40" },
  { label: "$40 – $60", value: "mid" },
  { label: "Over $60", value: "over60" },
] as const;

const roiRanges = [
  { label: "All ROI", value: "all" },
  { label: "Under 10%", value: "under10" },
  { label: "10% – 15%", value: "mid" },
  { label: "Over 15%", value: "over15" },
] as const;

const sortOptions = [
  { label: "Highest ROI", value: "roi-desc" },
  { label: "Lowest ROI", value: "roi-asc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Popular", value: "subscribers-desc" },
  { label: "Top Rated", value: "rating-desc" },
  { label: "Newest", value: "newest" },
] as const;

type Filters = {
  category: string;
  risk: string;
  strategy: string;
  priceRange: string;
  roiRange: string;
  verifiedOnly: boolean;
  wishlistOnly: boolean;
};

const defaultFilters: Filters = {
  category: "All",
  risk: "All",
  strategy: "All",
  priceRange: "all",
  roiRange: "all",
  verifiedOnly: false,
  wishlistOnly: false,
};

function FilterControls({
  filters,
  setFilters,
  onChangePage,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onChangePage: () => void;
}) {
  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    onChangePage();
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-muted-foreground mb-2 block text-xs tracking-wide uppercase">
          Category
        </Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={filters.category === c ? "default" : "outline"}
              onClick={() => update("category", c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-muted-foreground mb-2 block text-xs tracking-wide uppercase">
            Risk
          </Label>
          <Select value={filters.risk} onValueChange={(v) => update("risk", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              {riskLevels.map((r) => (
                <SelectItem key={r} value={r}>
                  {r === "All" ? "All risk levels" : r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-muted-foreground mb-2 block text-xs tracking-wide uppercase">
            Strategy
          </Label>
          <Select value={filters.strategy} onValueChange={(v) => update("strategy", v)}>
            <SelectTrigger>
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
        </div>

        <div>
          <Label className="text-muted-foreground mb-2 block text-xs tracking-wide uppercase">
            ROI
          </Label>
          <Select value={filters.roiRange} onValueChange={(v) => update("roiRange", v)}>
            <SelectTrigger>
              <SelectValue placeholder="ROI" />
            </SelectTrigger>
            <SelectContent>
              {roiRanges.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-muted-foreground mb-2 block text-xs tracking-wide uppercase">
            Price
          </Label>
          <Select value={filters.priceRange} onValueChange={(v) => update("priceRange", v)}>
            <SelectTrigger>
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
        </div>
      </div>

      <div className="border-border/60 flex items-center justify-between rounded-xl border px-3 py-2.5">
        <div>
          <p className="text-sm font-medium">Verified only</p>
          <p className="text-muted-foreground text-xs">Show bots with performance verification</p>
        </div>
        <Switch checked={filters.verifiedOnly} onCheckedChange={(v) => update("verifiedOnly", v)} />
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState("roi-desc");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
          b.strategy.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.category !== "All") {
      result = result.filter((b) => b.category === filters.category);
    }
    if (filters.risk !== "All") {
      result = result.filter((b) => b.riskLevel === filters.risk);
    }
    if (filters.strategy !== "All") {
      result = result.filter((b) => b.strategy === filters.strategy);
    }

    if (filters.priceRange === "under40") result = result.filter((b) => b.price < 40);
    else if (filters.priceRange === "mid")
      result = result.filter((b) => b.price >= 40 && b.price <= 60);
    else if (filters.priceRange === "over60") result = result.filter((b) => b.price > 60);

    if (filters.roiRange === "under10") result = result.filter((b) => b.roi < 10);
    else if (filters.roiRange === "mid") result = result.filter((b) => b.roi >= 10 && b.roi <= 15);
    else if (filters.roiRange === "over15") result = result.filter((b) => b.roi > 15);

    if (filters.verifiedOnly) result = result.filter((b) => b.verified);
    if (filters.wishlistOnly) result = result.filter((b) => favorites.includes(b.id));

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
        case "newest":
          return Number(b.id) - Number(a.id);
        default:
          return 0;
      }
    });

    return result;
  }, [search, filters, sort, favorites]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (filters.category !== "All") {
      chips.push({
        key: "category",
        label: `Category: ${filters.category}`,
        clear: () => setFilters((f) => ({ ...f, category: "All" })),
      });
    }
    if (filters.risk !== "All") {
      chips.push({
        key: "risk",
        label: `Risk: ${filters.risk}`,
        clear: () => setFilters((f) => ({ ...f, risk: "All" })),
      });
    }
    if (filters.strategy !== "All") {
      chips.push({
        key: "strategy",
        label: `Strategy: ${filters.strategy}`,
        clear: () => setFilters((f) => ({ ...f, strategy: "All" })),
      });
    }
    if (filters.roiRange !== "all") {
      chips.push({
        key: "roi",
        label: `ROI: ${roiRanges.find((r) => r.value === filters.roiRange)?.label}`,
        clear: () => setFilters((f) => ({ ...f, roiRange: "all" })),
      });
    }
    if (filters.priceRange !== "all") {
      chips.push({
        key: "price",
        label: `Price: ${priceRanges.find((p) => p.value === filters.priceRange)?.label}`,
        clear: () => setFilters((f) => ({ ...f, priceRange: "all" })),
      });
    }
    if (filters.verifiedOnly) {
      chips.push({
        key: "verified",
        label: "Verified only",
        clear: () => setFilters((f) => ({ ...f, verifiedOnly: false })),
      });
    }
    if (filters.wishlistOnly) {
      chips.push({
        key: "wishlist",
        label: "Wishlist",
        clear: () => setFilters((f) => ({ ...f, wishlistOnly: false })),
      });
    }
    if (search.trim()) {
      chips.push({
        key: "search",
        label: `Search: ${search.trim()}`,
        clear: () => setSearch(""),
      });
    }
    return chips;
  }, [filters, search]);

  function clearFilters() {
    setFilters(defaultFilters);
    setSearch("");
    setPage(1);
  }

  return (
    <div className="relative">
      <AnimatedGradient variant="subtle" />

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
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Search and filter by category, risk, ROI, price, and strategy. Save bots to your
            wishlist and subscribe when ready.
          </p>
        </motion.div>

        <div className="glass mb-6 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search bots, pairs, strategies, tags..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
                aria-label="Search marketplace"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={filters.wishlistOnly ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilters((f) => ({ ...f, wishlistOnly: !f.wishlistOnly }));
                  setPage(1);
                }}
              >
                <Heart className={cn("h-4 w-4", filters.wishlistOnly && "fill-current")} />
                Wishlist ({favorites.length})
              </Button>

              <Select
                value={sort}
                onValueChange={(v) => {
                  setSort(v);
                  setPage(1);
                }}
              >
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

              {/* Mobile filters */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeChips.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeChips.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Narrow bots by category, risk, ROI, and price.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterControls
                      filters={filters}
                      setFilters={setFilters}
                      onChangePage={() => setPage(1)}
                    />
                    <div className="mt-6 flex gap-2">
                      <Button className="flex-1" onClick={() => setMobileFiltersOpen(false)}>
                        Apply
                      </Button>
                      <Button variant="outline" onClick={clearFilters}>
                        Reset
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop filters */}
          <div className="border-border/50 mt-4 hidden border-t pt-4 lg:block">
            <div className="text-muted-foreground mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </div>
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              onChangePage={() => setPage(1)}
            />
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => {
                  chip.clear();
                  setPage(1);
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300 transition hover:bg-sky-500/20"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            Showing{" "}
            <span className="text-foreground font-semibold">
              {paginated.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of <span className="text-foreground font-semibold">{filtered.length}</span> bots
          </p>
        </div>

        {paginated.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((bot, i) => (
              <BotCard key={bot.id} bot={bot} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="No bots found"
            description="Try adjusting search, ROI, risk, or price filters to find matching Expert Advisors."
            actionLabel="Reset filters"
            onAction={clearFilters}
          />
        )}

        <Pagination
          className="mt-10"
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
