
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Member } from "@/stores/members-store";
import { toast } from "sonner";
import { Mail, Phone, MessageSquare } from "lucide-react";

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

  // Set the default message for birthday wishes when the dialog opens
  useEffect(() => {
    if (open && member) {
      setMessage(`Happy birthday, ${member.firstName}! Wishing you a wonderful celebration and a fantastic year ahead.`);
      if (member.notificationPreference === "email") {
        setSubject(`Happy Birthday ${member.firstName}!`);
      }
    }
  }, [open, member]);

  if (!member) return null;

  const handleSend = () => {
    if (!isValid) return;

    // In a real application, this would send the message through the appropriate channel
    toast.success(`Birthday wishes sent to ${member.firstName} via ${member.notificationPreference === "email" ? "email" : "SMS"}`);
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

  const getPreferenceIcon = () => {
    switch(member.notificationPreference) {
      case 'email':
        return <Mail className="h-5 w-5 mr-2 text-gold-500" />;
      case 'sms':
        return <Phone className="h-5 w-5 mr-2 text-gold-500" />;
      default:
        return <Mail className="h-5 w-5 mr-2 text-gold-500" />;
    }
  };

  const getPreferenceName = () => {
    switch(member.notificationPreference) {
      case 'email':
        return "Email";
      case 'sms':
        return "SMS";
      default:
        return "Email";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gold-50 to-white dark:from-gold-900/80 dark:to-gold-950/90 border-gold-200 dark:border-gold-700 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getPreferenceIcon()}
            Send Birthday Wishes to {member.firstName} {member.lastName}
          </DialogTitle>
          <DialogDescription>
            Send a message via {getPreferenceName()}
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
                className="border-gold-200 focus:border-gold-400 focus:ring-gold-400"
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
              className="min-h-[100px] border-gold-200 focus:border-gold-400 focus:ring-gold-400"
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
            className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 shadow-md"
          >
            {getPreferenceIcon()}
            Send Birthday Wishes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
