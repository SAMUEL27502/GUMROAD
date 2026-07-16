import * as React from "react";
import { cn } from "@/lib/utils";

const sizeMap = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "7xl": "max-w-7xl",
  wide: "max-w-[1600px]",
  full: "max-w-none",
} as const;

const padYMap = {
  none: "",
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
  xl: "py-20",
} as const;

export type ContainerSize = keyof typeof sizeMap;
export type ContainerPadY = keyof typeof padYMap;

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "main" | "article" | "header" | "footer";
  size?: ContainerSize;
  /** Vertical padding token — keeps page rhythm consistent */
  padY?: ContainerPadY;
}

/** Shared page/section width + horizontal gutter. */
export function Container({
  as: Comp = "div",
  size = "7xl",
  padY = "none",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Comp
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeMap[size],
        padYMap[padY],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
