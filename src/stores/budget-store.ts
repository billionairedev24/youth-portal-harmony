
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
      
      addEntry: (entry) => {
        console.log("Adding budget entry:", entry);
        
        // Validate entry type and category match
        let category = entry.category;
        if (entry.type === "income" && !["donation", "grant"].includes(category)) {
          console.warn("Correcting category for income entry");
          category = "donation";
        } else if (entry.type === "expense" && !["indoor", "outdoor"].includes(category)) {
          console.warn("Correcting category for expense entry");
          category = "indoor";
        }
        
        set((state) => ({
          entries: [...state.entries, { 
            ...entry, 
            category: category as BudgetCategory,
            id: crypto.randomUUID() 
          }]
        }));
      },
      
      updateEntry: (id, updatedEntry) => {
        console.log("Updating budget entry:", id, updatedEntry);
        
        // Validate updated entry type and category match if both are present
        if (updatedEntry.type && updatedEntry.category) {
          const { type, category } = updatedEntry;
          
          if (type === "income" && !["donation", "grant"].includes(category)) {
            console.warn("Correcting category for income entry update");
            updatedEntry.category = "donation";
          } else if (type === "expense" && !["indoor", "outdoor"].includes(category)) {
            console.warn("Correcting category for expense entry update");
            updatedEntry.category = "indoor";
          }
        }
        
        set((state) => ({
          entries: state.entries.map((entry) => 
            entry.id === id ? { ...entry, ...updatedEntry } : entry
          )
        }));
      },
      
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
