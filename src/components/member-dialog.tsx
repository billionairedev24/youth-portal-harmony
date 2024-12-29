import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Member } from "@/stores/members-store";
import { format } from "date-fns";

interface MemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberDialog({ member, open, onOpenChange }: MemberDialogProps) {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.image} alt={`${member.firstName} ${member.lastName}`} />
              <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
            </Avatar>
            <span>{member.firstName} {member.lastName}</span>
          </DialogTitle>
          <DialogDescription>
            Member details and information
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="text-sm">{member.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <p className="text-sm">{member.phone}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <h3 className="font-semibold">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Birthday</label>
                  <p className="text-sm">{format(new Date(member.birthday), 'MMMM do, yyyy')}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Role</label>
                  <p className="text-sm capitalize">{member.role}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <h3 className="font-semibold">Address</h3>
              <p className="text-sm">{member.address}</p>
            </div>

            <div className="grid gap-2">
              <h3 className="font-semibold">Preferences</h3>
              <div>
                <label className="text-sm text-muted-foreground">Notification Method</label>
                <p className="text-sm capitalize">{member.notificationPreference}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}