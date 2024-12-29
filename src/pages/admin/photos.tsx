import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Upload, Download, ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";
import { toast } from "sonner";

type Photo = {
  id: string;
  url: string;
  eventId: string;
  eventName: string;
  date: string;
};

const PhotosPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedEventPhotos, setSelectedEventPhotos] = useState<Photo[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedEventId) return;

    setIsUploading(true);
    try {
      // Simulate file upload
      const newPhotos = Array.from(files).map((file) => ({
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        eventId: selectedEventId,
        eventName: "Sample Event",
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

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === selectedEventPhotos.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? selectedEventPhotos.length - 1 : prev - 1
    );
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
          {photos.length > 0 && (
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Select Event"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-48"
              />
              <Label
                htmlFor="photo-upload"
                className={`cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Photos
              </Label>
              <Input
                id="photo-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading || !selectedEventId}
              />
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              {photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 space-y-4">
                  <ImagePlus className="h-16 w-16 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">No photos uploaded yet</p>
                  <Label
                    htmlFor="photo-upload-empty"
                    className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Your First Photo
                  </Label>
                  <Input
                    id="photo-upload-empty"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {photos.map((photo) => (
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
                          onClick={() => startSlideshow(photo.eventId)}
                        >
                          View
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => downloadPhoto(photo)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {showSlideshow && (
          <Dialog open={showSlideshow} onOpenChange={setShowSlideshow}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Photo Slideshow</DialogTitle>
              </DialogHeader>
              <div className="relative">
                <img
                  src={selectedEventPhotos[currentSlide]?.url}
                  alt={`Slide ${currentSlide + 1}`}
                  className="w-full h-[60vh] object-contain"
                />
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <button
                  onClick={() => downloadPhoto(selectedEventPhotos[currentSlide])}
                  className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <Download className="h-6 w-6" />
                </button>
              </div>
              <div className="text-center">
                {currentSlide + 1} / {selectedEventPhotos.length}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

export default PhotosPage;