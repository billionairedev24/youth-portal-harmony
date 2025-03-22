
export type BudgetEntryType = "income" | "expense";

export type BudgetCategory = 
  // Income categories
  | "salary" 
  | "donation" 
  | "investment" 
  | "other_income"
  // Expense categories
  | "ministry" 
  | "utilities" 
  | "maintenance" 
  | "supplies" 
  | "events" 
  | "staff" 
  | "missions" 
  | "other_expense";

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
