import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Pencil, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface BudgetActionsProps<TData> {
  row: Row<TData>;
}

export function BudgetActions<TData>({ row }: BudgetActionsProps<TData>) {
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleView = () => {
    setShowViewDialog(true);
    setIsDropdownOpen(false);
  };

  const handleEdit = () => {
    toast.info("Opening budget entry editor");
    setIsDropdownOpen(false);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
    setIsDropdownOpen(false);
  };

  const handleSendForReview = () => {
    setShowReviewDialog(true);
    setIsDropdownOpen(false);
  };

  const confirmDelete = () => {
    toast.success("Budget entry deleted successfully");
    setShowDeleteDialog(false);
  };

  const confirmReview = () => {
    toast.success("Budget entry sent for review");
    setShowReviewDialog(false);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={handleView}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleEdit}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
            Edit entry
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDelete}
            className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete entry
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleSendForReview}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Send className="h-4 w-4" />
            Send for review
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Budget Entry Details</DialogTitle>
            <DialogDescription>
              View the details of this budget entry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Description</h4>
              <p className="text-sm text-muted-foreground">{row.getValue("description")}</p>
            </div>
            <div>
              <h4 className="font-medium">Amount</h4>
              <p className="text-sm text-muted-foreground">${row.getValue("amount")}</p>
            </div>
            <div>
              <h4 className="font-medium">Date</h4>
              <p className="text-sm text-muted-foreground">{row.getValue("date")}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this budget entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send for Review</DialogTitle>
            <DialogDescription>
              Send this budget entry to the church pastor for review?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReview}>
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}