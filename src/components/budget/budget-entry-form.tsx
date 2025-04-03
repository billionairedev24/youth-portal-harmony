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
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { PopoverCalendar } from "@/components/budget/popover-calendar";

const INCOME_CATEGORIES: { value: BudgetCategory; label: string }[] = [
  { value: "donation", label: "Donation" },
  { value: "grant", label: "Grant" },
];

const EXPENSE_CATEGORIES: { value: BudgetCategory; label: string }[] = [
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
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
      type: "expense", // Fixed typo from "expense" to "expense"
      category: "indoor",
      notes: "",
    }
  );
  
  // Ensure category matches type
  useEffect(() => {
    if (entry.type === "income" && !INCOME_CATEGORIES.some(c => c.value === entry.category)) {
      setEntry(prev => ({ ...prev, category: "donation" }));
    } else if (entry.type === "expense" && !EXPENSE_CATEGORIES.some(c => c.value === entry.category)) {
      setEntry(prev => ({ ...prev, category: "indoor" }));
    }
  }, [entry.type, entry.category]);

  const categories = entry.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate amount is a positive number
    const amount = parseFloat(entry.amount);
    if (isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }
    
    onSubmit({
      ...entry,
      amount: amount.toString() // Ensure amount is string as per NewBudgetEntry type
    });
  };

  const onDateSelect = (date: Date) => {
    setEntry(prev => ({ ...prev, date: date.toISOString().slice(0, 10) }));
  };

  const handleTypeChange = (value: string) => {
    const newType = value as "income" | "expense";
    const defaultCategory = newType === "income" ? "donation" : "indoor";
    
    setEntry(prev => ({
      ...prev,
      type: newType,
      category: defaultCategory
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type" className="text-sm font-medium">Type</Label>
          <Select 
            value={entry.type} 
            onValueChange={handleTypeChange}
          >
            <SelectTrigger id="type" className="w-full mt-1.5">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income" className="text-green-600">Income</SelectItem>
              <SelectItem value="expense" className="text-red-600">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="date" className="text-sm font-medium">Date</Label>
          <div className="relative mt-1.5">
            <PopoverCalendar date={new Date(entry.date)} onSelect={onDateSelect}>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(entry.date).toLocaleDateString()}
              </Button>
            </PopoverCalendar>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
        <Input
          id="description"
          required
          className="mt-1.5"
          value={entry.description}
          onChange={(e) => setEntry(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the entry"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount" className="text-sm font-medium">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            required
            className="mt-1.5"
            value={entry.amount}
            onChange={(e) => setEntry(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="category" className="text-sm font-medium">Category</Label>
          <Select 
            value={entry.category} 
            onValueChange={(value) => setEntry(prev => ({ ...prev, category: value as BudgetCategory }))}
          >
            <SelectTrigger id="category" className="w-full mt-1.5">
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

      <div>
        <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
        <Textarea
          id="notes"
          className="mt-1.5"
          value={entry.notes || ""}
          onChange={(e) => setEntry(prev => ({ ...prev, notes: e.target.value }))}
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
        <Button 
          type="submit" 
          className={entry.type === "income" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
        >
          {initialValues ? "Update Entry" : "Add Entry"}
        </Button>
      </div>
    </form>
  );
}