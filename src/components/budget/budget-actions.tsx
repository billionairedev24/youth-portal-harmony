import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface BudgetActionsProps<TData> {
  row: Row<TData>;
}

export function BudgetActions<TData>({ row }: BudgetActionsProps<TData>) {
  const handleView = () => {
    toast.info("Viewing budget entry details");
  };

  const handleEdit = () => {
    toast.info("Editing budget entry");
  };

  const handleDelete = () => {
    toast.info("Deleting budget entry");
  };

  const handleSendForReview = () => {
    toast.success("Budget entry sent for review");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          View details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          Edit entry
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          Delete entry
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendForReview}>
          Send for review
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}