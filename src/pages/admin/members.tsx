
import { AdminLayout } from "@/components/admin-layout";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, EyeOff, MoreHorizontal, MessageSquare, UserCog, Pencil, Cake } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMembersStore } from "@/stores/members-store";
import type { ColumnDef } from "@tanstack/react-table";
import type { Member, NotificationPreference } from "@/stores/members-store";
import { MemberDialog } from "@/components/member-dialog";
import { MessageMemberDialog } from "@/components/message-member-dialog";
import { EditMemberDialog } from "@/components/edit-member-dialog";
import { format, isSameMonth } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { CommunicationCenter } from "@/components/communication-center";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MonthlyBirthdays } from "@/components/birthdays/monthly-birthdays";

const MembersPage = () => {
  const { members, toggleRole } = useMembersStore();
  const [hiddenEmails, setHiddenEmails] = useState<Record<string, boolean>>({});
  const [hiddenPhones, setHiddenPhones] = useState<Record<string, boolean>>({});
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleEmailVisibility = (id: string) => {
    setHiddenEmails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePhoneVisibility = (id: string) => {
    setHiddenPhones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    return `${username[0]}${'*'.repeat(username.length - 1)}@${domain}`;
  };

  const maskPhone = (phone: string) => {
    return phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
  };

  const getResponsiveColumns = (): ColumnDef<Member>[] => {
    // Base columns that always show
    const baseColumns: ColumnDef<Member>[] = [
      {
        id: "image",
        header: "Image",
        cell: ({ row }) => {
          const member = row.original;
          return (
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.image} alt={`${member.firstName} ${member.lastName}`} />
              <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
            </Avatar>
          );
        },
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        enableGlobalFilter: true,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        enableGlobalFilter: true,
      },
    ];

    // Additional columns for non-mobile views
    const desktopColumns: ColumnDef<Member>[] = [
      {
        accessorKey: "email",
        header: "Email",
        enableGlobalFilter: true,
        cell: ({ row }) => {
          const member = row.original;
          const isHidden = hiddenEmails[member.id] ?? true; // Default to hidden
          return (
            <div className="flex items-center gap-2">
              <span>{isHidden ? maskEmail(member.email) : member.email}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleEmailVisibility(member.id)}
                className="h-8 w-8"
              >
                {isHidden ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: "phone",
        header: "Phone",
        enableGlobalFilter: true, 
        cell: ({ row }) => {
          const member = row.original;
          const isHidden = hiddenPhones[member.id] ?? true; // Default to hidden
          return (
            <div className="flex items-center gap-2">
              <span>{isHidden ? maskPhone(member.phone) : member.phone}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => togglePhoneVisibility(member.id)}
                className="h-8 w-8"
              >
                {isHidden ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: "birthday",
        header: "Birthday",
        cell: ({ row }) => {
          const member = row.original;
          return format(new Date(member.birthday), 'MMMM do');
        },
      },
      {
        accessorKey: "address",
        header: "Address",
        enableGlobalFilter: true,
      },
      {
        accessorKey: "notificationPreference",
        header: "Notification Preference",
        cell: ({ row }) => {
          const preference = row.getValue("notificationPreference") as NotificationPreference;
          return (
            <span className="capitalize">{preference}</span>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const member = row.original;
          return (
            <span className="capitalize">{member.role}</span>
          );
        },
      },
    ];

    // Actions column is always present
    const actionsColumn: ColumnDef<Member> = {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedMember(member);
                  setViewDialogOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View member
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedMember(member);
                  setEditDialogOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit member
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedMember(member);
                  setMessageDialogOpen(true);
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message member
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toggleRole(member.id);
                  toast.success(`${member.firstName}'s role updated to ${member.role === "admin" ? "member" : "admin"}`);
                }}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Change role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    };

    // Return either mobile or desktop columns
    return isMobile 
      ? [...baseColumns, actionsColumn]
      : [...baseColumns, ...desktopColumns, actionsColumn];
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <UserCog className="h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">No Members Found</h3>
      <p className="text-sm text-muted-foreground max-w-sm text-center">
        There are no members in the system yet. Add members to see them listed here.
      </p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-muted-foreground">
            Manage your organization members
          </p>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="members" className="flex-1">Members List</TabsTrigger>
            <TabsTrigger value="birthdays" className="flex-1">Birthdays</TabsTrigger>
            <TabsTrigger value="communication" className="flex-1">Communication Center</TabsTrigger>
          </TabsList>
          
          <TabsContent value="members">
            {members.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="bg-white dark:bg-black/10 rounded-lg shadow-sm overflow-hidden">
                <DataTable
                  columns={getResponsiveColumns()}
                  data={members}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="birthdays">
            <div className="grid gap-6 md:grid-cols-2">
              <MonthlyBirthdays />
              
              <Card className="bg-gradient-to-br from-gold-50/80 to-gold-100/40 dark:from-gold-900/60 dark:to-gold-800/30 border-gold-200 dark:border-gold-700 backdrop-blur-sm shadow-lg overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center text-gold-800 dark:text-gold-100">
                    <Cake className="mr-2 h-5 w-5 text-gold-500" />
                    Birthday Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/70 dark:bg-black/20 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Total Birthdays</p>
                        <p className="text-2xl font-bold text-gold-600">{members.length}</p>
                      </div>
                      
                      <div className="bg-white/70 dark:bg-black/20 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">This Month</p>
                        <p className="text-2xl font-bold text-gold-600">
                          {members.filter(member => isSameMonth(new Date(member.birthday), new Date())).length}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white/70 dark:bg-black/20 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Upcoming Birthdays</p>
                      <ScrollArea className="h-[140px]">
                        <div className="space-y-2">
                          {members
                            .filter(member => {
                              const birthday = new Date(member.birthday);
                              const today = new Date();
                              const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
                              return thisYearBirthday >= today;
                            })
                            .sort((a, b) => {
                              const birthdayA = new Date(a.birthday);
                              const birthdayB = new Date(b.birthday);
                              const today = new Date();
                              const thisYearBirthdayA = new Date(today.getFullYear(), birthdayA.getMonth(), birthdayA.getDate());
                              const thisYearBirthdayB = new Date(today.getFullYear(), birthdayB.getMonth(), birthdayB.getDate());
                              return thisYearBirthdayA.getTime() - thisYearBirthdayB.getTime();
                            })
                            .slice(0, 5)
                            .map(member => (
                              <div key={member.id} className="flex items-center p-1">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage src={member.image} alt={`${member.firstName} ${member.lastName}`} />
                                  <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-xs font-medium">{member.firstName} {member.lastName}</p>
                                  <p className="text-xs text-muted-foreground">{format(new Date(member.birthday), 'MMMM do')}</p>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="communication">
            <CommunicationCenter />
          </TabsContent>
        </Tabs>
      </div>

      <MemberDialog
        member={selectedMember}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <EditMemberDialog
        member={selectedMember}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <MessageMemberDialog
        member={selectedMember}
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}
      />
    </AdminLayout>
  );
};

export default MembersPage;
