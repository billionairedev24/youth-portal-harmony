
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Photo } from "./types";
import { ImagePlus } from "lucide-react";
import { PhotoSlideshow } from "./photo-slideshow";
import { PhotoGrid } from "./photo-grid";

interface UserPhotoViewerProps {
  photos: Photo[];
  selectedEventId: string;
}

export const UserPhotoViewer = ({ photos, selectedEventId }: UserPhotoViewerProps) => {
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentEventPhotos, setCurrentEventPhotos] = useState<Photo[]>([]);

  const eventPhotos = photos.filter(photo => photo.eventId === selectedEventId);

  const startSlideshow = (eventId: string) => {
    const photos = eventPhotos.filter(photo => photo.eventId === eventId);
    setCurrentEventPhotos(photos);
    setCurrentSlide(0);
    setSlideshowOpen(true);
  };

  if (eventPhotos.length === 0) {
    return (
      <Card className="dark:bg-gold-900/50 dark:border-gold-700 shadow-md">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <ImagePlus className="h-16 w-16 text-muted-foreground dark:text-gold-400" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold dark:text-gold-100">No Photos Yet</h3>
            <p className="text-muted-foreground dark:text-gold-400 max-w-md">
              Photos from this event will appear here once they're uploaded. 
              Check back soon to see memories from this gathering!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gold-900/50 dark:border-gold-700 shadow-md">
      <CardHeader>
        <CardTitle className="dark:text-gold-100">Event Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <PhotoGrid
          photos={eventPhotos}
          onStartSlideshow={startSlideshow}
          onDownload={() => {}}
          searchTerm=""
          onUpload={() => {}}
          isUploading={false}
          selectedEventId={selectedEventId}
          onEventChange={() => {}}
          events={[]}
        />

        <PhotoSlideshow
          isOpen={slideshowOpen}
          onClose={() => setSlideshowOpen(false)}
          photos={currentEventPhotos}
          currentSlide={currentSlide}
          onPrevSlide={() => setCurrentSlide(prev => (prev > 0 ? prev - 1 : currentEventPhotos.length - 1))}
          onNextSlide={() => setCurrentSlide(prev => (prev < currentEventPhotos.length - 1 ? prev + 1 : 0))}
          onDownload={() => {}}
        />
      </CardContent>
    </Card>
  );
};
