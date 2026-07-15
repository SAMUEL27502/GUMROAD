"use client";

import { useState } from "react";
import { LayoutDashboard, Store, LineChart, Plug, Settings, Bot } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton, SkeletonCard, SkeletonStat } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { AreaPerformanceChart, BarPerformanceChart, DonutChart } from "@/components/ui/charts";
import { notify } from "@/components/ui/toast";
import { Sidebar } from "@/components/layout/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const chartData = [
  { month: "Jan", value: 21000, return: 2.1 },
  { month: "Feb", value: 21840, return: 4.0 },
  { month: "Mar", value: 22410, return: 2.6 },
  { month: "Apr", value: 23120, return: 3.2 },
  { month: "May", value: 23890, return: 3.3 },
  { month: "Jun", value: 24850, return: 4.0 },
];

const donutData = [
  { name: "Low", value: 25, color: "#22C55E" },
  { name: "Medium", value: 45, color: "#0EA5E9" },
  { name: "High", value: 30, color: "#EF4444" },
];

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/charts", label: "Charts", icon: LineChart },
  { href: "/mt5", label: "MT5 Connect", icon: Plug },
  { href: "/profile", label: "Settings", icon: Settings },
];

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <div>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="bodySm" className="mt-2">
          {description}
        </Typography>
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 max-w-3xl">
        <Typography variant="caption" className="text-sky-400">
          TradeBib Design System
        </Typography>
        <Typography variant="display" className="mt-3">
          Modern SaaS UI kit
        </Typography>
        <Typography variant="body" className="text-muted-foreground mt-4">
          Inter typography, dark navy surfaces, sky/blue accents, glassmorphism, and reusable
          primitives inspired by Stripe and Vercel.
        </Typography>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {[
          "Typography",
          "Buttons",
          "Cards",
          "Forms",
          "Badges",
          "Tables",
          "Dropdowns",
          "Sidebar",
          "Skeletons",
          "Empty",
          "Charts",
          "Dialogs",
          "Toasts",
        ].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="border-border/70 bg-card/60 text-muted-foreground rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:border-sky-500/40 hover:text-sky-400"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="space-y-20">
        <Section id="typography" title="Typography" description="Inter-based scale for product UI.">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Typography variant="display">Display — Trade smarter</Typography>
              <Typography variant="h1">Heading 1 — Marketplace</Typography>
              <Typography variant="h2">Heading 2 — Portfolio overview</Typography>
              <Typography variant="h3">Heading 3 — Active bots</Typography>
              <Typography variant="h4">Heading 4 — Risk distribution</Typography>
              <Typography variant="body">
                Body — Browse verified MetaTrader 5 Expert Advisors with live performance data.
              </Typography>
              <Typography variant="bodySm">
                Body small — Trading involves risk. Past performance does not guarantee future
                results.
              </Typography>
              <Typography variant="caption">Caption — Verified performance</Typography>
              <Typography variant="mono">Mono / tabular — $24,850.42 · +8.7%</Typography>
              <Typography variant="gradient">Gradient accent heading</Typography>
            </CardContent>
          </Card>
        </Section>

        <Section id="buttons" title="Buttons" description="Rounded actions with blue emphasis.">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="glass">Glass</Button>
            <Button variant="success">Success</Button>
            <Button variant="destructive">Destructive</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        <Section id="cards" title="Cards" description="Default, glass, and outline surfaces.">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Default card</CardTitle>
                <CardDescription>Solid dark surface with soft shadow.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Used for dashboards and listings.</p>
              </CardContent>
            </Card>
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Glass card</CardTitle>
                <CardDescription>Blurred glassmorphism panel.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Hero overlays and premium panels.</p>
              </CardContent>
            </Card>
            <Card variant="outline">
              <CardHeader>
                <CardTitle>Outline card</CardTitle>
                <CardDescription>Border-only lightweight container.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Filters and compact groups.</p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          id="forms"
          title="Forms"
          description="Inputs, textarea, selects, switches, checkboxes."
        >
          <Card>
            <CardContent className="grid gap-5 pt-6 md:grid-cols-2">
              <FormField label="Email" htmlFor="email" required>
                <Input id="email" type="email" placeholder="you@tradebib.com" />
              </FormField>
              <FormField label="Plan" htmlFor="plan">
                <Select defaultValue="pro">
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Notes" htmlFor="notes" className="md:col-span-2">
                <Textarea id="notes" placeholder="Tell us about your trading goals…" />
              </FormField>
              <div className="flex items-center gap-3">
                <Checkbox id="terms" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
                <Label htmlFor="terms">Accept risk disclosure</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="alerts" defaultChecked />
                <Label htmlFor="alerts">Email alerts</Label>
              </div>
              <div className="md:col-span-2">
                <Label className="mb-2 block">Progress</Label>
                <Progress value={68} />
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section id="badges" title="Badges" description="Status and risk chips.">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Verified</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="low">LOW</Badge>
            <Badge variant="medium">MEDIUM</Badge>
            <Badge variant="high">HIGH</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Section>

        <Section
          id="tables"
          title="Tables"
          description="Dense data tables for admin and dashboards."
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bot</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">GoldScalper Pro</TableCell>
                <TableCell>XAUUSD</TableCell>
                <TableCell className="text-emerald-400">+18.4%</TableCell>
                <TableCell>
                  <Badge variant="success">Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">EuroTrend AI</TableCell>
                <TableCell>EURUSD</TableCell>
                <TableCell className="text-emerald-400">+11.2%</TableCell>
                <TableCell>
                  <Badge variant="success">Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">BreakoutHunter</TableCell>
                <TableCell>GBPUSD</TableCell>
                <TableCell className="text-emerald-400">+15.6%</TableCell>
                <TableCell>
                  <Badge variant="warning">Syncing</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Section>

        <Section id="dropdowns" title="Dropdowns" description="Menus for profile and actions.">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        <Section
          id="sidebar"
          title="Sidebar"
          description="Collapsible navigation for dashboard/admin shells."
        >
          <div className="border-border/70 overflow-hidden rounded-2xl border">
            <div className="flex min-h-[320px]">
              <Sidebar items={sidebarItems} title="Workspace" className="static h-auto" />
              <div className="bg-background/40 text-muted-foreground flex flex-1 items-center justify-center p-8 text-sm">
                Main content area
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="skeletons"
          title="Loading Skeletons"
          description="Shimmer placeholders while data loads."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <SkeletonStat />
            <SkeletonStat />
            <Skeleton className="h-[120px] rounded-2xl" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SkeletonCard />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-3/4" />
            </div>
          </div>
        </Section>

        <Section id="empty" title="Empty States" description="Friendly zero-data experiences.">
          <EmptyState
            icon={Bot}
            title="No bots subscribed yet"
            description="Browse the marketplace and subscribe to your first verified Expert Advisor."
            actionLabel="Browse marketplace"
            onAction={() => notify.info("Navigate to marketplace")}
          />
        </Section>

        <Section
          id="charts"
          title="Charts"
          description="Recharts wrappers with dark TradingView-like styling."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Area performance</CardTitle>
              </CardHeader>
              <CardContent>
                <AreaPerformanceChart data={chartData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly returns</CardTitle>
              </CardHeader>
              <CardContent>
                <BarPerformanceChart data={chartData} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Risk distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <DonutChart data={donutData} />
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section
          id="dialogs"
          title="Dialogs & Modals"
          description="Centered dialogs and side sheets."
        >
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Subscribe to GoldScalper Pro</DialogTitle>
                  <DialogDescription>
                    Confirm your monthly subscription. You can cancel anytime from Profile →
                    Billing.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={() => notify.success("Subscribed")}>Confirm</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open sheet / modal drawer</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                  <SheetDescription>Latest account and bot events.</SheetDescription>
                </SheetHeader>
                <div className="text-muted-foreground mt-6 space-y-3 text-sm">
                  <p>GoldScalper Pro +2.4% today</p>
                  <Separator />
                  <p>IC Markets Live equity synced</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Section>

        <Section id="toasts" title="Toasts" description="Sonner toasts with product helpers.">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => notify.success("Bot deployed", "Pushed to MT5 successfully")}>
              Success toast
            </Button>
            <Button variant="destructive" onClick={() => notify.error("Connection failed")}>
              Error toast
            </Button>
            <Button variant="outline" onClick={() => notify.info("Sync scheduled")}>
              Info toast
            </Button>
          </div>
        </Section>

        <Section id="tabs" title="Tabs" description="Segmented navigation for dense pages.">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardContent className="text-muted-foreground pt-6 text-sm">
                  Overview tab content.
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="performance">
              <Card>
                <CardContent className="text-muted-foreground pt-6 text-sm">
                  Performance tab content.
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <Card>
                <CardContent className="text-muted-foreground pt-6 text-sm">
                  Reviews tab content.
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Section>

        <Separator />

        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6">
          <Typography variant="h3">Also included</Typography>
          <ul className="text-muted-foreground mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <li>Navbar — sticky, responsive, notifications, profile menu</li>
            <li>Footer — product, company, tools, legal columns</li>
            <li>Avatar · Accordion · Progress · Select · Loader</li>
            <li>Dark theme by default · Blue (#0EA5E9 / #2563EB) accents</li>
            <li>Glassmorphism utilities (`.glass`, `.glass-strong`)</li>
            <li>Live showcase route: `/design-system`</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
