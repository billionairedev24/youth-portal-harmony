import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Photo } from "./types";

interface PhotoCardProps {
  photo: Photo;
  onStartSlideshow: (eventId: string) => void;
  onDownload: (photo: Photo) => void;
}

export const PhotoCard = ({ photo, onStartSlideshow, onDownload }: PhotoCardProps) => {
  return (
    <div className="relative group rounded-lg overflow-hidden">
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
  );
};