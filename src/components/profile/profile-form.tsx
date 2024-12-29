import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./profile-form-schema";
import { ProfileImageUpload } from "./profile-image-upload";
import { SocialLinksSection } from "./social-links-section";
import { AddressField } from "./address-field";

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormValues>;
  imagePreview: string | null;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
}

export function ProfileForm({ form, imagePreview, onImageChange, onSubmit }: ProfileFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProfileImageUpload 
          imagePreview={imagePreview}
          onImageChange={onImageChange}
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
        <AddressField form={form} />

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
  );
}