
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MessageSquare, Mail, Phone } from "lucide-react";
import { useMembersStore, Member, NotificationPreference } from "@/stores/members-store";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export function CommunicationCenter() {
  const { members } = useMembersStore();
  const [communicationType, setCommunicationType] = useState<NotificationPreference>("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const isMobile = useIsMobile();

  // Filter members based on their notification preference
  const eligibleMembers = members.filter(
    member => communicationType === "all" || member.notificationPreference === communicationType
  );

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(eligibleMembers.map(member => member.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleMemberSelection = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
      setSelectAll(false);
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
      if (selectedMembers.length + 1 === eligibleMembers.length) {
        setSelectAll(true);
      }
    }
  };

  const handleSendMessage = () => {
    if (!message) {
      toast.error("Please enter a message");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    if (communicationType === "email" && !subject) {
      toast.error("Subject is required for emails");
      return;
    }

    // Get the names of selected members for the success message
    const selectedMemberNames = members
      .filter(member => selectedMembers.includes(member.id))
      .map(member => `${member.firstName} ${member.lastName}`);

    // In a real app, this would call an API to send the messages
    toast.success(
      `${communicationType === "email" ? "Email" : 
        communicationType === "sms" ? "SMS" : "WhatsApp message"} sent to ${selectedMemberNames.join(", ")}`
    );

    // Reset form
    setMessage("");
    setSubject("");
    setSelectedMembers([]);
    setSelectAll(false);
  };

  const getIcon = () => {
    switch (communicationType) {
      case "email":
        return <Mail className="h-5 w-5" />;
      case "sms":
        return <Phone className="h-5 w-5" />;
      case "whatsapp":
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <Mail className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          Communication Center
        </CardTitle>
        <CardDescription>
          Send messages to members via their preferred communication method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Communication Type</label>
          <Select
            value={communicationType}
            onValueChange={(value) => {
              setCommunicationType(value as NotificationPreference);
              setSelectedMembers([]);
              setSelectAll(false);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {communicationType === "email" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Type your ${communicationType} message here...`}
            className="min-h-[100px]"
            required
          />
          {communicationType === "sms" && (
            <p className="text-xs text-muted-foreground text-right">{message.length}/160 characters</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Recipients</label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
              disabled={eligibleMembers.length === 0}
            >
              {selectAll ? "Deselect All" : "Select All"}
            </Button>
          </div>
          
          {eligibleMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              No members have selected {communicationType} as their notification preference.
            </p>
          ) : (
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'} gap-2 max-h-[200px] overflow-y-auto p-1`}>
              {eligibleMembers.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
                    selectedMembers.includes(member.id)
                      ? "bg-gold-200/50 dark:bg-gold-800/30 border-gold-300 dark:border-gold-700"
                      : "border-transparent hover:bg-gold-100/30 dark:hover:bg-gold-900/20"
                  }`}
                  onClick={() => toggleMemberSelection(member.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => {}}
                    className="h-4 w-4"
                  />
                  <span className="text-sm truncate">
                    {member.firstName} {member.lastName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSendMessage}
          disabled={!message || selectedMembers.length === 0 || (communicationType === "email" && !subject)}
          className="w-full"
        >
          Send {communicationType === "email" ? "Email" : 
                communicationType === "sms" ? "SMS" : "WhatsApp Message"}
        </Button>
      </CardFooter>
    </Card>
  );
}
