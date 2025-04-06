import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Event } from "@/stores/events-store";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface EventDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: Event) => Promise<void>;
  mode: "view" | "edit";
  isLoading: boolean;
}

export function EventDialog({ event, open, onOpenChange, onSave, mode, isLoading }: EventDialogProps) {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when opening/closing or when event changes
  useEffect(() => {
    if (open && event) {
      setEditingEvent({ ...event });
    } else {
      setEditingEvent(null);
    }
  }, [open, event]);

  const handleSave = async () => {
    if (!editingEvent) return;
    
    try {
      setIsSaving(true);
      await onSave(editingEvent);
      // Dialog closing is handled by parent after successful save
    } catch (error) {
      // Error is handled by parent
    } finally {
      setIsSaving(false);
    }
  };

  if (!editingEvent) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!isSaving) {
        onOpenChange(open);
      }
    }}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "view" ? "Event Details" : editingEvent.id ? "Edit Event" : "Create Event"}
          </DialogTitle>
          {mode === "edit" && (
            <DialogDescription>
              {editingEvent.id ? "Make changes to your event here." : "Create a new event."} Click save when you're done.
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
                readOnly={mode === "view"}
                className="bg-secondary/50 border-0 focus-visible:ring-0"
                required
              />
            </div>

            <div>
              <Label htmlFor="objectives">Objectives</Label>
              <Input
                id="objectives"
                value={editingEvent.objectives}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, objectives: e.target.value })
                }
                readOnly={mode === "view"}
                className="bg-secondary/50 border-0 focus-visible:ring-0"
              />
            </div>

            <div>
              <Label htmlFor="personnel">Personnel</Label>
              <Input
                id="personnel"
                value={editingEvent.personnel}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, personnel: e.target.value })
                }
                readOnly={mode === "view"}
                className="bg-secondary/50 border-0 focus-visible:ring-0"
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={editingEvent.location}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, location: e.target.value })
                }
                readOnly={mode === "view"}
                className="bg-secondary/50 border-0 focus-visible:ring-0"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={editingEvent.date}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, date: e.target.value })
                  }
                  readOnly={mode === "view"}
                  className="bg-secondary/50 border-0 focus-visible:ring-0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={editingEvent.time}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, time: e.target.value })
                  }
                  readOnly={mode === "view"}
                  className="bg-secondary/50 border-0 focus-visible:ring-0"
                  required
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {mode === "edit" && (
          <DialogFooter className="mt-6">
            <Button 
              onClick={handleSave} 
              disabled={isSaving || isLoading}
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>Saving...</span>
                </div>
              ) : (
                editingEvent.id ? "Save changes" : "Create event"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}