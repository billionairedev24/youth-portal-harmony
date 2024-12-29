import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { mockUser } from "@/lib/utils";
import { toast } from "sonner";
import { useSuggestionsStore } from "@/stores/suggestions-store";

interface CreateSuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSuggestionDialog({
  open,
  onOpenChange,
}: CreateSuggestionDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isValid, setIsValid] = useState(false);
  const { addSuggestion } = useSuggestionsStore();

  useEffect(() => {
    setIsValid(title.trim().length > 0 && description.trim().length > 0);
  }, [title, description]);

  const handleSubmit = () => {
    if (!isValid) return;

    addSuggestion({
      title,
      description,
      authorId: mockUser.id,
      authorName: mockUser.name,
    });

    toast.success("Suggestion submitted successfully");
    setTitle("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Suggestion</DialogTitle>
          <DialogDescription>
            Submit a new suggestion for the youth group
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the suggestion title"
              required
            />
            {title.trim().length === 0 && (
              <p className="text-sm text-destructive">Title is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your suggestion in detail"
              className="min-h-[100px]"
              required
            />
            {description.trim().length === 0 && (
              <p className="text-sm text-destructive">Description is required</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Submit Suggestion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}