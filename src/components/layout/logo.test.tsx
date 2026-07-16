import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/layout/logo";

describe("Logo", () => {
  it("links to the homepage and shows the brand", () => {
    render(<Logo />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveTextContent(/TradeBib/i);
    expect(screen.getByText("TB")).toBeInTheDocument();
  });
});
