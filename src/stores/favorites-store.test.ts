import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFavoritesStore } from "@/stores/favorites-store";

describe("useFavoritesStore", () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [] });
    localStorage.clear();
  });

  it("toggles favorites on and off", () => {
    const { result } = renderHook(() => useFavoritesStore());

    expect(result.current.isFavorite("1")).toBe(false);

    act(() => {
      result.current.toggleFavorite("1");
    });
    expect(result.current.isFavorite("1")).toBe(true);
    expect(result.current.favorites).toEqual(["1"]);

    act(() => {
      result.current.toggleFavorite("1");
    });
    expect(result.current.isFavorite("1")).toBe(false);
  });
});
