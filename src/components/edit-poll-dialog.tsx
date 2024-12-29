import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Poll } from "@/stores/polls-store";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface EditPollDialogProps {
  poll: Poll | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (poll: Poll) => void;
}

export function EditPollDialog({ poll, open, onOpenChange, onSave }: EditPollDialogProps) {
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (poll) {
      setEditingPoll({
        ...poll,
        options: [...poll.options]
      });
    }
  }, [poll]);

  if (!editingPoll) return null;

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editingPoll.options];
    newOptions[index] = value;
    setEditingPoll({
      ...editingPoll,
      options: newOptions
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(editingPoll);
      toast.success("Poll updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update poll");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Poll</DialogTitle>
          <DialogDescription>
            Make changes to your poll here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editingPoll.title}
                onChange={(e) =>
                  setEditingPoll({ ...editingPoll, title: e.target.value })
                }
                className="bg-secondary/50 border-0 focus-visible:ring-0"
              />
            </div>
            
            <div>
              <Label>Options</Label>
              <div className="space-y-2">
                {editingPoll.options.map((option: string, index: number) => (
                  <div key={index}>
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="bg-secondary/50 border-0 focus-visible:ring-0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editingPoll.startDate}
                  onChange={(e) =>
                    setEditingPoll({
                      ...editingPoll,
                      startDate: e.target.value,
                    })
                  }
                  className="bg-secondary/50 border-0 focus-visible:ring-0"
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={editingPoll.endDate}
                  onChange={(e) =>
                    setEditingPoll({ ...editingPoll, endDate: e.target.value })
                  }
                  className="bg-secondary/50 border-0 focus-visible:ring-0"
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}