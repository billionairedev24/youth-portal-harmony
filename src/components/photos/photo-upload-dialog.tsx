import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PhotoUploadDialogProps {
  onUpload: (files: FileList, eventId: string) => void;
  isUploading: boolean;
  selectedEventId: string;
}

export const PhotoUploadDialog = ({
  onUpload,
  isUploading,
  selectedEventId,
}: PhotoUploadDialogProps) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedEventId) {
      toast.error("Please select files and an event");
      return;
    }
    onUpload(files, selectedEventId);
  };

  return (
    <div className="flex gap-4 items-center">
      <Input
        type="text"
        placeholder="Select Event"
        value={selectedEventId}
        className="w-48"
        readOnly
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
  );
};