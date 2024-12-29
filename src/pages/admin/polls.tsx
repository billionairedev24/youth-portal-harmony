import { AdminLayout } from "@/components/admin-layout";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreHorizontal, Pencil, XSquare } from "lucide-react";
import { PollDetailsDialog } from "@/components/poll-details-dialog";
import { EditPollDialog } from "@/components/edit-poll-dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePollsStore } from "@/stores/polls-store";

const PollsPage = () => {
  const { polls, updatePoll } = usePollsStore();
  const { toast } = useToast();
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "closed":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const handleEdit = (poll: any) => {
    setSelectedPoll(poll.id);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedPoll: any) => {
    updatePoll(updatedPoll.id, updatedPoll);
    toast({
      title: "Poll updated",
      description: "The poll has been successfully updated.",
    });
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
    },
    {
      accessorKey: "endDate",
      header: "End Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.getValue("status"))}>
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const poll = row.original;

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
                  setSelectedPoll(poll.id);
                  setDetailsOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(poll)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  updatePoll(poll.id, {
                    status: poll.status === "active" ? "closed" : "active",
                  });
                  toast({
                    title: `Poll ${
                      poll.status === "active" ? "closed" : "activated"
                    }`,
                    description: `The poll has been ${
                      poll.status === "active" ? "closed" : "activated"
                    }.`,
                  });
                }}
              >
                <XSquare className="mr-2 h-4 w-4" />
                {poll.status === "active" ? "Close" : "Activate"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const selectedPollData = polls.find((p) => p.id === selectedPoll) || null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Polls</h1>
          <p className="text-muted-foreground">Manage your polls</p>
        </div>

        <DataTable columns={columns} data={polls} />

        <PollDetailsDialog
          pollId={selectedPoll}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />

        <EditPollDialog
          poll={selectedPollData}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveEdit}
        />
      </div>
    </AdminLayout>
  );
};

export default PollsPage;