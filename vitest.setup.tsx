import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// next/image → plain img in unit tests
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} {...props} />;
  },
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Framer Motion: render children without animation overhead
vi.mock("framer-motion", async () => {
  const ReactMod = await import("react");
  const passthrough = (tag: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReactMod.forwardRef(({ children, ...props }: any, ref) => {
      const {
        initial: _i,
        animate: _a,
        exit: _e,
        whileHover: _wh,
        whileInView: _wiv,
        whileTap: _wt,
        transition: _t,
        variants: _v,
        viewport: _vp,
        layout: _l,
        ...rest
      } = props;
      return ReactMod.createElement(tag, { ...rest, ref }, children);
    });

  return {
    motion: {
      div: passthrough("div"),
      span: passthrough("span"),
      button: passthrough("button"),
      a: passthrough("a"),
      section: passthrough("section"),
      li: passthrough("li"),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useReducedMotion: () => true,
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    message: vi.fn(),
  },
  Toaster: () => null,
}));
