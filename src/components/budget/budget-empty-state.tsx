
import { Plus, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BudgetEmptyStateProps {
  onCreateBudget: () => void;
}

export function BudgetEmptyState({ onCreateBudget }: BudgetEmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed p-8 bg-gradient-to-br from-muted/50 to-muted/30">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-primary/10 p-6">
          <DollarSign className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">No Budget Entries</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start managing your church finances by creating your first budget entry. 
            Track income from donations and grants, and monitor expenses across different categories.
          </p>
        </div>
        <Button onClick={onCreateBudget} size="lg" className="mt-4">
          <Plus className="mr-2 h-5 w-5" />
          Create First Budget Entry
        </Button>
        <div className="grid grid-cols-2 gap-4 max-w-md w-full mt-6">
          <div className="rounded-md border bg-card p-4 text-center">
            <p className="text-sm font-medium mb-1">Income Types</p>
            <ul className="text-xs text-muted-foreground">
              <li>Donations</li>
              <li>Grants</li>
            </ul>
          </div>
          <div className="rounded-md border bg-card p-4 text-center">
            <p className="text-sm font-medium mb-1">Expense Categories</p>
            <ul className="text-xs text-muted-foreground">
              <li>Ministry</li>
              <li>Utilities</li>
              <li>Maintenance</li>
              <li>And more...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
