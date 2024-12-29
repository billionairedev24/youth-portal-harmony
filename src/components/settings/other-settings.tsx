import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./settings-form-schema";

interface OtherSettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function OtherSettings({ form }: OtherSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Other Settings</h3>
      <FormField
        control={form.control}
        name="darkMode"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Dark Mode</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}