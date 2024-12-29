import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PhotoUploadDialog } from "@/components/photos/photo-upload-dialog";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { PhotoSlideshow } from "@/components/photos/photo-slideshow";
import { Photo } from "@/components/photos/types";
import { Input } from "@/components/ui/input";
import { useEventsStore } from "@/stores/events-store";

const PhotosPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedEventPhotos, setSelectedEventPhotos] = useState<Photo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Photo Management</h1>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <PhotoUploadDialog
              onUpload={handleFileUpload}
              isUploading={isUploading}
              selectedEventId={selectedEventId}
              onEventChange={setSelectedEventId}
              events={events}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <ImagePlus className="h-16 w-16 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">No photos uploaded yet</p>
                <PhotoUploadDialog
                  onUpload={handleFileUpload}
                  isUploading={isUploading}
                  selectedEventId={selectedEventId}
                  onEventChange={setSelectedEventId}
                  events={events}
                />
              </div>
            ) : (
              <PhotoGrid
                photos={photos}
                onStartSlideshow={startSlideshow}
                onDownload={downloadPhoto}
                searchTerm={searchTerm}
              />
            )}
          </CardContent>
        </Card>

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