import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders label text", () => {
    render(<Badge>Verified</Badge>);
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("supports risk variants", () => {
    const { rerender } = render(<Badge variant="low">LOW Risk</Badge>);
    expect(screen.getByText("LOW Risk").className).toMatch(/emerald/i);

    rerender(<Badge variant="high">HIGH Risk</Badge>);
    expect(screen.getByText("HIGH Risk").className).toMatch(/red/i);
  });
});
