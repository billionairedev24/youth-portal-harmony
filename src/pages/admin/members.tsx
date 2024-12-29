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
import { Eye, EyeOff, MoreHorizontal, MessageSquare, UserCog } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMembersStore } from "@/stores/members-store";
import type { ColumnDef } from "@tanstack/react-table";
import type { Member } from "@/stores/members-store";

const MembersPage = () => {
  const { members, toggleRole } = useMembersStore();
  const { toast } = useToast();
  const [hiddenEmails, setHiddenEmails] = useState<Record<string, boolean>>({});
  const [hiddenPhones, setHiddenPhones] = useState<Record<string, boolean>>({});

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
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const member = row.original;
        const isHidden = hiddenEmails[member.id];
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
      cell: ({ row }) => {
        const member = row.original;
        const isHidden = hiddenPhones[member.id];
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
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "notificationPreference",
      header: "Notification Preference",
      cell: ({ row }) => {
        const preference = row.getValue("notificationPreference");
        return (
          <span className="capitalize">{preference}</span>
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
                  // View member functionality to be implemented
                  toast({
                    title: "View member",
                    description: "This functionality will be implemented soon.",
                  });
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View member
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // Message member functionality to be implemented
                  toast({
                    title: "Message member",
                    description: "This functionality will be implemented soon.",
                  });
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message member
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toggleRole(member.id);
                  toast({
                    title: "Role updated",
                    description: `${member.firstName} ${member.lastName} is now a ${member.role === "admin" ? "member" : "admin"}.`,
                  });
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
    </AdminLayout>
  );
};

export default MembersPage;