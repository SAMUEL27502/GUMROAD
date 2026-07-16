import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (botId: string) => void;
  isFavorite: (botId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (botId) =>
        set((state) => ({
          favorites: state.favorites.includes(botId)
            ? state.favorites.filter((id) => id !== botId)
            : [...state.favorites, botId],
        })),
      isFavorite: (botId) => get().favorites.includes(botId),
    }),
    { name: "tradebib-favorites" }
  )
);
