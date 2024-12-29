import { ImagePlus } from "lucide-react";
import { PhotoUploadDialog } from "./photo-upload-dialog";
import { Event } from "@/stores/events-store";

interface EmptyStateProps {
  searchTerm: string;
  onUpload: (files: FileList, eventId: string) => void;
  isUploading: boolean;
  selectedEventId: string;
  onEventChange: (eventId: string) => void;
  events: Event[];
}

export const EmptyState = ({
  searchTerm,
  onUpload,
  isUploading,
  selectedEventId,
  onEventChange,
  events,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
      <ImagePlus className="h-16 w-16 text-muted-foreground" />
      <p className="text-lg text-muted-foreground">
        {searchTerm 
          ? `No photos found for "${searchTerm}"`
          : "No photos have been uploaded yet"}
      </p>
      <PhotoUploadDialog
        onUpload={onUpload}
        isUploading={isUploading}
        selectedEventId={selectedEventId}
        onEventChange={onEventChange}
        events={events}
      />
    </div>
  );
};