import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { BudgetEmptyState } from "@/components/budget/budget-empty-state";
import { BudgetSummary } from "@/components/budget/budget-summary";
import { BudgetActions } from "@/components/budget/budget-actions";
import { BudgetEntryForm } from "@/components/budget/budget-entry-form";

type BudgetEntry = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
};

const columns: ColumnDef<BudgetEntry>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "type",
    header: "Type",
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
    cell: ({ row }) => <BudgetActions row={row} />,
  },
];

const BudgetPage = () => {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: "",
    description: "",
    amount: "",
    type: "expense",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.date || !newEntry.description || !newEntry.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    const entry: BudgetEntry = {
      id: Date.now().toString(),
      date: newEntry.date,
      description: newEntry.description,
      amount: parseFloat(newEntry.amount),
      type: newEntry.type as "income" | "expense",
    };

    setEntries([...entries, entry]);
    setIsDialogOpen(false);
    toast.success("Budget entry added successfully");
    setNewEntry({
      date: "",
      description: "",
      amount: "",
      type: "expense",
    });
  };

  const totalIncome = entries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpenses = entries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);

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
                <BudgetEntryForm
                  newEntry={newEntry}
                  setNewEntry={setNewEntry}
                  onSubmit={handleSubmit}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {entries.length === 0 ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Budget Entry</DialogTitle>
              </DialogHeader>
              <BudgetEntryForm
                newEntry={newEntry}
                setNewEntry={setNewEntry}
                onSubmit={handleSubmit}
              />
            </DialogContent>
            <BudgetEmptyState onCreateBudget={() => setIsDialogOpen(true)} />
          </Dialog>
        ) : (
          <>
            <BudgetSummary 
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />
            <Card>
              <CardHeader>
                <CardTitle>Budget Entries</CardTitle>
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