import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUser } from "@/lib/utils";
import { Camera } from "lucide-react";

interface ProfileImageUploadProps {
  imagePreview: string | null;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileImageUpload({ imagePreview, onImageChange }: ProfileImageUploadProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24 cursor-pointer relative group">
        <AvatarImage src={imagePreview || mockUser.avatar} />
        <AvatarFallback>{mockUser.name[0]}</AvatarFallback>
        <label 
          htmlFor="profile-image" 
          className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Camera className="h-8 w-8 text-white" />
        </label>
        <input
          id="profile-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageChange}
        />
      </Avatar>
      <div className="text-center">
        <h3 className="font-semibold text-lg">{mockUser.name}</h3>
        <p className="text-sm text-muted-foreground">{mockUser.email}</p>
      </div>
    </div>
  );
}