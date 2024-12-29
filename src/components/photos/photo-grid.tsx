import { Button } from "@/components/ui/button";
import { Download, ImagePlus } from "lucide-react";
import { Photo } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PhotoUploadDialog } from "./photo-upload-dialog";
import { Event } from "@/stores/events-store";

interface PhotoGridProps {
  photos: Photo[];
  onStartSlideshow: (eventId: string) => void;
  onDownload: (photo: Photo) => void;
  searchTerm: string;
  onUpload: (files: FileList, eventId: string) => void;
  isUploading: boolean;
  selectedEventId: string;
  onEventChange: (eventId: string) => void;
  events: Event[];
}

export const PhotoGrid = ({ 
  photos, 
  onStartSlideshow, 
  onDownload, 
  searchTerm,
  onUpload,
  isUploading,
  selectedEventId,
  onEventChange,
  events
}: PhotoGridProps) => {
  // Filter photos based on search term
  const filteredPhotos = photos.filter(photo => 
    photo.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group photos by event
  const photosByEvent = filteredPhotos.reduce((acc, photo) => {
    if (!acc[photo.eventName]) {
      acc[photo.eventName] = [];
    }
    acc[photo.eventName].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  if (Object.keys(photosByEvent).length === 0) {
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
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <PhotoUploadDialog
          onUpload={onUpload}
          isUploading={isUploading}
          selectedEventId={selectedEventId}
          onEventChange={onEventChange}
          events={events}
        />
      </div>
      <ScrollArea className="h-[600px]">
        <div className="space-y-8">
          {Object.entries(photosByEvent).map(([eventName, eventPhotos]) => (
            <div key={eventName} className="space-y-4">
              <h2 className="text-xl font-semibold">{eventName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {eventPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo.url}
                      alt={`Event photo ${photo.id}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onStartSlideshow(photo.eventId)}
                      >
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onDownload(photo)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};