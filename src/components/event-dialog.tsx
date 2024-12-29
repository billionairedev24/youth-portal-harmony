import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Event } from "@/stores/events-store";
import { useState, useEffect } from "react";

interface EventDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (event: Partial<Event>) => void;
  mode: "view" | "edit";
}

export function EventDialog({ event, open, onOpenChange, onSave, mode }: EventDialogProps) {
  const [formData, setFormData] = useState<Partial<Event>>({});

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  if (!event) return null;

  const handleSave = () => {
    onSave?.(formData);
    onOpenChange(false);
  };

  const renderField = (label: string, value: string | undefined, fieldName: keyof Event) => {
    return (
      <div className="grid gap-2">
        <label htmlFor={fieldName} className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
        {mode === "edit" ? (
          fieldName === "objectives" ? (
            <Textarea
              id={fieldName}
              value={formData[fieldName] || ""}
              onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
              className="resize-none min-h-[100px] bg-secondary/50 border-0 focus-visible:ring-0"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          ) : (
            <Input
              id={fieldName}
              type={fieldName === "date" ? "date" : fieldName === "time" ? "time" : "text"}
              value={formData[fieldName] || ""}
              onChange={(e) => setFormData({ ...formData, [fieldName]: e.target.value })}
              className="bg-secondary/50 border-0 focus-visible:ring-0"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          )
        ) : (
          <div className="text-sm bg-secondary/50 p-3 rounded-md min-h-[2.5rem] flex items-center">
            {event[fieldName] || "N/A"}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? "Edit Event" : "Event Details"}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-1">
          <div className="grid gap-6 py-4">
            {renderField("Title", event.title, "title")}
            {renderField("Objectives", event.objectives, "objectives")}
            {renderField("Personnel", event.personnel, "personnel")}
            {renderField("Location", event.location, "location")}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField("Date", event.date, "date")}
              {renderField("Time", event.time, "time")}
            </div>
          </div>
        </ScrollArea>

        {mode === "edit" && (
          <DialogFooter className="mt-6">
            <Button onClick={handleSave} className="w-full sm:w-auto">
              Save changes
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}