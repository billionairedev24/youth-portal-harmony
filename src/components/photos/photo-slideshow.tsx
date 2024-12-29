import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Photo } from "./types";

interface PhotoSlideshowProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  currentSlide: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onDownload: (photo: Photo) => void;
}

export const PhotoSlideshow = ({
  isOpen,
  onClose,
  photos,
  currentSlide,
  onPrevSlide,
  onNextSlide,
  onDownload,
}: PhotoSlideshowProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Photo Slideshow</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <img
            src={photos[currentSlide]?.url}
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-[60vh] object-contain"
          />
          <button
            onClick={onPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={onNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <button
            onClick={() => onDownload(photos[currentSlide])}
            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <Download className="h-6 w-6" />
          </button>
        </div>
        <div className="text-center">
          {currentSlide + 1} / {photos.length}
        </div>
      </DialogContent>
    </Dialog>
  );
};