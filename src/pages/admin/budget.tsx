
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus, FileBarChart, Filter, SlidersHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BudgetEmptyState } from "@/components/budget/budget-empty-state";
import { BudgetSummary } from "@/components/budget/budget-summary";
import { BudgetEntryForm } from "@/components/budget/budget-entry-form";
import { BudgetRowActions } from "@/components/budget/budget-row-actions";
import { BudgetChart } from "@/components/budget/budget-chart";
import { useBudgetStore } from "@/stores/budget-store";
import { BudgetEntry, BudgetCategory, NewBudgetEntry } from "@/types/budget";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Map category values to display names
const categoryDisplayNames: Record<BudgetCategory, string> = {
  donation: "Donation",
  grant: "Grant",
  ministry: "Ministry",
  utilities: "Utilities",
  maintenance: "Maintenance",
  supplies: "Supplies",
  events: "Events",
  missions: "Missions",
  other_expense: "Other Expense",
};

const BudgetPage = () => {
  const { entries, addEntry, getTotalByType, getTotalByCategory } = useBudgetStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(["date", "description", "category", "type", "amount", "actions"]);

  // Filter entries based on active tab
  const filteredEntries = useMemo(() => {
    if (activeTab === "all") return entries;
    return entries.filter(entry => entry.type === activeTab);
  }, [entries, activeTab]);

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
        return (
          <span className={type === "income" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        const type = row.getValue("type") as string;
        return (
          <span className={`font-medium ${type === "income" ? "text-green-600" : "text-red-600"}`}>
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

  // Filter columns based on visibleColumns state
  const filteredColumns = columns.filter(column => {
    const id = column.id || column.accessorKey as string;
    return visibleColumns.includes(id);
  });

  const totalIncome = getTotalByType("income");
  const totalExpenses = getTotalByType("expense");

  // Calculate category breakdown for display in the summary
  const categoryBreakdown = useMemo(() => {
    const incomeCategories = ["donation", "grant"];
    const expenseCategories = ["ministry", "utilities", "maintenance", "supplies", "events", "missions", "other_expense"];
    
    const allCategories = [
      ...incomeCategories.map(category => ({ 
        category: category as BudgetCategory, 
        displayName: categoryDisplayNames[category as BudgetCategory], 
        type: "income" as const 
      })),
      ...expenseCategories.map(category => ({ 
        category: category as BudgetCategory, 
        displayName: categoryDisplayNames[category as BudgetCategory], 
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
    toast.success(`${newEntry.type === "income" ? "Income" : "Expense"} entry added successfully`);
  };

  const toggleColumn = (columnId: string) => {
    setVisibleColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Budget Management</h1>
            <p className="text-muted-foreground mt-1">Track your church income and expenses</p>
          </div>
          {entries.length > 0 && (
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {columns.map(column => {
                    const id = column.id || column.accessorKey as string;
                    const label = column.header as string || id;
                    
                    return (
                      <DropdownMenuItem 
                        key={id}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleColumn(id)}
                      >
                        <input 
                          type="checkbox" 
                          checked={visibleColumns.includes(id)}
                          readOnly
                          className="mr-1"
                        />
                        {label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              
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
                    <DialogDescription>
                      Add a new budget entry for income or expenses
                    </DialogDescription>
                  </DialogHeader>
                  <BudgetEntryForm onSubmit={handleSubmit} />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {entries.length === 0 ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Budget Entry</DialogTitle>
                <DialogDescription>
                  Add a new budget entry for income or expenses
                </DialogDescription>
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
            
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileBarChart className="h-5 w-5 mr-2 text-gold-600" />
                  Budget Visualization
                </CardTitle>
                <CardDescription>
                  Visual breakdown of your financial data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gold-600" />
                  Budget Entries
                </CardTitle>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-2">
                  <TabsList>
                    <TabsTrigger value="all">All Entries</TabsTrigger>
                    <TabsTrigger value="income" className="text-green-600">Income</TabsTrigger>
                    <TabsTrigger value="expense" className="text-red-600">Expenses</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={filteredColumns} 
                  data={filteredEntries}
                  searchColumn="description"
                  searchPlaceholder="Search by description..."
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default BudgetPage;
