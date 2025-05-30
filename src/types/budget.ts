
export type BudgetEntryType = "income" | "expense";

export type BudgetCategory = 
  // Income categories
  | "donation" 
  | "grant" 
  // Expense categories
  | "indoor" 
  | "outdoor";

export interface BudgetEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: BudgetEntryType;
  category: BudgetCategory;
  notes?: string;
}

export interface NewBudgetEntry {
  date: string;
  description: string;
  amount: string;
  type: BudgetEntryType;
  category: BudgetCategory;
  notes?: string;
}

export interface BudgetSummaryItem {
  category: string;
  amount: number;
  type: BudgetEntryType;
}
