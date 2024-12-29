import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ProfileImageUpload } from "./profile/profile-image-upload";
import { SocialLinksSection } from "./profile/social-links-section";
import { profileFormSchema, type ProfileFormValues } from "./profile/profile-form-schema";
import { getMockAddressSuggestions } from "@/lib/mock-addresses";

interface ProfileUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileUpdateDialog({ open, onOpenChange }: ProfileUpdateDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const handleAddressInput = useCallback((value: string, onChange: (...event: any[]) => void) => {
    onChange(value);
    const suggestions = getMockAddressSuggestions(value);
    setAddressSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  }, []);

  const handleAddressSelect = useCallback((address: string, onChange: (...event: any[]) => void) => {
    onChange(address);
    setShowSuggestions(false);
  }, []);

  const resetForm = useCallback(() => {
    form.reset();
    setImagePreview(null);
    setAddressSuggestions([]);
    setShowSuggestions(false);
  }, [form]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Simulate API call with delay to avoid race conditions
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

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent 
        className="sm:max-w-[500px] h-[90vh] flex flex-col overflow-hidden bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ProfileImageUpload 
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
              />

              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your nickname" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SocialLinksSection form={form} />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your address" 
                        {...field}
                        onChange={(e) => handleAddressInput(e.target.value, field.onChange)}
                        onFocus={() => setShowSuggestions(addressSuggestions.length > 0)}
                      />
                    </FormControl>
                    {showSuggestions && (
                      <div className="absolute z-[60] w-full mt-1 bg-background border border-input rounded-md shadow-lg">
                        {addressSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 cursor-pointer hover:bg-accent"
                            onClick={() => handleAddressSelect(suggestion, field.onChange)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about yourself" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" className="bg-gradient-to-r from-gold-400 to-gold-600 text-white">
                  Save changes
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}