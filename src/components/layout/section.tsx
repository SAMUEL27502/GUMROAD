import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Container, type ContainerPadY, type ContainerSize } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  badge?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  size?: ContainerSize;
  padY?: ContainerPadY;
  containerClassName?: string;
}

/** One-job section with optional header + shared container. */
export function Section({
  badge,
  title,
  description,
  align = "center",
  size = "7xl",
  padY = "xl",
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  const centered = align === "center";

  return (
    <section className={cn("relative", className)} {...props}>
      <Container size={size} padY={padY} className={containerClassName}>
        {(badge || title || description) && (
          <div className={cn("mb-10 sm:mb-12", centered && "mx-auto max-w-2xl text-center")}>
            {badge ? (
              <Badge variant="secondary" className="mb-4">
                {badge}
              </Badge>
            ) : null}
            {title ? <h2 className="tb-h2 text-balance">{title}</h2> : null}
            {description ? (
              <p
                className={cn(
                  "text-muted-foreground mt-3 text-base leading-relaxed",
                  centered && "mx-auto max-w-xl"
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
