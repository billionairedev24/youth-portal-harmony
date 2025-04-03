import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BudgetEntry, BudgetEntryType, BudgetCategory } from "@/types/budget";
import { api, ApiError } from "@/utils/axiosConfig";

interface BudgetState {
  entries: BudgetEntry[];
  isLoading: boolean;
  error: string | null;
  addEntry: (entry: Omit<BudgetEntry, "id">) => Promise<void>;
  updateEntry: (id: string, entry: Partial<BudgetEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  fetchEntries: () => Promise<void>;
  getFilteredEntries: (type?: BudgetEntryType) => BudgetEntry[];
  getTotalByType: (type: BudgetEntryType) => number;
  getTotalByCategory: (category: BudgetCategory) => number;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      entries: [],
      isLoading: false,
      error: null,

      fetchEntries: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.get<BudgetEntry[]>("/budget");
          set({ entries: data, isLoading: false });
        } catch (error) {
          handleApiError(error as ApiError, "Failed to fetch budget entries", set);
        }
      },

      addEntry: async (entry) => {
        set({ isLoading: true, error: null });
        try {
          const validatedEntry = validateBudgetEntry(entry);
          const { data } = await api.post<BudgetEntry>("/budget", validatedEntry);
          set(state => ({
            entries: [...state.entries, data],
            isLoading: false
          }));
        } catch (error) {
          handleApiError(error as ApiError, "Failed to add budget entry", set);
        }
      },

      updateEntry: async (id, updatedEntry) => {
        set({ isLoading: true, error: null });
        try {
          const currentEntry = get().entries.find(e => e.id === id);
          if (!currentEntry) throw new Error("Entry not found");

          const validatedUpdate = validateBudgetEntryUpdate(currentEntry, updatedEntry);
          const { data } = await api.patch<BudgetEntry>(`/budget/${id}`, validatedUpdate);
          
          set(state => ({
            entries: state.entries.map(entry => 
              entry.id === id ? data : entry
            ),
            isLoading: false
          }));
        } catch (error) {
          handleApiError(error as ApiError, "Failed to update budget entry", set);
        }
      },

      deleteEntry: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/budget/${id}`);
          set(state => ({
            entries: state.entries.filter(entry => entry.id !== id),
            isLoading: false
          }));
        } catch (error) {
          handleApiError(error as ApiError, "Failed to delete budget entry", set);
        }
      },

      getFilteredEntries: (type) => {
        const { entries } = get();
        return type ? entries.filter(entry => entry.type === type) : entries;
      },

      getTotalByType: (type) => {
        return get()
          .entries
          .filter(entry => entry.type === type)
          .reduce((sum, entry) => sum + entry.amount, 0);
      },

      getTotalByCategory: (category) => {
        return get()
          .entries
          .filter(entry => entry.category === category)
          .reduce((sum, entry) => sum + entry.amount, 0);
      },
    }),
    {
      name: "budget-storage",
      partialize: (state) => ({ entries: state.entries }), // Only persist entries
    }
  )
);

// Helper functions
function validateBudgetEntry(entry: Omit<BudgetEntry, "id">): Omit<BudgetEntry, "id"> {
  let { type, category } = entry;
  
  if (type === "income" && !["donation", "grant"].includes(category)) {
    category = "donation";
  } else if (type === "expense" && !["indoor", "outdoor"].includes(category)) {
    category = "indoor";
  }

  return {
    ...entry,
    type,
    category: category as BudgetCategory
  };
}

function validateBudgetEntryUpdate(
  currentEntry: BudgetEntry,
  update: Partial<BudgetEntry>
): Partial<BudgetEntry> {
  const type = update.type ?? currentEntry.type;
  let category = update.category ?? currentEntry.category;

  if (type === "income" && !["donation", "grant"].includes(category)) {
    category = "donation";
  } else if (type === "expense" && !["indoor", "outdoor"].includes(category)) {
    category = "indoor";
  }

  return {
    ...update,
    type,
    category: category as BudgetCategory
  };
}

function handleApiError(
  error: ApiError,
  defaultMessage: string,
  set: (state: Partial<BudgetState>) => void
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
useBudgetStore.getState().fetchEntries();