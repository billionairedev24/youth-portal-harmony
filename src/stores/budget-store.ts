
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BudgetEntry, BudgetEntryType, BudgetCategory } from "@/types/budget";

interface BudgetState {
  entries: BudgetEntry[];
  addEntry: (entry: Omit<BudgetEntry, "id">) => void;
  updateEntry: (id: string, entry: Partial<BudgetEntry>) => void;
  deleteEntry: (id: string) => void;
  getFilteredEntries: (type?: BudgetEntryType) => BudgetEntry[];
  getTotalByType: (type: BudgetEntryType) => number;
  getTotalByCategory: (category: BudgetCategory) => number;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      entries: [],
      
      addEntry: (entry) => set((state) => ({
        entries: [...state.entries, { ...entry, id: crypto.randomUUID() }]
      })),
      
      updateEntry: (id, updatedEntry) => set((state) => ({
        entries: state.entries.map((entry) => 
          entry.id === id ? { ...entry, ...updatedEntry } : entry
        )
      })),
      
      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id)
      })),
      
      getFilteredEntries: (type) => {
        const { entries } = get();
        if (!type) return entries;
        return entries.filter((entry) => entry.type === type);
      },
      
      getTotalByType: (type) => {
        const { entries } = get();
        return entries
          .filter((entry) => entry.type === type)
          .reduce((sum, entry) => sum + entry.amount, 0);
      },
      
      getTotalByCategory: (category) => {
        const { entries } = get();
        return entries
          .filter((entry) => entry.category === category)
          .reduce((sum, entry) => sum + entry.amount, 0);
      },
    }),
    {
      name: "budget-storage",
    }
  )
);
