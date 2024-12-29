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
  comment?: string;
}

interface SuggestionsStore {
  suggestions: Suggestion[];
  addSuggestion: (suggestion: Omit<Suggestion, "id" | "status" | "createdAt" | "comment">) => void;
  updateSuggestionStatus: (id: string, status: SuggestionStatus, comment?: string) => void;
}

export const useSuggestionsStore = create<SuggestionsStore>((set) => ({
  suggestions: [
    {
      id: "1",
      title: "Add Monthly Newsletter",
      description: "I suggest we start a monthly newsletter to keep all members updated about our activities and upcoming events. This would help improve communication and engagement within our community.",
      authorId: "user123",
      authorName: "John Smith",
      createdAt: "2024-03-20T10:00:00.000Z",
      status: "new"
    }
  ],
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
  updateSuggestionStatus: (id, status, comment) =>
    set((state) => ({
      suggestions: state.suggestions.map((suggestion) =>
        suggestion.id === id ? { ...suggestion, status, comment } : suggestion
      ),
    })),
}));