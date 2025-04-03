
import { PhotoUploadDialog } from "./photo-upload-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Photo } from "./types";
import { Event } from "@/stores/events-store";
import { useState } from "react";
import { PhotoCard } from "./photo-card";
import { EmptyState } from "./empty-state";
import { PhotoPagination } from "./photo-pagination";
import { useIsMobile } from "@/hooks/use-mobile";

interface PhotoGridProps {
  photos: Photo[];
  onStartSlideshow: (eventId: string) => void;
  onDownload: (photo: Photo) => void;
  searchTerm: string;
  onUpload: (files: FileList, eventId: string) => void;
  isUploading: boolean;
  selectedEventId: string;
  onEventChange: (eventId: string) => void;
  events: Event[];
}

export const PhotoGrid = ({ 
  photos, 
  onStartSlideshow, 
  onDownload, 
  searchTerm,
  onUpload,
  isUploading,
  selectedEventId,
  onEventChange,
  events
}: PhotoGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? 6 : 9;

  const filteredPhotos = photos.filter(photo => 
    photo.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPhotos = filteredPhotos.length;
  const totalPages = Math.ceil(totalPhotos / itemsPerPage);
  
  const paginatedPhotos = filteredPhotos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const photosByEvent = paginatedPhotos.reduce((acc, photo) => {
    if (!acc[photo.eventName]) {
      acc[photo.eventName] = [];
    }
    acc[photo.eventName].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  if (filteredPhotos.length === 0) {
    return (
      <EmptyState
        searchTerm={searchTerm}
        onUpload={onUpload}
        isUploading={isUploading}
        selectedEventId={selectedEventId}
        onEventChange={onEventChange}
        events={events}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center sm:justify-end w-full">
        <PhotoUploadDialog
          onUpload={onUpload}
          isUploading={isUploading}
          selectedEventId={selectedEventId}
          onEventChange={onEventChange}
          events={events}
        />
      </div>
      <ScrollArea className="h-[calc(100vh-300px)] md:h-[600px] pb-4">
        <div className="space-y-8">
          {Object.entries(photosByEvent).map(([eventName, eventPhotos]) => (
            <div key={eventName} className="space-y-4">
              <h2 className="text-xl font-semibold text-gold-800 dark:text-gold-200">{eventName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {eventPhotos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onStartSlideshow={onStartSlideshow}
                    onDownload={onDownload}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <PhotoPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
