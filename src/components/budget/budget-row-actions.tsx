
import { BudgetEntry } from "@/types/budget";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BudgetEntryForm } from "./budget-entry-form";
import { useBudgetStore } from "@/stores/budget-store";
import { toast } from "sonner";

interface BudgetRowActionsProps {
  row: Row<BudgetEntry>;
}

export function BudgetRowActions({ row }: BudgetRowActionsProps) {
  const entry = row.original;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { updateEntry, deleteEntry } = useBudgetStore();
  
  const handleDelete = () => {
    deleteEntry(entry.id);
    toast.success("Budget entry deleted successfully");
  };
  
  const handleUpdate = (updatedEntry: any) => {
    // Ensure type and category match
    let category = updatedEntry.category;
    if (updatedEntry.type === "income" && !["donation", "grant"].includes(category)) {
      category = "donation";
    } else if (updatedEntry.type === "expense" && !["indoor", "outdoor"].includes(category)) {
      category = "indoor";
    }
    
    console.log("Updating entry:", {
      ...updatedEntry,
      category,
      amount: parseFloat(updatedEntry.amount)
    });
    
    updateEntry(entry.id, {
      ...updatedEntry,
      category: category,
      amount: parseFloat(updatedEntry.amount),
    });
    
    setIsEditDialogOpen(false);
    toast.success("Budget entry updated successfully");
  };
  
  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget Entry</DialogTitle>
          </DialogHeader>
          <BudgetEntryForm
            initialValues={{
              date: entry.date,
              description: entry.description,
              amount: entry.amount.toString(),
              type: entry.type,
              category: entry.category,
              notes: entry.notes,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setIsEditDialogOpen(true)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
