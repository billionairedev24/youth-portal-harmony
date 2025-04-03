import { create } from "zustand";
import { api, ApiError } from "@/utils/axiosConfig";

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
  processedAt?: string;
}

interface SuggestionsStore {
  suggestions: Suggestion[];
  isLoading: boolean;
  error: string | null;
  fetchSuggestions: () => Promise<void>;
  addSuggestion: (suggestion: Omit<Suggestion, "id" | "status" | "createdAt" | "comment" | "processedAt">) => Promise<void>;
  updateSuggestionStatus: (id: string, status: SuggestionStatus, comment?: string) => Promise<void>;
  getSuggestionById: (id: string) => Suggestion | undefined;
  getSuggestionsByStatus: (status: SuggestionStatus) => Suggestion[];
  getSuggestionsByAuthor: (authorId: string) => Suggestion[];
}

export const useSuggestionsStore = create<SuggestionsStore>((set, get) => ({
  suggestions: [],
  isLoading: false,
  error: null,

  fetchSuggestions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<Suggestion[]>("/suggestions");
      set({ suggestions: data, isLoading: false });
    } catch (error) {
      handleApiError(error as ApiError, "Failed to fetch suggestions", set);
    }
  },

  addSuggestion: async (suggestion) => {
    set({ isLoading: true, error: null });
    try {
      const newSuggestion = {
        ...suggestion,
        status: "new" as const,
        createdAt: new Date().toISOString()
      };
      const { data } = await api.post<Suggestion>("/suggestions", newSuggestion);
      set(state => ({
        suggestions: [...state.suggestions, data],
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to submit suggestion", set);
    }
  },

  updateSuggestionStatus: async (id, status, comment) => {
    set({ isLoading: true, error: null });
    try {
      const updateData = {
        status,
        comment,
        ...(status === "processed" && { processedAt: new Date().toISOString() })
      };
      
      const { data } = await api.patch<Suggestion>(`/suggestions/${id}`, updateData);
      
      set(state => ({
        suggestions: state.suggestions.map(suggestion =>
          suggestion.id === id ? data : suggestion
        ),
        isLoading: false
      }));
    } catch (error) {
      handleApiError(error as ApiError, "Failed to update suggestion status", set);
    }
  },

  getSuggestionById: (id) => {
    return get().suggestions.find(suggestion => suggestion.id === id);
  },

  getSuggestionsByStatus: (status) => {
    return get().suggestions.filter(suggestion => suggestion.status === status);
  },

  getSuggestionsByAuthor: (authorId) => {
    return get().suggestions.filter(suggestion => suggestion.authorId === authorId);
  }
}));

function handleApiError(
  error: ApiError,
  defaultMessage: string,
  set: (state: Partial<SuggestionsStore>) => void
) {
  const errorMessage = error.response?.data?.message 
    || error.message 
    || defaultMessage;

  set({ 
    error: errorMessage,
    isLoading: false 
  });
  
  console.error(`${defaultMessage}:`, error);
}

// Initialize store
useSuggestionsStore.getState().fetchSuggestions();