
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
import { Eye, EyeOff, MoreHorizontal, MessageSquare, UserCog, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMembersStore } from "@/stores/members-store";
import type { ColumnDef } from "@tanstack/react-table";
import type { Member, NotificationPreference } from "@/stores/members-store";
import { MemberDialog } from "@/components/member-dialog";
import { MessageMemberDialog } from "@/components/message-member-dialog";
import { EditMemberDialog } from "@/components/edit-member-dialog";
import { format } from "date-fns";

const MembersPage = () => {
  const { members, toggleRole } = useMembersStore();
  const [hiddenEmails, setHiddenEmails] = useState<Record<string, boolean>>({});
  const [hiddenPhones, setHiddenPhones] = useState<Record<string, boolean>>({});
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  const columns: ColumnDef<Member>[] = [
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
    {
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
    },
  ];

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

        {members.length === 0 ? (
          <EmptyState />
        ) : (
          <DataTable
            columns={columns}
            data={members}
          />
        )}
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
