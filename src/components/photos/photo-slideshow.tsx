
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { Photo } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  if (!photos.length) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black/95 border-gold-800/30">
        <DialogHeader className="p-4 sm:p-6 border-b border-gold-800/30 flex flex-row justify-between items-center">
          <DialogTitle className="text-white">Photo Slideshow</DialogTitle>
          <button 
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </DialogHeader>
        <div className="relative aspect-auto md:aspect-[16/9] h-[50vh] md:h-auto">
          <img
            src={photos[currentSlide]?.url}
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-full object-contain"
          />
          <button
            onClick={onPrevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
          </button>
          <button
            onClick={onNextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
          </button>
          <button
            onClick={() => onDownload(photos[currentSlide])}
            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label="Download photo"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
        <div className="text-center py-4 text-white/90 border-t border-gold-800/30">
          {currentSlide + 1} / {photos.length}
        </div>
      </DialogContent>
    </Dialog>
  );
};
