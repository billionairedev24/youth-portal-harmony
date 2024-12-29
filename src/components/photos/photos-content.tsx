import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PhotoGrid } from "./photo-grid";
import { PhotosEmptyState } from "./photos-empty-state";
import { Photo } from "./types";

interface PhotosContentProps {
  photos: Photo[];
  events: any[];
  onUpload: (files: FileList, eventId: string) => void;
  isUploading: boolean;
  selectedEventId: string;
  onEventChange: (eventId: string) => void;
  onStartSlideshow: (eventId: string) => void;
  onDownload: (photo: Photo) => void;
  onDelete: (photoId: string) => void;
}

export const PhotosContent = ({
  photos,
  events,
  onUpload,
  isUploading,
  selectedEventId,
  onEventChange,
  onStartSlideshow,
  onDownload,
  onDelete,
}: PhotosContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          {photos.length === 0 ? (
            <PhotosEmptyState
              onUpload={onUpload}
              isUploading={isUploading}
              selectedEventId={selectedEventId}
              onEventChange={onEventChange}
              events={events}
            />
          ) : (
            <PhotoGrid
              photos={photos}
              onStartSlideshow={onStartSlideshow}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};