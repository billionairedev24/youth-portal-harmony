import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventsStore } from "@/stores/events-store";

interface PhotoUploadDialogProps {
  onUpload: (files: FileList, eventId: string) => void;
  isUploading: boolean;
  selectedEventId: string;
  onEventChange: (eventId: string) => void;
}

export const PhotoUploadDialog = ({
  onUpload,
  isUploading,
  selectedEventId,
  onEventChange,
}: PhotoUploadDialogProps) => {
  const events = useEventsStore((state) => 
    state.events.filter(event => !event.archived)
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedEventId) {
      toast.error("Please select files and an event");
      return;
    }
    onUpload(files, selectedEventId);
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-4 items-center">
      <Select 
        value={selectedEventId} 
        onValueChange={onEventChange}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select Event" />
        </SelectTrigger>
        <SelectContent>
          {events.map((event) => (
            <SelectItem key={event.id} value={event.id}>
              {event.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label
        htmlFor="photo-upload"
        className={`cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${
          isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload Photos
      </Label>
      <Input
        id="photo-upload"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading || !selectedEventId}
      />
    </div>
  );
};