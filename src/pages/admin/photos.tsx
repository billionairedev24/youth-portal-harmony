import { AdminLayout } from "@/components/admin-layout";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Photo } from "@/components/photos/types";
import { useEventsStore } from "@/stores/events-store";
import { PhotosHeader } from "@/components/photos/photos-header";
import { PhotosContent } from "@/components/photos/photos-content";

const PhotosPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const events = useEventsStore((state) => 
    state.events.filter(event => !event.archived)
  );
  
  // Initialize selectedEventId only once when component mounts
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  
  // Set initial event ID only once when events are loaded
  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const handleFileUpload = async (files: FileList, eventId: string) => {
    if (!eventId) {
      toast.error("Please select an event first");
      return;
    }

    setIsUploading(true);
    try {
      const selectedEvent = events.find(e => e.id === eventId);
      if (!selectedEvent) {
        toast.error("Invalid event selected");
        return;
      }

      const newPhotos = Array.from(files).map((file) => ({
        id: Date.now().toString() + Math.random(),
        url: URL.createObjectURL(file),
        eventId: eventId,
        eventName: selectedEvent.title,
        date: new Date().toISOString(),
      }));

      setPhotos(prev => [...prev, ...newPhotos]);
      toast.success("Photos uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload photos");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    toast.success("Photo deleted successfully");
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
          onDelete={handleDeletePhoto}
        />
      </div>
    </AdminLayout>
  );
};

export default PhotosPage;