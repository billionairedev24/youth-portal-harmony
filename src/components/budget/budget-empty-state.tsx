import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BudgetEmptyStateProps {
  onCreateBudget: () => void;
}

export function BudgetEmptyState({ onCreateBudget }: BudgetEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">No Budget Entries</h2>
        <p className="text-muted-foreground">
          Start managing your finances by creating your first budget entry
        </p>
      </div>
      <Button onClick={onCreateBudget}>
        <Plus className="mr-2 h-4 w-4" />
        Create Budget Entry
      </Button>
    </div>
  );
}