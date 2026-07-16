"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AnimatedGradient,
  AnimatedParticles,
  CountUp,
  Fade,
  FloatingCard,
  HoverGlow,
  HoverLift,
  HoverScale,
  Scale,
  ScaleInView,
  ScrollReveal,
  Slide,
  SlideInView,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { platformStats } from "@/lib/data/platform";

export default function AnimationsPage() {
  return (
    <div className="relative overflow-hidden">
      <AnimatedGradient variant="subtle" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Slide>
          <Badge variant="secondary" className="mb-4">
            Framer Motion
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">Animated sections</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Reusable TradeBib motion primitives: Fade, Slide, Scale, Hover, Count-up, Floating
            cards, Animated gradients, and Scroll animations.
          </p>
          <Button className="mt-6" variant="outline" asChild>
            <Link href="/design-system">Open design system</Link>
          </Button>
        </Slide>

        <div className="mt-14 space-y-16">
          <section>
            <h2 className="mb-4 text-xl font-bold">Fade</h2>
            <Fade>
              <Card>
                <CardContent className="text-muted-foreground p-6 text-sm">
                  Fades in on mount.
                </CardContent>
              </Card>
            </Fade>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">Slide</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Slide direction="up">
                <Card>
                  <CardContent className="p-6">Slide up</CardContent>
                </Card>
              </Slide>
              <Slide direction="left" delay={0.1}>
                <Card>
                  <CardContent className="p-6">Slide left</CardContent>
                </Card>
              </Slide>
              <Slide direction="right" delay={0.2}>
                <Card>
                  <CardContent className="p-6">Slide right</CardContent>
                </Card>
              </Slide>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">Scale</h2>
            <Scale from={0.9}>
              <Card className="max-w-md">
                <CardContent className="p-6">Scales into view on mount.</CardContent>
              </Card>
            </Scale>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">Hover</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <HoverLift>
                <Card>
                  <CardContent className="p-6">HoverLift</CardContent>
                </Card>
              </HoverLift>
              <HoverScale>
                <Card>
                  <CardContent className="p-6">HoverScale</CardContent>
                </Card>
              </HoverScale>
              <HoverGlow>
                <Card>
                  <CardContent className="p-6">HoverGlow</CardContent>
                </Card>
              </HoverGlow>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">Count-up numbers</h2>
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {platformStats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-5 text-center">
                    <CountUp
                      value={stat.value}
                      display={stat.display}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.label.includes("ROI") || stat.label.includes("Volume") ? 1 : 0}
                    />
                    <p className="text-muted-foreground mt-2 text-xs">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">Floating cards</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <FloatingCard>
                <Card variant="glass">
                  <CardContent className="p-6">Float A</CardContent>
                </Card>
              </FloatingCard>
              <FloatingCard delay={0.5} amplitude={14}>
                <Card variant="glass">
                  <CardContent className="p-6">Float B</CardContent>
                </Card>
              </FloatingCard>
              <FloatingCard delay={1} duration={7}>
                <Card variant="glass">
                  <CardContent className="p-6">Float C</CardContent>
                </Card>
              </FloatingCard>
            </div>
          </section>

          <section className="border-border/70 relative overflow-hidden rounded-3xl border">
            <AnimatedGradient variant="orb" />
            <AnimatedParticles count={10} />
            <div className="relative p-8">
              <h2 className="mb-2 text-xl font-bold">Animated gradients</h2>
              <p className="text-muted-foreground text-sm">
                Moving orbs, pulse mesh, and particle accents.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">Scroll animations</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Scroll down — items reveal and stagger into place.
            </p>
            <ScrollReveal>
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>ScrollReveal</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  Fades and rises when it enters the viewport.
                </CardContent>
              </Card>
            </ScrollReveal>
            <SlideInView direction="left" className="mb-4">
              <Card>
                <CardContent className="p-6">SlideInView from the left</CardContent>
              </Card>
            </SlideInView>
            <ScaleInView className="mb-4">
              <Card>
                <CardContent className="p-6">ScaleInView on scroll</CardContent>
              </Card>
            </ScaleInView>
            <Stagger className="grid gap-4 sm:grid-cols-3">
              {["One", "Two", "Three"].map((label) => (
                <StaggerItem key={label}>
                  <Card>
                    <CardContent className="p-6">Stagger {label}</CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        </div>
      </div>
    </div>
  );
}
