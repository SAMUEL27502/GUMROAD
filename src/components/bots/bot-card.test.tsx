import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BotCard } from "@/components/bots/bot-card";
import { bots } from "@/lib/data/bots";
import { useFavoritesStore } from "@/stores/favorites-store";

describe("BotCard", () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [] });
    localStorage.clear();
  });

  it("renders bot name, metrics, and detail link", () => {
    const bot = bots[0];
    render(<BotCard bot={bot} />);

    expect(screen.getByText(bot.name)).toBeInTheDocument();
    expect(screen.getByText(bot.category)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view details/i })).toHaveAttribute(
      "href",
      `/bots/${bot.slug}`
    );
  });

  it("calls onSubscribe when provided", async () => {
    const user = userEvent.setup();
    const onSubscribe = vi.fn();
    const bot = bots[0];

    render(<BotCard bot={bot} onSubscribe={onSubscribe} />);
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(onSubscribe).toHaveBeenCalledWith(bot);
  });

  it("toggles wishlist via the favorite button", async () => {
    const user = userEvent.setup();
    const bot = bots[0];

    render(<BotCard bot={bot} />);
    const fav = screen.getByRole("button", { name: /add to wishlist/i });
    await user.click(fav);

    expect(useFavoritesStore.getState().isFavorite(bot.id)).toBe(true);
    expect(screen.getByRole("button", { name: /remove from wishlist/i })).toBeInTheDocument();
  });
});
