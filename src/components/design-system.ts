/**
 * TradeBib Design System
 *
 * Import primitives from `@/components/ui/*` and layout from `@/components/layout/*`.
 * Live gallery: `/design-system`
 *
 * Tokens: Inter font, dark navy (#020617), cards (#111827),
 * primary sky (#0EA5E9), secondary blue (#2563EB), glassmorphism.
 */

export { Typography, typographyVariants } from "@/components/ui/typography";
export { Button, buttonVariants } from "@/components/ui/button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
export { Badge, badgeVariants } from "@/components/ui/badge";
export { Input } from "@/components/ui/input";
export { Textarea } from "@/components/ui/textarea";
export { Label } from "@/components/ui/label";
export { FormField } from "@/components/ui/form-field";
export { Checkbox } from "@/components/ui/checkbox";
export { Switch } from "@/components/ui/switch";
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
export { Skeleton, SkeletonCard, SkeletonTable, SkeletonStat } from "@/components/ui/skeleton";
export { EmptyState } from "@/components/ui/empty-state";
export {
  ChartContainer,
  InteractiveTooltip,
  AreaPerformanceChart,
  LinePerformanceChart,
  BarPerformanceChart,
  BalanceChart,
  DrawdownChart,
  DonutChart,
} from "@/components/ui/charts";
export { DashboardCharts } from "@/components/dashboard/dashboard-charts";
export { notify, toast } from "@/components/ui/toast";
export { Separator } from "@/components/ui/separator";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
export { Progress } from "@/components/ui/progress";
export { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
export { Loader, PageLoader } from "@/components/ui/loader";
export { Pagination } from "@/components/ui/pagination";
export { BotCard, BotCardSkeleton, type BotCardProps } from "@/components/bots/bot-card";

// Motion
export {
  Fade,
  FadeInView,
  Slide,
  SlideInView,
  Scale,
  ScaleInView,
  HoverLift,
  HoverScale,
  HoverGlow,
  FloatingCard,
  FloatingCardSway,
  AnimatedGradient,
  AnimatedParticles,
  ScrollReveal,
  Stagger,
  StaggerItem,
  CountUp,
} from "@/components/motion";
