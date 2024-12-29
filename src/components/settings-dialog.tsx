import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { Settings2 } from "lucide-react";
import { NotificationSettings } from "./settings/notification-settings";
import { CallPreferences } from "./settings/call-preferences";
import { OtherSettings } from "./settings/other-settings";
import { settingsFormSchema, defaultValues, type SettingsFormValues } from "./settings/settings-form-schema";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
    }
    return () => {
      form.reset(defaultValues);
    };
  }, [open, form]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("Settings update data:", data);
      toast.success("Settings updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent 
        className="sm:max-w-[500px] h-[90vh] flex flex-col overflow-hidden bg-background"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your preferences and notification settings
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <NotificationSettings form={form} />
              <Separator />
              <CallPreferences form={form} />
              <Separator />
              <OtherSettings form={form} />
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