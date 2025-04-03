
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Photo } from "./types";
import { useState } from "react";

interface PhotoCardProps {
  photo: Photo;
  onStartSlideshow: (eventId: string) => void;
  onDownload: (photo: Photo) => void;
}

export const PhotoCard = ({ photo, onStartSlideshow, onDownload }: PhotoCardProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gold-900/40 border border-gold-200 dark:border-gold-800/50">
      <div className="relative aspect-[4/3] overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gold-100 dark:bg-gold-900/60">
            <div className="w-8 h-8 border-4 border-gold-300 dark:border-gold-600 border-t-gold-500 dark:border-t-gold-400 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={photo.url}
          alt={`Event photo ${photo.id}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={() => setIsLoading(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStartSlideshow(photo.eventId)}
          className="text-white hover:bg-white/20 transition-colors"
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDownload(photo)}
          className="text-white hover:bg-white/20 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};
