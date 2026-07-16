# TradeBib Animations (Framer Motion)

Import from `@/components/motion` or `@/components/design-system`.

Live demos: **`/animations`** · homepage `/`

## Checklist

| Animation          | Component                                | Status |
| ------------------ | ---------------------------------------- | ------ |
| Fade               | `Fade`, `FadeInView`                     | ✅     |
| Slide              | `Slide`, `SlideInView`                   | ✅     |
| Scale              | `Scale`, `ScaleInView`                   | ✅     |
| Hover              | `HoverLift`, `HoverScale`, `HoverGlow`   | ✅     |
| Count-up numbers   | `CountUp`                                | ✅     |
| Floating cards     | `FloatingCard`, `FloatingCardSway`       | ✅     |
| Animated gradients | `AnimatedGradient`, `AnimatedParticles`  | ✅     |
| Scroll animations  | `ScrollReveal`, `Stagger`, `StaggerItem` | ✅     |

## Usage

```tsx
import { Slide, HoverLift, CountUp, AnimatedGradient } from "@/components/motion";

<AnimatedGradient variant="hero" />
<Slide direction="up">…</Slide>
<HoverLift><Card>…</Card></HoverLift>
<CountUp value={12400} display="12,400+" suffix="+" />
```
