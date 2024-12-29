import { Button } from "@/components/ui/button";
import { Download, ImagePlus } from "lucide-react";
import { Photo } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PhotoUploadDialog } from "./photo-upload-dialog";
import { Event } from "@/stores/events-store";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const itemsPerPage = 9; // 3x3 grid

  // Filter photos based on search term
  const filteredPhotos = photos.filter(photo => 
    photo.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group photos by event
  const photosByEvent = filteredPhotos.reduce((acc, photo) => {
    if (!acc[photo.eventName]) {
      acc[photo.eventName] = [];
    }
    acc[photo.eventName].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  // Calculate pagination
  const totalEvents = Object.keys(photosByEvent).length;
  const totalPages = Math.ceil(totalEvents / itemsPerPage);
  
  // Get paginated events
  const paginatedEvents = Object.entries(photosByEvent)
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (Object.keys(photosByEvent).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <ImagePlus className="h-16 w-16 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">
          {searchTerm 
            ? `No photos found for "${searchTerm}"`
            : "No photos have been uploaded yet"}
        </p>
        <PhotoUploadDialog
          onUpload={onUpload}
          isUploading={isUploading}
          selectedEventId={selectedEventId}
          onEventChange={onEventChange}
          events={events}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <PhotoUploadDialog
          onUpload={onUpload}
          isUploading={isUploading}
          selectedEventId={selectedEventId}
          onEventChange={onEventChange}
          events={events}
        />
      </div>
      <ScrollArea className="h-[600px]">
        <div className="space-y-8">
          {paginatedEvents.map(([eventName, eventPhotos]) => (
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};