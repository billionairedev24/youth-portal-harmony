import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Event } from "@/stores/events-store";

interface RecordAttendanceDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (eventId: string, menCount: number, womenCount: number) => void;
}

export function RecordAttendanceDialog({
  event,
  open,
  onOpenChange,
  onSave,
}: RecordAttendanceDialogProps) {
  const [menCount, setMenCount] = useState(0);
  const [womenCount, setWomenCount] = useState(0);

  const handleSave = () => {
    onSave(event.id, menCount, womenCount);
    toast.success("Attendance recorded successfully");
    onOpenChange(false);
    setMenCount(0);
    setWomenCount(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Attendance for {event.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="menCount">Number of Men</Label>
            <Input
              id="menCount"
              type="number"
              min="0"
              value={menCount}
              onChange={(e) => setMenCount(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="womenCount">Number of Women</Label>
            <Input
              id="womenCount"
              type="number"
              min="0"
              value={womenCount}
              onChange={(e) => setWomenCount(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save attendance</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}