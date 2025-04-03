
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
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
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (member?.notificationPreference === "email") {
      setIsValid(message.trim().length > 0 && subject.trim().length > 0);
    } else {
      setIsValid(message.trim().length > 0);
    }
  }, [message, subject, member?.notificationPreference]);

  if (!member) return null;

  const handleSend = () => {
    if (!isValid) return;

    // In a real application, this would send the message through the appropriate channel
    toast.success(`Message sent to ${member.firstName} via ${member.notificationPreference}`);
    setMessage("");
    setSubject("");
    onOpenChange(false);
  };

  const getCharacterCount = () => {
    if (member.notificationPreference === "sms") {
      return `${message.length}/160 characters`;
    }
    return null;
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
            <div className="space-y-2">
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                aria-required="true"
              />
              {subject.trim().length === 0 && (
                <p className="text-sm text-destructive">Subject is required for email messages</p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Textarea
              placeholder={`Type your message${member.notificationPreference === "sms" ? " (160 characters max)" : ""}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={member.notificationPreference === "sms" ? 160 : undefined}
              className="min-h-[100px]"
              required
              aria-required="true"
            />
            {message.trim().length === 0 && (
              <p className="text-sm text-destructive">Message is required</p>
            )}
            {getCharacterCount() && (
              <p className="text-sm text-muted-foreground text-right">{getCharacterCount()}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleSend} 
            disabled={!isValid}
          >
            Send {member.notificationPreference === "email" ? "Email" : 
                 member.notificationPreference === "sms" ? "SMS" : "WhatsApp Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
