
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
        
        // Preserve the entry type, only validate category
        const entryType = entry.type;
        let category = entry.category;
        
        if (entryType === "income" && !["donation", "grant"].includes(category)) {
          console.warn("Correcting category for income entry");
          category = "donation";
        } else if (entryType === "expense" && !["indoor", "outdoor"].includes(category)) {
          console.warn("Correcting category for expense entry");
          category = "indoor";
        }
        
        set((state) => ({
          entries: [...state.entries, { 
            ...entry, 
            type: entryType, // Ensure type is preserved
            category: category as BudgetCategory,
            id: crypto.randomUUID() 
          }]
        }));
      },
      
      updateEntry: (id, updatedEntry) => {
        console.log("Updating budget entry:", id, updatedEntry);
        
        set((state) => {
          const entries = state.entries.map((entry) => {
            if (entry.id !== id) return entry;
            
            // For the matching entry, preserve type if not being explicitly changed
            const updatedType = updatedEntry.type !== undefined ? updatedEntry.type : entry.type;
            let updatedCategory = updatedEntry.category !== undefined ? updatedEntry.category : entry.category;
            
            // Only validate category if both type and category are present or type is changing
            if (updatedType === "income" && !["donation", "grant"].includes(updatedCategory)) {
              console.warn("Correcting category for income entry update");
              updatedCategory = "donation";
            } else if (updatedType === "expense" && !["indoor", "outdoor"].includes(updatedCategory)) {
              console.warn("Correcting category for expense entry update");
              updatedCategory = "indoor";
            }
            
            return { 
              ...entry, 
              ...updatedEntry,
              type: updatedType,
              category: updatedCategory
            };
          });
          
          return { entries };
        });
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
