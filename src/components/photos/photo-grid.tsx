import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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

interface PhotoGridProps {
  photos: Photo[];
  onDelete: (photoId: string) => void;
}

export const PhotoGrid = ({ photos, onDelete }: PhotoGridProps) => {
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);

  const handleDelete = () => {
    if (photoToDelete) {
      onDelete(photoToDelete.id);
      setPhotoToDelete(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative group rounded-lg overflow-hidden"
          >
            <img
              src={photo.url}
              alt={`Event: ${photo.eventName}`}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-white">
                <span className="text-sm truncate">{photo.eventName}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setPhotoToDelete(photo)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
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