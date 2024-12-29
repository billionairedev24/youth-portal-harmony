import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Photo } from "./types";

interface PhotoGridProps {
  photos: Photo[];
  onStartSlideshow: (eventId: string) => void;
  onDownload: (photo: Photo) => void;
}

export const PhotoGrid = ({ photos, onStartSlideshow, onDownload }: PhotoGridProps) => {
  // Group photos by event
  const photosByEvent = photos.reduce((acc, photo) => {
    if (!acc[photo.eventName]) {
      acc[photo.eventName] = [];
    }
    acc[photo.eventName].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  return (
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
  );
};