import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultRecommendationInput,
  type RecommendationInput,
} from "@/lib/recommendations/bot-recommender";

interface RecommendationState {
  preferences: RecommendationInput;
  completed: boolean;
  setPreferences: (partial: Partial<RecommendationInput>) => void;
  replacePreferences: (input: RecommendationInput) => void;
  markCompleted: () => void;
  reset: () => void;
}

export const useRecommendationStore = create<RecommendationState>()(
  persist(
    (set) => ({
      preferences: defaultRecommendationInput(),
      completed: false,
      setPreferences: (partial) =>
        set((state) => ({
          preferences: { ...state.preferences, ...partial },
        })),
      replacePreferences: (input) => set({ preferences: input, completed: true }),
      markCompleted: () => set({ completed: true }),
      reset: () => set({ preferences: defaultRecommendationInput(), completed: false }),
    }),
    { name: "tradebib-recommendations" }
  )
);
