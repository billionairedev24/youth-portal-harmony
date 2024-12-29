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
import { Eye, MoreHorizontal, Pencil, XSquare, VoteIcon, Plus, Trash } from "lucide-react";
import { PollDetailsDialog } from "@/components/poll-details-dialog";
import { EditPollDialog } from "@/components/edit-poll-dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePollsStore } from "@/stores/polls-store";

const PollsPage = () => {
  const { polls, updatePoll, addPoll, deletePoll } = usePollsStore();
  const { toast } = useToast();
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePoll = () => {
    setSelectedPoll(null);
    setIsCreating(true);
    setEditDialogOpen(true);
  };

  const handleEdit = (poll: any) => {
    setSelectedPoll(poll.id);
    setEditDialogOpen(true);
  };

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

  const handleSaveEdit = async (updatedPoll: any) => {
    if (isCreating) {
      const newPoll = {
        ...updatedPoll,
        id: Math.random().toString(),
        status: "draft",
        votes: [],
      };
      addPoll(newPoll);
      toast({
        title: "Poll created",
        description: "The poll has been successfully created.",
      });
    } else {
      await updatePoll(updatedPoll.id, updatedPoll);
      toast({
        title: "Poll updated",
        description: "The poll has been successfully updated.",
      });
    }
    setIsCreating(false);
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
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  deletePoll(poll.id);
                  toast({
                    title: "Poll deleted",
                    description: "The poll has been permanently deleted.",
                  });
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-secondary/20 rounded-lg border-2 border-dashed border-secondary">
      <VoteIcon className="h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">No Polls Found</h3>
      <p className="text-sm text-muted-foreground max-w-sm text-center">
        There are no polls available at the moment. Create a new poll to start gathering feedback from your community.
      </p>
      <Button onClick={handleCreatePoll} variant="outline" className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Create your first poll
      </Button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Polls</h1>
            <p className="text-muted-foreground">Manage your polls</p>
          </div>
          {polls.length > 0 && (
            <Button onClick={handleCreatePoll} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Poll
            </Button>
          )}
        </div>

        {polls.length === 0 ? (
          <EmptyState />
        ) : (
          <DataTable columns={columns} data={polls} />
        )}

        <PollDetailsDialog
          pollId={selectedPoll}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />

        <EditPollDialog
          poll={isCreating ? {
            id: "",
            title: "",
            startDate: "",
            endDate: "",
            options: [""],
            status: "draft",
            votes: []
          } : polls.find(p => p.id === selectedPoll) || null}
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setIsCreating(false);
          }}
          onSave={handleSaveEdit}
        />
      </div>
    </AdminLayout>
  );
};

export default PollsPage;