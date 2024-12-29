import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./profile-form-schema";

interface SocialLinksSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function SocialLinksSection({ form }: SocialLinksSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium flex items-center gap-2">
        <Link className="h-4 w-4" />
        Social Links
      </h4>
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="x"
          render={({ field }) => (
            <FormItem>
              <FormLabel>X</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://x.com/username" 
                  {...field} 
                  className="focus:ring-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://linkedin.com/in/username" 
                  {...field} 
                  className="focus:ring-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://facebook.com/username" 
                  {...field} 
                  className="focus:ring-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}