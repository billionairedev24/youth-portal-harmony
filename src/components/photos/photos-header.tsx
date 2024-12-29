import { PhotoUploadDialog } from "./photo-upload-dialog";

interface PhotosHeaderProps {
  onUpload: (files: FileList, eventId: string) => void;
  isUploading: boolean;
  selectedEventId: string;
  onEventChange: (eventId: string) => void;
  events: any[];
}

export const PhotosHeader = ({
  onUpload,
  isUploading,
  selectedEventId,
  onEventChange,
  events,
}: PhotosHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Photo Management</h1>
      {events.length > 0 && (
        <PhotoUploadDialog
          onUpload={onUpload}
          isUploading={isUploading}
          selectedEventId={selectedEventId}
          onEventChange={onEventChange}
        />
      )}
    </div>
  );
};