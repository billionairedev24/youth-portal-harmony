
import { useMembersStore } from "@/stores/members-store";
import { BirthdayCard } from "./birthday-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cake, Gift, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { format, isSameMonth, parseISO } from "date-fns";
import { MessageMemberDialog } from "@/components/message-member-dialog";
import { toast } from "sonner";

// Mock data for fallback
const mockMembers = [
  {
    id: "1",
    image: "/placeholder.svg",
    firstName: "Emma",
    lastName: "Johnson",
    email: "emma.j@example.com",
    phone: "+1234567890",
    address: "123 Main St",
    birthday: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString(),
    notificationPreference: "email" as const,
    role: "member" as const
  },
  {
    id: "2",
    image: "/placeholder.svg",
    firstName: "Michael",
    lastName: "Smith",
    email: "michael.s@example.com",
    phone: "+1987654321",
    address: "456 Oak Ave",
    birthday: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString(),
    notificationPreference: "sms" as const,
    role: "member" as const
  },
  {
    id: "3",
    image: "/placeholder.svg",
    firstName: "Sophia",
    lastName: "Williams",
    email: "sophia.w@example.com",
    phone: "+1122334455",
    address: "789 Pine St",
    birthday: new Date(new Date().getFullYear(), new Date().getMonth(), 25).toISOString(),
    notificationPreference: "email" as const,
    role: "member" as const
  },
];

export function MonthlyBirthdays() {
  const { members, isLoading, error } = useMembersStore();
  const [currentMonth] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  
  // Use actual members if available, otherwise use mock data
  const displayMembers = error || members.length === 0 ? mockMembers : members;
  
  // Filter members with birthdays in the current month
  const birthdaysThisMonth = displayMembers.filter(member => {
    const birthday = new Date(member.birthday);
    return isSameMonth(birthday, currentMonth);
  }).sort((a, b) => {
    const dayA = new Date(a.birthday).getDate();
    const dayB = new Date(b.birthday).getDate();
    return dayA - dayB;
  });
  
  return (
    <Card className="bg-card dark:bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-200/20 dark:bg-gold-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold-300/20 dark:bg-gold-700/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 z-0"></div>
      
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-lg font-medium flex items-center text-foreground">
          <Cake className="mr-2 h-5 w-5 text-gold-500" />
          {format(currentMonth, 'MMMM')} Birthdays
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 pt-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-[220px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
          </div>
        ) : birthdaysThisMonth.length > 0 ? (
          <ScrollArea className="h-[220px] pr-4 -mr-4">
            <div className="space-y-4 pr-2">
              {birthdaysThisMonth.map((member) => (
                <div key={member.id} className="group">
                  <div className="relative bg-white/50 dark:bg-gold-900/40 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
                    <BirthdayCard member={member} />
                    
                    {/* Communication options on hover */}
                    <div className="absolute right-0 top-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pr-3 pl-8 bg-gradient-to-l from-white/80 via-white/60 to-transparent dark:from-gold-900/80 dark:via-gold-900/60 dark:to-transparent z-20">
                      {member.email && (
                        <button 
                          onClick={() => {
                            setSelectedMember({...member, notificationPreference: "email"});
                            setShowMessageDialog(true);
                          }}
                          className="p-2 rounded-full bg-gold-100 hover:bg-gold-200 text-gold-600 dark:bg-gold-800 dark:hover:bg-gold-700 dark:text-gold-300 shadow-sm"
                          title="Send birthday wishes via email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      )}
                      {member.phone && (
                        <button 
                          onClick={() => {
                            setSelectedMember({...member, notificationPreference: "sms"});
                            setShowMessageDialog(true);
                          }}
                          className="p-2 rounded-full bg-gold-100 hover:bg-gold-200 text-gold-600 dark:bg-gold-800 dark:hover:bg-gold-700 dark:text-gold-300 shadow-sm"
                          title="Send birthday wishes via SMS"
                        >
                          <Phone className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-[180px] text-center p-4">
            <Gift className="h-10 w-10 text-gold-400 mb-2" />
            <h3 className="text-lg font-medium text-gold-600 mb-1">No Birthdays This Month</h3>
            <p className="text-sm text-muted-foreground">
              There are no birthdays to celebrate this month.
            </p>
          </div>
        )}
      </CardContent>
      
      {selectedMember && (
        <MessageMemberDialog
          member={selectedMember}
          open={showMessageDialog}
          onOpenChange={setShowMessageDialog}
        />
      )}
    </Card>
  );
}
