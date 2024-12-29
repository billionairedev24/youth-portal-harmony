import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { Input } from "@/components/ui/input";
import { useEventsStore } from "@/stores/events-store";
import { Photo } from "@/components/photos/types";

const PhotosPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
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
    // Implement slideshow functionality
    console.log("Starting slideshow for event:", eventId);
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
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Photos</CardTitle>
          </CardHeader>
          <CardContent>
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
      </div>
    </AdminLayout>
  );
};

export default PhotosPage;
