import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "@/components/ui/empty-state";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(
      <EmptyState
        title="No bots found"
        description="Try adjusting your marketplace filters."
      />
    );

    expect(screen.getByText("No bots found")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your marketplace filters.")).toBeInTheDocument();
  });

  it("fires the action callback", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <EmptyState title="Empty" actionLabel="Browse marketplace" onAction={onAction} />
    );

    await user.click(screen.getByRole("button", { name: "Browse marketplace" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
