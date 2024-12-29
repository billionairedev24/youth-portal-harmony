import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { Photo } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

interface PhotoGridProps {
  photos: Photo[];
  onStartSlideshow: (eventId: string) => void;
  onDownload: (photo: Photo) => void;
  onDelete: (photoId: string) => void;
}

export const PhotoGrid = ({ photos, onStartSlideshow, onDownload, onDelete }: PhotoGridProps) => {
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);

  const handleDelete = () => {
    if (photoToDelete) {
      onDelete(photoToDelete.id);
      toast.success("Photo deleted successfully");
      setPhotoToDelete(null);
    }
  };

  // Group photos by event
  const photosByEvent = photos.reduce((acc, photo) => {
    if (!acc[photo.eventName]) {
      acc[photo.eventName] = [];
    }
    acc[photo.eventName].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  return (
    <>
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setPhotoToDelete(photo)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!photoToDelete} onOpenChange={() => setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the photo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};