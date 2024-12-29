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
import { Event } from "@/stores/events-store";
import { useState } from "react";

interface EventDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (event: Partial<Event>) => void;
  mode: "view" | "edit";
}

export function EventDialog({ event, open, onOpenChange, onSave, mode }: EventDialogProps) {
  const [formData, setFormData] = useState<Partial<Event>>(event || {});

  if (!event) return null;

  const handleSave = () => {
    onSave?.(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Event" : "Event Details"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">Title</label>
            {mode === "edit" ? (
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            ) : (
              <p className="text-sm">{event.title}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="objectives">Objectives</label>
            {mode === "edit" ? (
              <Textarea
                id="objectives"
                value={formData.objectives || ""}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              />
            ) : (
              <p className="text-sm">{event.objectives}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="personnel">Personnel</label>
            {mode === "edit" ? (
              <Input
                id="personnel"
                value={formData.personnel || ""}
                onChange={(e) => setFormData({ ...formData, personnel: e.target.value })}
              />
            ) : (
              <p className="text-sm">{event.personnel}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="location">Location</label>
            {mode === "edit" ? (
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            ) : (
              <p className="text-sm">{event.location}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="date">Date</label>
              {mode === "edit" ? (
                <Input
                  id="date"
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              ) : (
                <p className="text-sm">{event.date}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="time">Time</label>
              {mode === "edit" ? (
                <Input
                  id="time"
                  type="time"
                  value={formData.time || ""}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              ) : (
                <p className="text-sm">{event.time}</p>
              )}
            </div>
          </div>
        </div>
        {mode === "edit" && (
          <DialogFooter>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}