import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { profileFormSchema, type ProfileFormValues } from "./profile/profile-form-schema";
import { ProfileForm } from "./profile/profile-form";

interface ProfileUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileUpdateDialog({ open, onOpenChange }: ProfileUpdateDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nickname: "",
      x: "",
      linkedin: "",
      facebook: "",
      address: "",
      bio: "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = useCallback(() => {
    form.reset();
    setImagePreview(null);
  }, [form]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
    return () => {
      resetForm();
    };
  }, [open, resetForm]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("Profile update data:", data);
      console.log("New profile image:", imagePreview);
      toast.success("Profile updated successfully!");
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleDialogInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(value) => {
        if (!value) {
          resetForm();
        }
        onOpenChange(value);
      }}
    >
      <DialogContent 
        className="sm:max-w-[500px] h-[90vh] flex flex-col overflow-hidden bg-background"
        onClick={handleDialogInteraction}
      >
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <ProfileForm
            form={form}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onSubmit={onSubmit}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}