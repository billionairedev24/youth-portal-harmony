import { ImagePlus } from "lucide-react";
import { PhotoUploadDialog } from "./photo-upload-dialog";

interface PhotosEmptyStateProps {
  onUpload: (files: FileList, eventId: string) => void;
  isUploading: boolean;
  selectedEventId: string;
  onEventChange: (eventId: string) => void;
  events: any[];
}

export const PhotosEmptyState = ({
  onUpload,
  isUploading,
  selectedEventId,
  onEventChange,
  events,
}: PhotosEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <ImagePlus className="h-16 w-16 text-muted-foreground" />
      <p className="text-lg text-muted-foreground">No photos uploaded yet</p>
      {events && events.length > 0 && (
        <PhotoUploadDialog
          onUpload={onUpload}
          isUploading={isUploading}
          selectedEventId={selectedEventId}
          onEventChange={onEventChange}
          events={events}
        />
      )}
    </div>
  );
};