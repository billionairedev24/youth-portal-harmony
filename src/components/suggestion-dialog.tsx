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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface SuggestionDialogProps {
  suggestion: Suggestion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (id: string, status: "new" | "processed", comment?: string) => void;
  mode?: "view" | "review";
}

export function SuggestionDialog({
  suggestion,
  open,
  onOpenChange,
  onStatusChange,
  mode = "view",
}: SuggestionDialogProps) {
  const [comment, setComment] = useState("");

  if (!suggestion) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
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
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  suggestion.status === "new"
                    ? "bg-gold-100 text-gold-800 border border-gold-300"
                    : "bg-gold-50 text-gold-600 border border-gold-200"
                }`}
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
            {suggestion.comment && (
              <div>
                <h3 className="font-medium mb-2">Resolution Comment</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {suggestion.comment}
                </p>
              </div>
            )}
            {mode === "review" && suggestion.status === "new" && (
              <div>
                <h3 className="font-medium mb-2">Add Resolution Comment</h3>
                <Textarea
                  placeholder="Add a comment about how this suggestion was handled..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px] resize-none bg-gold-50/50 border-gold-200 focus:border-gold-300 focus:ring-gold-200/50 focus:ring-offset-0 placeholder:text-gold-500/70"
                />
              </div>
            )}
          </div>
        </ScrollArea>

        {mode === "review" && suggestion.status === "new" && (
          <DialogFooter className="mt-6">
            <Button
              onClick={() => {
                onStatusChange?.(suggestion.id, "processed", comment);
                setComment("");
              }}
              disabled={!comment.trim()}
            >
              Mark as Processed
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}