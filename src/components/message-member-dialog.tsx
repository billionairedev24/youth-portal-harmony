import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Member } from "@/stores/members-store";
import { toast } from "sonner";

interface MessageMemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MessageMemberDialog({ member, open, onOpenChange }: MessageMemberDialogProps) {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  if (!member) return null;

  const handleSend = () => {
    // In a real application, this would send the message through the appropriate channel
    toast.success(`Message sent to ${member.firstName} via ${member.notificationPreference}`);
    setMessage("");
    setSubject("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Message {member.firstName} {member.lastName}</DialogTitle>
          <DialogDescription>
            Send a message via {member.notificationPreference}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {member.notificationPreference === "email" && (
            <div>
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          )}
          <Textarea
            placeholder={`Type your message${member.notificationPreference === "sms" ? " (160 characters max)" : ""}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={member.notificationPreference === "sms" ? 160 : undefined}
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSend}>
            Send {member.notificationPreference === "email" ? "Email" : 
                 member.notificationPreference === "sms" ? "SMS" : "WhatsApp Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}