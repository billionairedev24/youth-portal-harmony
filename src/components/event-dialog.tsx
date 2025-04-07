
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Event } from "@/stores/events-store";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Reset form when opening/closing or when event changes
  useEffect(() => {
    if (open && event) {
      setEditingEvent({ ...event });
      if (event.date) {
        const [year, month, day] = event.date.split('-').map(Number);
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          setDate(new Date(year, month - 1, day));
        }
      }
    } else {
      setEditingEvent(null);
      setDate(undefined);
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

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate && editingEvent) {
      setEditingEvent({
        ...editingEvent,
        date: format(newDate, 'yyyy-MM-dd')
      });
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
              <Label htmlFor="eventType">Event Type *</Label>
              <Select
                value={editingEvent.eventType || "REGULAR"}
                onValueChange={(value) =>
                  setEditingEvent({ ...editingEvent, eventType: value })
                }
                disabled={mode === "view"}
              >
                <SelectTrigger id="eventType" className="bg-secondary/50 border-0 focus-visible:ring-0">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGULAR">Regular</SelectItem>
                  <SelectItem value="SPECIAL">Special</SelectItem>
                </SelectContent>
              </Select>
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      disabled={mode === "view"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-secondary/50 border-0",
                        !editingEvent.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                      className="rounded-md border p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="time">Time *</Label>
                <div className="relative">
                  <Input
                    id="time"
                    type="time"
                    value={editingEvent.time}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, time: e.target.value })
                    }
                    readOnly={mode === "view"}
                    className="bg-secondary/50 border-0 focus-visible:ring-0 pl-9"
                    required
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
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
