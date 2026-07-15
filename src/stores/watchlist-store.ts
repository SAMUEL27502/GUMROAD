import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchlistState {
  symbols: string[];
  toggleSymbol: (symbol: string) => void;
  hasSymbol: (symbol: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      symbols: ["EURUSD", "XAUUSD", "BTCUSD"],
      toggleSymbol: (symbol) =>
        set((state) => ({
          symbols: state.symbols.includes(symbol)
            ? state.symbols.filter((s) => s !== symbol)
            : [...state.symbols, symbol],
        })),
      hasSymbol: (symbol) => get().symbols.includes(symbol),
    }),
    { name: "tradebib-watchlist" }
  )
);
