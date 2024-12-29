import { create } from "zustand";

export type SuggestionStatus = "new" | "processed";

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  status: SuggestionStatus;
}

interface SuggestionsStore {
  suggestions: Suggestion[];
  addSuggestion: (suggestion: Omit<Suggestion, "id" | "status" | "createdAt">) => void;
  updateSuggestionStatus: (id: string, status: SuggestionStatus) => void;
}

export const useSuggestionsStore = create<SuggestionsStore>((set) => ({
  suggestions: [],
  addSuggestion: (suggestion) => 
    set((state) => ({
      suggestions: [
        ...state.suggestions,
        {
          ...suggestion,
          id: crypto.randomUUID(),
          status: "new",
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  updateSuggestionStatus: (id, status) =>
    set((state) => ({
      suggestions: state.suggestions.map((suggestion) =>
        suggestion.id === id ? { ...suggestion, status } : suggestion
      ),
    })),
}));