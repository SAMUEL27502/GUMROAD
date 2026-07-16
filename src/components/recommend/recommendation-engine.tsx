"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  RefreshCw,
  Sparkles,
  Target,
  Wallet,
  Gauge,
  GraduationCap,
  CandlestickChart,
} from "lucide-react";
import { toast } from "sonner";
import { BotCard } from "@/components/bots/bot-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  CAPITAL_OPTIONS,
  EXPERIENCE_OPTIONS,
  FAVORITE_PAIRS,
  RISK_OPTIONS,
  TRADING_STYLES,
  recommendBots,
  type RecommendationInput,
  type RecommendationMatch,
} from "@/lib/recommendations/bot-recommender";
import { useRecommendationStore } from "@/stores/recommendation-store";
import { useSubscriptionsStore } from "@/stores/subscriptions-store";

const STEPS = [
  { id: "risk", title: "Risk tolerance", icon: Gauge },
  { id: "capital", title: "Capital", icon: Wallet },
  { id: "experience", title: "Experience", icon: GraduationCap },
  { id: "style", title: "Trading style", icon: CandlestickChart },
  { id: "pairs", title: "Favorite pairs", icon: Target },
] as const;

function MatchBreakdown({ match }: { match: RecommendationMatch }) {
  const rows: { key: keyof RecommendationMatch["breakdown"]; label: string }[] = [
    { key: "risk", label: "Risk" },
    { key: "capital", label: "Capital" },
    { key: "experience", label: "Experience" },
    { key: "style", label: "Style" },
    { key: "pairs", label: "Pairs" },
  ];

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.key} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium">{Math.round(match.breakdown[row.key])}%</span>
          </div>
          <Progress value={match.breakdown[row.key]} />
        </div>
      ))}
    </div>
  );
}

function OptionCard({
  selected,
  title,
  hint,
  onClick,
}: {
  selected: boolean;
  title: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-sky-500/60 bg-sky-500/10 shadow-lg shadow-sky-500/10"
          : "border-border/70 bg-card/60 hover:border-sky-500/30 hover:bg-card/90"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-muted-foreground mt-1 text-sm">{hint}</p>
        </div>
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
            selected ? "border-sky-400 bg-sky-500 text-white" : "border-border/80"
          )}
        >
          {selected ? <Check className="h-3 w-3" /> : null}
        </span>
      </div>
    </button>
  );
}

