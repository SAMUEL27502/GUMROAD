import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";

describe("Container", () => {
  it("applies size and padding tokens", () => {
    const { container } = render(
      <Container size="3xl" padY="md" data-testid="wrap">
        Content
      </Container>
    );
    const el = screen.getByTestId("wrap");
    expect(el.className).toMatch(/max-w-3xl/);
    expect(el.className).toMatch(/py-12/);
    expect(el.className).toMatch(/px-4/);
    expect(container).toHaveTextContent("Content");
  });
});

describe("PageHeader", () => {
  it("renders an h1 title and description", () => {
    render(
      <PageHeader
        badge="Marketplace"
        title="Browse bots"
        description="Filter verified EAs"
        animate={false}
      />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Browse bots" })).toBeInTheDocument();
    expect(screen.getByText("Filter verified EAs")).toBeInTheDocument();
    expect(screen.getByText("Marketplace")).toBeInTheDocument();
  });
});
