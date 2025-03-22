
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { NewBudgetEntry, BudgetCategory } from "@/types/budget";
import { useState } from "react";

const INCOME_CATEGORIES: { value: BudgetCategory; label: string }[] = [
  { value: "salary", label: "Salary" },
  { value: "donation", label: "Donation" },
  { value: "investment", label: "Investment" },
  { value: "other_income", label: "Other Income" },
];

const EXPENSE_CATEGORIES: { value: BudgetCategory; label: string }[] = [
  { value: "ministry", label: "Ministry" },
  { value: "utilities", label: "Utilities" },
  { value: "maintenance", label: "Maintenance" },
  { value: "supplies", label: "Supplies" },
  { value: "events", label: "Events" },
  { value: "staff", label: "Staff" },
  { value: "missions", label: "Missions" },
  { value: "other_expense", label: "Other Expense" },
];

interface BudgetEntryFormProps {
  initialValues?: NewBudgetEntry;
  onSubmit: (entry: NewBudgetEntry) => void;
  onCancel?: () => void;
}

export function BudgetEntryForm({ 
  initialValues, 
  onSubmit,
  onCancel
}: BudgetEntryFormProps) {
  const [entry, setEntry] = useState<NewBudgetEntry>(
    initialValues || {
      date: new Date().toISOString().slice(0, 10),
      description: "",
      amount: "",
      type: "expense",
      category: "other_expense",
      notes: "",
    }
  );
  
  const categories = entry.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(entry);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            required
            value={entry.date}
            onChange={(e) => setEntry({ ...entry, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select 
            value={entry.type} 
            onValueChange={(value) => {
              const newType = value as "income" | "expense";
              // Reset category when changing type
              const newCategory = newType === "income" ? "other_income" : "other_expense";
              setEntry({ ...entry, type: newType, category: newCategory });
            }}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          required
          value={entry.description}
          onChange={(e) => setEntry({ ...entry, description: e.target.value })}
          placeholder="Brief description of the entry"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            required
            value={entry.amount}
            onChange={(e) => setEntry({ ...entry, amount: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={entry.category} 
            onValueChange={(value) => setEntry({ ...entry, category: value as BudgetCategory })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={entry.notes || ""}
          onChange={(e) => setEntry({ ...entry, notes: e.target.value })}
          placeholder="Any additional details"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {initialValues ? "Update Entry" : "Add Entry"}
        </Button>
      </div>
    </form>
  );
}