function ChipToggle({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-2 text-sm font-medium transition-all",
        selected
          ? "border-sky-500/60 bg-sky-500/15 text-sky-300"
          : "border-border/70 bg-card/50 text-muted-foreground hover:border-sky-500/30 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

export function RecommendationEngine() {
  const { preferences, setPreferences, replacePreferences, reset, completed } =
    useRecommendationStore();
  const { subscribe } = useSubscriptionsStore();
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(completed);
  const [draft, setDraft] = useState<RecommendationInput>(preferences);

  const quizProgress = showResults ? 100 : ((step + 1) / STEPS.length) * 100;

  const matches = useMemo(
    () =>
      recommendBots(showResults ? preferences : draft, {
        limit: 6,
        minScore: 0,
      }),
    [draft, preferences, showResults]
  );

  function updateDraft(partial: Partial<RecommendationInput>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  function toggleStyle(style: string) {
    updateDraft({
      tradingStyles: draft.tradingStyles.includes(style)
        ? draft.tradingStyles.filter((s) => s !== style)
        : [...draft.tradingStyles, style],
    });
  }

  function togglePair(pair: string) {
    updateDraft({
      favoritePairs: draft.favoritePairs.includes(pair)
        ? draft.favoritePairs.filter((p) => p !== pair)
        : [...draft.favoritePairs, pair],
    });
  }

  function canContinue(): boolean {
    if (step === 3 && draft.tradingStyles.length === 0) return false;
    if (step === 4 && draft.favoritePairs.length === 0) return false;
    return true;
  }

  function finish() {
    if (draft.tradingStyles.length === 0 || draft.favoritePairs.length === 0) {
      toast.error("Select at least one trading style and one favorite pair");
      return;
    }
    replacePreferences(draft);
    setPreferences(draft);
    setShowResults(true);
    toast.success("Recommendations ready");
  }

  function restart() {
    reset();
    setDraft({
      riskTolerance: "MEDIUM",
      capital: "500to2000",
      experience: "INTERMEDIATE",
      tradingStyles: [],
      favoritePairs: [],
    });
    setStep(0);
    setShowResults(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <Badge className="mb-4 border-sky-500/30 bg-sky-500/10 text-sky-300">
          <Brain className="mr-1.5 h-3.5 w-3.5" />
          AI Bot Recommendation Engine
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="gradient-text">Find your ideal EA</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
          Answer five inputs — risk, capital, experience, style, and pairs — and we score every bot
          for the best match.
        </p>
      </motion.div>

      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {showResults ? "Results" : `Step ${step + 1} of ${STEPS.length}`}
          </span>
          <span className="font-medium">{Math.round(quizProgress)}%</span>
        </div>
        <Progress value={quizProgress} />
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="border-border/70 bg-card/80 mb-8 overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = STEPS[step].icon;
                    return (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                        <Icon className="h-5 w-5" />
                      </div>
                    );
                  })()}
                  <div>
                    <CardTitle>{STEPS[step].title}</CardTitle>
                    <CardDescription>
                      {step === 0 && "How much equity swing are you comfortable with?"}
                      {step === 1 && "What account size will you allocate to automation?"}
                      {step === 2 && "How experienced are you with algorithmic trading?"}
                      {step === 3 && "Pick one or more styles you prefer to run."}
                      {step === 4 && "Select the pairs you like to trade most."}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {step === 0 && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {RISK_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        selected={draft.riskTolerance === opt.value}
                        title={opt.label}
                        hint={opt.hint}
                        onClick={() => updateDraft({ riskTolerance: opt.value })}
                      />
                    ))}
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {CAPITAL_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        selected={draft.capital === opt.value}
                        title={opt.label}
                        hint={opt.hint}
                        onClick={() => updateDraft({ capital: opt.value })}
                      />
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        selected={draft.experience === opt.value}
                        title={opt.label}
                        hint={opt.hint}
                        onClick={() => updateDraft({ experience: opt.value })}
                      />
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="flex flex-wrap gap-2">
                    {TRADING_STYLES.map((style) => (
                      <ChipToggle
                        key={style}
                        label={style}
                        selected={draft.tradingStyles.includes(style)}
                        onClick={() => toggleStyle(style)}
                      />
                    ))}
                  </div>
                )}

                {step === 4 && (
                  <div className="flex flex-wrap gap-2">
                    {FAVORITE_PAIRS.map((pair) => (
                      <ChipToggle
                        key={pair}
                        label={pair}
                        selected={draft.favoritePairs.includes(pair)}
                        onClick={() => togglePair(pair)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  disabled={!canContinue()}
                  onClick={() => {
                    if (!canContinue()) {
                      toast.error(
                        step === 3
                          ? "Select at least one trading style"
                          : "Select at least one favorite pair"
                      );
                      return;
                    }
                    setStep((s) => s + 1);
                  }}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={finish}>
                  <Sparkles className="h-4 w-4" />
                  Get recommendations
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Risk: {preferences.riskTolerance}</Badge>
                <Badge variant="outline">
                  Capital: {CAPITAL_OPTIONS.find((c) => c.value === preferences.capital)?.label}
                </Badge>
                <Badge variant="outline">{preferences.experience}</Badge>
                {preferences.tradingStyles.slice(0, 3).map((s) => (
                  <Badge key={s} className="border-sky-500/30 bg-sky-500/10 text-sky-300">
                    {s}
                  </Badge>
                ))}
                {preferences.favoritePairs.slice(0, 4).map((p) => (
                  <Badge key={p} variant="secondary">
                    {p}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" onClick={restart}>
                <RefreshCw className="h-4 w-4" />
                Retake quiz
              </Button>
            </div>

            {matches.length === 0 ? (
              <EmptyState
                title="No strong matches"
                description="Try adjusting your style or pair preferences."
                actionLabel="Start over"
                onAction={restart}
              />
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {matches.map((match, index) => (
                  <motion.div
                    key={match.bot.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="grid gap-4 rounded-2xl border border-border/70 bg-card/50 p-4 md:grid-cols-[1.2fr_0.8fr]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          className={cn(
                            "border-0",
                            match.matchPercent >= 80
                              ? "bg-emerald-500/15 text-emerald-300"
                              : match.matchPercent >= 60
                                ? "bg-sky-500/15 text-sky-300"
                                : "bg-amber-500/15 text-amber-300"
                          )}
                        >
                          {match.matchPercent}% match
                          {index === 0 ? " · Best fit" : ""}
                        </Badge>
                        <span className="text-muted-foreground text-xs">Score {match.score}</span>
                      </div>
                      <BotCard
                        bot={match.bot}
                        index={index}
                        compact
                        onSubscribe={(bot) => {
                          subscribe({ id: bot.id, name: bot.name, price: bot.price });
                          toast.success(`Subscribed to ${bot.name}`);
                        }}
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 text-sm font-semibold">Why this bot</h3>
                        <ul className="space-y-2">
                          {match.reasons.length > 0 ? (
                            match.reasons.map((reason) => (
                              <li
                                key={reason}
                                className="text-muted-foreground flex gap-2 text-sm"
                              >
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                                <span>{reason}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-muted-foreground text-sm">
                              Partial match across your profile inputs.
                            </li>
                          )}
                        </ul>
                      </div>
                      <MatchBreakdown match={match} />
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/bots/${match.bot.slug}`}>View details</Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link href="/marketplace">Browse full marketplace</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/compare">Compare top picks</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
