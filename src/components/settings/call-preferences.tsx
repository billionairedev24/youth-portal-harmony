import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./settings-form-schema";

interface CallPreferencesProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function CallPreferences({ form }: CallPreferencesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Call Time Preferences
      </h3>
      <FormField
        control={form.control}
        name="callPreference"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="morning" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Morning (8:00 AM - 12:00 PM)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="afternoon" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Afternoon (12:00 PM - 5:00 PM)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="evening" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Evening (5:00 PM - 9:00 PM)
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}