import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BudgetEntryFormProps {
  newEntry: {
    date: string;
    description: string;
    amount: string;
    type: string;
  };
  setNewEntry: (entry: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BudgetEntryForm({ newEntry, setNewEntry, onSubmit }: BudgetEntryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          required
          value={newEntry.date}
          onChange={(e) =>
            setNewEntry({ ...newEntry, date: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          required
          value={newEntry.description}
          onChange={(e) =>
            setNewEntry({ ...newEntry, description: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          required
          value={newEntry.amount}
          onChange={(e) =>
            setNewEntry({ ...newEntry, amount: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={newEntry.type}
          onChange={(e) =>
            setNewEntry({ ...newEntry, type: e.target.value })
          }
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <Button type="submit" className="w-full">
        Add Entry
      </Button>
    </form>
  );
}