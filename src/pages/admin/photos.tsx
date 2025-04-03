
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { Input } from "@/components/ui/input";
import { useEventsStore } from "@/stores/events-store";
import { Photo } from "@/components/photos/types";
import { PhotoSlideshow } from "@/components/photos/photo-slideshow";
import { Search } from "lucide-react";

const PhotosPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentEventPhotos, setCurrentEventPhotos] = useState<Photo[]>([]);
  
  const events = useEventsStore((state) => state.events);

  const handleFileUpload = async (files: FileList, eventId: string) => {
    setIsUploading(true);
    try {
      const selectedEvent = events.find(e => e.id === eventId);
      if (!selectedEvent) {
        toast.error("Please select an event first");
        return;
      }

      const newPhotos = Array.from(files).map((file) => ({
        id: Date.now().toString() + Math.random(),
        url: URL.createObjectURL(file),
        eventId: eventId,
        eventName: selectedEvent.title,
        date: new Date().toISOString(),
      }));

      setPhotos([...photos, ...newPhotos]);
      toast.success("Photos uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload photos");
    } finally {
      setIsUploading(false);
    }
  };

  const startSlideshow = (eventId: string) => {
    const eventPhotos = photos.filter(photo => photo.eventId === eventId);
    setCurrentEventPhotos(eventPhotos);
    setCurrentSlide(0);
    setSlideshowOpen(true);
  };

  const downloadPhoto = (photo: Photo) => {
    fetch(photo.url)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // Extract file extension from URL or default to .jpg
        const extension = photo.url.split('.').pop()?.toLowerCase() || 'jpg';
        link.download = `photo-${photo.id}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Photo downloaded successfully");
      })
      .catch(() => {
        toast.error("Failed to download photo");
      });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gold-800 dark:text-gold-200">Photo Gallery</h1>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-500 dark:text-gold-400" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-64 border-gold-200 dark:border-gold-800 focus:ring-gold-400 dark:focus:ring-gold-500"
            />
          </div>
        </div>

        <Card className="border-gold-200 dark:border-gold-800/50 bg-white/80 dark:bg-gold-900/30 backdrop-blur-sm shadow-md">
          <CardHeader className="border-b border-gold-100 dark:border-gold-800/30 pb-4">
            <CardTitle className="text-gold-800 dark:text-gold-200">Event Photos</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <PhotoGrid
              photos={photos}
              onStartSlideshow={startSlideshow}
              onDownload={downloadPhoto}
              searchTerm={searchTerm}
              onUpload={handleFileUpload}
              isUploading={isUploading}
              selectedEventId={selectedEventId}
              onEventChange={setSelectedEventId}
              events={events}
            />
          </CardContent>
        </Card>

        <PhotoSlideshow
          isOpen={slideshowOpen}
          onClose={() => setSlideshowOpen(false)}
          photos={currentEventPhotos}
          currentSlide={currentSlide}
          onPrevSlide={() => setCurrentSlide(prev => (prev > 0 ? prev - 1 : currentEventPhotos.length - 1))}
          onNextSlide={() => setCurrentSlide(prev => (prev < currentEventPhotos.length - 1 ? prev + 1 : 0))}
          onDownload={downloadPhoto}
        />
      </div>
    </AdminLayout>
  );
};

export default PhotosPage;
