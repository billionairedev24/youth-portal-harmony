
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus, FileBarChart } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { BudgetEmptyState } from "@/components/budget/budget-empty-state";
import { BudgetSummary } from "@/components/budget/budget-summary";
import { BudgetEntryForm } from "@/components/budget/budget-entry-form";
import { BudgetRowActions } from "@/components/budget/budget-row-actions";
import { useBudgetStore } from "@/stores/budget-store";
import { BudgetEntry, BudgetCategory, NewBudgetEntry } from "@/types/budget";

// Map category values to display names
const categoryDisplayNames: Record<BudgetCategory, string> = {
  salary: "Salary",
  donation: "Donation",
  investment: "Investment",
  other_income: "Other Income",
  ministry: "Ministry",
  utilities: "Utilities",
  maintenance: "Maintenance",
  supplies: "Supplies",
  events: "Events",
  staff: "Staff",
  missions: "Missions",
  other_expense: "Other Expense",
};

const BudgetPage = () => {
  const { entries, addEntry, getTotalByType, getTotalByCategory } = useBudgetStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Define table columns
  const columns: ColumnDef<BudgetEntry>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as BudgetCategory;
        return categoryDisplayNames[category] || category;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return type.charAt(0).toUpperCase() + type.slice(1);
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        const type = row.getValue("type") as string;
        return (
          <span className={type === "income" ? "text-green-600" : "text-red-600"}>
            ${amount.toFixed(2)}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <BudgetRowActions row={row} />,
    },
  ];

  const totalIncome = getTotalByType("income");
  const totalExpenses = getTotalByType("expense");

  // Calculate category breakdown for display in the summary
  const categoryBreakdown = useMemo(() => {
    const allCategories = [
      ...Object.entries(categoryDisplayNames)
        .filter(([key]) => 
          key.includes("income") || ["salary", "donation", "investment"].includes(key))
        .map(([key, value]) => ({ 
          category: key as BudgetCategory, 
          displayName: value, 
          type: "income" as const 
        })),
      ...Object.entries(categoryDisplayNames)
        .filter(([key]) => 
          key.includes("expense") || 
          ["ministry", "utilities", "maintenance", "supplies", "events", "staff", "missions"].includes(key))
        .map(([key, value]) => ({ 
          category: key as BudgetCategory, 
          displayName: value, 
          type: "expense" as const 
        })),
    ];
    
    return allCategories
      .map(({ category, displayName, type }) => ({
        category: displayName,
        amount: getTotalByCategory(category),
        type
      }))
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [entries, getTotalByCategory]);

  const handleSubmit = (newEntry: NewBudgetEntry) => {
    if (!newEntry.date || !newEntry.description || !newEntry.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    addEntry({
      date: newEntry.date,
      description: newEntry.description,
      amount: parseFloat(newEntry.amount),
      type: newEntry.type,
      category: newEntry.category,
      notes: newEntry.notes
    });
    
    setIsDialogOpen(false);
    toast.success("Budget entry added successfully");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Budget Management</h1>
          {entries.length > 0 && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Budget Entry</DialogTitle>
                </DialogHeader>
                <BudgetEntryForm onSubmit={handleSubmit} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {entries.length === 0 ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Budget Entry</DialogTitle>
              </DialogHeader>
              <BudgetEntryForm onSubmit={handleSubmit} />
            </DialogContent>
            <BudgetEmptyState onCreateBudget={() => setIsDialogOpen(true)} />
          </Dialog>
        ) : (
          <>
            <BudgetSummary 
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              categoryBreakdown={categoryBreakdown}
            />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Budget Entries</CardTitle>
                <FileBarChart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={entries} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default BudgetPage;
