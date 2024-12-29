import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash, Send } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleView}>
            <Eye className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>View details</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit entry</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete entry</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleSendForReview}>
            <Send className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Send for review</TooltipContent>
      </Tooltip>
    </div>
  );
}