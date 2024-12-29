import { AdminLayout } from "@/components/admin-layout";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PhotoSlideshow } from "@/components/photos/photo-slideshow";
import { Photo } from "@/components/photos/types";
import { useEventsStore } from "@/stores/events-store";
import { PhotosHeader } from "@/components/photos/photos-header";
import { PhotosContent } from "@/components/photos/photos-content";

const PhotosPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const events = useEventsStore((state) => state.events.filter(event => !event.archived));
  const defaultEventId = useMemo(() => events[0]?.id || "", [events]);
  const [selectedEventId, setSelectedEventId] = useState(defaultEventId);
  const [isUploading, setIsUploading] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedEventPhotos, setSelectedEventPhotos] = useState<Photo[]>([]);

  const handleFileUpload = async (files: FileList, eventId: string) => {
    setIsUploading(true);
    try {
      const selectedEvent = events.find(e => e.id === eventId);
      const newPhotos = Array.from(files).map((file) => ({
        id: Date.now().toString() + Math.random(),
        url: URL.createObjectURL(file),
        eventId: eventId,
        eventName: selectedEvent?.title || "Unknown Event",
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

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(photos.filter(photo => photo.id !== photoId));
  };

  const startSlideshow = (eventId: string) => {
    const eventPhotos = photos.filter((photo) => photo.eventId === eventId);
    setSelectedEventPhotos(eventPhotos);
    setCurrentSlide(0);
    setShowSlideshow(true);
  };

  const downloadPhoto = (photo: Photo) => {
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = `photo-${photo.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Photo downloaded successfully");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PhotosHeader
          onUpload={handleFileUpload}
          isUploading={isUploading}
          selectedEventId={selectedEventId}
          onEventChange={setSelectedEventId}
          events={events}
        />

        <PhotosContent
          photos={photos}
          events={events}
          onUpload={handleFileUpload}
          isUploading={isUploading}
          selectedEventId={selectedEventId}
          onEventChange={setSelectedEventId}
          onStartSlideshow={startSlideshow}
          onDownload={downloadPhoto}
          onDelete={handleDeletePhoto}
        />

        <PhotoSlideshow
          isOpen={showSlideshow}
          onClose={() => setShowSlideshow(false)}
          photos={selectedEventPhotos}
          currentSlide={currentSlide}
          onPrevSlide={() => setCurrentSlide((prev) =>
            prev === 0 ? selectedEventPhotos.length - 1 : prev - 1
          )}
          onNextSlide={() => setCurrentSlide((prev) =>
            prev === selectedEventPhotos.length - 1 ? 0 : prev + 1
          )}
          onDownload={downloadPhoto}
        />
      </div>
    </AdminLayout>
  );
};

export default PhotosPage;