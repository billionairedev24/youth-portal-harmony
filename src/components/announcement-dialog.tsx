import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (details: string) => Promise<void>;
  initialDetails?: string;
  mode?: "create" | "edit";
}

export function AnnouncementDialog({
  open,
  onOpenChange,
  onSubmit,
  initialDetails = "",
  mode = "create",
}: AnnouncementDialogProps) {
  const [details, setDetails] = useState(initialDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      toast({
        title: "Error",
        description: "Please enter announcement details",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(details);
      toast({
        title: "Success",
        description: `Announcement ${mode === "create" ? "created" : "updated"} successfully`,
      });
      onOpenChange(false);
      setDetails("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Create Announcement" : "Edit Announcement"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Create a new announcement to share with your community."
                : "Edit the announcement details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Enter announcement details..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting && <Spinner className="mr-2" />}
              {mode === "create" ? "Create Announcement" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}