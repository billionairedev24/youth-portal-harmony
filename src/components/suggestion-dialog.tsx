import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Suggestion } from "@/stores/suggestions-store";
import { format } from "date-fns";

interface SuggestionDialogProps {
  suggestion: Suggestion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (id: string, status: "new" | "processed") => void;
  mode?: "view" | "review";
}

export function SuggestionDialog({
  suggestion,
  open,
  onOpenChange,
  onStatusChange,
  mode = "view",
}: SuggestionDialogProps) {
  if (!suggestion) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Suggestion Details
          </DialogTitle>
          <DialogDescription>
            Created by {suggestion.authorName} on{" "}
            {format(new Date(suggestion.createdAt), "PPP")}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            <div>
              <h3 className="font-medium mb-2">Status</h3>
              <Badge
                variant={suggestion.status === "new" ? "default" : "secondary"}
              >
                {suggestion.status}
              </Badge>
            </div>
            <div>
              <h3 className="font-medium mb-2">Title</h3>
              <p className="text-muted-foreground">{suggestion.title}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {suggestion.description}
              </p>
            </div>
          </div>
        </ScrollArea>

        {mode === "review" && suggestion.status === "new" && (
          <DialogFooter className="mt-6">
            <Button
              onClick={() =>
                onStatusChange?.(suggestion.id, "processed")
              }
            >
              Mark as Processed
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}